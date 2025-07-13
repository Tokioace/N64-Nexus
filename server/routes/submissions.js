const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { createWorker } = require('tesseract.js');
const Submission = require('../models/Submission');
const Event = require('../models/Event');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `submission-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Submit time with screenshot
router.post('/', auth, upload.single('screenshot'), async (req, res) => {
  try {
    const { eventId, time, timeString, region, notes, isAnonymous } = req.body;
    
    // Validate event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event is active
    const now = new Date();
    if (event.startTime > now || event.endTime < now) {
      return res.status(400).json({ message: 'Event is not currently active' });
    }

    // Check if user is participating
    const isParticipating = event.participants.some(
      p => p.user.toString() === req.user._id.toString()
    );
    if (!isParticipating) {
      return res.status(400).json({ message: 'You must join the event first' });
    }

    // Check submission limit
    const existingSubmissions = await Submission.countDocuments({
      event: eventId,
      user: req.user._id
    });
    if (existingSubmissions >= event.maxSubmissions) {
      return res.status(400).json({ message: 'Maximum submissions reached for this event' });
    }

    // Validate screenshot requirement
    if (event.screenshotRequired && !req.file) {
      return res.status(400).json({ message: 'Screenshot is required for this event' });
    }

    // Parse time
    let timeInMs;
    if (timeString) {
      timeInMs = Submission.parseTime(timeString);
      if (!timeInMs) {
        return res.status(400).json({ message: 'Invalid time format. Use MM:SS.mmm' });
      }
    } else if (time) {
      timeInMs = parseInt(time);
    } else {
      return res.status(400).json({ message: 'Time is required' });
    }

    // Process screenshot if provided
    let screenshotData = null;
    let ocrResult = null;

    if (req.file) {
      // Optimize image
      const optimizedPath = req.file.path.replace(/\.[^/.]+$/, '_optimized.jpg');
      await sharp(req.file.path)
        .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(optimizedPath);

      screenshotData = {
        filename: path.basename(optimizedPath),
        path: optimizedPath,
        uploadedAt: new Date()
      };

      // OCR processing (optional)
      try {
        const worker = await createWorker();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        
        const { data: { text } } = await worker.recognize(optimizedPath);
        await worker.terminate();

        // Try to extract time from OCR text
        const timeMatch = text.match(/(\d{1,2}):(\d{2})\.(\d{2,3})/);
        if (timeMatch) {
          const minutes = parseInt(timeMatch[1]);
          const seconds = parseInt(timeMatch[2]);
          const ms = parseInt(timeMatch[3].padEnd(3, '0'));
          const ocrTime = minutes * 60000 + seconds * 1000 + ms;
          
          ocrResult = {
            detectedTime: `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`,
            confidence: 0.8, // Placeholder confidence
            processed: true
          };

          // If OCR time is significantly different, flag for review
          if (Math.abs(ocrTime - timeInMs) > 5000) { // 5 second difference
            ocrResult.confidence = 0.3;
          }
        }
      } catch (ocrError) {
        console.error('OCR processing failed:', ocrError);
        // Continue without OCR
      }
    }

    // Create submission
    const submission = new Submission({
      event: eventId,
      user: req.user._id,
      time: timeInMs,
      timeString: Submission.formatTime(timeInMs),
      screenshot: screenshotData,
      ocrResult,
      region: region || req.user.region,
      notes: notes?.trim(),
      isAnonymous: isAnonymous || false,
      verificationData: {
        deviceInfo: req.headers['user-agent'],
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    });

    await submission.save();

    // Add to event submissions
    event.submissions.push(submission._id);
    await event.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`event-${eventId}`).emit('new-submission', {
      submission: {
        id: submission._id,
        time: submission.timeString,
        user: {
          id: req.user._id,
          username: req.user.username,
          profilePicture: req.user.profilePicture
        },
        region: submission.region
      }
    });

    res.status(201).json({
      message: 'Submission created successfully',
      submission: {
        id: submission._id,
        time: submission.timeString,
        status: submission.status,
        region: submission.region
      }
    });
  } catch (error) {
    console.error('Create submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's submissions for an event
router.get('/event/:eventId', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({
      event: req.params.eventId,
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get submission details
router.get('/:id', auth, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('user', 'username profilePicture')
      .populate('event', 'title game');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check if user can view this submission
    if (submission.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update submission (user can only update notes)
router.put('/:id', auth, async (req, res) => {
  try {
    const { notes } = req.body;
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Only allow user to update their own submission
    if (submission.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only allow updates if submission is pending
    if (submission.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot update approved/rejected submission' });
    }

    submission.notes = notes?.trim();
    await submission.save();

    res.json({ message: 'Submission updated successfully', submission });
  } catch (error) {
    console.error('Update submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete submission
router.delete('/:id', auth, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Only allow user to delete their own submission
    if (submission.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only allow deletion if submission is pending
    if (submission.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot delete approved/rejected submission' });
    }

    // Delete screenshot file if exists
    if (submission.screenshot?.path && fs.existsSync(submission.screenshot.path)) {
      fs.unlinkSync(submission.screenshot.path);
    }

    await submission.remove();

    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Delete submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Approve submission
router.post('/:id/approve', adminAuth, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('event')
      .populate('user');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    await submission.approve(req.user._id);

    // Update event leaderboard
    await submission.event.updateLeaderboard();

    // Award points to user
    const position = submission.event.leaderboard.find(
      entry => entry.user.toString() === submission.user._id.toString()
    )?.position || 0;

    const points = submission.event.calculatePoints(position);
    await submission.user.addPoints(points);

    // Update submission with points
    submission.points = points;
    submission.position = position;
    await submission.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`event-${submission.event._id}`).emit('submission-approved', {
      submissionId: submission._id,
      user: {
        id: submission.user._id,
        username: submission.user.username
      },
      time: submission.timeString,
      position,
      points
    });

    res.json({ message: 'Submission approved', submission });
  } catch (error) {
    console.error('Approve submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Reject submission
router.post('/:id/reject', adminAuth, async (req, res) => {
  try {
    const { notes } = req.body;
    const submission = await Submission.findById(req.params.id)
      .populate('event');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    await submission.reject(req.user._id, notes);

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`event-${submission.event._id}`).emit('submission-rejected', {
      submissionId: submission._id,
      notes
    });

    res.json({ message: 'Submission rejected', submission });
  } catch (error) {
    console.error('Reject submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
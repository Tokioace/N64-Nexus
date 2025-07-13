const express = require('express');
const Event = require('../models/Event');
const Submission = require('../models/Submission');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all events with filtering
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { status, region, game, page = 1, limit = 10 } = req.query;
    const query = {};

    // Filter by status
    if (status) {
      if (status === 'active') {
        query.$and = [
          { startTime: { $lte: new Date() } },
          { endTime: { $gte: new Date() } }
        ];
      } else if (status === 'upcoming') {
        query.startTime = { $gt: new Date() };
      } else if (status === 'completed') {
        query.endTime = { $lt: new Date() };
      }
    }

    // Filter by region
    if (region && region !== 'Both') {
      query.$or = [
        { region: 'Both' },
        { region: region }
      ];
    }

    // Filter by game
    if (game) {
      query['game.name'] = { $regex: game, $options: 'i' };
    }

    const events = await Event.find(query)
      .populate('createdBy', 'username profilePicture')
      .populate('participants.user', 'username profilePicture')
      .sort({ startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Add virtual properties
    const now = new Date();
    const eventsWithVirtuals = events.map(event => ({
      ...event,
      isActive: event.startTime <= now && event.endTime >= now,
      isUpcoming: event.startTime > now,
      isCompleted: event.endTime < now,
      participantsCount: event.participants.length
    }));

    const total = await Event.countDocuments(query);

    res.json({
      events: eventsWithVirtuals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single event with details
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'username profilePicture')
      .populate('participants.user', 'username profilePicture region')
      .populate('leaderboard.user', 'username profilePicture')
      .populate('chatMessages.user', 'username profilePicture');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Add virtual properties
    const now = new Date();
    const eventWithVirtuals = {
      ...event.toObject(),
      isActive: event.startTime <= now && event.endTime >= now,
      isUpcoming: event.startTime > now,
      isCompleted: event.endTime < now,
      participantsCount: event.participants.length
    };

    // Add user's participation status if authenticated
    if (req.user) {
      eventWithVirtuals.userParticipating = event.participants.some(
        p => p.user._id.toString() === req.user._id.toString()
      );
      
      // Get user's best submission
      const userSubmission = await Submission.findOne({
        event: event._id,
        user: req.user._id,
        status: 'approved'
      }).sort('time');
      
      if (userSubmission) {
        eventWithVirtuals.userBestTime = userSubmission.time;
        eventWithVirtuals.userBestTimeString = userSubmission.timeString;
      }
    }

    res.json(eventWithVirtuals);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join event
router.post('/:id/join', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event is active or upcoming
    const now = new Date();
    if (event.endTime < now) {
      return res.status(400).json({ message: 'Event has already ended' });
    }

    // Check if user is already participating
    const alreadyParticipating = event.participants.some(
      p => p.user.toString() === req.user._id.toString()
    );

    if (alreadyParticipating) {
      return res.status(400).json({ message: 'Already participating in this event' });
    }

    // Add user to participants
    event.participants.push({
      user: req.user._id,
      joinedAt: new Date()
    });

    await event.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`event-${event._id}`).emit('user-joined', {
      user: {
        id: req.user._id,
        username: req.user.username,
        profilePicture: req.user.profilePicture
      },
      participantsCount: event.participants.length
    });

    res.json({ message: 'Successfully joined event', event });
  } catch (error) {
    console.error('Join event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave event
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Remove user from participants
    event.participants = event.participants.filter(
      p => p.user.toString() !== req.user._id.toString()
    );

    await event.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`event-${event._id}`).emit('user-left', {
      userId: req.user._id,
      participantsCount: event.participants.length
    });

    res.json({ message: 'Successfully left event', event });
  } catch (error) {
    console.error('Leave event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get event leaderboard
router.get('/:id/leaderboard', async (req, res) => {
  try {
    const { region } = req.query;
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const leaderboard = await Submission.getEventLeaderboard(event._id, region);

    res.json(leaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add chat message
router.post('/:id/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.chatEnabled) {
      return res.status(400).json({ message: 'Chat is disabled for this event' });
    }

    // Add message to event
    event.chatMessages.push({
      user: req.user._id,
      message: message.trim(),
      timestamp: new Date()
    });

    await event.save();

    // Populate user info for the new message
    const newMessage = event.chatMessages[event.chatMessages.length - 1];
    await event.populate('chatMessages.user', 'username profilePicture');

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`event-${event._id}`).emit('new-chat-message', {
      message: newMessage,
      user: {
        id: req.user._id,
        username: req.user.username,
        profilePicture: req.user.profilePicture
      }
    });

    res.json({ message: 'Message sent successfully', chatMessage: newMessage });
  } catch (error) {
    console.error('Send chat message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get event chat messages
router.get('/:id/chat', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const event = await Event.findById(req.params.id)
      .populate('chatMessages.user', 'username profilePicture')
      .select('chatMessages');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const messages = event.chatMessages
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, parseInt(limit));

    res.json(messages.reverse());
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
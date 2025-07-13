const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const Submission = require('../models/Submission');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Create new event
router.post('/events', adminAuth, async (req, res) => {
  try {
    const {
      title,
      description,
      game,
      startTime,
      endTime,
      region,
      screenshotRequired,
      maxSubmissions,
      scoring,
      chatEnabled,
      tags
    } = req.body;

    const event = new Event({
      title,
      description,
      game,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      region,
      screenshotRequired: screenshotRequired !== false,
      maxSubmissions: maxSubmissions || 3,
      scoring: scoring || {
        points: {
          first: 100,
          second: 75,
          third: 50,
          participation: 10
        }
      },
      chatEnabled: chatEnabled !== false,
      tags: tags || [],
      createdBy: req.user._id
    });

    await event.save();

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event
router.put('/events/:id', adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updates = req.body;
    
    // Convert date strings to Date objects
    if (updates.startTime) updates.startTime = new Date(updates.startTime);
    if (updates.endTime) updates.endTime = new Date(updates.endTime);

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete event
router.delete('/events/:id', adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event has submissions
    const submissionCount = await Submission.countDocuments({ event: event._id });
    if (submissionCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete event with existing submissions' 
      });
    }

    await event.remove();

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all pending submissions
router.get('/submissions/pending', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const submissions = await Submission.find({ status: 'pending' })
      .populate('user', 'username profilePicture region')
      .populate('event', 'title game')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Submission.countDocuments({ status: 'pending' });

    res.json({
      submissions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get pending submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get submission statistics
router.get('/submissions/stats', adminAuth, async (req, res) => {
  try {
    const stats = await Submission.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalSubmissions = await Submission.countDocuments();
    const todaySubmissions = await Submission.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });

    res.json({
      statusBreakdown: stats,
      total: totalSubmissions,
      today: todaySubmissions
    });
  } catch (error) {
    console.error('Get submission stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user statistics
router.get('/users/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      lastActive: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });

    const topUsers = await User.find()
      .sort({ points: -1 })
      .limit(10)
      .select('username points level eventStats');

    res.json({
      total: totalUsers,
      active: activeUsers,
      newToday: newUsersToday,
      topUsers
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get event statistics
router.get('/events/stats', adminAuth, async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({
      $and: [
        { startTime: { $lte: new Date() } },
        { endTime: { $gte: new Date() } }
      ]
    });
    const upcomingEvents = await Event.countDocuments({
      startTime: { $gt: new Date() }
    });

    const popularEvents = await Event.aggregate([
      {
        $lookup: {
          from: 'submissions',
          localField: '_id',
          foreignField: 'event',
          as: 'submissions'
        }
      },
      {
        $project: {
          title: 1,
          participantsCount: { $size: '$participants' },
          submissionsCount: { $size: '$submissions' }
        }
      },
      {
        $sort: { submissionsCount: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.json({
      total: totalEvents,
      active: activeEvents,
      upcoming: upcomingEvents,
      popular: popularEvents
    });
  } catch (error) {
    console.error('Get event stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Manage user (promote/demote admin, ban, etc.)
router.put('/users/:id', adminAuth, async (req, res) => {
  try {
    const { isAdmin, isBanned } = req.body;
    const updates = {};

    if (typeof isAdmin === 'boolean') updates.isAdmin = isAdmin;
    if (typeof isBanned === 'boolean') updates.isBanned = isBanned;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get system overview
router.get('/overview', adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalEvents,
      totalSubmissions,
      pendingSubmissions,
      activeEvents
    ] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments(),
      Submission.countDocuments(),
      Submission.countDocuments({ status: 'pending' }),
      Event.countDocuments({
        $and: [
          { startTime: { $lte: new Date() } },
          { endTime: { $gte: new Date() } }
        ]
      })
    ]);

    res.json({
      users: totalUsers,
      events: totalEvents,
      submissions: totalSubmissions,
      pendingSubmissions,
      activeEvents
    });
  } catch (error) {
    console.error('Get overview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
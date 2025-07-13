const express = require('express');
const User = require('../models/User');
const Submission = require('../models/Submission');
const Event = require('../models/Event');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get user profile (public)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('username profilePicture region points level badges eventStats createdAt')
      .populate('badges');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's recent submissions
    const recentSubmissions = await Submission.find({ user: user._id })
      .populate('event', 'title game')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get user's achievements
    const achievements = await calculateUserAchievements(user._id);

    const publicProfile = {
      ...user.toObject(),
      recentSubmissions,
      achievements
    };

    res.json(publicProfile);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's submissions
router.get('/:id/submissions', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { user: req.params.id };

    if (status) {
      query.status = status;
    }

    const submissions = await Submission.find(query)
      .populate('event', 'title game')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Submission.countDocuments(query);

    res.json({
      submissions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's event participation
router.get('/:id/events', optionalAuth, async (req, res) => {
  try {
    const { status } = req.query;
    const query = { 'participants.user': req.params.id };

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

    const events = await Event.find(query)
      .populate('createdBy', 'username profilePicture')
      .sort({ startTime: -1 });

    // Add user's performance data
    const eventsWithPerformance = await Promise.all(
      events.map(async (event) => {
        const userSubmission = await Submission.findOne({
          event: event._id,
          user: req.params.id,
          status: 'approved'
        }).sort('time');

        return {
          ...event.toObject(),
          userBestTime: userSubmission?.time,
          userBestTimeString: userSubmission?.timeString,
          userPosition: userSubmission ? 
            await Submission.countDocuments({
              event: event._id,
              status: 'approved',
              time: { $lt: userSubmission.time }
            }) + 1 : null
        };
      })
    );

    res.json(eventsWithPerformance);
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user statistics
router.get('/:id/stats', optionalAuth, async (req, res) => {
  try {
    const userId = req.params.id;

    const [
      totalSubmissions,
      approvedSubmissions,
      totalEvents,
      bestTime,
      averageTime,
      regionStats,
      gameStats
    ] = await Promise.all([
      Submission.countDocuments({ user: userId }),
      Submission.countDocuments({ user: userId, status: 'approved' }),
      Event.countDocuments({ 'participants.user': userId }),
      Submission.findOne({ user: userId, status: 'approved' }).sort('time'),
      Submission.aggregate([
        { $match: { user: userId, status: 'approved' } },
        { $group: { _id: null, avgTime: { $avg: '$time' } } }
      ]),
      Submission.aggregate([
        { $match: { user: userId, status: 'approved' } },
        { $group: { _id: '$region', count: { $sum: 1 } } }
      ]),
      Submission.aggregate([
        { $match: { user: userId, status: 'approved' } },
        {
          $lookup: {
            from: 'events',
            localField: 'event',
            foreignField: '_id',
            as: 'eventData'
          }
        },
        { $unwind: '$eventData' },
        { $group: { _id: '$eventData.game.name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    const stats = {
      totalSubmissions,
      approvedSubmissions,
      totalEvents,
      bestTime: bestTime?.time,
      bestTimeString: bestTime?.timeString,
      averageTime: averageTime[0]?.avgTime || 0,
      averageTimeString: averageTime[0]?.avgTime ? 
        Submission.formatTime(averageTime[0].avgTime) : null,
      regionStats,
      gameStats,
      approvalRate: totalSubmissions > 0 ? 
        (approvedSubmissions / totalSubmissions * 100).toFixed(1) : 0
    };

    res.json(stats);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard
router.get('/leaderboard/global', async (req, res) => {
  try {
    const { region, page = 1, limit = 20 } = req.query;
    const query = {};

    if (region && region !== 'Both') {
      query.region = region;
    }

    const users = await User.find(query)
      .select('username profilePicture region points level eventStats')
      .sort({ points: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search users
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 10 } = req.query;

    const users = await User.find({
      username: { $regex: query, $options: 'i' }
    })
      .select('username profilePicture region points level')
      .limit(parseInt(limit));

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate user achievements
async function calculateUserAchievements(userId) {
  const achievements = [];

  // Check for participation milestones
  const totalEvents = await Event.countDocuments({ 'participants.user': userId });
  if (totalEvents >= 5) achievements.push({ name: 'Event Veteran', description: 'Participated in 5 events' });
  if (totalEvents >= 10) achievements.push({ name: 'Event Master', description: 'Participated in 10 events' });
  if (totalEvents >= 25) achievements.push({ name: 'Event Legend', description: 'Participated in 25 events' });

  // Check for win milestones
  const wins = await Submission.countDocuments({
    user: userId,
    status: 'approved',
    position: 1
  });
  if (wins >= 1) achievements.push({ name: 'First Victory', description: 'Won your first event' });
  if (wins >= 5) achievements.push({ name: 'Champion', description: 'Won 5 events' });
  if (wins >= 10) achievements.push({ name: 'Legendary Champion', description: 'Won 10 events' });

  // Check for podium finishes
  const podiums = await Submission.countDocuments({
    user: userId,
    status: 'approved',
    position: { $lte: 3 }
  });
  if (podiums >= 10) achievements.push({ name: 'Podium Regular', description: 'Finished on podium 10 times' });

  // Check for consecutive participation
  const recentEvents = await Event.find({ 'participants.user': userId })
    .sort({ startTime: -1 })
    .limit(5);
  
  if (recentEvents.length >= 5) {
    const consecutive = recentEvents.every((event, index) => {
      if (index === 0) return true;
      const daysDiff = (recentEvents[index - 1].startTime - event.startTime) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7; // Within a week
    });
    
    if (consecutive) {
      achievements.push({ name: 'Consistent Player', description: 'Participated in 5 consecutive weekly events' });
    }
  }

  return achievements;
}

module.exports = router;
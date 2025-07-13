const express = require('express');
const router = express.Router();
const AchievementService = require('../services/AchievementService');
const User = require('../models/User');
const Achievement = require('../models/Achievement');
const Game = require('../models/Game');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/achievements
 * @desc    Get all achievements
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { category, rarity } = req.query;
    let achievements;

    if (category) {
      achievements = await Achievement.getByCategory(category);
    } else if (rarity) {
      achievements = await Achievement.find({ rarity, isActive: true }).sort({ name: 1 });
    } else {
      achievements = await Achievement.getAllAchievements();
    }

    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * @route   GET /api/achievements/rare
 * @desc    Get rare achievements
 * @access  Public
 */
router.get('/rare', async (req, res) => {
  try {
    const achievements = await Achievement.getRareAchievements();
    
    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    console.error('Error fetching rare achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * @route   GET /api/achievements/progress/:userId
 * @desc    Get user's achievement progress
 * @access  Private
 */
router.get('/progress/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is requesting their own progress or if they're friends
    if (req.user.id !== userId) {
      const user = await User.findById(userId);
      if (!user || !user.friends.includes(req.user.id)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    const progress = await AchievementService.getAchievementProgress(userId);
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error fetching achievement progress:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * @route   GET /api/achievements/user/:userId
 * @desc    Get user's unlocked achievements
 * @access  Private
 */
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('achievements.badges profile.username');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check privacy settings
    if (req.user.id !== userId) {
      const fullUser = await User.findById(userId);
      if (!fullUser.settings.privacy.showAchievements) {
        return res.status(403).json({
          success: false,
          message: 'Achievements are private'
        });
      }
    }

    res.json({
      success: true,
      data: {
        username: user.profile.username,
        badges: user.achievements.badges
      }
    });
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * @route   POST /api/achievements/daily-login
 * @desc    Handle daily login reward
 * @access  Private
 */
router.post('/daily-login', auth, async (req, res) => {
  try {
    const result = await AchievementService.handleDailyLogin(req.user.id);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error handling daily login:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * @route   POST /api/achievements/add-game
 * @desc    Add game to collection
 * @access  Private
 */
router.post('/add-game', auth, async (req, res) => {
  try {
    const { gameId, condition = 'good' } = req.body;
    
    if (!gameId) {
      return res.status(400).json({
        success: false,
        message: 'Game ID is required'
      });
    }

    const result = await AchievementService.addGameToCollection(req.user.id, gameId, condition);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error adding game to collection:', error);
    
    if (error.message === 'Game already in collection') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * @route   POST /api/achievements/quiz-complete
 * @desc    Handle quiz completion
 * @access  Private
 */
router.post('/quiz-complete', auth, async (req, res) => {
  try {
    const { score, timeSeconds } = req.body;
    
    if (typeof score !== 'number' || score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        message: 'Valid score (0-100) is required'
      });
    }

    if (typeof timeSeconds !== 'number' || timeSeconds < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid time in seconds is required'
      });
    }

    const result = await AchievementService.handleQuizCompletion(req.user.id, score, timeSeconds);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error handling quiz completion:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * @route   GET /api/achievements/leaderboard
 * @desc    Get achievement leaderboard
 * @access  Public
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const { type = 'level', limit = 10 } = req.query;
    
    let sortField;
    switch (type) {
      case 'level':
        sortField = { 'ranking.level': -1, 'ranking.totalPoints': -1 };
        break;
      case 'achievements':
        sortField = { 'achievements.badges': -1 };
        break;
      case 'collection':
        sortField = { 'achievements.stats.gamesCollected': -1 };
        break;
      case 'points':
        sortField = { 'ranking.totalPoints': -1 };
        break;
      default:
        sortField = { 'ranking.level': -1, 'ranking.totalPoints': -1 };
    }

    const users = await User.find({ 'profile.isPublic': true })
      .select('username profile.displayName profile.avatar ranking achievements.stats')
      .sort(sortField)
      .limit(parseInt(limit));

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      displayName: user.profile.displayName || user.username,
      avatar: user.profile.avatar,
      level: user.ranking.level,
      totalPoints: user.ranking.totalPoints,
      currentTitle: user.ranking.currentTitle,
      achievementsCount: user.achievements.badges.length,
      gamesCollected: user.achievements.stats.gamesCollected
    }));

    res.json({
      success: true,
      data: {
        type,
        leaderboard
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * @route   GET /api/achievements/user/:userId/ranking
 * @desc    Get user's ranking information
 * @access  Private
 */
router.get('/user/:userId/ranking', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check privacy settings
    if (req.user.id !== userId) {
      if (!user.settings.privacy.showLevel) {
        return res.status(403).json({
          success: false,
          message: 'Level information is private'
        });
      }
    }

    // Get user's rank in leaderboard
    const userRank = await User.countDocuments({
      'ranking.level': { $gt: user.ranking.level }
    }) + await User.countDocuments({
      'ranking.level': user.ranking.level,
      'ranking.totalPoints': { $gt: user.ranking.totalPoints }
    }) + 1;

    const rankingData = {
      level: user.ranking.level,
      experience: user.ranking.experience,
      totalPoints: user.ranking.totalPoints,
      currentTitle: user.ranking.currentTitle,
      unlockedTitles: user.ranking.unlockedTitles,
      rank: user.ranking.rank,
      experienceToNext: user.experienceToNextLevel,
      levelProgress: user.levelProgress,
      globalRank: userRank,
      achievementsCount: user.achievements.badges.length,
      stats: user.achievements.stats
    };

    res.json({
      success: true,
      data: rankingData
    });
  } catch (error) {
    console.error('Error fetching user ranking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * @route   PUT /api/achievements/user/title
 * @desc    Change user's current title
 * @access  Private
 */
router.put('/user/title', auth, async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user.ranking.unlockedTitles.includes(title)) {
      return res.status(400).json({
        success: false,
        message: 'Title not unlocked'
      });
    }

    user.ranking.currentTitle = title;
    await user.save();

    res.json({
      success: true,
      data: {
        currentTitle: title,
        unlockedTitles: user.ranking.unlockedTitles
      }
    });
  } catch (error) {
    console.error('Error changing title:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * @route   GET /api/achievements/stats
 * @desc    Get global achievement statistics
 * @access  Public
 */
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalAchievements,
      averageLevel,
      mostUnlockedAchievement
    ] = await Promise.all([
      User.countDocuments(),
      Achievement.countDocuments({ isActive: true }),
      User.aggregate([
        { $group: { _id: null, avgLevel: { $avg: '$ranking.level' } } }
      ]),
      User.aggregate([
        { $unwind: '$achievements.badges' },
        { $group: { _id: '$achievements.badges.id', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ])
    ]);

    const stats = {
      totalUsers,
      totalAchievements,
      averageLevel: Math.round(averageLevel[0]?.avgLevel || 0),
      mostUnlockedAchievement: mostUnlockedAchievement[0] || null
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching achievement stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
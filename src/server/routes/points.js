/**
 * Points & Ranking Routes for Battle64 System
 * Routes for XP, medals, titles, and leaderboards
 */

const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const winston = require('winston');

const authMiddleware = require('../middleware/auth');
const validationMiddleware = require('../middleware/validation');
const { asyncHandler, NotFoundError } = require('../middleware/errorHandler');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

/**
 * Get Player Points & Stats
 * GET /api/points/player/:playerId
 */
router.get('/player/:playerId', 
  authMiddleware.verifyToken,
  validationMiddleware.validateParams(schemas.playerId),
  asyncHandler(async (req, res) => {
    const { playerId } = req.params;
    
    try {
      const pythonProcess = spawn('python', [
        'src/ai/process_submissions.py',
        '--player-stats',
        '--player-id', playerId
      ]);
      
      const result = await new Promise((resolve, reject) => {
        let output = '';
        let error = '';
        
        pythonProcess.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
          error += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
          if (code === 0) {
            try {
              const stats = JSON.parse(output);
              resolve(stats);
            } catch (parseError) {
              reject(new Error('Invalid player stats response'));
            }
          } else {
            reject(new Error(`Player stats retrieval failed: ${error}`));
          }
        });
      });
      
      res.json({
        success: true,
        data: result
      });
      
    } catch (error) {
      logger.error('Player stats retrieval failed:', error);
      throw new NotFoundError('Player not found or stats unavailable');
    }
  })
);

/**
 * Get Player Achievements
 * GET /api/points/player/:playerId/achievements
 */
router.get('/player/:playerId/achievements',
  authMiddleware.verifyToken,
  validationMiddleware.validateParams(schemas.playerId),
  asyncHandler(async (req, res) => {
    const { playerId } = req.params;
    
    try {
      const pythonProcess = spawn('python', [
        'src/ai/process_submissions.py',
        '--player-achievements',
        '--player-id', playerId
      ]);
      
      const result = await new Promise((resolve, reject) => {
        let output = '';
        let error = '';
        
        pythonProcess.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
          error += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
          if (code === 0) {
            try {
              const achievements = JSON.parse(output);
              resolve(achievements);
            } catch (parseError) {
              reject(new Error('Invalid achievements response'));
            }
          } else {
            reject(new Error(`Achievements retrieval failed: ${error}`));
          }
        });
      });
      
      res.json({
        success: true,
        data: result
      });
      
    } catch (error) {
      logger.error('Achievements retrieval failed:', error);
      throw new NotFoundError('Player achievements not found');
    }
  })
);

/**
 * Get Points Configuration
 * GET /api/points/config
 */
router.get('/config',
  authMiddleware.requireAdmin,
  asyncHandler(async (req, res) => {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const configPath = path.join(__dirname, '../../../data/points_config.json');
      
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        res.json({
          success: true,
          data: config
        });
      } else {
        // Return default configuration
        res.json({
          success: true,
          data: {
            xp_multipliers: {
              event_participation: 100,
              event_1st_place: 500,
              event_2nd_place: 300,
              event_3rd_place: 200,
              screenshot_upload: 50,
              fanart_creation: 200,
              comment: 10,
              like: 5,
              achievement_unlock: 150,
              daily_login: 25,
              weekly_streak: 100,
              community_challenge: 75
            },
            max_daily_xp: 1000,
            streak_bonus: 1.1,
            xp_decay_rate: 0.95
          }
        });
      }
      
    } catch (error) {
      logger.error('Points config retrieval failed:', error);
      throw new Error('Unable to retrieve points configuration');
    }
  })
);

/**
 * Update Points Configuration
 * PUT /api/points/config
 */
router.put('/config',
  authMiddleware.requireAdmin,
  validationMiddleware.validatePointsConfig,
  asyncHandler(async (req, res) => {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const configPath = path.join(__dirname, '../../../data/points_config.json');
      const configDir = path.dirname(configPath);
      
      // Ensure directory exists
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      
      // Save configuration
      fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2));
      
      res.json({
        success: true,
        data: {
          message: 'Points configuration updated successfully',
          config: req.body
        }
      });
      
      logger.info('Points configuration updated', {
        user_id: req.user.id,
        config: req.body
      });
      
    } catch (error) {
      logger.error('Points config update failed:', error);
      throw new Error('Failed to update points configuration');
    }
  })
);

/**
 * Award Points Manually
 * POST /api/points/award
 */
router.post('/award',
  authMiddleware.requireAdmin,
  validationMiddleware.validate(schemas.pointsAward),
  asyncHandler(async (req, res) => {
    const { player_id, activity_type, activity_data, reason } = req.body;
    
    try {
      const pythonProcess = spawn('python', [
        'src/ai/process_submissions.py',
        '--award-points',
        '--player-id', player_id,
        '--activity-type', activity_type,
        '--activity-data', JSON.stringify(activity_data),
        '--reason', reason || 'Manual award'
      ]);
      
      const result = await new Promise((resolve, reject) => {
        let output = '';
        let error = '';
        
        pythonProcess.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
          error += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
          if (code === 0) {
            try {
              const awardResult = JSON.parse(output);
              resolve(awardResult);
            } catch (parseError) {
              reject(new Error('Invalid award response'));
            }
          } else {
            reject(new Error(`Points award failed: ${error}`));
          }
        });
      });
      
      res.json({
        success: true,
        data: result,
        message: 'Points awarded successfully'
      });
      
      logger.info('Manual points award', {
        admin_id: req.user.id,
        player_id: player_id,
        activity_type: activity_type,
        xp_awarded: result.xp_earned,
        reason: reason
      });
      
    } catch (error) {
      logger.error('Points award failed:', error);
      throw new Error('Failed to award points');
    }
  })
);

/**
 * Get Points History
 * GET /api/points/player/:playerId/history
 */
router.get('/player/:playerId/history',
  authMiddleware.verifyToken,
  validationMiddleware.validateParams(schemas.playerId),
  validationMiddleware.validateQuery(schemas.historyQuery),
  asyncHandler(async (req, res) => {
    const { playerId } = req.params;
    const { limit = 50, offset = 0, activity_type } = req.query;
    
    try {
      const pythonProcess = spawn('python', [
        'src/ai/process_submissions.py',
        '--points-history',
        '--player-id', playerId,
        '--limit', limit.toString(),
        '--offset', offset.toString(),
        '--activity-type', activity_type || 'all'
      ]);
      
      const result = await new Promise((resolve, reject) => {
        let output = '';
        let error = '';
        
        pythonProcess.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
          error += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
          if (code === 0) {
            try {
              const history = JSON.parse(output);
              resolve(history);
            } catch (parseError) {
              reject(new Error('Invalid history response'));
            }
          } else {
            reject(new Error(`History retrieval failed: ${error}`));
          }
        });
      });
      
      res.json({
        success: true,
        data: result
      });
      
    } catch (error) {
      logger.error('Points history retrieval failed:', error);
      throw new NotFoundError('Player history not found');
    }
  })
);

/**
 * Get Available Medals
 * GET /api/points/medals
 */
router.get('/medals',
  asyncHandler(async (req, res) => {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const medalsPath = path.join(__dirname, '../../../data/medals.json');
      
      if (fs.existsSync(medalsPath)) {
        const medals = JSON.parse(fs.readFileSync(medalsPath, 'utf8'));
        res.json({
          success: true,
          data: medals
        });
      } else {
        // Return default medals
        res.json({
          success: true,
          data: {
            gold: { name: '🥇 Gold Medal', xp_bonus: 1000, requirement: '1st place' },
            silver: { name: '🥈 Silver Medal', xp_bonus: 600, requirement: '2nd place' },
            bronze: { name: '🥉 Bronze Medal', xp_bonus: 400, requirement: '3rd place' },
            participation: { name: '🎯 Participation', xp_bonus: 50, requirement: 'Event completion' },
            speed_demon: { name: '⚡ Speed Demon', xp_bonus: 800, requirement: 'Top 10% time' },
            persistent: { name: '🔄 Persistent', xp_bonus: 300, requirement: '5 events in a row' },
            creative: { name: '🎨 Creative', xp_bonus: 500, requirement: '3 fanart pieces' },
            social: { name: '💬 Social Butterfly', xp_bonus: 200, requirement: '50 comments' }
          }
        });
      }
      
    } catch (error) {
      logger.error('Medals retrieval failed:', error);
      throw new Error('Unable to retrieve medals');
    }
  })
);

/**
 * Get Available Titles
 * GET /api/points/titles
 */
router.get('/titles',
  asyncHandler(async (req, res) => {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const titlesPath = path.join(__dirname, '../../../data/titles.json');
      
      if (fs.existsSync(titlesPath)) {
        const titles = JSON.parse(fs.readFileSync(titlesPath, 'utf8'));
        res.json({
          success: true,
          data: titles
        });
      } else {
        // Return default titles
        res.json({
          success: true,
          data: {
            pixelkünstler: { name: 'Pixelkünstler', requirement: '3x Artwork of the Week' },
            speedrunner: { name: 'Speedrunner', requirement: '10 top 10 finishes' },
            collector: { name: 'Collector', requirement: '100 achievements' },
            veteran: { name: 'Veteran', requirement: '1 year membership' },
            champion: { name: 'Champion', requirement: '5 event wins' },
            community_leader: { name: 'Community Leader', requirement: '1000 likes received' },
            explorer: { name: 'Explorer', requirement: '50 different games played' },
            perfectionist: { name: 'Perfectionist', requirement: '10 100% completions' }
          }
        });
      }
      
    } catch (error) {
      logger.error('Titles retrieval failed:', error);
      throw new Error('Unable to retrieve titles');
    }
  })
);

/**
 * Get Rank Definitions
 * GET /api/points/ranks
 */
router.get('/ranks',
  asyncHandler(async (req, res) => {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const ranksPath = path.join(__dirname, '../../../data/ranks.json');
      
      if (fs.existsSync(ranksPath)) {
        const ranks = JSON.parse(fs.readFileSync(ranksPath, 'utf8'));
        res.json({
          success: true,
          data: ranks
        });
      } else {
        // Return default ranks
        res.json({
          success: true,
          data: [
            { name: 'Rookie', min_xp: 0, color: '#8B4513' },
            { name: 'Amateur', min_xp: 1000, color: '#C0C0C0' },
            { name: 'Enthusiast', min_xp: 2500, color: '#CD7F32' },
            { name: 'Veteran', min_xp: 5000, color: '#FFD700' },
            { name: 'Expert', min_xp: 10000, color: '#C0C0C0' },
            { name: 'Master', min_xp: 20000, color: '#FFD700' },
            { name: 'Legend', min_xp: 50000, color: '#FF4500' },
            { name: 'Mythic', min_xp: 100000, color: '#9400D3' }
          ]
        });
      }
      
    } catch (error) {
      logger.error('Ranks retrieval failed:', error);
      throw new Error('Unable to retrieve ranks');
    }
  })
);

// Validation schemas
const schemas = {
  playerId: Joi.object({
    playerId: Joi.string().required().min(1).max(100)
  }),
  
  historyQuery: Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(50),
    offset: Joi.number().integer().min(0).default(0),
    activity_type: Joi.string().optional()
  }),
  
  pointsAward: Joi.object({
    player_id: Joi.string().required().min(1).max(100),
    activity_type: Joi.string().required().valid(
      'event_participation', 'screenshot_upload', 'fanart_creation', 
      'comment', 'like', 'achievement_unlock', 'daily_login', 
      'weekly_streak', 'community_challenge'
    ),
    activity_data: Joi.object().required(),
    reason: Joi.string().optional().max(500)
  })
};

module.exports = router;
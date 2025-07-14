/**
 * Player Routes for Battle64 System
 * Routes for player profiles, analysis, and statistics
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
 * Get Player Profile
 * GET /api/players/:playerId
 */
router.get('/:playerId',
  authMiddleware.verifyToken,
  validationMiddleware.validateParams(schemas.playerId),
  asyncHandler(async (req, res) => {
    const { playerId } = req.params;
    const { time_period = '30d' } = req.query;
    
    try {
      const pythonProcess = spawn('python', [
        'src/ai/process_submissions.py',
        '--player-profile',
        '--player-id', playerId,
        '--time-period', time_period
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
              const profile = JSON.parse(output);
              resolve(profile);
            } catch (parseError) {
              reject(new Error('Invalid profile response'));
            }
          } else {
            reject(new Error(`Profile retrieval failed: ${error}`));
          }
        });
      });
      
      res.json({
        success: true,
        data: result
      });
      
    } catch (error) {
      logger.error('Player profile retrieval failed:', error);
      throw new NotFoundError('Player profile not found');
    }
  })
);

/**
 * Get Similar Players
 * GET /api/players/:playerId/similar
 */
router.get('/:playerId/similar',
  authMiddleware.verifyToken,
  validationMiddleware.validateParams(schemas.playerId),
  validationMiddleware.validateQuery(schemas.similarPlayersQuery),
  asyncHandler(async (req, res) => {
    const { playerId } = req.params;
    const { limit = 5 } = req.query;
    
    try {
      const pythonProcess = spawn('python', [
        'src/ai/process_submissions.py',
        '--similar-players',
        '--player-id', playerId,
        '--limit', limit.toString()
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
              const similarPlayers = JSON.parse(output);
              resolve(similarPlayers);
            } catch (parseError) {
              reject(new Error('Invalid similar players response'));
            }
          } else {
            reject(new Error(`Similar players retrieval failed: ${error}`));
          }
        });
      });
      
      res.json({
        success: true,
        data: result
      });
      
    } catch (error) {
      logger.error('Similar players retrieval failed:', error);
      throw new NotFoundError('Similar players not found');
    }
  })
);

/**
 * Get Player Activity Timeline
 * GET /api/players/:playerId/timeline
 */
router.get('/:playerId/timeline',
  authMiddleware.verifyToken,
  validationMiddleware.validateParams(schemas.playerId),
  validationMiddleware.validateQuery(schemas.timelineQuery),
  asyncHandler(async (req, res) => {
    const { playerId } = req.params;
    const { days = 30, activity_type } = req.query;
    
    try {
      const pythonProcess = spawn('python', [
        'src/ai/process_submissions.py',
        '--player-timeline',
        '--player-id', playerId,
        '--days', days.toString(),
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
              const timeline = JSON.parse(output);
              resolve(timeline);
            } catch (parseError) {
              reject(new Error('Invalid timeline response'));
            }
          } else {
            reject(new Error(`Timeline retrieval failed: ${error}`));
          }
        });
      });
      
      res.json({
        success: true,
        data: result
      });
      
    } catch (error) {
      logger.error('Player timeline retrieval failed:', error);
      throw new NotFoundError('Player timeline not found');
    }
  })
);

/**
 * Get Player Statistics
 * GET /api/players/:playerId/stats
 */
router.get('/:playerId/stats',
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
              reject(new Error('Invalid stats response'));
            }
          } else {
            reject(new Error(`Stats retrieval failed: ${error}`));
          }
        });
      });
      
      res.json({
        success: true,
        data: result
      });
      
    } catch (error) {
      logger.error('Player stats retrieval failed:', error);
      throw new NotFoundError('Player statistics not found');
    }
  })
);

/**
 * Get Player Recommendations
 * GET /api/players/:playerId/recommendations
 */
router.get('/:playerId/recommendations',
  authMiddleware.verifyToken,
  validationMiddleware.validateParams(schemas.playerId),
  asyncHandler(async (req, res) => {
    const { playerId } = req.params;
    
    try {
      const pythonProcess = spawn('python', [
        'src/ai/process_submissions.py',
        '--player-recommendations',
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
              const recommendations = JSON.parse(output);
              resolve(recommendations);
            } catch (parseError) {
              reject(new Error('Invalid recommendations response'));
            }
          } else {
            reject(new Error(`Recommendations retrieval failed: ${error}`));
          }
        });
      });
      
      res.json({
        success: true,
        data: result
      });
      
    } catch (error) {
      logger.error('Player recommendations retrieval failed:', error);
      throw new NotFoundError('Player recommendations not found');
    }
  })
);

/**
 * Get Player Activity Summary
 * GET /api/players/:playerId/activity-summary
 */
router.get('/:playerId/activity-summary',
  authMiddleware.verifyToken,
  validationMiddleware.validateParams(schemas.playerId),
  validationMiddleware.validateQuery(schemas.activitySummaryQuery),
  asyncHandler(async (req, res) => {
    const { playerId } = req.params;
    const { period = '30d' } = req.query;
    
    try {
      const pythonProcess = spawn('python', [
        'src/ai/process_submissions.py',
        '--activity-summary',
        '--player-id', playerId,
        '--period', period
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
              const summary = JSON.parse(output);
              resolve(summary);
            } catch (parseError) {
              reject(new Error('Invalid activity summary response'));
            }
          } else {
            reject(new Error(`Activity summary retrieval failed: ${error}`));
          }
        });
      });
      
      res.json({
        success: true,
        data: result
      });
      
    } catch (error) {
      logger.error('Activity summary retrieval failed:', error);
      throw new NotFoundError('Activity summary not found');
    }
  })
);

/**
 * Get Player Comparison
 * GET /api/players/compare
 */
router.get('/compare',
  authMiddleware.verifyToken,
  validationMiddleware.validateQuery(schemas.playerComparisonQuery),
  asyncHandler(async (req, res) => {
    const { player_ids } = req.query;
    
    if (!player_ids || !Array.isArray(player_ids) || player_ids.length < 2) {
      return res.status(400).json({
        error: 'INVALID_REQUEST',
        message: 'At least 2 player IDs are required for comparison'
      });
    }
    
    try {
      const pythonProcess = spawn('python', [
        'src/ai/process_submissions.py',
        '--player-comparison',
        '--player-ids', JSON.stringify(player_ids)
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
              const comparison = JSON.parse(output);
              resolve(comparison);
            } catch (parseError) {
              reject(new Error('Invalid comparison response'));
            }
          } else {
            reject(new Error(`Player comparison failed: ${error}`));
          }
        });
      });
      
      res.json({
        success: true,
        data: result
      });
      
    } catch (error) {
      logger.error('Player comparison failed:', error);
      throw new Error('Failed to compare players');
    }
  })
);

/**
 * Get Player Search
 * GET /api/players/search
 */
router.get('/search',
  authMiddleware.verifyToken,
  validationMiddleware.validateQuery(schemas.playerSearchQuery),
  asyncHandler(async (req, res) => {
    const { query, player_type, min_xp, max_xp, limit = 20 } = req.query;
    
    try {
      const pythonProcess = spawn('python', [
        'src/ai/process_submissions.py',
        '--player-search',
        '--query', query || '',
        '--player-type', player_type || 'all',
        '--min-xp', min_xp || '0',
        '--max-xp', max_xp || '999999',
        '--limit', limit.toString()
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
              const searchResults = JSON.parse(output);
              resolve(searchResults);
            } catch (parseError) {
              reject(new Error('Invalid search response'));
            }
          } else {
            reject(new Error(`Player search failed: ${error}`));
          }
        });
      });
      
      res.json({
        success: true,
        data: result
      });
      
    } catch (error) {
      logger.error('Player search failed:', error);
      throw new Error('Failed to search players');
    }
  })
);

// Validation schemas
const schemas = {
  playerId: Joi.object({
    playerId: Joi.string().required().min(1).max(100)
  }),
  
  similarPlayersQuery: Joi.object({
    limit: Joi.number().integer().min(1).max(20).default(5)
  }),
  
  timelineQuery: Joi.object({
    days: Joi.number().integer().min(1).max(365).default(30),
    activity_type: Joi.string().optional()
  }),
  
  activitySummaryQuery: Joi.object({
    period: Joi.string().valid('7d', '30d', '90d', 'all').default('30d')
  }),
  
  playerComparisonQuery: Joi.object({
    player_ids: Joi.array().items(Joi.string()).min(2).max(5).required()
  }),
  
  playerSearchQuery: Joi.object({
    query: Joi.string().optional().max(100),
    player_type: Joi.string().valid('speedrunner', 'collector', 'artist', 'casual', 'competitive', 'all').default('all'),
    min_xp: Joi.number().integer().min(0).default(0),
    max_xp: Joi.number().integer().min(0).default(999999),
    limit: Joi.number().integer().min(1).max(100).default(20)
  })
};

module.exports = router;
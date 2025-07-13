/**
 * AI Routes for Battle64 System
 * Routes for AI-powered features and processing
 */

const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const winston = require('winston');

const authMiddleware = require('../middleware/auth');
const validationMiddleware = require('../middleware/validation');
const { asyncHandler, AIProcessingError } = require('../middleware/errorHandler');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

/**
 * AI System Status
 * GET /api/ai/status
 */
router.get('/status', asyncHandler(async (req, res) => {
  try {
    // Check if Python AI system is available
    const pythonProcess = spawn('python', ['--version']);
    
    return new Promise((resolve, reject) => {
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
          resolve({
            status: 'operational',
            python_version: output.trim(),
            ai_components: {
              screenshot_verification: 'available',
              anomaly_detection: 'available',
              content_moderation: 'available',
              player_analysis: 'available'
            },
            timestamp: new Date().toISOString()
          });
        } else {
          reject(new AIProcessingError('Python environment not available'));
        }
      });
    });
    
  } catch (error) {
    logger.error('AI status check failed:', error);
    throw new AIProcessingError('Unable to check AI system status');
  }
}));

/**
 * Batch Process Submissions
 * POST /api/ai/batch-process
 */
router.post('/batch-process', 
  authMiddleware.requireAdmin,
  validationMiddleware.validate(schemas.batchProcess),
  asyncHandler(async (req, res) => {
    const { submissions, type } = req.body;
    
    const results = [];
    
    for (const submission of submissions) {
      try {
        const result = await processWithAI(type, submission);
        results.push({
          submission_id: submission.id,
          success: true,
          result: result
        });
      } catch (error) {
        results.push({
          submission_id: submission.id,
          success: false,
          error: error.message
        });
      }
    }
    
    res.json({
      success: true,
      data: {
        total_processed: submissions.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results: results
      }
    });
  })
);

/**
 * AI Model Training Status
 * GET /api/ai/training-status
 */
router.get('/training-status', 
  authMiddleware.requireAdmin,
  asyncHandler(async (req, res) => {
    try {
      const pythonProcess = spawn('python', [
        'src/ai/train_models.py',
        '--status'
      ]);
      
      return new Promise((resolve, reject) => {
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
              const status = JSON.parse(output);
              resolve(status);
            } catch (parseError) {
              reject(new AIProcessingError('Invalid training status response'));
            }
          } else {
            reject(new AIProcessingError(`Training status check failed: ${error}`));
          }
        });
      });
      
    } catch (error) {
      logger.error('Training status check failed:', error);
      throw new AIProcessingError('Unable to check training status');
    }
  })
);

/**
 * Start AI Model Training
 * POST /api/ai/train
 */
router.post('/train', 
  authMiddleware.requireAdmin,
  validationMiddleware.validate(schemas.trainingConfig),
  asyncHandler(async (req, res) => {
    const { model_type, dataset_path, epochs, batch_size } = req.body;
    
    try {
      const pythonProcess = spawn('python', [
        'src/ai/train_models.py',
        '--model-type', model_type,
        '--dataset-path', dataset_path,
        '--epochs', epochs.toString(),
        '--batch-size', batch_size.toString()
      ]);
      
      // Return immediately with training job ID
      const jobId = `training_${Date.now()}`;
      
      res.json({
        success: true,
        data: {
          job_id: jobId,
          status: 'started',
          model_type: model_type,
          message: 'Training job started successfully'
        }
      });
      
      // Log training start
      logger.info('AI training started', {
        job_id: jobId,
        model_type: model_type,
        user_id: req.user.id
      });
      
    } catch (error) {
      logger.error('Training start failed:', error);
      throw new AIProcessingError('Failed to start training job');
    }
  })
);

/**
 * AI Configuration
 * GET /api/ai/config
 */
router.get('/config', 
  authMiddleware.requireAdmin,
  asyncHandler(async (req, res) => {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const configPath = path.join(__dirname, '../../../data/ai_config.json');
      
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
            screenshot_verification: {
              confidence_threshold: 0.7,
              ocr_enabled: true,
              exif_analysis: true
            },
            anomaly_detection: {
              impossible_time_threshold: 0.001,
              suspicious_improvement_threshold: 0.05,
              statistical_outlier_threshold: 2.5
            },
            content_moderation: {
              toxicity_threshold: 0.7,
              spam_threshold: 0.8,
              nsfw_threshold: 0.6
            },
            player_analysis: {
              clustering_enabled: true,
              recommendation_count: 5,
              analysis_period: '30d'
            }
          }
        });
      }
      
    } catch (error) {
      logger.error('Config retrieval failed:', error);
      throw new AIProcessingError('Unable to retrieve AI configuration');
    }
  })
);

/**
 * Update AI Configuration
 * PUT /api/ai/config
 */
router.put('/config', 
  authMiddleware.requireAdmin,
  validationMiddleware.validate(schemas.aiConfig),
  asyncHandler(async (req, res) => {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const configPath = path.join(__dirname, '../../../data/ai_config.json');
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
          message: 'AI configuration updated successfully',
          config: req.body
        }
      });
      
      logger.info('AI configuration updated', {
        user_id: req.user.id,
        config: req.body
      });
      
    } catch (error) {
      logger.error('Config update failed:', error);
      throw new AIProcessingError('Failed to update AI configuration');
    }
  })
);

/**
 * AI Processing Analytics
 * GET /api/ai/analytics
 */
router.get('/analytics', 
  authMiddleware.requireAdmin,
  asyncHandler(async (req, res) => {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const analyticsPath = path.join(__dirname, '../../../logs/processing_analytics.jsonl');
      
      if (!fs.existsSync(analyticsPath)) {
        return res.json({
          success: true,
          data: {
            total_processed: 0,
            success_rate: 0,
            average_processing_time: 0,
            recent_activity: []
          }
        });
      }
      
      const lines = fs.readFileSync(analyticsPath, 'utf8').split('\n').filter(line => line.trim());
      const analytics = lines.map(line => JSON.parse(line));
      
      const totalProcessed = analytics.length;
      const successful = analytics.filter(a => a.success).length;
      const successRate = totalProcessed > 0 ? (successful / totalProcessed) * 100 : 0;
      
      // Calculate average processing time (if available)
      const processingTimes = analytics
        .filter(a => a.processing_time)
        .map(a => a.processing_time);
      
      const avgProcessingTime = processingTimes.length > 0 
        ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length 
        : 0;
      
      // Get recent activity (last 100 entries)
      const recentActivity = analytics.slice(-100);
      
      res.json({
        success: true,
        data: {
          total_processed: totalProcessed,
          success_rate: successRate,
          average_processing_time: avgProcessingTime,
          recent_activity: recentActivity,
          breakdown: {
            screenshot_submissions: analytics.filter(a => a.type === 'screenshot').length,
            fanart_submissions: analytics.filter(a => a.type === 'fanart').length,
            comment_submissions: analytics.filter(a => a.type === 'comment').length
          }
        }
      });
      
    } catch (error) {
      logger.error('Analytics retrieval failed:', error);
      throw new AIProcessingError('Unable to retrieve analytics data');
    }
  })
);

/**
 * AI Model Performance Metrics
 * GET /api/ai/performance
 */
router.get('/performance', 
  authMiddleware.requireAdmin,
  asyncHandler(async (req, res) => {
    try {
      const pythonProcess = spawn('python', [
        'src/ai/process_submissions.py',
        '--performance-metrics'
      ]);
      
      return new Promise((resolve, reject) => {
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
              const metrics = JSON.parse(output);
              resolve(metrics);
            } catch (parseError) {
              reject(new AIProcessingError('Invalid performance metrics response'));
            }
          } else {
            reject(new AIProcessingError(`Performance metrics check failed: ${error}`));
          }
        });
      });
      
    } catch (error) {
      logger.error('Performance metrics retrieval failed:', error);
      throw new AIProcessingError('Unable to retrieve performance metrics');
    }
  })
);

// Helper function for AI processing
async function processWithAI(type, submissionData) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [
      'src/ai/process_submissions.py',
      '--type', type,
      '--data', JSON.stringify(submissionData)
    ]);

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        logger.error('Python process error:', error);
        reject(new AIProcessingError(`AI processing failed with code ${code}: ${error}`));
      } else {
        try {
          const parsedResult = JSON.parse(result);
          resolve(parsedResult);
        } catch (parseError) {
          logger.error('Failed to parse AI result:', parseError);
          reject(new AIProcessingError('Invalid AI processing result'));
        }
      }
    });

    pythonProcess.on('error', (err) => {
      logger.error('Failed to start Python process:', err);
      reject(new AIProcessingError('AI system unavailable'));
    });
  });
}

// Validation schemas
const schemas = {
  batchProcess: Joi.object({
    submissions: Joi.array().items(Joi.object()).min(1).max(100).required(),
    type: Joi.string().valid('screenshot', 'fanart', 'comment').required()
  }),
  
  trainingConfig: Joi.object({
    model_type: Joi.string().valid('screenshot_verification', 'anomaly_detection', 'content_moderation', 'player_analysis').required(),
    dataset_path: Joi.string().required(),
    epochs: Joi.number().integer().min(1).max(1000).default(100),
    batch_size: Joi.number().integer().min(1).max(512).default(32)
  }),
  
  aiConfig: Joi.object({
    screenshot_verification: Joi.object({
      confidence_threshold: Joi.number().min(0).max(1).default(0.7),
      ocr_enabled: Joi.boolean().default(true),
      exif_analysis: Joi.boolean().default(true)
    }),
    anomaly_detection: Joi.object({
      impossible_time_threshold: Joi.number().min(0).max(1).default(0.001),
      suspicious_improvement_threshold: Joi.number().min(0).max(1).default(0.05),
      statistical_outlier_threshold: Joi.number().min(0).max(10).default(2.5)
    }),
    content_moderation: Joi.object({
      toxicity_threshold: Joi.number().min(0).max(1).default(0.7),
      spam_threshold: Joi.number().min(0).max(1).default(0.8),
      nsfw_threshold: Joi.number().min(0).max(1).default(0.6)
    }),
    player_analysis: Joi.object({
      clustering_enabled: Joi.boolean().default(true),
      recommendation_count: Joi.number().integer().min(1).max(20).default(5),
      analysis_period: Joi.string().valid('7d', '30d', '90d', 'all').default('30d')
    })
  })
};

module.exports = router;
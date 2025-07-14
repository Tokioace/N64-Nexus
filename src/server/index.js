/**
 * Battle64 AI System - Main Server
 * Express server with AI-powered endpoints for screenshot verification,
 * anomaly detection, moderation, and points distribution
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const rateLimit = require('express-rate-limit');
const winston = require('winston');

// Import middleware and utilities
const authMiddleware = require('./middleware/auth');
const validationMiddleware = require('./middleware/validation');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const aiRoutes = require('./routes/ai');
const pointsRoutes = require('./routes/points');
const playerRoutes = require('./routes/players');
const leaderboardRoutes = require('./routes/leaderboards');

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'battle64-ai' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Battle64 AI System',
    version: '1.0.0'
  });
});

// API routes
app.use('/api/ai', aiRoutes);
app.use('/api/points', pointsRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/leaderboards', leaderboardRoutes);

// Screenshot submission endpoint
app.post('/api/submit/screenshot', 
  authMiddleware.verifyToken,
  upload.single('screenshot'),
  validationMiddleware.validateScreenshotSubmission,
  async (req, res) => {
    try {
      const { player_id, event_id, time, platform, game_title } = req.body;
      const imagePath = req.file?.path;

      if (!imagePath) {
        return res.status(400).json({
          error: 'No screenshot file provided'
        });
      }

      // Prepare submission data
      const submissionData = {
        player_id,
        event_id,
        image_path: imagePath,
        time: time || '',
        platform: platform || '',
        game_title: game_title || ''
      };

      // Process with AI system
      const result = await processWithAI('screenshot', submissionData);

      res.json({
        success: true,
        data: result,
        message: 'Screenshot processed successfully'
      });

    } catch (error) {
      logger.error('Screenshot submission error:', error);
      res.status(500).json({
        error: 'Failed to process screenshot',
        details: error.message
      });
    }
  }
);

// Fanart submission endpoint
app.post('/api/submit/fanart',
  authMiddleware.verifyToken,
  upload.single('fanart'),
  validationMiddleware.validateFanartSubmission,
  async (req, res) => {
    try {
      const { player_id, title, description } = req.body;
      const imagePath = req.file?.path;

      if (!imagePath) {
        return res.status(400).json({
          error: 'No fanart file provided'
        });
      }

      // Prepare submission data
      const submissionData = {
        player_id,
        image_path: imagePath,
        title: title || '',
        description: description || ''
      };

      // Process with AI system
      const result = await processWithAI('fanart', submissionData);

      res.json({
        success: true,
        data: result,
        message: 'Fanart processed successfully'
      });

    } catch (error) {
      logger.error('Fanart submission error:', error);
      res.status(500).json({
        error: 'Failed to process fanart',
        details: error.message
      });
    }
  }
);

// Comment submission endpoint
app.post('/api/submit/comment',
  authMiddleware.verifyToken,
  validationMiddleware.validateCommentSubmission,
  async (req, res) => {
    try {
      const { player_id, comment_text, context } = req.body;

      // Prepare submission data
      const submissionData = {
        player_id,
        comment_text,
        context: context || 'comment'
      };

      // Process with AI system
      const result = await processWithAI('comment', submissionData);

      res.json({
        success: true,
        data: result,
        message: 'Comment processed successfully'
      });

    } catch (error) {
      logger.error('Comment submission error:', error);
      res.status(500).json({
        error: 'Failed to process comment',
        details: error.message
      });
    }
  }
);

// Player profile endpoint
app.get('/api/players/:playerId/profile',
  authMiddleware.verifyToken,
  async (req, res) => {
    try {
      const { playerId } = req.params;
      const result = await getPlayerProfile(playerId);

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      logger.error('Player profile error:', error);
      res.status(500).json({
        error: 'Failed to get player profile',
        details: error.message
      });
    }
  }
);

// Leaderboard endpoint
app.get('/api/leaderboards/:type',
  async (req, res) => {
    try {
      const { type } = req.params;
      const { limit = 50 } = req.query;
      const result = await getLeaderboard(type, parseInt(limit));

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      logger.error('Leaderboard error:', error);
      res.status(500).json({
        error: 'Failed to get leaderboard',
        details: error.message
      });
    }
  }
);

// AI processing function
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
        reject(new Error(`AI processing failed with code ${code}: ${error}`));
      } else {
        try {
          const parsedResult = JSON.parse(result);
          resolve(parsedResult);
        } catch (parseError) {
          logger.error('Failed to parse AI result:', parseError);
          reject(new Error('Invalid AI processing result'));
        }
      }
    });

    pythonProcess.on('error', (err) => {
      logger.error('Failed to start Python process:', err);
      reject(new Error('AI system unavailable'));
    });
  });
}

// Player profile function
async function getPlayerProfile(playerId) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [
      'src/ai/process_submissions.py',
      '--profile',
      '--player-id', playerId
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
        logger.error('Python profile error:', error);
        reject(new Error(`Profile retrieval failed: ${error}`));
      } else {
        try {
          const parsedResult = JSON.parse(result);
          resolve(parsedResult);
        } catch (parseError) {
          logger.error('Failed to parse profile result:', parseError);
          reject(new Error('Invalid profile result'));
        }
      }
    });
  });
}

// Leaderboard function
async function getLeaderboard(type, limit) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [
      'src/ai/process_submissions.py',
      '--leaderboard',
      '--type', type,
      '--limit', limit.toString()
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
        logger.error('Python leaderboard error:', error);
        reject(new Error(`Leaderboard retrieval failed: ${error}`));
      } else {
        try {
          const parsedResult = JSON.parse(result);
          resolve(parsedResult);
        } catch (parseError) {
          logger.error('Failed to parse leaderboard result:', parseError);
          reject(new Error('Invalid leaderboard result'));
        }
      }
    });
  });
}

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Battle64 AI System server running on port ${PORT}`);
  logger.info(`Health check available at http://localhost:${PORT}/health`);
  logger.info(`API documentation available at http://localhost:${PORT}/api/docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
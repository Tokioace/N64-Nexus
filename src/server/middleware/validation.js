/**
 * Validation Middleware for Battle64 AI System
 * Validates request data before processing
 */

const Joi = require('joi');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

/**
 * Validation schemas
 */
const schemas = {
  // Screenshot submission validation
  screenshotSubmission: Joi.object({
    player_id: Joi.string().required().min(1).max(100),
    event_id: Joi.string().required().min(1).max(100),
    time: Joi.string().optional().pattern(/^\d{1,2}:\d{2}(\.\d{1,3})?$/),
    platform: Joi.string().optional().valid('NTSC', 'PAL', 'Emulator', 'Unknown'),
    game_title: Joi.string().optional().max(200)
  }),

  // Fanart submission validation
  fanartSubmission: Joi.object({
    player_id: Joi.string().required().min(1).max(100),
    title: Joi.string().optional().max(200),
    description: Joi.string().optional().max(1000)
  }),

  // Comment submission validation
  commentSubmission: Joi.object({
    player_id: Joi.string().required().min(1).max(100),
    comment_text: Joi.string().required().min(1).max(2000),
    context: Joi.string().optional().valid('comment', 'post', 'event', 'fanart')
  }),

  // Player profile request validation
  playerProfile: Joi.object({
    playerId: Joi.string().required().min(1).max(100)
  }),

  // Leaderboard request validation
  leaderboard: Joi.object({
    type: Joi.string().required().valid('global', 'monthly', 'weekly', 'event'),
    limit: Joi.number().integer().min(1).max(100).default(50)
  }),

  // Points configuration validation
  pointsConfig: Joi.object({
    xp_multipliers: Joi.object().pattern(Joi.string(), Joi.number().positive()),
    max_daily_xp: Joi.number().integer().positive(),
    streak_bonus: Joi.number().positive()
  }),

  // Event creation validation
  eventCreation: Joi.object({
    title: Joi.string().required().min(1).max(200),
    description: Joi.string().optional().max(1000),
    game_title: Joi.string().required().min(1).max(200),
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().greater(Joi.ref('start_date')).required(),
    rules: Joi.array().items(Joi.string()).optional(),
    max_participants: Joi.number().integer().positive().optional()
  })
};

/**
 * Generic validation middleware
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errorDetails = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));

        logger.warn(`Validation failed for ${req.originalUrl}:`, errorDetails);

        return res.status(400).json({
          error: 'Validation failed',
          details: errorDetails,
          message: 'Please check your input and try again'
        });
      }

      // Replace request body with validated data
      req.body = value;
      next();

    } catch (validationError) {
      logger.error('Validation middleware error:', validationError);
      return res.status(500).json({
        error: 'Validation error',
        message: 'Internal server error during validation'
      });
    }
  };
};

/**
 * Query parameter validation middleware
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errorDetails = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));

        logger.warn(`Query validation failed for ${req.originalUrl}:`, errorDetails);

        return res.status(400).json({
          error: 'Invalid query parameters',
          details: errorDetails,
          message: 'Please check your query parameters and try again'
        });
      }

      // Replace request query with validated data
      req.query = value;
      next();

    } catch (validationError) {
      logger.error('Query validation middleware error:', validationError);
      return res.status(500).json({
        error: 'Query validation error',
        message: 'Internal server error during query validation'
      });
    }
  };
};

/**
 * URL parameter validation middleware
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.params, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errorDetails = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));

        logger.warn(`Parameter validation failed for ${req.originalUrl}:`, errorDetails);

        return res.status(400).json({
          error: 'Invalid URL parameters',
          details: errorDetails,
          message: 'Please check your URL parameters and try again'
        });
      }

      // Replace request params with validated data
      req.params = value;
      next();

    } catch (validationError) {
      logger.error('Parameter validation middleware error:', validationError);
      return res.status(500).json({
        error: 'Parameter validation error',
        message: 'Internal server error during parameter validation'
      });
    }
  };
};

/**
 * Specific validation middlewares
 */
const validateScreenshotSubmission = validate(schemas.screenshotSubmission);
const validateFanartSubmission = validate(schemas.fanartSubmission);
const validateCommentSubmission = validate(schemas.commentSubmission);
const validatePlayerProfile = validateParams(schemas.playerProfile);
const validateLeaderboard = validateQuery(schemas.leaderboard);
const validatePointsConfig = validate(schemas.pointsConfig);
const validateEventCreation = validate(schemas.eventCreation);

/**
 * File validation middleware
 */
const validateFile = (options = {}) => {
  return (req, res, next) => {
    try {
      const file = req.file;
      const { 
        required = true, 
        maxSize = 10 * 1024 * 1024, // 10MB
        allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      } = options;

      if (required && !file) {
        return res.status(400).json({
          error: 'File required',
          message: 'Please provide a file for upload'
        });
      }

      if (file) {
        // Check file size
        if (file.size > maxSize) {
          return res.status(400).json({
            error: 'File too large',
            message: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
          });
        }

        // Check file type
        if (!allowedTypes.includes(file.mimetype)) {
          return res.status(400).json({
            error: 'Invalid file type',
            message: `Only ${allowedTypes.join(', ')} files are allowed`
          });
        }

        // Check file extension
        const allowedExtensions = allowedTypes.map(type => {
          const ext = type.split('/')[1];
          return ext === 'jpeg' ? 'jpg' : ext;
        });

        const fileExtension = file.originalname.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
          return res.status(400).json({
            error: 'Invalid file extension',
            message: `Only ${allowedExtensions.join(', ')} files are allowed`
          });
        }
      }

      next();

    } catch (validationError) {
      logger.error('File validation middleware error:', validationError);
      return res.status(500).json({
        error: 'File validation error',
        message: 'Internal server error during file validation'
      });
    }
  };
};

/**
 * Time format validation
 */
const validateTimeFormat = (timeString) => {
  const timePattern = /^\d{1,2}:\d{2}(\.\d{1,3})?$/;
  return timePattern.test(timeString);
};

/**
 * Platform validation
 */
const validatePlatform = (platform) => {
  const validPlatforms = ['NTSC', 'PAL', 'Emulator', 'Unknown'];
  return validPlatforms.includes(platform);
};

/**
 * Sanitize input middleware
 */
const sanitizeInput = (req, res, next) => {
  try {
    // Sanitize string fields
    const sanitizeString = (str) => {
      if (typeof str !== 'string') return str;
      return str
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, ''); // Remove event handlers
    };

    // Recursively sanitize object
    const sanitizeObject = (obj) => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      }
      
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          sanitized[key] = sanitizeString(value);
        } else if (typeof value === 'object') {
          sanitized[key] = sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    };

    // Sanitize request body, query, and params
    if (req.body) req.body = sanitizeObject(req.body);
    if (req.query) req.query = sanitizeObject(req.query);
    if (req.params) req.params = sanitizeObject(req.params);

    next();

  } catch (sanitizeError) {
    logger.error('Sanitization middleware error:', sanitizeError);
    return res.status(500).json({
      error: 'Input sanitization error',
      message: 'Internal server error during input sanitization'
    });
  }
};

module.exports = {
  validate,
  validateQuery,
  validateParams,
  validateScreenshotSubmission,
  validateFanartSubmission,
  validateCommentSubmission,
  validatePlayerProfile,
  validateLeaderboard,
  validatePointsConfig,
  validateEventCreation,
  validateFile,
  validateTimeFormat,
  validatePlatform,
  sanitizeInput,
  schemas
};
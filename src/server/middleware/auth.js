/**
 * Authentication Middleware for Battle64 AI System
 * Handles JWT token verification and user authentication
 */

const jwt = require('jsonwebtoken');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

// JWT secret key (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'battle64-secret-key-change-in-production';

/**
 * Verify JWT token middleware
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Access token required',
        message: 'Please provide a valid authentication token'
      });
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        error: 'Invalid token format',
        message: 'Token must be provided in format: Bearer <token>'
      });
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        logger.warn(`Token verification failed: ${err.message}`);
        return res.status(401).json({
          error: 'Invalid token',
          message: 'Token is invalid or expired'
        });
      }

      // Add user info to request
      req.user = {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role || 'user'
      };

      next();
    });

  } catch (error) {
    logger.error('Authentication middleware error:', error);
    return res.status(500).json({
      error: 'Authentication error',
      message: 'Internal server error during authentication'
    });
  }
};

/**
 * Optional token verification (doesn't fail if no token)
 */
const optionalToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      req.user = null;
      return next();
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        req.user = null;
        return next();
      }

      req.user = {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role || 'user'
      };

      next();
    });

  } catch (error) {
    logger.error('Optional authentication middleware error:', error);
    req.user = null;
    next();
  }
};

/**
 * Role-based access control middleware
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'You must be logged in to access this resource'
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Admin-only access middleware
 */
const requireAdmin = requireRole('admin');

/**
 * Generate JWT token for testing purposes
 */
const generateTestToken = (userData = {}) => {
  const payload = {
    id: userData.id || 'test-user-123',
    username: userData.username || 'testuser',
    email: userData.email || 'test@battle64.com',
    role: userData.role || 'user',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };

  return jwt.sign(payload, JWT_SECRET);
};

/**
 * Rate limiting for authentication endpoints
 */
const authRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts',
    message: 'Please try again later'
  }
};

module.exports = {
  verifyToken,
  optionalToken,
  requireRole,
  requireAdmin,
  generateTestToken,
  authRateLimit
};
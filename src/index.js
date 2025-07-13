const express = require('express');
const cors = require('cors');
const moment = require('moment');
require('dotenv').config();

const seasonalEventsRoutes = require('./routes/seasonalEvents');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: moment().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/seasonal-events', seasonalEventsRoutes);

// Root endpoint with API information
app.get('/', (req, res) => {
  res.json({
    name: 'Battle64 Seasonal Events API',
    version: '1.0.0',
    description: 'Saisonale Events & Belohnungen für Battle64',
    endpoints: {
      health: '/health',
      seasonalEvents: '/api/seasonal-events',
      currentEvents: '/api/seasonal-events/current',
      upcomingEvents: '/api/seasonal-events/upcoming',
      eventCalendar: '/api/seasonal-events/calendar/:year/:month',
      statistics: '/api/seasonal-events/statistics/overview',
      recommendations: '/api/seasonal-events/recommendations'
    },
    documentation: {
      description: 'API für saisonale Events und Belohnungen im Battle64 Spiel',
      features: [
        'Saisonale Events (Frühling, Sommer, Herbst, Winter)',
        'Feiertagsspecials (Halloween, Weihnachten, Neujahr, Valentinstag, N64-Anniversary)',
        'Automatische Event-Aktivierung basierend auf Datum',
        'Belohnungssystem mit Profilrahmen, Stickern, Titeln',
        'Challenge-System mit Fortschrittsverfolgung',
        'Event-Kalender und Statistiken',
        'Benutzer-Empfehlungen basierend auf Präferenzen'
      ]
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api/seasonal-events',
      'GET /api/seasonal-events/current',
      'GET /api/seasonal-events/upcoming',
      'GET /api/seasonal-events/:id',
      'GET /api/seasonal-events/calendar/:year/:month',
      'GET /api/seasonal-events/statistics/overview',
      'GET /api/seasonal-events/recommendations'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Internal server error',
    timestamp: moment().toISOString(),
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎮 Battle64 Seasonal Events API running on port ${PORT}`);
  console.log(`📅 Current date: ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Documentation: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
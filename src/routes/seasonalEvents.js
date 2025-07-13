const express = require('express');
const router = express.Router();
const SeasonalEventManager = require('../services/SeasonalEventManager');
const Reward = require('../models/Reward');

const eventManager = new SeasonalEventManager();

// GET /api/seasonal-events - Get all events
router.get('/', (req, res) => {
  try {
    const { type, season, holiday, active, upcoming } = req.query;
    let events = [];

    if (active === 'true') {
      events = eventManager.getActiveEvents();
    } else if (upcoming === 'true') {
      const days = parseInt(req.query.days) || 7;
      events = eventManager.getUpcomingEvents(days);
    } else if (type) {
      events = eventManager.getEventsByType(type);
    } else if (season) {
      events = eventManager.getEventsBySeason(season);
    } else if (holiday) {
      events = eventManager.getEventsByHoliday(holiday);
    } else {
      events = Array.from(eventManager.events.values());
    }

    res.json({
      success: true,
      data: events.map(event => event.toJSON()),
      count: events.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/seasonal-events/current - Get currently active events
router.get('/current', (req, res) => {
  try {
    const activeEvents = eventManager.getActiveEvents();
    const currentSeasonal = eventManager.getCurrentSeasonalEvent();
    const currentHoliday = eventManager.getCurrentHolidayEvent();

    res.json({
      success: true,
      data: {
        activeEvents: activeEvents.map(event => event.toJSON()),
        currentSeasonal: currentSeasonal ? currentSeasonal.toJSON() : null,
        currentHoliday: currentHoliday ? currentHoliday.toJSON() : null,
        currentSeason: eventManager.getCurrentSeason(),
        currentHolidayType: eventManager.getCurrentHoliday()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/seasonal-events/upcoming - Get upcoming events
router.get('/upcoming', (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const upcomingEvents = eventManager.getUpcomingEvents(days);

    res.json({
      success: true,
      data: upcomingEvents.map(event => event.toJSON()),
      count: upcomingEvents.length,
      days: days
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/seasonal-events/:id - Get specific event
router.get('/:id', (req, res) => {
  try {
    const event = eventManager.getEventById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/seasonal-events/calendar/:year/:month - Get event calendar
router.get('/calendar/:year/:month', (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month) - 1; // moment uses 0-based months

    if (isNaN(year) || isNaN(month) || month < 0 || month > 11) {
      return res.status(400).json({
        success: false,
        error: 'Invalid year or month'
      });
    }

    const calendarEvents = eventManager.getEventCalendar(year, month);

    res.json({
      success: true,
      data: calendarEvents.map(calEvent => ({
        event: calEvent.event.toJSON(),
        startDate: calEvent.startDate.format('YYYY-MM-DD'),
        endDate: calEvent.endDate.format('YYYY-MM-DD'),
        isActive: calEvent.isActive
      })),
      year: year,
      month: month + 1
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/seasonal-events/statistics - Get event statistics
router.get('/statistics/overview', (req, res) => {
  try {
    const stats = eventManager.getEventStatistics();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/seasonal-events/recommendations - Get recommended events for user
router.get('/recommendations', (req, res) => {
  try {
    const userPreferences = {
      favoriteSeason: req.query.favoriteSeason,
      favoriteHoliday: req.query.favoriteHoliday,
      prepareForEvents: req.query.prepareForEvents === 'true'
    };

    const recommendations = eventManager.getRecommendedEvents(userPreferences);

    res.json({
      success: true,
      data: recommendations.map(event => event.toJSON()),
      count: recommendations.length,
      preferences: userPreferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/seasonal-events - Create new event
router.post('/', (req, res) => {
  try {
    const event = eventManager.createEvent(req.body);

    res.status(201).json({
      success: true,
      data: event.toJSON(),
      message: 'Event created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/seasonal-events/:id - Update event
router.put('/:id', (req, res) => {
  try {
    const event = eventManager.updateEvent(req.params.id, req.body);

    res.json({
      success: true,
      data: event.toJSON(),
      message: 'Event updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/seasonal-events/:id - Delete event
router.delete('/:id', (req, res) => {
  try {
    const event = eventManager.deleteEvent(req.params.id);

    res.json({
      success: true,
      data: event.toJSON(),
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/seasonal-events/:id/rewards - Get rewards for specific event
router.get('/:id/rewards', (req, res) => {
  try {
    const event = eventManager.getEventById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    const rewards = event.rewards.map(rewardData => {
      const reward = new Reward({
        ...rewardData,
        eventId: event.id,
        eventName: event.name
      });
      return reward.toJSON();
    });

    res.json({
      success: true,
      data: rewards,
      count: rewards.length,
      event: {
        id: event.id,
        name: event.name,
        isActive: event.isCurrentlyActive()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/seasonal-events/:id/challenges - Get challenges for specific event
router.get('/:id/challenges', (req, res) => {
  try {
    const event = eventManager.getEventById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event.challenges,
      count: event.challenges.length,
      event: {
        id: event.id,
        name: event.name,
        isActive: event.isCurrentlyActive()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/seasonal-events/:id/maps - Get maps for specific event
router.get('/:id/maps', (req, res) => {
  try {
    const event = eventManager.getEventById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event.maps,
      count: event.maps.length,
      event: {
        id: event.id,
        name: event.name,
        isActive: event.isCurrentlyActive()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/seasonal-events/check-status - Check and update event status
router.post('/check-status', (req, res) => {
  try {
    const statusChanges = eventManager.checkEventStatus();

    res.json({
      success: true,
      data: statusChanges,
      count: statusChanges.length,
      message: statusChanges.length > 0 ? 'Event status updated' : 'No status changes'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/seasonal-events/export - Export all events as JSON
router.get('/export/all', (req, res) => {
  try {
    const eventsJson = eventManager.exportEvents();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="seasonal-events.json"');
    res.send(eventsJson);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/seasonal-events/import - Import events from JSON
router.post('/import', (req, res) => {
  try {
    const { eventsJson } = req.body;
    
    if (!eventsJson) {
      return res.status(400).json({
        success: false,
        error: 'Events JSON is required'
      });
    }

    eventManager.importEvents(eventsJson);

    res.json({
      success: true,
      message: 'Events imported successfully',
      count: eventManager.events.size
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
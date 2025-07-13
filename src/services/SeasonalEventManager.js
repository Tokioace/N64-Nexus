const moment = require('moment');
const SeasonalEvent = require('../models/SeasonalEvent');
const { seasonalEvents, holidayEvents, allEvents } = require('../data/seasonalEvents');

class SeasonalEventManager {
  constructor() {
    this.events = new Map();
    this.initializeEvents();
  }

  // Initialize all events from data
  initializeEvents() {
    allEvents.forEach(eventData => {
      const event = new SeasonalEvent(eventData);
      this.events.set(event.id, event);
    });
  }

  // Get current season based on date
  getCurrentSeason() {
    const month = moment().month();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  // Get current holiday based on date
  getCurrentHoliday() {
    const now = moment();
    const month = now.month();
    const date = now.date();

    // Halloween (October 25-31)
    if (month === 9 && date >= 25) return 'halloween';
    
    // Christmas (December 20-26)
    if (month === 11 && date >= 20 && date <= 26) return 'christmas';
    
    // New Year (December 30 - January 2)
    if ((month === 11 && date >= 30) || (month === 0 && date <= 2)) return 'newyear';
    
    // Valentine's Day (February 12-14)
    if (month === 1 && date >= 12 && date <= 14) return 'valentine';
    
    // N64 Anniversary (June 23-29)
    if (month === 5 && date >= 23 && date <= 29) return 'n64anniversary';

    return null;
  }

  // Get currently active events
  getActiveEvents() {
    const activeEvents = [];
    for (const event of this.events.values()) {
      if (event.isCurrentlyActive()) {
        activeEvents.push(event);
      }
    }
    return activeEvents;
  }

  // Get upcoming events (starting within next 7 days)
  getUpcomingEvents(days = 7) {
    const upcomingEvents = [];
    const now = moment();
    
    for (const event of this.events.values()) {
      const daysUntilStart = event.getDaysUntilStart();
      if (daysUntilStart >= 0 && daysUntilStart <= days) {
        upcomingEvents.push(event);
      }
    }
    
    return upcomingEvents.sort((a, b) => a.getDaysUntilStart() - b.getDaysUntilStart());
  }

  // Get events by type
  getEventsByType(type) {
    const filteredEvents = [];
    for (const event of this.events.values()) {
      if (event.type === type) {
        filteredEvents.push(event);
      }
    }
    return filteredEvents;
  }

  // Get events by season
  getEventsBySeason(season) {
    const filteredEvents = [];
    for (const event of this.events.values()) {
      if (event.season === season) {
        filteredEvents.push(event);
      }
    }
    return filteredEvents;
  }

  // Get events by holiday
  getEventsByHoliday(holiday) {
    const filteredEvents = [];
    for (const event of this.events.values()) {
      if (event.holiday === holiday) {
        filteredEvents.push(event);
      }
    }
    return filteredEvents;
  }

  // Get current seasonal event
  getCurrentSeasonalEvent() {
    const currentSeason = this.getCurrentSeason();
    const seasonalEvents = this.getEventsBySeason(currentSeason);
    return seasonalEvents.find(event => event.isCurrentlyActive()) || null;
  }

  // Get current holiday event
  getCurrentHolidayEvent() {
    const currentHoliday = this.getCurrentHoliday();
    if (!currentHoliday) return null;
    
    const holidayEvents = this.getEventsByHoliday(currentHoliday);
    return holidayEvents.find(event => event.isCurrentlyActive()) || null;
  }

  // Get event by ID
  getEventById(eventId) {
    return this.events.get(eventId) || null;
  }

  // Create new event
  createEvent(eventData) {
    const event = new SeasonalEvent(eventData);
    const errors = event.validate();
    
    if (errors.length > 0) {
      throw new Error(`Event validation failed: ${errors.join(', ')}`);
    }
    
    this.events.set(event.id, event);
    return event;
  }

  // Update event
  updateEvent(eventId, updateData) {
    const event = this.getEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    
    event.update(updateData);
    return event;
  }

  // Delete event
  deleteEvent(eventId) {
    const event = this.getEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    
    this.events.delete(eventId);
    return event;
  }

  // Get event calendar for a specific month/year
  getEventCalendar(year, month) {
    const startOfMonth = moment([year, month, 1]);
    const endOfMonth = moment([year, month, 1]).endOf('month');
    const calendarEvents = [];
    
    for (const event of this.events.values()) {
      const eventStart = moment(event.startDate);
      const eventEnd = moment(event.endDate);
      
      // Check if event overlaps with the month
      if (eventStart.isBefore(endOfMonth) && eventEnd.isAfter(startOfMonth)) {
        calendarEvents.push({
          event,
          startDate: eventStart,
          endDate: eventEnd,
          isActive: event.isCurrentlyActive()
        });
      }
    }
    
    return calendarEvents;
  }

  // Get event statistics
  getEventStatistics() {
    const stats = {
      totalEvents: this.events.size,
      activeEvents: this.getActiveEvents().length,
      upcomingEvents: this.getUpcomingEvents().length,
      seasonalEvents: this.getEventsByType('season').length,
      holidayEvents: this.getEventsByType('holiday').length,
      currentSeason: this.getCurrentSeason(),
      currentHoliday: this.getCurrentHoliday(),
      eventsBySeason: {},
      eventsByHoliday: {}
    };

    // Count events by season
    ['spring', 'summer', 'autumn', 'winter'].forEach(season => {
      stats.eventsBySeason[season] = this.getEventsBySeason(season).length;
    });

    // Count events by holiday
    ['halloween', 'christmas', 'newyear', 'valentine', 'n64anniversary'].forEach(holiday => {
      stats.eventsByHoliday[holiday] = this.getEventsByHoliday(holiday).length;
    });

    return stats;
  }

  // Check if any events need to be activated/deactivated
  checkEventStatus() {
    const statusChanges = [];
    
    for (const event of this.events.values()) {
      const wasActive = event.isActive;
      const isActive = event.isCurrentlyActive();
      
      if (wasActive !== isActive) {
        event.isActive = isActive;
        statusChanges.push({
          event: event.name,
          status: isActive ? 'activated' : 'deactivated',
          timestamp: moment().toISOString()
        });
      }
    }
    
    return statusChanges;
  }

  // Get recommended events for a user based on their preferences
  getRecommendedEvents(userPreferences = {}) {
    const recommendations = [];
    const activeEvents = this.getActiveEvents();
    
    // Filter by user preferences
    if (userPreferences.favoriteSeason) {
      const seasonalEvents = activeEvents.filter(event => 
        event.season === userPreferences.favoriteSeason
      );
      recommendations.push(...seasonalEvents);
    }
    
    if (userPreferences.favoriteHoliday) {
      const holidayEvents = activeEvents.filter(event => 
        event.holiday === userPreferences.favoriteHoliday
      );
      recommendations.push(...holidayEvents);
    }
    
    // Add upcoming events if user likes to prepare
    if (userPreferences.prepareForEvents) {
      const upcomingEvents = this.getUpcomingEvents(7);
      recommendations.push(...upcomingEvents);
    }
    
    // Remove duplicates and sort by relevance
    const uniqueRecommendations = recommendations.filter((event, index, self) => 
      index === self.findIndex(e => e.id === event.id)
    );
    
    return uniqueRecommendations;
  }

  // Export all events as JSON
  exportEvents() {
    const eventsArray = Array.from(this.events.values()).map(event => event.toJSON());
    return JSON.stringify(eventsArray, null, 2);
  }

  // Import events from JSON
  importEvents(eventsJson) {
    try {
      const eventsArray = JSON.parse(eventsJson);
      this.events.clear();
      
      eventsArray.forEach(eventData => {
        const event = new SeasonalEvent(eventData);
        this.events.set(event.id, event);
      });
      
      return true;
    } catch (error) {
      throw new Error(`Failed to import events: ${error.message}`);
    }
  }
}

module.exports = SeasonalEventManager;
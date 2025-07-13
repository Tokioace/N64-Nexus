const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

class SeasonalEvent {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.name = data.name || '';
    this.description = data.description || '';
    this.type = data.type || 'season'; // 'season' or 'holiday'
    this.season = data.season || ''; // 'spring', 'summer', 'autumn', 'winter'
    this.holiday = data.holiday || ''; // 'halloween', 'christmas', 'newyear', 'valentine', 'n64anniversary'
    this.startDate = data.startDate || moment().format('YYYY-MM-DD');
    this.endDate = data.endDate || moment().add(30, 'days').format('YYYY-MM-DD');
    this.duration = data.duration || 30; // in days
    this.isActive = data.isActive || false;
    this.theme = data.theme || {};
    this.rewards = data.rewards || [];
    this.challenges = data.challenges || [];
    this.maps = data.maps || [];
    this.soundtrack = data.soundtrack || '';
    this.createdAt = data.createdAt || moment().toISOString();
    this.updatedAt = data.updatedAt || moment().toISOString();
  }

  // Check if event is currently active
  isCurrentlyActive() {
    const now = moment();
    const start = moment(this.startDate);
    const end = moment(this.endDate);
    return now.isBetween(start, end, 'day', '[]');
  }

  // Get days until event starts
  getDaysUntilStart() {
    const now = moment();
    const start = moment(this.startDate);
    return start.diff(now, 'days');
  }

  // Get days until event ends
  getDaysUntilEnd() {
    const now = moment();
    const end = moment(this.endDate);
    return end.diff(now, 'days');
  }

  // Get event progress percentage
  getProgressPercentage() {
    if (!this.isCurrentlyActive()) return 0;
    
    const now = moment();
    const start = moment(this.startDate);
    const end = moment(this.endDate);
    const totalDuration = end.diff(start, 'days');
    const elapsed = now.diff(start, 'days');
    
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  }

  // Validate event data
  validate() {
    const errors = [];
    
    if (!this.name) errors.push('Event name is required');
    if (!this.startDate) errors.push('Start date is required');
    if (!this.endDate) errors.push('End date is required');
    if (moment(this.endDate).isBefore(moment(this.startDate))) {
      errors.push('End date must be after start date');
    }
    
    return errors;
  }

  // Update event
  update(data) {
    Object.assign(this, data);
    this.updatedAt = moment().toISOString();
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      season: this.season,
      holiday: this.holiday,
      startDate: this.startDate,
      endDate: this.endDate,
      duration: this.duration,
      isActive: this.isActive,
      theme: this.theme,
      rewards: this.rewards,
      challenges: this.challenges,
      maps: this.maps,
      soundtrack: this.soundtrack,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isCurrentlyActive: this.isCurrentlyActive(),
      daysUntilStart: this.getDaysUntilStart(),
      daysUntilEnd: this.getDaysUntilEnd(),
      progressPercentage: this.getProgressPercentage()
    };
  }
}

module.exports = SeasonalEvent;
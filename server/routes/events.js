const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory storage for events
let events = [];

// Create a new team event
router.post('/create', (req, res) => {
  const {
    name,
    description,
    game,
    category,
    region,
    startDate,
    endDate,
    maxTeams = 50,
    minTeamSize = 2,
    maxTeamSize = 4,
    rules,
    rewards
  } = req.body;
  
  if (!name || !game || !startDate || !endDate) {
    return res.status(400).json({ error: 'Event name, game, start date, and end date are required' });
  }
  
  const newEvent = {
    id: uuidv4(),
    name,
    description: description || '',
    game,
    category: category || 'Any%',
    region: region || 'PAL',
    startDate,
    endDate,
    maxTeams,
    minTeamSize,
    maxTeamSize,
    rules: rules || [],
    rewards: rewards || {},
    status: 'upcoming', // upcoming, active, completed
    createdAt: new Date().toISOString(),
    participants: [],
    rankings: []
  };
  
  events.push(newEvent);
  
  res.status(201).json({
    message: 'Team event created successfully!',
    event: newEvent
  });
});

// Get all events
router.get('/', (req, res) => {
  const { status, region } = req.query;
  let filteredEvents = events;
  
  if (status) {
    filteredEvents = filteredEvents.filter(e => e.status === status);
  }
  
  if (region) {
    filteredEvents = filteredEvents.filter(e => e.region === region);
  }
  
  res.json(filteredEvents);
});

// Get event by ID
router.get('/:eventId', (req, res) => {
  const event = events.find(e => e.id === req.params.eventId);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json(event);
});

// Register team for event
router.post('/:eventId/register', (req, res) => {
  const { teamId } = req.body;
  const event = events.find(e => e.id === req.params.eventId);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  if (event.status !== 'upcoming' && event.status !== 'active') {
    return res.status(400).json({ error: 'Event registration is closed' });
  }
  
  if (event.participants.length >= event.maxTeams) {
    return res.status(400).json({ error: 'Event is full' });
  }
  
  if (event.participants.find(p => p.teamId === teamId)) {
    return res.status(400).json({ error: 'Team is already registered for this event' });
  }
  
  event.participants.push({
    teamId,
    registeredAt: new Date().toISOString(),
    status: 'registered'
  });
  
  res.json({
    message: 'Team registered successfully!',
    event
  });
});

// Start event
router.post('/:eventId/start', (req, res) => {
  const event = events.find(e => e.id === req.params.eventId);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  if (event.status !== 'upcoming') {
    return res.status(400).json({ error: 'Event cannot be started' });
  }
  
  event.status = 'active';
  event.startedAt = new Date().toISOString();
  
  res.json({
    message: 'Event started!',
    event
  });
});

// End event
router.post('/:eventId/end', (req, res) => {
  const event = events.find(e => e.id === req.params.eventId);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  if (event.status !== 'active') {
    return res.status(400).json({ error: 'Event is not active' });
  }
  
  event.status = 'completed';
  event.endedAt = new Date().toISOString();
  
  // Calculate final rankings
  // This would typically be done by aggregating team times from the teams collection
  
  res.json({
    message: 'Event completed!',
    event
  });
});

// Get event leaderboard
router.get('/:eventId/leaderboard', (req, res) => {
  const event = events.find(e => e.id === req.params.eventId);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  // This would typically fetch from the teams collection
  // For now, return empty leaderboard
  res.json({
    eventId: event.id,
    eventName: event.name,
    rankings: event.rankings || []
  });
});

// Get event statistics
router.get('/:eventId/stats', (req, res) => {
  const event = events.find(e => e.id === req.params.eventId);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  const stats = {
    totalTeams: event.participants.length,
    activeTeams: event.participants.filter(p => p.status === 'active').length,
    totalSubmissions: 0, // Would be calculated from team submissions
    averageTime: 0, // Would be calculated from team times
    fastestTime: 0, // Would be calculated from team times
    slowestTime: 0 // Would be calculated from team times
  };
  
  res.json(stats);
});

module.exports = router;
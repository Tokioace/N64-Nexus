const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory storage (replace with database in production)
let teams = [];
let teamEvents = [];

// Create a new team
router.post('/create', (req, res) => {
  const { name, captainId, captainName, logo, maxMembers = 4 } = req.body;
  
  if (!name || !captainId || !captainName) {
    return res.status(400).json({ error: 'Team name, captain ID, and captain name are required' });
  }
  
  // Check if user is already in a team
  const existingTeam = teams.find(team => 
    team.members.some(member => member.id === captainId)
  );
  
  if (existingTeam) {
    return res.status(400).json({ error: 'User is already in a team' });
  }
  
  const newTeam = {
    id: uuidv4(),
    name,
    logo: logo || 'default-team',
    captainId,
    maxMembers,
    members: [{
      id: captainId,
      name: captainName,
      role: 'captain',
      joinedAt: new Date().toISOString()
    }],
    createdAt: new Date().toISOString(),
    totalTime: 0,
    events: []
  };
  
  teams.push(newTeam);
  
  res.status(201).json({
    message: 'Team created successfully!',
    team: newTeam
  });
});

// Get all teams
router.get('/', (req, res) => {
  res.json(teams);
});

// Get team by ID
router.get('/:teamId', (req, res) => {
  const team = teams.find(t => t.id === req.params.teamId);
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  res.json(team);
});

// Join team
router.post('/:teamId/join', (req, res) => {
  const { userId, userName } = req.body;
  const team = teams.find(t => t.id === req.params.teamId);
  
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  
  if (team.members.length >= team.maxMembers) {
    return res.status(400).json({ error: 'Team is full' });
  }
  
  // Check if user is already in a team
  const existingTeam = teams.find(t => 
    t.members.some(member => member.id === userId)
  );
  
  if (existingTeam) {
    return res.status(400).json({ error: 'User is already in a team' });
  }
  
  team.members.push({
    id: userId,
    name: userName,
    role: 'member',
    joinedAt: new Date().toISOString()
  });
  
  res.json({
    message: 'Successfully joined team!',
    team
  });
});

// Leave team
router.post('/:teamId/leave', (req, res) => {
  const { userId } = req.body;
  const team = teams.find(t => t.id === req.params.teamId);
  
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  
  const memberIndex = team.members.findIndex(m => m.id === userId);
  if (memberIndex === -1) {
    return res.status(400).json({ error: 'User is not in this team' });
  }
  
  // If captain leaves, disband team if no other members
  if (team.members[memberIndex].role === 'captain' && team.members.length === 1) {
    teams = teams.filter(t => t.id !== req.params.teamId);
    return res.json({ message: 'Team disbanded' });
  }
  
  // If captain leaves, promote first member to captain
  if (team.members[memberIndex].role === 'captain') {
    const nextMember = team.members.find(m => m.id !== userId);
    if (nextMember) {
      nextMember.role = 'captain';
    }
  }
  
  team.members.splice(memberIndex, 1);
  
  res.json({
    message: 'Successfully left team',
    team
  });
});

// Submit team time for event
router.post('/:teamId/submit-time', (req, res) => {
  const { eventId, userId, time, screenshot } = req.body;
  const team = teams.find(t => t.id === req.params.teamId);
  
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  
  // Check if user is in the team
  const member = team.members.find(m => m.id === userId);
  if (!member) {
    return res.status(400).json({ error: 'User is not in this team' });
  }
  
  // Add time submission
  if (!team.events[eventId]) {
    team.events[eventId] = {
      submissions: [],
      totalTime: 0
    };
  }
  
  // Check if user already submitted for this event
  const existingSubmission = team.events[eventId].submissions.find(s => s.userId === userId);
  if (existingSubmission) {
    return res.status(400).json({ error: 'User already submitted a time for this event' });
  }
  
  const submission = {
    userId,
    userName: member.name,
    time,
    screenshot,
    submittedAt: new Date().toISOString()
  };
  
  team.events[eventId].submissions.push(submission);
  team.events[eventId].totalTime += time;
  
  res.json({
    message: 'Time submitted successfully!',
    submission,
    teamTotal: team.events[eventId].totalTime
  });
});

// Get team rankings for an event
router.get('/event/:eventId/rankings', (req, res) => {
  const eventId = req.params.eventId;
  
  const teamRankings = teams
    .filter(team => team.events[eventId] && team.events[eventId].submissions.length > 0)
    .map(team => ({
      teamId: team.id,
      teamName: team.name,
      teamLogo: team.logo,
      members: team.members.map(m => ({ id: m.id, name: m.name })),
      totalTime: team.events[eventId].totalTime,
      submissions: team.events[eventId].submissions,
      memberCount: team.events[eventId].submissions.length
    }))
    .sort((a, b) => a.totalTime - b.totalTime)
    .map((team, index) => ({
      ...team,
      rank: index + 1
    }));
  
  res.json(teamRankings);
});

module.exports = router;
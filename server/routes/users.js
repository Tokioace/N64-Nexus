const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory storage for users
let users = [];

// Create a new user
router.post('/register', (req, res) => {
  const { username, email, avatar } = req.body;
  
  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required' });
  }
  
  // Check if user already exists
  if (users.find(u => u.email === email || u.username === username)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  const newUser = {
    id: uuidv4(),
    username,
    email,
    avatar: avatar || 'default-avatar',
    createdAt: new Date().toISOString(),
    stats: {
      totalEvents: 0,
      totalTeamEvents: 0,
      bestTeamRank: null,
      totalTeamWins: 0,
      totalTeamPodiums: 0,
      averageTeamTime: 0,
      fastestTeamTime: null
    },
    achievements: [],
    teamHistory: [],
    currentTeam: null
  };
  
  users.push(newUser);
  
  res.status(201).json({
    message: 'User registered successfully!',
    user: newUser
  });
});

// Get user by ID
router.get('/:userId', (req, res) => {
  const user = users.find(u => u.id === req.params.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// Get user achievements
router.get('/:userId/achievements', (req, res) => {
  const user = users.find(u => u.id === req.params.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    userId: user.id,
    username: user.username,
    achievements: user.achievements
  });
});

// Get user team history
router.get('/:userId/team-history', (req, res) => {
  const user = users.find(u => u.id === req.params.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    userId: user.id,
    username: user.username,
    teamHistory: user.teamHistory
  });
});

// Update user stats after team event
router.post('/:userId/update-stats', (req, res) => {
  const { eventId, teamId, teamRank, teamTime, personalTime } = req.body;
  const user = users.find(u => u.id === req.params.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Update stats
  user.stats.totalTeamEvents += 1;
  
  if (teamRank === 1) {
    user.stats.totalTeamWins += 1;
  }
  
  if (teamRank <= 3) {
    user.stats.totalTeamPodiums += 1;
  }
  
  if (!user.stats.bestTeamRank || teamRank < user.stats.bestTeamRank) {
    user.stats.bestTeamRank = teamRank;
  }
  
  if (!user.stats.fastestTeamTime || teamTime < user.stats.fastestTeamTime) {
    user.stats.fastestTeamTime = teamTime;
  }
  
  // Add to team history
  user.teamHistory.push({
    eventId,
    teamId,
    teamRank,
    teamTime,
    personalTime,
    date: new Date().toISOString()
  });
  
  // Check for achievements
  checkAndAwardAchievements(user);
  
  res.json({
    message: 'Stats updated successfully!',
    user: {
      id: user.id,
      username: user.username,
      stats: user.stats,
      achievements: user.achievements
    }
  });
});

// Award achievement to user
router.post('/:userId/award-achievement', (req, res) => {
  const { achievementId, achievementName, description, icon } = req.body;
  const user = users.find(u => u.id === req.params.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Check if achievement already awarded
  if (user.achievements.find(a => a.id === achievementId)) {
    return res.status(400).json({ error: 'Achievement already awarded' });
  }
  
  const achievement = {
    id: achievementId,
    name: achievementName,
    description,
    icon,
    awardedAt: new Date().toISOString()
  };
  
  user.achievements.push(achievement);
  
  res.json({
    message: 'Achievement awarded!',
    achievement,
    user: {
      id: user.id,
      username: user.username,
      achievements: user.achievements
    }
  });
});

// Get leaderboard
router.get('/leaderboard/teams', (req, res) => {
  const { region, timeFrame } = req.query;
  
  // This would typically aggregate data from team events
  // For now, return mock data
  const leaderboard = users
    .filter(user => user.stats.totalTeamEvents > 0)
    .map(user => ({
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      stats: user.stats
    }))
    .sort((a, b) => b.stats.totalTeamWins - a.stats.totalTeamWins)
    .slice(0, 50);
  
  res.json(leaderboard);
});

// Helper function to check and award achievements
function checkAndAwardAchievements(user) {
  const achievements = [
    {
      id: 'team-titan',
      name: 'Team Titan',
      description: 'Win your first team event',
      condition: () => user.stats.totalTeamWins >= 1
    },
    {
      id: 'golden-group',
      name: 'Golden Group',
      description: 'Achieve 3 team podium finishes',
      condition: () => user.stats.totalTeamPodiums >= 3
    },
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      description: 'Set a team time under 2 hours',
      condition: () => user.stats.fastestTeamTime && user.stats.fastestTeamTime < 7200
    },
    {
      id: 'team-veteran',
      name: 'Team Veteran',
      description: 'Participate in 10 team events',
      condition: () => user.stats.totalTeamEvents >= 10
    }
  ];
  
  achievements.forEach(achievement => {
    if (achievement.condition() && !user.achievements.find(a => a.id === achievement.id)) {
      user.achievements.push({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.id,
        awardedAt: new Date().toISOString()
      });
    }
  });
}

module.exports = router;
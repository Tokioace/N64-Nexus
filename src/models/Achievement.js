const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['collection', 'quiz', 'event', 'social', 'special'],
    required: true
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  points: {
    type: Number,
    default: 0
  },
  requirements: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  unlockDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Static method to get all achievements
achievementSchema.statics.getAllAchievements = function() {
  return this.find({ isActive: true }).sort({ category: 1, rarity: 1 });
};

// Static method to get achievements by category
achievementSchema.statics.getByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ rarity: 1 });
};

// Static method to get rare achievements
achievementSchema.statics.getRareAchievements = function() {
  return this.find({ 
    rarity: { $in: ['rare', 'epic', 'legendary'] }, 
    isActive: true 
  }).sort({ rarity: 1 });
};

module.exports = mongoose.model('Achievement', achievementSchema);

// Predefined achievements data
const predefinedAchievements = [
  // Collection Achievements
  {
    id: 'first_game',
    name: 'First Steps',
    description: 'Add your first game to your collection',
    icon: '🎮',
    category: 'collection',
    rarity: 'common',
    points: 50,
    requirements: { gamesCollected: 1 }
  },
  {
    id: 'collector_10',
    name: 'Growing Collection',
    description: 'Collect 10 games',
    icon: '📦',
    category: 'collection',
    rarity: 'common',
    points: 100,
    requirements: { gamesCollected: 10 }
  },
  {
    id: 'collector_50',
    name: 'Serious Collector',
    description: 'Collect 50 games',
    icon: '🏆',
    category: 'collection',
    rarity: 'uncommon',
    points: 250,
    requirements: { gamesCollected: 50 }
  },
  {
    id: 'collector_100',
    name: 'Century Club',
    description: 'Collect 100 games',
    icon: '💎',
    category: 'collection',
    rarity: 'rare',
    points: 500,
    requirements: { gamesCollected: 100 }
  },
  {
    id: 'full_set_genre',
    name: 'Full Set Freak',
    description: 'Complete a collection of any genre',
    icon: '🎯',
    category: 'collection',
    rarity: 'epic',
    points: 300,
    requirements: { collectionSets: 1 }
  },
  {
    id: 'mint_condition',
    name: 'Mint Condition',
    description: 'Add a game in mint condition',
    icon: '✨',
    category: 'collection',
    rarity: 'uncommon',
    points: 150,
    requirements: { mintGames: 1 }
  },

  // Quiz Achievements
  {
    id: 'quiz_first',
    name: 'Quiz Newbie',
    description: 'Complete your first quiz',
    icon: '❓',
    category: 'quiz',
    rarity: 'common',
    points: 25,
    requirements: { quizzesCompleted: 1 }
  },
  {
    id: 'quiz_10',
    name: 'Quiz Enthusiast',
    description: 'Complete 10 quizzes',
    icon: '🧠',
    category: 'quiz',
    rarity: 'common',
    points: 100,
    requirements: { quizzesCompleted: 10 }
  },
  {
    id: 'quiz_50',
    name: 'Quiz Master',
    description: 'Complete 50 quizzes',
    icon: '🎓',
    category: 'quiz',
    rarity: 'uncommon',
    points: 250,
    requirements: { quizzesCompleted: 50 }
  },
  {
    id: 'quiz_100',
    name: 'Trivia Champ',
    description: 'Complete 100 quizzes',
    icon: '👑',
    category: 'quiz',
    rarity: 'rare',
    points: 500,
    requirements: { quizzesCompleted: 100 }
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Get a perfect score on any quiz',
    icon: '💯',
    category: 'quiz',
    rarity: 'uncommon',
    points: 200,
    requirements: { perfectScores: 1 }
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a quiz in under 30 seconds',
    icon: '⚡',
    category: 'quiz',
    rarity: 'rare',
    points: 300,
    requirements: { speedQuiz: true }
  },

  // Event Achievements
  {
    id: 'event_first',
    name: 'Event Participant',
    description: 'Participate in your first event',
    icon: '🎪',
    category: 'event',
    rarity: 'common',
    points: 50,
    requirements: { eventsParticipated: 1 }
  },
  {
    id: 'event_winner',
    name: 'Event Champion',
    description: 'Win first place in an event',
    icon: '🥇',
    category: 'event',
    rarity: 'epic',
    points: 400,
    requirements: { eventWins: 1 }
  },
  {
    id: 'event_top3',
    name: 'Top 3 Finisher',
    description: 'Finish in the top 3 of an event',
    icon: '🏅',
    category: 'event',
    rarity: 'rare',
    points: 300,
    requirements: { top3Finishes: 1 }
  },
  {
    id: 'event_regular',
    name: 'Event Regular',
    description: 'Participate in 10 events',
    icon: '🎭',
    category: 'event',
    rarity: 'uncommon',
    points: 200,
    requirements: { eventsParticipated: 10 }
  },

  // Social Achievements
  {
    id: 'first_friend',
    name: 'Social Butterfly',
    description: 'Add your first friend',
    icon: '🤝',
    category: 'social',
    rarity: 'common',
    points: 50,
    requirements: { friendsCount: 1 }
  },
  {
    id: 'friend_network',
    name: 'Friend Network',
    description: 'Add 10 friends',
    icon: '👥',
    category: 'social',
    rarity: 'uncommon',
    points: 150,
    requirements: { friendsCount: 10 }
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Add 50 friends',
    icon: '🦋',
    category: 'social',
    rarity: 'rare',
    points: 300,
    requirements: { friendsCount: 50 }
  },
  {
    id: 'profile_complete',
    name: 'Profile Complete',
    description: 'Complete your profile with bio and avatar',
    icon: '📝',
    category: 'social',
    rarity: 'common',
    points: 75,
    requirements: { profileComplete: true }
  },

  // Special Achievements
  {
    id: 'daily_login_7',
    name: 'Week Warrior',
    description: 'Log in for 7 consecutive days',
    icon: '📅',
    category: 'special',
    rarity: 'uncommon',
    points: 150,
    requirements: { consecutiveLogins: 7 }
  },
  {
    id: 'daily_login_30',
    name: 'Monthly Master',
    description: 'Log in for 30 consecutive days',
    icon: '📆',
    category: 'special',
    rarity: 'rare',
    points: 400,
    requirements: { consecutiveLogins: 30 }
  },
  {
    id: 'daily_login_100',
    name: 'Century Streak',
    description: 'Log in for 100 consecutive days',
    icon: '🔥',
    category: 'special',
    rarity: 'legendary',
    points: 1000,
    requirements: { consecutiveLogins: 100 }
  },
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Join during the beta phase',
    icon: '🚀',
    category: 'special',
    rarity: 'rare',
    points: 200,
    requirements: { joinDate: { $lt: new Date('2024-01-01') } }
  },
  {
    id: 'level_10',
    name: 'Level 10 Reached',
    description: 'Reach level 10',
    icon: '⭐',
    category: 'special',
    rarity: 'uncommon',
    points: 200,
    requirements: { level: 10 }
  },
  {
    id: 'level_25',
    name: 'Level 25 Reached',
    description: 'Reach level 25',
    icon: '🌟🌟',
    category: 'special',
    rarity: 'rare',
    points: 500,
    requirements: { level: 25 }
  },
  {
    id: 'level_50',
    name: 'Level 50 Reached',
    description: 'Reach level 50',
    icon: '🌟🌟🌟',
    category: 'special',
    rarity: 'legendary',
    points: 1000,
    requirements: { level: 50 }
  }
];

// Export predefined achievements for seeding
module.exports.predefinedAchievements = predefinedAchievements;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    displayName: String,
    avatar: String,
    bio: String,
    location: String,
    joinDate: {
      type: Date,
      default: Date.now
    },
    lastLogin: Date,
    isPublic: {
      type: Boolean,
      default: false
    }
  },
  // Ranking System
  ranking: {
    level: {
      type: Number,
      default: 1,
      min: 1
    },
    experience: {
      type: Number,
      default: 0,
      min: 0
    },
    totalPoints: {
      type: Number,
      default: 0,
      min: 0
    },
    currentTitle: {
      type: String,
      default: 'Newcomer'
    },
    unlockedTitles: [{
      type: String,
      default: ['Newcomer']
    }],
    rank: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Retro King'],
      default: 'Bronze'
    }
  },
  // Achievement System
  achievements: {
    badges: [{
      id: String,
      name: String,
      description: String,
      icon: String,
      unlockedAt: {
        type: Date,
        default: Date.now
      },
      category: {
        type: String,
        enum: ['collection', 'quiz', 'event', 'social', 'special']
      }
    }],
    stats: {
      gamesCollected: { type: Number, default: 0 },
      quizzesCompleted: { type: Number, default: 0 },
      eventsParticipated: { type: Number, default: 0 },
      daysLoggedIn: { type: Number, default: 0 },
      perfectScores: { type: Number, default: 0 },
      collectionSets: { type: Number, default: 0 }
    }
  },
  // Activity Tracking
  activity: {
    lastDailyLogin: Date,
    consecutiveLogins: { type: Number, default: 0 },
    totalLogins: { type: Number, default: 0 },
    pointsHistory: [{
      amount: Number,
      source: {
        type: String,
        enum: ['collection', 'quiz', 'event', 'daily_login', 'achievement', 'social']
      },
      description: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  },
  // Collections & Game Data
  collections: [{
    gameId: String,
    title: String,
    genre: String,
    acquiredAt: {
      type: Date,
      default: Date.now
    },
    condition: {
      type: String,
      enum: ['mint', 'excellent', 'good', 'fair', 'poor'],
      default: 'good'
    }
  }],
  // Social Features
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  friendRequests: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    sentAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Settings
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true },
      levelUps: { type: Boolean, default: true }
    },
    privacy: {
      showLevel: { type: Boolean, default: true },
      showAchievements: { type: Boolean, default: true },
      showCollections: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
userSchema.index({ 'ranking.level': -1, 'ranking.totalPoints': -1 });
userSchema.index({ 'achievements.stats.gamesCollected': -1 });
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

// Virtual for experience to next level
userSchema.virtual('experienceToNextLevel').get(function() {
  const currentLevel = this.ranking.level;
  const currentExp = this.ranking.experience;
  const expForNextLevel = currentLevel * 500; // 500 points per level
  return Math.max(0, expForNextLevel - currentExp);
});

// Virtual for progress percentage
userSchema.virtual('levelProgress').get(function() {
  const currentLevel = this.ranking.level;
  const currentExp = this.ranking.experience;
  const expForCurrentLevel = (currentLevel - 1) * 500;
  const expForNextLevel = currentLevel * 500;
  const progressInLevel = currentExp - expForCurrentLevel;
  const levelRange = expForNextLevel - expForCurrentLevel;
  return Math.min(100, Math.max(0, (progressInLevel / levelRange) * 100));
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to add points and check for level up
userSchema.methods.addPoints = function(amount, source, description) {
  const oldLevel = this.ranking.level;
  this.ranking.totalPoints += amount;
  this.ranking.experience += amount;
  
  // Check for level up
  const newLevel = Math.floor(this.ranking.experience / 500) + 1;
  if (newLevel > oldLevel) {
    this.ranking.level = newLevel;
    this.checkTitleUnlock();
  }
  
  // Add to points history
  this.activity.pointsHistory.push({
    amount,
    source,
    description,
    timestamp: new Date()
  });
  
  return {
    oldLevel,
    newLevel: this.ranking.level,
    leveledUp: newLevel > oldLevel
  };
};

// Method to check and unlock titles
userSchema.methods.checkTitleUnlock = function() {
  const level = this.ranking.level;
  const titles = {
    1: 'Cartridge Kid',
    5: 'Pixel Hero',
    10: '64-Bit General',
    15: 'Retro Warrior',
    20: 'Legend of Retro',
    25: 'Nintendo Master',
    30: 'Collector Supreme',
    35: 'Retro Champion',
    40: 'Ultra64 Mastermind',
    50: 'Retro God'
  };
  
  if (titles[level] && !this.ranking.unlockedTitles.includes(titles[level])) {
    this.ranking.unlockedTitles.push(titles[level]);
    this.ranking.currentTitle = titles[level];
    return titles[level];
  }
  
  return null;
};

// Method to unlock achievement
userSchema.methods.unlockAchievement = function(achievement) {
  const existingBadge = this.achievements.badges.find(badge => badge.id === achievement.id);
  if (!existingBadge) {
    this.achievements.badges.push({
      ...achievement,
      unlockedAt: new Date()
    });
    return true;
  }
  return false;
};

// Method to get public profile data
userSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    username: this.username,
    profile: {
      displayName: this.profile.displayName || this.username,
      avatar: this.profile.avatar,
      bio: this.profile.bio,
      joinDate: this.profile.joinDate
    },
    ranking: {
      level: this.settings.privacy.showLevel ? this.ranking.level : null,
      currentTitle: this.ranking.currentTitle,
      rank: this.ranking.rank
    },
    achievements: {
      badges: this.settings.privacy.showAchievements ? this.achievements.badges : [],
      stats: this.settings.privacy.showAchievements ? this.achievements.stats : null
    },
    collections: this.settings.privacy.showCollections ? this.collections.length : null
  };
};

module.exports = mongoose.model('User', userSchema);
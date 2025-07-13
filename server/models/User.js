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
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profilePicture: {
    type: String,
    default: '/default-avatar.png'
  },
  region: {
    type: String,
    enum: ['PAL', 'NTSC', 'Both'],
    default: 'Both'
  },
  points: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  badges: [{
    name: String,
    description: String,
    earnedAt: {
      type: Date,
      default: Date.now
    },
    icon: String
  }],
  eventStats: {
    totalEvents: { type: Number, default: 0 },
    totalWins: { type: Number, default: 0 },
    totalPodiums: { type: Number, default: 0 },
    bestTime: { type: Number, default: null },
    favoriteGame: { type: String, default: null }
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate level based on points
userSchema.methods.calculateLevel = function() {
  return Math.floor(this.points / 100) + 1;
};

// Add points and update level
userSchema.methods.addPoints = function(points) {
  this.points += points;
  this.level = this.calculateLevel();
  return this.save();
};

// Add badge
userSchema.methods.addBadge = function(badge) {
  const existingBadge = this.badges.find(b => b.name === badge.name);
  if (!existingBadge) {
    this.badges.push(badge);
    return this.save();
  }
  return Promise.resolve(this);
};

module.exports = mongoose.model('User', userSchema);
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
  avatar: {
    type: String,
    default: ''
  },
  region: {
    type: String,
    required: true,
    enum: [
      'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen',
      'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen',
      'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen',
      'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen'
    ]
  },
  // XP and Ranking System
  xp: {
    type: Number,
    default: 0
  },
  rank: {
    type: String,
    default: 'Rookie Trader',
    enum: ['Rookie Trader', 'Master Swapper', 'Archivkönig']
  },
  // Trading Statistics
  tradesCompleted: {
    type: Number,
    default: 0
  },
  tradesOffered: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  // Collection Stats
  collectionSize: {
    type: Number,
    default: 0
  },
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
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

// Method to add XP and update rank
userSchema.methods.addXP = function(amount) {
  this.xp += amount;
  
  // Update rank based on XP and trades
  if (this.tradesCompleted >= 10 && this.collectionSize >= 50) {
    this.rank = 'Archivkönig';
  } else if (this.tradesCompleted >= 10) {
    this.rank = 'Master Swapper';
  } else if (this.tradesCompleted >= 1) {
    this.rank = 'Rookie Trader';
  }
  
  return this.save();
};

// Method to update rating
userSchema.methods.updateRating = function(newRating) {
  const totalRating = this.rating.average * this.rating.count + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save();
};

// Virtual for rank progress
userSchema.virtual('rankProgress').get(function() {
  switch (this.rank) {
    case 'Rookie Trader':
      return Math.min(this.tradesCompleted / 10 * 100, 100);
    case 'Master Swapper':
      return Math.min(this.collectionSize / 50 * 100, 100);
    case 'Archivkönig':
      return 100;
    default:
      return 0;
  }
});

// Ensure virtuals are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
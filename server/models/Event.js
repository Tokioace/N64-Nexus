const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  game: {
    name: {
      type: String,
      required: true
    },
    stage: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['Any%', '100%', 'Glitchless', 'Custom'],
      default: 'Any%'
    }
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  region: {
    type: String,
    enum: ['PAL', 'NTSC', 'Both'],
    default: 'Both'
  },
  screenshotRequired: {
    type: Boolean,
    default: true
  },
  maxSubmissions: {
    type: Number,
    default: 3
  },
  scoring: {
    points: {
      first: { type: Number, default: 100 },
      second: { type: Number, default: 75 },
      third: { type: Number, default: 50 },
      participation: { type: Number, default: 10 }
    },
    timeBonus: {
      enabled: { type: Boolean, default: true },
      threshold: { type: Number, default: 0 } // Time in seconds for bonus points
    }
  },
  status: {
    type: String,
    enum: ['draft', 'upcoming', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  submissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission'
  }],
  leaderboard: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    time: Number,
    position: Number,
    points: Number,
    region: String,
    submittedAt: Date
  }],
  chatEnabled: {
    type: Boolean,
    default: true
  },
  chatMessages: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

// Indexes for better query performance
eventSchema.index({ status: 1, startTime: 1 });
eventSchema.index({ 'game.name': 1, 'game.stage': 1 });
eventSchema.index({ region: 1 });

// Virtual for checking if event is active
eventSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.startTime <= now && this.endTime >= now;
});

// Virtual for checking if event is upcoming
eventSchema.virtual('isUpcoming').get(function() {
  const now = new Date();
  return this.startTime > now;
});

// Virtual for checking if event is completed
eventSchema.virtual('isCompleted').get(function() {
  const now = new Date();
  return this.endTime < now;
});

// Method to update leaderboard
eventSchema.methods.updateLeaderboard = async function() {
  const submissions = await mongoose.model('Submission').find({
    event: this._id,
    status: 'approved'
  }).populate('user').sort('time');

  this.leaderboard = submissions.map((submission, index) => ({
    user: submission.user._id,
    time: submission.time,
    position: index + 1,
    points: this.calculatePoints(index + 1),
    region: submission.user.region,
    submittedAt: submission.createdAt
  }));

  return this.save();
};

// Method to calculate points based on position
eventSchema.methods.calculatePoints = function(position) {
  if (position === 1) return this.scoring.points.first;
  if (position === 2) return this.scoring.points.second;
  if (position === 3) return this.scoring.points.third;
  return this.scoring.points.participation;
};

// Method to get current participants count
eventSchema.methods.getParticipantsCount = function() {
  return this.participants.length;
};

// Method to check if user can participate
eventSchema.methods.canParticipate = function(userId) {
  return !this.participants.some(p => p.user.toString() === userId.toString());
};

module.exports = mongoose.model('Event', eventSchema);
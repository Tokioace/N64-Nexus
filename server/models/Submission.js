const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  time: {
    type: Number, // Time in milliseconds
    required: true
  },
  timeString: {
    type: String, // Human readable format (e.g., "1:23.456")
    required: true
  },
  screenshot: {
    filename: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  ocrResult: {
    detectedTime: String,
    confidence: Number,
    processed: {
      type: Boolean,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'disqualified'],
    default: 'pending'
  },
  region: {
    type: String,
    enum: ['PAL', 'NTSC'],
    required: true
  },
  notes: {
    type: String,
    maxlength: 500
  },
  adminNotes: {
    type: String,
    maxlength: 1000
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  position: {
    type: Number,
    default: null
  },
  points: {
    type: Number,
    default: 0
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  verificationData: {
    deviceInfo: String,
    ipAddress: String,
    userAgent: String
  }
}, {
  timestamps: true
});

// Indexes
submissionSchema.index({ event: 1, user: 1 });
submissionSchema.index({ event: 1, time: 1 });
submissionSchema.index({ status: 1, createdAt: 1 });

// Virtual for formatted time
submissionSchema.virtual('formattedTime').get(function() {
  const minutes = Math.floor(this.time / 60000);
  const seconds = Math.floor((this.time % 60000) / 1000);
  const milliseconds = Math.floor((this.time % 1000) / 10);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
});

// Method to format time from milliseconds
submissionSchema.statics.formatTime = function(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const ms = Math.floor((milliseconds % 1000) / 10);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
};

// Method to parse time string to milliseconds
submissionSchema.statics.parseTime = function(timeString) {
  const match = timeString.match(/^(\d+):(\d{2})\.(\d{2,3})$/);
  if (!match) return null;
  
  const minutes = parseInt(match[1]);
  const seconds = parseInt(match[2]);
  const milliseconds = parseInt(match[3].padEnd(3, '0'));
  
  return minutes * 60000 + seconds * 1000 + milliseconds;
};

// Pre-save middleware to update timeString
submissionSchema.pre('save', function(next) {
  if (this.isModified('time')) {
    this.timeString = this.constructor.formatTime(this.time);
  }
  next();
});

// Method to approve submission
submissionSchema.methods.approve = function(adminId) {
  this.status = 'approved';
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  return this.save();
};

// Method to reject submission
submissionSchema.methods.reject = function(adminId, notes) {
  this.status = 'rejected';
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  this.adminNotes = notes;
  return this.save();
};

// Method to disqualify submission
submissionSchema.methods.disqualify = function(adminId, notes) {
  this.status = 'disqualified';
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  this.adminNotes = notes;
  return this.save();
};

// Static method to get user's best time for an event
submissionSchema.statics.getUserBestTime = function(eventId, userId) {
  return this.findOne({
    event: eventId,
    user: userId,
    status: 'approved'
  }).sort('time');
};

// Static method to get leaderboard for an event
submissionSchema.statics.getEventLeaderboard = function(eventId, region = null) {
  const query = {
    event: eventId,
    status: 'approved'
  };
  
  if (region) {
    query.region = region;
  }
  
  return this.find(query)
    .populate('user', 'username profilePicture region')
    .sort('time')
    .limit(100);
};

module.exports = mongoose.model('Submission', submissionSchema);
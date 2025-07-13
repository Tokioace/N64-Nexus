const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Spiele', 'Merchandise', 'Zubehör']
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  condition: {
    type: String,
    required: true,
    enum: ['Neu', 'Gut', 'Okay', 'Defekt']
  },
  lookingFor: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  tradeOnlyFor: {
    type: String,
    trim: true,
    maxlength: 200
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
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
  status: {
    type: String,
    default: 'Offen',
    enum: ['Offen', 'In Verhandlung', 'Abgeschlossen', 'Storniert']
  },
  // Interest tracking
  interestedUsers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500
    },
    contactedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Accepted', 'Declined']
    }
  }],
  // Trade completion
  completedWith: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completedAt: {
      type: Date
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  // Visibility and moderation
  isActive: {
    type: Boolean,
    default: true
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: {
    type: String,
    trim: true
  },
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
tradeSchema.index({ category: 1, status: 1, region: 1 });
tradeSchema.index({ owner: 1, status: 1 });
tradeSchema.index({ createdAt: -1 });

// Pre-save middleware to update updatedAt
tradeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to add interested user
tradeSchema.methods.addInterestedUser = function(userId, message) {
  const existingInterest = this.interestedUsers.find(
    interest => interest.user.toString() === userId.toString()
  );
  
  if (existingInterest) {
    existingInterest.message = message;
    existingInterest.contactedAt = new Date();
  } else {
    this.interestedUsers.push({
      user: userId,
      message: message
    });
  }
  
  return this.save();
};

// Method to complete trade
tradeSchema.methods.completeTrade = function(userId, rating, review) {
  this.status = 'Abgeschlossen';
  this.completedWith = {
    user: userId,
    completedAt: new Date(),
    rating: rating,
    review: review
  };
  
  return this.save();
};

// Method to increment views
tradeSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Virtual for trade age
tradeSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  return Math.floor((now - created) / (1000 * 60 * 60 * 24));
});

// Virtual for interest count
tradeSchema.virtual('interestCount').get(function() {
  return this.interestedUsers.length;
});

// Ensure virtuals are serialized
tradeSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Trade', tradeSchema);
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  originalTitle: {
    type: String,
    trim: true
  },
  publisher: {
    type: String,
    required: true,
    trim: true
  },
  developer: {
    type: String,
    required: true,
    trim: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  region: {
    type: String,
    enum: ['NTSC-U', 'NTSC-J', 'PAL'],
    default: 'NTSC-U'
  },
  genre: {
    type: String,
    required: true,
    enum: [
      'Action', 'Adventure', 'Racing', 'Sports', 'Platformer', 'RPG', 
      'Strategy', 'Puzzle', 'Fighting', 'Shooter', 'Simulation', 'Music',
      'Educational', 'Party', 'Miscellaneous'
    ]
  },
  subGenres: [{
    type: String,
    trim: true
  }],
  rating: {
    type: String,
    enum: ['E', 'T', 'M', 'K-A', 'AO', 'RP'],
    default: 'E'
  },
  players: {
    min: {
      type: Number,
      default: 1,
      min: 1
    },
    max: {
      type: Number,
      default: 1,
      min: 1
    }
  },
  // Collection data
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'very_rare', 'ultra_rare'],
    default: 'common'
  },
  estimatedValue: {
    type: Number,
    min: 0,
    default: 0
  },
  // Media and assets
  coverImage: {
    type: String,
    required: true
  },
  screenshots: [{
    type: String
  }],
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String,
    trim: true
  }],
  // Gameplay data
  averageRating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0,
    min: 0
  },
  // Achievement data
  achievementPoints: {
    type: Number,
    default: 50,
    min: 0
  },
  // Collection set data
  collectionSet: {
    name: String,
    description: String,
    gamesInSet: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game'
    }]
  },
  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  trivia: [{
    question: String,
    answer: String,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    }
  }]
}, {
  timestamps: true
});

// Indexes for performance
gameSchema.index({ title: 1 });
gameSchema.index({ genre: 1 });
gameSchema.index({ publisher: 1 });
gameSchema.index({ rarity: 1 });
gameSchema.index({ 'collectionSet.name': 1 });
gameSchema.index({ averageRating: -1 });
gameSchema.index({ estimatedValue: -1 });

// Virtual for full title with region
gameSchema.virtual('fullTitle').get(function() {
  return `${this.title} (${this.region})`;
});

// Virtual for player count display
gameSchema.virtual('playerCount').get(function() {
  if (this.players.min === this.players.max) {
    return `${this.players.min} Player`;
  }
  return `${this.players.min}-${this.players.max} Players`;
});

// Static method to get games by genre
gameSchema.statics.getByGenre = function(genre) {
  return this.find({ genre, isActive: true }).sort({ title: 1 });
};

// Static method to get rare games
gameSchema.statics.getRareGames = function() {
  return this.find({ 
    rarity: { $in: ['rare', 'very_rare', 'ultra_rare'] }, 
    isActive: true 
  }).sort({ rarity: 1, title: 1 });
};

// Static method to get collection sets
gameSchema.statics.getCollectionSets = function() {
  return this.aggregate([
    { $match: { 'collectionSet.name': { $exists: true, $ne: null } } },
    { $group: { 
      _id: '$collectionSet.name', 
      games: { $push: '$$ROOT' },
      description: { $first: '$collectionSet.description' }
    }},
    { $sort: { _id: 1 } }
  ]);
};

// Static method to search games
gameSchema.statics.searchGames = function(query) {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { publisher: { $regex: query, $options: 'i' } },
          { developer: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }
    ]
  }).sort({ title: 1 });
};

// Method to update average rating
gameSchema.methods.updateAverageRating = function(newRating) {
  const totalRatings = this.totalRatings + 1;
  const newAverage = ((this.averageRating * this.totalRatings) + newRating) / totalRatings;
  
  this.averageRating = Math.round(newAverage * 10) / 10;
  this.totalRatings = totalRatings;
  
  return this.save();
};

// Method to get related games
gameSchema.methods.getRelatedGames = function(limit = 5) {
  return this.constructor.find({
    $and: [
      { _id: { $ne: this._id } },
      { isActive: true },
      {
        $or: [
          { genre: this.genre },
          { publisher: this.publisher },
          { developer: this.developer },
          { tags: { $in: this.tags } }
        ]
      }
    ]
  })
  .limit(limit)
  .sort({ averageRating: -1 });
};

module.exports = mongoose.model('Game', gameSchema);

// Sample N64 games data for seeding
const sampleGames = [
  {
    title: 'Super Mario 64',
    originalTitle: 'スーパーマリオ64',
    publisher: 'Nintendo',
    developer: 'Nintendo EAD',
    releaseDate: new Date('1996-06-23'),
    region: 'NTSC-U',
    genre: 'Platformer',
    subGenres: ['3D Platformer', 'Adventure'],
    rating: 'E',
    players: { min: 1, max: 1 },
    rarity: 'common',
    estimatedValue: 25,
    coverImage: '/images/games/super-mario-64.jpg',
    description: 'The revolutionary 3D platformer that defined a generation. Mario must collect Power Stars to rescue Princess Peach from Bowser.',
    features: ['3D Movement', 'Power Stars', 'Multiple Worlds', 'Cap Abilities'],
    averageRating: 9.6,
    totalRatings: 1250,
    achievementPoints: 100,
    tags: ['classic', '3d-platformer', 'nintendo', 'mario'],
    trivia: [
      {
        question: 'How many Power Stars are there in Super Mario 64?',
        answer: '120',
        difficulty: 'easy'
      },
      {
        question: 'What is the name of Mario\'s cap that allows him to fly?',
        answer: 'Wing Cap',
        difficulty: 'medium'
      }
    ]
  },
  {
    title: 'The Legend of Zelda: Ocarina of Time',
    originalTitle: 'ゼルダの伝説 時のオカリナ',
    publisher: 'Nintendo',
    developer: 'Nintendo EAD',
    releaseDate: new Date('1998-11-21'),
    region: 'NTSC-U',
    genre: 'Adventure',
    subGenres: ['Action-Adventure', 'RPG'],
    rating: 'E',
    players: { min: 1, max: 1 },
    rarity: 'common',
    estimatedValue: 35,
    coverImage: '/images/games/zelda-ocarina-of-time.jpg',
    description: 'Link embarks on an epic quest through time to prevent Ganondorf from obtaining the Triforce and conquering Hyrule.',
    features: ['Time Travel', 'Ocarina Songs', 'Dungeons', 'Horse Riding'],
    averageRating: 9.8,
    totalRatings: 980,
    achievementPoints: 150,
    tags: ['classic', 'adventure', 'nintendo', 'zelda', 'ocarina'],
    trivia: [
      {
        question: 'What is the name of Link\'s horse in Ocarina of Time?',
        answer: 'Epona',
        difficulty: 'easy'
      },
      {
        question: 'How many dungeons are there in the main quest?',
        answer: '9',
        difficulty: 'medium'
      }
    ]
  },
  {
    title: 'GoldenEye 007',
    publisher: 'Nintendo',
    developer: 'Rare',
    releaseDate: new Date('1997-08-25'),
    region: 'NTSC-U',
    genre: 'Shooter',
    subGenres: ['First-Person Shooter', 'Action'],
    rating: 'T',
    players: { min: 1, max: 4 },
    rarity: 'common',
    estimatedValue: 30,
    coverImage: '/images/games/goldeneye-007.jpg',
    description: 'Based on the James Bond film, this revolutionary FPS features both single-player missions and multiplayer deathmatches.',
    features: ['Multiplayer', 'Different Weapons', 'Mission Objectives', 'Cheat Codes'],
    averageRating: 9.2,
    totalRatings: 750,
    achievementPoints: 120,
    tags: ['fps', 'multiplayer', 'rare', 'james-bond', 'classic'],
    trivia: [
      {
        question: 'What is the name of the first level in GoldenEye 007?',
        answer: 'Dam',
        difficulty: 'easy'
      },
      {
        question: 'How many different difficulty levels are there?',
        answer: '3 (Agent, Secret Agent, 00 Agent)',
        difficulty: 'medium'
      }
    ]
  },
  {
    title: 'Mario Kart 64',
    publisher: 'Nintendo',
    developer: 'Nintendo EAD',
    releaseDate: new Date('1997-02-10'),
    region: 'NTSC-U',
    genre: 'Racing',
    subGenres: ['Kart Racing', 'Party'],
    rating: 'E',
    players: { min: 1, max: 4 },
    rarity: 'common',
    estimatedValue: 28,
    coverImage: '/images/games/mario-kart-64.jpg',
    description: 'The classic kart racing game featuring Mario and friends competing on various tracks with power-ups and items.',
    features: ['4-Player Multiplayer', 'Power-ups', 'Multiple Cups', 'Battle Mode'],
    averageRating: 8.9,
    totalRatings: 650,
    achievementPoints: 80,
    tags: ['racing', 'multiplayer', 'nintendo', 'mario', 'party-game'],
    trivia: [
      {
        question: 'How many different cups are there in Mario Kart 64?',
        answer: '4 (Mushroom, Flower, Star, Special)',
        difficulty: 'easy'
      },
      {
        question: 'What is the name of the final track in the Special Cup?',
        answer: 'Rainbow Road',
        difficulty: 'medium'
      }
    ]
  },
  {
    title: 'Banjo-Kazooie',
    publisher: 'Nintendo',
    developer: 'Rare',
    releaseDate: new Date('1998-06-29'),
    region: 'NTSC-U',
    genre: 'Platformer',
    subGenres: ['3D Platformer', 'Collectathon'],
    rating: 'E',
    players: { min: 1, max: 1 },
    rarity: 'uncommon',
    estimatedValue: 45,
    coverImage: '/images/games/banjo-kazooie.jpg',
    description: 'Banjo and Kazooie must collect Jiggies and Musical Notes to rescue Banjo\'s sister Tooty from the evil witch Gruntilda.',
    features: ['Collectathon', 'Multiple Worlds', 'Special Moves', 'Transformation'],
    averageRating: 9.1,
    totalRatings: 420,
    achievementPoints: 110,
    tags: ['platformer', 'rare', 'collectathon', '3d-platformer'],
    trivia: [
      {
        question: 'How many Jiggies are needed to complete the game?',
        answer: '100',
        difficulty: 'medium'
      },
      {
        question: 'What is the name of Banjo\'s sister?',
        answer: 'Tooty',
        difficulty: 'easy'
      }
    ]
  }
];

module.exports.sampleGames = sampleGames;
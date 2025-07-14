const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const cron = require('node-cron');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const GameDatabase = require('./src/database/GameDatabase');
const BirthdayService = require('./src/services/BirthdayService');
const NewsfeedService = require('./src/services/NewsfeedService');
const EventService = require('./src/services/EventService');
const SecurityRoutes = require('./src/routes/securityRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize services
const gameDB = new GameDatabase();
const birthdayService = new BirthdayService(gameDB);
const newsfeedService = new NewsfeedService();
const eventService = new EventService();

// Initialize database and populate with N64 games
async function initializeApp() {
  try {
    await gameDB.initialize();
    await gameDB.populateWithN64Games();
    console.log('✅ Database initialized and populated with N64 games');
    
    // Start the birthday check cron job
    startBirthdayCronJob();
    
  } catch (error) {
    console.error('❌ Error initializing app:', error);
  }
}

// Weekly cron job to check for upcoming birthdays
function startBirthdayCronJob() {
  // Run every Monday at 9:00 AM
  cron.schedule('0 9 * * 1', async () => {
    console.log('🎂 Checking for upcoming game birthdays...');
    try {
      const upcomingBirthdays = await birthdayService.getUpcomingBirthdays();
      
      for (const birthday of upcomingBirthdays) {
        await createBirthdaySpecial(birthday);
      }
      
      console.log(`✅ Processed ${upcomingBirthdays.length} upcoming birthdays`);
    } catch (error) {
      console.error('❌ Error in birthday cron job:', error);
    }
  });
  
  console.log('⏰ Birthday cron job scheduled for Mondays at 9:00 AM');
}

// Create birthday special event and newsfeed post
async function createBirthdaySpecial(birthday) {
  try {
    // Create newsfeed post
    const newsPost = await newsfeedService.createBirthdayPost(birthday);
    
    // Create weekend event
    const event = await eventService.createBirthdayEvent(birthday);
    
    console.log(`🎉 Created birthday special for ${birthday.gameName}`);
    return { newsPost, event };
  } catch (error) {
    console.error(`❌ Error creating birthday special for ${birthday.gameName}:`, error);
  }
}

// API Routes

// Security & Privacy Center routes
app.use('/api/security', SecurityRoutes);

// Get all games
app.get('/api/games', async (req, res) => {
    try {
        const games = await gameDB.getAllGames();
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get upcoming birthdays
app.get('/api/birthdays/upcoming', async (req, res) => {
  try {
    const birthdays = await birthdayService.getUpcomingBirthdays();
    res.json(birthdays);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get newsfeed posts
app.get('/api/newsfeed', async (req, res) => {
  try {
    const posts = await newsfeedService.getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get events
app.get('/api/events', async (req, res) => {
  try {
    const events = await eventService.getAllEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manual trigger for birthday special (for testing)
app.post('/api/birthdays/trigger/:gameId', async (req, res) => {
  try {
    const game = await gameDB.getGameById(req.params.gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    const birthday = await birthdayService.createBirthdayFromGame(game);
    const result = await createBirthdaySpecial(birthday);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Battle64 Birthday Special Server running on port ${PORT}`);
  initializeApp();
});

module.exports = app;
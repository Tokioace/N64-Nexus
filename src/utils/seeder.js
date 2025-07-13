const mongoose = require('mongoose');
const User = require('../models/User');
const Achievement = require('../models/Achievement');
const Game = require('../models/Game');
require('dotenv').config();

/**
 * Database seeder for Battle64 Achievement System
 */
class DatabaseSeeder {
  constructor() {
    this.connection = null;
  }

  /**
   * Connect to database
   */
  async connect() {
    try {
      this.connection = await mongoose.connect(
        process.env.MONGODB_URI || 'mongodb://localhost:27017/battle64',
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
      console.log('✅ Connected to MongoDB for seeding');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    }
  }

  /**
   * Clear all collections
   */
  async clearDatabase() {
    try {
      await Promise.all([
        User.deleteMany({}),
        Achievement.deleteMany({}),
        Game.deleteMany({})
      ]);
      console.log('🗑️  Database cleared');
    } catch (error) {
      console.error('Error clearing database:', error);
    }
  }

  /**
   * Seed achievements
   */
  async seedAchievements() {
    try {
      const achievements = Achievement.predefinedAchievements;
      await Achievement.insertMany(achievements);
      console.log(`🏆 Seeded ${achievements.length} achievements`);
    } catch (error) {
      console.error('Error seeding achievements:', error);
    }
  }

  /**
   * Seed sample games
   */
  async seedGames() {
    try {
      const games = Game.sampleGames;
      await Game.insertMany(games);
      console.log(`🎮 Seeded ${games.length} sample games`);
    } catch (error) {
      console.error('Error seeding games:', error);
    }
  }

  /**
   * Seed sample users
   */
  async seedUsers() {
    try {
      const sampleUsers = [
        {
          username: 'retro_gamer',
          email: 'retro@example.com',
          password: 'password123',
          profile: {
            displayName: 'Retro Gamer',
            bio: 'Passionate about classic N64 games!',
            avatar: '/avatars/retro-gamer.png'
          },
          ranking: {
            level: 15,
            experience: 7500,
            totalPoints: 7500,
            currentTitle: 'Retro Warrior',
            unlockedTitles: ['Newcomer', 'Cartridge Kid', 'Pixel Hero', '64-Bit General', 'Retro Warrior']
          },
          achievements: {
            stats: {
              gamesCollected: 45,
              quizzesCompleted: 25,
              eventsParticipated: 3,
              daysLoggedIn: 30,
              perfectScores: 5,
              collectionSets: 2
            }
          },
          activity: {
            consecutiveLogins: 30,
            totalLogins: 45
          }
        },
        {
          username: 'n64_collector',
          email: 'collector@example.com',
          password: 'password123',
          profile: {
            displayName: 'N64 Collector',
            bio: 'Building the ultimate N64 collection!',
            avatar: '/avatars/collector.png'
          },
          ranking: {
            level: 25,
            experience: 12500,
            totalPoints: 12500,
            currentTitle: 'Nintendo Master',
            unlockedTitles: ['Newcomer', 'Cartridge Kid', 'Pixel Hero', '64-Bit General', 'Retro Warrior', 'Legend of Retro', 'Nintendo Master']
          },
          achievements: {
            stats: {
              gamesCollected: 120,
              quizzesCompleted: 50,
              eventsParticipated: 8,
              daysLoggedIn: 75,
              perfectScores: 12,
              collectionSets: 5
            }
          },
          activity: {
            consecutiveLogins: 75,
            totalLogins: 90
          }
        },
        {
          username: 'quiz_master',
          email: 'quiz@example.com',
          password: 'password123',
          profile: {
            displayName: 'Quiz Master',
            bio: 'N64 trivia expert!',
            avatar: '/avatars/quiz-master.png'
          },
          ranking: {
            level: 12,
            experience: 6000,
            totalPoints: 6000,
            currentTitle: '64-Bit General',
            unlockedTitles: ['Newcomer', 'Cartridge Kid', 'Pixel Hero', '64-Bit General']
          },
          achievements: {
            stats: {
              gamesCollected: 20,
              quizzesCompleted: 85,
              eventsParticipated: 2,
              daysLoggedIn: 45,
              perfectScores: 25,
              collectionSets: 1
            }
          },
          activity: {
            consecutiveLogins: 45,
            totalLogins: 60
          }
        }
      ];

      // Hash passwords and create users
      for (const userData of sampleUsers) {
        const user = new User(userData);
        await user.save();
      }

      console.log(`👥 Seeded ${sampleUsers.length} sample users`);
    } catch (error) {
      console.error('Error seeding users:', error);
    }
  }

  /**
   * Add sample achievements to users
   */
  async addUserAchievements() {
    try {
      const users = await User.find();
      const achievements = await Achievement.find();

      for (const user of users) {
        // Add some random achievements based on user stats
        const userAchievements = [];

        // Collection achievements
        if (user.achievements.stats.gamesCollected >= 1) {
          userAchievements.push(achievements.find(a => a.id === 'first_game'));
        }
        if (user.achievements.stats.gamesCollected >= 10) {
          userAchievements.push(achievements.find(a => a.id === 'collector_10'));
        }
        if (user.achievements.stats.gamesCollected >= 50) {
          userAchievements.push(achievements.find(a => a.id === 'collector_50'));
        }

        // Quiz achievements
        if (user.achievements.stats.quizzesCompleted >= 1) {
          userAchievements.push(achievements.find(a => a.id === 'quiz_first'));
        }
        if (user.achievements.stats.quizzesCompleted >= 10) {
          userAchievements.push(achievements.find(a => a.id === 'quiz_10'));
        }
        if (user.achievements.stats.perfectScores >= 1) {
          userAchievements.push(achievements.find(a => a.id === 'perfect_score'));
        }

        // Special achievements
        if (user.achievements.stats.daysLoggedIn >= 7) {
          userAchievements.push(achievements.find(a => a.id === 'daily_login_7'));
        }
        if (user.achievements.stats.daysLoggedIn >= 30) {
          userAchievements.push(achievements.find(a => a.id === 'daily_login_30'));
        }
        if (user.ranking.level >= 10) {
          userAchievements.push(achievements.find(a => a.id === 'level_10'));
        }

        // Add achievements to user
        for (const achievement of userAchievements) {
          if (achievement && !user.achievements.badges.some(b => b.id === achievement.id)) {
            user.unlockAchievement(achievement);
          }
        }

        await user.save();
      }

      console.log('🏅 Added achievements to sample users');
    } catch (error) {
      console.error('Error adding user achievements:', error);
    }
  }

  /**
   * Add sample games to user collections
   */
  async addUserCollections() {
    try {
      const users = await User.find();
      const games = await Game.find();

      for (const user of users) {
        // Add some random games to each user's collection
        const gamesToAdd = games.slice(0, Math.floor(Math.random() * 10) + 5); // 5-15 games

        for (const game of gamesToAdd) {
          const existingGame = user.collections.find(c => c.gameId === game._id.toString());
          if (!existingGame) {
            user.collections.push({
              gameId: game._id,
              title: game.title,
              genre: game.genre,
              condition: ['mint', 'excellent', 'good', 'fair'][Math.floor(Math.random() * 4)],
              acquiredAt: new Date()
            });
          }
        }

        // Update stats
        user.achievements.stats.gamesCollected = user.collections.length;
        await user.save();
      }

      console.log('📦 Added sample collections to users');
    } catch (error) {
      console.error('Error adding user collections:', error);
    }
  }

  /**
   * Run all seeding operations
   */
  async run() {
    try {
      console.log('🌱 Starting database seeding...');
      
      await this.connect();
      await this.clearDatabase();
      await this.seedAchievements();
      await this.seedGames();
      await this.seedUsers();
      await this.addUserAchievements();
      await this.addUserCollections();

      console.log('✅ Database seeding completed successfully!');
      console.log('\n📊 Sample data created:');
      console.log('- 3 sample users with different achievement levels');
      console.log('- 5 classic N64 games');
      console.log('- 25+ predefined achievements');
      console.log('- Sample collections and achievements for each user');
      
      console.log('\n🔗 You can now start the server with: npm run server');
      
    } catch (error) {
      console.error('❌ Seeding failed:', error);
    } finally {
      await mongoose.connection.close();
      console.log('🔌 Database connection closed');
      process.exit(0);
    }
  }
}

// Run seeder if this file is executed directly
if (require.main === module) {
  const seeder = new DatabaseSeeder();
  seeder.run();
}

module.exports = DatabaseSeeder;
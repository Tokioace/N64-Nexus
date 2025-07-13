const User = require('../models/User');
const Achievement = require('../models/Achievement');
const Game = require('../models/Game');

class AchievementService {
  /**
   * Check and unlock achievements for a user
   * @param {string} userId - User ID
   * @param {string} category - Achievement category to check
   * @returns {Promise<Array>} Array of newly unlocked achievements
   */
  static async checkAchievements(userId, category = null) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get achievements to check
      let achievements;
      if (category) {
        achievements = await Achievement.getByCategory(category);
      } else {
        achievements = await Achievement.getAllAchievements();
      }

      const newlyUnlocked = [];

      for (const achievement of achievements) {
        // Skip if already unlocked
        if (user.achievements.badges.some(badge => badge.id === achievement.id)) {
          continue;
        }

        // Check if achievement requirements are met
        if (await this.checkAchievementRequirements(user, achievement)) {
          // Unlock achievement
          const unlocked = user.unlockAchievement(achievement);
          if (unlocked) {
            // Add achievement points
            const levelUp = user.addPoints(achievement.points, 'achievement', `Unlocked: ${achievement.name}`);
            
            newlyUnlocked.push({
              achievement,
              levelUp,
              pointsEarned: achievement.points
            });
          }
        }
      }

      if (newlyUnlocked.length > 0) {
        await user.save();
      }

      return newlyUnlocked;
    } catch (error) {
      console.error('Error checking achievements:', error);
      throw error;
    }
  }

  /**
   * Check if user meets achievement requirements
   * @param {Object} user - User object
   * @param {Object} achievement - Achievement object
   * @returns {Promise<boolean>} Whether requirements are met
   */
  static async checkAchievementRequirements(user, achievement) {
    const requirements = achievement.requirements;
    const stats = user.achievements.stats;

    // Check collection achievements
    if (achievement.category === 'collection') {
      if (requirements.gamesCollected && stats.gamesCollected < requirements.gamesCollected) {
        return false;
      }
      if (requirements.collectionSets && stats.collectionSets < requirements.collectionSets) {
        return false;
      }
      if (requirements.mintGames) {
        const mintGames = user.collections.filter(game => game.condition === 'mint').length;
        if (mintGames < requirements.mintGames) {
          return false;
        }
      }
    }

    // Check quiz achievements
    if (achievement.category === 'quiz') {
      if (requirements.quizzesCompleted && stats.quizzesCompleted < requirements.quizzesCompleted) {
        return false;
      }
      if (requirements.perfectScores && stats.perfectScores < requirements.perfectScores) {
        return false;
      }
      if (requirements.speedQuiz) {
        // This would need to be checked during quiz completion
        return false;
      }
    }

    // Check event achievements
    if (achievement.category === 'event') {
      if (requirements.eventsParticipated && stats.eventsParticipated < requirements.eventsParticipated) {
        return false;
      }
      if (requirements.eventWins) {
        // This would need to be tracked separately
        return false;
      }
      if (requirements.top3Finishes) {
        // This would need to be tracked separately
        return false;
      }
    }

    // Check social achievements
    if (achievement.category === 'social') {
      if (requirements.friendsCount && user.friends.length < requirements.friendsCount) {
        return false;
      }
      if (requirements.profileComplete) {
        const isComplete = user.profile.bio && user.profile.avatar;
        if (!isComplete) {
          return false;
        }
      }
    }

    // Check special achievements
    if (achievement.category === 'special') {
      if (requirements.consecutiveLogins && user.activity.consecutiveLogins < requirements.consecutiveLogins) {
        return false;
      }
      if (requirements.level && user.ranking.level < requirements.level) {
        return false;
      }
      if (requirements.joinDate) {
        const joinDate = new Date(requirements.joinDate.$lt);
        if (user.profile.joinDate >= joinDate) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Add points to user and check for achievements
   * @param {string} userId - User ID
   * @param {number} points - Points to add
   * @param {string} source - Source of points
   * @param {string} description - Description of points
   * @param {string} category - Achievement category to check
   * @returns {Promise<Object>} Result with level up info and unlocked achievements
   */
  static async addPoints(userId, points, source, description, category = null) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Add points and check for level up
      const levelUp = user.addPoints(points, source, description);

      // Check for achievements
      const unlockedAchievements = await this.checkAchievements(userId, category);

      await user.save();

      return {
        levelUp,
        unlockedAchievements,
        currentLevel: user.ranking.level,
        currentPoints: user.ranking.totalPoints,
        experienceToNext: user.experienceToNextLevel,
        levelProgress: user.levelProgress
      };
    } catch (error) {
      console.error('Error adding points:', error);
      throw error;
    }
  }

  /**
   * Handle daily login rewards
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Daily login result
   */
  static async handleDailyLogin(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const now = new Date();
      const lastLogin = user.activity.lastDailyLogin;
      let points = 0;
      let consecutiveBonus = 0;

      // Check if it's a new day
      if (!lastLogin || this.isNewDay(lastLogin, now)) {
        // Base daily login points
        points = 25;

        // Check for consecutive login bonus
        if (lastLogin && this.isConsecutiveDay(lastLogin, now)) {
          user.activity.consecutiveLogins += 1;
          consecutiveBonus = Math.min(user.activity.consecutiveLogins * 5, 50); // Max 50 bonus points
          points += consecutiveBonus;
        } else {
          user.activity.consecutiveLogins = 1;
        }

        // Update stats
        user.achievements.stats.daysLoggedIn += 1;
        user.activity.lastDailyLogin = now;
        user.activity.totalLogins += 1;

        // Add points
        const result = await this.addPoints(
          userId, 
          points, 
          'daily_login', 
          `Daily login bonus${consecutiveBonus > 0 ? ` + ${consecutiveBonus} consecutive bonus` : ''}`
        );

        // Check for daily login achievements
        await this.checkAchievements(userId, 'special');

        return {
          ...result,
          consecutiveLogins: user.activity.consecutiveLogins,
          totalLogins: user.activity.totalLogins
        };
      }

      return {
        message: 'Already logged in today',
        consecutiveLogins: user.activity.consecutiveLogins,
        totalLogins: user.activity.totalLogins
      };
    } catch (error) {
      console.error('Error handling daily login:', error);
      throw error;
    }
  }

  /**
   * Handle game collection addition
   * @param {string} userId - User ID
   * @param {string} gameId - Game ID
   * @param {string} condition - Game condition
   * @returns {Promise<Object>} Collection result
   */
  static async addGameToCollection(userId, gameId, condition = 'good') {
    try {
      const [user, game] = await Promise.all([
        User.findById(userId),
        Game.findById(gameId)
      ]);

      if (!user || !game) {
        throw new Error('User or game not found');
      }

      // Check if game is already in collection
      const existingGame = user.collections.find(c => c.gameId === gameId);
      if (existingGame) {
        throw new Error('Game already in collection');
      }

      // Add game to collection
      user.collections.push({
        gameId: gameId,
        title: game.title,
        genre: game.genre,
        condition: condition,
        acquiredAt: new Date()
      });

      // Update stats
      user.achievements.stats.gamesCollected += 1;

      // Check for collection sets
      if (game.collectionSet && game.collectionSet.name) {
        await this.checkCollectionSets(user);
      }

      // Add points for the game
      const points = game.achievementPoints;
      const result = await this.addPoints(
        userId,
        points,
        'collection',
        `Added ${game.title} to collection`
      );

      // Check for collection achievements
      await this.checkAchievements(userId, 'collection');

      return {
        ...result,
        game: {
          title: game.title,
          genre: game.genre,
          points: points
        },
        collectionSize: user.collections.length
      };
    } catch (error) {
      console.error('Error adding game to collection:', error);
      throw error;
    }
  }

  /**
   * Check for completed collection sets
   * @param {Object} user - User object
   */
  static async checkCollectionSets(user) {
    try {
      const collectionSets = await Game.getCollectionSets();
      
      for (const set of collectionSets) {
        const userGameIds = user.collections.map(c => c.gameId.toString());
        const setGameIds = set.games.map(g => g._id.toString());
        
        const hasAllGames = setGameIds.every(id => userGameIds.includes(id));
        
        if (hasAllGames) {
          user.achievements.stats.collectionSets += 1;
        }
      }
    } catch (error) {
      console.error('Error checking collection sets:', error);
    }
  }

  /**
   * Handle quiz completion
   * @param {string} userId - User ID
   * @param {number} score - Quiz score (0-100)
   * @param {number} timeSeconds - Time taken in seconds
   * @returns {Promise<Object>} Quiz completion result
   */
  static async handleQuizCompletion(userId, score, timeSeconds) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Update stats
      user.achievements.stats.quizzesCompleted += 1;
      
      if (score === 100) {
        user.achievements.stats.perfectScores += 1;
      }

      // Calculate points based on score
      const basePoints = Math.floor(score / 10) * 10; // 10 points per 10% score
      const timeBonus = timeSeconds < 30 ? 50 : 0; // Speed bonus
      const perfectBonus = score === 100 ? 100 : 0; // Perfect score bonus
      
      const totalPoints = basePoints + timeBonus + perfectBonus;

      // Add points
      const result = await this.addPoints(
        userId,
        totalPoints,
        'quiz',
        `Quiz completed with ${score}% score${timeBonus > 0 ? ' (Speed bonus!)' : ''}${perfectBonus > 0 ? ' (Perfect score!)' : ''}`
      );

      // Check for quiz achievements
      await this.checkAchievements(userId, 'quiz');

      return {
        ...result,
        score,
        timeSeconds,
        basePoints,
        timeBonus,
        perfectBonus,
        totalPoints
      };
    } catch (error) {
      console.error('Error handling quiz completion:', error);
      throw error;
    }
  }

  /**
   * Get user's achievement progress
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Achievement progress
   */
  static async getAchievementProgress(userId) {
    try {
      const [user, allAchievements] = await Promise.all([
        User.findById(userId),
        Achievement.getAllAchievements()
      ]);

      if (!user) {
        throw new Error('User not found');
      }

      const progress = {
        unlocked: user.achievements.badges.length,
        total: allAchievements.length,
        percentage: Math.round((user.achievements.badges.length / allAchievements.length) * 100),
        byCategory: {},
        byRarity: {}
      };

      // Group by category
      allAchievements.forEach(achievement => {
        if (!progress.byCategory[achievement.category]) {
          progress.byCategory[achievement.category] = { unlocked: 0, total: 0 };
        }
        progress.byCategory[achievement.category].total++;
        
        if (user.achievements.badges.some(badge => badge.id === achievement.id)) {
          progress.byCategory[achievement.category].unlocked++;
        }
      });

      // Group by rarity
      allAchievements.forEach(achievement => {
        if (!progress.byRarity[achievement.rarity]) {
          progress.byRarity[achievement.rarity] = { unlocked: 0, total: 0 };
        }
        progress.byRarity[achievement.rarity].total++;
        
        if (user.achievements.badges.some(badge => badge.id === achievement.id)) {
          progress.byRarity[achievement.rarity].unlocked++;
        }
      });

      return progress;
    } catch (error) {
      console.error('Error getting achievement progress:', error);
      throw error;
    }
  }

  /**
   * Check if two dates are on consecutive days
   * @param {Date} date1 - First date
   * @param {Date} date2 - Second date
   * @returns {boolean} Whether dates are consecutive
   */
  static isConsecutiveDay(date1, date2) {
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  }

  /**
   * Check if two dates are on different days
   * @param {Date} date1 - First date
   * @param {Date} date2 - Second date
   * @returns {boolean} Whether dates are on different days
   */
  static isNewDay(date1, date2) {
    return date1.toDateString() !== date2.toDateString();
  }
}

module.exports = AchievementService;
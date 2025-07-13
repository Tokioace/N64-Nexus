const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

class Reward {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.name = data.name || '';
    this.description = data.description || '';
    this.type = data.type || 'sticker'; // 'profile_frame', 'sticker', 'title', 'xp_bonus', 'collector_bonus'
    this.rarity = data.rarity || 'common'; // 'common', 'rare', 'epic', 'legendary'
    this.eventId = data.eventId || null;
    this.eventName = data.eventName || '';
    this.unlockCondition = data.unlockCondition || {};
    this.isUnlocked = data.isUnlocked || false;
    this.unlockedAt = data.unlockedAt || null;
    this.unlockedBy = data.unlockedBy || null;
    this.imageUrl = data.imageUrl || '';
    this.animationUrl = data.animationUrl || '';
    this.effects = data.effects || {};
    this.createdAt = data.createdAt || moment().toISOString();
    this.updatedAt = data.updatedAt || moment().toISOString();
  }

  // Check if reward can be unlocked based on conditions
  canUnlock(userProgress = {}) {
    if (this.isUnlocked) return false;

    const { type, target, eventId } = this.unlockCondition;
    
    switch (type) {
      case 'speedrun_time':
        return userProgress.bestTime <= target;
      case 'collection_count':
        return userProgress.collectionCount >= target;
      case 'event_participation':
        return userProgress.eventParticipation >= target;
      case 'challenge_completion':
        return userProgress.challengesCompleted >= target;
      case 'xp_threshold':
        return userProgress.totalXP >= target;
      case 'seasonal_achievement':
        return userProgress.seasonalAchievements >= target;
      default:
        return false;
    }
  }

  // Unlock the reward
  unlock(userId) {
    if (this.isUnlocked) {
      throw new Error('Reward is already unlocked');
    }

    this.isUnlocked = true;
    this.unlockedAt = moment().toISOString();
    this.unlockedBy = userId;
    this.updatedAt = moment().toISOString();
  }

  // Get rarity color
  getRarityColor() {
    const colors = {
      common: '#9E9E9E',    // Gray
      rare: '#2196F3',      // Blue
      epic: '#9C27B0',      // Purple
      legendary: '#FFD700'  // Gold
    };
    return colors[this.rarity] || colors.common;
  }

  // Get rarity multiplier for XP/points
  getRarityMultiplier() {
    const multipliers = {
      common: 1,
      rare: 2,
      epic: 5,
      legendary: 10
    };
    return multipliers[this.rarity] || 1;
  }

  // Check if reward is seasonal
  isSeasonal() {
    return this.eventId && this.eventName;
  }

  // Get reward value (for trading/collecting)
  getValue() {
    const baseValue = {
      profile_frame: 100,
      sticker: 50,
      title: 25,
      xp_bonus: 75,
      collector_bonus: 150
    };

    const base = baseValue[this.type] || 50;
    return base * this.getRarityMultiplier();
  }

  // Apply reward effects to user
  applyEffects(user) {
    switch (this.type) {
      case 'xp_bonus':
        return {
          xpMultiplier: this.effects.xpMultiplier || 1.5,
          duration: this.effects.duration || 3600 // 1 hour in seconds
        };
      case 'collector_bonus':
        return {
          tradeBonus: this.effects.tradeBonus || 1.2,
          collectionBonus: this.effects.collectionBonus || 1.1
        };
      default:
        return {};
    }
  }

  // Validate reward data
  validate() {
    const errors = [];
    
    if (!this.name) errors.push('Reward name is required');
    if (!this.type) errors.push('Reward type is required');
    if (!this.rarity) errors.push('Reward rarity is required');
    
    const validTypes = ['profile_frame', 'sticker', 'title', 'xp_bonus', 'collector_bonus'];
    if (!validTypes.includes(this.type)) {
      errors.push('Invalid reward type');
    }
    
    const validRarities = ['common', 'rare', 'epic', 'legendary'];
    if (!validRarities.includes(this.rarity)) {
      errors.push('Invalid rarity level');
    }
    
    return errors;
  }

  // Update reward
  update(data) {
    Object.assign(this, data);
    this.updatedAt = moment().toISOString();
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      rarity: this.rarity,
      eventId: this.eventId,
      eventName: this.eventName,
      unlockCondition: this.unlockCondition,
      isUnlocked: this.isUnlocked,
      unlockedAt: this.unlockedAt,
      unlockedBy: this.unlockedBy,
      imageUrl: this.imageUrl,
      animationUrl: this.animationUrl,
      effects: this.effects,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      rarityColor: this.getRarityColor(),
      rarityMultiplier: this.getRarityMultiplier(),
      value: this.getValue(),
      isSeasonal: this.isSeasonal()
    };
  }
}

module.exports = Reward;
import { Achievement, AchievementRule, UserAchievement, AchievementStatus } from '@/types/achievement';

// Achievement rule checking logic
export class AchievementLogic {
  /**
   * Check if an achievement rule is satisfied
   */
  static checkRule(rule: AchievementRule, userData: any): boolean {
    switch (rule.type) {
      case 'event_completion':
        return this.checkEventCompletion(rule, userData);
      case 'time_based':
        return this.checkTimeBased(rule, userData);
      case 'count_based':
        return this.checkCountBased(rule, userData);
      case 'first_place':
        return this.checkFirstPlace(rule, userData);
      case 'community_interaction':
        return this.checkCommunityInteraction(rule, userData);
      case 'collection_complete':
        return this.checkCollectionComplete(rule, userData);
      default:
        return false;
    }
  }

  /**
   * Check event completion rule
   */
  private static checkEventCompletion(rule: AchievementRule, userData: any): boolean {
    const eventType = rule.eventType;
    const requiredValue = rule.value as number;
    
    if (!userData.events || !eventType || !userData.events[eventType]) {
      return false;
    }
    
    return userData.events[eventType].completed >= requiredValue;
  }

  /**
   * Check time-based rule
   */
  private static checkTimeBased(rule: AchievementRule, userData: any): boolean {
    const condition = rule.condition;
    const timeLimit = rule.timeLimit || 0;
    
    if (!userData.times || !condition || !userData.times[condition]) {
      return false;
    }
    
    return userData.times[condition] <= timeLimit;
  }

  /**
   * Check count-based rule
   */
  private static checkCountBased(rule: AchievementRule, userData: any): boolean {
    const condition = rule.condition;
    const requiredValue = rule.value as number;
    
    if (!userData.counts || !userData.counts[condition]) {
      return false;
    }
    
    return userData.counts[condition] >= requiredValue;
  }

  /**
   * Check first place rule
   */
  private static checkFirstPlace(rule: AchievementRule, userData: any): boolean {
    const condition = rule.condition;
    const requiredValue = rule.value as number;
    
    if (!userData.achievements || !userData.achievements[condition]) {
      return false;
    }
    
    return userData.achievements[condition] >= requiredValue;
  }

  /**
   * Check community interaction rule
   */
  private static checkCommunityInteraction(rule: AchievementRule, userData: any): boolean {
    const condition = rule.condition;
    const requiredValue = rule.value as number;
    
    if (!userData.community || !userData.community[condition]) {
      return false;
    }
    
    return userData.community[condition] >= requiredValue;
  }

  /**
   * Check collection complete rule
   */
  private static checkCollectionComplete(rule: AchievementRule, userData: any): boolean {
    const condition = rule.condition;
    const requiredValue = rule.value as number;
    
    if (!userData.collections || !userData.collections[condition]) {
      return false;
    }
    
    return userData.collections[condition] >= requiredValue;
  }

  /**
   * Check if all rules for an achievement are satisfied
   */
  static checkAchievementUnlock(achievement: Achievement, userData: any): boolean {
    return achievement.rules.every(rule => this.checkRule(rule, userData));
  }

  /**
   * Calculate progress for an achievement
   */
  static calculateProgress(achievement: Achievement, userData: any): number {
    if (achievement.rules.length === 0) return 0;
    
    const progressValues = achievement.rules.map(rule => {
      switch (rule.type) {
        case 'count_based':
          const count = userData.counts?.[rule.condition] || 0;
          return Math.min(count / (rule.value as number), 1);
        case 'time_based':
          const time = userData.times?.[rule.condition] || Infinity;
          const timeLimit = rule.timeLimit || 0;
          return timeLimit > 0 ? Math.max(0, 1 - (time / timeLimit)) : 0;
        case 'event_completion':
          const completed = userData.events?.[rule.eventType || '']?.completed || 0;
          return Math.min(completed / (rule.value as number), 1);
        default:
          return userData.achievements?.[rule.condition] ? 1 : 0;
      }
    });
    
    return progressValues.reduce((sum, val) => sum + val, 0) / progressValues.length;
  }

  /**
   * Get achievement status based on progress and unlock conditions
   */
  static getAchievementStatus(achievement: Achievement, userData: any): AchievementStatus {
    const progress = this.calculateProgress(achievement, userData);
    
    if (progress >= 1) {
      return 'unlocked';
    } else if (progress > 0) {
      return 'in-progress';
    } else {
      return 'locked';
    }
  }

  /**
   * Check if achievement is available (not limited by time)
   */
  static isAchievementAvailable(achievement: Achievement): boolean {
    if (!achievement.isLimited || !achievement.limitedTime) {
      return true;
    }
    
    const now = new Date();
    const start = new Date(achievement.limitedTime.start);
    const end = new Date(achievement.limitedTime.end);
    
    return now >= start && now <= end;
  }

  /**
   * Get time remaining for limited achievements
   */
  static getTimeRemaining(achievement: Achievement): number | null {
    if (!achievement.isLimited || !achievement.limitedTime) {
      return null;
    }
    
    const now = new Date();
    const end = new Date(achievement.limitedTime.end);
    
    return Math.max(0, end.getTime() - now.getTime());
  }

  /**
   * Format time remaining as human readable string
   */
  static formatTimeRemaining(milliseconds: number): string {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days} Tag${days > 1 ? 'e' : ''} ${hours} Stunde${hours > 1 ? 'n' : ''}`;
    } else if (hours > 0) {
      return `${hours} Stunde${hours > 1 ? 'n' : ''} ${minutes} Minute${minutes > 1 ? 'n' : ''}`;
    } else {
      return `${minutes} Minute${minutes > 1 ? 'n' : ''}`;
    }
  }
}

// Achievement progress tracking
export class AchievementProgress {
  /**
   * Update user achievement progress
   */
  static updateProgress(
    userAchievements: UserAchievement[],
    achievementId: string,
    progress: number,
    maxProgress: number
  ): UserAchievement[] {
    const existingIndex = userAchievements.findIndex(ua => ua.achievementId === achievementId);
    
    if (existingIndex >= 0) {
      // Update existing progress
      const updated = [...userAchievements];
      updated[existingIndex] = {
        ...updated[existingIndex],
        progress: Math.min(progress, maxProgress),
        maxProgress,
        status: progress >= maxProgress ? 'unlocked' : 'in-progress'
      };
      return updated;
    } else {
      // Add new progress entry
      return [
        ...userAchievements,
        {
          achievementId,
          progress: Math.min(progress, maxProgress),
          maxProgress,
          status: progress >= maxProgress ? 'unlocked' : 'in-progress'
        }
      ];
    }
  }

  /**
   * Mark achievement as unlocked
   */
  static unlockAchievement(
    userAchievements: UserAchievement[],
    achievementId: string
  ): UserAchievement[] {
    const existingIndex = userAchievements.findIndex(ua => ua.achievementId === achievementId);
    
    if (existingIndex >= 0) {
      const updated = [...userAchievements];
      updated[existingIndex] = {
        ...updated[existingIndex],
        status: 'unlocked',
        unlockedAt: new Date().toISOString()
      };
      return updated;
    } else {
      return [
        ...userAchievements,
        {
          achievementId,
          progress: 1,
          maxProgress: 1,
          status: 'unlocked',
          unlockedAt: new Date().toISOString()
        }
      ];
    }
  }

  /**
   * Get achievement progress by ID
   */
  static getProgress(userAchievements: UserAchievement[], achievementId: string): UserAchievement | null {
    return userAchievements.find(ua => ua.achievementId === achievementId) || null;
  }

  /**
   * Get all unlocked achievements
   */
  static getUnlockedAchievements(userAchievements: UserAchievement[]): UserAchievement[] {
    return userAchievements.filter(ua => ua.status === 'unlocked');
  }

  /**
   * Get achievements in progress
   */
  static getInProgressAchievements(userAchievements: UserAchievement[]): UserAchievement[] {
    return userAchievements.filter(ua => ua.status === 'in-progress');
  }
}
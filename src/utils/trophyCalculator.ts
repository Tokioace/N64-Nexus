import { Achievement, AchievementStats, TrophyType, AchievementCategory, AchievementRarity } from '@/types/achievement';

// Trophy calculation utilities
export class TrophyCalculator {
  /**
   * Calculate achievement statistics for a user
   */
  static calculateStats(
    achievements: Achievement[],
    userAchievements: { achievementId: string; status: string; unlockedAt?: string }[]
  ): AchievementStats {
    const unlockedIds = new Set(
      userAchievements
        .filter(ua => ua.status === 'unlocked')
        .map(ua => ua.achievementId)
    );

    const unlockedAchievements = achievements.filter(a => unlockedIds.has(a.id));
    const totalAvailable = achievements.length;
    const totalUnlocked = unlockedAchievements.length;
    const completionPercentage = totalAvailable > 0 ? (totalUnlocked / totalAvailable) * 100 : 0;

    // Calculate by category
    const byCategory: Record<AchievementCategory, number> = {
      'game-specific': 0,
      'platform': 0,
      'community': 0,
      'collector': 0,
      'recurring': 0,
      'limited': 0
    };

    // Calculate by trophy type
    const byTrophyType: Record<TrophyType, number> = {
      'bronze': 0,
      'silver': 0,
      'gold': 0,
      'platinum': 0
    };

    // Calculate by rarity
    const byRarity: Record<AchievementRarity, number> = {
      'common': 0,
      'uncommon': 0,
      'rare': 0,
      'epic': 0,
      'legendary': 0
    };

    // Calculate total XP
    const totalXP = unlockedAchievements.reduce((sum, achievement) => sum + achievement.xpReward, 0);

    // Count achievements by category, trophy type, and rarity
    unlockedAchievements.forEach(achievement => {
      byCategory[achievement.category]++;
      byTrophyType[achievement.trophyType]++;
      byRarity[achievement.rarity]++;
    });

    // Find rarest achievement
    const rarestAchievement = unlockedAchievements.reduce((rarest, current) => {
      const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
      const currentRarity = rarityOrder[current.rarity];
      const rarestRarity = rarest ? rarityOrder[rarest.rarity] : 0;
      return currentRarity > rarestRarity ? current : rarest;
    }, null as Achievement | null);

    // Get recent unlocks (last 5)
    const recentUnlocks = userAchievements
      .filter(ua => ua.status === 'unlocked' && ua.unlockedAt)
      .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
      .slice(0, 5)
      .map(ua => achievements.find(a => a.id === ua.achievementId))
      .filter((a): a is Achievement => a !== undefined);

    return {
      totalUnlocked,
      totalAvailable,
      completionPercentage,
      byCategory,
      byTrophyType,
      byRarity,
      totalXP,
      rarestAchievement: rarestAchievement || undefined,
      recentUnlocks
    };
  }

  /**
   * Calculate rarity percentage for an achievement
   */
  static calculateRarityPercentage(
    achievement: Achievement,
    totalUsers: number,
    usersWithAchievement: number
  ): number {
    if (totalUsers === 0) return 0;
    return (usersWithAchievement / totalUsers) * 100;
  }

  /**
   * Get rarity label based on percentage
   */
  static getRarityLabel(percentage: number): string {
    if (percentage <= 1) return 'Legendary';
    if (percentage <= 5) return 'Epic';
    if (percentage <= 15) return 'Rare';
    if (percentage <= 30) return 'Uncommon';
    return 'Common';
  }

  /**
   * Calculate trophy points (similar to PlayStation)
   */
  static calculateTrophyPoints(achievement: Achievement): number {
    const pointsMap: Record<TrophyType, number> = {
      'bronze': 15,
      'silver': 30,
      'gold': 90,
      'platinum': 300
    };
    return pointsMap[achievement.trophyType];
  }

  /**
   * Calculate total trophy points for user
   */
  static calculateTotalTrophyPoints(
    achievements: Achievement[],
    userAchievements: { achievementId: string; status: string }[]
  ): number {
    const unlockedIds = new Set(
      userAchievements
        .filter(ua => ua.status === 'unlocked')
        .map(ua => ua.achievementId)
    );

    return achievements
      .filter(a => unlockedIds.has(a.id))
      .reduce((sum, achievement) => sum + this.calculateTrophyPoints(achievement), 0);
  }

  /**
   * Get trophy level based on total points
   */
  static getTrophyLevel(totalPoints: number): { level: number; title: string } {
    const levels = [
      { min: 0, max: 99, level: 1, title: 'Bronze Novice' },
      { min: 100, max: 299, level: 2, title: 'Bronze Veteran' },
      { min: 300, max: 599, level: 3, title: 'Silver Novice' },
      { min: 600, max: 999, level: 4, title: 'Silver Veteran' },
      { min: 1000, max: 1999, level: 5, title: 'Gold Novice' },
      { min: 2000, max: 3999, level: 6, title: 'Gold Veteran' },
      { min: 4000, max: 7999, level: 7, title: 'Platinum Novice' },
      { min: 8000, max: 15999, level: 8, title: 'Platinum Veteran' },
      { min: 16000, max: 31999, level: 9, title: 'Platinum Master' },
      { min: 32000, max: Infinity, level: 10, title: 'Platinum Legend' }
    ];

    const level = levels.find(l => totalPoints >= l.min && totalPoints <= l.max);
    return level || { level: 0, title: 'Bronze Novice' };
  }

  /**
   * Calculate completion percentage by category
   */
  static calculateCategoryCompletion(
    achievements: Achievement[],
    userAchievements: { achievementId: string; status: string }[]
  ): Record<AchievementCategory, { unlocked: number; total: number; percentage: number }> {
    const unlockedIds = new Set(
      userAchievements
        .filter(ua => ua.status === 'unlocked')
        .map(ua => ua.achievementId)
    );

    const categories: AchievementCategory[] = [
      'game-specific', 'platform', 'community', 'collector', 'recurring', 'limited'
    ];

    const result: Record<AchievementCategory, { unlocked: number; total: number; percentage: number }> = {
      'game-specific': { unlocked: 0, total: 0, percentage: 0 },
      'platform': { unlocked: 0, total: 0, percentage: 0 },
      'community': { unlocked: 0, total: 0, percentage: 0 },
      'collector': { unlocked: 0, total: 0, percentage: 0 },
      'recurring': { unlocked: 0, total: 0, percentage: 0 },
      'limited': { unlocked: 0, total: 0, percentage: 0 }
    };

    categories.forEach(category => {
      const categoryAchievements = achievements.filter(a => a.category === category);
      const unlocked = categoryAchievements.filter(a => unlockedIds.has(a.id)).length;
      const total = categoryAchievements.length;
      const percentage = total > 0 ? (unlocked / total) * 100 : 0;

      result[category] = { unlocked, total, percentage };
    });

    return result;
  }

  /**
   * Get next closest achievement to unlock
   */
  static getNextClosestAchievement(
    achievements: Achievement[],
    userAchievements: { achievementId: string; status: string; progress?: number }[]
  ): Achievement | null {
    const inProgress = userAchievements.filter(ua => ua.status === 'in-progress');
    
    if (inProgress.length === 0) return null;

    // Find achievement with highest progress
    const highestProgress = inProgress.reduce((max, current) => {
      const currentProgress = current.progress || 0;
      const maxProgress = max.progress || 0;
      return currentProgress > maxProgress ? current : max;
    });

    return achievements.find(a => a.id === highestProgress.achievementId) || null;
  }

  /**
   * Calculate streak information
   */
  static calculateStreak(
    userAchievements: { achievementId: string; unlockedAt?: string }[]
  ): { currentStreak: number; longestStreak: number; lastUnlockDate?: string } {
    const unlockedWithDates = userAchievements
      .filter(ua => ua.unlockedAt)
      .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime());

    if (unlockedWithDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const lastUnlockDate = unlockedWithDates[0].unlockedAt;
    const today = new Date();
    const lastUnlock = new Date(lastUnlockDate!);
    const daysSinceLastUnlock = Math.floor((today.getTime() - lastUnlock.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate current streak (consecutive days with unlocks)
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < unlockedWithDates.length - 1; i++) {
      const currentDate = new Date(unlockedWithDates[i].unlockedAt!);
      const nextDate = new Date(unlockedWithDates[i + 1].unlockedAt!);
      const dayDiff = Math.floor((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDiff === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Check if current streak is still active (unlocked today or yesterday)
    if (daysSinceLastUnlock <= 1) {
      currentStreak = tempStreak + 1;
    }

    return {
      currentStreak,
      longestStreak: longestStreak + 1,
      lastUnlockDate
    };
  }
}
// Achievement Categories
export type AchievementCategory = 
  | 'game-specific'    // Spielspezifisch
  | 'platform'         // Plattformbezogen
  | 'community'        // Community
  | 'collector'        // Sammlerstücke
  | 'recurring'        // Wiederholte Teilnahme
  | 'limited';         // Limitierte Challenges

// Trophy Types
export type TrophyType = 'bronze' | 'silver' | 'gold' | 'platinum';

// Achievement Rarity
export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// Achievement Status
export type AchievementStatus = 'locked' | 'unlocked' | 'in-progress';

// Achievement Rule Types
export type RuleType = 
  | 'event_completion'
  | 'time_based'
  | 'count_based'
  | 'first_place'
  | 'community_interaction'
  | 'collection_complete';

// Achievement Rule Interface
export interface AchievementRule {
  type: RuleType;
  condition: string;
  value: number | string;
  timeLimit?: number; // in seconds
  eventType?: string;
  platform?: string;
}

// Achievement Interface
export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  trophyType: TrophyType;
  rarity: AchievementRarity;
  xpReward: number;
  rules: AchievementRule[];
  isRepeatable: boolean;
  isLimited: boolean;
  limitedTime?: {
    start: string;
    end: string;
  };
  icon: string;
  backgroundColor: string;
  borderColor: string;
  unlockDate?: string;
  progress?: number;
  maxProgress?: number;
  status: AchievementStatus;
  rewards?: {
    title?: string;
    cosmetic?: string;
    frame?: string;
    icon?: string;
  };
  isPublic: boolean;
}

// User Achievement Progress
export interface UserAchievement {
  achievementId: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  status: AchievementStatus;
  repeatCount?: number;
}

// Achievement Notification
export interface AchievementNotification {
  id: string;
  userId: string;
  achievementId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  showInChat: boolean;
}

// Achievement Statistics
export interface AchievementStats {
  totalUnlocked: number;
  totalAvailable: number;
  completionPercentage: number;
  byCategory: Record<AchievementCategory, number>;
  byTrophyType: Record<TrophyType, number>;
  byRarity: Record<AchievementRarity, number>;
  totalXP: number;
  rarestAchievement?: Achievement;
  recentUnlocks: Achievement[];
}

// Community Achievement Event
export interface CommunityAchievementEvent {
  id: string;
  userId: string;
  username: string;
  achievement: Achievement;
  timestamp: string;
  isRare: boolean;
}

// Achievement Filter Options
export interface AchievementFilters {
  category?: AchievementCategory;
  trophyType?: TrophyType;
  rarity?: AchievementRarity;
  status?: AchievementStatus;
  search?: string;
  showLocked?: boolean;
  showUnlocked?: boolean;
}

// Achievement Sort Options
export type AchievementSortBy = 
  | 'name'
  | 'category'
  | 'trophyType'
  | 'rarity'
  | 'xpReward'
  | 'unlockDate'
  | 'progress';

export type SortOrder = 'asc' | 'desc';
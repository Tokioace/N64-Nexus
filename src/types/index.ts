// Notification Types
export enum NotificationType {
  EVENT = 'event',
  RANKING = 'ranking',
  FANART = 'fanart',
  LEVEL_UP = 'level_up',
  TROPHY = 'trophy',
  COMMENT = 'comment',
  FRIEND_REQUEST = 'friend_request',
  TRADE = 'trade'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  icon: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  userId: string;
}

// Trophy Types
export enum TrophyRarity {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum'
}

export enum TrophyCategory {
  SPEEDRUN = 'speedrun',
  FANART = 'fanart',
  QUIZ = 'quiz',
  COLLECTION = 'collection',
  TEAM = 'team',
  SPECIAL = 'special'
}

export interface Trophy {
  id: string;
  name: string;
  description: string;
  rarity: TrophyRarity;
  category: TrophyCategory;
  icon: string;
  xpValue: number;
  eventId?: string;
  unlockedAt?: Date;
  userId: string;
  gameId?: string;
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  notificationSettings: NotificationSettings;
  trophies: Trophy[];
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  filters: NotificationType[];
  soundEnabled: boolean;
}

// Event Types
export interface GameEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  gameId: string;
  trophies: Trophy[];
  participants: string[];
  status: 'upcoming' | 'active' | 'completed';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
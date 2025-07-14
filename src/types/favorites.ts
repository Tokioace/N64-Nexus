// Favorite content types
export type FavoriteType = 
  | 'game'
  | 'track'
  | 'fanart'
  | 'event'
  | 'user'
  | 'quiz'
  | 'trade';

// Base favorite interface
export interface Favorite {
  id: string;
  type: FavoriteType;
  title: string;
  description?: string;
  imageUrl?: string;
  url: string;
  addedAt: Date;
  updatedAt: Date;
  tags: string[];
  isPublic: boolean;
  metadata: Record<string, any>;
}

// Specific favorite types with additional metadata
export interface GameFavorite extends Favorite {
  type: 'game';
  metadata: {
    publisher: string;
    releaseYear: number;
    genre: string[];
    platform: string;
    rating?: number;
  };
}

export interface TrackFavorite extends Favorite {
  type: 'track';
  metadata: {
    game: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    bestTime?: string;
    worldRecord?: string;
  };
}

export interface FanartFavorite extends Favorite {
  type: 'fanart';
  metadata: {
    artist: string;
    game?: string;
    tags: string[];
    likes: number;
  };
}

export interface EventFavorite extends Favorite {
  type: 'event';
  metadata: {
    startDate: Date;
    endDate: Date;
    organizer: string;
    participants: number;
    maxParticipants?: number;
    status: 'upcoming' | 'ongoing' | 'completed';
  };
}

export interface UserFavorite extends Favorite {
  type: 'user';
  metadata: {
    username: string;
    avatar: string;
    followers: number;
    following: number;
    mutualFriends: number;
  };
}

export interface QuizFavorite extends Favorite {
  type: 'quiz';
  metadata: {
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    questions: number;
    bestScore?: number;
  };
}

export interface TradeFavorite extends Favorite {
  type: 'trade';
  metadata: {
    trader: string;
    itemType: string;
    condition: 'new' | 'like-new' | 'good' | 'fair';
    price?: number;
    location: string;
  };
}

// Union type for all favorite types
export type FavoriteItem = 
  | GameFavorite
  | TrackFavorite
  | FanartFavorite
  | EventFavorite
  | UserFavorite
  | QuizFavorite
  | TradeFavorite;

// Favorite list/category
export interface FavoriteList {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  favoriteIds: string[];
  color?: string;
  icon?: string;
}

// Favorite statistics
export interface FavoriteStats {
  totalFavorites: number;
  favoritesByType: Record<FavoriteType, number>;
  mostUsedTags: Array<{ tag: string; count: number }>;
  recentActivity: Date[];
}

// Notification settings
export interface FavoriteNotificationSettings {
  enabled: boolean;
  eventReminders: boolean;
  newContent: boolean;
  friendActivity: boolean;
  weeklyDigest: boolean;
}
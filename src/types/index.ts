// User Profile Types
export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  collectorLevel: number;
  points: Points;
  medals: Medal[];
  favoriteGames: string[];
  location?: string;
  privacySettings: PrivacySettings;
  createdAt: Date;
  lastActive: Date;
}

export interface Points {
  total: number;
  daily: number;
  weekly: number;
  collection: number;
  timeTrials: number;
  events: number;
  quiz: number;
  minigames: number;
}

export interface Medal {
  id: string;
  name: string;
  description: string;
  type: MedalType;
  rarity: MedalRarity;
  earnedAt: Date;
  icon: string;
}

export enum MedalType {
  COLLECTION = 'collection',
  SPEEDRUN = 'speedrun',
  QUIZ = 'quiz',
  EVENT = 'event',
  SPECIAL = 'special'
}

export enum MedalRarity {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  LEGENDARY = 'legendary'
}

export interface PrivacySettings {
  showLocation: boolean;
  showPoints: boolean;
  showMedals: boolean;
  showFavoriteGames: boolean;
  profilePublic: boolean;
}

// Progress System Types
export interface ProgressEntry {
  id: string;
  userId: string;
  type: ProgressType;
  points: number;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export enum ProgressType {
  COLLECTION_ADDED = 'collection_added',
  TIME_TRIAL_COMPLETED = 'time_trial_completed',
  EVENT_PARTICIPATED = 'event_participated',
  QUIZ_COMPLETED = 'quiz_completed',
  MINIGAME_COMPLETED = 'minigame_completed',
  DAILY_LOGIN = 'daily_login',
  WEEKLY_CHALLENGE = 'weekly_challenge'
}

// Game Types
export interface Game {
  id: string;
  title: string;
  releaseYear: number;
  genre: string[];
  publisher: string;
  coverImage: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface ProfileFormData {
  username: string;
  avatar: string;
  favoriteGames: string[];
  location?: string;
  privacySettings: PrivacySettings;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
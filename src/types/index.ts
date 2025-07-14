// User and Profile Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  points: number;
  reputation: number;
  isVerified: boolean;
  isTrustedSeller: boolean;
  joinDate: Date;
  location?: string;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

// Marketplace Item Types
export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  condition: ItemCondition;
  region: ItemRegion;
  platform: Platform;
  images: string[];
  price?: number;
  pointsValue?: number;
  rarity: RarityLevel;
  seller: User;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
  tags: string[];
  location?: string;
  shippingInfo?: ShippingInfo;
}

export enum ItemCategory {
  GAMES = 'games',
  MERCHANDISE = 'merchandise',
  ACCESSORIES = 'accessories',
  FAN_PRODUCTS = 'fan_products',
  WANTED = 'wanted'
}

export enum ItemCondition {
  NEW = 'new',
  GOOD = 'good',
  USED = 'used',
  DEFECTIVE = 'defective'
}

export enum ItemRegion {
  PAL = 'pal',
  NTSC = 'ntsc',
  JPN = 'jpn'
}

export enum Platform {
  N64 = 'n64',
  GAMECUBE = 'gamecube',
  SNES = 'snes',
  NES = 'nes',
  OTHER = 'other'
}

export enum RarityLevel {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  VERY_RARE = 'very_rare',
  LEGENDARY = 'legendary'
}

export interface ShippingInfo {
  method: string;
  cost: number;
  estimatedDays: number;
  insurance?: boolean;
}

// Trading System Types
export interface TradeOffer {
  id: string;
  item: MarketplaceItem;
  offeredItems: MarketplaceItem[];
  offeredPoints?: number;
  status: TradeStatus;
  createdAt: Date;
  expiresAt: Date;
  messages: TradeMessage[];
  participants: User[];
}

export enum TradeStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export interface TradeMessage {
  id: string;
  sender: User;
  content: string;
  timestamp: Date;
  isSystemMessage?: boolean;
}

// Filter and Search Types
export interface MarketplaceFilters {
  category?: ItemCategory[];
  condition?: ItemCondition[];
  region?: ItemRegion[];
  platform?: Platform[];
  priceRange?: { min: number; max: number };
  pointsRange?: { min: number; max: number };
  rarity?: RarityLevel[];
  location?: string;
  searchTerm?: string;
}

export enum SortOption {
  NEWEST = 'newest',
  PRICE_LOW_HIGH = 'price_low_high',
  PRICE_HIGH_LOW = 'price_high_low',
  POPULARITY = 'popularity',
  RARITY = 'rarity',
  POINTS_VALUE = 'points_value'
}

// Wishlist and Notifications
export interface WishlistItem {
  id: string;
  user: User;
  title: string;
  description?: string;
  category: ItemCategory;
  region?: ItemRegion;
  platform?: Platform;
  maxPrice?: number;
  maxPoints?: number;
  createdAt: Date;
  isActive: boolean;
}

export interface Notification {
  id: string;
  user: User;
  type: NotificationType;
  title: string;
  message: string;
  relatedItem?: MarketplaceItem;
  isRead: boolean;
  createdAt: Date;
}

export enum NotificationType {
  TRADE_OFFER = 'trade_offer',
  WISHLIST_MATCH = 'wishlist_match',
  TRADE_COMPLETED = 'trade_completed',
  SYSTEM = 'system'
}

// Review and Rating System
export interface Review {
  id: string;
  reviewer: User;
  reviewed: User;
  tradeId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  isPublic: boolean;
}

// Chat System
export interface ChatRoom {
  id: string;
  participants: User[];
  messages: ChatMessage[];
  lastActivity: Date;
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  sender: User;
  content: string;
  timestamp: Date;
  isRead: boolean;
}
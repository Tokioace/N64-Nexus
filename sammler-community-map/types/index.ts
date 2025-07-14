export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface LocationData {
  id: string;
  coordinate: Coordinate;
  title: string;
  description?: string;
  type: 'collector' | 'shop' | 'flea_market';
  createdBy: string;
  createdAt: Date;
  image?: string;
  rating?: number;
  gameCount?: number;
}

export interface CollectorData extends LocationData {
  type: 'collector';
  username: string;
  gameCount: number;
  isOnline: boolean;
  lastSeen: Date;
  collectionCategories: string[];
}

export interface ShopData extends LocationData {
  type: 'shop';
  name: string;
  address: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  rating: number;
  reviewCount: number;
}

export interface FleaMarketData extends LocationData {
  type: 'flea_market';
  name: string;
  address: string;
  date: Date;
  endDate?: Date;
  description: string;
  organizer: string;
  isRecurring: boolean;
}

export type PinData = CollectorData | ShopData | FleaMarketData;

export interface UserLocation {
  coordinate: Coordinate;
  accuracy: number;
  timestamp: Date;
}

export interface LocationPrivacySettings {
  shareLocation: boolean;
  privacyLevel: 'city' | 'postal_code' | 'exact';
  visibleTo: 'all' | 'friends' | 'none';
}

export interface MapSettings {
  showCollectors: boolean;
  showShops: boolean;
  showFleaMarkets: boolean;
  radius: number; // in kilometers
}

export interface PinColors {
  collector_small: string;  // 1-20 games
  collector_medium: string; // 21-100 games
  collector_large: string;  // 100+ games
  shop: string;
  flea_market: string;
}

export interface AddLocationForm {
  type: 'shop' | 'flea_market';
  name: string;
  address: string;
  coordinate: Coordinate;
  description?: string;
  phone?: string;
  website?: string;
  date?: Date;
  endDate?: Date;
  organizer?: string;
  isRecurring?: boolean;
}
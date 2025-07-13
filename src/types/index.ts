export interface User {
  id: string;
  username: string;
  avatar?: string;
  points: number;
  title: CollectorTitle;
  itemsSubmitted: number;
  joinDate: Date;
  isOnline: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: GalleryCategory;
  rarity: number; // 1-5 stars
  points: number;
  uploadDate: Date;
  uploader: User;
  origin?: string; // Herkunft: Flohmarkt, eBay, Erbstück, etc.
  isForSale?: boolean;
  tags: string[];
  views: number;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  timestamp: Date;
  likes: number;
}

export interface Rating {
  id: string;
  itemId: string;
  userId: string;
  stars: number; // 1-5
  timestamp: Date;
}

export type GalleryCategory = 'fanart' | 'screenshots' | 'merchandise';

export type CollectorTitle = 'beginner' | 'collector' | 'archivist' | 'legendary';

export interface TopList {
  topCollectors: User[];
  merchandiseMasters: User[];
  hiddenGems: GalleryItem[];
}

export interface UserCollection {
  userId: string;
  favoriteItems: string[]; // GalleryItem IDs
  wishlist: string[]; // GalleryItem IDs
}

export interface UploadFormData {
  title: string;
  description: string;
  category: GalleryCategory;
  origin?: string;
  isForSale?: boolean;
  tags: string[];
  imageFile: File;
}
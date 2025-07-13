export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  points: number;
}

export interface Game {
  id: string;
  title: string;
  region: 'PAL' | 'NTSC' | 'NTSC-J';
  developer: string;
  publisher: string;
  releaseYear: number;
  genre: string;
  coverImage?: string;
  description?: string;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rating {
  id: string;
  userId: string;
  gameId: string;
  gameplay: number; // 1-5
  graphics: number; // 1-5
  music: number; // 1-5
  nostalgia: number; // 1-5
  overall: number; // calculated average
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Collection {
  id: string;
  userId: string;
  gameId: string;
  status: 'owned' | 'wanted' | 'traded';
  condition?: 'loose' | 'complete' | 'sealed';
  hasManual?: boolean;
  hasBox?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  gameId: string;
  title: string;
  content: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewLike {
  id: string;
  userId: string;
  reviewId: string;
  createdAt: Date;
}

export interface GameFilter {
  genre?: string;
  region?: 'PAL' | 'NTSC' | 'NTSC-J';
  year?: number;
  minRating?: number;
  maxRating?: number;
  sortBy?: 'title' | 'rating' | 'year' | 'mostCollected';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface GameWithStats extends Game {
  averageRating: number;
  totalRatings: number;
  totalCollections: number;
  userRating?: Rating;
  userCollection?: Collection;
}

export interface UserStats {
  totalGames: number;
  totalRatings: number;
  totalReviews: number;
  points: number;
  favoriteGenre?: string;
  mostRatedGame?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
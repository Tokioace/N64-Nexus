import axios from 'axios';
import { 
  User, 
  Game, 
  Rating, 
  Collection, 
  Review, 
  GameFilter, 
  GameWithStats,
  UserStats,
  ApiResponse 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Games API
export const gamesAPI = {
  getAll: async (filters?: GameFilter): Promise<GameWithStats[]> => {
    const response = await api.get('/games', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<GameWithStats> => {
    const response = await api.get(`/games/${id}`);
    return response.data;
  },

  create: async (game: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>): Promise<Game> => {
    const response = await api.post('/games', game);
    return response.data;
  },

  update: async (id: string, game: Partial<Game>): Promise<Game> => {
    const response = await api.put(`/games/${id}`, game);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/games/${id}`);
  },

  uploadCover: async (id: string, file: File): Promise<{ coverImage: string }> => {
    const formData = new FormData();
    formData.append('cover', file);
    const response = await api.post(`/games/${id}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Ratings API
export const ratingsAPI = {
  getByGame: async (gameId: string): Promise<Rating[]> => {
    const response = await api.get(`/ratings/game/${gameId}`);
    return response.data;
  },

  getByUser: async (userId: string): Promise<Rating[]> => {
    const response = await api.get(`/ratings/user/${userId}`);
    return response.data;
  },

  create: async (rating: Omit<Rating, 'id' | 'createdAt' | 'updatedAt'>): Promise<Rating> => {
    const response = await api.post('/ratings', rating);
    return response.data;
  },

  update: async (id: string, rating: Partial<Rating>): Promise<Rating> => {
    const response = await api.put(`/ratings/${id}`, rating);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/ratings/${id}`);
  },

  getUserRating: async (gameId: string): Promise<Rating | null> => {
    try {
      const response = await api.get(`/ratings/user/game/${gameId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};

// Collections API
export const collectionsAPI = {
  getUserCollection: async (): Promise<Collection[]> => {
    const response = await api.get('/collections/user');
    return response.data;
  },

  addToCollection: async (collection: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>): Promise<Collection> => {
    const response = await api.post('/collections', collection);
    return response.data;
  },

  updateCollection: async (id: string, collection: Partial<Collection>): Promise<Collection> => {
    const response = await api.put(`/collections/${id}`, collection);
    return response.data;
  },

  removeFromCollection: async (id: string): Promise<void> => {
    await api.delete(`/collections/${id}`);
  },

  getByGame: async (gameId: string): Promise<Collection[]> => {
    const response = await api.get(`/collections/game/${gameId}`);
    return response.data;
  },
};

// Reviews API
export const reviewsAPI = {
  getByGame: async (gameId: string): Promise<Review[]> => {
    const response = await api.get(`/reviews/game/${gameId}`);
    return response.data;
  },

  getByUser: async (userId: string): Promise<Review[]> => {
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data;
  },

  create: async (review: Omit<Review, 'id' | 'likes' | 'createdAt' | 'updatedAt'>): Promise<Review> => {
    const response = await api.post('/reviews', review);
    return response.data;
  },

  update: async (id: string, review: Partial<Review>): Promise<Review> => {
    const response = await api.put(`/reviews/${id}`, review);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },

  like: async (reviewId: string): Promise<void> => {
    await api.post(`/reviews/${reviewId}/like`);
  },

  unlike: async (reviewId: string): Promise<void> => {
    await api.delete(`/reviews/${reviewId}/like`);
  },
};

// Users API
export const usersAPI = {
  getProfile: async (userId: string): Promise<User & { stats: UserStats }> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${userId}`, updates);
    return response.data;
  },

  getStats: async (): Promise<UserStats> => {
    const response = await api.get('/users/stats');
    return response.data;
  },
};

export default api;
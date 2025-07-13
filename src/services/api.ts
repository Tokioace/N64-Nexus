import axios from 'axios';
import { User, Event, MediaSubmission, LeaderboardEntry } from '../types';

// TODO: Replace with actual API base URL
const API_BASE_URL = 'https://api.battle64.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // TODO: Add auth token from secure storage
    const token = ''; // await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // TODO: Handle unauthorized access
      console.log('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (email: string, password: string): Promise<User> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: {
    username: string;
    email: string;
    password: string;
    platform: 'PAL' | 'NTSC';
  }): Promise<User> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};

// Events API
export const eventsAPI = {
  getActiveEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events/active');
    return response.data;
  },

  getEvent: async (eventId: string): Promise<Event> => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  joinEvent: async (eventId: string): Promise<boolean> => {
    const response = await api.post(`/events/${eventId}/join`);
    return response.data.success;
  },

  leaveEvent: async (eventId: string): Promise<boolean> => {
    const response = await api.post(`/events/${eventId}/leave`);
    return response.data.success;
  },

  getEventLeaderboard: async (eventId: string): Promise<LeaderboardEntry[]> => {
    const response = await api.get(`/events/${eventId}/leaderboard`);
    return response.data;
  },
};

// Media submissions API
export const mediaAPI = {
  submitMedia: async (submission: MediaSubmission): Promise<boolean> => {
    const formData = new FormData();
    
    // Add file
    formData.append('file', {
      uri: submission.fileUri,
      type: submission.type === 'screenshot' ? 'image/jpeg' : 'video/mp4',
      name: `submission_${submission.id}.${submission.type === 'screenshot' ? 'jpg' : 'mp4'}`,
    } as any);
    
    // Add metadata
    formData.append('metadata', JSON.stringify({
      userId: submission.userId,
      eventId: submission.eventId,
      type: submission.type,
      timestamp: submission.timestamp,
      metadata: submission.metadata,
      watermark: submission.watermark,
      score: submission.score,
      time: submission.time,
      notes: submission.notes,
    }));

    const response = await api.post('/media/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.success;
  },

  getSubmissionStatus: async (submissionId: string): Promise<'pending' | 'approved' | 'rejected'> => {
    const response = await api.get(`/media/submissions/${submissionId}/status`);
    return response.data.status;
  },

  getUserSubmissions: async (userId: string): Promise<MediaSubmission[]> => {
    const response = await api.get(`/media/users/${userId}/submissions`);
    return response.data;
  },

  deleteSubmission: async (submissionId: string): Promise<boolean> => {
    const response = await api.delete(`/media/submissions/${submissionId}`);
    return response.data.success;
  },
};

// User profile API
export const userAPI = {
  getUserProfile: async (userId: string): Promise<User> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  updateUserProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${userId}`, updates);
    return response.data;
  },

  getUserStats: async (userId: string): Promise<any> => {
    const response = await api.get(`/users/${userId}/stats`);
    return response.data;
  },
};

// Analytics API (for future use)
export const analyticsAPI = {
  getEventStats: async (eventId: string): Promise<any> => {
    const response = await api.get(`/analytics/events/${eventId}`);
    return response.data;
  },

  getUserActivity: async (userId: string): Promise<any> => {
    const response = await api.get(`/analytics/users/${userId}/activity`);
    return response.data;
  },
};

export default api;
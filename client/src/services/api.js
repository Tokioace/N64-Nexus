import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  verifyToken: () => api.get('/auth/verify'),
  updateProfile: (updates) => api.put('/auth/profile', updates),
  changePassword: (currentPassword, newPassword) => 
    api.put('/auth/password', { currentPassword, newPassword }),
};

// Events API
export const eventsAPI = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  join: (id) => api.post(`/events/${id}/join`),
  leave: (id) => api.post(`/events/${id}/leave`),
  getLeaderboard: (id, params) => api.get(`/events/${id}/leaderboard`, { params }),
  getChat: (id, params) => api.get(`/events/${id}/chat`, { params }),
  sendChatMessage: (id, message) => api.post(`/events/${id}/chat`, { message }),
};

// Submissions API
export const submissionsAPI = {
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    
    return api.post('/submissions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getByEvent: (eventId) => api.get(`/submissions/event/${eventId}`),
  getById: (id) => api.get(`/submissions/${id}`),
  update: (id, updates) => api.put(`/submissions/${id}`, updates),
  delete: (id) => api.delete(`/submissions/${id}`),
  approve: (id) => api.post(`/submissions/${id}/approve`),
  reject: (id, notes) => api.post(`/submissions/${id}/reject`, { notes }),
};

// Users API
export const usersAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  getSubmissions: (id, params) => api.get(`/users/${id}/submissions`, { params }),
  getEvents: (id, params) => api.get(`/users/${id}/events`, { params }),
  getStats: (id) => api.get(`/users/${id}/stats`),
  getLeaderboard: (params) => api.get('/users/leaderboard/global', { params }),
  search: (query, params) => api.get(`/users/search/${query}`, { params }),
};

// Admin API
export const adminAPI = {
  createEvent: (eventData) => api.post('/admin/events', eventData),
  updateEvent: (id, updates) => api.put(`/admin/events/${id}`, updates),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`),
  getPendingSubmissions: (params) => api.get('/admin/submissions/pending', { params }),
  getSubmissionStats: () => api.get('/admin/submissions/stats'),
  getUserStats: () => api.get('/admin/users/stats'),
  getEventStats: () => api.get('/admin/events/stats'),
  updateUser: (id, updates) => api.put(`/admin/users/${id}`, updates),
  getOverview: () => api.get('/admin/overview'),
};

// Socket.IO connection
export const socket = {
  connect: () => {
    const io = require('socket.io-client');
    return io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });
  },
};

// Utility functions
export const formatTime = (milliseconds) => {
  if (!milliseconds) return '--:--.---';
  
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const ms = Math.floor((milliseconds % 1000) / 10);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
};

export const parseTime = (timeString) => {
  const match = timeString.match(/^(\d+):(\d{2})\.(\d{2,3})$/);
  if (!match) return null;
  
  const minutes = parseInt(match[1]);
  const seconds = parseInt(match[2]);
  const milliseconds = parseInt(match[3].padEnd(3, '0'));
  
  return minutes * 60000 + seconds * 1000 + milliseconds;
};

export const getEventStatus = (event) => {
  const now = new Date();
  if (event.startTime > now) return 'upcoming';
  if (event.endTime < now) return 'completed';
  return 'active';
};

export const getPositionColor = (position) => {
  switch (position) {
    case 1: return 'text-yellow-600';
    case 2: return 'text-gray-500';
    case 3: return 'text-amber-600';
    default: return 'text-gray-700';
  }
};

export const getPositionIcon = (position) => {
  switch (position) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return `${position}`;
  }
};

export default api;
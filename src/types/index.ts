export interface User {
  id: string;
  username: string;
  email: string;
  platform: 'PAL' | 'NTSC';
  isVerified: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  game: string;
  category: string;
  maxParticipants?: number;
  currentParticipants: number;
  rules: string[];
  prizes?: string[];
}

export interface MediaSubmission {
  id: string;
  userId: string;
  eventId: string;
  type: 'screenshot' | 'video' | 'livestream';
  fileUri: string;
  thumbnailUri?: string;
  timestamp: Date;
  metadata: {
    platform: 'PAL' | 'NTSC';
    deviceInfo: string;
    location?: {
      latitude: number;
      longitude: number;
    };
    hash: string;
  };
  watermark: {
    text: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  };
  status: 'pending' | 'approved' | 'rejected';
  score?: number;
  time?: string;
  notes?: string;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  eventId: string;
  score: number;
  time: string;
  submissionId: string;
  rank: number;
  platform: 'PAL' | 'NTSC';
  submittedAt: Date;
}

export interface CameraSettings {
  quality: 'low' | 'medium' | 'high';
  flash: 'off' | 'on' | 'auto';
  focus: 'on' | 'off';
  whiteBalance: 'auto' | 'sunny' | 'cloudy' | 'shadow' | 'fluorescent' | 'incandescent';
}

export interface VideoSettings {
  quality: 'low' | 'medium' | 'high';
  maxDuration: number; // in seconds
  audio: boolean;
  stabilization: boolean;
}

export interface AppSettings {
  notifications: boolean;
  autoSave: boolean;
  dataUsage: 'low' | 'medium' | 'high';
  language: 'de' | 'en';
  theme: 'light' | 'dark' | 'auto';
  privacyMode: boolean;
}
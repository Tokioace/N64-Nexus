export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'moderator' | 'editor';
  permissions: string[];
  createdAt: Date;
  lastActive: Date;
}

export interface AdminPost {
  id: string;
  title: string;
  content: string;
  type: 'event' | 'feature' | 'rules' | 'winner' | 'birthday' | 'season';
  category: 'event' | 'systeminfo' | 'maintenance' | 'announcement';
  language: 'de' | 'en';
  translations?: {
    de?: string;
    en?: string;
  };
  imageUrl?: string;
  scheduledFor?: Date;
  publishedAt?: Date;
  isPublished: boolean;
  isPinned: boolean;
  isDraft: boolean;
  author: AdminUser;
  linkedEvent?: string;
  linkedFanart?: string;
  linkedQuiz?: string;
  linkedCollection?: string;
  visibility: 'public' | 'region' | 'group';
  targetRegions?: string[];
  targetGroups?: string[];
  pushNotification: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ModerationAction {
  id: string;
  type: 'delete' | 'warn' | 'block' | 'approve' | 'flag';
  targetType: 'fanart' | 'comment' | 'post' | 'event' | 'user';
  targetId: string;
  reason: ModerationReason;
  customMessage?: string;
  moderator: AdminUser;
  affectedUser?: string;
  duration?: number; // in hours, for temporary blocks
  isAutomated: boolean;
  createdAt: Date;
}

export interface ModerationReason {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'spam' | 'inappropriate' | 'copyright' | 'harassment' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface Report {
  id: string;
  reporterId: string;
  targetType: 'fanart' | 'comment' | 'post' | 'event' | 'user';
  targetId: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  moderatorId?: string;
  resolution?: ModerationAction;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isBlocked: boolean;
  blockReason?: string;
  blockExpiresAt?: Date;
  warnings: UserWarning[];
  createdAt: Date;
  lastActive: Date;
}

export interface UserWarning {
  id: string;
  reason: string;
  moderator: AdminUser;
  createdAt: Date;
  acknowledged: boolean;
}

export interface ContentItem {
  id: string;
  type: 'fanart' | 'comment' | 'post' | 'event';
  title?: string;
  content?: string;
  author: User;
  isFlagged: boolean;
  flags: ContentFlag[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentFlag {
  id: string;
  type: 'nsfw' | 'spam' | 'copyright' | 'harassment' | 'other';
  confidence: number; // 0-1
  isAutomated: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  pendingReports: number;
  activeModerations: number;
  blockedUsers: number;
  flaggedContent: number;
}

export interface AdminSettings {
  id: string;
  autoModeration: {
    enabled: boolean;
    nsfwDetection: boolean;
    spamDetection: boolean;
    botDetection: boolean;
  };
  moderationReasons: ModerationReason[];
  notificationSettings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    reportThreshold: number;
  };
}
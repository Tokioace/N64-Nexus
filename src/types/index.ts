export interface NewsPost {
  id: string;
  type: 'official' | 'highlight' | 'fanart' | 'event' | 'tip';
  title: string;
  content: string;
  author: string;
  authorRole: 'admin' | 'editor' | 'player';
  timestamp: Date;
  image?: string;
  video?: string;
  likes: number;
  comments: Comment[];
  isNew: boolean;
  visibility: 'global' | 'region' | 'event' | 'group';
  targetGroups?: string[];
  scheduledFor?: Date;
  pushNotification: boolean;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'editor' | 'player';
  groups: string[];
  region?: string;
}

export interface FilterOptions {
  showOfficial: boolean;
  showHighlights: boolean;
  showFanart: boolean;
  showEvents: boolean;
  showTips: boolean;
  showOwnGroups: boolean;
  showAdminOnly: boolean;
}

export interface AdminPostData {
  type: NewsPost['type'];
  title: string;
  content: string;
  image?: string;
  video?: string;
  visibility: NewsPost['visibility'];
  targetGroups?: string[];
  scheduledFor?: Date;
  pushNotification: boolean;
}
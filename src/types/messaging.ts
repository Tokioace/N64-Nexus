export interface User {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  isFriend: boolean;
  isBlocked: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'sticker' | 'link';
  timestamp: Date;
  isRead: boolean;
  isLiked: boolean;
  isImportant: boolean;
  attachments?: {
    url: string;
    type: 'image' | 'file';
    name: string;
  }[];
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  createdAt: Date;
  updatedAt: Date;
  groupName?: string;
  groupAvatar?: string;
}

export interface ChatSettings {
  allowMessagesFrom: 'all' | 'friends' | 'none';
  autoDeleteAfterDays: number;
  soundEnabled: boolean;
  notificationEnabled: boolean;
  theme: 'retro-blue' | 'retro-green' | 'retro-purple' | 'retro-orange' | 'retro-pink';
}

export interface QuickReply {
  id: string;
  text: string;
  emoji?: string;
}

export interface Sticker {
  id: string;
  name: string;
  url: string;
  category: string;
}

export interface Notification {
  id: string;
  type: 'message' | 'friend_request' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}
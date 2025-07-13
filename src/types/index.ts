// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
  xp: number;
  level: number;
  badges: Badge[];
  privacySettings: PrivacySettings;
}

export interface PrivacySettings {
  showOnlineStatus: boolean;
  showLastSeen: boolean;
  allowFriendRequests: boolean;
  allowGroupInvites: boolean;
  showProfileToGroups: boolean;
}

// Friend System Types
export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
  user: User;
  friend: User;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  fromUser: User;
  toUser: User;
}

// Group Types
export interface Group {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  banner?: string;
  type: 'public' | 'private' | 'hidden';
  category: GroupCategory;
  tags: string[];
  gameAssociations: string[];
  memberCount: number;
  maxMembers?: number;
  createdAt: Date;
  updatedAt: Date;
  founderId: string;
  founder: User;
  settings: GroupSettings;
}

export type GroupCategory = 
  | 'speedrun'
  | 'trading'
  | 'regional'
  | 'fanart'
  | 'competitive'
  | 'casual'
  | 'modding'
  | 'other';

export interface GroupSettings {
  allowMemberPosts: boolean;
  requireApproval: boolean;
  allowImageUploads: boolean;
  allowPolls: boolean;
  allowEvents: boolean;
  allowChallenges: boolean;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: 'founder' | 'admin' | 'moderator' | 'member';
  joinedAt: Date;
  user: User;
  group: Group;
}

export interface GroupPost {
  id: string;
  groupId: string;
  authorId: string;
  type: 'text' | 'image' | 'poll' | 'event' | 'challenge';
  content: string;
  images?: string[];
  poll?: Poll;
  event?: GroupEvent;
  challenge?: Challenge;
  likes: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
  author: User;
  group: Group;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  endDate: Date;
  allowMultiple: boolean;
  results: PollResult[];
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollResult {
  optionId: string;
  userId: string;
  votedAt: Date;
}

export interface GroupEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  maxParticipants?: number;
  participants: EventParticipant[];
}

export interface EventParticipant {
  userId: string;
  status: 'going' | 'maybe' | 'not-going';
  joinedAt: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'screenshot' | 'speedrun' | 'creative';
  startDate: Date;
  endDate: Date;
  rewards: Reward[];
  participants: ChallengeParticipant[];
}

export interface ChallengeParticipant {
  userId: string;
  score: number;
  submission?: string;
  submittedAt?: Date;
}

// Messaging Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'quote' | 'system';
  quotedMessageId?: string;
  images?: string[];
  isEncrypted: boolean;
  createdAt: Date;
  sender: User;
  quotedMessage?: Message;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Badge and Reward Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

export type BadgeCategory = 
  | 'friendship'
  | 'group'
  | 'activity'
  | 'achievement'
  | 'special';

export interface Reward {
  id: string;
  type: 'xp' | 'badge' | 'title' | 'custom';
  value: number | string;
  description: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

export type NotificationType = 
  | 'friend_request'
  | 'friend_accept'
  | 'group_invite'
  | 'group_post'
  | 'message'
  | 'challenge'
  | 'event'
  | 'achievement';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Socket Event Types
export interface SocketEvents {
  // Connection
  'user:connect': (userId: string) => void;
  'user:disconnect': (userId: string) => void;
  
  // Friends
  'friend:request': (request: FriendRequest) => void;
  'friend:accept': (friendship: Friendship) => void;
  'friend:reject': (requestId: string) => void;
  'friend:remove': (friendshipId: string) => void;
  'friend:status': (userId: string, status: User['status']) => void;
  
  // Messages
  'message:send': (message: Message) => void;
  'message:receive': (message: Message) => void;
  'message:typing': (conversationId: string, userId: string) => void;
  'message:stop-typing': (conversationId: string, userId: string) => void;
  
  // Groups
  'group:join': (member: GroupMember) => void;
  'group:leave': (groupId: string, userId: string) => void;
  'group:post': (post: GroupPost) => void;
  'group:post:like': (postId: string, userId: string) => void;
  'group:post:comment': (postId: string, comment: Comment) => void;
  
  // Notifications
  'notification:new': (notification: Notification) => void;
  'notification:read': (notificationId: string) => void;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateGroupForm {
  name: string;
  description: string;
  type: Group['type'];
  category: GroupCategory;
  tags: string[];
  gameAssociations: string[];
  settings: Partial<GroupSettings>;
}

export interface SendMessageForm {
  content: string;
  type: Message['type'];
  quotedMessageId?: string;
  images?: File[];
}

// Comment Type
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  likes: number;
  createdAt: Date;
  author: User;
}
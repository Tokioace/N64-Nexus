// User System Types
export interface User {
  id: string
  username: string
  email: string
  password?: string // Only used during registration, not stored in state
  level: number
  xp: number
  region: 'PAL' | 'NTSC'
  platform: 'N64' | 'PC' // New field for platform preference
  joinDate: Date
  avatar?: string
  bio?: string
  location?: string
  isPublic: boolean // Whether profile is visible to others
  collections: UserCollection[]
  personalRecords: PersonalRecord[]
}

export interface UserRegistrationData {
  username: string
  email: string
  password: string
  confirmPassword: string
  region: 'PAL' | 'NTSC'
  platform: 'N64' | 'PC'
}

export interface UserCollection {
  id: string
  userId: string
  gameId: string
  gameName: string
  platform: 'N64' | 'PC'
  region: 'PAL' | 'NTSC'
  condition: 'mint' | 'very-good' | 'good' | 'fair' | 'poor'
  completeness: 'complete' | 'cart-only' | 'box-only'
  acquisitionDate: Date
  notes?: string
  imageUrl?: string
  isWishlist: boolean
}

export interface PersonalRecord {
  id: string
  userId: string
  gameId: string
  gameName: string
  category: string
  time?: string // For speedruns
  score?: number // For high scores
  platform: 'N64' | 'PC'
  region: 'PAL' | 'NTSC'
  achievedDate: Date
  verified: boolean
  mediaUrl?: string
  notes?: string
}

export interface UserContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: UserRegistrationData) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  addXP: (amount: number) => void
  addToCollection: (item: Omit<UserCollection, 'id' | 'userId'>) => Promise<boolean>
  removeFromCollection: (itemId: string) => Promise<boolean>
  addPersonalRecord: (record: Omit<PersonalRecord, 'id' | 'userId'>) => Promise<boolean>
  updatePersonalRecord: (recordId: string, updates: Partial<PersonalRecord>) => Promise<boolean>
  getUserProfile: (userId: string) => Promise<User | null>
  getAllUsers: () => Promise<User[]>
}

// Quiz System Types
export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  explanation?: string
}

export interface QuizResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  xpEarned: number
}

export interface QuizContextType {
  currentQuestion: QuizQuestion | null
  currentQuestionIndex: number
  totalQuestions: number
  score: number
  timeStarted: Date | null
  isQuizActive: boolean
  quizResult: QuizResult | null
  
  startQuiz: (difficulty?: string, category?: string) => void
  answerQuestion: (answerIndex: number) => void
  nextQuestion: () => void
  finishQuiz: () => void
  resetQuiz: () => void
}

// Event System Types
export interface GameEvent {
  id: string
  title: string
  description: string
  game: string
  category: string
  startDate: Date
  endDate: Date
  isActive: boolean
  participants: number
  maxParticipants?: number
  rules: string[]
  prizes: string[]
  region: 'PAL' | 'NTSC' | 'BOTH'
}

export interface EventParticipation {
  id: string
  eventId: string
  userId: string
  username: string
  score?: number
  time?: string
  position?: number
  submissionDate: Date
  mediaUrl?: string
  livestreamUrl?: string
  documentationType?: 'photo' | 'video' | 'livestream'
  notes?: string
  verified: boolean
}

export interface RaceSubmissionData {
  eventId: string
  time: string
  documentationType: 'photo' | 'video' | 'livestream'
  mediaFile?: File
  livestreamUrl?: string
  notes?: string
}

export interface EventContextType {
  events: GameEvent[]
  activeEvents: GameEvent[]
  userParticipations: EventParticipation[]
  allEventSubmissions: EventParticipation[] // All submissions from all users
  loading: boolean
  error: string | null
  
  getEvents: () => void
  joinEvent: (eventId: string, currentUser?: { id: string; username: string }) => Promise<boolean>
  leaveEvent: (eventId: string, currentUser?: { id: string; username: string }) => Promise<boolean>
  submitScore: (eventId: string, score: number, time?: string, mediaUrl?: string) => Promise<boolean>
  submitRaceTime: (data: RaceSubmissionData, currentUser?: { id: string; username: string }) => Promise<boolean>
  getLeaderboard: (eventId: string) => EventParticipation[]
  getAllSubmissions: () => EventParticipation[]
  getSubmissionsByUser: (userId: string) => EventParticipation[]
}

// Global Leaderboard Types
export interface GlobalLeaderboardEntry {
  userId: string
  username: string
  totalXP: number
  level: number
  eventWins: number
  personalBests: number
  collectionsCount: number
  region: 'PAL' | 'NTSC'
  platform: 'N64' | 'PC'
  avatar?: string
}

export interface GameLeaderboard {
  gameId: string
  gameName: string
  platform: 'N64' | 'PC'
  region: 'PAL' | 'NTSC'
  category: string
  entries: GameLeaderboardEntry[]
}

export interface GameLeaderboardEntry {
  userId: string
  username: string
  time?: string
  score?: number
  achievedDate: Date
  verified: boolean
  mediaUrl?: string
  platform: 'N64' | 'PC'
  region: 'PAL' | 'NTSC'
}

// Media System Types
export interface MediaMeta {
  id: string
  userId: string
  username: string
  gameId: string
  gameName: string
  eventId?: string
  type: 'speedrun' | 'screenshot' | 'achievement'
  title: string
  description?: string
  url: string
  thumbnailUrl?: string
  uploadDate: Date
  verified: boolean
  likes: number
  views: number
  tags: string[]
}

export interface MediaContextType {
  media: MediaMeta[]
  userMedia: MediaMeta[]
  loading: boolean
  error: string | null
  
  uploadMedia: (file: File, metadata: Partial<MediaMeta>) => Promise<boolean>
  deleteMedia: (mediaId: string) => Promise<boolean>
  likeMedia: (mediaId: string) => Promise<boolean>
  getMediaByUser: (userId: string) => MediaMeta[]
  getMediaByEvent: (eventId: string) => MediaMeta[]
  getMediaByGame: (gameId: string) => MediaMeta[]
  verifyMedia: (mediaId: string, isVerified: boolean) => Promise<void>
  isCapturingAllowed: (eventId?: string) => boolean
}

// Forum System Types
export interface ForumCategory {
  id: string
  name: string
  description: string
  threadCount: number
  lastPost?: {
    id: string
    authorId: string
    authorName: string
    createdAt: Date
    threadTitle: string
  }
  icon: string
  color: string
}

export interface ForumThread {
  id: string
  title: string
  categoryId: string
  authorId: string
  authorName: string
  createdAt: Date
  lastUpdated: Date
  postCount: number
  views: number
  isPinned: boolean
  isLocked: boolean
  lastPost?: {
    id: string
    authorId: string
    authorName: string
    createdAt: Date
  }
}

export interface ForumPost {
  id: string
  threadId: string
  authorId: string
  authorName: string
  content: string
  imageUrl?: string
  createdAt: Date
  isEdited: boolean
  editedAt?: Date
  isDeleted: boolean
}

export interface ForumStats {
  totalThreads: number
  totalPosts: number
  totalMembers: number
  newestMember: string
  mostActiveCategory: string
}

// Marketplace System Types
export interface MarketplaceListing {
  id: string
  sellerId: string
  sellerName: string
  gameId: string
  gameName: string
  platform: 'N64'
  region: 'PAL' | 'NTSC'
  condition: 'mint' | 'very-good' | 'good' | 'fair' | 'poor'
  completeness: 'complete' | 'cart-only' | 'box-only'
  price: number
  currency: 'EUR' | 'USD' | 'GBP' | 'JPY' | 'CNY' | 'RUB' | 'INR' | 'SAR'
  description: string
  images: string[]
  createdAt: Date
  updatedAt: Date
  status: 'active' | 'sold' | 'reserved' | 'removed'
  location: string
  shippingOptions: ShippingOption[]
  tags: string[]
  views: number
  watchedBy: string[] // User IDs who are watching this listing
}

export interface ShippingOption {
  id: string
  name: string
  price: number
  estimatedDays: number
}

export interface MarketplaceFilter {
  gameId?: string
  condition?: string[]
  completeness?: string[]
  priceRange?: { min: number; max: number }
  region?: string[]
  location?: string
  sellerRating?: number
}

export interface MarketplaceSort {
  field: 'price' | 'createdAt' | 'views' | 'sellerRating'
  direction: 'asc' | 'desc'
}

// Chat System Types
export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  content: string
  type: 'text' | 'image' | 'offer' | 'system'
  createdAt: Date
  isRead: boolean
  isEdited: boolean
  editedAt?: Date
  attachments?: ChatAttachment[]
  offerData?: OfferData
}

export interface ChatAttachment {
  id: string
  type: 'image' | 'document'
  url: string
  name: string
  size: number
}

export interface OfferData {
  listingId: string
  amount: number
  currency: string
  message?: string
  status: 'pending' | 'accepted' | 'rejected' | 'countered'
  expiresAt: Date
}

export interface ChatConversation {
  id: string
  participants: ChatParticipant[]
  listingId?: string // Optional - for marketplace-related chats
  lastMessage?: ChatMessage
  lastActivity: Date
  unreadCount: { [userId: string]: number }
  isActive: boolean
  createdAt: Date
}

export interface ChatParticipant {
  userId: string
  username: string
  avatar?: string
  joinedAt: Date
  isActive: boolean
  lastSeen: Date
}

export interface MarketplaceContextType {
  listings: MarketplaceListing[]
  myListings: MarketplaceListing[]
  watchedListings: MarketplaceListing[]
  filters: MarketplaceFilter
  sort: MarketplaceSort
  isLoading: boolean
  error: string | null
  
  // Listing management
  createListing: (listing: Omit<MarketplaceListing, 'id' | 'sellerId' | 'sellerName' | 'createdAt' | 'updatedAt' | 'views' | 'watchedBy'>) => Promise<boolean>
  updateListing: (listingId: string, updates: Partial<MarketplaceListing>) => Promise<boolean>
  deleteListing: (listingId: string) => Promise<boolean>
  getListing: (listingId: string) => Promise<MarketplaceListing | null>
  getListings: (filters?: MarketplaceFilter, sort?: MarketplaceSort) => Promise<MarketplaceListing[]>
  
  // Watching/favorites
  watchListing: (listingId: string) => Promise<boolean>
  unwatchListing: (listingId: string) => Promise<boolean>
  
  // Filters and sorting
  setFilters: (filters: MarketplaceFilter) => void
  setSort: (sort: MarketplaceSort) => void
  clearFilters: () => void
}

export interface ChatContextType {
  conversations: ChatConversation[]
  activeConversation: ChatConversation | null
  messages: { [conversationId: string]: ChatMessage[] }
  isLoading: boolean
  error: string | null
  
  // Conversation management
  createConversation: (participantIds: string[], listingId?: string) => Promise<string | null>
  getConversations: () => Promise<ChatConversation[]>
  getConversation: (conversationId: string) => Promise<ChatConversation | null>
  setActiveConversation: (conversationId: string | null) => void
  
  // Message management
  sendMessage: (conversationId: string, content: string, type?: 'text' | 'image' | 'offer') => Promise<boolean>
  getMessages: (conversationId: string) => Promise<ChatMessage[]>
  markMessagesAsRead: (conversationId: string) => Promise<boolean>
  editMessage: (messageId: string, content: string) => Promise<boolean>
  
  // Offers
  sendOffer: (conversationId: string, offerData: Omit<OfferData, 'status' | 'expiresAt'>) => Promise<boolean>
  respondToOffer: (messageId: string, response: 'accepted' | 'rejected') => Promise<boolean>
  counterOffer: (messageId: string, newAmount: number, message?: string) => Promise<boolean>
}
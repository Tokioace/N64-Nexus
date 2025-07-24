// User System Types
export interface User {
  id: string
  username: string
  email: string
  password?: string // Only used during registration, not stored in state
  level: number
  xp: number
  points: number // Points earned from achievements and activities
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
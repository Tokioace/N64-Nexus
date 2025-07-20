// User System Types
export interface User {
  id: string
  username: string
  email: string
  level: number
  xp: number
  region: 'PAL' | 'NTSC'
  joinDate: Date
  avatar?: string
  bio?: string
  location?: string
}

export interface UserContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  addXP: (amount: number) => void
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
  verified: boolean
}

export interface EventContextType {
  events: GameEvent[]
  activeEvents: GameEvent[]
  userParticipations: EventParticipation[]
  loading: boolean
  error: string | null
  
  getEvents: () => void
  joinEvent: (eventId: string) => Promise<boolean>
  leaveEvent: (eventId: string) => Promise<boolean>
  submitScore: (eventId: string, score: number, time?: string, mediaUrl?: string) => Promise<boolean>
  getLeaderboard: (eventId: string) => EventParticipation[]
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
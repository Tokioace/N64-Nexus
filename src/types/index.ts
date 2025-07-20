export interface User {
  id: string
  username: string
  points: number
  level: number
  totalQuizzes: number
  correctAnswers: number
  totalAnswers: number
  achievements: Achievement[]
  quizProgress: QuizProgress
}

export interface QuizQuestion {
  id: string
  type: 'multiple-choice' | 'true-false' | 'image' | 'sequence'
  category: QuizCategory
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  imageUrl?: string
  explanation?: string
  points: number
  timeLimit?: number
}

export type QuizCategory = 
  | 'general'
  | 'characters'
  | 'games'
  | 'hardware'
  | 'music'
  | 'history'
  | 'trivia'

export interface QuizSession {
  id: string
  mode: 'single' | 'daily' | 'weekly' | 'speed'
  questions: QuizQuestion[]
  currentQuestionIndex: number
  answers: Answer[]
  startTime: Date
  endTime?: Date
  score: number
  maxScore: number
}

export interface Answer {
  questionId: string
  userAnswer: string | string[]
  isCorrect: boolean
  timeSpent: number
  points: number
}

export interface QuizProgress {
  totalQuestions: number
  correctAnswers: number
  categories: Record<QuizCategory, { total: number; correct: number }>
  achievements: string[]
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface LeaderboardEntry {
  rank: number
  user: User
  score: number
  quizCount: number
  averageScore: number
}

export interface Minigame {
  id: string
  name: string
  description: string
  icon: string
  difficulty: 'easy' | 'medium' | 'hard'
  maxScore: number
  isAvailable: boolean
}

export interface QuizContextType {
  currentSession: QuizSession | null
  startQuiz: (mode: QuizSession['mode'], category?: QuizCategory) => void
  answerQuestion: (answer: string | string[]) => void
  endQuiz: () => void
  getQuestion: () => QuizQuestion | null
  getProgress: () => { current: number; total: number; percentage: number }
  getScore: () => { current: number; max: number; percentage: number }
}

export interface CollectionItem {
  gameId: string
  hasBox: boolean
  hasManual: boolean
  hasModule: boolean
  addedAt: Date
  notes?: string
}

export interface CollectionStats {
  totalGames: number
  totalValue: number
  completionPercentage: number
  level: number
  levelName: string
}

export interface UserContextType {
  user: User | null
  login: (username: string) => void
  logout: () => void
  updatePoints: (points: number) => void
  updateQuizProgress: (questionId: string, isCorrect: boolean) => void
  unlockAchievement: (achievementId: string) => void
}

// Event System Types
export interface GameEvent {
  id: string
  title: string
  game: string
  type: 'Speedrun' | 'Time Trial' | 'Challenge' | 'Collection' | 'Anniversary' | 'Team'
  startDate: string
  endDate: string
  description: string
  rewards: string[]
  image: string
  isActive?: boolean
  isCompleted?: boolean
  participants?: number
  maxParticipants?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  category?: string
  eventType?: 'individual' | 'team'
  statistics?: EventStatistics
}

export interface EventStatistics {
  totalParticipants: number
  averageTime?: number
  mediaSubmissions: number
  totalSubmissions: number
}

export interface EventTeam {
  id: string
  name: string
  memberIds: string[]
  members: string[]
  createdBy: string
  eventId: string
  createdAt: Date
}

export interface TeamResult {
  id: string
  teamId: string
  eventId: string
  averageScore: number
  bestThreeScores: number[]
  allScores: { userId: string; score: number }[]
  completedAt: Date
}

export interface EventParticipation {
  eventId: string
  userId: string
  joinedAt: Date
  completedAt?: Date
  progress: number
  rewards: string[]
  isCompleted: boolean
  medal?: 'gold' | 'silver' | 'bronze' | 'top10' | 'participant'
  score?: number
  time?: number
  position?: number
  teamId?: string
}

export interface EventReward {
  id: string
  name: string
  type: 'XP' | 'Badge' | 'Token' | 'Cosmetic'
  value: number | string
  icon: string
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface EventContextType {
  events: GameEvent[]
  activeEvents: GameEvent[]
  upcomingEvents: GameEvent[]
  completedEvents: GameEvent[]
  participations: EventParticipation[]
  teams: EventTeam[]
  teamResults: TeamResult[]
  getEventById: (id: string) => GameEvent | null
  joinEvent: (eventId: string) => void
  completeEvent: (eventId: string, score?: number, time?: number) => void
  getEventProgress: (eventId: string) => number
  getEventRewards: (eventId: string) => EventReward[]
  isEventActive: (event: GameEvent) => boolean
  getTimeRemaining: (event: GameEvent) => { days: number; hours: number; minutes: number; seconds: number }
  createTeam: (eventId: string, teamName: string) => void
  joinTeam: (teamId: string) => void
  leaveTeam: (teamId: string) => void
  getTeamsByEvent: (eventId: string) => EventTeam[]
  getUserTeamForEvent: (eventId: string) => EventTeam | null
  assignMedals: (eventId: string) => void
  getEventStatistics: (eventId: string) => EventStatistics
  setEventReminder: (eventId: string, enabled: boolean) => void
  getEventReminders: () => string[]
  checkEventReminders: () => { eventId: string; title: string }[]
}

// Media Capture & Verification Types
export interface MediaMeta {
  id: string
  userId: string
  gameId: string
  eventId?: string
  type: 'photo' | 'video' | 'stream'
  url: string
  timestamp: string
  isEventRun: boolean
  isPublic: boolean
  isVerified: boolean
  comment?: string
  gameTime?: string
  metadata: {
    deviceInfo?: string
    resolution?: string
    duration?: number
    fileSize?: number
  }
  votes: {
    likes: number
    dislikes: number
    userVote?: 'like' | 'dislike'
  }
  reports: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

export interface MediaCaptureSettings {
  allowPhoto: boolean
  allowVideo: boolean
  allowStream: boolean
  maxVideoDuration: number
  maxFileSize: number
  requiredFields: string[]
  eventTimeWindow?: {
    start: Date
    end: Date
  }
}

export interface MediaUploadProgress {
  mediaId: string
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  error?: string
}

export interface Leaderboard {
  id: string
  gameId: string
  eventId?: string
  type: 'daily' | 'weekly' | 'monthly' | 'event'
  entries: LeaderboardEntry[]
  lastUpdated: Date
}

export interface SpeedrunEntry extends LeaderboardEntry {
  gameTime: string
  media?: MediaMeta
  isVerified: boolean
  submittedAt: Date
}

export interface MediaContextType {
  mediaList: MediaMeta[]
  uploadProgress: MediaUploadProgress[]
  settings: MediaCaptureSettings
  captureMedia: (type: 'photo' | 'video', gameId: string, eventId?: string) => Promise<string>
  uploadMedia: (file: File, metadata: Partial<MediaMeta>) => Promise<string>
  deleteMedia: (mediaId: string) => Promise<void>
  voteOnMedia: (mediaId: string, vote: 'like' | 'dislike') => Promise<void>
  reportMedia: (mediaId: string, reason: string) => Promise<void>
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
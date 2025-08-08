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
  // New points system fields
  points?: UserPoints
  // Legal compliance fields
  birthDate?: Date // Required for 18+ verification
  termsAccepted?: boolean
  privacyAccepted?: boolean
  copyrightAcknowledged?: boolean
}

export interface UserRegistrationData {
  username: string
  email: string
  password: string
  confirmPassword: string
  region: 'PAL' | 'NTSC'
  platform: 'N64' | 'PC'
  // Legal compliance fields (required for registration)
  birthDate: string // Date string from form input
  termsAccepted: boolean
  privacyAccepted: boolean
  copyrightAcknowledged: boolean
  ageConfirmed: boolean // "I am over 18 years old" checkbox
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
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: UserRegistrationData) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  deleteAccount: () => Promise<boolean> // GDPR-compliant account deletion
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

// Interaction System Types
export interface InteractionData {
  likes: number
  views: number
  comments: Comment[]
  likedBy: string[] // User IDs who liked this content
  viewedBy: string[] // User IDs who viewed this content
}

export interface Comment {
  id: string
  userId: string
  username: string
  content: string
  createdAt: Date
  likes: number
  likedBy: string[]
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
  pointsSystem?: {
    participation: number
    positions: number[] // Points for positions 1-10, F1 style
  }
  interactions: InteractionData
  // Best lap media for showcasing
  bestLap?: {
    time: string
    username: string
    mediaUrl?: string
    mediaType: 'photo' | 'video' | 'livestream'
    livestreamUrl?: string
    verified: boolean
  }
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
  // Points system integration
  shouldAwardParticipationPoints: (eventId: string, userId: string) => boolean
  markParticipationPointsAwarded: (eventId: string, userId: string) => void
  getEventPositionPoints: (eventId: string) => Array<{userId: string, position: number, points: number}>
  markPositionPointsAwarded: (eventId: string, userId: string, position: number) => void
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
  interactions: InteractionData
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
  
  // Extended functionality
  uploadMediaFromUrl?: (url: string, metadata: Partial<MediaMeta>) => Promise<boolean>
  getMediaByDateRange?: (startDate: Date, endDate: Date) => MediaMeta[]
  getUserMediaHistory?: (userId: string) => MediaMeta[]
  getMediaStats?: () => {
    totalMedia: number
    totalViews: number
    totalLikes: number
    verifiedMedia: number
    mediaByType: {
      speedrun: number
      screenshot: number
      achievement: number
    }
    mediaByUser: Record<string, number>
  }
  clearAllMedia?: () => void
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
  interactions: InteractionData
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
  interactions: InteractionData
}

export interface ForumStats {
  totalThreads: number
  totalPosts: number
  totalMembers: number
  newestMember: string
  mostActiveCategory: string
}

// Points System Types
export interface UserPoints {
  totalPoints: number
  seasonPoints: { [seasonKey: string]: number }
  currentRank: UserRank
  achievementsUnlocked: string[] // i18n keys
  medals: UserMedal[]
  pointHistory: PointsHistoryEntry[]
}

export interface PointsHistoryEntry {
  id: string
  date: Date
  action: string // i18n key like 'points.speedrunUpload'
  points: number
  description?: string
}

export interface UserRank {
  key: string // i18n key like 'rank.n64Legend'
  minPoints: number
  currentPoints: number
}

export interface UserMedal {
  id: string
  season: string
  rank: number
  medalKey: string // i18n key like 'medal.legend'
  bonusXP: number
  awardedDate: Date
}

export interface Achievement {
  id: string
  key: string // i18n key like 'achievement.speedrunMaster'
  iconKey: string
  requiredPoints?: number
  requiredActions?: { action: string; count: number }[]
  unlocked: boolean
  unlockedDate?: Date
}

// Points Configuration
export interface PointsConfig {
  'speedrun.upload': number
  'speedrun.top3': number
  'media.speedrun': number
  'media.screenshot': number
  'media.achievement': number
  'media.stream': number
  'fanart.upload': number
  'fanart.likeReceived': number
  'fanart.comment': number
  'quiz.answerCorrect': number
  'quiz.fullPerfect': number
  'minigame.success': number
  'forum.post': number
  'forum.reply': number
  'chat.messages': number
  'chat.helpfulReply': number
  'chat.likeReceived': number
  'profile.setupComplete': number
  'marketplace.saleConfirmed': number
  'news.shared': number
  // Event participation and position points
  'event.participation': number
  'event.position.1': number
  'event.position.2': number
  'event.position.3': number
  'event.position.4': number
  'event.position.5': number
  'event.position.6': number
  'event.position.7': number
  'event.position.8': number
  'event.position.9': number
  'event.position.10': number
  // Interaction points
  'interaction.like': number
  'interaction.likeReceived': number
  'interaction.comment': number
  'interaction.commentReceived': number
  'interaction.view': number
}

export interface RankConfig {
  key: string // i18n key
  minPoints: number
  iconKey: string
}

export interface MedalConfig {
  place: number
  key: string // i18n key
  iconKey: string
  bonusXP: number
}

// N64Fan Leaderboard Types
export interface N64FanLeaderboardEntry {
  userId: string
  username: string
  avatar?: string
  totalPoints: number
  seasonPoints: number
  currentRank: UserRank
  region: 'PAL' | 'NTSC'
  platform: 'N64' | 'PC'
  position: number
  medals: UserMedal[]
  isCurrentUser?: boolean
}

export interface LeaderboardFilter {
  type: 'global' | 'friends' | 'region'
  timeframe: 'allTime' | 'season' | 'month'
  region?: 'PAL' | 'NTSC'
  platform?: 'N64' | 'PC'
}

// Points System Context Type
export interface PointsContextType {
  // User points data
  userPoints: UserPoints | null
  globalLeaderboard: N64FanLeaderboardEntry[]
  seasonLeaderboard: N64FanLeaderboardEntry[]
  
  // Configuration
  pointsConfig: PointsConfig
  ranksConfig: RankConfig[]
  achievementsConfig: Achievement[]
  medalsConfig: MedalConfig[]
  
  // Actions
  awardPoints: (action: keyof PointsConfig, description?: string) => Promise<boolean>
  updateUserRank: () => Promise<void>
  checkAchievements: () => Promise<Achievement[]>
  getLeaderboard: (filter: LeaderboardFilter) => N64FanLeaderboardEntry[]
  getUserPosition: (userId: string, filter: LeaderboardFilter) => number
  
  // Season management
  currentSeason: string
  startNewSeason: () => Promise<void>
  awardSeasonMedals: () => Promise<void>
  
  // Loading states
  loading: boolean
  error: string | null
}

// Interaction System Context Type
export interface InteractionContextType {
  // Actions for any content type
  likeContent: (contentType: string, contentId: string, userId: string) => Promise<boolean>
  unlikeContent: (contentType: string, contentId: string, userId: string) => Promise<boolean>
  addComment: (contentType: string, contentId: string, userId: string, username: string, content: string) => Promise<boolean>
  likeComment: (contentType: string, contentId: string, commentId: string, userId: string) => Promise<boolean>
  viewContent: (contentType: string, contentId: string, userId: string) => Promise<boolean>
  
  // Getters for interaction data
  getInteractionData: (contentType: string, contentId: string) => InteractionData
  hasUserLiked: (contentType: string, contentId: string, userId: string) => boolean
  hasUserViewed: (contentType: string, contentId: string, userId: string) => boolean
  
  // Statistics
  getTotalLikesForUser: (userId: string) => number
  getTotalCommentsForUser: (userId: string) => number
  getMostLikedContent: (contentType?: string) => Array<{id: string, type: string, likes: number}>
  
  // Loading states
  loading: boolean
  error: string | null
}

// Content Moderation & Reporting Types
export interface ContentReport {
  id: string
  contentType: 'speedrun' | 'fanart' | 'chat' | 'forum' | 'profile' | 'event'
  contentId: string
  reason: string
  description?: string
  reportedBy: string
  reportedByUsername?: string
  status: 'pending' | 'reviewed' | 'dismissed' | 'action_taken'
  reviewedBy?: string
  reviewedAt?: Date
  actionTaken?: string
  createdAt: Date
  updatedAt: Date
}

export interface ContentFlag {
  id: string
  contentType: 'speedrun' | 'fanart' | 'chat' | 'forum' | 'profile' | 'event'
  contentId: string
  flagType: 'nsfw' | 'spam' | 'hate_speech' | 'copyright' | 'inappropriate'
  confidenceScore?: number // AI confidence score (0.00-1.00)
  autoHidden: boolean
  manualReviewRequired: boolean
  createdAt: Date
}

export interface AdminAction {
  id: string
  adminId: string
  adminUsername?: string
  actionType: 'content_hidden' | 'content_removed' | 'user_warned' | 'user_suspended' | 'user_banned' | 'report_reviewed'
  targetType: 'user' | 'content' | 'report'
  targetId: string
  reason: string
  notes?: string
  createdAt: Date
}

export interface ReportingContextType {
  // Report content
  reportContent: (contentType: string, contentId: string, reason: string, description?: string) => Promise<boolean>
  
  // Admin functions
  getReports: (status?: string) => Promise<ContentReport[]>
  reviewReport: (reportId: string, action: 'dismiss' | 'take_action', actionDetails?: string) => Promise<boolean>
  hideContent: (contentType: string, contentId: string, reason: string) => Promise<boolean>
  unhideContent: (contentType: string, contentId: string) => Promise<boolean>
  
  // Content flags
  getContentFlags: (contentType?: string, contentId?: string) => Promise<ContentFlag[]>
  isContentHidden: (contentType: string, contentId: string) => Promise<boolean>
  
  // Admin actions audit
  getAdminActions: (adminId?: string) => Promise<AdminAction[]>
  
  // Statistics
  getReportStats: () => Promise<{
    totalReports: number
    pendingReports: number
    resolvedReports: number
    reportsByType: Record<string, number>
  }>
  
  loading: boolean
  error: string | null
}

// Legal & Compliance Types
export interface LegalAgreement {
  type: 'terms' | 'privacy' | 'copyright'
  version: string
  acceptedAt: Date
  ipAddress?: string
}

export interface CookieConsent {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
  consentDate: Date
  consentVersion: string
}

export interface LegalContextType {
  // Cookie consent
  cookieConsent: CookieConsent | null
  updateCookieConsent: (consent: Partial<CookieConsent>) => void
  hasCookieConsent: () => boolean
  
  // Legal agreements
  acceptLegalAgreement: (type: 'terms' | 'privacy' | 'copyright') => Promise<boolean>
  getLegalAgreements: () => Promise<LegalAgreement[]>
  
  // Age verification
  verifyAge: (birthDate: Date) => boolean
  
  // GDPR data export
  requestDataExport: () => Promise<boolean>
  
  loading: boolean
  error: string | null
}

// Upload Security Types
export interface UploadSecurityCheck {
  isNSFW: boolean
  confidence: number
  flaggedContent: string[]
  approved: boolean
  requiresManualReview: boolean
}

export interface SecureUploadData {
  file: File
  contentType: string
  rightsConfirmed: boolean
  copyrightAcknowledged: boolean
  contentWarnings?: string[]
}
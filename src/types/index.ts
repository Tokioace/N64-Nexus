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

export interface UserContextType {
  user: User | null
  login: (username: string) => void
  logout: () => void
  updatePoints: (points: number) => void
  updateQuizProgress: (questionId: string, isCorrect: boolean) => void
  unlockAchievement: (achievementId: string) => void
}
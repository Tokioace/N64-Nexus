export interface Question {
  id: string
  category: QuizCategory
  type: QuestionType
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  imageUrl?: string
  audioUrl?: string
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
}

export type QuizCategory = 
  | 'game-knowledge'
  | 'release-history' 
  | 'fanart'
  | 'music-sounds'
  | 'glitches-speedruns'
  | 'seasonal'

export type QuestionType = 
  | 'multiple-choice'
  | 'image-recognition'
  | 'audio'
  | 'true-false'

export interface QuizSession {
  id: string
  category: QuizCategory
  questions: Question[]
  currentQuestionIndex: number
  score: number
  totalQuestions: number
  timeLimit?: number
  startTime: Date
  endTime?: Date
  answers: Answer[]
}

export interface Answer {
  questionId: string
  selectedOption: number
  isCorrect: boolean
  timeSpent: number
}

export interface QuizResult {
  sessionId: string
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  xpEarned: number
  achievements: Achievement[]
  date: Date
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: Date
}

export interface UserProfile {
  id: string
  username: string
  level: number
  xp: number
  totalScore: number
  quizzesCompleted: number
  achievements: Achievement[]
  titles: string[]
  joinDate: Date
  lastActive: Date
}

export interface LeaderboardEntry {
  rank: number
  username: string
  score: number
  level: number
  xp: number
}

export interface DuelSession {
  id: string
  player1: string
  player2: string
  questions: Question[]
  currentQuestionIndex: number
  player1Score: number
  player2Score: number
  player1Answers: Answer[]
  player2Answers: Answer[]
  status: 'waiting' | 'active' | 'finished'
  startTime: Date
  endTime?: Date
}
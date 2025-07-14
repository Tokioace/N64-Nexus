export interface User {
  id: string
  username: string
  avatar: string
  joinDate: Date
  totalGames: number
  totalRuns: number
}

export interface Game {
  id: string
  name: string
  platform: 'N64' | 'PC' | 'Emulator'
  region: 'PAL' | 'NTSC'
  releaseYear: number
  coverImage: string
  totalRuns: number
  personalBest?: Run
  globalRank?: number
}

export interface Run {
  id: string
  gameId: string
  userId: string
  totalTime: number // in milliseconds
  trackTimes: TrackTime[]
  date: Date
  platform: 'N64' | 'PC' | 'Emulator'
  region: 'PAL' | 'NTSC'
  screenshot?: string
  video?: string
  notes?: string
  isPersonalBest: boolean
  isWorldRecord: boolean
}

export interface TrackTime {
  trackId: string
  trackName: string
  time: number // in milliseconds
  lap: number
}

export interface Track {
  id: string
  name: string
  gameId: string
  worldRecord?: number
  averageTime?: number
}

export interface Goal {
  id: string
  userId: string
  gameId: string
  trackId?: string
  targetTime: number // in milliseconds
  currentBest?: number
  deadline?: Date
  isCompleted: boolean
  progress: number // 0-100
  type: 'personal' | 'challenge'
  challengeOpponent?: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'speed' | 'consistency' | 'milestone' | 'social'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: Date
  progress?: number
  maxProgress?: number
}

export interface Statistics {
  totalRuns: number
  totalTime: number
  averageTime: number
  personalBests: number
  worldRecords: number
  improvementRate: number
  consistencyScore: number
  rank: number
  percentile: number
}

export interface ProgressData {
  date: Date
  time: number
  improvement: number
}

export interface ComparisonData {
  opponent: string
  timeDifference: number
  percentageDifference: number
  isFaster: boolean
}
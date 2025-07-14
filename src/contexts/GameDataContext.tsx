import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Game, Run, Goal, Achievement, User } from '../types'

interface GameDataContextType {
  games: Game[]
  runs: Run[]
  goals: Goal[]
  achievements: Achievement[]
  currentUser: User | null
  loading: boolean
  addRun: (run: Omit<Run, 'id'>) => void
  addGoal: (goal: Omit<Goal, 'id'>) => void
  updateGoal: (goalId: string, updates: Partial<Goal>) => void
  getGameStats: (gameId: string) => any
  getUserStats: () => any
}

const GameDataContext = createContext<GameDataContextType | undefined>(undefined)

export const useGameData = () => {
  const context = useContext(GameDataContext)
  if (context === undefined) {
    throw new Error('useGameData must be used within a GameDataProvider')
  }
  return context
}

interface GameDataProviderProps {
  children: ReactNode
}

export const GameDataProvider: React.FC<GameDataProviderProps> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([])
  const [runs, setRuns] = useState<Run[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock data initialization
  useEffect(() => {
    const mockGames: Game[] = [
      {
        id: '1',
        name: 'Mario Kart 64',
        platform: 'N64',
        region: 'PAL',
        releaseYear: 1996,
        coverImage: '/api/covers/mk64.jpg',
        totalRuns: 156,
        globalRank: 42
      },
      {
        id: '2',
        name: 'Super Mario 64',
        platform: 'N64',
        region: 'NTSC',
        releaseYear: 1996,
        coverImage: '/api/covers/sm64.jpg',
        totalRuns: 89,
        globalRank: 15
      },
      {
        id: '3',
        name: 'GoldenEye 007',
        platform: 'N64',
        region: 'PAL',
        releaseYear: 1997,
        coverImage: '/api/covers/goldeneye.jpg',
        totalRuns: 203,
        globalRank: 67
      }
    ]

    const mockRuns: Run[] = [
      {
        id: '1',
        gameId: '1',
        userId: '1',
        totalTime: 120000, // 2 minutes
        trackTimes: [
          { trackId: '1', trackName: 'Luigi Raceway', time: 30000, lap: 1 },
          { trackId: '2', trackName: 'Moo Moo Farm', time: 35000, lap: 1 },
          { trackId: '3', trackName: 'Koopa Troopa Beach', time: 55000, lap: 1 }
        ],
        date: new Date('2024-01-15'),
        platform: 'N64',
        region: 'PAL',
        isPersonalBest: true,
        isWorldRecord: false
      }
    ]

    const mockGoals: Goal[] = [
      {
        id: '1',
        userId: '1',
        gameId: '1',
        trackId: '1',
        targetTime: 28000, // 28 seconds
        currentBest: 30000,
        deadline: new Date('2024-02-01'),
        isCompleted: false,
        progress: 75,
        type: 'personal'
      }
    ]

    const mockAchievements: Achievement[] = [
      {
        id: '1',
        name: 'Speed Demon',
        description: 'Complete a track under 30 seconds',
        icon: '🏁',
        category: 'speed',
        rarity: 'common',
        unlockedAt: new Date('2024-01-10')
      },
      {
        id: '2',
        name: 'Consistency King',
        description: 'Improve your time 5 weeks in a row',
        icon: '👑',
        category: 'consistency',
        rarity: 'rare',
        progress: 3,
        maxProgress: 5
      }
    ]

    const mockUser: User = {
      id: '1',
      username: 'SpeedRunner64',
      avatar: '/api/avatars/default.png',
      joinDate: new Date('2023-01-15'),
      totalGames: 47,
      totalRuns: 284
    }

    setGames(mockGames)
    setRuns(mockRuns)
    setGoals(mockGoals)
    setAchievements(mockAchievements)
    setCurrentUser(mockUser)
    setLoading(false)
  }, [])

  const addRun = (run: Omit<Run, 'id'>) => {
    const newRun: Run = {
      ...run,
      id: Date.now().toString()
    }
    setRuns(prev => [...prev, newRun])
  }

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString()
    }
    setGoals(prev => [...prev, newGoal])
  }

  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, ...updates } : goal
    ))
  }

  const getGameStats = (gameId: string) => {
    const gameRuns = runs.filter(run => run.gameId === gameId)
    const personalBest = gameRuns.reduce((best, run) => 
      run.totalTime < best.totalTime ? run : best, gameRuns[0]
    )
    
    return {
      totalRuns: gameRuns.length,
      personalBest,
      averageTime: gameRuns.reduce((sum, run) => sum + run.totalTime, 0) / gameRuns.length,
      recentRuns: gameRuns.slice(-5)
    }
  }

  const getUserStats = () => {
    return {
      totalRuns: runs.length,
      totalGames: games.length,
      personalBests: runs.filter(run => run.isPersonalBest).length,
      averageTime: runs.reduce((sum, run) => sum + run.totalTime, 0) / runs.length
    }
  }

  const value: GameDataContextType = {
    games,
    runs,
    goals,
    achievements,
    currentUser,
    loading,
    addRun,
    addGoal,
    updateGoal,
    getGameStats,
    getUserStats
  }

  return (
    <GameDataContext.Provider value={value}>
      {children}
    </GameDataContext.Provider>
  )
}
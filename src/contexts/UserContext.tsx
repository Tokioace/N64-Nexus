import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, UserContextType, QuizProgress, Achievement } from '../types'

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('battle64-user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const saveUser = (userData: User) => {
    localStorage.setItem('battle64-user', JSON.stringify(userData))
    setUser(userData)
  }

  const login = (username: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      username,
      points: 0,
      level: 1,
      totalQuizzes: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      achievements: [],
      quizProgress: {
        totalQuestions: 0,
        correctAnswers: 0,
        categories: {
          general: { total: 0, correct: 0 },
          characters: { total: 0, correct: 0 },
          games: { total: 0, correct: 0 },
          hardware: { total: 0, correct: 0 },
          music: { total: 0, correct: 0 },
          history: { total: 0, correct: 0 },
          trivia: { total: 0, correct: 0 },
        },
        achievements: [],
      },
    }
    saveUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('battle64-user')
    setUser(null)
  }

  const updatePoints = (points: number) => {
    if (!user) return

    const newPoints = user.points + points
    const newLevel = Math.floor(newPoints / 100) + 1

    const updatedUser = {
      ...user,
      points: newPoints,
      level: newLevel,
    }

    saveUser(updatedUser)
  }

  const updateQuizProgress = (questionId: string, isCorrect: boolean) => {
    if (!user) return

    const updatedProgress: QuizProgress = {
      ...user.quizProgress,
      totalQuestions: user.quizProgress.totalQuestions + 1,
      correctAnswers: user.quizProgress.correctAnswers + (isCorrect ? 1 : 0),
    }

    const updatedUser = {
      ...user,
      totalAnswers: user.totalAnswers + 1,
      correctAnswers: user.correctAnswers + (isCorrect ? 1 : 0),
      quizProgress: updatedProgress,
    }

    saveUser(updatedUser)
  }

  const unlockAchievement = (achievementId: string) => {
    if (!user || user.achievements.some(a => a.id === achievementId)) return

    const newAchievement: Achievement = {
      id: achievementId,
      name: getAchievementName(achievementId),
      description: getAchievementDescription(achievementId),
      icon: getAchievementIcon(achievementId),
      unlockedAt: new Date(),
      rarity: 'common',
    }

    const updatedUser = {
      ...user,
      achievements: [...user.achievements, newAchievement],
      quizProgress: {
        ...user.quizProgress,
        achievements: [...user.quizProgress.achievements, achievementId],
      },
    }

    saveUser(updatedUser)
  }

  const getAchievementName = (id: string): string => {
    const achievements: Record<string, string> = {
      'first-quiz': 'Erster Quiz',
      'perfect-score': 'Perfekte Runde',
      'speed-demon': 'Geschwindigkeitsdämon',
      'knowledge-master': 'Wissensmeister',
      'daily-streak': 'Tägliche Serie',
    }
    return achievements[id] || 'Unbekannte Errungenschaft'
  }

  const getAchievementDescription = (id: string): string => {
    const descriptions: Record<string, string> = {
      'first-quiz': 'Absolviere deinen ersten Quiz',
      'perfect-score': 'Erreiche eine perfekte Punktzahl',
      'speed-demon': 'Beantworte 10 Fragen in unter 30 Sekunden',
      'knowledge-master': 'Beantworte 100 Fragen korrekt',
      'daily-streak': 'Spiele 7 Tage in Folge',
    }
    return descriptions[id] || 'Unbekannte Beschreibung'
  }

  const getAchievementIcon = (id: string): string => {
    const icons: Record<string, string> = {
      'first-quiz': '🎯',
      'perfect-score': '🏆',
      'speed-demon': '⚡',
      'knowledge-master': '🧠',
      'daily-streak': '🔥',
    }
    return icons[id] || '🏅'
  }

  const updateUser = (userData: User) => {
    saveUser(userData)
  }

  const value: UserContextType = {
    user,
    login,
    logout,
    updatePoints,
    updateQuizProgress,
    unlockAchievement,
    saveUser,
    updateUser,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
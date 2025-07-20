import React, { createContext, useContext, useState, ReactNode } from 'react'
import { User, UserContextType } from '../types'

const UserContext = createContext<UserContextType | undefined>(undefined)

// Mock user for development
const mockUser: User = {
  id: '1',
  username: 'RetroGamer64',
  email: 'retro@battle64.com',
  level: 15,
  xp: 2500,
  region: 'PAL',
  joinDate: new Date('2024-03-01'),
  avatar: '🎮',
  bio: 'Leidenschaftlicher N64-Sammler und Speedrunner. Spezialisiert auf Mario 64 und Zelda-Spiele.',
  location: 'Berlin, Deutschland'
}

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser) // Auto-login for development

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would call an API
    if (email && password) {
      setUser(mockUser)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (user) {
      setUser({ ...user, ...updates })
      return true
    }
    return false
  }

  const addXP = (amount: number) => {
    if (user) {
      const newXP = user.xp + amount
      const newLevel = Math.floor(newXP / 1000) + 1
      setUser({
        ...user,
        xp: newXP,
        level: newLevel
      })
    }
  }

  const value: UserContextType = {
    user,
    login,
    logout,
    updateProfile,
    addXP
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
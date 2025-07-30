import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { User, UserContextType, UserRegistrationData, UserCollection, PersonalRecord } from '../types'

const UserContext = createContext<UserContextType | undefined>(undefined)

// Mock users database - in a real app, this would be handled by a backend
const mockUsers: User[] = [
  {
    id: '1',
    username: 'RetroGamer64',
    email: 'retro@battle64.com',
    level: 15,
    xp: 2500,
    region: 'PAL',
    platform: 'N64',
    joinDate: new Date('2024-03-01'),
    avatar: '🎮',
    bio: 'Leidenschaftlicher N64-Sammler und Speedrunner. Spezialisiert auf Mario 64 und Zelda-Spiele.',
    location: 'Berlin, Germany',
    isPublic: true,
    collections: [
      {
        id: 'c1',
        userId: '1',
        gameId: 'mario64',
        gameName: 'Super Mario 64',
        platform: 'N64',
        region: 'PAL',
        condition: 'mint',
        completeness: 'complete',
        acquisitionDate: new Date('2023-12-15'),
        notes: 'Erste Auflage, perfekter Zustand',
        isWishlist: false
      },
      {
        id: 'c2',
        userId: '1',
        gameId: 'zelda_oot',
        gameName: 'The Legend of Zelda: Ocarina of Time',
        platform: 'N64',
        region: 'PAL',
        condition: 'very-good',
        completeness: 'complete',
        acquisitionDate: new Date('2024-01-10'),
        isWishlist: false
      }
    ],
    personalRecords: [
      {
        id: 'pr1',
        userId: '1',
        gameId: 'mario64',
        gameName: 'Super Mario 64',
        category: '120 Stars',
        time: '1:39:42',
        platform: 'N64',
        region: 'PAL',
        achievedDate: new Date('2024-07-15'),
        verified: true,
        notes: 'PB! Endlich unter 1:40!'
      }
    ]
  },
  {
    id: '2',
    username: 'SpeedDemon64',
    email: 'speed@battle64.com',
    level: 22,
    xp: 4200,
    region: 'NTSC',
    platform: 'N64',
    joinDate: new Date('2024-01-15'),
    avatar: '⚡',
    bio: 'NTSC Speedrunner aus den USA. Halte mehrere Weltrekorde!',
    location: 'California, USA',
    isPublic: true,
    collections: [],
    personalRecords: [
      {
        id: 'pr2',
        userId: '2',
        gameId: 'mario_kart_64',
        gameName: 'Mario Kart 64',
        category: "Luigi's Raceway",
        time: '1:29.789',
        platform: 'N64',
        region: 'NTSC',
        achievedDate: new Date('2024-07-22'),
        verified: false,
        notes: 'Neuer persönlicher Rekord!'
      }
    ]
  }
]

// Local storage keys
const STORAGE_KEY_USERS = 'battle64_users'
const STORAGE_KEY_CURRENT_USER = 'battle64_current_user'

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem(STORAGE_KEY_USERS)
    const savedCurrentUser = localStorage.getItem(STORAGE_KEY_CURRENT_USER)
    
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers).map((u: any) => ({
          ...u,
          joinDate: new Date(u.joinDate),
          collections: u.collections?.map((c: any) => ({
            ...c,
            acquisitionDate: new Date(c.acquisitionDate)
          })) || [],
          personalRecords: u.personalRecords?.map((pr: any) => ({
            ...pr,
            achievedDate: new Date(pr.achievedDate)
          })) || []
        }))
        setUsers(parsedUsers)
      } catch (error) {
        console.error('Error loading users from localStorage:', error)
        setUsers(mockUsers)
      }
    }

    if (savedCurrentUser) {
      try {
        const parsedUser = JSON.parse(savedCurrentUser)
        const userWithDates = {
          ...parsedUser,
          joinDate: new Date(parsedUser.joinDate),
          collections: parsedUser.collections?.map((c: any) => ({
            ...c,
            acquisitionDate: new Date(c.acquisitionDate)
          })) || [],
          personalRecords: parsedUser.personalRecords?.map((pr: any) => ({
            ...pr,
            achievedDate: new Date(pr.achievedDate)
          })) || []
        }
        setUser(userWithDates)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error loading current user from localStorage:', error)
      }
    }
  }, [])

  // Save users to localStorage whenever users array changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users))
  }, [users])

  // Save current user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER)
    }
  }, [user])

  const login = async (email: string, _password: string): Promise<boolean> => {
    try {
      // In a real app, this would call an API
      const foundUser = users.find(u => u.email === email)
      
      if (foundUser) {
        // Remove password from user object before setting state
        const { password: _password, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword as User)
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const register = async (data: UserRegistrationData): Promise<boolean> => {
    try {
      // Check if username or email already exists
      const existingUser = users.find(u => u.email === data.email || u.username === data.username)
      if (existingUser) {
        return false
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username: data.username,
        email: data.email,
        level: 1,
        xp: 0,
        region: data.region,
        platform: data.platform,
        joinDate: new Date(),
        avatar: '🎮',
        bio: '',
        location: '',
        isPublic: true,
        collections: [],
        personalRecords: []
      }

      // Add to users array
      const updatedUsers = [...users, newUser]
      setUsers(updatedUsers)
      
      // Set as current user
      setUser(newUser)
      setIsAuthenticated(true)
      
      return true
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER)
  }

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false

    try {
      const updatedUser = { ...user, ...updates }
      
      // Update in users array
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u)
      setUsers(updatedUsers)
      
      // Update current user
      setUser(updatedUser)
      
      return true
    } catch (error) {
      console.error('Profile update error:', error)
      return false
    }
  }

  const addXP = (amount: number) => {
    if (!user) return

    const newXP = user.xp + amount
    const newLevel = Math.floor(newXP / 1000) + 1
    
    updateProfile({
      xp: newXP,
      level: newLevel
    })
  }

  const addToCollection = async (item: Omit<UserCollection, 'id' | 'userId'>): Promise<boolean> => {
    if (!user) return false

    try {
      const newItem: UserCollection = {
        ...item,
        id: Date.now().toString(),
        userId: user.id
      }

      const updatedCollections = [...user.collections, newItem]
      await updateProfile({ collections: updatedCollections })
      
      return true
    } catch (error) {
      console.error('Add to collection error:', error)
      return false
    }
  }

  const removeFromCollection = async (itemId: string): Promise<boolean> => {
    if (!user) return false

    try {
      const updatedCollections = user.collections.filter(c => c.id !== itemId)
      await updateProfile({ collections: updatedCollections })
      
      return true
    } catch (error) {
      console.error('Remove from collection error:', error)
      return false
    }
  }

  const addPersonalRecord = async (record: Omit<PersonalRecord, 'id' | 'userId'>): Promise<boolean> => {
    if (!user) return false

    try {
      const newRecord: PersonalRecord = {
        ...record,
        id: Date.now().toString(),
        userId: user.id
      }

      const updatedRecords = [...user.personalRecords, newRecord]
      await updateProfile({ personalRecords: updatedRecords })
      
      // Award XP for new personal record
      addXP(50)
      
      return true
    } catch (error) {
      console.error('Add personal record error:', error)
      return false
    }
  }

  const updatePersonalRecord = async (recordId: string, updates: Partial<PersonalRecord>): Promise<boolean> => {
    if (!user) return false

    try {
      const updatedRecords = user.personalRecords.map(r => 
        r.id === recordId ? { ...r, ...updates } : r
      )
      await updateProfile({ personalRecords: updatedRecords })
      
      return true
    } catch (error) {
      console.error('Update personal record error:', error)
      return false
    }
  }

  const getUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const foundUser = users.find(u => u.id === userId)
      return foundUser || null
    } catch (error) {
      console.error('Get user profile error:', error)
      return null
    }
  }

  const getAllUsers = async (): Promise<User[]> => {
    try {
      return users.filter(u => u.isPublic)
    } catch (error) {
      console.error('Get all users error:', error)
      return []
    }
  }

  const value: UserContextType = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    addXP,
    addToCollection,
    removeFromCollection,
    addPersonalRecord,
    updatePersonalRecord,
    getUserProfile,
    getAllUsers
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
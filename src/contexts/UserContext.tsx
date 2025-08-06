/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { User, UserContextType, UserRegistrationData, UserCollection, PersonalRecord } from '../types'
import { authService } from '../services/authService'
import { supabase } from '../lib/supabase'
import { logger } from '../lib/logger'

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialisierung und Auth State Listener
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Prüfe aktuelle Session
        const session = await authService.getCurrentSession()
        
        if (session?.user && mounted) {
          const currentUser = await authService.getCurrentUser()
          if (currentUser && mounted) {
            setUser(currentUser)
            setIsAuthenticated(true)
          }
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          logger.error('Auth initialization error:', error)
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    // Auth State Change Listener
    const { data: { subscription } } = authService.onAuthStateChange(async (newUser) => {
      if (mounted) {
        setUser(newUser)
        setIsAuthenticated(!!newUser)
      }
    })

    initializeAuth()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await authService.login(email, password)
      
      if (result.success && result.user) {
        setUser(result.user)
        setIsAuthenticated(true)
        return true
      }
      
      return false
    } catch (error) {
      if (import.meta.env.DEV) {
        logger.error('Login error in context:', error)
      }
      return false
    }
  }

  const register = async (data: UserRegistrationData): Promise<boolean> => {
    try {
      const result = await authService.register(data)
      
      if (result.success && result.user) {
        setUser(result.user)
        setIsAuthenticated(true)
        return true
      }
      
      return false
    } catch (error) {
      if (import.meta.env.DEV) {
        logger.error('Registration error in context:', error)
      }
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await authService.logout()
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      if (import.meta.env.DEV) {
        logger.error('Logout error in context:', error)
      }
      // Auch bei Fehlern den lokalen State zurücksetzen
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false

    try {
      // Update Profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          username: updates.username,
          level: updates.level,
          xp: updates.xp,
          region: updates.region,
          platform: updates.platform,
          avatar: updates.avatar,
          bio: updates.bio,
          location: updates.location,
          is_public: updates.isPublic,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        if (import.meta.env.DEV) {
          logger.error('Profile update error:', error)
        }
        return false
      }

      // Update lokalen State
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      
      return true
    } catch (error) {
      if (import.meta.env.DEV) {
        logger.error('Profile update error:', error)
      }
      return false
    }
  }

  const addXP = async (amount: number): Promise<void> => {
    if (!user) return

    const newXP = user.xp + amount
    const newLevel = Math.floor(newXP / 1000) + 1
    
    await updateProfile({
      xp: newXP,
      level: newLevel
    })
  }

  const addToCollection = async (item: Omit<UserCollection, 'id' | 'userId'>): Promise<boolean> => {
    if (!user) return false

    try {
      const { data, error } = await supabase
        .from('collections')
        .insert({
          user_id: user.id,
          game_id: item.gameId,
          game_name: item.gameName,
          platform: item.platform,
          region: item.region,
          condition: item.condition,
          completeness: item.completeness,
          acquisition_date: item.acquisitionDate.toISOString(),
          notes: item.notes || '',
          is_wishlist: item.isWishlist || false
        })
        .select()
        .single()

      if (error) {
        if (import.meta.env.DEV) {
          logger.error('Add to collection error:', error)
        }
        return false
      }

      // Update lokalen State
      const newItem: UserCollection = {
        id: data.id,
        userId: data.user_id,
        gameId: data.game_id,
        gameName: data.game_name,
        platform: data.platform,
        region: data.region,
        condition: data.condition,
        completeness: data.completeness,
        acquisitionDate: new Date(data.acquisition_date),
        notes: data.notes,
        isWishlist: data.is_wishlist
      }

      setUser({
        ...user,
        collections: [...user.collections, newItem]
      })
      
      return true
    } catch (error) {
      if (import.meta.env.DEV) {
        logger.error('Add to collection error:', error)
      }
      return false
    }
  }

  const removeFromCollection = async (itemId: string): Promise<boolean> => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id)

      if (error) {
        if (import.meta.env.DEV) {
          logger.error('Remove from collection error:', error)
        }
        return false
      }

      // Update lokalen State
      setUser({
        ...user,
        collections: user.collections.filter(c => c.id !== itemId)
      })
      
      return true
    } catch (error) {
      if (import.meta.env.DEV) {
        logger.error('Remove from collection error:', error)
      }
      return false
    }
  }

  const addPersonalRecord = async (record: Omit<PersonalRecord, 'id' | 'userId'>): Promise<boolean> => {
    if (!user) return false

    try {
      const { data, error } = await supabase
        .from('personal_records')
        .insert({
          user_id: user.id,
          game_id: record.gameId,
          game_name: record.gameName,
          category: record.category,
          time: record.time,
          platform: record.platform,
          region: record.region,
          achieved_date: record.achievedDate.toISOString(),
          verified: record.verified || false,
          notes: record.notes || ''
        })
        .select()
        .single()

      if (error) {
        if (import.meta.env.DEV) {
          logger.error('Add personal record error:', error)
        }
        return false
      }

      // Update lokalen State
      const newRecord: PersonalRecord = {
        id: data.id,
        userId: data.user_id,
        gameId: data.game_id,
        gameName: data.game_name,
        category: data.category,
        time: data.time,
        platform: data.platform,
        region: data.region,
        achievedDate: new Date(data.achieved_date),
        verified: data.verified,
        notes: data.notes
      }

      setUser({
        ...user,
        personalRecords: [...user.personalRecords, newRecord]
      })

      // Award XP for new personal record
      await addXP(50)
      
      return true
    } catch (error) {
      if (import.meta.env.DEV) {
        logger.error('Add personal record error:', error)
      }
      return false
    }
  }

  const updatePersonalRecord = async (recordId: string, updates: Partial<PersonalRecord>): Promise<boolean> => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('personal_records')
        .update({
          game_id: updates.gameId,
          game_name: updates.gameName,
          category: updates.category,
          time: updates.time,
          platform: updates.platform,
          region: updates.region,
          achieved_date: updates.achievedDate?.toISOString(),
          verified: updates.verified,
          notes: updates.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', recordId)
        .eq('user_id', user.id)

      if (error) {
        if (import.meta.env.DEV) {
          logger.error('Update personal record error:', error)
        }
        return false
      }

      // Update lokalen State
      setUser({
        ...user,
        personalRecords: user.personalRecords.map(r => 
          r.id === recordId ? { ...r, ...updates } : r
        )
      })
      
      return true
    } catch (error) {
      if (import.meta.env.DEV) {
        logger.error('Update personal record error:', error)
      }
      return false
    }
  }

  const getUserProfile = async (userId: string): Promise<User | null> => {
    try {
      // Hole Profil-Daten
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError || !profile) {
        return null
      }

      // Hole Collections
      const { data: collections = [] } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', userId)

      // Hole Personal Records
      const { data: personalRecords = [] } = await supabase
        .from('personal_records')
        .select('*')
        .eq('user_id', userId)

      // Hole Auth User Info (für E-Mail und Join Date)
      const { data: { user: authUser } } = await supabase.auth.getUser()
      const email = authUser?.id === userId ? authUser.email : ''
      const joinDate = authUser?.id === userId ? new Date(authUser.created_at) : new Date(profile.created_at)

      return {
        id: profile.id,
        username: profile.username,
        email: email || '',
        level: profile.level,
        xp: profile.xp,
        region: profile.region,
        platform: profile.platform,
        joinDate,
        avatar: profile.avatar,
        bio: profile.bio,
        location: profile.location,
        isPublic: profile.is_public,
        collections: (collections || []).map(c => ({
          id: c.id,
          userId: c.user_id,
          gameId: c.game_id,
          gameName: c.game_name,
          platform: c.platform,
          region: c.region,
          condition: c.condition,
          completeness: c.completeness,
          acquisitionDate: new Date(c.acquisition_date),
          notes: c.notes,
          isWishlist: c.is_wishlist
        })),
        personalRecords: (personalRecords || []).map(pr => ({
          id: pr.id,
          userId: pr.user_id,
          gameId: pr.game_id,
          gameName: pr.game_name,
          category: pr.category,
          time: pr.time,
          platform: pr.platform,
          region: pr.region,
          achievedDate: new Date(pr.achieved_date),
          verified: pr.verified,
          notes: pr.notes
        }))
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        logger.error('Get user profile error:', error)
      }
      return null
    }
  }

  const getAllUsers = async (): Promise<User[]> => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_public', true)

      if (error) {
        if (import.meta.env.DEV) {
          logger.error('Get all users error:', error)
        }
        return []
      }

      // Konvertiere zu User-Format (ohne Collections und Personal Records für Performance)
      return profiles.map(profile => ({
        id: profile.id,
        username: profile.username,
        email: '', // E-Mail nicht öffentlich
        level: profile.level,
        xp: profile.xp,
        region: profile.region,
        platform: profile.platform,
        joinDate: new Date(profile.created_at),
        avatar: profile.avatar,
        bio: profile.bio,
        location: profile.location,
        isPublic: profile.is_public,
        collections: [], // Leer für Performance
        personalRecords: [] // Leer für Performance
      }))
    } catch (error) {
      if (import.meta.env.DEV) {
        logger.error('Get all users error:', error)
      }
      return []
    }
  }

  const value: UserContextType = {
    user,
    isAuthenticated,
    isLoading,
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
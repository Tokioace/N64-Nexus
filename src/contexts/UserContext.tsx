/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

// Import types dynamically to avoid blocking
type User = any
type UserRegistrationData = any
type UserCollection = any
type PersonalRecord = any

interface UserContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: UserRegistrationData) => Promise<boolean>
  logout: () => Promise<void>
  deleteAccount: () => Promise<boolean>
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  addXP: (amount: number) => Promise<void>
  addToCollection: (item: Omit<UserCollection, 'id' | 'userId'>) => Promise<boolean>
  removeFromCollection: (itemId: string) => Promise<boolean>
  addPersonalRecord: (record: Omit<PersonalRecord, 'id' | 'userId'>) => Promise<boolean>
  updatePersonalRecord: (recordId: string, updates: Partial<PersonalRecord>) => Promise<boolean>
  getUserProfile: (userId: string) => Promise<User | null>
  getAllUsers: () => Promise<User[]>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  console.log('🔄 Lightweight UserProvider rendering...')

  // Lazy-loaded dependencies
  const [authService, setAuthService] = useState<any>(null)
  const [supabase, setSupabase] = useState<any>(null)
  const [logger, setLogger] = useState<any>(null)
  const [dependencies, setDependencies] = useState<boolean>(false)

  // Non-blocking initialization with lazy loading
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      if (mounted) {
        setIsLoading(true)
      }

      try {
        console.log('🔄 Lazy-loading auth dependencies...')
        
        // Dynamically import heavy dependencies
        const [authModule, supabaseModule, loggerModule] = await Promise.all([
          import('../services/authService'),
          import('../lib/supabase'),
          import('../lib/logger')
        ])

        if (mounted) {
          setAuthService(authModule.authService)
          setSupabase(supabaseModule.supabase)
          setLogger(loggerModule.logger)
          setDependencies(true)
          
          console.log('✅ Auth dependencies loaded')

          // Now initialize auth with loaded dependencies
          const session = await authModule.authService.getCurrentSession()
          
          if (session?.user && mounted) {
            console.log('✅ Session found, loading user...')
            const currentUser = await authModule.authService.getCurrentUser()
            if (currentUser && mounted) {
              setUser(currentUser)
              setIsAuthenticated(true)
              console.log('✅ User loaded successfully')
            }
          } else {
            console.log('ℹ️ No active session found')
          }

          // Set up auth state listener
          try {
            const { data } = authModule.authService.onAuthStateChange(async (newUser: any) => {
              if (mounted) {
                console.log('🔄 Auth state changed:', newUser ? 'logged in' : 'logged out')
                setUser(newUser)
                setIsAuthenticated(!!newUser)
              }
            })
            // Store subscription for cleanup if needed
          } catch (error) {
            console.warn('⚠️ Auth listener setup error (non-critical):', error)
          }
        }
      } catch (error) {
        console.warn('⚠️ Auth initialization error (non-critical):', error)
        // Don't throw - just continue without auth
      } finally {
        if (mounted) {
          setIsLoading(false)
          console.log('✅ Auth initialization complete')
        }
      }
    }

    // Start lazy initialization
    initializeAuth()

    return () => {
      mounted = false
    }
  }, [])

  // Helper function to check if dependencies are loaded
  const checkDependencies = (methodName: string): boolean => {
    if (!dependencies || !authService || !supabase) {
      console.warn(`${methodName}: Dependencies not loaded yet`)
      return false
    }
    return true
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!checkDependencies('login')) return false

    try {
      const result = await authService.login(email, password)
      
      if (result.success && result.user) {
        setUser(result.user)
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
    if (!checkDependencies('register')) return false

    try {
      const result = await authService.register(data)
      
      if (result.success && result.user) {
        setUser(result.user)
        setIsAuthenticated(true)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    if (!checkDependencies('logout')) return

    try {
      await authService.logout()
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const deleteAccount = async (): Promise<boolean> => {
    if (!checkDependencies('deleteAccount')) return false

    try {
      const result = await authService.deleteAccount()
      
      if (result.success) {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('battle64_cookie_consent')
        return true
      }
      
      return false
    } catch (error) {
      console.error('Delete account error:', error)
      return false
    }
  }

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user || !checkDependencies('updateProfile')) return false

    try {
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
          points: updates.points,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        console.error('Profile update error:', error)
        return false
      }

      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      
      return true
    } catch (error) {
      console.error('Profile update error:', error)
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
    if (!user || !checkDependencies('addToCollection')) return false

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
        console.error('Add to collection error:', error)
        return false
      }

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
        collections: [...(user.collections || []), newItem]
      })
      
      return true
    } catch (error) {
      console.error('Add to collection error:', error)
      return false
    }
  }

  const removeFromCollection = async (itemId: string): Promise<boolean> => {
    if (!user || !checkDependencies('removeFromCollection')) return false

    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Remove from collection error:', error)
        return false
      }

      setUser({
        ...user,
        collections: (user.collections || []).filter((c: any) => c.id !== itemId)
      })
      
      return true
    } catch (error) {
      console.error('Remove from collection error:', error)
      return false
    }
  }

  const addPersonalRecord = async (record: Omit<PersonalRecord, 'id' | 'userId'>): Promise<boolean> => {
    if (!user || !checkDependencies('addPersonalRecord')) return false

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
        console.error('Add personal record error:', error)
        return false
      }

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
        personalRecords: [...(user.personalRecords || []), newRecord]
      })

      await addXP(50)
      
      return true
    } catch (error) {
      console.error('Add personal record error:', error)
      return false
    }
  }

  const updatePersonalRecord = async (recordId: string, updates: Partial<PersonalRecord>): Promise<boolean> => {
    if (!user || !checkDependencies('updatePersonalRecord')) return false

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
        console.error('Update personal record error:', error)
        return false
      }

      setUser({
        ...user,
        personalRecords: (user.personalRecords || []).map((r: any) => 
          r.id === recordId ? { ...r, ...updates } : r
        )
      })
      
      return true
    } catch (error) {
      console.error('Update personal record error:', error)
      return false
    }
  }

  const getUserProfile = async (userId: string): Promise<User | null> => {
    if (!checkDependencies('getUserProfile')) return null

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError || !profile) {
        return null
      }

      const { data: collections = [] } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', userId)

      const { data: personalRecords = [] } = await supabase
        .from('personal_records')
        .select('*')
        .eq('user_id', userId)

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
        points: profile.points,
        collections: (collections || []).map((c: any) => ({
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
        personalRecords: (personalRecords || []).map((pr: any) => ({
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
      console.error('Get user profile error:', error)
      return null
    }
  }

  const getAllUsers = async (): Promise<User[]> => {
    if (!checkDependencies('getAllUsers')) return []

    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_public', true)

      if (error) {
        console.error('Get all users error:', error)
        return []
      }

      return profiles.map((profile: any) => ({
        id: profile.id,
        username: profile.username,
        email: '',
        level: profile.level,
        xp: profile.xp,
        region: profile.region,
        platform: profile.platform,
        joinDate: new Date(profile.created_at),
        avatar: profile.avatar,
        bio: profile.bio,
        location: profile.location,
        isPublic: profile.is_public,
        points: profile.points,
        collections: [],
        personalRecords: []
      }))
    } catch (error) {
      console.error('Get all users error:', error)
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
    deleteAccount,
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
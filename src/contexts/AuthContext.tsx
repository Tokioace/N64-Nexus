import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  username: string
  role: 'superadmin' | 'event-manager' | 'moderator'
  email: string
  lastLogin: Date
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string, twoFactorCode?: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('battle64_admin_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        localStorage.removeItem('battle64_admin_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string, twoFactorCode?: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock authentication logic
      if (username === 'admin' && password === 'battle64') {
        const mockUser: User = {
          id: '1',
          username: 'admin',
          role: 'superadmin',
          email: 'admin@battle64.com',
          lastLogin: new Date()
        }
        
        setUser(mockUser)
        localStorage.setItem('battle64_admin_user', JSON.stringify(mockUser))
        setIsLoading(false)
        return true
      }
      
      setIsLoading(false)
      return false
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('battle64_admin_user')
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    
    const permissions = {
      'superadmin': ['all'],
      'event-manager': ['events', 'analytics', 'users'],
      'moderator': ['moderation', 'users']
    }
    
    const userPermissions = permissions[user.role] || []
    return userPermissions.includes('all') || userPermissions.includes(permission)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
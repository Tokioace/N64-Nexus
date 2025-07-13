import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { UserProfile, Achievement } from '../types/quiz'

interface UserState {
  profile: UserProfile | null
  isAuthenticated: boolean
  loading: boolean
}

type UserAction = 
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'UPDATE_XP'; payload: number }
  | { type: 'ADD_ACHIEVEMENT'; payload: Achievement }
  | { type: 'UPDATE_SCORE'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGOUT' }

const initialState: UserState = {
  profile: null,
  isAuthenticated: false,
  loading: false
}

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_PROFILE':
      return {
        ...state,
        profile: action.payload,
        isAuthenticated: true,
        loading: false
      }
    case 'UPDATE_XP':
      if (!state.profile) return state
      const newXP = state.profile.xp + action.payload
      const newLevel = Math.floor(newXP / 1000) + 1
      return {
        ...state,
        profile: {
          ...state.profile,
          xp: newXP,
          level: newLevel
        }
      }
    case 'ADD_ACHIEVEMENT':
      if (!state.profile) return state
      return {
        ...state,
        profile: {
          ...state.profile,
          achievements: [...state.profile.achievements, action.payload]
        }
      }
    case 'UPDATE_SCORE':
      if (!state.profile) return state
      return {
        ...state,
        profile: {
          ...state.profile,
          totalScore: state.profile.totalScore + action.payload,
          quizzesCompleted: state.profile.quizzesCompleted + 1
        }
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        profile: null,
        isAuthenticated: false
      }
    default:
      return state
  }
}

interface UserContextType {
  state: UserState
  dispatch: React.Dispatch<UserAction>
  addXP: (xp: number) => void
  addAchievement: (achievement: Achievement) => void
  updateScore: (score: number) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState)

  const addXP = (xp: number) => {
    dispatch({ type: 'UPDATE_XP', payload: xp })
  }

  const addAchievement = (achievement: Achievement) => {
    dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement })
  }

  const updateScore = (score: number) => {
    dispatch({ type: 'UPDATE_SCORE', payload: score })
  }

  return (
    <UserContext.Provider value={{ state, dispatch, addXP, addAchievement, updateScore }}>
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
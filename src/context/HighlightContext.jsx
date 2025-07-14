import React, { createContext, useContext, useReducer, useEffect } from 'react'

const HighlightContext = createContext()

// Highlight types as specified in the requirements
export const HIGHLIGHT_TYPES = {
  BEST_GAME: 'best_game',
  FANART: 'fanart',
  TROPHY: 'trophy',
  LIVESTREAM: 'livestream',
  SEASON_MILESTONE: 'season_milestone'
}

// Privacy levels
export const PRIVACY_LEVELS = {
  PRIVATE: 'private',
  FRIENDS: 'friends',
  PUBLIC: 'public'
}

// Sample data for demonstration
const sampleHighlights = [
  {
    id: '1',
    title: 'Speedrun Rekord - DK Jungle',
    description: 'Neuer persönlicher Rekord in Donkey Kong Jungle!',
    type: HIGHLIGHT_TYPES.BEST_GAME,
    game: 'Donkey Kong 64',
    date: '2024-01-15',
    image: 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=DK+Jungle+Speedrun',
    video: null,
    statistics: {
      time: '2:34:12',
      score: 125000,
      level: 15
    },
    privacy: PRIVACY_LEVELS.PUBLIC,
    isFavorite: true,
    isPinned: false,
    comments: [
      { id: '1', user: 'RetroGamer', text: 'Unglaubliche Zeit! 🔥', date: '2024-01-16' },
      { id: '2', user: 'SpeedRunner', text: 'Respekt!', date: '2024-01-16' }
    ]
  },
  {
    id: '2',
    title: 'Mario Kart Fanart',
    description: 'Meine erste Fanart von Mario Kart 64',
    type: HIGHLIGHT_TYPES.FANART,
    game: 'Mario Kart 64',
    date: '2024-01-10',
    image: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Mario+Kart+Fanart',
    video: null,
    statistics: null,
    privacy: PRIVACY_LEVELS.FRIENDS,
    isFavorite: false,
    isPinned: false,
    comments: []
  },
  {
    id: '3',
    title: 'Halloween Cup Sieg',
    description: '1. Platz im Halloween Cup 2023!',
    type: HIGHLIGHT_TYPES.SEASON_MILESTONE,
    game: 'Super Smash Bros.',
    date: '2023-10-31',
    image: 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Halloween+Cup+Sieg',
    video: 'https://example.com/video.mp4',
    statistics: {
      tournament: 'Halloween Cup 2023',
      position: 1,
      participants: 64
    },
    privacy: PRIVACY_LEVELS.PUBLIC,
    isFavorite: true,
    isPinned: true,
    comments: [
      { id: '3', user: 'TournamentMaster', text: 'Glückwunsch zum Sieg! 🏆', date: '2023-11-01' }
    ]
  },
  {
    id: '4',
    title: 'Level 100 erreicht',
    description: 'Endlich Level 100 in GoldenEye 007!',
    type: HIGHLIGHT_TYPES.TROPHY,
    game: 'GoldenEye 007',
    date: '2024-01-05',
    image: 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Level+100+GoldenEye',
    video: null,
    statistics: {
      level: 100,
      playtime: '150h',
      achievements: 45
    },
    privacy: PRIVACY_LEVELS.PUBLIC,
    isFavorite: false,
    isPinned: false,
    comments: []
  }
]

const initialState = {
  highlights: sampleHighlights,
  filters: {
    type: 'all',
    game: 'all',
    privacy: 'all',
    search: ''
  },
  sortBy: 'date',
  sortOrder: 'desc',
  userPlan: 'free', // 'free' or 'premium'
  maxHighlights: 10
}

function highlightReducer(state, action) {
  switch (action.type) {
    case 'ADD_HIGHLIGHT':
      return {
        ...state,
        highlights: [...state.highlights, action.payload]
      }
    
    case 'UPDATE_HIGHLIGHT':
      return {
        ...state,
        highlights: state.highlights.map(h => 
          h.id === action.payload.id ? action.payload : h
        )
      }
    
    case 'DELETE_HIGHLIGHT':
      return {
        ...state,
        highlights: state.highlights.filter(h => h.id !== action.payload)
      }
    
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        highlights: state.highlights.map(h =>
          h.id === action.payload ? { ...h, isFavorite: !h.isFavorite } : h
        )
      }
    
    case 'TOGGLE_PINNED':
      return {
        ...state,
        highlights: state.highlights.map(h =>
          h.id === action.payload 
            ? { ...h, isPinned: !h.isPinned }
            : { ...h, isPinned: false } // Only one can be pinned
        )
      }
    
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      }
    
    case 'SET_SORT':
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder
      }
    
    case 'ADD_COMMENT':
      return {
        ...state,
        highlights: state.highlights.map(h =>
          h.id === action.payload.highlightId
            ? { ...h, comments: [...h.comments, action.payload.comment] }
            : h
        )
      }
    
    default:
      return state
  }
}

export function HighlightProvider({ children }) {
  const [state, dispatch] = useReducer(highlightReducer, initialState)

  // Load highlights from localStorage on mount
  useEffect(() => {
    const savedHighlights = localStorage.getItem('battle64-highlights')
    if (savedHighlights) {
      const parsed = JSON.parse(savedHighlights)
      parsed.forEach(highlight => {
        dispatch({ type: 'ADD_HIGHLIGHT', payload: highlight })
      })
    }
  }, [])

  // Save highlights to localStorage when they change
  useEffect(() => {
    localStorage.setItem('battle64-highlights', JSON.stringify(state.highlights))
  }, [state.highlights])

  const value = {
    ...state,
    dispatch,
    addHighlight: (highlight) => {
      if (state.userPlan === 'free' && state.highlights.length >= state.maxHighlights) {
        throw new Error('Highlight-Limit erreicht. Upgrade auf Premium für unbegrenzte Highlights!')
      }
      dispatch({ type: 'ADD_HIGHLIGHT', payload: { ...highlight, id: Date.now().toString() } })
    },
    updateHighlight: (highlight) => dispatch({ type: 'UPDATE_HIGHLIGHT', payload: highlight }),
    deleteHighlight: (id) => dispatch({ type: 'DELETE_HIGHLIGHT', payload: id }),
    toggleFavorite: (id) => dispatch({ type: 'TOGGLE_FAVORITE', payload: id }),
    togglePinned: (id) => dispatch({ type: 'TOGGLE_PINNED', payload: id }),
    setFilters: (filters) => dispatch({ type: 'SET_FILTERS', payload: filters }),
    setSort: (sortBy, sortOrder) => dispatch({ type: 'SET_SORT', payload: { sortBy, sortOrder } }),
    addComment: (highlightId, comment) => dispatch({ 
      type: 'ADD_COMMENT', 
      payload: { 
        highlightId, 
        comment: { 
          id: Date.now().toString(), 
          user: 'Du', 
          text: comment, 
          date: new Date().toISOString().split('T')[0] 
        } 
      } 
    })
  }

  return (
    <HighlightContext.Provider value={value}>
      {children}
    </HighlightContext.Provider>
  )
}

export function useHighlights() {
  const context = useContext(HighlightContext)
  if (!context) {
    throw new Error('useHighlights must be used within a HighlightProvider')
  }
  return context
}
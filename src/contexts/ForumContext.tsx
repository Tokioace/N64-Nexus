/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react'
import { ForumCategory, ForumThread, ForumPost, ForumStats } from '../types'
import { useUser } from './UserContext'
import { useLanguage } from './LanguageContext'
import { usePoints } from './PointsContext'

interface ForumContextType {
  categories: ForumCategory[]
  threads: ForumThread[]
  posts: ForumPost[]
  stats: ForumStats
  selectedCategory: ForumCategory | null
  selectedThread: ForumThread | null
  loading: boolean
  error: string | null
  
  // Actions
  getCategories: () => void
  getThreadsByCategory: (categoryId: string) => void
  getPostsByThread: (threadId: string) => void
  getThreadById: (threadId: string) => ForumThread | null
  createThread: (categoryId: string, title: string, content: string, imageUrl?: string) => Promise<boolean>
  createPost: (threadId: string, content: string, imageUrl?: string) => Promise<boolean>
  selectCategory: (category: ForumCategory | null) => void
  selectThread: (thread: ForumThread | null) => void
  incrementThreadViews: (threadId: string) => void
}

const ForumContext = createContext<ForumContextType | undefined>(undefined)

// Function to create mock categories with translations
const createMockCategories = (t: (key: any) => string): ForumCategory[] => [
  {
    id: '1',
    name: t('forum.category.speedruns'),
    description: t('forum.category.speedrunsDesc'),
    threadCount: 23,
    lastPost: {
      id: '1',
      authorId: '1',
      authorName: 'Oli',
      createdAt: new Date('2024-01-15T10:30:00'),
      threadTitle: 'Toad\'s Turnpike WR Strategie'
    },
    icon: 'Zap',
    color: 'red'
  },
  {
    id: '2',
    name: t('events.title'),
    description: t('events.subtitle'),
    threadCount: 15,
    lastPost: {
      id: '2',
      authorId: '2',
      authorName: 'Delia',
      createdAt: new Date('2024-01-14T16:45:00'),
      threadTitle: 'Tata Tuga Volcano Event Tipps'
    },
    icon: 'Calendar',
    color: 'blue'
  },
  {
    id: '3',
    name: t('quiz.title'),
    description: t('quiz.testYourKnowledge'),
    threadCount: 31,
    lastPost: {
      id: '3',
      authorId: '3',
      authorName: 'Mario64Fan',
      createdAt: new Date('2024-01-14T14:20:00'),
      threadTitle: t('forum.thread.easterEggs')
    },
    icon: 'Brain',
    color: 'purple'
  },
  {
    id: '4',
    name: t('forum.category.trading'),
    description: t('forum.category.tradingDesc'),
    threadCount: 8,
    lastPost: {
      id: '4',
      authorId: '4',
      authorName: 'Collector99',
      createdAt: new Date('2024-01-13T19:15:00'),
      threadTitle: t('forum.thread.goldenOcarina')
    },
    icon: 'Package',
    color: 'green'
  },
  {
    id: '5',
    name: t('forum.category.help'),
    description: t('forum.category.helpDesc'),
    threadCount: 12,
    lastPost: {
      id: '5',
      authorId: '5',
      authorName: 'NewUser2024',
      createdAt: new Date('2024-01-13T11:30:00'),
      threadTitle: t('forum.thread.levelSystem')
    },
    icon: 'Users',
    color: 'yellow'
  }
]

const mockThreads: ForumThread[] = [
  {
    id: '1',
    title: 'Toad\'s Turnpike WR Strategie',
    categoryId: '1',
    authorId: '1',
    authorName: 'Oli',
    createdAt: new Date('2024-01-10T14:30:00'),
    lastUpdated: new Date('2024-01-15T10:30:00'),
    postCount: 7,
    views: 142,
    isPinned: true,
    isLocked: false,
    lastPost: {
      id: '1',
      authorId: '1',
      authorName: 'Oli',
      createdAt: new Date('2024-01-15T10:30:00')
    },
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    }
  },
  {
    id: '2',
    title: 'Rainbow Road Shortcut Tutorial',
    categoryId: '1',
    authorId: '2',
    authorName: 'Delia',
    createdAt: new Date('2024-01-12T09:15:00'),
    lastUpdated: new Date('2024-01-14T18:45:00'),
    postCount: 12,
    views: 89,
    isPinned: false,
    isLocked: false,
    lastPost: {
      id: '2',
      authorId: '3',
      authorName: 'Mario64Fan',
      createdAt: new Date('2024-01-14T18:45:00')
    },
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    }
  },
  {
    id: '3',
    title: 'Banjo-Kazooie: Optimized 100% Route',
    categoryId: '1',
    authorId: '4',
    authorName: 'SpeedrunMaster',
    createdAt: new Date('2024-01-13T11:20:00'),
    lastUpdated: new Date('2024-01-15T16:30:00'),
    postCount: 8,
    views: 67,
    isPinned: false,
    isLocked: false,
    lastPost: {
      id: '8',
      authorId: '2',
      authorName: 'Delia',
      createdAt: new Date('2024-01-15T16:30:00')
    },
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    }
  },
  {
    id: '4',
    title: 'Tata Tuga Volcano Event - Tipps und Tricks',
    categoryId: '2',
    authorId: '5',
    authorName: 'EventHunter',
    createdAt: new Date('2024-01-14T08:45:00'),
    lastUpdated: new Date('2024-01-15T14:20:00'),
    postCount: 15,
    views: 203,
    isPinned: false,
    isLocked: false,
    lastPost: {
      id: '12',
      authorId: '3',
      authorName: 'Mario64Fan',
      createdAt: new Date('2024-01-15T14:20:00')
    },
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    }
  },
  {
    id: '5',
    title: 'Super Mario 64 Easter Eggs Diskussion',
    categoryId: '3',
    authorId: '3',
    authorName: 'Mario64Fan',
    createdAt: new Date('2024-01-11T19:30:00'),
    lastUpdated: new Date('2024-01-14T21:15:00'),
    postCount: 23,
    views: 156,
    isPinned: false,
    isLocked: false,
    lastPost: {
      id: '15',
      authorId: '6',
      authorName: 'RetroGamer',
      createdAt: new Date('2024-01-14T21:15:00')
    },
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    }
  },
  {
    id: '6',
    title: 'Goldene Ocarina - Suche Tauschpartner',
    categoryId: '4',
    authorId: '4',
    authorName: 'Collector99',
    createdAt: new Date('2024-01-12T16:00:00'),
    lastUpdated: new Date('2024-01-13T19:15:00'),
    postCount: 5,
    views: 89,
    isPinned: false,
    isLocked: false,
    lastPost: {
      id: '18',
      authorId: '7',
      authorName: 'TradeMaster',
      createdAt: new Date('2024-01-13T19:15:00')
    },
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    }
  }
]

const mockPosts: ForumPost[] = [
  {
    id: '1',
    threadId: '1',
    authorId: '1',
    authorName: 'Oli',
    content: 'Hey Leute! Ich wollte meine aktuelle Strategie für Toad\'s Turnpike mit euch teilen. Der Schlüssel liegt in der perfekten Kurvenfahrt und dem Timing der Boosts...',
    createdAt: new Date('2024-01-10T14:30:00'),
    isEdited: false,
    isDeleted: false,
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    }
  },
  {
    id: '2',
    threadId: '1',
    authorId: '2',
    authorName: 'Delia',
    content: 'Danke für den Tipp! Ich habe das mal ausprobiert und konnte meine Zeit um 3 Sekunden verbessern. Besonders der Boost am Ende hat geholfen.',
    createdAt: new Date('2024-01-11T16:20:00'),
    isEdited: false,
    isDeleted: false,
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    }
  },
  {
    id: '3',
    threadId: '1',
    authorId: '3',
    authorName: 'Mario64Fan',
    content: 'Welche Charaktere eignen sich am besten für diese Strategie? Ich spiele meist mit Yoshi.',
    createdAt: new Date('2024-01-12T09:15:00'),
    isEdited: false,
    isDeleted: false,
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    }
  },
  {
    id: '4',
    threadId: '2',
    authorId: '2',
    authorName: 'Delia',
    content: 'Hier ist mein Tutorial für den Rainbow Road Shortcut. Timing ist alles!',
    createdAt: new Date('2024-01-12T09:15:00'),
    isEdited: false,
    isDeleted: false,
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    }
  },
  {
    id: '5',
    threadId: '2',
    authorId: '4',
    authorName: 'Collector99',
    content: 'Super Tutorial! Ich schaffe den Sprung aber nur in 50% der Fälle. Habt ihr Tipps?',
    createdAt: new Date('2024-01-13T14:30:00'),
    isEdited: false,
    isDeleted: false,
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    }
  },
  {
    id: '6',
    threadId: '3',
    authorId: '4',
    authorName: 'SpeedrunMaster',
    content: 'Nach monatelanger Optimierung habe ich endlich die perfekte 100% Route für Banjo-Kazooie gefunden. Hier sind die wichtigsten Punkte...',
    createdAt: new Date('2024-01-13T11:20:00'),
    isEdited: false,
    isDeleted: false,
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    }
  },
  {
    id: '7',
    threadId: '3',
    authorId: '1',
    authorName: 'Oli',
    content: 'Interessante Route! Wie viel Zeit sparst du mit der neuen Strategie in Bubblegloop Swamp?',
    createdAt: new Date('2024-01-14T15:45:00'),
    isEdited: false,
    isDeleted: false,
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    }
  },
  {
    id: '8',
    threadId: '3',
    authorId: '2',
    authorName: 'Delia',
    content: 'Etwa 2-3 Minuten! Der Trick mit dem Talon Trot über die Brücke ist genial.',
    createdAt: new Date('2024-01-15T16:30:00'),
    isEdited: false,
    isDeleted: false,
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    }
  },
  {
    id: '9',
    threadId: '4',
    authorId: '5',
    authorName: 'EventHunter',
    content: 'Das Tata Tuga Volcano Event ist live! Hier sind meine besten Tipps für maximale Punkte...',
    createdAt: new Date('2024-01-14T08:45:00'),
    isEdited: false,
    isDeleted: false,
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    }
  },
  {
    id: '10',
    threadId: '4',
    authorId: '2',
    authorName: 'Delia',
    content: 'Danke für die Tipps! Welche Charaktere sind am besten für die Lava-Sprünge geeignet?',
    createdAt: new Date('2024-01-14T12:30:00'),
    isEdited: false,
    isDeleted: false,
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    }
  },
  {
    id: '11',
    threadId: '5',
    authorId: '3',
    authorName: 'Mario64Fan',
    content: 'Ich habe kürzlich ein interessantes Easter Egg in Super Mario 64 entdeckt. Hat schon mal jemand die geheime Nachricht in der Schlossmauer gesehen?',
    createdAt: new Date('2024-01-11T19:30:00'),
    isEdited: false,
    isDeleted: false,
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    }
  },
  {
    id: '12',
    threadId: '5',
    authorId: '6',
    authorName: 'RetroGamer',
    content: 'Oh ja! Das ist das "L is Real 2401" Easter Egg. Es gibt so viele Theorien dazu...',
    createdAt: new Date('2024-01-14T21:15:00'),
    isEdited: false,
    isDeleted: false,
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    }
  },
  {
    id: '13',
    threadId: '6',
    authorId: '4',
    authorName: 'Collector99',
    content: 'Ich suche jemanden, der eine goldene Ocarina gegen seltene Mario Kart Items tauschen möchte. Habe mehrere Power-Ups anzubieten!',
    createdAt: new Date('2024-01-12T16:00:00'),
    isEdited: false,
    isDeleted: false,
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    }
  },
  {
    id: '14',
    threadId: '6',
    authorId: '7',
    authorName: 'TradeMaster',
    content: 'Ich hätte Interesse! Welche Power-Ups hast du denn? Schick mir eine PM.',
    createdAt: new Date('2024-01-13T19:15:00'),
    isEdited: false,
    isDeleted: false,
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    }
  }
]

const mockStats: ForumStats = {
  totalThreads: 89,
  totalPosts: 342,
  totalMembers: 156,
  newestMember: 'NewUser2024',
  mostActiveCategory: 'Speedruns'
}

export const ForumProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useLanguage()
  const { awardPoints } = usePoints()
  const [categories, setCategories] = useState<ForumCategory[]>(() => createMockCategories(t))
  const [threads, setThreads] = useState<ForumThread[]>(mockThreads)
  const [posts, setPosts] = useState<ForumPost[]>(mockPosts)
  const [stats] = useState<ForumStats>(mockStats)
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | null>(null)
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()

  // Memoize expensive operations
  const memoizedCategories = useMemo(() => createMockCategories(t), [t])

  const getCategories = useCallback(() => {
    setLoading(true)
    setError(null)
    // Reduced delay for better performance
    setTimeout(() => {
      setCategories(memoizedCategories)
      setLoading(false)
    }, 100)
  }, [memoizedCategories])

  const getThreadsByCategory = useCallback((categoryId: string) => {
    setLoading(true)
    setError(null)
    // Filter threads by category
    const filteredThreads = mockThreads.filter(thread => thread.categoryId === categoryId)
    setTimeout(() => {
      setThreads(filteredThreads)
      setLoading(false)
    }, 50) // Reduced delay
  }, [])

  const getPostsByThread = useCallback((threadId: string) => {
    setLoading(true)
    setError(null)
    // Filter posts by thread
    const filteredPosts = mockPosts.filter(post => post.threadId === threadId)
    setTimeout(() => {
      setPosts(filteredPosts)
      setLoading(false)
    }, 50) // Reduced delay
  }, [])

  const getThreadById = useCallback((threadId: string) => {
    return mockThreads.find(thread => thread.id === threadId) || null
  }, [])

  const createThread = useCallback(async (categoryId: string, title: string, content: string, imageUrl?: string): Promise<boolean> => {
    if (!user) return false
    
    // Validate input
    if (!title.trim() || !content.trim() || !categoryId.trim()) {
      setError(t('validation.allFieldsRequired'))
      return false
    }
    
    if (title.length > 100) {
      setError(t('validation.titleTooLong'))
      return false
    }
    
    if (content.length > 2000) {
      setError(t('validation.contentTooLong'))
      return false
    }
    
    setLoading(true)
    try {
      const newThread: ForumThread = {
        id: Date.now().toString(),
        title,
        categoryId,
        authorId: user.id,
        authorName: user.username,
        createdAt: new Date(),
        lastUpdated: new Date(),
        postCount: 1,
        views: 0,
        isPinned: false,
        isLocked: false,
        interactions: {
          likes: 0,
          views: 0,
          comments: [],
          likedBy: [],
          viewedBy: []
        }
      }

      const newPost: ForumPost = {
        id: Date.now().toString() + '_post',
        threadId: newThread.id,
        authorId: user.id,
        authorName: user.username,
        content,
        imageUrl,
        createdAt: new Date(),
        isEdited: false,
        isDeleted: false,
        interactions: {
          likes: 0,
          views: 0,
          comments: [],
          likedBy: [],
          viewedBy: []
        }
      }

      // Reduced delay for better performance
      await new Promise(resolve => setTimeout(resolve, 200))
      setThreads(prev => [newThread, ...prev])
      setPosts(prev => [...prev, newPost])
      
      // Award points for creating forum thread
      try {
        await awardPoints('forum.post', `Thread created: ${title}`)
      } catch (error) {
        console.error('Failed to award points for forum thread:', error)
      }
      
      setLoading(false)
      return true
    } catch {
      setError(t('error.generic'))
      setLoading(false)
      return false
    }
  }, [user, t, awardPoints])

  const createPost = useCallback(async (threadId: string, content: string, imageUrl?: string): Promise<boolean> => {
    if (!user) return false
    
    // Validate input
    if (!content.trim() || !threadId.trim()) {
      setError(t('validation.contentRequired'))
      return false
    }
    
    if (content.length > 2000) {
      setError(t('validation.postTooLong'))
      return false
    }
    
    setLoading(true)
    try {
      const newPost: ForumPost = {
        id: Date.now().toString(),
        threadId,
        authorId: user.id,
        authorName: user.username,
        content,
        imageUrl,
        createdAt: new Date(),
        isEdited: false,
        isDeleted: false,
        interactions: {
          likes: 0,
          views: 0,
          comments: [],
          likedBy: [],
          viewedBy: []
        }
      }

      // Reduced delay for better performance
      await new Promise(resolve => setTimeout(resolve, 200))
      setPosts(prev => [...prev, newPost])
      // Update thread post count and last updated
      setThreads(prev => prev.map(thread => 
        thread.id === threadId 
          ? { 
              ...thread, 
              postCount: thread.postCount + 1,
              lastUpdated: new Date(),
              lastPost: {
                id: newPost.id,
                authorId: user.id,
                authorName: user.username,
                createdAt: new Date()
              }
            }
          : thread
      ))
      
      // Award points for forum reply
      try {
        await awardPoints('forum.reply', `Reply posted in thread`)
      } catch (error) {
        console.error('Failed to award points for forum reply:', error)
      }
      
      setLoading(false)
      return true
    } catch {
      setError(t('error.generic'))
      setLoading(false)
      return false
    }
  }, [user, t, awardPoints])

  const selectCategory = useCallback((category: ForumCategory | null) => {
    setSelectedCategory(category)
    if (category) {
      getThreadsByCategory(category.id)
    }
  }, [getThreadsByCategory])

  const selectThread = useCallback((thread: ForumThread | null) => {
    setSelectedThread(thread)
    if (thread) {
      getPostsByThread(thread.id)
      incrementThreadViews(thread.id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPostsByThread])

  const incrementThreadViews = useCallback((threadId: string) => {
    setThreads(prev => prev.map(thread => 
      thread.id === threadId 
        ? { ...thread, views: thread.views + 1 }
        : thread
    ))
  }, [])

  useEffect(() => {
    getCategories()
  }, [getCategories])

  // Memoize the context value to prevent unnecessary re-renders
  const value: ForumContextType = useMemo(() => ({
    categories,
    threads,
    posts,
    stats,
    selectedCategory,
    selectedThread,
    loading,
    error,
    getCategories,
    getThreadsByCategory,
    getPostsByThread,
    getThreadById,
    createThread,
    createPost,
    selectCategory,
    selectThread,
    incrementThreadViews
  }), [
    categories,
    threads,
    posts,
    stats,
    selectedCategory,
    selectedThread,
    loading,
    error,
    getCategories,
    getThreadsByCategory,
    getPostsByThread,
    getThreadById,
    createThread,
    createPost,
    selectCategory,
    selectThread,
    incrementThreadViews
  ])

  return (
    <ForumContext.Provider value={value}>
      {children}
    </ForumContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useForum = () => {
  const context = useContext(ForumContext)
  if (context === undefined) {
    throw new Error('useForum must be used within a ForumProvider')
  }
  return context
}
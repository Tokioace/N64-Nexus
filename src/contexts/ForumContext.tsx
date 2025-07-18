import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ForumCategory, ForumThread, ForumPost, ForumStats } from '../types'
import { useUser } from './UserContext'

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
  createThread: (categoryId: string, title: string, content: string, imageUrl?: string) => Promise<boolean>
  createPost: (threadId: string, content: string, imageUrl?: string) => Promise<boolean>
  selectCategory: (category: ForumCategory | null) => void
  selectThread: (thread: ForumThread | null) => void
  incrementThreadViews: (threadId: string) => void
}

const ForumContext = createContext<ForumContextType | undefined>(undefined)

// Mock data for the forum
const mockCategories: ForumCategory[] = [
  {
    id: '1',
    name: 'Speedruns',
    description: 'Diskutiere über Speedrun-Strategien, Rekorde und Techniken',
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
    name: 'Events',
    description: 'Alles rund um aktuelle und kommende Events',
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
    name: 'Trivia & Quiz',
    description: 'Teile dein N64-Wissen und lerne neue Fakten',
    threadCount: 31,
    lastPost: {
      id: '3',
      authorId: '3',
      authorName: 'Mario64Fan',
      createdAt: new Date('2024-01-14T14:20:00'),
      threadTitle: 'Versteckte Easter Eggs in Mario Kart 64'
    },
    icon: 'Brain',
    color: 'purple'
  },
  {
    id: '4',
    name: 'Tauschbörse',
    description: 'Tausche N64-Spiele, Module und Zubehör',
    threadCount: 8,
    lastPost: {
      id: '4',
      authorId: '4',
      authorName: 'Collector99',
      createdAt: new Date('2024-01-13T19:15:00'),
      threadTitle: 'Suche: Goldene Ocarina of Time Edition'
    },
    icon: 'Package',
    color: 'green'
  },
  {
    id: '5',
    name: 'Hilfe & Support',
    description: 'Fragen zur App, technische Probleme und Feedback',
    threadCount: 12,
    lastPost: {
      id: '5',
      authorId: '5',
      authorName: 'NewUser2024',
      createdAt: new Date('2024-01-13T11:30:00'),
      threadTitle: 'Wie funktioniert das Levelsystem?'
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
    isDeleted: false
  },
  {
    id: '2',
    threadId: '1',
    authorId: '2',
    authorName: 'Delia',
    content: 'Danke für den Tipp! Ich habe das mal ausprobiert und konnte meine Zeit um 3 Sekunden verbessern. Besonders der Boost am Ende hat geholfen.',
    createdAt: new Date('2024-01-11T16:20:00'),
    isEdited: false,
    isDeleted: false
  },
  {
    id: '3',
    threadId: '1',
    authorId: '3',
    authorName: 'Mario64Fan',
    content: 'Welche Charaktere eignen sich am besten für diese Strategie? Ich spiele meist mit Yoshi.',
    createdAt: new Date('2024-01-12T09:15:00'),
    isEdited: false,
    isDeleted: false
  },
  {
    id: '4',
    threadId: '2',
    authorId: '2',
    authorName: 'Delia',
    content: 'Hier ist mein Tutorial für den Rainbow Road Shortcut. Timing ist alles!',
    createdAt: new Date('2024-01-12T09:15:00'),
    isEdited: false,
    isDeleted: false
  },
  {
    id: '5',
    threadId: '2',
    authorId: '4',
    authorName: 'Collector99',
    content: 'Super Tutorial! Ich schaffe den Sprung aber nur in 50% der Fälle. Habt ihr Tipps?',
    createdAt: new Date('2024-01-13T14:30:00'),
    isEdited: false,
    isDeleted: false
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
  const [categories, setCategories] = useState<ForumCategory[]>(mockCategories)
  const [threads, setThreads] = useState<ForumThread[]>(mockThreads)
  const [posts, setPosts] = useState<ForumPost[]>(mockPosts)
  const [stats] = useState<ForumStats>(mockStats)
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | null>(null)
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()

  const getCategories = () => {
    setLoading(true)
    setError(null)
    // Simulate API call
    setTimeout(() => {
      setCategories(mockCategories)
      setLoading(false)
    }, 500)
  }

  const getThreadsByCategory = (categoryId: string) => {
    setLoading(true)
    setError(null)
    // Filter threads by category
    const filteredThreads = mockThreads.filter(thread => thread.categoryId === categoryId)
    setTimeout(() => {
      setThreads(filteredThreads)
      setLoading(false)
    }, 300)
  }

  const getPostsByThread = (threadId: string) => {
    setLoading(true)
    setError(null)
    // Filter posts by thread
    const filteredPosts = mockPosts.filter(post => post.threadId === threadId)
    setTimeout(() => {
      setPosts(filteredPosts)
      setLoading(false)
    }, 300)
  }

  const createThread = async (categoryId: string, title: string, content: string, imageUrl?: string): Promise<boolean> => {
    if (!user) return false
    
    // Validate input
    if (!title.trim() || !content.trim() || !categoryId.trim()) {
      setError('Alle Felder sind erforderlich')
      return false
    }
    
    if (title.length > 100) {
      setError('Titel ist zu lang (max. 100 Zeichen)')
      return false
    }
    
    if (content.length > 2000) {
      setError('Inhalt ist zu lang (max. 2000 Zeichen)')
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
        isLocked: false
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
        isDeleted: false
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setThreads(prev => [newThread, ...prev])
      setPosts(prev => [...prev, newPost])
      setLoading(false)
      return true
    } catch (err) {
      setError('Fehler beim Erstellen des Threads')
      setLoading(false)
      return false
    }
  }

  const createPost = async (threadId: string, content: string, imageUrl?: string): Promise<boolean> => {
    if (!user) return false
    
    // Validate input
    if (!content.trim() || !threadId.trim()) {
      setError('Inhalt ist erforderlich')
      return false
    }
    
    if (content.length > 2000) {
      setError('Beitrag ist zu lang (max. 2000 Zeichen)')
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
        isDeleted: false
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
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
      setLoading(false)
      return true
    } catch (err) {
      setError('Fehler beim Erstellen des Beitrags')
      setLoading(false)
      return false
    }
  }

  const selectCategory = (category: ForumCategory | null) => {
    setSelectedCategory(category)
    if (category) {
      getThreadsByCategory(category.id)
    }
  }

  const selectThread = (thread: ForumThread | null) => {
    setSelectedThread(thread)
    if (thread) {
      getPostsByThread(thread.id)
      incrementThreadViews(thread.id)
    }
  }

  const incrementThreadViews = (threadId: string) => {
    setThreads(prev => prev.map(thread => 
      thread.id === threadId 
        ? { ...thread, views: thread.views + 1 }
        : thread
    ))
  }

  useEffect(() => {
    getCategories()
  }, [])

  const value: ForumContextType = {
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
    createThread,
    createPost,
    selectCategory,
    selectThread,
    incrementThreadViews
  }

  return (
    <ForumContext.Provider value={value}>
      {children}
    </ForumContext.Provider>
  )
}

export const useForum = () => {
  const context = useContext(ForumContext)
  if (context === undefined) {
    throw new Error('useForum must be used within a ForumProvider')
  }
  return context
}
import React, { createContext, useContext, useState, ReactNode } from 'react'
import { MediaMeta, MediaContextType, SpeedrunPost } from '../types'
import { useLanguage } from './LanguageContext'

const MediaContext = createContext<MediaContextType | undefined>(undefined)

export const MediaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [media, setMedia] = useState<MediaMeta[]>([])
  const [userMedia, setUserMedia] = useState<MediaMeta[]>([])
  const [speedrunPosts, setSpeedrunPosts] = useState<SpeedrunPost[]>([
    {
      id: '1',
      userId: 'user1',
      username: 'SpeedDemon64',
      userAvatar: undefined,
      gameId: 'mario64',
      gameName: 'Super Mario 64',
      title: 'Neuer 120 Stars Rekord - 1:38:42!',
      description: 'Nach monatelangem Training endlich einen neuen persönlichen Rekord aufgestellt! Verwendete neue BLJ-Strategie in Dire Dire Docks.',
      time: '1:38:42',
      category: '120stars',
      platform: 'N64',
      media: [
        {
          id: 'm1',
          userId: 'user1',
          username: 'SpeedDemon64',
          gameId: 'mario64',
          gameName: 'Super Mario 64',
          type: 'speedrun',
          title: 'Finish Screen',
          url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop',
          uploadDate: new Date(),
          verified: true,
          likes: 23,
          views: 156,
          tags: ['120stars', 'rekord'],
          time: '1:38:42',
          category: '120stars',
          platform: 'N64'
        }
      ],
      tags: ['120stars', 'rekord', 'blj', 'n64'],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      likes: 42,
      comments: 8,
      verified: true
    },
    {
      id: '2',
      userId: 'user2',
      username: 'RetroRunner',
      userAvatar: undefined,
      gameId: 'mariokart64',
      gameName: 'Mario Kart 64',
      title: 'Rainbow Road Shortcut Tutorial',
      description: 'Zeige euch den perfekten Rainbow Road Shortcut für Any% Runs. Timing ist alles!',
      time: '1:32.84',
      category: 'any',
      platform: 'N64',
      media: [
        {
          id: 'm2',
          userId: 'user2',
          username: 'RetroRunner',
          gameId: 'mariokart64',
          gameName: 'Mario Kart 64',
          type: 'speedrun',
          title: 'Rainbow Road Shortcut',
          url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          uploadDate: new Date(),
          verified: false,
          likes: 15,
          views: 89,
          tags: ['shortcut', 'tutorial'],
          time: '1:32.84',
          category: 'any',
          platform: 'N64'
        }
      ],
      tags: ['shortcut', 'tutorial', 'rainbow-road'],
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      likes: 28,
      comments: 12,
      verified: false
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  const uploadMedia = async (file: File, metadata: Partial<MediaMeta>): Promise<boolean> => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLoading(false)
      return true
    } catch (err) {
              setError(t('error.generic'))
      setLoading(false)
      return false
    }
  }

  const deleteMedia = async (mediaId: string): Promise<boolean> => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setLoading(false)
      return true
    } catch (err) {
              setError(t('error.generic'))
      setLoading(false)
      return false
    }
  }

  const likeMedia = async (mediaId: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      return true
    } catch (err) {
      return false
    }
  }

  const getMediaByUser = (userId: string): MediaMeta[] => {
    return media.filter(m => m.userId === userId)
  }

  const getMediaByEvent = (eventId: string): MediaMeta[] => {
    return media.filter(m => m.eventId === eventId)
  }

  const getMediaByGame = (gameId: string): MediaMeta[] => {
    return media.filter(m => m.gameId === gameId)
  }

  const verifyMedia = async (mediaId: string, isVerified: boolean): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  const isCapturingAllowed = (eventId?: string): boolean => {
    return true
  }

  const createSpeedrunPost = async (post: Omit<SpeedrunPost, 'id' | 'createdAt' | 'likes' | 'comments'>): Promise<boolean> => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newPost: SpeedrunPost = {
        ...post,
        id: Date.now().toString(),
        createdAt: new Date(),
        likes: 0,
        comments: 0
      }
      setSpeedrunPosts(prev => [newPost, ...prev])
      setLoading(false)
      return true
    } catch (err) {
      setError(t('error.generic'))
      setLoading(false)
      return false
    }
  }

  const getSpeedrunPosts = (gameId?: string, category?: string): SpeedrunPost[] => {
    let filtered = speedrunPosts
    if (gameId) {
      filtered = filtered.filter(post => post.gameId === gameId)
    }
    if (category) {
      filtered = filtered.filter(post => post.category === category)
    }
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  const likeSpeedrunPost = async (postId: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      setSpeedrunPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ))
      return true
    } catch (err) {
      return false
    }
  }

  const startLivestream = async (streamData: { title: string, gameId: string, platform: string, streamUrl: string }): Promise<boolean> => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newStream: MediaMeta = {
        id: Date.now().toString(),
        userId: 'current-user',
        username: 'Current User',
        gameId: streamData.gameId,
        gameName: 'Game Name',
        type: 'livestream',
        title: streamData.title,
        url: streamData.streamUrl,
        livestreamUrl: streamData.streamUrl,
        isLive: true,
        streamPlatform: streamData.platform as any,
        uploadDate: new Date(),
        verified: false,
        likes: 0,
        views: 0,
        tags: ['live', 'streaming']
      }
      setMedia(prev => [newStream, ...prev])
      setLoading(false)
      return true
    } catch (err) {
      setError(t('error.generic'))
      setLoading(false)
      return false
    }
  }

  const stopLivestream = async (streamId: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setMedia(prev => prev.map(item => 
        item.id === streamId && item.type === 'livestream' 
          ? { ...item, isLive: false } 
          : item
      ))
      return true
    } catch (err) {
      return false
    }
  }

  const getLivestreams = (): MediaMeta[] => {
    return media.filter(item => item.type === 'livestream' && item.isLive)
  }

  const value: MediaContextType = {
    media,
    userMedia,
    speedrunPosts,
    loading,
    error,
    uploadMedia,
    deleteMedia,
    likeMedia,
    getMediaByUser,
    getMediaByEvent,
    getMediaByGame,
    verifyMedia,
    isCapturingAllowed,
    createSpeedrunPost,
    getSpeedrunPosts,
    likeSpeedrunPost,
    startLivestream,
    stopLivestream,
    getLivestreams
  }

  return (
    <MediaContext.Provider value={value}>
      {children}
    </MediaContext.Provider>
  )
}

export const useMedia = () => {
  const context = useContext(MediaContext)
  if (context === undefined) {
    throw new Error('useMedia must be used within a MediaProvider')
  }
  return context
}
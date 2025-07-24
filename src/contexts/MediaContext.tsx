import React, { createContext, useContext, useState, ReactNode } from 'react'
import { MediaMeta, MediaContextType } from '../types'
import { useLanguage } from './LanguageContext'

const MediaContext = createContext<MediaContextType | undefined>(undefined)

export const MediaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [media, setMedia] = useState<MediaMeta[]>([
    {
      id: '1',
      userId: 'user1',
      username: 'SpeedRunner64',
      gameId: 'mario64',
      gameName: 'Super Mario 64',
      type: 'speedrun',
      title: '120 Stars World Record Attempt',
      description: 'Going for the world record in 120 stars category!',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
      uploadDate: new Date(Date.now() - 3600000),
      verified: true,
      likes: 42,
      views: 156,
      tags: ['120stars', 'worldrecord', 'mario64']
    },
    {
      id: '2',
      userId: 'user2',
      username: 'RetroGamer',
      gameId: 'mariokart64',
      gameName: 'Mario Kart 64',
      type: 'screenshot',
      title: 'Perfect Lap on Rainbow Road',
      description: 'Finally got that perfect lap!',
      url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop',
      uploadDate: new Date(Date.now() - 7200000),
      verified: false,
      likes: 28,
      views: 89,
      tags: ['mariokart', 'rainbow-road', 'perfect-lap']
    },
    {
      id: '3',
      userId: 'user3',
      username: 'N64Master',
      gameId: 'goldeneye',
      gameName: 'GoldenEye 007',
      type: 'achievement',
      title: 'All Cheats Unlocked',
      description: 'Finally unlocked all cheats in GoldenEye!',
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      uploadDate: new Date(Date.now() - 10800000),
      verified: true,
      likes: 35,
      views: 124,
      tags: ['goldeneye', 'cheats', 'achievement']
    },
    {
      id: '4',
      userId: 'user4',
      username: 'ZeldaFan',
      gameId: 'zelda-oot',
      gameName: 'The Legend of Zelda: Ocarina of Time',
      type: 'speedrun',
      title: 'Any% Speedrun - Sub 18 Minutes',
      description: 'Finally broke the 18-minute barrier!',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop',
      uploadDate: new Date(Date.now() - 14400000),
      verified: true,
      likes: 67,
      views: 234,
      tags: ['zelda', 'any%', 'sub18', 'speedrun']
    },
    {
      id: '5',
      userId: 'user5',
      username: 'PerfectDarkPro',
      gameId: 'perfect-dark',
      gameName: 'Perfect Dark',
      type: 'achievement',
      title: 'Perfect Agent Difficulty Completed',
      description: 'Completed all missions on Perfect Agent difficulty!',
      url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
      uploadDate: new Date(Date.now() - 18000000),
      verified: true,
      likes: 52,
      views: 178,
      tags: ['perfect-dark', 'perfect-agent', 'completion']
    }
  ])
  const [userMedia, setUserMedia] = useState<MediaMeta[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  const uploadMedia = async (file: File, metadata: Partial<MediaMeta>): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create new media item
      const newMedia: MediaMeta = {
        id: Date.now().toString(),
        userId: metadata.userId || 'current-user',
        username: metadata.username || 'Current User',
        gameId: metadata.gameId || '',
        gameName: metadata.gameName || '',
        eventId: metadata.eventId,
        type: metadata.type || 'speedrun',
        title: metadata.title || 'Untitled',
        description: metadata.description || '',
        url: URL.createObjectURL(file), // In real app, this would be the uploaded file URL
        thumbnailUrl: metadata.thumbnailUrl || 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
        uploadDate: new Date(),
        verified: false,
        likes: 0,
        views: 0,
        tags: metadata.tags || []
      }
      
      setMedia(prev => [newMedia, ...prev])
      setUserMedia(prev => [newMedia, ...prev])
      
      setLoading(false)
      return true
    } catch (err) {
      setError(t('error.generic'))
      setLoading(false)
      return false
    }
  }

  const uploadMediaFromUrl = async (url: string, metadata: Partial<MediaMeta>): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create new media item
      const newMedia: MediaMeta = {
        id: Date.now().toString(),
        userId: metadata.userId || 'current-user',
        username: metadata.username || 'Current User',
        gameId: metadata.gameId || '',
        gameName: metadata.gameName || '',
        eventId: metadata.eventId,
        type: metadata.type || 'speedrun',
        title: metadata.title || 'Untitled',
        description: metadata.description || '',
        url: url,
        thumbnailUrl: metadata.thumbnailUrl || 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
        uploadDate: new Date(),
        verified: false,
        likes: 0,
        views: 0,
        tags: metadata.tags || []
      }
      
      setMedia(prev => [newMedia, ...prev])
      setUserMedia(prev => [newMedia, ...prev])
      
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
      
      setMedia(prev => prev.filter(m => m.id !== mediaId))
      setUserMedia(prev => prev.filter(m => m.id !== mediaId))
      
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
      
      setMedia(prev => prev.map(m => 
        m.id === mediaId 
          ? { ...m, likes: m.likes + 1 }
          : m
      ))
      
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
    
    setMedia(prev => prev.map(m => 
      m.id === mediaId 
        ? { ...m, verified: isVerified }
        : m
    ))
  }

  const isCapturingAllowed = (eventId?: string): boolean => {
    // In a real app, this would check event rules or user permissions
    return true
  }

  // Helper function to get points for media type
  const getPointsForMediaType = (type: 'speedrun' | 'screenshot' | 'achievement'): number => {
    switch (type) {
      case 'speedrun': return 50
      case 'achievement': return 30
      case 'screenshot': return 25
      default: return 10
    }
  }

  const value: MediaContextType = {
    media,
    userMedia,
    loading,
    error,
    uploadMedia,
    deleteMedia,
    likeMedia,
    getMediaByUser,
    getMediaByEvent,
    getMediaByGame,
    verifyMedia,
    isCapturingAllowed
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
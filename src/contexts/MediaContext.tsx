import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { MediaMeta, MediaContextType } from '../types'
import { useLanguage } from './LanguageContext'
import { useUser } from './UserContext'

const MediaContext = createContext<MediaContextType | undefined>(undefined)

// Local storage key for media data
const MEDIA_STORAGE_KEY = 'battle64_media_data'
const USER_MEDIA_STORAGE_KEY = 'battle64_user_media_data'

export const MediaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser()
  const { t } = useLanguage()
  
  // Initialize media from localStorage or default sample data
  const [media, setMedia] = useState<MediaMeta[]>(() => {
    try {
      const storedMedia = localStorage.getItem(MEDIA_STORAGE_KEY)
      if (storedMedia) {
        const parsedMedia = JSON.parse(storedMedia)
        // Convert date strings back to Date objects
        return parsedMedia.map((item: any) => ({
          ...item,
          uploadDate: new Date(item.uploadDate)
        }))
      }
    } catch (error) {
      console.error('Error loading media from storage:', error)
    }
    
    // Default sample data if no stored data
    return [
      {
        id: '1',
        userId: 'user1',
        username: 'SpeedRunner64',
        gameId: 'mario64',
        gameName: 'Super Mario 64',
        eventId: 'mario64-120stars-2024',
        type: 'speedrun' as const,
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
        eventId: 'mk64-timetrials-2024',
        type: 'screenshot' as const,
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
        type: 'achievement' as const,
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
        eventId: 'zelda-any-percent-2024',
        type: 'speedrun' as const,
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
        type: 'achievement' as const,
        title: 'Perfect Agent Difficulty Completed',
        description: 'Completed all missions on Perfect Agent difficulty!',
        url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
        uploadDate: new Date(Date.now() - 18000000),
        verified: true,
        likes: 52,
        views: 178,
        tags: ['perfect-dark', 'perfect-agent', 'completion']
      }
    ]
  })

  // User-specific media (filtered from all media for current user)
  const [userMedia, setUserMedia] = useState<MediaMeta[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update userMedia when user changes or media changes
  useEffect(() => {
    if (user) {
      const currentUserMedia = media.filter(m => m.userId === user.id)
      setUserMedia(currentUserMedia)
      
      // Store user media separately for quick access
      try {
        localStorage.setItem(USER_MEDIA_STORAGE_KEY + '_' + user.id, JSON.stringify(currentUserMedia))
      } catch (error) {
        console.error('Error storing user media:', error)
      }
    } else {
      setUserMedia([])
    }
  }, [media, user])

  // Save media to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(media))
    } catch (error) {
      console.error('Error saving media to storage:', error)
    }
  }, [media])

  const uploadMedia = async (file: File, metadata: Partial<MediaMeta>): Promise<boolean> => {
    setLoading(true)
    setError(null)
    
    if (!user) {
      setError('User must be logged in to upload media')
      setLoading(false)
      return false
    }

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create unique ID with timestamp
      const mediaId = `${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Create new media item with all required fields
      const newMedia: MediaMeta = {
        id: mediaId,
        userId: user.id,
        username: user.username,
        gameId: metadata.gameId || '',
        gameName: metadata.gameName || '',
        eventId: metadata.eventId, // Store event association
        type: metadata.type || 'speedrun',
        title: metadata.title || 'Untitled',
        description: metadata.description || '',
        url: URL.createObjectURL(file), // In real app, this would be the uploaded file URL
        thumbnailUrl: metadata.thumbnailUrl || generateThumbnail(file),
        uploadDate: new Date(), // Always use current date for new uploads
        verified: false, // New uploads start unverified
        likes: 0,
        views: 0,
        tags: metadata.tags || []
      }
      
      // Add to media collection (newest first)
      setMedia(prev => [newMedia, ...prev])
      
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
    
    if (!user) {
      setError('User must be logged in to upload media')
      setLoading(false)
      return false
    }

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create unique ID with timestamp
      const mediaId = `${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Create new media item
      const newMedia: MediaMeta = {
        id: mediaId,
        userId: user.id,
        username: user.username,
        gameId: metadata.gameId || '',
        gameName: metadata.gameName || '',
        eventId: metadata.eventId, // Store event association
        type: metadata.type || 'speedrun',
        title: metadata.title || 'Untitled',
        description: metadata.description || '',
        url: url,
        thumbnailUrl: metadata.thumbnailUrl || generateThumbnailFromUrl(url),
        uploadDate: new Date(), // Always use current date for new uploads
        verified: false,
        likes: 0,
        views: 0,
        tags: metadata.tags || []
      }
      
      // Add to media collection (newest first)
      setMedia(prev => [newMedia, ...prev])
      
      setLoading(false)
      return true
    } catch (err) {
      setError(t('error.generic'))
      setLoading(false)
      return false
    }
  }

  // Helper function to generate thumbnail from file
  const generateThumbnail = (file: File): string => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file)
    } else if (file.type.startsWith('video/')) {
      // In a real app, you'd generate a video thumbnail
      return 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop'
    }
    return 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop'
  }

  // Helper function to generate thumbnail from URL
  const generateThumbnailFromUrl = (url: string): string => {
    // For YouTube URLs, extract thumbnail
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = extractYouTubeVideoId(url)
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      }
    }
    
    // For Twitch URLs, use Twitch thumbnail
    if (url.includes('twitch.tv')) {
      return 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=400&h=300&fit=crop'
    }
    
    // Default thumbnail
    return 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop'
  }

  // Helper function to extract YouTube video ID
  const extractYouTubeVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const deleteMedia = async (mediaId: string): Promise<boolean> => {
    setLoading(true)
    
    if (!user) {
      setError('User must be logged in to delete media')
      setLoading(false)
      return false
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Check if user owns this media
      const mediaToDelete = media.find(m => m.id === mediaId)
      if (!mediaToDelete || mediaToDelete.userId !== user.id) {
        setError('You can only delete your own media')
        setLoading(false)
        return false
      }
      
      // Remove from media collection
      setMedia(prev => prev.filter(m => m.id !== mediaId))
      
      setLoading(false)
      return true
    } catch (err) {
      setError(t('error.generic'))
      setLoading(false)
      return false
    }
  }

  const likeMedia = async (mediaId: string): Promise<boolean> => {
    if (!user) {
      setError('User must be logged in to like media')
      return false
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Update likes count
      setMedia(prev => prev.map(m => 
        m.id === mediaId 
          ? { ...m, likes: m.likes + 1, views: m.views + 1 } // Also increment views
          : m
      ))
      
      return true
    } catch (err) {
      return false
    }
  }

  const getMediaByUser = (userId: string): MediaMeta[] => {
    return media.filter(m => m.userId === userId).sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    )
  }

  const getMediaByEvent = (eventId: string): MediaMeta[] => {
    return media.filter(m => m.eventId === eventId).sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    )
  }

  const getMediaByGame = (gameId: string): MediaMeta[] => {
    return media.filter(m => m.gameId === gameId).sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    )
  }

  const getMediaByDateRange = (startDate: Date, endDate: Date): MediaMeta[] => {
    return media.filter(m => {
      const uploadDate = new Date(m.uploadDate)
      return uploadDate >= startDate && uploadDate <= endDate
    }).sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    )
  }

  const getUserMediaHistory = (userId: string): MediaMeta[] => {
    return media
      .filter(m => m.userId === userId)
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
  }

  const getMediaStats = () => {
    const totalMedia = media.length
    const totalViews = media.reduce((sum, m) => sum + m.views, 0)
    const totalLikes = media.reduce((sum, m) => sum + m.likes, 0)
    const verifiedMedia = media.filter(m => m.verified).length
    
    const mediaByType = {
      speedrun: media.filter(m => m.type === 'speedrun').length,
      screenshot: media.filter(m => m.type === 'screenshot').length,
      achievement: media.filter(m => m.type === 'achievement').length
    }
    
    const mediaByUser = media.reduce((acc, m) => {
      acc[m.userId] = (acc[m.userId] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      totalMedia,
      totalViews,
      totalLikes,
      verifiedMedia,
      mediaByType,
      mediaByUser
    }
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

  // Clear all media (for testing/admin purposes)
  const clearAllMedia = () => {
    setMedia([])
    setUserMedia([])
    localStorage.removeItem(MEDIA_STORAGE_KEY)
    if (user) {
      localStorage.removeItem(USER_MEDIA_STORAGE_KEY + '_' + user.id)
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
    isCapturingAllowed,
    // Extended functionality
    uploadMediaFromUrl,
    getMediaByDateRange,
    getUserMediaHistory,
    getMediaStats,
    clearAllMedia
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
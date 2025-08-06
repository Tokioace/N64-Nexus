/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react'
import { logger } from '../lib/logger'
import { MediaMeta, MediaContextType } from '../types'
import { useLanguage } from './LanguageContext'
import { useUser } from './UserContext'

const MediaContext = createContext<MediaContextType | undefined>(undefined)

// Local storage key for media data
const MEDIA_STORAGE_KEY = 'battle64_media_data'
const USER_MEDIA_STORAGE_KEY = 'battle64_user_media_data'

// Cache for object URLs to prevent memory leaks
const objectUrlCache = new Map<string, string>()

// Cleanup function for object URLs
const cleanupObjectUrl = (url: string) => {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
    // Remove from cache
    for (const [key, value] of objectUrlCache.entries()) {
      if (value === url) {
        objectUrlCache.delete(key)
        break
      }
    }
  }
}

// Validate media data
const validateMediaData = (media: Partial<MediaMeta>): string[] => {
  const errors: string[] = []
  
  if (!media.title?.trim()) {
    errors.push('Title is required')
  }
  
  if (!media.gameId?.trim()) {
    errors.push('Game selection is required')
  }
  
  if (!media.type) {
    errors.push('Media type is required')
  }
  
  if (media.title && media.title.length > 100) {
    errors.push('Title must be less than 100 characters')
  }
  
  if (media.description && media.description.length > 500) {
    errors.push('Description must be less than 500 characters')
  }
  
  return errors
}

export const MediaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser()
  const { t } = useLanguage()
  
  // Initialize media from localStorage or default sample data
  const [media, setMedia] = useState<MediaMeta[]>(() => {
    try {
      const storedMedia = localStorage.getItem(MEDIA_STORAGE_KEY)
      if (storedMedia) {
        const parsedMedia = JSON.parse(storedMedia)
        // Validate and convert date strings back to Date objects
        return parsedMedia
          .filter((item: any) => item && typeof item === 'object')
          .map((item: any) => ({
            ...item,
            uploadDate: new Date(item.uploadDate),
            // Ensure required fields exist
            id: item.id || `fallback_${Date.now()}_${Math.random()}`,
            userId: item.userId || 'unknown',
            username: item.username || 'Unknown User',
            gameId: item.gameId || '',
            gameName: item.gameName || 'Unknown Game',
            type: item.type || 'speedrun',
            title: item.title || 'Untitled',
            url: item.url || '',
            verified: Boolean(item.verified),
            likes: Number(item.likes) || 0,
            views: Number(item.views) || 0,
            tags: Array.isArray(item.tags) ? item.tags : []
          }))
      }
    } catch (error) {
      logger.error('Error loading media from storage:', error)
      // Clear corrupted data
      try {
        localStorage.removeItem(MEDIA_STORAGE_KEY)
      } catch (clearError) {
        logger.error('Error clearing corrupted media data:', clearError)
      }
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

  // User-specific media (memoized to prevent unnecessary recalculations)
  const userMedia = useMemo(() => {
    return user ? media.filter(m => m.userId === user.id) : []
  }, [media, user])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounced save to localStorage to prevent excessive writes
  const saveToLocalStorage = useCallback((mediaData: MediaMeta[]) => {
    try {
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(mediaData))
    } catch (error) {
      logger.error('Error saving media to storage:', error)
      setError('Failed to save media data')
    }
  }, [])

  // Save media to localStorage whenever it changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage(media)
    }, 1000) // 1 second debounce

    return () => clearTimeout(timeoutId)
  }, [media, saveToLocalStorage])

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlCache.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
      objectUrlCache.clear()
    }
  }, [])

  const uploadMedia = useCallback(async (file: File, metadata: Partial<MediaMeta>): Promise<boolean> => {
    if (loading) return false // Prevent concurrent uploads
    
    setLoading(true)
    setError(null)
    
    if (!user) {
      setError('User must be logged in to upload media')
      setLoading(false)
      return false
    }

    // Validate input
    const validationErrors = validateMediaData(metadata)
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '))
      setLoading(false)
      return false
    }

    // Validate file
    if (!file) {
      setError('File is required')
      setLoading(false)
      return false
    }

    // Check file size (100MB limit)
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      setError('File size must be less than 100MB')
      setLoading(false)
      return false
    }

    // Check file type
    const allowedTypes = [
      'video/mp4', 'video/webm', 'video/ogg',
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif'
    ]
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload MP4, WebM, JPG, PNG, or GIF files.')
      setLoading(false)
      return false
    }

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create unique ID with timestamp
      const mediaId = `${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Create object URL and cache it
      let objectUrl = objectUrlCache.get(file.name + file.size)
      if (!objectUrl) {
        objectUrl = URL.createObjectURL(file)
        objectUrlCache.set(file.name + file.size, objectUrl)
      }
      
      // Create new media item with all required fields
      const newMedia: MediaMeta = {
        id: mediaId,
        userId: user.id,
        username: user.username,
        gameId: metadata.gameId || '',
        gameName: metadata.gameName || '',
        eventId: metadata.eventId,
        type: metadata.type || 'speedrun',
        title: metadata.title?.trim() || 'Untitled',
        description: metadata.description?.trim() || '',
        url: objectUrl,
        thumbnailUrl: metadata.thumbnailUrl || generateThumbnail(file),
        uploadDate: new Date(),
        verified: false,
        likes: 0,
        views: 0,
        tags: metadata.tags || [],
        interactions: {
          likes: 0,
          views: 0,
          comments: [],
          likedBy: [],
          viewedBy: []
        }
      }
      
      // Add to media collection (newest first)
      setMedia(prev => [newMedia, ...prev])
      
      setLoading(false)
      return true
    } catch (err) {
      logger.error('Upload error:', err)
      setError(t('error.generic'))
      setLoading(false)
      return false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, t])

  const uploadMediaFromUrl = useCallback(async (url: string, metadata: Partial<MediaMeta>): Promise<boolean> => {
    if (loading) return false // Prevent concurrent uploads
    
    setLoading(true)
    setError(null)
    
    if (!user) {
      setError('User must be logged in to upload media')
      setLoading(false)
      return false
    }

    // Validate input
    const validationErrors = validateMediaData(metadata)
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '))
      setLoading(false)
      return false
    }

    // Validate URL
    if (!url?.trim()) {
      setError('URL is required')
      setLoading(false)
      return false
    }

    try {
      new URL(url) // This will throw if URL is invalid
    } catch {
      setError('Invalid URL format')
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
        eventId: metadata.eventId,
        type: metadata.type || 'speedrun',
        title: metadata.title?.trim() || 'Untitled',
        description: metadata.description?.trim() || '',
        url: url,
        thumbnailUrl: metadata.thumbnailUrl || generateThumbnailFromUrl(url),
        uploadDate: new Date(),
        verified: false,
        likes: 0,
        views: 0,
        tags: metadata.tags || [],
        interactions: {
          likes: 0,
          views: 0,
          comments: [],
          likedBy: [],
          viewedBy: []
        }
      }
      
      // Add to media collection (newest first)
      setMedia(prev => [newMedia, ...prev])
      
      setLoading(false)
      return true
    } catch (err) {
      logger.error('URL upload error:', err)
      setError(t('error.generic'))
      setLoading(false)
      return false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, t])

  // Helper function to generate thumbnail from file
  const generateThumbnail = useCallback((file: File): string => {
    if (file.type.startsWith('image/')) {
      let objectUrl = objectUrlCache.get(file.name + file.size + '_thumb')
      if (!objectUrl) {
        objectUrl = URL.createObjectURL(file)
        objectUrlCache.set(file.name + file.size + '_thumb', objectUrl)
      }
      return objectUrl
    } else if (file.type.startsWith('video/')) {
      // In a real app, you'd generate a video thumbnail
      return 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop'
    }
    return 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop'
  }, [])

  // Helper function to generate thumbnail from URL
  const generateThumbnailFromUrl = useCallback((url: string): string => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Helper function to extract YouTube video ID
  const extractYouTubeVideoId = useCallback((url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }, [])

  const deleteMedia = useCallback(async (mediaId: string): Promise<boolean> => {
    if (loading) return false
    
    setLoading(true)
    setError(null)
    
    if (!user) {
      setError('User must be logged in to delete media')
      setLoading(false)
      return false
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Check if user owns this media
      const mediaToDelete = media.find(m => m.id === mediaId)
      if (!mediaToDelete) {
        setError('Media not found')
        setLoading(false)
        return false
      }
      
      if (mediaToDelete.userId !== user.id) {
        setError('You can only delete your own media')
        setLoading(false)
        return false
      }
      
      // Cleanup object URL if it's a blob
      cleanupObjectUrl(mediaToDelete.url)
      if (mediaToDelete.thumbnailUrl) {
        cleanupObjectUrl(mediaToDelete.thumbnailUrl)
      }
      
      // Remove from media collection
      setMedia(prev => prev.filter(m => m.id !== mediaId))
      
      setLoading(false)
      return true
    } catch (err) {
      logger.error('Delete error:', err)
      setError(t('error.generic'))
      setLoading(false)
      return false
    }
  }, [user, loading, media, t])

  const likeMedia = useCallback(async (mediaId: string): Promise<boolean> => {
    if (!user) {
      setError('User must be logged in to like media')
      return false
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Update likes count
      setMedia(prev => prev.map(m => 
        m.id === mediaId 
          ? { ...m, likes: m.likes + 1, views: m.views + 1 }
          : m
      ))
      
      return true
    } catch (err) {
      logger.error('Like error:', err)
      return false
    }
  }, [user])

  const getMediaByUser = useCallback((userId: string): MediaMeta[] => {
    return media.filter(m => m.userId === userId).sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    )
  }, [media])

  const getMediaByEvent = useCallback((eventId: string): MediaMeta[] => {
    return media.filter(m => m.eventId === eventId).sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    )
  }, [media])

  const getMediaByGame = useCallback((gameId: string): MediaMeta[] => {
    return media.filter(m => m.gameId === gameId).sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    )
  }, [media])

  const getMediaByDateRange = useCallback((startDate: Date, endDate: Date): MediaMeta[] => {
    return media.filter(m => {
      const uploadDate = new Date(m.uploadDate)
      return uploadDate >= startDate && uploadDate <= endDate
    }).sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    )
  }, [media])

  const getUserMediaHistory = useCallback((userId: string): MediaMeta[] => {
    return media
      .filter(m => m.userId === userId)
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
  }, [media])

  const getMediaStats = useCallback(() => {
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
  }, [media])

  const verifyMedia = useCallback(async (mediaId: string, isVerified: boolean): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setMedia(prev => prev.map(m => 
      m.id === mediaId 
        ? { ...m, verified: isVerified }
        : m
    ))
  }, [])

  const isCapturingAllowed = useCallback((_eventId?: string): boolean => {
    // In a real app, this would check event rules or user permissions
    return true
  }, [])

  // Clear all media (for testing/admin purposes)
  const clearAllMedia = useCallback(() => {
    // Cleanup all object URLs
    media.forEach(m => {
      cleanupObjectUrl(m.url)
      if (m.thumbnailUrl) {
        cleanupObjectUrl(m.thumbnailUrl)
      }
    })
    
    setMedia([])
    localStorage.removeItem(MEDIA_STORAGE_KEY)
    if (user) {
      localStorage.removeItem(USER_MEDIA_STORAGE_KEY + '_' + user.id)
    }
  }, [media, user])

  const value: MediaContextType = useMemo(() => ({
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
  }), [
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
    uploadMediaFromUrl,
    getMediaByDateRange,
    getUserMediaHistory,
    getMediaStats,
    clearAllMedia
  ])

  return (
    <MediaContext.Provider value={value}>
      {children}
    </MediaContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMedia = () => {
  const context = useContext(MediaContext)
  if (context === undefined) {
    throw new Error('useMedia must be used within a MediaProvider')
  }
  return context
}
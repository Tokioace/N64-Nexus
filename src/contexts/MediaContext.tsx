import React, { createContext, useContext, useState, ReactNode } from 'react'
import { MediaMeta, MediaContextType } from '../types'
import { useLanguage } from './LanguageContext'

const MediaContext = createContext<MediaContextType | undefined>(undefined)

export const MediaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [media, setMedia] = useState<MediaMeta[]>([])
  const [userMedia, setUserMedia] = useState<MediaMeta[]>([])
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
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { MediaMeta, MediaCaptureSettings, MediaUploadProgress, MediaContextType } from '../types'
import { useUser } from './UserContext'
import { useEvents } from './EventContext'

const MediaContext = createContext<MediaContextType | undefined>(undefined)

export const useMedia = () => {
  const context = useContext(MediaContext)
  if (!context) {
    throw new Error('useMedia must be used within a MediaProvider')
  }
  return context
}

interface MediaProviderProps {
  children: ReactNode
}

export const MediaProvider: React.FC<MediaProviderProps> = ({ children }) => {
  const { user } = useUser()
  const { events, isEventActive } = useEvents()
  
  const [mediaList, setMediaList] = useState<MediaMeta[]>([])
  const [uploadProgress, setUploadProgress] = useState<MediaUploadProgress[]>([])
  const [settings] = useState<MediaCaptureSettings>({
    allowPhoto: true,
    allowVideo: true,
    allowStream: true,
    maxVideoDuration: 300, // 5 minutes
    maxFileSize: 100 * 1024 * 1024, // 100MB
    requiredFields: ['gameTime', 'gameId']
  })

  useEffect(() => {
    // Load media from localStorage
    const savedMedia = localStorage.getItem('mediaList')
    if (savedMedia) {
      const parsed = JSON.parse(savedMedia)
      setMediaList(parsed.map((media: any) => ({
        ...media,
        createdAt: new Date(media.createdAt),
        updatedAt: new Date(media.updatedAt)
      })))
    }
  }, [])

  useEffect(() => {
    // Save media to localStorage whenever it changes
    localStorage.setItem('mediaList', JSON.stringify(mediaList))
  }, [mediaList])

  const generateId = (): string => {
    return `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const isCapturingAllowed = (eventId?: string): boolean => {
    if (!eventId) return true
    
    const event = events.find(e => e.id === eventId)
    if (!event) return false
    
    return isEventActive(event)
  }

  const captureMedia = async (type: 'photo' | 'video', gameId: string, eventId?: string): Promise<string> => {
    if (!user) throw new Error('User must be logged in to capture media')
    
    if (eventId && !isCapturingAllowed(eventId)) {
      throw new Error('Media capture is not allowed outside of event time window')
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: type === 'video'
      })

      return new Promise((resolve, reject) => {
        const video = document.createElement('video')
        video.srcObject = stream
        video.play()

        if (type === 'photo') {
          video.addEventListener('loadedmetadata', () => {
            const canvas = document.createElement('canvas')
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            const ctx = canvas.getContext('2d')
            ctx?.drawImage(video, 0, 0)
            
            canvas.toBlob((blob) => {
              if (blob) {
                const mediaId = generateId()
                const file = new File([blob], `${mediaId}.jpg`, { type: 'image/jpeg' })
                
                // Stop the stream
                stream.getTracks().forEach(track => track.stop())
                
                // Create media metadata
                const mediaMeta: MediaMeta = {
                  id: mediaId,
                  userId: user.id,
                  gameId,
                  eventId,
                  type: 'photo',
                  url: URL.createObjectURL(blob),
                  timestamp: new Date().toISOString(),
                  isEventRun: !!eventId,
                  isPublic: false,
                  isVerified: false,
                  metadata: {
                    deviceInfo: navigator.userAgent,
                    resolution: `${canvas.width}x${canvas.height}`,
                    fileSize: blob.size
                  },
                  votes: {
                    likes: 0,
                    dislikes: 0
                  },
                  reports: 0,
                  status: 'pending',
                  createdAt: new Date(),
                  updatedAt: new Date()
                }

                setMediaList(prev => [...prev, mediaMeta])
                resolve(mediaId)
              } else {
                reject(new Error('Failed to capture photo'))
              }
            }, 'image/jpeg', 0.9)
          })
        } else {
          // Video recording logic
          const mediaRecorder = new MediaRecorder(stream)
          const chunks: Blob[] = []

          mediaRecorder.ondataavailable = (event) => {
            chunks.push(event.data)
          }

          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' })
            const mediaId = generateId()
            
            // Stop the stream
            stream.getTracks().forEach(track => track.stop())
            
            // Create media metadata
            const mediaMeta: MediaMeta = {
              id: mediaId,
              userId: user.id,
              gameId,
              eventId,
              type: 'video',
              url: URL.createObjectURL(blob),
              timestamp: new Date().toISOString(),
              isEventRun: !!eventId,
              isPublic: false,
              isVerified: false,
              metadata: {
                deviceInfo: navigator.userAgent,
                duration: settings.maxVideoDuration,
                fileSize: blob.size
              },
              votes: {
                likes: 0,
                dislikes: 0
              },
              reports: 0,
              status: 'pending',
              createdAt: new Date(),
              updatedAt: new Date()
            }

            setMediaList(prev => [...prev, mediaMeta])
            resolve(mediaId)
          }

          mediaRecorder.start()
          
          // Auto-stop after max duration
          setTimeout(() => {
            if (mediaRecorder.state === 'recording') {
              mediaRecorder.stop()
            }
          }, settings.maxVideoDuration * 1000)
        }
      })
    } catch (error) {
      throw new Error(`Failed to access camera: ${error}`)
    }
  }

  const uploadMedia = async (file: File, metadata: Partial<MediaMeta>): Promise<string> => {
    if (!user) throw new Error('User must be logged in to upload media')
    
    if (file.size > settings.maxFileSize) {
      throw new Error(`File size exceeds maximum limit of ${settings.maxFileSize / 1024 / 1024}MB`)
    }

    const mediaId = generateId()
    
    // Simulate upload progress
    const progressUpdate: MediaUploadProgress = {
      mediaId,
      progress: 0,
      status: 'uploading'
    }
    
    setUploadProgress(prev => [...prev, progressUpdate])

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setUploadProgress(prev => 
          prev.map(p => 
            p.mediaId === mediaId 
              ? { ...p, progress: Math.min(p.progress + 10, 100) }
              : p
          )
        )
      }, 200)

      setTimeout(() => {
        clearInterval(interval)
        
        const mediaMeta: MediaMeta = {
          id: mediaId,
          userId: user.id,
          gameId: metadata.gameId || '',
          eventId: metadata.eventId,
          type: metadata.type || 'photo',
          url: URL.createObjectURL(file),
          timestamp: new Date().toISOString(),
          isEventRun: !!metadata.eventId,
          isPublic: metadata.isPublic || false,
          isVerified: false,
          comment: metadata.comment,
          gameTime: metadata.gameTime,
          metadata: {
            deviceInfo: navigator.userAgent,
            fileSize: file.size,
            ...metadata.metadata
          },
          votes: {
            likes: 0,
            dislikes: 0
          },
          reports: 0,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        }

        setMediaList(prev => [...prev, mediaMeta])
        setUploadProgress(prev => 
          prev.map(p => 
            p.mediaId === mediaId 
              ? { ...p, status: 'completed', progress: 100 }
              : p
          )
        )
        
        resolve(mediaId)
      }, 2000)
    })
  }

  const deleteMedia = async (mediaId: string): Promise<void> => {
    const media = mediaList.find(m => m.id === mediaId)
    if (!media) throw new Error('Media not found')
    
    if (media.userId !== user?.id) {
      throw new Error('You can only delete your own media')
    }

    setMediaList(prev => prev.filter(m => m.id !== mediaId))
    
    // Revoke object URL to free memory
    URL.revokeObjectURL(media.url)
  }

  const voteOnMedia = async (mediaId: string, vote: 'like' | 'dislike'): Promise<void> => {
    if (!user) throw new Error('User must be logged in to vote')
    
    setMediaList(prev => 
      prev.map(media => {
        if (media.id === mediaId) {
          const currentVote = media.votes.userVote
          let newLikes = media.votes.likes
          let newDislikes = media.votes.dislikes
          
          // Remove previous vote
          if (currentVote === 'like') newLikes--
          if (currentVote === 'dislike') newDislikes--
          
          // Add new vote if different
          if (vote !== currentVote) {
            if (vote === 'like') newLikes++
            if (vote === 'dislike') newDislikes++
          }
          
          return {
            ...media,
            votes: {
              likes: newLikes,
              dislikes: newDislikes,
              userVote: vote !== currentVote ? vote : undefined
            },
            updatedAt: new Date()
          }
        }
        return media
      })
    )
  }

  const reportMedia = async (mediaId: string, reason: string): Promise<void> => {
    if (!user) throw new Error('User must be logged in to report')
    
    setMediaList(prev => 
      prev.map(media => 
        media.id === mediaId 
          ? { ...media, reports: media.reports + 1, updatedAt: new Date() }
          : media
      )
    )
  }

  const getMediaByUser = (userId: string): MediaMeta[] => {
    return mediaList.filter(media => media.userId === userId)
  }

  const getMediaByEvent = (eventId: string): MediaMeta[] => {
    return mediaList.filter(media => media.eventId === eventId)
  }

  const getMediaByGame = (gameId: string): MediaMeta[] => {
    return mediaList.filter(media => media.gameId === gameId)
  }

  const verifyMedia = async (mediaId: string, isVerified: boolean): Promise<void> => {
    setMediaList(prev => 
      prev.map(media => 
        media.id === mediaId 
          ? { 
              ...media, 
              isVerified, 
              status: isVerified ? 'approved' : 'rejected',
              updatedAt: new Date() 
            }
          : media
      )
    )
  }

  const contextValue: MediaContextType = {
    mediaList,
    uploadProgress,
    settings,
    captureMedia,
    uploadMedia,
    deleteMedia,
    voteOnMedia,
    reportMedia,
    getMediaByUser,
    getMediaByEvent,
    getMediaByGame,
    verifyMedia,
    isCapturingAllowed
  }

  return (
    <MediaContext.Provider value={contextValue}>
      {children}
    </MediaContext.Provider>
  )
}
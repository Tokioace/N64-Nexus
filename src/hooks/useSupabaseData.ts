import { useState, useEffect, useCallback } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { 
  profileService, 
  eventService, 
  speedrunService, 
  fanartService, 
  collectionService, 
  chatService, 
  forumService, 
  likeService, 
  reportService, 
  storageService, 
  statsService,
  personalRecordService 
} from '../services/dbService'
import { Database } from '../lib/supabase'
import { logger } from '../lib/logger'

type Tables = Database['public']['Tables']

// =====================================================
// GENERIC HOOK TYPES
// =====================================================
interface UseDataState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseDataArrayState<T> {
  data: T[]
  loading: boolean
  error: string | null
}

// =====================================================
// PROFILE HOOKS
// =====================================================
export const useProfile = (userId?: string) => {
  const [state, setState] = useState<UseDataState<Tables['profiles']['Row']>>({
    data: null,
    loading: true,
    error: null
  })

  const fetchProfile = useCallback(async () => {
    if (!userId) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const data = await profileService.getProfile(userId)
      setState({ data, loading: false, error: null })
    } catch (error) {
      logger.error('Error in useProfile:', error)
      setState({ data: null, loading: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }, [userId])

  const updateProfile = useCallback(async (updates: Tables['profiles']['Update']) => {
    if (!userId) return

    try {
      const data = await profileService.updateProfile(userId, updates)
      setState(prev => ({ ...prev, data }))
      return data
    } catch (error) {
      logger.error('Error updating profile:', error)
      throw error
    }
  }, [userId])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    ...state,
    refetch: fetchProfile,
    updateProfile
  }
}

export const usePublicProfiles = (limit = 20) => {
  const [state, setState] = useState<UseDataArrayState<Tables['profiles']['Row']>>({
    data: [],
    loading: true,
    error: null
  })

  const fetchProfiles = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const data = await profileService.getPublicProfiles(limit)
      setState({ data: data || [], loading: false, error: null })
    } catch (error) {
      logger.error('Error in usePublicProfiles:', error)
      setState({ data: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }, [limit])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  return {
    ...state,
    refetch: fetchProfiles
  }
}

// =====================================================
// EVENT HOOKS
// =====================================================
export const useEvents = (status?: 'upcoming' | 'live' | 'finished') => {
  const [state, setState] = useState<UseDataArrayState<any>>({
    data: [],
    loading: true,
    error: null
  })

  const fetchEvents = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const data = await eventService.getEvents(status)
      setState({ data: data || [], loading: false, error: null })
    } catch (error) {
      logger.error('Error in useEvents:', error)
      setState({ data: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }, [status])

  const createEvent = useCallback(async (event: Tables['events']['Insert']) => {
    try {
      const newEvent = await eventService.createEvent(event)
      setState(prev => ({ ...prev, data: [newEvent, ...prev.data] }))
      return newEvent
    } catch (error) {
      logger.error('Error creating event:', error)
      throw error
    }
  }, [])

  const updateEvent = useCallback(async (eventId: string, updates: Tables['events']['Update']) => {
    try {
      const updatedEvent = await eventService.updateEvent(eventId, updates)
      setState(prev => ({
        ...prev,
        data: prev.data.map(event => event.id === eventId ? updatedEvent : event)
      }))
      return updatedEvent
    } catch (error) {
      logger.error('Error updating event:', error)
      throw error
    }
  }, [])

  const deleteEvent = useCallback(async (eventId: string) => {
    try {
      await eventService.deleteEvent(eventId)
      setState(prev => ({
        ...prev,
        data: prev.data.filter(event => event.id !== eventId)
      }))
    } catch (error) {
      logger.error('Error deleting event:', error)
      throw error
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return {
    ...state,
    refetch: fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
  }
}

export const useEvent = (eventId?: string) => {
  const [state, setState] = useState<UseDataState<any>>({
    data: null,
    loading: true,
    error: null
  })

  const fetchEvent = useCallback(async () => {
    if (!eventId) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const data = await eventService.getEvent(eventId)
      setState({ data, loading: false, error: null })
    } catch (error) {
      logger.error('Error in useEvent:', error)
      setState({ data: null, loading: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }, [eventId])

  useEffect(() => {
    fetchEvent()
  }, [fetchEvent])

  return {
    ...state,
    refetch: fetchEvent
  }
}

// =====================================================
// SPEEDRUN HOOKS
// =====================================================
export const useSpeedruns = (eventId?: string, userId?: string) => {
  const [state, setState] = useState<UseDataArrayState<any>>({
    data: [],
    loading: true,
    error: null
  })

  const fetchSpeedruns = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const data = await speedrunService.getSpeedruns(eventId, userId)
      setState({ data: data || [], loading: false, error: null })
    } catch (error) {
      logger.error('Error in useSpeedruns:', error)
      setState({ data: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }, [eventId, userId])

  const createSpeedrun = useCallback(async (speedrun: Tables['speedruns']['Insert']) => {
    try {
      const newSpeedrun = await speedrunService.createSpeedrun(speedrun)
      setState(prev => ({ ...prev, data: [newSpeedrun, ...prev.data] }))
      return newSpeedrun
    } catch (error) {
      logger.error('Error creating speedrun:', error)
      throw error
    }
  }, [])

  const updateSpeedrun = useCallback(async (speedrunId: string, updates: Tables['speedruns']['Update']) => {
    try {
      const updatedSpeedrun = await speedrunService.updateSpeedrun(speedrunId, updates)
      setState(prev => ({
        ...prev,
        data: prev.data.map(speedrun => speedrun.id === speedrunId ? updatedSpeedrun : speedrun)
      }))
      return updatedSpeedrun
    } catch (error) {
      logger.error('Error updating speedrun:', error)
      throw error
    }
  }, [])

  const deleteSpeedrun = useCallback(async (speedrunId: string) => {
    try {
      await speedrunService.deleteSpeedrun(speedrunId)
      setState(prev => ({
        ...prev,
        data: prev.data.filter(speedrun => speedrun.id !== speedrunId)
      }))
    } catch (error) {
      logger.error('Error deleting speedrun:', error)
      throw error
    }
  }, [])

  useEffect(() => {
    fetchSpeedruns()
  }, [fetchSpeedruns])

  return {
    ...state,
    refetch: fetchSpeedruns,
    createSpeedrun,
    updateSpeedrun,
    deleteSpeedrun
  }
}

export const useEventLeaderboard = (eventId?: string) => {
  const [state, setState] = useState<UseDataArrayState<any>>({
    data: [],
    loading: true,
    error: null
  })

  const fetchLeaderboard = useCallback(async () => {
    if (!eventId) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const data = await speedrunService.getEventLeaderboard(eventId)
      setState({ data: data || [], loading: false, error: null })
    } catch (error) {
      logger.error('Error in useEventLeaderboard:', error)
      setState({ data: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }, [eventId])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  return {
    ...state,
    refetch: fetchLeaderboard
  }
}

// =====================================================
// FANART HOOKS
// =====================================================
export const useFanarts = (userId?: string, limit = 50) => {
  const [state, setState] = useState<UseDataArrayState<any>>({
    data: [],
    loading: true,
    error: null
  })

  const fetchFanarts = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const data = await fanartService.getFanarts(userId, limit)
      setState({ data: data || [], loading: false, error: null })
    } catch (error) {
      logger.error('Error in useFanarts:', error)
      setState({ data: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }, [userId, limit])

  const createFanart = useCallback(async (fanart: Tables['fanarts']['Insert']) => {
    try {
      const newFanart = await fanartService.createFanart(fanart)
      setState(prev => ({ ...prev, data: [newFanart, ...prev.data] }))
      return newFanart
    } catch (error) {
      logger.error('Error creating fanart:', error)
      throw error
    }
  }, [])

  const updateFanart = useCallback(async (fanartId: string, updates: Tables['fanarts']['Update']) => {
    try {
      const updatedFanart = await fanartService.updateFanart(fanartId, updates)
      setState(prev => ({
        ...prev,
        data: prev.data.map(fanart => fanart.id === fanartId ? updatedFanart : fanart)
      }))
      return updatedFanart
    } catch (error) {
      logger.error('Error updating fanart:', error)
      throw error
    }
  }, [])

  const deleteFanart = useCallback(async (fanartId: string) => {
    try {
      await fanartService.deleteFanart(fanartId)
      setState(prev => ({
        ...prev,
        data: prev.data.filter(fanart => fanart.id !== fanartId)
      }))
    } catch (error) {
      logger.error('Error deleting fanart:', error)
      throw error
    }
  }, [])

  useEffect(() => {
    fetchFanarts()
  }, [fetchFanarts])

  return {
    ...state,
    refetch: fetchFanarts,
    createFanart,
    updateFanart,
    deleteFanart
  }
}

// =====================================================
// COLLECTIONS HOOKS
// =====================================================
export const useCollections = (userId?: string, isWishlist = false) => {
  const [state, setState] = useState<UseDataArrayState<Tables['collections']['Row']>>({
    data: [],
    loading: true,
    error: null
  })

  const fetchCollections = useCallback(async () => {
    if (!userId) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const data = await collectionService.getCollections(userId, isWishlist)
      setState({ data: data || [], loading: false, error: null })
    } catch (error) {
      logger.error('Error in useCollections:', error)
      setState({ data: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }, [userId, isWishlist])

  const createCollection = useCallback(async (collection: Tables['collections']['Insert']) => {
    try {
      const newCollection = await collectionService.createCollection(collection)
      setState(prev => ({ ...prev, data: [newCollection, ...prev.data] }))
      return newCollection
    } catch (error) {
      logger.error('Error creating collection:', error)
      throw error
    }
  }, [])

  const updateCollection = useCallback(async (collectionId: string, updates: Tables['collections']['Update']) => {
    try {
      const updatedCollection = await collectionService.updateCollection(collectionId, updates)
      setState(prev => ({
        ...prev,
        data: prev.data.map(collection => collection.id === collectionId ? updatedCollection : collection)
      }))
      return updatedCollection
    } catch (error) {
      logger.error('Error updating collection:', error)
      throw error
    }
  }, [])

  const deleteCollection = useCallback(async (collectionId: string) => {
    try {
      await collectionService.deleteCollection(collectionId)
      setState(prev => ({
        ...prev,
        data: prev.data.filter(collection => collection.id !== collectionId)
      }))
    } catch (error) {
      logger.error('Error deleting collection:', error)
      throw error
    }
  }, [])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  return {
    ...state,
    refetch: fetchCollections,
    createCollection,
    updateCollection,
    deleteCollection
  }
}

// =====================================================
// CHAT HOOKS
// =====================================================
export const useChat = (channel = 'general', limit = 100) => {
  const [state, setState] = useState<UseDataArrayState<any>>({
    data: [],
    loading: true,
    error: null
  })
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null)

  const fetchMessages = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const data = await chatService.getMessages(channel, limit)
      setState({ data: data || [], loading: false, error: null })
    } catch (error) {
      logger.error('Error in useChat:', error)
      setState({ data: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }, [channel, limit])

  const sendMessage = useCallback(async (message: Tables['chat_messages']['Insert']) => {
    try {
      const newMessage = await chatService.sendMessage(message)
      // Don't add to local state here, let real-time subscription handle it
      return newMessage
    } catch (error) {
      logger.error('Error sending message:', error)
      throw error
    }
  }, [])

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await chatService.deleteMessage(messageId)
      setState(prev => ({
        ...prev,
        data: prev.data.filter(message => message.id !== messageId)
      }))
    } catch (error) {
      logger.error('Error deleting message:', error)
      throw error
    }
  }, [])

  // Set up real-time subscription
  useEffect(() => {
    fetchMessages()

    const subscription = chatService.subscribeToMessages(channel, (payload) => {
      if (payload.eventType === 'INSERT') {
        setState(prev => ({
          ...prev,
          data: [...prev.data, payload.new]
        }))
      }
    })

    setRealtimeChannel(subscription)

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [channel, fetchMessages])

  return {
    ...state,
    refetch: fetchMessages,
    sendMessage,
    deleteMessage
  }
}

// =====================================================
// FORUM HOOKS
// =====================================================
export const useForumPosts = (category?: string, limit = 50) => {
  const [state, setState] = useState<UseDataArrayState<any>>({
    data: [],
    loading: true,
    error: null
  })

  const fetchPosts = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const data = await forumService.getPosts(category, limit)
      setState({ data: data || [], loading: false, error: null })
    } catch (error) {
      logger.error('Error in useForumPosts:', error)
      setState({ data: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }, [category, limit])

  const createPost = useCallback(async (post: Tables['forum_posts']['Insert']) => {
    try {
      const newPost = await forumService.createPost(post)
      setState(prev => ({ ...prev, data: [newPost, ...prev.data] }))
      return newPost
    } catch (error) {
      logger.error('Error creating forum post:', error)
      throw error
    }
  }, [])

  const updatePost = useCallback(async (postId: string, updates: Tables['forum_posts']['Update']) => {
    try {
      const updatedPost = await forumService.updatePost(postId, updates)
      setState(prev => ({
        ...prev,
        data: prev.data.map(post => post.id === postId ? updatedPost : post)
      }))
      return updatedPost
    } catch (error) {
      logger.error('Error updating forum post:', error)
      throw error
    }
  }, [])

  const deletePost = useCallback(async (postId: string) => {
    try {
      await forumService.deletePost(postId)
      setState(prev => ({
        ...prev,
        data: prev.data.filter(post => post.id !== postId)
      }))
    } catch (error) {
      logger.error('Error deleting forum post:', error)
      throw error
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return {
    ...state,
    refetch: fetchPosts,
    createPost,
    updatePost,
    deletePost
  }
}

export const useForumPost = (postId?: string) => {
  const [state, setState] = useState<UseDataState<any>>({
    data: null,
    loading: true,
    error: null
  })

  const fetchPost = useCallback(async () => {
    if (!postId) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const data = await forumService.getPost(postId)
      setState({ data, loading: false, error: null })
    } catch (error) {
      logger.error('Error in useForumPost:', error)
      setState({ data: null, loading: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }, [postId])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  return {
    ...state,
    refetch: fetchPost
  }
}

export const useForumComments = (postId?: string) => {
  const [state, setState] = useState<UseDataArrayState<any>>({
    data: [],
    loading: true,
    error: null
  })

  const fetchComments = useCallback(async () => {
    if (!postId) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const data = await forumService.getComments(postId)
      setState({ data: data || [], loading: false, error: null })
    } catch (error) {
      logger.error('Error in useForumComments:', error)
      setState({ data: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }, [postId])

  const createComment = useCallback(async (comment: Tables['forum_comments']['Insert']) => {
    try {
      const newComment = await forumService.createComment(comment)
      setState(prev => ({ ...prev, data: [...prev.data, newComment] }))
      return newComment
    } catch (error) {
      logger.error('Error creating forum comment:', error)
      throw error
    }
  }, [])

  const updateComment = useCallback(async (commentId: string, updates: Tables['forum_comments']['Update']) => {
    try {
      const updatedComment = await forumService.updateComment(commentId, updates)
      setState(prev => ({
        ...prev,
        data: prev.data.map(comment => comment.id === commentId ? updatedComment : comment)
      }))
      return updatedComment
    } catch (error) {
      logger.error('Error updating forum comment:', error)
      throw error
    }
  }, [])

  const deleteComment = useCallback(async (commentId: string) => {
    try {
      await forumService.deleteComment(commentId)
      setState(prev => ({
        ...prev,
        data: prev.data.filter(comment => comment.id !== commentId)
      }))
    } catch (error) {
      logger.error('Error deleting forum comment:', error)
      throw error
    }
  }, [])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  return {
    ...state,
    refetch: fetchComments,
    createComment,
    updateComment,
    deleteComment
  }
}

// =====================================================
// LIKES HOOKS
// =====================================================
export const useLikes = (targetType?: string, targetId?: string) => {
  const [state, setState] = useState<UseDataArrayState<any>>({
    data: [],
    loading: true,
    error: null
  })
  const [likeCount, setLikeCount] = useState(0)

  const fetchLikes = useCallback(async () => {
    if (!targetType || !targetId) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const [likes, count] = await Promise.all([
        likeService.getLikes(targetType, targetId),
        likeService.getLikeCount(targetType, targetId)
      ])
      setState({ data: likes || [], loading: false, error: null })
      setLikeCount(count)
    } catch (error) {
      logger.error('Error in useLikes:', error)
      setState({ data: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }, [targetType, targetId])

  const toggleLike = useCallback(async (like: Tables['likes']['Insert']) => {
    try {
      const result = await likeService.toggleLike(like)
      
      if (result.action === 'added') {
        setState(prev => ({ ...prev, data: [result.data, ...prev.data] }))
        setLikeCount(prev => prev + 1)
      } else {
        setState(prev => ({
          ...prev,
          data: prev.data.filter(l => !(l.user_id === like.user_id && l.target_type === like.target_type && l.target_id === like.target_id))
        }))
        setLikeCount(prev => Math.max(0, prev - 1))
      }
      
      return result
    } catch (error) {
      logger.error('Error toggling like:', error)
      throw error
    }
  }, [])

  const isLikedByUser = useCallback(async (userId: string) => {
    if (!targetType || !targetId) return false

    try {
      return await likeService.isLikedByUser(userId, targetType, targetId)
    } catch (error) {
      logger.error('Error checking if liked by user:', error)
      return false
    }
  }, [targetType, targetId])

  useEffect(() => {
    fetchLikes()
  }, [fetchLikes])

  return {
    ...state,
    likeCount,
    refetch: fetchLikes,
    toggleLike,
    isLikedByUser
  }
}

// =====================================================
// REPORTS HOOKS
// =====================================================
export const useReports = (userId?: string, status?: string) => {
  const [state, setState] = useState<UseDataArrayState<Tables['reports']['Row']>>({
    data: [],
    loading: true,
    error: null
  })

  const fetchReports = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const data = await reportService.getReports(userId, status)
      setState({ data: data || [], loading: false, error: null })
    } catch (error) {
      logger.error('Error in useReports:', error)
      setState({ data: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }, [userId, status])

  const createReport = useCallback(async (report: Tables['reports']['Insert']) => {
    try {
      const newReport = await reportService.createReport(report)
      setState(prev => ({ ...prev, data: [newReport, ...prev.data] }))
      return newReport
    } catch (error) {
      logger.error('Error creating report:', error)
      throw error
    }
  }, [])

  const updateReport = useCallback(async (reportId: string, updates: Tables['reports']['Update']) => {
    try {
      const updatedReport = await reportService.updateReport(reportId, updates)
      setState(prev => ({
        ...prev,
        data: prev.data.map(report => report.id === reportId ? updatedReport : report)
      }))
      return updatedReport
    } catch (error) {
      logger.error('Error updating report:', error)
      throw error
    }
  }, [])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  return {
    ...state,
    refetch: fetchReports,
    createReport,
    updateReport
  }
}

// =====================================================
// STORAGE HOOKS
// =====================================================
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = useCallback(async (bucket: string, path: string, file: File) => {
    setUploading(true)
    setError(null)

    try {
      const data = await storageService.uploadFile(bucket, path, file)
      setUploading(false)
      return data
    } catch (error) {
      logger.error('Error uploading file:', error)
      setError(error instanceof Error ? error.message : 'Upload failed')
      setUploading(false)
      throw error
    }
  }, [])

  const deleteFile = useCallback(async (bucket: string, path: string) => {
    try {
      await storageService.deleteFile(bucket, path)
    } catch (error) {
      logger.error('Error deleting file:', error)
      throw error
    }
  }, [])

  const getPublicUrl = useCallback((bucket: string, path: string) => {
    return storageService.getPublicUrl(bucket, path)
  }, [])

  const createSignedUrl = useCallback(async (bucket: string, path: string, expiresIn?: number) => {
    try {
      return await storageService.createSignedUrl(bucket, path, expiresIn)
    } catch (error) {
      logger.error('Error creating signed URL:', error)
      throw error
    }
  }, [])

  return {
    uploading,
    error,
    uploadFile,
    deleteFile,
    getPublicUrl,
    createSignedUrl
  }
}

// =====================================================
// STATISTICS HOOKS
// =====================================================
export const useUserStats = (userId?: string) => {
  const [state, setState] = useState<UseDataState<any>>({
    data: null,
    loading: true,
    error: null
  })

  const fetchStats = useCallback(async () => {
    if (!userId) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const data = await statsService.getUserStats(userId)
      setState({ data, loading: false, error: null })
    } catch (error) {
      logger.error('Error in useUserStats:', error)
      setState({ data: null, loading: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }, [userId])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    ...state,
    refetch: fetchStats
  }
}

export const useGlobalStats = () => {
  const [state, setState] = useState<UseDataState<any>>({
    data: null,
    loading: true,
    error: null
  })

  const fetchStats = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const data = await statsService.getGlobalStats()
      setState({ data, loading: false, error: null })
    } catch (error) {
      logger.error('Error in useGlobalStats:', error)
      setState({ data: null, loading: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    ...state,
    refetch: fetchStats
  }
}

// =====================================================
// PERSONAL RECORDS HOOKS (Backward compatibility)
// =====================================================
export const usePersonalRecords = (userId?: string) => {
  const [state, setState] = useState<UseDataArrayState<Tables['personal_records']['Row']>>({
    data: [],
    loading: true,
    error: null
  })

  const fetchRecords = useCallback(async () => {
    if (!userId) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const data = await personalRecordService.getPersonalRecords(userId)
      setState({ data: data || [], loading: false, error: null })
    } catch (error) {
      logger.error('Error in usePersonalRecords:', error)
      setState({ data: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }, [userId])

  const createRecord = useCallback(async (record: Tables['personal_records']['Insert']) => {
    try {
      const newRecord = await personalRecordService.createPersonalRecord(record)
      setState(prev => ({ ...prev, data: [newRecord, ...prev.data] }))
      return newRecord
    } catch (error) {
      logger.error('Error creating personal record:', error)
      throw error
    }
  }, [])

  const updateRecord = useCallback(async (recordId: string, updates: Tables['personal_records']['Update']) => {
    try {
      const updatedRecord = await personalRecordService.updatePersonalRecord(recordId, updates)
      setState(prev => ({
        ...prev,
        data: prev.data.map(record => record.id === recordId ? updatedRecord : record)
      }))
      return updatedRecord
    } catch (error) {
      logger.error('Error updating personal record:', error)
      throw error
    }
  }, [])

  const deleteRecord = useCallback(async (recordId: string) => {
    try {
      await personalRecordService.deletePersonalRecord(recordId)
      setState(prev => ({
        ...prev,
        data: prev.data.filter(record => record.id !== recordId)
      }))
    } catch (error) {
      logger.error('Error deleting personal record:', error)
      throw error
    }
  }, [])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  return {
    ...state,
    refetch: fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord
  }
}
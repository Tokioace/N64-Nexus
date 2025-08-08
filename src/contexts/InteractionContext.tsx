import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { InteractionContextType, InteractionData, Comment } from '../types'
import { usePoints } from './PointsContext'
import { logger } from '../lib/logger'

const InteractionContext = createContext<InteractionContextType | undefined>(undefined)

// Storage key for localStorage persistence
const STORAGE_KEY_INTERACTIONS = 'battle64_interactions'

// Default interaction data structure
const createDefaultInteractionData = (): InteractionData => ({
  likes: 0,
  views: 0,
  comments: [],
  likedBy: [],
  viewedBy: []
})

export const InteractionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { awardPoints } = usePoints()
  const [interactions, setInteractions] = useState<Record<string, Record<string, InteractionData>>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load interactions from localStorage on mount
  useEffect(() => {
    const loadInteractions = () => {
      try {
        const savedInteractions = localStorage.getItem(STORAGE_KEY_INTERACTIONS)
        if (savedInteractions) {
          const parsedInteractions = JSON.parse(savedInteractions)
          // Convert date strings back to Date objects for comments
          const processedInteractions: Record<string, Record<string, InteractionData>> = {}
          
          Object.entries(parsedInteractions).forEach(([contentType, typeData]) => {
            processedInteractions[contentType] = {}
            Object.entries(typeData as Record<string, any>).forEach(([contentId, data]) => {
              processedInteractions[contentType][contentId] = {
                ...data,
                comments: data.comments?.map((comment: any) => ({
                  ...comment,
                  createdAt: new Date(comment.createdAt)
                })) || []
              }
            })
          })
          
          setInteractions(processedInteractions)
        }
      } catch (error) {
        logger.error('Error loading interactions from localStorage:', error)
        setError('Failed to load interaction data')
      }
    }

    loadInteractions()
  }, [])

  // Save interactions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INTERACTIONS, JSON.stringify(interactions))
    } catch (error) {
              logger.error('Error saving interactions to localStorage:', error)
    }
  }, [interactions])

  // Helper function to get or create interaction data for content
  const getOrCreateInteractionData = (contentType: string, contentId: string): InteractionData => {
    if (!interactions[contentType]) {
      return createDefaultInteractionData()
    }
    return interactions[contentType][contentId] || createDefaultInteractionData()
  }

  // Helper function to update interaction data
  const updateInteractionData = (
    contentType: string, 
    contentId: string, 
    updater: (data: InteractionData) => InteractionData
  ) => {
    setInteractions(prev => {
      const newInteractions = { ...prev }
      if (!newInteractions[contentType]) {
        newInteractions[contentType] = {}
      }
      const currentData = newInteractions[contentType][contentId] || createDefaultInteractionData()
      newInteractions[contentType][contentId] = updater(currentData)
      return newInteractions
    })
  }

  const likeContent = async (contentType: string, contentId: string, userId: string): Promise<boolean> => {
    setLoading(true)
    try {
      const currentData = getOrCreateInteractionData(contentType, contentId)
      
      // Check if user already liked this content
      if (currentData.likedBy.includes(userId)) {
        setError('Content already liked')
        setLoading(false)
        return false
      }

      // Update interaction data
      updateInteractionData(contentType, contentId, (data) => ({
        ...data,
        likes: data.likes + 1,
        likedBy: [...data.likedBy, userId]
      }))

      // Award points for liking content
      await awardPoints('interaction.like', `Liked ${contentType}: ${contentId}`)

      setLoading(false)
      return true
    } catch (err) {
              logger.error('Error liking content:', err)
      setError('Failed to like content')
      setLoading(false)
      return false
    }
  }

  const unlikeContent = async (contentType: string, contentId: string, userId: string): Promise<boolean> => {
    setLoading(true)
    try {
      const currentData = getOrCreateInteractionData(contentType, contentId)
      
      // Check if user hasn't liked this content
      if (!currentData.likedBy.includes(userId)) {
        setError('Content not liked')
        setLoading(false)
        return false
      }

      // Update interaction data
      updateInteractionData(contentType, contentId, (data) => ({
        ...data,
        likes: Math.max(0, data.likes - 1),
        likedBy: data.likedBy.filter(id => id !== userId)
      }))

      setLoading(false)
      return true
    } catch (err) {
              logger.error('Error unliking content:', err)
      setError('Failed to unlike content')
      setLoading(false)
      return false
    }
  }

  const addComment = async (
    contentType: string, 
    contentId: string, 
    userId: string, 
    username: string, 
    content: string
  ): Promise<boolean> => {
    setLoading(true)
    try {
      const newComment: Comment = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        userId,
        username,
        content,
        createdAt: new Date(),
        likes: 0,
        likedBy: []
      }

      // Update interaction data
      updateInteractionData(contentType, contentId, (data) => ({
        ...data,
        comments: [...data.comments, newComment]
      }))

      // Award points for commenting
      await awardPoints('interaction.comment', `Commented on ${contentType}: ${contentId}`)

      setLoading(false)
      return true
    } catch (err) {
              logger.error('Error adding comment:', err)
      setError('Failed to add comment')
      setLoading(false)
      return false
    }
  }

  const likeComment = async (
    contentType: string, 
    contentId: string, 
    commentId: string, 
    userId: string
  ): Promise<boolean> => {
    setLoading(true)
    try {
      updateInteractionData(contentType, contentId, (data) => ({
        ...data,
        comments: data.comments.map(comment => {
          if (comment.id === commentId) {
            if (comment.likedBy.includes(userId)) {
              // Unlike comment
              return {
                ...comment,
                likes: Math.max(0, comment.likes - 1),
                likedBy: comment.likedBy.filter(id => id !== userId)
              }
            } else {
              // Like comment
              return {
                ...comment,
                likes: comment.likes + 1,
                likedBy: [...comment.likedBy, userId]
              }
            }
          }
          return comment
        })
      }))

      setLoading(false)
      return true
    } catch (err) {
              logger.error('Error liking comment:', err)
      setError('Failed to like comment')
      setLoading(false)
      return false
    }
  }

  const viewContent = async (contentType: string, contentId: string, userId: string): Promise<boolean> => {
    try {
      const currentData = getOrCreateInteractionData(contentType, contentId)
      
      // Only count as a new view if user hasn't viewed this content before
      if (!currentData.viewedBy.includes(userId)) {
        updateInteractionData(contentType, contentId, (data) => ({
          ...data,
          views: data.views + 1,
          viewedBy: [...data.viewedBy, userId]
        }))

        // Award points for viewing content (small amount)
        await awardPoints('interaction.view', `Viewed ${contentType}: ${contentId}`)
      }

      return true
    } catch (err) {
              logger.error('Error recording view:', err)
      return false
    }
  }

  const getInteractionData = (contentType: string, contentId: string): InteractionData => {
    return getOrCreateInteractionData(contentType, contentId)
  }

  const hasUserLiked = (contentType: string, contentId: string, userId: string): boolean => {
    const data = getOrCreateInteractionData(contentType, contentId)
    return data.likedBy.includes(userId)
  }

  const hasUserViewed = (contentType: string, contentId: string, userId: string): boolean => {
    const data = getOrCreateInteractionData(contentType, contentId)
    return data.viewedBy.includes(userId)
  }

  const getTotalLikesForUser = (userId: string): number => {
    let total = 0
    Object.values(interactions).forEach(typeData => {
      Object.values(typeData).forEach(data => {
        // Count likes received on content created by user (would need content ownership info)
        // For now, count comments liked by user
        data.comments.forEach(comment => {
          if (comment.userId === userId) {
            total += comment.likes
          }
        })
      })
    })
    return total
  }

  const getTotalCommentsForUser = (userId: string): number => {
    let total = 0
    Object.values(interactions).forEach(typeData => {
      Object.values(typeData).forEach(data => {
        total += data.comments.filter(comment => comment.userId === userId).length
      })
    })
    return total
  }

  const getMostLikedContent = (contentType?: string): Array<{id: string, type: string, likes: number}> => {
    const results: Array<{id: string, type: string, likes: number}> = []
    
    const typesToCheck = contentType ? [contentType] : Object.keys(interactions)
    
    typesToCheck.forEach(type => {
      if (interactions[type]) {
        Object.entries(interactions[type]).forEach(([id, data]) => {
          results.push({ id, type, likes: data.likes })
        })
      }
    })
    
    return results.sort((a, b) => b.likes - a.likes).slice(0, 10)
  }

  const value: InteractionContextType = {
    likeContent,
    unlikeContent,
    addComment,
    likeComment,
    viewContent,
    getInteractionData,
    hasUserLiked,
    hasUserViewed,
    getTotalLikesForUser,
    getTotalCommentsForUser,
    getMostLikedContent,
    loading,
    error
  }

  return (
    <InteractionContext.Provider value={value}>
      {children}
    </InteractionContext.Provider>
  )
}

export const useInteraction = () => {
  const context = useContext(InteractionContext)
  if (context === undefined) {
    throw new Error('useInteraction must be used within an InteractionProvider')
  }
  return context
}
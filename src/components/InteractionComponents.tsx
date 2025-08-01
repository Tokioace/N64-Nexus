import React, { useState, useEffect } from 'react'
import { Heart, MessageCircle, MessageSquare, Eye, Send, ThumbsUp } from 'lucide-react'
import { useInteraction } from '../contexts/InteractionContext'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Comment, InteractionData } from '../types'

interface InteractionBarProps {
  contentType: string
  contentId: string
  className?: string
  showComments?: boolean
  compact?: boolean
}

interface LikeButtonProps {
  contentType: string
  contentId: string
  className?: string
  compact?: boolean
}

interface ViewCounterProps {
  contentType: string
  contentId: string
  className?: string
  compact?: boolean
}

interface CommentSectionProps {
  contentType: string
  contentId: string
  className?: string
  maxHeight?: string
}

// Like Button Component
export const LikeButton: React.FC<LikeButtonProps> = ({ 
  contentType, 
  contentId, 
  className = '', 
  compact = false 
}) => {
  const { likeContent, unlikeContent, hasUserLiked, getInteractionData } = useInteraction()
  const { user } = useUser()
  const { t } = useLanguage()
  const [isLiking, setIsLiking] = useState(false)

  const interactionData = getInteractionData(contentType, contentId)
  const isLiked = user ? hasUserLiked(contentType, contentId, user.id) : false

  const handleLike = async () => {
    if (!user || isLiking) return
    
    setIsLiking(true)
    try {
      if (isLiked) {
        await unlikeContent(contentType, contentId, user.id)
      } else {
        await likeContent(contentType, contentId, user.id)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={!user || isLiking}
      className={`flex items-center ${!compact ? 'gap-1.5 sm:gap-2' : ''} transition-all duration-200 text-white hover:text-white ${!user ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} ${className}`}
      title={user ? (isLiked ? t('interaction.unlike') : t('interaction.like')) : t('interaction.loginToLike')}
    >
      <Heart className={`${compact ? 'w-4 h-4' : 'w-4 h-4'} flex-shrink-0 ${isLiked ? 'fill-white text-white scale-110' : 'text-white'} transition-all`} />
      {!compact && (
        <span className="text-xs sm:text-sm font-medium min-w-[1ch] text-white">
          {interactionData.likes}
        </span>
      )}
    </button>
  )
}

// View Counter Component
export const ViewCounter: React.FC<ViewCounterProps> = ({ 
  contentType, 
  contentId, 
  className = '', 
  compact = false 
}) => {
  const { viewContent, getInteractionData } = useInteraction()
  const { user } = useUser()

  const interactionData = getInteractionData(contentType, contentId)

  // Record view when component mounts (only if user is logged in)
  useEffect(() => {
    if (user) {
      viewContent(contentType, contentId, user.id)
    }
  }, [user, contentType, contentId, viewContent])

  // Always show the view counter, even without authentication
  return (
    <div className={`flex items-center ${!compact ? 'gap-1.5 sm:gap-2' : ''} text-white ${className}`}>
      <Eye className={`${compact ? 'w-4 h-4' : 'w-4 h-4'} flex-shrink-0 text-white transition-all`} />
      {!compact && (
        <span className="text-xs sm:text-sm min-w-[1ch] text-white">
          {interactionData.views}
        </span>
      )}
    </div>
  )
}

// Comment Section Component
export const CommentSection: React.FC<CommentSectionProps> = ({ 
  contentType, 
  contentId, 
  className = '',
  maxHeight = '300px'
}) => {
  const { addComment, likeComment, getInteractionData } = useInteraction()
  const { user } = useUser()
  const { t } = useLanguage()
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showComments, setShowComments] = useState(false)

  const interactionData = getInteractionData(contentType, contentId)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const success = await addComment(contentType, contentId, user.id, user.username, newComment.trim())
      if (success) {
        setNewComment('')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!user) return
    try {
      await likeComment(contentType, contentId, commentId, user.id)
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return t('time.justNow')
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Comment Toggle Button */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2 text-white hover:text-white transition-colors"
      >
        <MessageCircle className="w-4 h-4 text-white" />
        <span className="text-xs sm:text-sm font-medium text-white">
          {interactionData.comments.length > 0 
            ? `${interactionData.comments.length} ${t('interaction.comments')}`
            : t('interaction.addComment')
          }
        </span>
      </button>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-2">
          {/* Comment Input */}
          {user && (
            <form onSubmit={handleSubmitComment} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={t('interaction.writeComment')}
                  className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Comments List */}
          {interactionData.comments.length > 0 && (
            <div 
              className="space-y-2 overflow-y-auto pr-2"
              style={{ maxHeight }}
            >
              {interactionData.comments
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .map((comment) => (
                  <div key={comment.id} className="bg-slate-700/30 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-200">
                          {comment.username}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      {user && (
                        <button
                          onClick={() => handleLikeComment(comment.id)}
                          className={`flex items-center gap-1 text-xs transition-colors ${
                            comment.likedBy.includes(user.id)
                              ? 'text-red-400 hover:text-red-300'
                              : 'text-slate-400 hover:text-red-400'
                          }`}
                        >
                          <ThumbsUp className={`w-3 h-3 ${comment.likedBy.includes(user.id) ? 'fill-current' : ''}`} />
                          {comment.likes > 0 && <span>{comment.likes}</span>}
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))}
            </div>
          )}

          {!user && (
            <div className="text-center py-4">
              <p className="text-sm text-slate-400">
                {t('interaction.loginToComment')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Compact Interaction Bar Component for Events
interface CompactInteractionBarProps {
  contentType: string
  contentId: string
  className?: string
  showComments?: boolean
  showCommentsSection: boolean
  setShowCommentsSection: (show: boolean) => void
}

const CompactInteractionBar: React.FC<CompactInteractionBarProps> = ({
  contentType,
  contentId,
  className = '',
  showComments = true,
  showCommentsSection,
  setShowCommentsSection
}) => {
  const { likeContent, unlikeContent, hasUserLiked, getInteractionData, viewContent } = useInteraction()
  const { user } = useUser()
  const { t } = useLanguage()
  const [isLiking, setIsLiking] = useState(false)

  const interactionData = getInteractionData(contentType, contentId)
  const isLiked = user ? hasUserLiked(contentType, contentId, user.id) : false

  // Record view when component mounts (only if user is logged in)
  useEffect(() => {
    if (user) {
      viewContent(contentType, contentId, user.id)
    }
  }, [user, contentType, contentId, viewContent])

  const handleLike = async () => {
    if (!user || isLiking) return

    setIsLiking(true)
    try {
      if (isLiked) {
        await unlikeContent(contentType, contentId, user.id)
      } else {
        await likeContent(contentType, contentId, user.id)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setIsLiking(false)
    }
  }

  // Custom compact SVG icons for better spacing control - all white, slightly smaller (85-90%)
  const CompactHeartIcon = ({ filled }: { filled: boolean }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      <path 
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
        fill={filled ? "#FFFFFF" : "none"} 
        stroke="#FFFFFF" 
        strokeWidth="2"
      />
    </svg>
  )

  const CompactEyeIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#FFFFFF" strokeWidth="2"/>
      <circle cx="12" cy="12" r="3" stroke="#FFFFFF" strokeWidth="2"/>
    </svg>
  )

  const CompactCommentIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#FFFFFF" strokeWidth="2"/>
    </svg>
  )

  return (
    <div className={`flex items-center ${className}`} style={{ 
      gap: '6px',
      fontSize: '12px', 
      lineHeight: 1,
      height: '18px',
      justifyContent: 'flex-start',
      paddingLeft: '0px'
    }}>
      {/* Like Button with count - Ultra-compact, all white */}
      <div className="flex items-center" style={{ gap: '2px' }}>
        <button
          onClick={handleLike}
          disabled={!user || isLiking}
          title={user ? (isLiked ? t('interaction.unlike') : t('interaction.like')) : t('interaction.loginToLike')}
          aria-label={user ? (isLiked ? t('interaction.unlike') : t('interaction.like')) : t('interaction.loginToLike')}
          className={`transition-all duration-200 flex-shrink-0 text-white hover:text-white hover:scale-105 ${
            !user ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{ padding: '0', margin: '0', border: 'none', background: 'transparent' }}
        >
          <CompactHeartIcon filled={isLiked} />
        </button>
        <span className="text-white font-medium min-w-[1ch]" style={{ fontSize: '11px', color: '#FFFFFF' }}>
          {interactionData.likes}
        </span>
      </div>
      
      {/* View Counter with count - Ultra-compact, all white */}
      <div className="flex items-center" style={{ gap: '2px' }} title={t('interaction.viewCount')} aria-label={t('interaction.viewCount')}>
        <CompactEyeIcon />
        <span className="text-white font-medium min-w-[1ch]" style={{ fontSize: '11px', color: '#FFFFFF' }}>
          {interactionData.views}
        </span>
      </div>
      
      {/* Comment Button with count - Ultra-compact, all white */}
      {showComments && (
        <div className="flex items-center" style={{ gap: '2px' }}>
          <button
            onClick={() => setShowCommentsSection(!showCommentsSection)}
            title={t('interaction.showComments')}
            aria-label={t('interaction.showComments')}
            className="text-white hover:text-white hover:scale-105 transition-all duration-200 flex-shrink-0"
            style={{ padding: '0', margin: '0', border: 'none', background: 'transparent' }}
          >
            <CompactCommentIcon />
          </button>
          <span className="text-white font-medium min-w-[1ch]" style={{ fontSize: '11px', color: '#FFFFFF' }}>
            {interactionData.comments.length}
          </span>
        </div>
      )}
      
      {/* Comments Section - Positioned below the interaction bar */}
      {showComments && showCommentsSection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowCommentsSection(false)}>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-600 max-w-md w-full max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-200">Comments</h3>
              <button 
                onClick={() => setShowCommentsSection(false)}
                className="text-slate-400 hover:text-slate-300 text-xl"
              >
                ×
              </button>
            </div>
            <CommentSection 
              contentType={contentType} 
              contentId={contentId}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Complete Interaction Bar Component
export const InteractionBar: React.FC<InteractionBarProps> = ({ 
  contentType, 
  contentId, 
  className = '',
  showComments = true,
  compact = false
}) => {
  const { getInteractionData } = useInteraction()
  const { t } = useLanguage()
  const [showCommentsSection, setShowCommentsSection] = useState(false)
  
  const interactionData = getInteractionData(contentType, contentId)

  if (compact) {
    // Compact mode for events - show like, saw, comment with proper spacing like FanArt
    return (
      <CompactInteractionBar 
        contentType={contentType}
        contentId={contentId}
        className={className}
        showComments={showComments}
        showCommentsSection={showCommentsSection}
        setShowCommentsSection={setShowCommentsSection}
      />
    )
  }

  // Full mode for other components
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Action Buttons */}
      <div className="flex items-center justify-start">
        <div className="flex items-center gap-3 sm:gap-4">
          <LikeButton 
            contentType={contentType} 
            contentId={contentId} 
            compact={compact}
          />
          <ViewCounter 
            contentType={contentType} 
            contentId={contentId} 
            compact={compact}
          />
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection 
          contentType={contentType} 
          contentId={contentId}
        />
      )}
    </div>
  )
}

export default InteractionBar
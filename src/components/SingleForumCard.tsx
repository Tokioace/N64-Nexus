import React, { useState, useRef } from 'react'
import { MessageSquare, X } from 'lucide-react'

interface ForumThread {
  id: string
  title: string
  author: string
  replies: number
  lastActivity: Date
  category: string
}

interface SingleForumCardProps {
  forumThreads: ForumThread[]
  className?: string
}

const SingleForumCard: React.FC<SingleForumCardProps> = ({ forumThreads, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDismiss = () => {
    if (isAnimating || forumThreads.length === 0) return
    
    setIsAnimating(true)
    
    setTimeout(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1
        return nextIndex >= forumThreads.length ? 0 : nextIndex
      })
      setIsAnimating(false)
    }, 300)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe || isRightSwipe) {
      handleDismiss()
    }

    touchStartX.current = 0
    touchEndX.current = 0
  }

  if (forumThreads.length === 0) {
    return (
      <div className={`${className} flex justify-center`}>
        <div className="swipeable-card bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border-l-4 border-cyan-400">
          <div className="swipeable-card-header">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <h3 className="text-responsive-base font-bold text-slate-100">💬 Forum Posts</h3>
            </div>
          </div>
          <div className="swipeable-card-content">
            <div className="flex items-center justify-center h-full text-slate-400 text-responsive-sm">
              Keine Forum Posts verfügbar
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentThread = forumThreads[currentIndex]

  return (
    <div className={`${className} flex justify-center`}>
      <div 
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`swipeable-card bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border-l-4 border-cyan-400 relative transition-all duration-300 ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 z-10 p-1 rounded-full bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white transition-colors"
            aria-label="Dismiss forum post"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="swipeable-card-header">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <h3 className="text-responsive-base font-bold text-slate-100">💬 Forum Posts</h3>
            </div>
            <div className="text-xs text-slate-400">
              <span className="capitalize text-cyan-400">{currentThread.category}</span>
            </div>
          </div>
          
          <div className="swipeable-card-content">
            <div className="p-3 h-full flex flex-col">
              <div className="flex-1">
                <h4 className="text-sm sm:text-base font-semibold text-slate-100 mb-2 leading-tight">
                  {currentThread.title}
                </h4>
                <div className="text-xs text-slate-300 mb-2">
                  <span className="text-blue-400">{currentThread.author}</span> • {currentThread.category}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 mt-auto">
                <span>{currentThread.replies} Antworten</span>
                <span>{formatTime(currentThread.lastActivity)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="flex justify-center mt-2 gap-1">
          {forumThreads.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex 
                  ? 'bg-cyan-400' 
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
        
        {/* Card counter */}
        <div className="text-center mt-1 text-xs text-slate-400">
          {currentIndex + 1} von {forumThreads.length}
        </div>
      </div>
    </div>
  )
}

export default SingleForumCard
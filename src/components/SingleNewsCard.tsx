import React, { useState, useRef } from 'react'
import NewsCard from './NewsCard'

interface NewsItem {
  id: string
  title: string
  content: string
  date: Date
  type: 'event_winner' | 'n64_history' | 'community_news' | 'event_announcement'
}

interface SingleNewsCardProps {
  newsItems: NewsItem[]
  className?: string
}

const SingleNewsCard: React.FC<SingleNewsCardProps> = ({ newsItems, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const handleDismiss = () => {
    if (isAnimating || newsItems.length === 0) return
    
    setIsAnimating(true)
    
    // Move to next card after animation
    setTimeout(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1
        // If we've reached the end, cycle back to the beginning
        return nextIndex >= newsItems.length ? 0 : nextIndex
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

  if (newsItems.length === 0) {
    return (
      <div className={`${className} flex justify-center`}>
        <div className="swipeable-card bg-gradient-to-br from-slate-600/20 to-slate-800/20 border-l-4 border-slate-400">
          <div className="swipeable-card-header">
            <div className="flex items-center gap-2">
              <h3 className="text-responsive-base font-bold text-slate-100">📰 News</h3>
            </div>
          </div>
          <div className="swipeable-card-content">
            <div className="flex items-center justify-center h-full text-slate-400 text-responsive-sm">
              Keine News verfügbar
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentNewsItem = newsItems[currentIndex]

  return (
    <div className={`${className} flex justify-center`}>
      <div 
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <NewsCard
          newsItem={currentNewsItem}
          index={currentIndex}
          onDismiss={handleDismiss}
          isAnimating={isAnimating}
        />
        
        {/* Progress indicator */}
        <div className="flex justify-center mt-2 gap-1">
          {newsItems.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex 
                  ? 'bg-blue-400' 
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
        
        {/* Card counter */}
        <div className="text-center mt-1 text-xs text-slate-400">
          {currentIndex + 1} von {newsItems.length}
        </div>
      </div>
    </div>
  )
}

export default SingleNewsCard
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
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('left')
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const goToNext = () => {
    if (isFlipping || currentIndex >= newsItems.length - 1) return
    
    setFlipDirection('left')
    setIsFlipping(true)
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      setIsFlipping(false)
    }, 300)
  }

  const goToPrevious = () => {
    if (isFlipping || currentIndex <= 0) return
    
    setFlipDirection('right')
    setIsFlipping(true)
    
    setTimeout(() => {
      setCurrentIndex(prev => prev - 1)
      setIsFlipping(false)
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

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrevious()
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

  return (
    <div className={`${className} flex justify-center`}>
      <div 
        className="relative book-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Stack of cards - render current and next card */}
        <div className="relative" style={{ perspective: '1000px' }}>
          {/* Next card (underneath) */}
          {currentIndex < newsItems.length - 1 && (
            <div className="absolute inset-0 z-10">
              <NewsCard
                newsItem={newsItems[currentIndex + 1]}
                index={currentIndex + 1}
                isAnimating={false}
              />
            </div>
          )}
          
          {/* Previous card (for right swipe) */}
          {currentIndex > 0 && flipDirection === 'right' && isFlipping && (
            <div className="absolute inset-0 z-10">
              <NewsCard
                newsItem={newsItems[currentIndex - 1]}
                index={currentIndex - 1}
                isAnimating={false}
              />
            </div>
          )}
          
          {/* Current card (on top) */}
          <div 
            className={`relative z-20 transition-transform duration-300 ease-in-out ${
              isFlipping 
                ? flipDirection === 'left' 
                  ? 'book-page-flip-left' 
                  : 'book-page-flip-right'
                : ''
            }`}
            style={{ 
              transformOrigin: flipDirection === 'left' ? 'left center' : 'right center',
              transformStyle: 'preserve-3d'
            }}
          >
            <NewsCard
              newsItem={newsItems[currentIndex]}
              index={currentIndex}
              isAnimating={isFlipping}
            />
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex justify-between pointer-events-none z-30">
          <button
            onClick={goToPrevious}
            disabled={isFlipping || currentIndex <= 0}
            className={`pointer-events-auto p-2 rounded-full bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white transition-all duration-200 ${
              currentIndex <= 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
            }`}
            aria-label="Previous card"
          >
            <span className="text-lg">‹</span>
          </button>
          
          <button
            onClick={goToNext}
            disabled={isFlipping || currentIndex >= newsItems.length - 1}
            className={`pointer-events-auto p-2 rounded-full bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white transition-all duration-200 ${
              currentIndex >= newsItems.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
            }`}
            aria-label="Next card"
          >
            <span className="text-lg">›</span>
          </button>
        </div>
        
        {/* Progress indicator */}
        <div className="flex justify-center mt-2 gap-1">
          {newsItems.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex 
                  ? 'bg-blue-400' 
                  : index < currentIndex
                  ? 'bg-slate-500'
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
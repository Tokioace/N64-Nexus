import React, { useState, useRef } from 'react'
import { Newspaper } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import NewsCard from './NewsCard'
import { useLanguage } from '../contexts/LanguageContext'

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
  const { t } = useLanguage()
  const navigate = useNavigate()
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
    }, 200)
  }

  const goToPrevious = () => {
    if (isFlipping || currentIndex <= 0) return
    
    setFlipDirection('right')
    setIsFlipping(true)
    
    setTimeout(() => {
      setCurrentIndex(prev => prev - 1)
      setIsFlipping(false)
    }, 200)
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
        <div className="compact-card">
          <div className="compact-card-header">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-blue-400" />
              <h3 className="compact-card-title">{t('card.news')}</h3>
            </div>
          </div>
          <div className="compact-card-content">
            <div className="flex items-center justify-center h-16 text-slate-400 compact-text-sm">
              {t('news.noNewsAvailable')}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} flex justify-center`}>
      <div 
        className="relative w-full max-w-md"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Direct slide transition without 180 degree rotation */}
        <div className="relative overflow-hidden">
          {/* Background card for smooth transition */}
          {isFlipping && (
            <div className="absolute inset-0 z-10">
              {flipDirection === 'left' && currentIndex < newsItems.length - 1 && 
                <NewsCard
                  newsItem={newsItems[currentIndex + 1]}
                  index={currentIndex + 1}
                  isAnimating={false}
                />
              }
              {flipDirection === 'right' && currentIndex > 0 && 
                <NewsCard
                  newsItem={newsItems[currentIndex - 1]}
                  index={currentIndex - 1}
                  isAnimating={false}
                />
              }
            </div>
          )}
          
          {/* Current card with slide animation */}
          <div 
            className={`relative z-20 transition-transform duration-200 ease-out ${
              isFlipping 
                ? flipDirection === 'left' 
                  ? 'transform -translate-x-full opacity-0' 
                  : 'transform translate-x-full opacity-0'
                : 'transform translate-x-0 opacity-100'
            }`}
          >
            <NewsCard
              newsItem={newsItems[currentIndex]}
              index={currentIndex}
              isAnimating={false}
            />
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex justify-between pointer-events-none z-30">
          <button
            onClick={goToPrevious}
            disabled={isFlipping || currentIndex <= 0}
            className={`pointer-events-auto w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-200 ${
              currentIndex <= 0 || isFlipping 
                ? 'opacity-30 cursor-not-allowed' 
                : 'opacity-70 hover:opacity-100 hover:bg-blue-500/30'
            }`}
          >
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            disabled={isFlipping || currentIndex >= newsItems.length - 1}
            className={`pointer-events-auto w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-200 ${
              currentIndex >= newsItems.length - 1 || isFlipping 
                ? 'opacity-30 cursor-not-allowed' 
                : 'opacity-70 hover:opacity-100 hover:bg-blue-500/30'
            }`}
          >
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-1 mt-2">
          {newsItems.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isFlipping && index !== currentIndex) {
                  setFlipDirection(index > currentIndex ? 'left' : 'right')
                  setIsFlipping(true)
                  setTimeout(() => {
                    setCurrentIndex(index)
                    setIsFlipping(false)
                  }, 200)
                }
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-blue-400' 
                  : 'bg-slate-600 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {/* Card counter */}
        <div className="text-center mt-1">
          <span className="compact-text-xs text-slate-500">
            {currentIndex + 1} / {newsItems.length}
          </span>
        </div>
      </div>
    </div>
  )
}

export default SingleNewsCard
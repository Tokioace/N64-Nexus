import React, { useState, useRef } from 'react'
import { Palette, Heart, Eye } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

// TypeScript check refresh - all translation keys are correct
interface FanArtItem {
  id: string
  title: string
  artist: string
  imageUrl: string
  likes: number
  views: number
  game: string
}

interface SingleFanArtCardProps {
  fanArtItems: FanArtItem[]
  className?: string
}

const SingleFanArtCard: React.FC<SingleFanArtCardProps> = ({ fanArtItems, className = '' }) => {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('left')
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const goToNext = () => {
    if (isFlipping || currentIndex >= fanArtItems.length - 1) return
    
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

  if (fanArtItems.length === 0) {
    return (
      <div className={`${className} flex justify-center`}>
        <div className="compact-card">
          <div className="compact-card-header">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-400" />
              <h3 className="compact-card-title">{t('card.fanarts')}</h3>
            </div>
          </div>
          <div className="compact-card-content">
            <div className="flex items-center justify-center h-16 text-slate-400 compact-text-sm">
              {t('card.noRecords')}
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
        {/* Direct slide transition */}
        <div className="relative overflow-hidden">
          {/* Background card for smooth transition */}
          {isFlipping && (
            <div className="absolute inset-0 z-10">
              {flipDirection === 'left' && currentIndex < fanArtItems.length - 1 && 
                <FanArtCard
                  item={fanArtItems[currentIndex + 1]}
                  index={currentIndex + 1}
                  isAnimating={false}
                />
              }
              {flipDirection === 'right' && currentIndex > 0 && 
                <FanArtCard
                  item={fanArtItems[currentIndex - 1]}
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
            <FanArtCard
              item={fanArtItems[currentIndex]}
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
            disabled={isFlipping || currentIndex >= fanArtItems.length - 1}
            className={`pointer-events-auto w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-200 ${
              currentIndex >= fanArtItems.length - 1 || isFlipping 
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
          {fanArtItems.map((_, index) => (
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
            {currentIndex + 1} / {fanArtItems.length}
          </span>
        </div>
      </div>
    </div>
  )
}

export default SingleFanArtCard

const FanArtCard: React.FC<{ item: FanArtItem; index: number; isAnimating?: boolean }> = ({ 
  item, 
  index, 
  isAnimating = false 
}) => {
  const { t } = useLanguage()

  return (
    <div className={`compact-card transition-all duration-300 cursor-pointer ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
      <div className="compact-card-header">
        <div className="flex items-center gap-2">
          <Palette className="w-3 h-3 text-blue-400" />
          <h3 className="compact-card-title">
            {t('card.fanarts')} #{index + 1}
          </h3>
        </div>
        <div className="compact-text-xs text-blue-400">
          {item.game}
        </div>
      </div>
      
      <div className="compact-card-content">
        <div className="space-y-2">
          {/* Image */}
          <div className="relative rounded-lg overflow-hidden bg-slate-800/30">
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="w-full h-24 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzNCI+PC9yZWN0Pjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5GYW5BcnQ8L3RleHQ+PC9zdmc+'
              }}
            />
          </div>
          
          <h4 className="compact-text-sm font-semibold text-slate-100 leading-tight line-clamp-1">
            {item.title}
          </h4>
          
          <div className="compact-text-xs text-slate-300">
            by {item.artist}
          </div>
          
          <div className="flex items-center justify-between compact-text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{item.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{item.views}</span>
              </div>
            </div>
            <span className="text-blue-400 font-medium">{t('common.details')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
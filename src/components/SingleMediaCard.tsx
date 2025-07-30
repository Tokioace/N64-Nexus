import React, { useState, useRef } from 'react'
import { Play } from 'lucide-react'
import { useLanguage, getLocaleString } from '../contexts/LanguageContext'

interface MediaItem {
  id: string
  title: string
  description: string
  type: 'speedrun' | 'screenshot' | 'achievement' | 'stream'
  uploader: string
  date: Date
  views: number
  likes: number
  verified: boolean
  game: string
  thumbnailUrl?: string
}

interface SingleMediaCardProps {
  mediaItems: MediaItem[]
  className?: string
}

const SingleMediaCard: React.FC<SingleMediaCardProps> = ({ mediaItems, className = '' }) => {
  const { t, currentLanguage } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('left')
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(getLocaleString(currentLanguage), {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const goToNext = () => {
    if (isFlipping || currentIndex >= mediaItems.length - 1) return
    
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'speedrun':
        return 'text-blue-400'
      case 'screenshot':
        return 'text-blue-300'
      case 'achievement':
        return 'text-blue-500'
      case 'stream':
        return 'text-blue-600'
      default:
        return 'text-slate-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'speedrun':
        return '⚡'
      case 'screenshot':
        return '📸'
      case 'achievement':
        return '🏆'
      case 'stream':
        return '📺'
      default:
        return '🎮'
    }
  }

  const getTypeTranslation = (type: string) => {
    switch (type) {
      case 'speedrun':
        return t('media.type.speedrun')
      case 'screenshot':
        return t('media.type.screenshot')
      case 'achievement':
        return t('media.type.achievement')
      case 'stream':
        return t('media.type.stream')
      default:
        return t('media.type.general')
    }
  }

  if (mediaItems.length === 0) {
    return (
      <div className={`${className} flex justify-center`}>
        <div className="compact-card">
          <div className="compact-card-header">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-blue-400" />
              <h3 className="compact-card-title">{t('card.media')}</h3>
            </div>
          </div>
          <div className="compact-card-content">
            <div className="flex items-center justify-center h-16 text-slate-400 compact-text-sm">
              {t('media.noMediaAvailable')}
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
              {flipDirection === 'left' && currentIndex < mediaItems.length - 1 && 
                <MediaCard
                  item={mediaItems[currentIndex + 1]}
                  index={currentIndex + 1}
                  isAnimating={false}
                />
              }
              {flipDirection === 'right' && currentIndex > 0 && 
                <MediaCard
                  item={mediaItems[currentIndex - 1]}
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
            <MediaCard
              item={mediaItems[currentIndex]}
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
            disabled={isFlipping || currentIndex >= mediaItems.length - 1}
            className={`pointer-events-auto w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-200 ${
              currentIndex >= mediaItems.length - 1 || isFlipping 
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
          {mediaItems.map((_, index) => (
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
            {currentIndex + 1} / {mediaItems.length}
          </span>
        </div>
      </div>
    </div>
  )
}

const MediaCard: React.FC<{ item: MediaItem; index: number; isAnimating?: boolean }> = ({ 
  item, 
  index, 
  isAnimating = false 
}) => {
  const { t, currentLanguage } = useLanguage()
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(getLocaleString(currentLanguage), {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'speedrun':
        return 'text-blue-400'
      case 'screenshot':
        return 'text-blue-300'
      case 'achievement':
        return 'text-blue-500'
      case 'stream':
        return 'text-blue-600'
      default:
        return 'text-slate-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'speedrun':
        return '⚡'
      case 'screenshot':
        return '📸'
      case 'achievement':
        return '🏆'
      case 'stream':
        return '📺'
      default:
        return '🎮'
    }
  }

  const getTypeTranslation = (type: string) => {
    switch (type) {
      case 'speedrun':
        return t('media.type.speedrun')
      case 'screenshot':
        return t('media.type.screenshot')
      case 'achievement':
        return t('media.type.achievement')
      case 'stream':
        return t('media.type.stream')
      default:
        return t('media.type.general')
    }
  }

  return (
    <div className={`compact-card transition-all duration-300 cursor-pointer ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
      <div className="compact-card-header">
        <div className="flex items-center gap-2">
          <Play className="w-3 h-3 text-blue-400" />
          <h3 className="compact-card-title">
            {t('media.content')} #{index + 1}
          </h3>
        </div>
        <div className="compact-text-xs flex items-center gap-1">
          <span>{getTypeIcon(item.type)}</span>
          <span className={getTypeColor(item.type)}>{getTypeTranslation(item.type)}</span>
        </div>
      </div>
      
      <div className="compact-card-content">
        <div className="space-y-2">
          {/* Thumbnail */}
          <div className="relative rounded-lg overflow-hidden bg-slate-800/30">
            {item.thumbnailUrl ? (
              <img 
                src={item.thumbnailUrl} 
                alt={item.title}
                className="w-full h-20 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzNCI+PC9yZWN0Pjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5NZWRpYTwvdGV4dD48L3N2Zz4='
                }}
              />
            ) : (
              <div className="w-full h-20 flex items-center justify-center">
                <Play className="w-6 h-6 text-slate-400" />
              </div>
            )}
            {item.verified && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-blue-400 rounded-full"></div>
            )}
          </div>
          
          <h4 className="compact-text-sm font-semibold text-slate-100 leading-tight line-clamp-1">
            {item.title}
          </h4>
          
          <p className="compact-text-xs text-slate-300 leading-relaxed line-clamp-2">
            {item.description}
          </p>
          
          <div className="compact-text-xs text-slate-400">
            by {item.uploader} • {item.game}
          </div>
          
          <div className="flex items-center justify-between compact-text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span>👁 {item.views}</span>
              <span>❤️ {item.likes}</span>
            </div>
            <span className="text-blue-400 font-medium">{formatTime(item.date)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleMediaCard
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
        return 'text-accent-green'
      case 'screenshot':
        return 'text-accent-blue'
      case 'achievement':
        return 'text-accent-yellow'
      case 'stream':
        return 'text-accent-purple'
      default:
        return 'text-text-muted'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'speedrun':
        return '🏃'
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
        return t('media.speedruns')
      case 'screenshot':
        return t('media.screenshots')
      case 'achievement':
        return t('media.achievements')
      case 'stream':
        return t('media.livestream')
      default:
        return t('media.type')
    }
  }

  if (mediaItems.length === 0) {
    return (
      <div className={`${className} flex justify-center`}>
        <div className="swipeable-card bg-gradient-to-br from-slate-600/20 to-slate-800/20 border-l-4 border-accent-green">
          <div className="swipeable-card-header">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-accent-green" />
              <h3 className="text-responsive-base font-bold text-slate-100">{t('card.media')}</h3>
            </div>
          </div>
          <div className="swipeable-card-content">
            <div className="flex items-center justify-center h-full text-slate-400 text-responsive-sm">
              {t('media.noMediaFound')}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentItem = mediaItems[currentIndex]

  return (
    <div className={`${className} flex justify-center`}>
      <div 
        className="relative book-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative overflow-hidden">
          {isFlipping && (
            <div className="absolute inset-0 z-10">
              {flipDirection === 'left' && currentIndex < mediaItems.length - 1 && 
                <div className="swipeable-card bg-gradient-to-br from-green-600/20 to-green-800/20 border-l-4 border-accent-green">
                  <div className="swipeable-card-header">
                    <div className="flex items-center gap-2">
                      <Play className="w-5 h-5 text-accent-green" />
                      <h3 className="text-responsive-base font-bold text-text-primary">{t('card.media')}</h3>
                    </div>
                    <div className="text-xs text-text-muted flex items-center gap-1">
                      <span className={getTypeColor(mediaItems[currentIndex + 1].type)}>
                        {getTypeIcon(mediaItems[currentIndex + 1].type)} {getTypeTranslation(mediaItems[currentIndex + 1].type)}
                      </span>
                      {mediaItems[currentIndex + 1].verified && (
                        <span className="text-accent-green">✓ {t('card.verified')}</span>
                      )}
                    </div>
                  </div>
                  <div className="swipeable-card-content">
                    <div className="p-4 h-full flex flex-col">
                      <div className="flex-1">
                        <h4 className="text-base sm:text-lg font-semibold text-text-primary mb-2 leading-tight">
                          {mediaItems[currentIndex + 1].title}
                        </h4>
                        <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                          {mediaItems[currentIndex + 1].description}
                        </p>
                        <div className="text-sm text-text-muted mb-2">
                          {mediaItems[currentIndex + 1].game}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-text-muted">
                          <span>👁 {mediaItems[currentIndex + 1].views.toLocaleString()}</span>
                          <span>❤ {mediaItems[currentIndex + 1].likes.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="border-t border-slate-600/30 pt-3 mt-auto">
                        <div className="flex items-center justify-between text-sm text-text-muted">
                          <span>{mediaItems[currentIndex + 1].uploader}</span>
                          <span className="font-medium">{formatTime(mediaItems[currentIndex + 1].date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              {flipDirection === 'right' && currentIndex > 0 && 
                <div className="swipeable-card bg-gradient-to-br from-green-600/20 to-green-800/20 border-l-4 border-accent-green">
                  <div className="swipeable-card-header">
                    <div className="flex items-center gap-2">
                      <Play className="w-5 h-5 text-accent-green" />
                      <h3 className="text-responsive-base font-bold text-text-primary">{t('card.media')}</h3>
                    </div>
                    <div className="text-xs text-text-muted flex items-center gap-1">
                      <span className={getTypeColor(mediaItems[currentIndex - 1].type)}>
                        {getTypeIcon(mediaItems[currentIndex - 1].type)} {getTypeTranslation(mediaItems[currentIndex - 1].type)}
                      </span>
                      {mediaItems[currentIndex - 1].verified && (
                        <span className="text-accent-green">✓ {t('card.verified')}</span>
                      )}
                    </div>
                  </div>
                  <div className="swipeable-card-content">
                    <div className="p-4 h-full flex flex-col">
                      <div className="flex-1">
                        <h4 className="text-base sm:text-lg font-semibold text-text-primary mb-2 leading-tight">
                          {mediaItems[currentIndex - 1].title}
                        </h4>
                        <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                          {mediaItems[currentIndex - 1].description}
                        </p>
                        <div className="text-sm text-text-muted mb-2">
                          {mediaItems[currentIndex - 1].game}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-text-muted">
                          <span>👁 {mediaItems[currentIndex - 1].views.toLocaleString()}</span>
                          <span>❤ {mediaItems[currentIndex - 1].likes.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="border-t border-slate-600/30 pt-3 mt-auto">
                        <div className="flex items-center justify-between text-sm text-text-muted">
                          <span>{mediaItems[currentIndex - 1].uploader}</span>
                          <span className="font-medium">{formatTime(mediaItems[currentIndex - 1].date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          )}
          
          <div 
            className={`relative z-20 transition-transform duration-200 ease-out ${
              isFlipping 
                ? flipDirection === 'left' 
                  ? 'transform -translate-x-full opacity-0' 
                  : 'transform translate-x-full opacity-0'
                : 'transform translate-x-0 opacity-100'
            }`}
          >
            <div className="swipeable-card bg-gradient-to-br from-green-600/20 to-green-800/20 border-l-4 border-accent-green">
              <div className="swipeable-card-header">
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-accent-green" />
                  <h3 className="text-responsive-base font-bold text-text-primary">{t('card.media')}</h3>
                </div>
                <div className="text-xs text-text-muted flex items-center gap-1">
                  <span className={getTypeColor(currentItem.type)}>
                    {getTypeIcon(currentItem.type)} {getTypeTranslation(currentItem.type)}
                  </span>
                  {currentItem.verified && (
                    <span className="text-accent-green">✓ {t('card.verified')}</span>
                  )}
                </div>
              </div>
              <div className="swipeable-card-content">
                <div className="p-4 h-full flex flex-col">
                  <div className="flex-1">
                    <h4 className="text-base sm:text-lg font-semibold text-text-primary mb-2 leading-tight">
                      {currentItem.title}
                    </h4>
                    <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                      {currentItem.description}
                    </p>
                    <div className="text-sm text-text-muted mb-2">
                      {currentItem.game}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-text-muted">
                      <span>👁 {currentItem.views.toLocaleString()}</span>
                      <span>❤ {currentItem.likes.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-600/30 pt-3 mt-auto">
                    <div className="flex items-center justify-between text-sm text-text-muted">
                      <span>{currentItem.uploader}</span>
                      <span className="font-medium">{formatTime(currentItem.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex justify-between pointer-events-none z-30">
          <button
            onClick={goToPrevious}
            disabled={isFlipping || currentIndex <= 0}
            className={`pointer-events-auto p-2 rounded-full bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white transition-all duration-200 ${
              currentIndex <= 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
            }`}
            aria-label={t('aria.previousCard')}
          >
            <span className="text-lg">‹</span>
          </button>
          
          <button
            onClick={goToNext}
            disabled={isFlipping || currentIndex >= mediaItems.length - 1}
            className={`pointer-events-auto p-2 rounded-full bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white transition-all duration-200 ${
              currentIndex >= mediaItems.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
            }`}
            aria-label={t('aria.nextCard')}
          >
            <span className="text-lg">›</span>
          </button>
        </div>
        
        <div className="flex justify-center mt-2 gap-1">
          {mediaItems.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex 
                  ? 'bg-green-400' 
                  : index < currentIndex
                  ? 'bg-slate-500'
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
        
        <div className="text-center mt-1 text-xs text-slate-400">
          {currentIndex + 1} {t('common.of')} {mediaItems.length}
        </div>
      </div>
    </div>
  )
}

export default SingleMediaCard
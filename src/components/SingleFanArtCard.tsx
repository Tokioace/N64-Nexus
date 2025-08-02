import React, { useState, useRef, useEffect } from 'react'
import { Palette, Heart, Eye, Image, Calendar } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useUser } from '../contexts/UserContext'
import { useNavigate } from 'react-router-dom'
import { InteractionBar } from './InteractionComponents'

interface FanArtItem {
  id: string
  title: string
  artist: string
  imageUrl: string
  likes: number
  views: number
  game: string
  createdAt?: Date
  likedBy?: string[] // Array of user IDs who liked this artwork
}

interface SingleFanArtCardProps {
  fanArtItems: FanArtItem[]
  className?: string
}

const SingleFanArtCard: React.FC<SingleFanArtCardProps> = ({ fanArtItems, className = '' }) => {
  const { t } = useLanguage()
  const { user, isAuthenticated } = useUser()
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('left')
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const goToNext = () => {
    if (isFlipping || currentIndex >= fanArtItems.length - 1) return
    
    setFlipDirection('right') // Changed from 'left' to 'right' for forward navigation
    setIsFlipping(true)
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      setIsFlipping(false)
    }, 200)
  }

  const goToPrevious = () => {
    if (isFlipping || currentIndex <= 0) return
    
    setFlipDirection('left') // Changed from 'right' to 'left' for backward navigation
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

  const handleCardClick = (item: FanArtItem) => {
    // Navigate to FanArt page and scroll to the specific post
    navigate('/fanart', { state: { highlightPostId: item.id } })
  }

  if (fanArtItems.length === 0) {
    return (
      <div className={`${className} flex justify-center`}>
        <div className="swipeable-card bg-gradient-to-br from-rose-600/10 to-pink-600/10 border-l-4 border-rose-400">
          <div className="swipeable-card-header">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-rose-400" />
              <h3 className="text-responsive-base font-bold text-slate-100">{t('card.fanarts')}</h3>
            </div>
          </div>
          <div className="swipeable-card-content">
            <div className="flex items-center justify-center h-full text-slate-400 text-responsive-sm">
              Keine FanArts verfügbar
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderFanArtCard = (item: FanArtItem, index: number, isAnimating: boolean = false) => (
    <div 
      className={`swipeable-card bg-gradient-to-br from-rose-600/10 to-pink-600/10 border-l-4 border-rose-400 relative transition-all duration-300 cursor-pointer hover:scale-105 ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}
      onClick={() => handleCardClick(item)}
    >
      <div className="swipeable-card-header">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-rose-400" />
          <h3 className="text-responsive-base font-bold text-slate-100">{t('card.fanarts')}</h3>
        </div>
        <div className="text-xs text-slate-400">
          <span className="text-rose-400">{item.game}</span>
        </div>
      </div>
      
      {/* Meta symbols in corner */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1">
        <div className="text-slate-400" title="Fan Art">
          <Image className="w-4 h-4" />
        </div>
        {item.createdAt && (
          <div className="text-slate-400" title={item.createdAt.toLocaleDateString()}>
            <Calendar className="w-4 h-4" />
          </div>
        )}
      </div>
      
      <div className="swipeable-card-content">
        <div className="p-3 h-full flex flex-col">
          <div className="flex-1 mb-2">
            {/* Display actual image */}
            <div className="w-full h-16 bg-slate-700 rounded mb-2 overflow-hidden">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.nextElementSibling?.classList.remove('hidden')
                  }}
                />
              ) : null}
              <div className={`w-full h-full flex items-center justify-center ${item.imageUrl ? 'hidden' : ''}`}>
                <Palette className="w-6 h-6 text-slate-400" />
              </div>
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-slate-100 mb-1 leading-tight">
              {item.title}
            </h4>
            <p className="text-xs text-blue-400 mb-1">{item.artist}</p>
            <p className="text-xs text-slate-400">{item.game}</p>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-auto">
            <div className="flex-1">
              <InteractionBar 
                contentType="fanart"
                contentId={item.id}
                showComments={false}
                compact={true}
              />
            </div>
            {item.createdAt && (
              <span className="text-xs">
                {item.createdAt.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className={`${className} flex justify-center`}>
      <div 
        className="relative book-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Direct slide transition without 180 degree rotation */}
        <div className="relative overflow-hidden">
          {/* Background card for smooth transition */}
          {isFlipping && (
            <div className="absolute inset-0 z-10">
              {flipDirection === 'right' && currentIndex < fanArtItems.length - 1 && 
                renderFanArtCard(fanArtItems[currentIndex + 1], currentIndex + 1, false)
              }
              {flipDirection === 'left' && currentIndex > 0 && 
                renderFanArtCard(fanArtItems[currentIndex - 1], currentIndex - 1, false)
              }
            </div>
          )}
          
          {/* Current card with slide animation */}
          <div 
            className={`relative z-20 transition-transform duration-200 ease-out ${
              isFlipping 
                ? flipDirection === 'right' 
                  ? 'transform translate-x-full opacity-0' // Move right when going forward
                  : 'transform -translate-x-full opacity-0' // Move left when going backward
                : 'transform translate-x-0 opacity-100'
            }`}
          >
            {renderFanArtCard(fanArtItems[currentIndex], currentIndex, false)}
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
            aria-label={t('aria.previousCard')}
          >
            <span className="text-lg">‹</span>
          </button>
          
          <button
            onClick={goToNext}
            disabled={isFlipping || currentIndex >= fanArtItems.length - 1}
            className={`pointer-events-auto p-2 rounded-full bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white transition-all duration-200 ${
              currentIndex >= fanArtItems.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
            }`}
            aria-label={t('aria.nextCard')}
          >
            <span className="text-lg">›</span>
          </button>
        </div>
        
        {/* Progress indicator */}
        <div className="flex justify-center mt-2 gap-1">
          {fanArtItems.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex 
                  ? 'bg-rose-400' 
                  : index < currentIndex
                  ? 'bg-slate-500'
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
        
        {/* Card counter */}
        <div className="text-center mt-1 text-xs text-slate-400">
          {currentIndex + 1} {t('common.of')} {fanArtItems.length}
        </div>
      </div>
    </div>
  )
}

export default SingleFanArtCard
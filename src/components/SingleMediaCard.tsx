import React, { useState, useRef } from 'react'
import { Camera, Eye, X } from 'lucide-react'

interface MediaItem {
  id: string
  title: string
  uploader: string
  type: 'video' | 'screenshot' | 'stream'
  thumbnailUrl: string
  uploadDate: Date
  views: number
}

interface SingleMediaCardProps {
  mediaItems: MediaItem[]
  className?: string
}

const SingleMediaCard: React.FC<SingleMediaCardProps> = ({ mediaItems, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('left')
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', {
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

  const renderMediaCard = (item: MediaItem, index: number, isAnimating: boolean = false) => (
    <div className={`swipeable-card bg-gradient-to-br from-green-600/10 to-emerald-600/10 border-l-4 border-green-400 relative transition-all duration-300 ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
      <div className="swipeable-card-header">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-green-400" />
          <h3 className="text-responsive-base font-bold text-slate-100">📹 Media</h3>
        </div>
        <div className="text-xs text-slate-400">
          <span className="capitalize text-green-400">{item.type}</span>
        </div>
      </div>
      
      <div className="swipeable-card-content">
        <div className="p-3 h-full flex flex-col">
          <div className="flex-1 mb-2">
            <div className="w-full h-16 bg-slate-700 rounded mb-2 flex items-center justify-center">
              <Camera className="w-6 h-6 text-slate-400" />
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-slate-100 mb-1 leading-tight">
              {item.title}
            </h4>
            <p className="text-xs text-green-400 mb-1">{item.uploader}</p>
            <p className="text-xs text-slate-400 capitalize">{item.type}</p>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-auto">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" /> {item.views}
            </span>
            <span>{formatTime(item.uploadDate)}</span>
          </div>
        </div>
      </div>
    </div>
  )

  if (mediaItems.length === 0) {
    return (
      <div className={`${className} flex justify-center`}>
        <div className="swipeable-card bg-gradient-to-br from-green-600/10 to-emerald-600/10 border-l-4 border-green-400">
          <div className="swipeable-card-header">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-green-400" />
              <h3 className="text-responsive-base font-bold text-slate-100">📹 Media</h3>
            </div>
          </div>
          <div className="swipeable-card-content">
            <div className="flex items-center justify-center h-full text-slate-400 text-responsive-sm">
              Keine Media verfügbar
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
        {/* Direct slide transition without 180 degree rotation */}
        <div className="relative overflow-hidden">
          {/* Background card for smooth transition */}
          {isFlipping && (
            <div className="absolute inset-0 z-10">
              {flipDirection === 'left' && currentIndex < mediaItems.length - 1 && 
                renderMediaCard(mediaItems[currentIndex + 1], currentIndex + 1, false)
              }
              {flipDirection === 'right' && currentIndex > 0 && 
                renderMediaCard(mediaItems[currentIndex - 1], currentIndex - 1, false)
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
            {renderMediaCard(mediaItems[currentIndex], currentIndex, false)}
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
            disabled={isFlipping || currentIndex >= mediaItems.length - 1}
            className={`pointer-events-auto p-2 rounded-full bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white transition-all duration-200 ${
              currentIndex >= mediaItems.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
            }`}
            aria-label="Next card"
          >
            <span className="text-lg">›</span>
          </button>
        </div>
        
        {/* Progress indicator */}
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
        
        {/* Card counter */}
        <div className="text-center mt-1 text-xs text-slate-400">
          {currentIndex + 1} von {mediaItems.length}
        </div>
      </div>
    </div>
  )
}

export default SingleMediaCard
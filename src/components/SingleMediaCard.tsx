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
    if (isAnimating || mediaItems.length === 0) return
    
    setIsAnimating(true)
    
    setTimeout(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1
        return nextIndex >= mediaItems.length ? 0 : nextIndex
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

  if (mediaItems.length === 0) {
    return (
      <div className={`${className} flex justify-center`}>
        <div className="swipeable-card bg-gradient-to-br from-green-600/10 to-emerald-600/10 border-l-4 border-green-400">
          <div className="swipeable-card-header">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-green-400" />
              <h3 className="text-responsive-base font-bold text-slate-100">📹 Medien</h3>
            </div>
          </div>
          <div className="swipeable-card-content">
            <div className="flex items-center justify-center h-full text-slate-400 text-responsive-sm">
              Keine Medien verfügbar
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
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`swipeable-card bg-gradient-to-br from-green-600/10 to-emerald-600/10 border-l-4 border-green-400 relative transition-all duration-300 ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 z-10 p-1 rounded-full bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white transition-colors"
            aria-label="Dismiss media"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="swipeable-card-header">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-green-400" />
              <h3 className="text-responsive-base font-bold text-slate-100">📹 Medien</h3>
            </div>
            <div className="text-xs text-slate-400">
              <span className="capitalize text-green-400">{currentItem.type}</span>
            </div>
          </div>
          
          <div className="swipeable-card-content">
            <div className="p-3 h-full flex flex-col">
              <div className="flex-1 mb-2">
                <div className="w-full h-16 bg-slate-700 rounded mb-2 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-slate-400" />
                </div>
                <h4 className="text-sm sm:text-base font-semibold text-slate-100 mb-1 leading-tight">
                  {currentItem.title}
                </h4>
                <p className="text-xs text-green-400 mb-1">{currentItem.uploader}</p>
                <p className="text-xs text-slate-400 capitalize">{currentItem.type}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 mt-auto">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {currentItem.views}
                </span>
                <span>{formatTime(currentItem.uploadDate)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="flex justify-center mt-2 gap-1">
          {mediaItems.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex 
                  ? 'bg-green-400' 
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
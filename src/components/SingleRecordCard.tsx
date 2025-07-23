import React, { useState, useRef } from 'react'
import { Trophy, X } from 'lucide-react'

interface RecordItem {
  id: string
  game: string
  track: string
  time: string
  username: string
  date: Date
  verified: boolean
}

interface SingleRecordCardProps {
  recordItems: RecordItem[]
  className?: string
}

const SingleRecordCard: React.FC<SingleRecordCardProps> = ({ recordItems, className = '' }) => {
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
    if (isFlipping || currentIndex >= recordItems.length - 1) return
    
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

  const renderRecordCard = (record: RecordItem, index: number, isAnimating: boolean = false) => (
    <div className={`swipeable-card bg-gradient-to-br from-yellow-600/10 to-orange-600/10 border-l-4 border-yellow-400 relative transition-all duration-300 ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
      <div className="swipeable-card-header">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="text-responsive-base font-bold text-slate-100">🏆 Records</h3>
        </div>
        <div className="text-xs text-slate-400">
          <span className="text-yellow-400">{record.game}</span>
        </div>
      </div>
      
      <div className="swipeable-card-content">
        <div className="p-3 h-full flex flex-col">
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <h4 className="text-sm sm:text-base font-semibold text-slate-100 leading-tight">{record.time}</h4>
            </div>
            <p className="text-xs text-slate-300 mb-1 leading-tight">{record.game}</p>
            <p className="text-xs text-slate-400 mb-2 leading-tight">{record.track}</p>
            <p className="text-xs text-blue-400">{record.username}</p>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-auto">
            <span>{formatTime(record.date)}</span>
            {record.verified && <span className="text-green-400">✓ Verifiziert</span>}
          </div>
        </div>
      </div>
    </div>
  )

  if (recordItems.length === 0) {
    return (
      <div className={`${className} flex justify-center`}>
        <div className="swipeable-card bg-gradient-to-br from-yellow-600/10 to-orange-600/10 border-l-4 border-yellow-400">
          <div className="swipeable-card-header">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h3 className="text-responsive-base font-bold text-slate-100">🏆 Records</h3>
            </div>
          </div>
          <div className="swipeable-card-content">
            <div className="flex items-center justify-center h-full text-slate-400 text-responsive-sm">
              Keine Records verfügbar
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
          {currentIndex < recordItems.length - 1 && (
            <div className="absolute inset-0 z-10">
              {renderRecordCard(recordItems[currentIndex + 1], currentIndex + 1, false)}
            </div>
          )}
          
          {/* Previous card (for right swipe) */}
          {currentIndex > 0 && flipDirection === 'right' && isFlipping && (
            <div className="absolute inset-0 z-10">
              {renderRecordCard(recordItems[currentIndex - 1], currentIndex - 1, false)}
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
            {renderRecordCard(recordItems[currentIndex], currentIndex, isFlipping)}
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
            disabled={isFlipping || currentIndex >= recordItems.length - 1}
            className={`pointer-events-auto p-2 rounded-full bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white transition-all duration-200 ${
              currentIndex >= recordItems.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
            }`}
            aria-label="Next card"
          >
            <span className="text-lg">›</span>
          </button>
        </div>
        
        {/* Progress indicator */}
        <div className="flex justify-center mt-2 gap-1">
          {recordItems.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex 
                  ? 'bg-yellow-400' 
                  : index < currentIndex
                  ? 'bg-slate-500'
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
        
        {/* Card counter */}
        <div className="text-center mt-1 text-xs text-slate-400">
          {currentIndex + 1} von {recordItems.length}
        </div>
      </div>
    </div>
  )
}

export default SingleRecordCard
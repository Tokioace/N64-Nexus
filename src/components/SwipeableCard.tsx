import React, { useState, useRef, useEffect } from 'react'

interface SwipeableCardProps {
  title: string
  icon: React.ReactNode
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
  className?: string
  gradientColors?: string
  borderColor?: string
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  title,
  icon,
  items,
  renderItem,
  className = '',
  gradientColors = 'from-slate-600/20 to-slate-800/20',
  borderColor = 'border-slate-400'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [messageText, setMessageText] = useState('')
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const maxItems = Math.min(items.length, 10) // Limit to 10 items as requested
  const displayItems = items.slice(0, maxItems)

  const showSwipeMessage = (direction: 'next' | 'prev') => {
    const messages = {
      next: [
        '✨ Nächste Karte wird geladen...',
        '🎮 Hier kommt die nächste!',
        '🚀 Weiter geht\'s!',
        '📱 Swipe erfolgreich!',
        '🎯 Neue Inhalte entdecken!',
        '⭐ Mehr davon!',
        '🔥 Keep swiping!',
        '💫 Nächster Inhalt!'
      ],
      prev: [
        '⬅️ Zurück zur vorherigen Karte',
        '🔄 Rückwärts navigiert!',
        '📍 Vorherige Karte geladen',
        '↩️ Zurück geswipet!',
        '🎮 Rückwärts!',
        '⏪ Previous content!',
        '🔙 Zurück!',
        '📱 Rückwärts-Swipe!'
      ]
    }
    
    const messageArray = messages[direction]
    const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)]
    
    setMessageText(randomMessage)
    setShowMessage(true)
    
    // Hide message after 2 seconds
    setTimeout(() => {
      setShowMessage(false)
    }, 2000)
  }

  const nextItem = () => {
    if (isTransitioning || displayItems.length <= 1) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % displayItems.length)
    showSwipeMessage('next')
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const prevItem = () => {
    if (isTransitioning || displayItems.length <= 1) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length)
    showSwipeMessage('prev')
    setTimeout(() => setIsTransitioning(false), 300)
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
      nextItem()
    } else if (isRightSwipe) {
      prevItem()
    }

    touchStartX.current = 0
    touchEndX.current = 0
  }

  // Remove auto-advance functionality - commented out
  // useEffect(() => {
  //   if (displayItems.length <= 1) return
  //   
  //   const interval = setInterval(() => {
  //     if (!isTransitioning) {
  //       nextItem()
  //     }
  //   }, 10000)
  //
  //   return () => clearInterval(interval)
  // }, [currentIndex, isTransitioning, displayItems.length])

  if (displayItems.length === 0) {
    return (
      <div className={`swipeable-card ${className} bg-gradient-to-br ${gradientColors} border-l-4 ${borderColor}`}>
        <div className="swipeable-card-header">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-responsive-base font-bold text-slate-100">{title}</h3>
          </div>
        </div>
        <div className="swipeable-card-content">
          <div className="flex items-center justify-center h-full text-slate-400 text-responsive-sm">
            Keine Inhalte verfügbar
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`swipeable-card ${className} bg-gradient-to-br ${gradientColors} border-l-4 ${borderColor} relative`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={containerRef}
    >
      <div className="swipeable-card-header">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-responsive-base font-bold text-slate-100">{title}</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>{currentIndex + 1} / {displayItems.length}</span>
          <div className="flex gap-1">
            <button 
              onClick={prevItem}
              disabled={isTransitioning}
              className="swipe-button text-xs px-2 py-1"
            >
              ←
            </button>
            <button 
              onClick={nextItem}
              disabled={isTransitioning}
              className="swipe-button text-xs px-2 py-1"
            >
              →
            </button>
          </div>
        </div>
      </div>
      
      <div className="swipeable-card-content">
        <div 
          className={`swipeable-item-container ${isTransitioning ? 'transitioning' : ''}`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {displayItems.map((item, index) => (
            <div key={index} className="swipeable-item">
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>

      {/* Swipe Message Overlay */}
      {showMessage && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 transition-opacity duration-300">
          <div className="bg-slate-800/90 border border-slate-600 rounded-lg px-4 py-3 text-center backdrop-blur-sm">
            <p className="text-slate-100 text-sm font-medium">{messageText}</p>
          </div>
        </div>
      )}

      {/* Swipe indicator dots */}
      <div className="swipeable-card-dots">
        {displayItems.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true)
                setCurrentIndex(index)
                showSwipeMessage(index > currentIndex ? 'next' : 'prev')
                setTimeout(() => setIsTransitioning(false), 300)
              }
            }}
            className={`swipe-dot ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

export default SwipeableCard
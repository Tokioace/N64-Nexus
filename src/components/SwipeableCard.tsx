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
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const maxItems = Math.min(items.length, 10) // Limit to 10 items as requested
  const displayItems = items.slice(0, maxItems)

  const nextItem = () => {
    if (isTransitioning || displayItems.length <= 1) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % displayItems.length)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const prevItem = () => {
    if (isTransitioning || displayItems.length <= 1) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length)
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
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${displayItems.length * 100}%`
          }}
        >
          {displayItems.map((item, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 h-full p-2 sm:p-3 overflow-hidden"
              style={{ width: `${100 / displayItems.length}%` }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>

      {/* Swipe indicator dots */}
      <div className="swipeable-card-dots">
        {displayItems.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true)
                setCurrentIndex(index)
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
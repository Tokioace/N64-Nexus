import React, { useState, useRef } from 'react'
import { ShoppingCart, X } from 'lucide-react'

interface MarketplaceItem {
  id: string
  title: string
  price: number
  currency: string
  seller: string
  condition: string
  imageUrl: string
  createdAt: Date
}

interface SingleMarketplaceCardProps {
  marketplaceItems: MarketplaceItem[]
  className?: string
}

const SingleMarketplaceCard: React.FC<SingleMarketplaceCardProps> = ({ marketplaceItems, className = '' }) => {
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
    if (isAnimating || marketplaceItems.length === 0) return
    
    setIsAnimating(true)
    
    setTimeout(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1
        return nextIndex >= marketplaceItems.length ? 0 : nextIndex
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

  if (marketplaceItems.length === 0) {
    return (
      <div className={`${className} flex justify-center`}>
        <div className="swipeable-card bg-gradient-to-br from-emerald-600/10 to-green-600/10 border-l-4 border-emerald-400">
          <div className="swipeable-card-header">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-400" />
              <h3 className="text-responsive-base font-bold text-slate-100">🛒 Marktplatz</h3>
            </div>
          </div>
          <div className="swipeable-card-content">
            <div className="flex items-center justify-center h-full text-slate-400 text-responsive-sm">
              Keine Marktplatz Items verfügbar
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentItem = marketplaceItems[currentIndex]

  return (
    <div className={`${className} flex justify-center`}>
      <div 
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`swipeable-card bg-gradient-to-br from-emerald-600/10 to-green-600/10 border-l-4 border-emerald-400 relative transition-all duration-300 ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 z-10 p-1 rounded-full bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white transition-colors"
            aria-label="Dismiss marketplace item"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="swipeable-card-header">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-400" />
              <h3 className="text-responsive-base font-bold text-slate-100">🛒 Marktplatz</h3>
            </div>
            <div className="text-xs text-slate-400">
              <span className="text-emerald-400">{currentItem.condition}</span>
            </div>
          </div>
          
          <div className="swipeable-card-content">
            <div className="p-3 h-full flex flex-col">
              <div className="flex-1 mb-2">
                <div className="w-full h-16 bg-slate-700 rounded mb-2 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-slate-400" />
                </div>
                <h4 className="text-sm sm:text-base font-semibold text-slate-100 mb-1 leading-tight">
                  {currentItem.title}
                </h4>
                <p className="text-xs text-green-400 mb-1">{currentItem.price} {currentItem.currency}</p>
                <p className="text-xs text-slate-400 mb-1">{currentItem.condition}</p>
                <p className="text-xs text-blue-400">{currentItem.seller}</p>
              </div>
              <div className="text-xs text-slate-400 mt-auto">
                <span>{formatTime(currentItem.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="flex justify-center mt-2 gap-1">
          {marketplaceItems.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex 
                  ? 'bg-emerald-400' 
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
        
        {/* Card counter */}
        <div className="text-center mt-1 text-xs text-slate-400">
          {currentIndex + 1} von {marketplaceItems.length}
        </div>
      </div>
    </div>
  )
}

export default SingleMarketplaceCard
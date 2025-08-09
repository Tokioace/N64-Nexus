import React, { useState, useRef, useEffect } from 'react'
import { ShoppingBag, Star, Package } from 'lucide-react'
import { useLanguage, getLocaleString } from '../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'

interface MarketplaceItem {
  id: string
  title: string
  description: string
  price: number
  condition: string
  seller: string | {
    id: string
    name: string
    rating: number
    verified: boolean
  }
  date: Date
  image?: string
  images?: string[]
  category: string
}

interface SingleMarketplaceCardProps {
  marketplaceItems: MarketplaceItem[]
  className?: string
}

const SingleMarketplaceCard: React.FC<SingleMarketplaceCardProps> = ({ marketplaceItems, className = '' }) => {
  const { t, currentLanguage } = useLanguage()
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('left')
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  // 🔧 FIX: Reset currentIndex when marketplaceItems changes or becomes invalid
  useEffect(() => {
    if (!marketplaceItems || !Array.isArray(marketplaceItems) || marketplaceItems.length === 0) {
      setCurrentIndex(0)
      return
    }
    
    // If currentIndex is out of bounds, reset to 0
    if (currentIndex >= marketplaceItems.length) {
      console.log('🔧 SingleMarketplaceCard: Resetting currentIndex from', currentIndex, 'to 0 (items:', marketplaceItems.length, ')')
      setCurrentIndex(0)
    }
  }, [marketplaceItems, currentIndex])

  // 🔧 FIX: Add defensive checks for all array access
  const isValidIndex = (index: number): boolean => {
    return marketplaceItems && 
           Array.isArray(marketplaceItems) && 
           marketplaceItems.length > 0 && 
           index >= 0 && 
           index < marketplaceItems.length &&
           marketplaceItems[index] &&
           typeof marketplaceItems[index] === 'object'
  }

  const formatTime = (date: Date) => {
    try {
      return date.toLocaleTimeString(getLocaleString(currentLanguage), {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.warn('Error formatting time:', error)
      return '--:--'
    }
  }

  const goToNext = () => {
    if (isFlipping || !isValidIndex(currentIndex) || currentIndex >= marketplaceItems.length - 1) return
    
    setFlipDirection('left')
    setIsFlipping(true)
    
    setTimeout(() => {
      setCurrentIndex(prev => {
        const nextIndex = prev + 1
        // Double-check the next index is valid
        if (isValidIndex(nextIndex)) {
          return nextIndex
        }
        return prev // Stay at current index if next is invalid
      })
      setIsFlipping(false)
    }, 200)
  }

  const goToPrev = () => {
    if (isFlipping || currentIndex <= 0) return
    
    setFlipDirection('right')
    setIsFlipping(true)
    
    setTimeout(() => {
      setCurrentIndex(prev => {
        const prevIndex = prev - 1
        // Double-check the previous index is valid
        if (isValidIndex(prevIndex)) {
          return prevIndex
        }
        return prev // Stay at current index if previous is invalid
      })
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
    }
    if (isRightSwipe) {
      goToPrev()
    }
  }

  // 🔧 FIX: Enhanced validation for empty or invalid data
  if (!marketplaceItems || !Array.isArray(marketplaceItems) || marketplaceItems.length === 0) {
    return (
      <div className={`${className} flex justify-center`}>
        <div className="simple-tile bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-l-4 border-accent-purple p-6 text-center max-w-md">
          <ShoppingBag className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">
            {t('marketplace.noItems')}
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            {t('marketplace.noItemsDesc')}
          </p>
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            {t('marketplace.browse')}
          </button>
        </div>
      </div>
    )
  }

  // 🔧 FIX: Additional validation before accessing current item
  if (!isValidIndex(currentIndex)) {
    console.warn('🚨 SingleMarketplaceCard: Invalid currentIndex:', currentIndex, 'items:', marketplaceItems.length)
    // Force reset to 0 and return loading state
    setCurrentIndex(0)
    return (
      <div className={`${className} flex justify-center`}>
        <div className="simple-tile bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-l-4 border-accent-purple p-6 text-center max-w-md">
          <div className="animate-pulse">
            <div className="w-12 h-12 bg-purple-600 rounded mx-auto mb-3"></div>
            <div className="h-4 bg-slate-600 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  const currentItem = marketplaceItems[currentIndex]
  const itemImage = currentItem?.images?.[0] || currentItem?.image

  return (
    <div className={`${className} flex justify-center`}>
      <div 
        className="swipeable-card bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-l-4 border-accent-purple relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative overflow-hidden">
          {/* Flip Animation Overlay */}
          {isFlipping && (
            <div className="absolute inset-0 z-10">
              {/* 🔧 FIX: Add bounds checking for flip animation */}
              {flipDirection === 'left' && isValidIndex(currentIndex + 1) && 
                <div className="swipeable-card bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-l-4 border-accent-purple">
                  <div className="swipeable-card-header">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <ShoppingBag className="w-5 h-5 text-purple-400" />
                        <span className="text-purple-300 font-medium text-sm">
                          {t('marketplace.title')}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {formatTime(marketplaceItems[currentIndex + 1].date)}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex-1">
                        {/* Image for next item */}
                        {(marketplaceItems[currentIndex + 1]?.images?.[0] || marketplaceItems[currentIndex + 1]?.image) && (
                          <div className="w-full h-12 bg-slate-700 rounded mb-2 overflow-hidden">
                            <img 
                              src={marketplaceItems[currentIndex + 1].images?.[0] || marketplaceItems[currentIndex + 1].image} 
                              alt={marketplaceItems[currentIndex + 1]?.title || 'Marketplace item'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                        <h4 className="text-slate-100 font-semibold text-sm mb-1 line-clamp-2">
                          {marketplaceItems[currentIndex + 1]?.title || 'Unknown Item'}
                        </h4>
                        <p className="text-slate-300 text-xs mb-2 line-clamp-2">
                          {marketplaceItems[currentIndex + 1]?.description || ''}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-purple-300 font-bold text-sm">
                            €{marketplaceItems[currentIndex + 1]?.price?.toFixed(2) || '0.00'}
                          </span>
                          <span className="text-xs text-slate-400">
                            {marketplaceItems[currentIndex + 1]?.condition || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              
              {flipDirection === 'right' && isValidIndex(currentIndex - 1) && 
                <div className="swipeable-card bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-l-4 border-accent-purple">
                  <div className="swipeable-card-header">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <ShoppingBag className="w-5 h-5 text-purple-400" />
                        <span className="text-purple-300 font-medium text-sm">
                          {t('marketplace.title')}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {formatTime(marketplaceItems[currentIndex - 1].date)}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex-1">
                        {/* Image for previous item */}
                        {(marketplaceItems[currentIndex - 1]?.images?.[0] || marketplaceItems[currentIndex - 1]?.image) && (
                          <div className="w-full h-12 bg-slate-700 rounded mb-2 overflow-hidden">
                            <img 
                              src={marketplaceItems[currentIndex - 1].images?.[0] || marketplaceItems[currentIndex - 1].image} 
                              alt={marketplaceItems[currentIndex - 1]?.title || 'Marketplace item'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                              }}
                            />
                          </div>
                        )}
                        <h4 className="text-slate-100 font-semibold text-sm mb-1 line-clamp-2">
                          {marketplaceItems[currentIndex - 1]?.title || 'Unknown Item'}
                        </h4>
                        <p className="text-slate-300 text-xs mb-2 line-clamp-2">
                          {marketplaceItems[currentIndex - 1]?.description || ''}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-purple-300 font-bold text-sm">
                            €{marketplaceItems[currentIndex - 1]?.price?.toFixed(2) || '0.00'}
                          </span>
                          <span className="text-xs text-slate-400">
                            {marketplaceItems[currentIndex - 1]?.condition || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          )}

          {/* Main Card Content */}
          <div className="swipeable-card-header">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 font-medium text-sm">
                  {t('marketplace.title')}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {formatTime(currentItem.date)}
              </span>
            </div>
            
            <div className="mt-3">
              <div className="flex-1">
                {/* Item Image */}
                {itemImage && (
                  <div className="w-full h-32 bg-slate-700 rounded mb-3 overflow-hidden">
                    <img 
                      src={itemImage} 
                      alt={currentItem.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                
                <h4 className="text-slate-100 font-semibold text-base mb-2 line-clamp-2">
                  {currentItem.title}
                </h4>
                
                <p className="text-slate-300 text-sm mb-3 line-clamp-3">
                  {currentItem.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-purple-300 font-bold text-lg">
                    €{currentItem.price.toFixed(2)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
                      {currentItem.condition}
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
                      {currentItem.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {typeof currentItem.seller === 'string' 
                          ? currentItem.seller.charAt(0).toUpperCase()
                          : currentItem.seller.name.charAt(0).toUpperCase()
                        }
                      </span>
                    </div>
                    <span className="text-slate-300 text-sm">
                      {typeof currentItem.seller === 'string' 
                        ? currentItem.seller
                        : currentItem.seller.name
                      }
                    </span>
                  </div>
                  
                  <button
                    onClick={() => navigate('/marketplace')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs transition-colors duration-200"
                  >
                    {t('common.viewMore')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-4 px-4">
          <button
            onClick={goToPrev}
            disabled={isFlipping || currentIndex <= 0}
            className={`pointer-events-auto p-2 rounded-full bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white transition-all duration-200 ${
              currentIndex <= 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
            }`}
            aria-label={t('aria.prevCard')}
          >
            <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            disabled={isFlipping || !isValidIndex(currentIndex) || currentIndex >= marketplaceItems.length - 1}
            className={`pointer-events-auto p-2 rounded-full bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white transition-all duration-200 ${
              currentIndex >= marketplaceItems.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
            }`}
            aria-label={t('aria.nextCard')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="text-center mt-1 text-xs text-slate-400">
          {currentIndex + 1} {t('common.of')} {marketplaceItems.length}
        </div>
      </div>
    </div>
  )
}

export default SingleMarketplaceCard
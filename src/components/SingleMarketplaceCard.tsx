import React, { useState, useRef } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useLanguage, getLocaleString } from '../contexts/LanguageContext'

interface MarketplaceItem {
  id: string
  title: string
  description: string
  price: number
  condition: string
  seller: string
  date: Date
  image?: string
  category: string
}

interface SingleMarketplaceCardProps {
  marketplaceItems: MarketplaceItem[]
  className?: string
}

const SingleMarketplaceCard: React.FC<SingleMarketplaceCardProps> = ({ marketplaceItems, className = '' }) => {
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
    if (isFlipping || currentIndex >= marketplaceItems.length - 1) return
    
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

  if (marketplaceItems.length === 0) {
    return (
      <div className={`${className} flex justify-center`}>
        <div className="swipeable-card bg-gradient-to-br from-slate-600/20 to-slate-800/20 border-l-4 border-accent-purple">
          <div className="swipeable-card-header">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-accent-purple" />
              <h3 className="text-responsive-base font-bold text-slate-100">{t('card.marketplace')}</h3>
            </div>
          </div>
          <div className="swipeable-card-content">
            <div className="flex items-center justify-center h-full text-slate-400 text-responsive-sm">
              {t('marketplace.noOffersFound')}
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
        className="relative book-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative overflow-hidden">
          {isFlipping && (
            <div className="absolute inset-0 z-10">
              {flipDirection === 'left' && currentIndex < marketplaceItems.length - 1 && 
                <div className="swipeable-card bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-l-4 border-accent-purple">
                  <div className="swipeable-card-header">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-accent-purple" />
                      <h3 className="text-responsive-base font-bold text-text-primary">{t('card.marketplace')}</h3>
                    </div>
                    <div className="text-xs text-text-muted">
                      {marketplaceItems[currentIndex + 1].category}
                    </div>
                  </div>
                  <div className="swipeable-card-content">
                    <div className="p-4 h-full flex flex-col">
                      <div className="flex-1">
                        <h4 className="text-base sm:text-lg font-semibold text-text-primary mb-2 leading-tight">
                          {marketplaceItems[currentIndex + 1].title}
                        </h4>
                        <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                          {marketplaceItems[currentIndex + 1].description}
                        </p>
                        <div className="text-xl font-bold text-accent-purple mb-2">
                          €{marketplaceItems[currentIndex + 1].price.toFixed(2)}
                        </div>
                        <div className="text-sm text-text-muted mb-2">
                          {marketplaceItems[currentIndex + 1].condition}
                        </div>
                      </div>
                      <div className="border-t border-slate-600/30 pt-3 mt-auto">
                        <div className="flex items-center justify-between text-sm text-text-muted">
                          <span>{marketplaceItems[currentIndex + 1].seller}</span>
                          <span className="font-medium">{formatTime(marketplaceItems[currentIndex + 1].date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              {flipDirection === 'right' && currentIndex > 0 && 
                <div className="swipeable-card bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-l-4 border-accent-purple">
                  <div className="swipeable-card-header">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-accent-purple" />
                      <h3 className="text-responsive-base font-bold text-text-primary">{t('card.marketplace')}</h3>
                    </div>
                    <div className="text-xs text-text-muted">
                      {marketplaceItems[currentIndex - 1].category}
                    </div>
                  </div>
                  <div className="swipeable-card-content">
                    <div className="p-4 h-full flex flex-col">
                      <div className="flex-1">
                        <h4 className="text-base sm:text-lg font-semibold text-text-primary mb-2 leading-tight">
                          {marketplaceItems[currentIndex - 1].title}
                        </h4>
                        <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                          {marketplaceItems[currentIndex - 1].description}
                        </p>
                        <div className="text-xl font-bold text-accent-purple mb-2">
                          €{marketplaceItems[currentIndex - 1].price.toFixed(2)}
                        </div>
                        <div className="text-sm text-text-muted mb-2">
                          {marketplaceItems[currentIndex - 1].condition}
                        </div>
                      </div>
                      <div className="border-t border-slate-600/30 pt-3 mt-auto">
                        <div className="flex items-center justify-between text-sm text-text-muted">
                          <span>{marketplaceItems[currentIndex - 1].seller}</span>
                          <span className="font-medium">{formatTime(marketplaceItems[currentIndex - 1].date)}</span>
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
            <div className="swipeable-card bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-l-4 border-accent-purple">
              <div className="swipeable-card-header">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-accent-purple" />
                  <h3 className="text-responsive-base font-bold text-text-primary">{t('card.marketplace')}</h3>
                </div>
                <div className="text-xs text-text-muted">
                  {currentItem.category}
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
                    <div className="text-xl font-bold text-accent-purple mb-2">
                      €{currentItem.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-text-muted mb-2">
                      {currentItem.condition}
                    </div>
                  </div>
                  <div className="border-t border-slate-600/30 pt-3 mt-auto">
                    <div className="flex items-center justify-between text-sm text-text-muted">
                      <span>{currentItem.seller}</span>
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
            disabled={isFlipping || currentIndex >= marketplaceItems.length - 1}
            className={`pointer-events-auto p-2 rounded-full bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white transition-all duration-200 ${
              currentIndex >= marketplaceItems.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
            }`}
            aria-label={t('aria.nextCard')}
          >
            <span className="text-lg">›</span>
          </button>
        </div>
        
        <div className="flex justify-center mt-2 gap-1">
          {marketplaceItems.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex 
                  ? 'bg-purple-400' 
                  : index < currentIndex
                  ? 'bg-slate-500'
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
        
        <div className="text-center mt-1 text-xs text-slate-400">
          {currentIndex + 1} {t('common.of')} {marketplaceItems.length}
        </div>
      </div>
    </div>
  )
}

export default SingleMarketplaceCard
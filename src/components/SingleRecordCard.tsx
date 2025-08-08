import React, { useState, useRef } from 'react'
import { Trophy, Monitor, Gamepad2 } from 'lucide-react'
import { useLanguage, getLocaleString } from '../contexts/LanguageContext'

interface PersonalRecord {
  id: string
  game: string
  category: string
  time?: string
  score?: number
  date: Date
  verified: boolean
  platform: string
}

interface SingleRecordCardProps {
  personalRecords: PersonalRecord[]
  className?: string
}

const SingleRecordCard: React.FC<SingleRecordCardProps> = ({ personalRecords, className = '' }) => {
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
    if (isFlipping || currentIndex >= personalRecords.length - 1) return
    
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

  if (personalRecords.length === 0) {
    return (
      <div className={`${className} flex justify-center`}>
        <div className="swipeable-card bg-gradient-to-br from-slate-600/20 to-slate-800/20 border-l-4 border-accent-yellow">
          <div className="swipeable-card-header">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent-yellow" />
              <h3 className="text-responsive-base font-bold text-slate-100">{t('card.records')}</h3>
            </div>
          </div>
          <div className="swipeable-card-content">
            <div className="flex items-center justify-center h-full text-slate-400 text-responsive-sm">
              {t('card.noRecords')}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentRecord = personalRecords[currentIndex]

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
              {flipDirection === 'left' && currentIndex < personalRecords.length - 1 && 
                <div className="swipeable-card bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-l-4 border-accent-yellow">
                  <div className="swipeable-card-header">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-accent-yellow" />
                      <h3 className="text-responsive-base font-bold text-text-primary">{t('card.records')}</h3>
                    </div>
                    <div className="text-xs text-text-muted">
                      <span>{personalRecords[currentIndex + 1].platform}</span>
                    </div>
                  </div>
                  <div className="swipeable-card-content">
                    <div className="p-4 h-full flex flex-col">
                      <div className="flex-1">
                        <h4 className="text-base sm:text-lg font-semibold text-text-primary mb-2 leading-tight">
                          {personalRecords[currentIndex + 1].game}
                        </h4>
                        <p className="text-sm text-text-secondary mb-3">
                          {personalRecords[currentIndex + 1].category}
                        </p>
                        <div className="text-2xl font-bold text-accent-yellow mb-2">
                          {personalRecords[currentIndex + 1].time || personalRecords[currentIndex + 1].score?.toLocaleString()}
                        </div>
                      </div>
                      <div className="border-t border-slate-600/30 pt-3 mt-auto">
                        <div className="flex items-center justify-between text-sm text-text-muted">
                          <span>{personalRecords[currentIndex + 1].platform}</span>
                          <span className="font-medium">{formatTime(personalRecords[currentIndex + 1].date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
              {flipDirection === 'right' && currentIndex > 0 && 
                <div className="swipeable-card bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-l-4 border-accent-yellow">
                  <div className="swipeable-card-header">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-accent-yellow" />
                      <h3 className="text-responsive-base font-bold text-text-primary">{t('card.records')}</h3>
                    </div>
                    <div className="text-xs text-text-muted">
                      <span>{personalRecords[currentIndex - 1].platform}</span>
                    </div>
                  </div>
                  <div className="swipeable-card-content">
                    <div className="p-4 h-full flex flex-col">
                      <div className="flex-1">
                        <h4 className="text-base sm:text-lg font-semibold text-text-primary mb-2 leading-tight">
                          {personalRecords[currentIndex - 1].game}
                        </h4>
                        <p className="text-sm text-text-secondary mb-3">
                          {personalRecords[currentIndex - 1].category}
                        </p>
                        <div className="text-2xl font-bold text-accent-yellow mb-2">
                          {personalRecords[currentIndex - 1].time || personalRecords[currentIndex - 1].score?.toLocaleString()}
                        </div>
                      </div>
                      <div className="border-t border-slate-600/30 pt-3 mt-auto">
                        <div className="flex items-center justify-between text-sm text-text-muted">
                          <span>{personalRecords[currentIndex - 1].platform}</span>
                          <span className="font-medium">{formatTime(personalRecords[currentIndex - 1].date)}</span>
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
            <div className="swipeable-card bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-l-4 border-accent-yellow relative">
              <div className="swipeable-card-header">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent-yellow" />
                  <h3 className="text-responsive-base font-bold text-text-primary">{t('card.records')}</h3>
                </div>
                <div className="text-xs text-text-muted">
                  <span>{currentRecord.platform}</span>
                </div>
              </div>
              
              {/* Meta symbols in corner */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1">
                {currentRecord.verified && (
                  <div className="w-4 h-4 bg-green-400 rounded-full" title={t('card.verified')}></div>
                )}
                <div className="text-slate-400" title={currentRecord.platform}>
                  {currentRecord.platform.toLowerCase().includes('pc') || currentRecord.platform.toLowerCase().includes('computer') ? 
                    <Monitor className="w-4 h-4" /> : 
                    <Gamepad2 className="w-4 h-4" />
                  }
                </div>
              </div>
              <div className="swipeable-card-content">
                <div className="p-4 h-full flex flex-col">
                  <div className="flex-1">
                    <h4 className="text-base sm:text-lg font-semibold text-text-primary mb-2 leading-tight">
                      {currentRecord.game}
                    </h4>
                    <p className="text-sm text-text-secondary mb-3">
                      {currentRecord.category}
                    </p>
                    <div className="text-2xl font-bold text-accent-yellow mb-2">
                      {currentRecord.time || currentRecord.score?.toLocaleString()}
                    </div>
                  </div>
                  <div className="border-t border-slate-600/30 pt-3 mt-auto">
                    <div className="flex items-center justify-between text-sm text-text-muted">
                      <span>{currentRecord.platform}</span>
                      <span className="font-medium">{formatTime(currentRecord.date)}</span>
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
            disabled={isFlipping || currentIndex >= personalRecords.length - 1}
            className={`pointer-events-auto p-2 rounded-full bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white transition-all duration-200 ${
              currentIndex >= personalRecords.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
            }`}
            aria-label={t('aria.nextCard')}
          >
            <span className="text-lg">›</span>
          </button>
        </div>
        
        <div className="flex justify-center mt-2 gap-1">
          {personalRecords.map((_, index) => (
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
        
        <div className="text-center mt-1 text-xs text-slate-400">
          {currentIndex + 1} {t('common.of')} {personalRecords.length}
        </div>
      </div>
    </div>
  )
}

export default SingleRecordCard
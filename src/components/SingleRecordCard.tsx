import React, { useState, useRef, useEffect } from 'react'
import { Trophy, Clock, Calendar, CheckCircle } from 'lucide-react'
import { useLanguage, getLocaleString } from '../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'

interface PersonalRecord {
  id: string
  game: string
  category: string
  time: string
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
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [, setFlipDirection] = useState<'left' | 'right'>('left')
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  // 🔧 FIX: Reset currentIndex when personalRecords changes or becomes invalid
  useEffect(() => {
    if (!personalRecords || !Array.isArray(personalRecords) || personalRecords.length === 0) {
      setCurrentIndex(0)
      return
    }
    
    // If currentIndex is out of bounds, reset to 0
    if (currentIndex >= personalRecords.length) {
      console.log('🔧 SingleRecordCard: Resetting currentIndex from', currentIndex, 'to 0 (items:', personalRecords.length, ')')
      setCurrentIndex(0)
    }
  }, [personalRecords, currentIndex])

  // 🔧 FIX: Add defensive checks for all array access
  const isValidIndex = (index: number): boolean => {
    return personalRecords && 
           Array.isArray(personalRecords) && 
           personalRecords.length > 0 && 
           index >= 0 && 
           index < personalRecords.length &&
           personalRecords[index] &&
           typeof personalRecords[index] === 'object'
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
    if (isFlipping || !isValidIndex(currentIndex) || currentIndex >= personalRecords.length - 1) return
    
    setFlipDirection('left')
    setIsFlipping(true)
    
    setTimeout(() => {
      setCurrentIndex(prev => {
        const nextIndex = prev + 1
        if (isValidIndex(nextIndex)) {
          return nextIndex
        }
        return prev
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
        if (isValidIndex(prevIndex)) {
          return prevIndex
        }
        return prev
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
  if (!personalRecords || !Array.isArray(personalRecords) || personalRecords.length === 0) {
    return (
      <div className={`${className} flex justify-center`}>
        <div className="simple-tile bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-l-4 border-accent-yellow p-6 text-center max-w-md">
          <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-100 mb-2">
            {t('records.noRecords')}
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            {t('records.noRecordsDesc')}
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            {t('records.viewProfile')}
          </button>
        </div>
      </div>
    )
  }

  // 🔧 FIX: Additional validation before accessing current item
  if (!isValidIndex(currentIndex)) {
    console.warn('🚨 SingleRecordCard: Invalid currentIndex:', currentIndex, 'items:', personalRecords.length)
    setCurrentIndex(0)
    return (
      <div className={`${className} flex justify-center`}>
        <div className="simple-tile bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-l-4 border-accent-yellow p-6 text-center max-w-md">
          <div className="animate-pulse">
            <div className="w-12 h-12 bg-yellow-600 rounded mx-auto mb-3"></div>
            <div className="h-4 bg-slate-600 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  const currentRecord = personalRecords[currentIndex]

  return (
    <div className={`${className} flex justify-center`}>
      <div 
        className="swipeable-card bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-l-4 border-accent-yellow relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="swipeable-card-header">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h3 className="text-base font-bold text-slate-100">{t('card.records')}</h3>
          </div>
          <div className="text-xs text-slate-400">
            <span className="text-yellow-400">{currentRecord?.platform || 'N64'}</span>
          </div>
        </div>
        
        <div className="swipeable-card-content">
          <div className="p-4 h-full flex flex-col">
            <div className="flex-1">
              <h4 className="text-base font-semibold text-slate-100 mb-2 leading-tight">
                {currentRecord?.game || 'Unknown Game'}
              </h4>
              <p className="text-sm text-slate-300 mb-3">
                {currentRecord?.category || 'Unknown Category'}
              </p>
              <div className="text-2xl font-bold text-yellow-400 mb-2 font-mono">
                {currentRecord?.time || '--:--:--'}
              </div>
              {currentRecord?.verified && (
                <div className="flex items-center gap-1 text-green-400 text-sm mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{t('records.verified')}</span>
                </div>
              )}
            </div>
            <div className="border-t border-slate-600/30 pt-3 mt-auto">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{currentRecord?.date ? formatTime(currentRecord.date) : '--:--'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{t('records.personal')}</span>
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
            disabled={isFlipping || !isValidIndex(currentIndex) || currentIndex >= personalRecords.length - 1}
            className={`pointer-events-auto p-2 rounded-full bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white transition-all duration-200 ${
              currentIndex >= personalRecords.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
            }`}
            aria-label={t('aria.nextCard')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="text-center mt-1 text-xs text-slate-400">
          {currentIndex + 1} {t('common.of')} {personalRecords.length}
        </div>
      </div>
    </div>
  )
}

export default SingleRecordCard
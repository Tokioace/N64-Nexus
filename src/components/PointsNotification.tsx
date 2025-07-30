/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Trophy, X, Zap } from 'lucide-react'

interface PointsNotificationProps {
  action: string
  points: number
  description?: string
  onClose: () => void
}

const PointsNotification: React.FC<PointsNotificationProps> = ({
  action,
  points,
  description,
  onClose
}) => {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation
    setIsVisible(true)
    
    // Auto-close after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      const closeTimer = setTimeout(onClose, 300) // Wait for fade out animation
      return () => clearTimeout(closeTimer)
    }, 4000)

    return () => clearTimeout(timer)
  }, [onClose])

  const handleClose = () => {
    setIsVisible(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const closeTimer = setTimeout(onClose, 300)
    // Cleanup handled by component unmount
  }

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 text-slate-900" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-yellow-800" />
              <span className="font-bold text-sm">+{points} {t('points.earned')}</span>
            </div>
            
            <p className="text-sm font-medium text-slate-800">
                             {t(action as any)}
            </p>
            
            {description && (
              <p className="text-xs text-slate-700 mt-1 truncate">
                {description}
              </p>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 text-slate-700 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PointsNotification
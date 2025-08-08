import React, { useState, useEffect } from 'react'
import { Wifi, WifiOff, Cloud, CloudOff } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { offlineStorage } from '../utils/offlineStorage'

const OfflineIndicator: React.FC = () => {
  const { t } = useLanguage()
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showIndicator, setShowIndicator] = useState(!navigator.onLine)
  const [storageInfo, setStorageInfo] = useState({ used: 0, quota: 0, available: 0 })

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowIndicator(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowIndicator(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Load storage info
    offlineStorage.getStorageInfo().then(setStorageInfo)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Auto-hide online indicator after 3 seconds
  useEffect(() => {
    if (isOnline && showIndicator) {
      const timer = setTimeout(() => {
        setShowIndicator(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, showIndicator])

  // Show indicator when going back online
  useEffect(() => {
    if (isOnline) {
      setShowIndicator(true)
    }
  }, [isOnline])

  if (!showIndicator) return null

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <div className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 transition-all duration-300 ${
      isOnline ? 'translate-y-0' : 'translate-y-0'
    }`}>
      <div className={`rounded-lg shadow-lg p-3 text-white text-sm ${
        isOnline 
          ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
          : 'bg-gradient-to-r from-red-500 to-rose-600'
      }`}>
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <>
              <div className="flex items-center space-x-1">
                <Wifi className="w-4 h-4" />
                <Cloud className="w-4 h-4" />
              </div>
              <span className="font-medium">{t('offline.backOnline')}</span>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-1">
                <WifiOff className="w-4 h-4" />
                <CloudOff className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{t('offline.workingOffline')}</div>
                <div className="text-xs opacity-90 mt-1">
                  {t('offline.cachedDataAvailable')}
                </div>
              </div>
            </>
          )}
        </div>
        
        {!isOnline && storageInfo.used > 0 && (
          <div className="mt-2 pt-2 border-t border-white/20">
            <div className="flex justify-between text-xs opacity-90">
              <span>{t('offline.cachedData')}</span>
              <span>{formatBytes(storageInfo.used)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OfflineIndicator
import React, { useState, useEffect } from 'react'
import { X, Download, Smartphone, Share } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

const PWAInstallPrompt: React.FC = () => {
  const { t } = useLanguage()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [hasShownPrompt, setHasShownPrompt] = useState(false)

  useEffect(() => {
    // Check if running on iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(ios)

    // Check if app is already installed (running in standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true
    setIsStandalone(standalone)

    // Check if user has already dismissed the prompt
    const hasShown = localStorage.getItem('pwa-install-prompt-shown') === 'true'
    setHasShownPrompt(hasShown)

    // Listen for the beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      
      // Show custom prompt after a delay if not shown before
      if (!hasShown && !standalone) {
        setTimeout(() => {
          setShowPrompt(true)
        }, 5000) // Show after 5 seconds
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // For iOS, show prompt after delay if not standalone and not shown before
    if (ios && !standalone && !hasShown) {
      setTimeout(() => {
        setShowPrompt(true)
      }, 7000) // Show after 7 seconds on iOS
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [hasShownPrompt])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt()
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
      
      // Clear the deferredPrompt so it can only be used once
      setDeferredPrompt(null)
    }
    
    // Hide the custom prompt and mark as shown
    setShowPrompt(false)
    localStorage.setItem('pwa-install-prompt-shown', 'true')
    setHasShownPrompt(true)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-prompt-shown', 'true')
    setHasShownPrompt(true)
  }

  // Don't show if already installed or prompt was already shown
  if (isStandalone || !showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-2xl p-4 text-white">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-6 h-6 flex-shrink-0" />
            <h3 className="font-bold text-sm">
              {t('pwa.installTitle')}
            </h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white transition-colors"
            aria-label={t('common.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-white/90 mb-4">
          {t('pwa.installDescription')}
        </p>
        
        {isIOS ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <Share className="w-4 h-4" />
              <span>{t('pwa.iosStep1')}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Download className="w-4 h-4" />
              <span>{t('pwa.iosStep2')}</span>
            </div>
            <button
              onClick={handleDismiss}
              className="w-full bg-white/20 hover:bg-white/30 transition-colors rounded-lg py-2 px-4 text-sm font-medium"
            >
              {t('pwa.gotIt')}
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-white text-blue-600 hover:bg-blue-50 transition-colors rounded-lg py-2 px-4 text-sm font-medium flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{t('pwa.install')}</span>
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
            >
              {t('common.later')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PWAInstallPrompt
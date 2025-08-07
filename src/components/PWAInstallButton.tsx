import React, { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { logger } from '../lib/logger'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface PWAInstallButtonProps {
  className?: string
  variant?: 'button' | 'banner' | 'modal'
  showIcon?: boolean
}

const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  className = '',
  variant = 'button',
  showIcon = true
}) => {
  const { t } = useLanguage()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [platform, setPlatform] = useState<'android' | 'ios' | 'desktop' | 'unknown'>('unknown')
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)

  // Detect platform and installation status
  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://')

    setIsInstalled(isStandalone)

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase()
    if (/android/.test(userAgent)) {
      setPlatform('android')
    } else if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios')
    } else {
      setPlatform('desktop')
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
      logger.info('PWA install prompt available')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      logger.info('PWA installed successfully')
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (platform === 'ios') {
      setShowIOSInstructions(true)
      return
    }

    if (!deferredPrompt) {
      logger.warn('No install prompt available')
      return
    }

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        logger.info('User accepted PWA install')
      } else {
        logger.info('User dismissed PWA install')
      }
      
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    } catch (error) {
      logger.error('Error during PWA install:', error)
    }
  }

  const dismissPrompt = () => {
    setShowInstallPrompt(false)
    // Remember dismissal for session
    sessionStorage.setItem('pwa-install-dismissed', 'true')
  }

  // Don't show if already installed or dismissed
  if (isInstalled || 
      (variant === 'banner' && sessionStorage.getItem('pwa-install-dismissed'))) {
    return null
  }

  // iOS Instructions Modal
  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-lg p-6 max-w-sm w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">
              {t('pwa.install.ios.title')}
            </h3>
            <button
              onClick={() => setShowIOSInstructions(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4 text-sm text-gray-300">
            <div className="flex items-start space-x-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">1</span>
              <p>{t('pwa.install.ios.step1')}</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">2</span>
              <p>{t('pwa.install.ios.step2')}</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">3</span>
              <p>{t('pwa.install.ios.step3')}</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowIOSInstructions(false)}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            {t('common.understood')}
          </button>
        </div>
      </div>
    )
  }

  // Banner variant
  if (variant === 'banner' && showInstallPrompt) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 z-40 shadow-lg">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            {showIcon && <Smartphone size={24} />}
            <div>
              <p className="font-semibold">{t('pwa.install.banner.title')}</p>
              <p className="text-sm opacity-90">{t('pwa.install.banner.description')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleInstallClick}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {t('pwa.install.button')}
            </button>
            <button
              onClick={dismissPrompt}
              className="text-white/80 hover:text-white p-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Modal variant
  if (variant === 'modal' && showInstallPrompt) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full">
          <div className="text-center">
            {showIcon && (
              <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <Download size={32} className="text-white" />
              </div>
            )}
            
            <h3 className="text-xl font-semibold text-white mb-2">
              {t('pwa.install.modal.title')}
            </h3>
            <p className="text-gray-300 mb-6">
              {t('pwa.install.modal.description')}
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                {t('pwa.install.button')}
              </button>
              <button
                onClick={dismissPrompt}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Button variant (default)
  if (showInstallPrompt || variant === 'button') {
    return (
      <button
        onClick={handleInstallClick}
        className={`
          inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 
          text-white px-4 py-2 rounded-lg font-semibold transition-colors
          ${className}
        `}
      >
        {showIcon && <Download size={16} />}
        <span>{t('pwa.install.button')}</span>
      </button>
    )
  }

  return null
}

export default PWAInstallButton
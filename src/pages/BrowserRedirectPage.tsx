import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { redirectToPreferredBrowser, detectBrowser } from '../utils/browserDetection'
import { Smartphone, Monitor, Loader2 } from 'lucide-react'

const BrowserRedirectPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const { t } = useLanguage()
  const [countdown, setCountdown] = useState(3)
  const [browserInfo, setBrowserInfo] = useState<any>(null)

  useEffect(() => {
    const targetURL = searchParams.get('target')
    const preferredBrowser = searchParams.get('browser')
    
    if (!targetURL) {
      // Fallback to home page
      window.location.href = '/'
      return
    }

    // Detect current browser
    const currentBrowser = detectBrowser()
    setBrowserInfo(currentBrowser)

    // Start countdown
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Validate URL before redirecting
          try {
            const url = new URL(targetURL)
            const currentOrigin = window.location.origin
            
            if (url.origin === currentOrigin) {
              // Try to redirect to preferred browser
              redirectToPreferredBrowser(targetURL, preferredBrowser || undefined)
            } else {
              console.warn('Redirect to external URL blocked for security:', targetURL)
              window.location.href = '/'
            }
          } catch (error) {
            console.error('Invalid URL:', targetURL, error)
            window.location.href = '/'
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Cleanup interval on unmount or when dependencies change
    return () => {
      clearInterval(countdownInterval)
    }
  }, [searchParams])

  const handleManualRedirect = () => {
    const targetURL = searchParams.get('target')
    if (targetURL) {
      try {
        // Validate URL to prevent open redirect attacks
        const url = new URL(targetURL)
        const currentOrigin = window.location.origin
        
        // Only allow redirects to the same origin
        if (url.origin === currentOrigin) {
          window.location.href = targetURL
        } else {
          console.warn('Redirect to external URL blocked for security:', targetURL)
          window.location.href = '/'
        }
      } catch (error) {
        console.error('Invalid URL:', targetURL, error)
        window.location.href = '/'
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 max-w-md w-full text-center border border-slate-700">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            {browserInfo?.isMobile ? (
              <Smartphone className="w-8 h-8 text-white" />
            ) : (
              <Monitor className="w-8 h-8 text-white" />
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-slate-100 mb-2">
            {t('browserRedirect.title')}
          </h1>
          
          <p className="text-slate-300 mb-4">
            {t('browserRedirect.message')}
          </p>

          {browserInfo && (
            <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
              <p className="text-slate-300 text-sm mb-2">
                <strong>{t('browserRedirect.detectedBrowser')}:</strong> {browserInfo.name}
              </p>
              <p className="text-slate-400 text-xs">
                {t('browserRedirect.version')}: {browserInfo.version}
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mb-6">
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            <span className="text-slate-300">
              {t('browserRedirect.redirectingIn', { seconds: countdown.toString() })}
            </span>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleManualRedirect}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {t('browserRedirect.redirectNow')}
            </button>
            
            <div className="text-slate-400 text-xs">
              <p>{t('browserRedirect.troubleshoot')}</p>
              <p>{t('browserRedirect.manualInstructions')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrowserRedirectPage
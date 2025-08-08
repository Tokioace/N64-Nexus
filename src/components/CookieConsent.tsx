import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Cookie, Settings, X } from 'lucide-react'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

interface CookieConsentProps {
  onAccept: (preferences: CookiePreferences) => void
  onReject: () => void
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onReject }) => {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false
  })

  useEffect(() => {
    // Check if user has already given consent
    const existingConsent = localStorage.getItem('battle64_cookie_consent')
    if (!existingConsent) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    }
    
    // Store consent with timestamp
    const consentData = {
      preferences: allAccepted,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
    
    localStorage.setItem('battle64_cookie_consent', JSON.stringify(consentData))
    onAccept(allAccepted)
    setIsVisible(false)
  }

  const handleAcceptSelected = () => {
    const consentData = {
      preferences: preferences,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
    
    localStorage.setItem('battle64_cookie_consent', JSON.stringify(consentData))
    onAccept(preferences)
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    const minimalConsent: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    }
    
    const consentData = {
      preferences: minimalConsent,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }
    
    localStorage.setItem('battle64_cookie_consent', JSON.stringify(consentData))
    onReject()
    setIsVisible(false)
  }

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return // Cannot disable necessary cookies
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-slate-800 border border-slate-600 rounded-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-600">
          <div className="flex items-center space-x-3">
            <Cookie className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-slate-100">
              {t('cookies.title')}
            </h2>
          </div>
          <button
            onClick={handleRejectAll}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-300 mb-6 leading-relaxed">
            {t('cookies.description')}
          </p>

          {/* Cookie Categories */}
          {showDetails && (
            <div className="space-y-4 mb-6">
              {/* Necessary Cookies */}
              <div className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0" />
                    <h4 className="font-semibold text-slate-200">
                      {t('cookies.necessary')}
                    </h4>
                  </div>
                  <div className="text-xs text-slate-400 bg-slate-600 px-2 py-1 rounded">
                    Always Active
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t('cookies.necessaryDescription')}
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => updatePreference('analytics', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-4 h-4 bg-slate-600 border border-slate-500 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {preferences.analytics && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </label>
                    <h4 className="font-semibold text-slate-200">
                      {t('cookies.analytics')}
                    </h4>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t('cookies.analyticsDescription')}
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => updatePreference('marketing', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-4 h-4 bg-slate-600 border border-slate-500 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {preferences.marketing && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </label>
                    <h4 className="font-semibold text-slate-200">
                      {t('cookies.marketing')}
                    </h4>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t('cookies.marketingDescription')}
                </p>
              </div>

              {/* Preferences Cookies */}
              <div className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.preferences}
                        onChange={(e) => updatePreference('preferences', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-4 h-4 bg-slate-600 border border-slate-500 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {preferences.preferences && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </label>
                    <h4 className="font-semibold text-slate-200">
                      {t('cookies.preferences')}
                    </h4>
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t('cookies.preferencesDescription')}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">
                {showDetails ? 'Hide Details' : t('cookies.managePreferences')}
              </span>
            </button>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto">
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors text-sm"
              >
                {t('cookies.rejectAll')}
              </button>
              
              {showDetails && (
                <button
                  onClick={handleAcceptSelected}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  {t('cookies.acceptSelected')}
                </button>
              )}
              
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                {t('cookies.acceptAll')}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-600 bg-slate-700/30">
          <p className="text-xs text-slate-400 leading-relaxed">
            By continuing to use Battle64, you agree to our cookie usage. You can change your preferences at any time in your account settings. 
            For more information, see our{' '}
            <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
              Privacy Policy
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent
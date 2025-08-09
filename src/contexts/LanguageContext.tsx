import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

// Define Language type
export type Language = 'de' | 'en' | 'fr' | 'it' | 'es' | 'el' | 'tr' | 'zh' | 'ja' | 'ru' | 'pt' | 'hi' | 'ar' | 'ko'

// Define a minimal translation type
export type TranslationKeys = string

interface LanguageContextType {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKeys, params?: Record<string, string>) => string
  isRTL: boolean
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Helper function to get the correct locale for date formatting
// eslint-disable-next-line react-refresh/only-export-components
export const getLocaleString = (language: Language): string => {
  switch (language) {
    case 'de': return 'de-DE'
    case 'fr': return 'fr-FR'
    case 'it': return 'it-IT'
    case 'es': return 'es-ES'
    case 'el': return 'el-GR'
    case 'tr': return 'tr-TR'
    case 'zh': return 'zh-CN'
    case 'ja': return 'ja-JP'
    case 'ru': return 'ru-RU'
    case 'pt': return 'pt-PT'
    case 'hi': return 'hi-IN'
    case 'ar': return 'ar-SA'
    case 'ko': return 'ko-KR'
    default: return 'en-US'
  }
}

// RTL languages
const RTL_LANGUAGES: Language[] = ['ar']

// Import the translation loader utility
import { loadTranslation, preloadTranslations } from '../utils/translationLoader'

// Get browser language with fallback
const getBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en'
  
  const saved = localStorage.getItem('battle64-language')
  if (saved && ['de', 'en', 'fr', 'it', 'es', 'el', 'tr', 'zh', 'ja', 'ru', 'pt', 'hi', 'ar', 'ko'].includes(saved)) {
    return saved as Language
  }
  
  const browserLang = navigator.language.split('-')[0]
  const supportedLanguages: Language[] = ['de', 'en', 'fr', 'it', 'es', 'el', 'tr', 'zh', 'ja', 'ru', 'pt', 'hi', 'ar', 'ko']
  
  return supportedLanguages.includes(browserLang as Language) ? browserLang as Language : 'en'
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getBrowserLanguage())
  const [translations, setTranslations] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Load translations when language changes
  useEffect(() => {
    const loadLanguage = async () => {
      setIsLoading(true)
      try {
        const newTranslations = await loadTranslation(currentLanguage)
        setTranslations(newTranslations)
      } catch (error) {
        console.error('Failed to load translations:', error)
        // Set empty translations as fallback
        setTranslations({})
      } finally {
        setIsLoading(false)
      }
    }

    loadLanguage()
  }, [currentLanguage])

  // Preload common languages on mount for better UX
  useEffect(() => {
    // Preload English and the user's browser language if different
    const languagesToPreload: Language[] = ['en']
    const browserLang = getBrowserLanguage()
    if (browserLang !== 'en') {
      languagesToPreload.push(browserLang)
    }
    
    // Also preload German as it's commonly used
    if (!languagesToPreload.includes('de')) {
      languagesToPreload.push('de')
    }
    
    // Preload in the background without blocking the UI
    preloadTranslations(languagesToPreload).catch(error => {
      console.warn('Failed to preload translations:', error)
    })
  }, [])

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
    localStorage.setItem('battle64-language', language)
  }

  const t = (key: TranslationKeys, params?: Record<string, string>): string => {
    // Navigate through nested keys (e.g., "nav.home")
    const keys = key.split('.')
    let value = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Key not found, return the key itself as fallback
        return key
      }
    }
    
    let result = typeof value === 'string' ? value : key
    
    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue)
      })
    }
    
    return result
  }

  const isRTL = RTL_LANGUAGES.includes(currentLanguage)

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
    isRTL,
    isLoading
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
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
    case 'pt': return 'pt-PT'
    case 'ru': return 'ru-RU'
    case 'zh': return 'zh-CN'
    case 'ja': return 'ja-JP'
    case 'ar': return 'ar-SA'
    case 'hi': return 'hi-IN'
    case 'el': return 'el-GR'
    case 'tr': return 'tr-TR'
    default: return 'en-US'
  }
}

// Helper function to check if language is RTL
const isRTLLanguage = (language: Language): boolean => {
  return language === 'ar'
}

// Translation cache
const translationCache: Partial<Record<Language, Record<string, string>>> = {}

// Lazy load translations
const loadTranslations = async (language: Language): Promise<Record<string, string>> => {
  if (translationCache[language]) {
    return translationCache[language]!
  }

  try {
    console.log(`🔄 Loading translations for ${language}...`)
    const module = await import(`../translations/${language}`)
    translationCache[language] = module.default
    console.log(`✅ Translations loaded for ${language}`)
    return module.default
  } catch (error) {
    console.warn(`⚠️ Failed to load translations for ${language}, falling back to English`)
    // Fallback to English
    if (language !== 'en') {
      return loadTranslations('en')
    }
    // If English also fails, return empty object
    return {}
  }
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('de') // Default to German
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false) // Start as false to not block React

  console.log('🔄 Lightweight LanguageProvider rendering...')

  // Load translations when language changes - non-blocking
  useEffect(() => {
    let mounted = true

    const loadLanguageTranslations = async () => {
      if (mounted) {
        setIsLoading(true)
      }

      try {
        console.log(`🔄 Lazy-loading translations for ${currentLanguage}...`)
        const languageTranslations = await loadTranslations(currentLanguage)
        
        if (mounted) {
          setTranslations(languageTranslations)
          console.log(`✅ Translations loaded for ${currentLanguage}`)
        }
      } catch (error) {
        console.error('Error loading translations:', error)
        if (mounted) {
          setTranslations({}) // Fallback to empty translations
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    // Start loading translations (non-blocking)
    loadLanguageTranslations()

    return () => {
      mounted = false
    }
  }, [currentLanguage])

  const setLanguage = (language: Language) => {
    console.log(`🌍 Switching language to: ${language}`)
    setCurrentLanguage(language)
    
    // Apply RTL and language settings
    const isRTL = isRTLLanguage(language)
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = language
    
    // Save to localStorage for persistence
    localStorage.setItem('battle64-language', language)
    
    // Add RTL class to body for CSS styling
    if (isRTL) {
      document.body.classList.add('rtl-layout')
    } else {
      document.body.classList.remove('rtl-layout')
    }
  }

  // Load saved language on mount (non-blocking)
  useEffect(() => {
    const savedLanguage = localStorage.getItem('battle64-language') as Language
    if (savedLanguage) {
      console.log(`🔄 Loading saved language: ${savedLanguage}`)
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const t = (key: TranslationKeys, params?: Record<string, string>): string => {
    let translation = translations[key] || key

    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{${paramKey}}`, paramValue)
      })
    }

    return translation
  }

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
    isRTL: isRTLLanguage(currentLanguage),
    isLoading
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
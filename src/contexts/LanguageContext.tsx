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
    case 'ko': return 'ko-KR'
    default: return 'en-US'
  }
}

// Helper function to check if language is RTL
const isRTLLanguage = (language: Language): boolean => {
  return language === 'ar'
}

// Translation cache
const translationCache: Partial<Record<Language, Record<string, string>>> = {}

// Lazy load translations - using import() without file extension to let Vite handle it
const loadTranslations = async (language: Language): Promise<Record<string, string>> => {
  if (translationCache[language]) {
    console.log(`✅ Using cached translations for ${language}`)
    return translationCache[language]!
  }

  try {
    console.log(`🔄 Loading translations for ${language}...`)
    
    // Use dynamic import without .ts extension - Vite will handle the correct path
    const translationModule = await import(`../translations/${language}`)
    
    translationCache[language] = translationModule.default
    console.log(`✅ Translations loaded for ${language}:`, Object.keys(translationModule.default).length, 'keys')
    return translationModule.default
  } catch (error) {
    console.error(`❌ Failed to load translations for ${language}:`, error)
    // Fallback to English
    if (language !== 'en') {
      console.log(`🔄 Falling back to English translations...`)
      return loadTranslations('en')
    }
    // If English also fails, return empty object
    console.error('❌ Even English translations failed to load!')
    return {}
  }
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Start with English as default instead of German
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en')
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true) // Start as true to load initial translations

  console.log('🔄 LanguageProvider rendering with translations:', Object.keys(translations).length, 'keys for', currentLanguage)

  // Load translations when language changes - non-blocking
  useEffect(() => {
    let mounted = true

    const loadLanguageTranslations = async () => {
      if (mounted) {
        setIsLoading(true)
      }

      try {
        console.log(`🔄 Loading translations for ${currentLanguage}...`)
        const languageTranslations = await loadTranslations(currentLanguage)
        
        if (mounted) {
          setTranslations(languageTranslations)
          console.log(`✅ Translations set for ${currentLanguage}:`, Object.keys(languageTranslations).length, 'keys')
          console.log('📝 Sample translations:', Object.entries(languageTranslations).slice(0, 3))
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

    // Start loading translations immediately
    loadLanguageTranslations()

    return () => {
      mounted = false
    }
  }, [currentLanguage])

  // Load saved language on mount (after English loads first)
  useEffect(() => {
    const savedLanguage = localStorage.getItem('battle64-language') as Language
    if (savedLanguage && savedLanguage !== currentLanguage) {
      console.log(`🔄 Loading saved language: ${savedLanguage}`)
      setCurrentLanguage(savedLanguage)
    }
  }, [currentLanguage])

  const setLanguage = (language: Language) => {
    console.log(`🌍 Switching language from ${currentLanguage} to: ${language}`)
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

  const t = (key: TranslationKeys, params?: Record<string, string>): string => {
    let translation = translations[key]
    
    if (!translation) {
      console.warn(`⚠️ Missing translation for key: "${key}" (language: ${currentLanguage})`)
      return key // Return the key if translation is missing
    }

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
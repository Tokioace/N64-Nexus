import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

// Import all translations statically - this ensures they're bundled
import de from '../translations/de'
import en from '../translations/en'
import fr from '../translations/fr'
import it from '../translations/it'
import es from '../translations/es'
import el from '../translations/el'
import tr from '../translations/tr'
import zh from '../translations/zh'
import ja from '../translations/ja'
import ru from '../translations/ru'
import pt from '../translations/pt'
import hi from '../translations/hi'
import ar from '../translations/ar'
import ko from '../translations/ko'

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

// Static translations object - all bundled but accessed on demand
const allTranslations: Record<Language, Record<string, string>> = {
  de,
  en,
  fr,
  it,
  es,
  el,
  tr,
  zh,
  ja,
  ru,
  pt,
  hi,
  ar,
  ko
}

// Get translations for a specific language
const getTranslations = (language: Language): Record<string, string> => {
  const translations = allTranslations[language]
  if (!translations) {
    console.warn(`⚠️ No translations found for language: ${language}, falling back to English`)
    return allTranslations.en || {}
  }
  console.log(`✅ Retrieved translations for ${language}:`, Object.keys(translations).length, 'keys')
  return translations
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Start with English as default
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en')
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false) // Start as false since we have static imports

  console.log('🔄 LanguageProvider rendering with translations:', Object.keys(translations).length, 'keys for', currentLanguage)

  // Load translations when language changes - now synchronous since they're statically imported
  useEffect(() => {
    console.log(`🔄 Setting translations for ${currentLanguage}...`)
    setIsLoading(true)
    
    // Get translations synchronously since they're already loaded
    const languageTranslations = getTranslations(currentLanguage)
    setTranslations(languageTranslations)
    console.log(`✅ Translations set for ${currentLanguage}:`, Object.keys(languageTranslations).length, 'keys')
    console.log('📝 Sample translations:', Object.entries(languageTranslations).slice(0, 3))
    
    setIsLoading(false)
  }, [currentLanguage])

  // Load saved language on mount
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
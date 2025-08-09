import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

// Static imports for all translations
import en from '../translations/en'
import de from '../translations/de'
import fr from '../translations/fr'
import es from '../translations/es'
import it from '../translations/it'
import pt from '../translations/pt'
import ru from '../translations/ru'
import ja from '../translations/ja'
import ko from '../translations/ko'
import zh from '../translations/zh'
import ar from '../translations/ar'
import hi from '../translations/hi'
import el from '../translations/el'
import tr from '../translations/tr'

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

// Static translations object
const getTranslations = (language: Language): Record<string, any> => {
  switch (language) {
    case 'en': return en
    case 'de': return de
    case 'fr': return fr
    case 'es': return es
    case 'it': return it
    case 'pt': return pt
    case 'ru': return ru
    case 'ja': return ja
    case 'ko': return ko
    case 'zh': return zh
    case 'ar': return ar
    case 'hi': return hi
    case 'el': return el
    case 'tr': return tr
    default: return en
  }
}

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
  const [translations, setTranslations] = useState<Record<string, any>>(() => getTranslations(getBrowserLanguage()))
  const [isLoading, setIsLoading] = useState(false)

  // Update translations when language changes
  useEffect(() => {
    setTranslations(getTranslations(currentLanguage))
  }, [currentLanguage])

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
    localStorage.setItem('battle64-language', language)
  }

  const t = (key: TranslationKeys, params?: Record<string, string>): string => {
    // Direct key lookup (translations are flat objects with keys like 'nav.home')
    let result = translations[key] || key
    
    // Replace parameters if provided
    if (params && typeof result === 'string') {
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
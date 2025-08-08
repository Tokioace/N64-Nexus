import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Language, translations, TranslationKeys } from '../translations'

interface LanguageContextType {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKeys, params?: Record<string, string>) => string
  isRTL: boolean
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

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en')

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
    // Save to localStorage for persistence
    localStorage.setItem('battle64-language', language)
    
    // Apply RTL to document
    const isRTL = isRTLLanguage(language)
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = language
    
    // Add RTL class to body for CSS styling
    if (isRTL) {
      document.body.classList.add('rtl-layout')
    } else {
      document.body.classList.remove('rtl-layout')
    }
  }

  // Translation function with parameter support
  const t = (key: TranslationKeys | string, params?: Record<string, string>): string => {
    const languageTranslations = translations[currentLanguage] as any
    let translation = languageTranslations[key] || (translations.en as any)[key] || key

    // Replace parameters in the translation
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(new RegExp(`{${paramKey}}`, 'g'), paramValue)
      })
    }

    return translation
  }

  // Load saved language on mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('battle64-language') as Language
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
      
      // Apply RTL on initial load
      const isRTL = isRTLLanguage(savedLanguage)
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
      document.documentElement.lang = savedLanguage
      
      if (isRTL) {
        document.body.classList.add('rtl-layout')
      } else {
        document.body.classList.remove('rtl-layout')
      }
    }
  }, [])

  const value = {
    currentLanguage,
    setLanguage,
    t,
    isRTL: isRTLLanguage(currentLanguage)
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

// Export types for use in other files
export type { Language }
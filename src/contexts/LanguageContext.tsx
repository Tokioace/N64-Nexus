import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Language, translations, TranslationKeys } from '../translations'

interface LanguageContextType {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKeys, params?: Record<string, string>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Helper function to get the correct locale for date formatting
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

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en')

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
    // Save to localStorage for persistence
    localStorage.setItem('battle64-language', language)
  }

  // Translation function with parameter support
  const t = (key: TranslationKeys, params?: Record<string, string>): string => {
    const languageTranslations = translations[currentLanguage]
    let translation = languageTranslations[key] || translations.en[key] || key

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
    }
  }, [])

  const value = {
    currentLanguage,
    setLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

// Export types for use in other files
export type { Language }
import React, { useState } from 'react'
import { useLanguage, Language } from '../contexts/LanguageContext'

const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'de' as Language, name: t('language.german'), flag: '🇩🇪' },
    { code: 'en' as Language, name: t('language.english'), flag: '🇬🇧' },
    { code: 'fr' as Language, name: t('language.french'), flag: '🇫🇷' }
  ]

  const currentFlag = languages.find(lang => lang.code === currentLanguage)?.flag || '🇩🇪'

  const handleLanguageChange = (language: Language) => {
    setLanguage(language)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Current Language Flag Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors duration-200 flex items-center justify-center text-lg bg-white shadow-sm hover:shadow-md"
        title={languages.find(lang => lang.code === currentLanguage)?.name}
      >
        {currentFlag}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-10 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px]">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm transition-colors duration-150 ${
                  currentLanguage === language.code 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700'
                }`}
              >
                <span className="text-base">{language.flag}</span>
                <span>{language.name}</span>
                {currentLanguage === language.code && (
                  <span className="ml-auto text-blue-500">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default LanguageSelector
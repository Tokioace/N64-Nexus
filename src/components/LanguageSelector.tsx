import React, { useState } from 'react'
import { useLanguage, Language } from '../contexts/LanguageContext'

const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'de' as Language, name: t('language.german'), flag: '🇩🇪' },
    { code: 'en' as Language, name: t('language.english'), flag: '🇬🇧' },
    { code: 'fr' as Language, name: t('language.french'), flag: '🇫🇷' },
    { code: 'it' as Language, name: t('language.italian'), flag: '🇮🇹' },
    { code: 'es' as Language, name: t('language.spanish'), flag: '🇪🇸' },
    { code: 'el' as Language, name: t('language.greek'), flag: '🇬🇷' },
    { code: 'tr' as Language, name: t('language.turkish'), flag: '🇹🇷' },
    { code: 'zh' as Language, name: t('language.chinese'), flag: '🇨🇳' },
    { code: 'ja' as Language, name: t('language.japanese'), flag: '🇯🇵' },
    { code: 'ru' as Language, name: t('language.russian'), flag: '🇷🇺' },
    { code: 'pt' as Language, name: t('language.portuguese'), flag: '🇵🇹' },
    { code: 'hi' as Language, name: t('language.hindi'), flag: '🇮🇳' },
    { code: 'ar' as Language, name: t('language.arabic'), flag: '🇸🇦' }
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
        className="w-10 h-10 rounded-full border-2 border-slate-600 hover:border-blue-400 transition-colors duration-200 flex items-center justify-center text-xl bg-slate-800 hover:bg-slate-700 shadow-md hover:shadow-lg"
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
          <div className="absolute right-0 top-12 z-20 bg-slate-800 border border-slate-600 rounded-lg shadow-xl py-2 min-w-[160px] max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full px-4 py-3 text-left hover:bg-slate-700 flex items-center gap-3 text-sm transition-colors duration-150 ${
                  currentLanguage === language.code 
                    ? 'bg-blue-900/50 text-blue-300 border-l-2 border-blue-400' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
                {currentLanguage === language.code && (
                  <span className="ml-auto text-blue-400 font-bold">✓</span>
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
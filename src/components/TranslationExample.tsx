import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * Example component demonstrating how to use translations in your components.
 * You can delete this file once you understand how to use the translation system.
 */
const TranslationExample: React.FC = () => {
  const { t, currentLanguage } = useLanguage()

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Translation Example</h2>
      <p className="mb-2">Current language: <strong>{currentLanguage}</strong></p>
      
      <div className="space-y-1">
        <p><strong>Welcome:</strong> {t('common.welcome')}</p>
        <p><strong>Loading:</strong> {t('common.loading')}</p>
        <p><strong>Quiz Title:</strong> {t('quiz.title')}</p>
        <p><strong>Profile:</strong> {t('profile.title')}</p>
        <p><strong>Events:</strong> {t('events.title')}</p>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>To use translations in your components:</p>
        <ol className="list-decimal list-inside mt-1">
          <li>Import: <code>import {`{ useLanguage }`} from '../contexts/LanguageContext'</code></li>
          <li>Use hook: <code>const {`{ t }`} = useLanguage()</code></li>
          <li>Translate: <code>{`{t('your.translation.key')}`}</code></li>
        </ol>
      </div>
    </div>
  )
}

export default TranslationExample
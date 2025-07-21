import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const QuizResultPage: React.FC = () => {
  const { t } = useLanguage()
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="simple-tile text-center">
        <h1 className="text-3xl font-bold text-slate-100 mb-4">{t('quiz.resultPage.title')}</h1>
        <p className="text-slate-400">{t('quiz.resultPage.description')}</p>
      </div>
    </div>
  )
}

export default QuizResultPage
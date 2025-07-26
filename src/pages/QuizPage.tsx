import React from 'react'
import { useQuiz } from '../contexts/QuizContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Target } from 'lucide-react'

const QuizPage: React.FC = () => {
  const { startQuiz, isQuizActive } = useQuiz()
  const { t } = useLanguage()

  return (
    <div className="container-lg py-responsive space-responsive responsive-max-width responsive-overflow-hidden">
      {/* Header */}
      <div className="text-center mb-responsive responsive-max-width">
        <Target className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mx-auto mb-4" />
        <h1 className="text-responsive-2xl font-bold text-slate-100 mb-2 responsive-word-break">
          {t('quiz.title')}
        </h1>
        <p className="text-responsive-base text-slate-400 max-w-2xl mx-auto responsive-word-break px-2">
          {t('quiz.testYourKnowledge')}
        </p>
      </div>

      {/* Quiz Content */}
      <div className="simple-tile text-center responsive-max-width">
        {!isQuizActive && (
          <button 
            onClick={() => startQuiz()}
            className="btn-primary mobile-full sm:w-auto"
          >
            {t('quiz.start')}
          </button>
        )}
      </div>
    </div>
  )
}

export default QuizPage
import React from 'react'
import { useQuiz } from '../contexts/QuizContext'
import { Target } from 'lucide-react'

const QuizPage: React.FC = () => {
  const { startQuiz, isQuizActive } = useQuiz()

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="simple-tile text-center">
        <Target className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-slate-100 mb-4">
          N64 Quiz
        </h1>
        <p className="text-slate-400 mb-6">
          Teste dein N64-Wissen!
        </p>
        {!isQuizActive && (
          <button 
            onClick={() => startQuiz()}
            className="btn-primary"
          >
            Quiz starten
          </button>
        )}
      </div>
    </div>
  )
}

export default QuizPage
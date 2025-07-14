import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuiz } from '../contexts/QuizContext'
import { useUser } from '../contexts/UserContext'
import { Clock, Check, X, ArrowRight } from 'lucide-react'

const QuizPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { currentSession, startQuiz, answerQuestion, getQuestion, getProgress, getScore } = useQuiz()
  const { updatePoints, updateQuizProgress, unlockAchievement } = useUser()
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)

  const mode = searchParams.get('mode') as 'single' | 'daily' | 'speed' | undefined

  useEffect(() => {
    if (!currentSession) {
      startQuiz(mode || 'single')
    }
  }, [currentSession, startQuiz, mode])

  useEffect(() => {
    if (currentSession?.mode === 'speed' && !isAnswered) {
      setTimeLeft(10)
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer)
            if (!isAnswered) {
              handleAnswer('')
            }
            return null
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentSession?.currentQuestionIndex, isAnswered])

  const currentQuestion = getQuestion()
  const progress = getProgress()
  const score = getScore()

  if (!currentSession || !currentQuestion) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="card text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-n64-purple mx-auto mb-4"></div>
          <p>Quiz wird geladen...</p>
        </div>
      </div>
    )
  }

  const handleAnswer = (answer: string | string[]) => {
    if (isAnswered) return

    setIsAnswered(true)
    setSelectedAnswer(answer)
    
    const isCorrect = Array.isArray(currentQuestion.correctAnswer)
      ? JSON.stringify(currentQuestion.correctAnswer.sort()) === JSON.stringify(Array.isArray(answer) ? answer.sort() : [answer])
      : currentQuestion.correctAnswer === answer

    // Update user progress
    updateQuizProgress(currentQuestion.id, isCorrect)
    if (isCorrect) {
      updatePoints(currentQuestion.points)
    }

    // Show result for 2 seconds
    setShowResult(true)
    setTimeout(() => {
      setShowResult(false)
      setIsAnswered(false)
      setSelectedAnswer(null)
      setTimeLeft(null)
      
      // Move to next question or end quiz
      answerQuestion(answer)
      
      if (progress.current >= progress.total - 1) {
        // Quiz finished
        unlockAchievement('first-quiz')
        if (score.percentage === 100) {
          unlockAchievement('perfect-score')
        }
        navigate('/quiz/result')
      }
    }, 2000)
  }

  const getOptionClass = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option ? 'selected' : ''
    }

    if (Array.isArray(currentQuestion.correctAnswer)) {
      const isCorrect = currentQuestion.correctAnswer.includes(option)
      const isSelected = Array.isArray(selectedAnswer) && selectedAnswer.includes(option)
      
      if (isCorrect) return 'correct'
      if (isSelected && !isCorrect) return 'incorrect'
      return ''
    } else {
      if (option === currentQuestion.correctAnswer) return 'correct'
      if (option === selectedAnswer && option !== currentQuestion.correctAnswer) return 'incorrect'
      return ''
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white/70">
            Frage {progress.current + 1} von {progress.total}
          </span>
          <span className="text-sm font-bold">
            {score.current} / {score.max} Punkte
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-n64-purple h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Timer for Speed Mode */}
      {currentSession.mode === 'speed' && timeLeft !== null && (
        <div className="text-center mb-4">
          <div className={`text-2xl font-bold ${timeLeft <= 3 ? 'text-n64-red' : 'text-n64-yellow'}`}>
            <Clock className="inline mr-2" size={24} />
            {timeLeft}s
          </div>
        </div>
      )}

      {/* Question */}
      <div className="card mb-6">
        <div className="mb-4">
          <span className="inline-block bg-n64-purple/20 text-n64-purple px-3 py-1 rounded-full text-sm font-medium mb-3">
            {currentQuestion.category}
          </span>
          <span className="inline-block bg-n64-yellow/20 text-n64-yellow px-3 py-1 rounded-full text-sm font-medium ml-2">
            {currentQuestion.difficulty}
          </span>
        </div>
        
        <h2 className="text-xl font-bold mb-4 leading-relaxed">
          {currentQuestion.question}
        </h2>

        {currentQuestion.imageUrl && (
          <div className="mb-4">
            <img 
              src={currentQuestion.imageUrl} 
              alt="Quiz question" 
              className="w-full rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {currentQuestion.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={isAnswered}
            className={`quiz-option w-full text-left ${getOptionClass(option)} ${
              isAnswered ? 'cursor-default' : 'cursor-pointer'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{option}</span>
              {showResult && (
                <div className="text-xl">
                  {getOptionClass(option) === 'correct' && <Check className="text-n64-green" />}
                  {getOptionClass(option) === 'incorrect' && <X className="text-n64-red" />}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Result Message */}
      {showResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">
              {selectedAnswer === currentQuestion.correctAnswer ? '🎉' : '😔'}
            </div>
            <h3 className="text-xl font-bold mb-2">
              {selectedAnswer === currentQuestion.correctAnswer ? 'Richtig!' : 'Falsch!'}
            </h3>
            <p className="text-white/70 mb-4">
              {currentQuestion.explanation}
            </p>
            <div className="text-sm text-white/50">
              +{selectedAnswer === currentQuestion.correctAnswer ? currentQuestion.points : 0} Punkte
            </div>
          </div>
        </div>
      )}

      {/* Skip Button for non-speed modes */}
      {currentSession.mode !== 'speed' && !isAnswered && (
        <div className="text-center mt-6">
          <button
            onClick={() => handleAnswer('')}
            className="text-white/50 hover:text-white transition-colors"
          >
            Überspringen
          </button>
        </div>
      )}
    </div>
  )
}

export default QuizPage
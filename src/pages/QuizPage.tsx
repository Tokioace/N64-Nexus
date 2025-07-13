import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuiz } from '../contexts/QuizContext'
import { useUser } from '../contexts/UserContext'
import { getQuestionsByCategory, getDailyQuestions, getRandomQuestions } from '../data/questions'
import QuizQuestion from '../components/QuizQuestion'
import { Brain, Trophy, Clock, ArrowRight, Home } from 'lucide-react'

const QuizPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { state: quizState, startQuiz, answerQuestion, finishQuiz } = useQuiz()
  const { state: userState, addXP, updateScore } = useUser()
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isAnswered, setIsAnswered] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [sessionStartTime] = useState(Date.now())

  const category = searchParams.get('category')
  const mode = searchParams.get('mode')

  useEffect(() => {
    if (!quizState.currentSession) {
      initializeQuiz()
    }
  }, [])

  const initializeQuiz = () => {
    let questions
    if (mode === 'daily') {
      questions = getDailyQuestions()
    } else if (category) {
      questions = getQuestionsByCategory(category)
    } else {
      questions = getRandomQuestions(10)
    }

    if (questions.length === 0) {
      alert('Keine Fragen für diese Kategorie verfügbar!')
      navigate('/')
      return
    }

    startQuiz(category as any || 'game-knowledge', questions)
  }

  const handleAnswer = (selectedOption: number, timeSpent: number) => {
    if (!quizState.currentSession) return

    answerQuestion(selectedOption, timeSpent)
    setIsAnswered(true)

    // Wait 3 seconds before moving to next question
    setTimeout(() => {
      if (currentQuestionIndex < quizState.currentSession!.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setIsAnswered(false)
      } else {
        finishQuizSession()
      }
    }, 3000)
  }

  const finishQuizSession = () => {
    if (!quizState.currentSession) return

    const sessionEndTime = Date.now()
    const totalTime = Math.round((sessionEndTime - sessionStartTime) / 1000)
    const correctAnswers = quizState.currentSession.answers.filter(a => a.isCorrect).length
    const totalQuestions = quizState.currentSession.questions.length
    const score = quizState.currentSession.score

    // Calculate XP
    let xpEarned = correctAnswers * 10 // Base XP per correct answer
    if (correctAnswers === totalQuestions) {
      xpEarned += 100 // Perfect quiz bonus
    }

    // Add XP and update score
    addXP(xpEarned)
    updateScore(score)

    const result = {
      sessionId: quizState.currentSession.id,
      score,
      totalQuestions,
      correctAnswers,
      timeSpent: totalTime,
      xpEarned,
      achievements: [],
      date: new Date()
    }

    finishQuiz(result)
    setShowResults(true)
  }

  const getCurrentQuestion = () => {
    if (!quizState.currentSession) return null
    return quizState.currentSession.questions[currentQuestionIndex]
  }

  const getProgressPercentage = () => {
    if (!quizState.currentSession) return 0
    return ((currentQuestionIndex + 1) / quizState.currentSession.questions.length) * 100
  }

  if (!quizState.currentSession) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-n64-purple mx-auto"></div>
        <p className="text-white mt-4">Quiz wird geladen...</p>
      </div>
    )
  }

  if (showResults) {
    const result = {
      sessionId: quizState.currentSession.id,
      score: quizState.currentSession.score,
      totalQuestions: quizState.currentSession.questions.length,
      correctAnswers: quizState.currentSession.answers.filter(a => a.isCorrect).length,
      timeSpent: Math.round((Date.now() - sessionStartTime) / 1000),
      xpEarned: quizState.currentSession.answers.filter(a => a.isCorrect).length * 10,
      achievements: [],
      date: new Date()
    }

    return (
      <div className="max-w-2xl mx-auto">
        <div className="quiz-card text-center">
          <h2 className="font-pixel text-3xl text-white mb-6">🎉 Quiz beendet!</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-n64-green/20 to-n64-blue/20 rounded-lg p-4">
              <div className="score-display">{result.score}</div>
              <p className="text-white/70 text-sm">Punkte</p>
            </div>
            <div className="bg-gradient-to-br from-n64-yellow/20 to-n64-red/20 rounded-lg p-4">
              <div className="score-display">{result.correctAnswers}/{result.totalQuestions}</div>
              <p className="text-white/70 text-sm">Richtige Antworten</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="text-n64-yellow" size={20} />
              <span className="text-white/70">
                Zeit: {Math.floor(result.timeSpent / 60)}:{(result.timeSpent % 60).toString().padStart(2, '0')}
              </span>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <Brain className="text-n64-purple" size={20} />
              <span className="text-white/70">
                XP verdient: +{result.xpEarned}
              </span>
            </div>

            {result.correctAnswers === result.totalQuestions && (
              <div className="bg-gradient-to-br from-n64-yellow/20 to-n64-red/20 rounded-lg p-4 border border-n64-yellow/30">
                <Trophy className="text-n64-yellow mx-auto mb-2" size={32} />
                <p className="font-pixel text-n64-yellow">Perfektes Quiz! +100 XP Bonus!</p>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="retro-button flex items-center space-x-2"
            >
              <Home size={16} />
              <span>Zurück zum Start</span>
            </button>
            <button 
              onClick={() => {
                setShowResults(false)
                setCurrentQuestionIndex(0)
                setIsAnswered(false)
                initializeQuiz()
              }}
              className="retro-button flex items-center space-x-2"
            >
              <Brain size={16} />
              <span>Neues Quiz</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = getCurrentQuestion()
  if (!currentQuestion) return null

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="font-pixel text-white">
            Frage {currentQuestionIndex + 1} von {quizState.currentSession.questions.length}
          </span>
          <span className="font-pixel text-n64-yellow">
            {quizState.currentSession.score} Punkte
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-n64-green to-n64-blue h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <QuizQuestion
        question={currentQuestion}
        onAnswer={handleAnswer}
        timeLimit={30}
        isAnswered={isAnswered}
      />

      {/* Navigation */}
      {isAnswered && (
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 text-white/70">
            <span className="font-retro">Nächste Frage in 3 Sekunden...</span>
            <ArrowRight className="animate-pulse" size={16} />
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizPage
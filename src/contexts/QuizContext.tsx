import React, { createContext, useContext, useState, ReactNode } from 'react'
import { QuizQuestion, QuizResult, QuizContextType } from '../types'
import { useLanguage } from './LanguageContext'
import { usePoints } from './PointsContext'

const QuizContext = createContext<QuizContextType | undefined>(undefined)

// Quiz questions will be generated dynamically based on language
const getQuizQuestions = (t: (key: any) => string): QuizQuestion[] => [
  {
    id: '1',
    question: t('quiz.question1'),
    options: ['Super Mario 64', 'Pilotwings 64', 'Wave Race 64', 'Saikyō Habu Shōgi'],
    correctAnswer: 0,
    difficulty: 'easy',
    category: t('quiz.category.history'),
    explanation: t('quiz.question1.explanation')
  },
  {
    id: '2',
    question: t('quiz.question2'),
    options: ['100', '120', '150', '180'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: t('quiz.category.mario'),
    explanation: t('quiz.question2.explanation')
  }
]

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useLanguage()
  const { awardPoints } = usePoints()
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [totalQuestions] = useState(10)
  const [score, setScore] = useState(0)
  const [timeStarted, setTimeStarted] = useState<Date | null>(null)
  const [isQuizActive, setIsQuizActive] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)

  const startQuiz = (difficulty?: string, category?: string) => {
    const questions = getQuizQuestions(t)
    setCurrentQuestion(questions[0])
    setCurrentQuestionIndex(0)
    setScore(0)
    setTimeStarted(new Date())
    setIsQuizActive(true)
    setQuizResult(null)
  }

  const answerQuestion = async (answerIndex: number) => {
    if (currentQuestion && answerIndex === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1)
      // Award points for correct answer
      try {
        await awardPoints('quiz.answerCorrect', `Correct answer: ${currentQuestion.question}`)
      } catch (error) {
        console.error('Failed to award points for correct answer:', error)
      }
    }
  }

  const nextQuestion = () => {
    const questions = getQuizQuestions(t)
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex)
      setCurrentQuestion(questions[nextIndex])
    } else {
      finishQuiz()
    }
  }

  const finishQuiz = async () => {
    const questions = getQuizQuestions(t)
    const actualQuestionCount = questions.length
    const timeSpent = timeStarted ? Date.now() - timeStarted.getTime() : 0
    const result: QuizResult = {
      score: Math.round((score / actualQuestionCount) * 100),
      totalQuestions: actualQuestionCount,
      correctAnswers: score,
      timeSpent: Math.round(timeSpent / 1000),
      xpEarned: score * 10
    }
    
    // Award bonus points for perfect quiz
    if (score === actualQuestionCount) {
      try {
        await awardPoints('quiz.fullPerfect', `Perfect quiz completed: ${score}/${actualQuestionCount}`)
      } catch (error) {
        console.error('Failed to award points for perfect quiz:', error)
      }
    }
    
    setQuizResult(result)
    setIsQuizActive(false)
  }

  const resetQuiz = () => {
    setCurrentQuestion(null)
    setCurrentQuestionIndex(0)
    setScore(0)
    setTimeStarted(null)
    setIsQuizActive(false)
    setQuizResult(null)
  }

  const value: QuizContextType = {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    score,
    timeStarted,
    isQuizActive,
    quizResult,
    startQuiz,
    answerQuestion,
    nextQuestion,
    finishQuiz,
    resetQuiz
  }

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  )
}

export const useQuiz = () => {
  const context = useContext(QuizContext)
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider')
  }
  return context
}
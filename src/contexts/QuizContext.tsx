import React, { createContext, useContext, useState, ReactNode } from 'react'
import { QuizQuestion, QuizResult, QuizContextType } from '../types'

const QuizContext = createContext<QuizContextType | undefined>(undefined)

const mockQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'Welches N64-Spiel wurde als erstes veröffentlicht?',
    options: ['Super Mario 64', 'Pilotwings 64', 'Wave Race 64', 'Saikyō Habu Shōgi'],
    correctAnswer: 0,
    difficulty: 'easy',
    category: 'Geschichte',
    explanation: 'Super Mario 64 war ein Launch-Titel für das Nintendo 64 in Japan im Jahr 1996.'
  },
  {
    id: '2',
    question: 'Wie viele Sterne gibt es insgesamt in Super Mario 64?',
    options: ['100', '120', '150', '180'],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'Mario',
    explanation: 'Super Mario 64 hat insgesamt 120 Sterne zu sammeln.'
  }
]

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [totalQuestions] = useState(10)
  const [score, setScore] = useState(0)
  const [timeStarted, setTimeStarted] = useState<Date | null>(null)
  const [isQuizActive, setIsQuizActive] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)

  const startQuiz = (difficulty?: string, category?: string) => {
    setCurrentQuestion(mockQuestions[0])
    setCurrentQuestionIndex(0)
    setScore(0)
    setTimeStarted(new Date())
    setIsQuizActive(true)
    setQuizResult(null)
  }

  const answerQuestion = (answerIndex: number) => {
    if (currentQuestion && answerIndex === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1)
    }
  }

  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex < mockQuestions.length) {
      setCurrentQuestionIndex(nextIndex)
      setCurrentQuestion(mockQuestions[nextIndex])
    } else {
      finishQuiz()
    }
  }

  const finishQuiz = () => {
    const timeSpent = timeStarted ? Date.now() - timeStarted.getTime() : 0
    const result: QuizResult = {
      score: Math.round((score / totalQuestions) * 100),
      totalQuestions,
      correctAnswers: score,
      timeSpent: Math.round(timeSpent / 1000),
      xpEarned: score * 10
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
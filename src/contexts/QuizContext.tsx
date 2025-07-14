import React, { createContext, useContext, useState, useCallback } from 'react'
import { QuizSession, QuizQuestion, QuizCategory, Answer, QuizContextType } from '../types'
import { getRandomQuestions, getDailyQuestions, getQuestionsByCategory } from '../data/questions'

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export const useQuiz = () => {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider')
  }
  return context
}

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null)

  const startQuiz = useCallback((mode: QuizSession['mode'], category?: QuizCategory) => {
    let questions: QuizQuestion[]
    
    switch (mode) {
      case 'daily':
        questions = getDailyQuestions()
        break
      case 'single':
        questions = category ? getQuestionsByCategory(category) : getRandomQuestions(10)
        break
      case 'speed':
        questions = getRandomQuestions(10)
        break
      case 'weekly':
        questions = getRandomQuestions(20)
        break
      default:
        questions = getRandomQuestions(10)
    }

    const session: QuizSession = {
      id: Date.now().toString(),
      mode,
      questions,
      currentQuestionIndex: 0,
      answers: [],
      startTime: new Date(),
      score: 0,
      maxScore: questions.reduce((sum, q) => sum + q.points, 0),
    }

    setCurrentSession(session)
  }, [])

  const answerQuestion = useCallback((answer: string | string[]) => {
    if (!currentSession) return

    const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex]
    const isCorrect = Array.isArray(currentQuestion.correctAnswer)
      ? JSON.stringify(currentQuestion.correctAnswer.sort()) === JSON.stringify(Array.isArray(answer) ? answer.sort() : [answer])
      : currentQuestion.correctAnswer === answer

    const points = isCorrect ? currentQuestion.points : 0

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      userAnswer: answer,
      isCorrect,
      timeSpent: 0, // TODO: Implement timer
      points,
    }

    const updatedSession: QuizSession = {
      ...currentSession,
      answers: [...currentSession.answers, newAnswer],
      score: currentSession.score + points,
      currentQuestionIndex: currentSession.currentQuestionIndex + 1,
    }

    setCurrentSession(updatedSession)
  }, [currentSession])

  const endQuiz = useCallback(() => {
    if (!currentSession) return

    const updatedSession: QuizSession = {
      ...currentSession,
      endTime: new Date(),
    }

    setCurrentSession(updatedSession)
  }, [currentSession])

  const getQuestion = useCallback((): QuizQuestion | null => {
    if (!currentSession || currentSession.currentQuestionIndex >= currentSession.questions.length) {
      return null
    }
    return currentSession.questions[currentSession.currentQuestionIndex]
  }, [currentSession])

  const getProgress = useCallback(() => {
    if (!currentSession) return { current: 0, total: 0, percentage: 0 }
    
    const current = currentSession.currentQuestionIndex
    const total = currentSession.questions.length
    const percentage = total > 0 ? (current / total) * 100 : 0
    
    return { current, total, percentage }
  }, [currentSession])

  const getScore = useCallback(() => {
    if (!currentSession) return { current: 0, max: 0, percentage: 0 }
    
    const current = currentSession.score
    const max = currentSession.maxScore
    const percentage = max > 0 ? (current / max) * 100 : 0
    
    return { current, max, percentage }
  }, [currentSession])

  const value: QuizContextType = {
    currentSession,
    startQuiz,
    answerQuestion,
    endQuiz,
    getQuestion,
    getProgress,
    getScore,
  }

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  )
}
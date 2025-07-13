import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Question, QuizSession, QuizResult, QuizCategory, DuelSession } from '../types/quiz'

interface QuizState {
  currentSession: QuizSession | null
  currentDuel: DuelSession | null
  questions: Question[]
  loading: boolean
  error: string | null
}

type QuizAction = 
  | { type: 'START_SESSION'; payload: QuizSession }
  | { type: 'ANSWER_QUESTION'; payload: { questionId: string; selectedOption: number; timeSpent: number } }
  | { type: 'FINISH_SESSION'; payload: QuizResult }
  | { type: 'SET_QUESTIONS'; payload: Question[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'START_DUEL'; payload: DuelSession }
  | { type: 'UPDATE_DUEL_SCORE'; payload: { player: 'player1' | 'player2'; score: number } }
  | { type: 'RESET_SESSION' }

const initialState: QuizState = {
  currentSession: null,
  currentDuel: null,
  questions: [],
  loading: false,
  error: null
}

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        currentSession: action.payload,
        error: null
      }
    case 'ANSWER_QUESTION':
      if (!state.currentSession) return state
      const currentQuestion = state.currentSession.questions[state.currentSession.currentQuestionIndex]
      const isCorrect = action.payload.selectedOption === currentQuestion.correctAnswer
      const newScore = state.currentSession.score + (isCorrect ? currentQuestion.points : 0)
      
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          score: newScore,
          currentQuestionIndex: state.currentSession.currentQuestionIndex + 1,
          answers: [
            ...state.currentSession.answers,
            {
              questionId: action.payload.questionId,
              selectedOption: action.payload.selectedOption,
              isCorrect,
              timeSpent: action.payload.timeSpent
            }
          ]
        }
      }
    case 'FINISH_SESSION':
      return {
        ...state,
        currentSession: null,
        error: null
      }
    case 'SET_QUESTIONS':
      return {
        ...state,
        questions: action.payload
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      }
    case 'START_DUEL':
      return {
        ...state,
        currentDuel: action.payload,
        error: null
      }
    case 'UPDATE_DUEL_SCORE':
      if (!state.currentDuel) return state
      return {
        ...state,
        currentDuel: {
          ...state.currentDuel,
          [action.payload.player === 'player1' ? 'player1Score' : 'player2Score']: action.payload.score
        }
      }
    case 'RESET_SESSION':
      return {
        ...state,
        currentSession: null,
        currentDuel: null,
        error: null
      }
    default:
      return state
  }
}

interface QuizContextType {
  state: QuizState
  dispatch: React.Dispatch<QuizAction>
  startQuiz: (category: QuizCategory, questions: Question[]) => void
  answerQuestion: (selectedOption: number, timeSpent: number) => void
  finishQuiz: (result: QuizResult) => void
  startDuel: (duelSession: DuelSession) => void
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  const startQuiz = (category: QuizCategory, questions: Question[]) => {
    const session: QuizSession = {
      id: `quiz_${Date.now()}`,
      category,
      questions,
      currentQuestionIndex: 0,
      score: 0,
      totalQuestions: questions.length,
      startTime: new Date(),
      answers: []
    }
    dispatch({ type: 'START_SESSION', payload: session })
  }

  const answerQuestion = (selectedOption: number, timeSpent: number) => {
    if (!state.currentSession) return
    const currentQuestion = state.currentSession.questions[state.currentSession.currentQuestionIndex]
    dispatch({
      type: 'ANSWER_QUESTION',
      payload: {
        questionId: currentQuestion.id,
        selectedOption,
        timeSpent
      }
    })
  }

  const finishQuiz = (result: QuizResult) => {
    dispatch({ type: 'FINISH_SESSION', payload: result })
  }

  const startDuel = (duelSession: DuelSession) => {
    dispatch({ type: 'START_DUEL', payload: duelSession })
  }

  return (
    <QuizContext.Provider value={{ 
      state, 
      dispatch, 
      startQuiz, 
      answerQuestion, 
      finishQuiz, 
      startDuel 
    }}>
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
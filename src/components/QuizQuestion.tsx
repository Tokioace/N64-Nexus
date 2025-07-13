import React, { useState, useEffect } from 'react'
import { Question } from '../types/quiz'
import { CheckCircle, XCircle, Clock, Volume2 } from 'lucide-react'

interface QuizQuestionProps {
  question: Question
  onAnswer: (selectedOption: number, timeSpent: number) => void
  timeLimit?: number
  isAnswered: boolean
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswer,
  timeLimit = 30,
  isAnswered
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [startTime] = useState(Date.now())
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    if (isAnswered) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - auto-submit
          handleAnswer(question.correctAnswer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isAnswered, question.correctAnswer])

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return

    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    const correct = optionIndex === question.correctAnswer
    
    setSelectedOption(optionIndex)
    setIsCorrect(correct)
    setShowExplanation(true)
    
    onAnswer(optionIndex, timeSpent)
  }

  const getOptionClass = (index: number) => {
    if (!isAnswered) {
      return `answer-option ${selectedOption === index ? 'bg-white/20 border-n64-green/50' : ''}`
    }
    
    if (index === question.correctAnswer) {
      return 'answer-option correct'
    }
    
    if (selectedOption === index && index !== question.correctAnswer) {
      return 'answer-option incorrect'
    }
    
    return 'answer-option opacity-50'
  }

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'image-recognition':
        return (
          <div className="mb-6">
            {question.imageUrl && (
              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <img 
                  src={question.imageUrl} 
                  alt="Quiz question" 
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              </div>
            )}
          </div>
        )
      
      case 'audio':
        return (
          <div className="mb-6">
            {question.audioUrl && (
              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center space-x-4">
                  <Volume2 className="text-n64-yellow" size={24} />
                  <audio controls className="w-full max-w-md">
                    <source src={question.audioUrl} type="audio/mpeg" />
                    Dein Browser unterstützt keine Audio-Wiedergabe.
                  </audio>
                </div>
              </div>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="quiz-card max-w-2xl mx-auto">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-full text-xs font-pixel ${
            question.difficulty === 'easy' ? 'bg-n64-green/30 text-n64-green' :
            question.difficulty === 'medium' ? 'bg-n64-yellow/30 text-n64-yellow' :
            'bg-n64-red/30 text-n64-red'
          }`}>
            {question.difficulty === 'easy' ? 'Einfach' :
             question.difficulty === 'medium' ? 'Mittel' : 'Schwer'}
          </div>
          <div className="text-white/70 font-retro text-sm">
            {question.points} Punkte
          </div>
        </div>
        
        {!isAnswered && (
          <div className="flex items-center space-x-2">
            <Clock className="text-n64-red" size={20} />
            <span className={`font-pixel text-lg ${timeLeft <= 10 ? 'text-n64-red animate-countdown' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>
        )}
      </div>

      {/* Question Content */}
      <div className="mb-6">
        <h3 className="font-pixel text-xl text-white mb-4 leading-relaxed">
          {question.question}
        </h3>
        {renderQuestionContent()}
      </div>

      {/* Answer Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={isAnswered}
            className={`${getOptionClass(index)} w-full text-left flex items-center justify-between`}
          >
            <span className="font-retro text-white">{option}</span>
            {isAnswered && (
              <div className="flex items-center space-x-2">
                {index === question.correctAnswer && (
                  <CheckCircle className="text-n64-green" size={20} />
                )}
                {selectedOption === index && index !== question.correctAnswer && (
                  <XCircle className="text-n64-red" size={20} />
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Explanation */}
      {showExplanation && question.explanation && (
        <div className="bg-gradient-to-r from-n64-blue/20 to-n64-purple/20 rounded-lg p-4 border border-n64-blue/30">
          <h4 className="font-pixel text-white mb-2">💡 Erklärung:</h4>
          <p className="text-white/80 font-retro text-sm leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}

      {/* Result Feedback */}
      {isAnswered && (
        <div className={`mt-4 p-4 rounded-lg text-center ${
          isCorrect 
            ? 'bg-n64-green/20 border border-n64-green/30' 
            : 'bg-n64-red/20 border border-n64-red/30'
        }`}>
          <div className="flex items-center justify-center space-x-2">
            {isCorrect ? (
              <>
                <CheckCircle className="text-n64-green" size={24} />
                <span className="font-pixel text-n64-green text-lg">Richtig!</span>
              </>
            ) : (
              <>
                <XCircle className="text-n64-red" size={24} />
                <span className="font-pixel text-n64-red text-lg">Falsch!</span>
              </>
            )}
          </div>
          <p className="text-white/70 text-sm mt-2">
            {isCorrect ? `+${question.points} Punkte` : 'Keine Punkte'}
          </p>
        </div>
      )}
    </div>
  )
}

export default QuizQuestion
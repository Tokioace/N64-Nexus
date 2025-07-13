import React from 'react'
import { Link } from 'react-router-dom'
import { useQuiz } from '../contexts/QuizContext'
import { useUser } from '../contexts/UserContext'
import { Trophy, Share2, Home, RefreshCw } from 'lucide-react'

const QuizResultPage: React.FC = () => {
  const { currentSession, getScore } = useQuiz()
  const { user } = useUser()

  if (!currentSession || !user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="card text-center">
          <p>Keine Quiz-Session gefunden.</p>
          <Link to="/" className="btn-primary mt-4 inline-block">
            Zurück zum Start
          </Link>
        </div>
      </div>
    )
  }

  const score = getScore()
  const correctAnswers = currentSession.answers.filter(a => a.isCorrect).length
  const totalQuestions = currentSession.questions.length
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100)

  const getRank = () => {
    if (accuracy >= 90) return { rank: 'S', color: 'text-yellow-400', title: 'Perfekt!' }
    if (accuracy >= 80) return { rank: 'A', color: 'text-green-400', title: 'Sehr gut!' }
    if (accuracy >= 70) return { rank: 'B', color: 'text-blue-400', title: 'Gut!' }
    if (accuracy >= 60) return { rank: 'C', color: 'text-yellow-500', title: 'Befriedigend' }
    if (accuracy >= 50) return { rank: 'D', color: 'text-orange-400', title: 'Ausreichend' }
    return { rank: 'F', color: 'text-red-400', title: 'Verbesserungsbedarf' }
  }

  const rank = getRank()

  const shareResult = () => {
    const text = `Ich habe gerade ${score.current}/${score.max} Punkte im Battle64 Quiz erreicht! 🎮`
    if (navigator.share) {
      navigator.share({
        title: 'Battle64 Quiz Ergebnis',
        text,
        url: window.location.origin,
      })
    } else {
      navigator.clipboard.writeText(text)
      alert('Ergebnis in die Zwischenablage kopiert!')
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-shadow mb-2">
          Quiz beendet! 🎉
        </h1>
        <p className="text-white/70">
          {currentSession.mode === 'daily' ? 'Tägliche Challenge' : 
           currentSession.mode === 'speed' ? 'Speed Quiz' : 
           'Klassisches Quiz'}
        </p>
      </div>

      {/* Score Display */}
      <div className="card text-center mb-6">
        <div className="text-6xl font-bold mb-4">
          <span className={rank.color}>{rank.rank}</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">{rank.title}</h2>
        <div className="text-4xl font-bold text-n64-purple mb-2">
          {score.current} / {score.max}
        </div>
        <div className="text-white/70">
          {correctAnswers} von {totalQuestions} Fragen richtig ({accuracy}%)
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-n64-green">{accuracy}%</div>
          <div className="text-sm text-white/70">Genauigkeit</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-n64-blue">{correctAnswers}</div>
          <div className="text-sm text-white/70">Richtige Antworten</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-n64-yellow">{totalQuestions - correctAnswers}</div>
          <div className="text-sm text-white/70">Falsche Antworten</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-n64-purple">+{score.current}</div>
          <div className="text-sm text-white/70">Punkte verdient</div>
        </div>
      </div>

      {/* Question Review */}
      <div className="card mb-6">
        <h3 className="text-xl font-bold mb-4">Fragenübersicht</h3>
        <div className="space-y-3">
          {currentSession.answers.map((answer, index) => {
            const question = currentSession.questions[index]
            return (
              <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className={`text-xl ${answer.isCorrect ? 'text-n64-green' : 'text-n64-red'}`}>
                  {answer.isCorrect ? '✓' : '✗'}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {question.question.substring(0, 50)}...
                  </div>
                  <div className="text-xs text-white/50">
                    +{answer.points} Punkte
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={shareResult}
          className="btn-secondary w-full flex items-center justify-center space-x-2"
        >
          <Share2 size={20} />
          <span>Ergebnis teilen</span>
        </button>

        <Link to="/quiz" className="block">
          <button className="btn-primary w-full flex items-center justify-center space-x-2">
            <RefreshCw size={20} />
            <span>Neues Quiz</span>
          </button>
        </Link>

        <Link to="/" className="block">
          <button className="btn-success w-full flex items-center justify-center space-x-2">
            <Home size={20} />
            <span>Zurück zum Start</span>
          </button>
        </Link>
      </div>

      {/* Achievements */}
      {user.achievements.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-shadow mb-4">Neue Errungenschaften</h3>
          <div className="space-y-2">
            {user.achievements.slice(-2).map((achievement) => (
              <div key={achievement.id} className="card flex items-center space-x-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="font-bold">{achievement.name}</div>
                  <div className="text-sm text-white/70">{achievement.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizResultPage
import React from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { Brain, Clock, Calendar, Zap, Trophy, Star } from 'lucide-react'

const HomePage: React.FC = () => {
  const { user } = useUser()

  if (!user) return null

  const accuracy = user.totalAnswers > 0 
    ? Math.round((user.correctAnswers / user.totalAnswers) * 100) 
    : 0

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-shadow mb-2">
          🎮 Willkommen, {user.username}!
        </h1>
        <p className="text-white/70">
          Level {user.level} • {user.points} Punkte
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-n64-green">{accuracy}%</div>
          <div className="text-sm text-white/70">Genauigkeit</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-n64-blue">{user.totalQuizzes}</div>
          <div className="text-sm text-white/70">Quizzes gespielt</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-n64-yellow">{user.correctAnswers}</div>
          <div className="text-sm text-white/70">Richtige Antworten</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-n64-purple">{user.achievements.length}</div>
          <div className="text-sm text-white/70">Errungenschaften</div>
        </div>
      </div>

      {/* Quiz Modes */}
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-bold text-shadow mb-4">Quiz-Modi</h2>
        
        <Link to="/quiz" className="block">
          <div className="card hover:bg-white/15 transition-all duration-200">
            <div className="flex items-center space-x-4">
              <div className="bg-n64-purple/20 p-3 rounded-lg">
                <Brain className="text-n64-purple" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Klassisches Quiz</h3>
                <p className="text-white/70 text-sm">10 zufällige Fragen zu N64</p>
              </div>
              <div className="text-n64-purple">
                <Star size={20} />
              </div>
            </div>
          </div>
        </Link>

        <Link to="/quiz?mode=daily" className="block">
          <div className="card hover:bg-white/15 transition-all duration-200">
            <div className="flex items-center space-x-4">
              <div className="bg-n64-blue/20 p-3 rounded-lg">
                <Calendar className="text-n64-blue" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Tägliche Challenge</h3>
                <p className="text-white/70 text-sm">5 Fragen, jeden Tag neu</p>
              </div>
              <div className="text-n64-blue">
                <Clock size={20} />
              </div>
            </div>
          </div>
        </Link>

        <Link to="/quiz?mode=speed" className="block">
          <div className="card hover:bg-white/15 transition-all duration-200">
            <div className="flex items-center space-x-4">
              <div className="bg-n64-red/20 p-3 rounded-lg">
                <Zap className="text-n64-red" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Speed Quiz</h3>
                <p className="text-white/70 text-sm">10 Sekunden pro Frage</p>
              </div>
              <div className="text-n64-red">
                <Zap size={20} />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/minigames" className="card text-center hover:bg-white/15 transition-all duration-200">
          <div className="text-3xl mb-2">🎮</div>
          <div className="font-bold">Minigames</div>
          <div className="text-sm text-white/70">Spaßige Spiele</div>
        </Link>
        
        <Link to="/leaderboard" className="card text-center hover:bg-white/15 transition-all duration-200">
          <div className="text-3xl mb-2">🏆</div>
          <div className="font-bold">Rangliste</div>
          <div className="text-sm text-white/70">Vergleiche dich</div>
        </Link>
      </div>

      {/* Recent Achievements */}
      {user.achievements.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-shadow mb-4">Letzte Errungenschaften</h2>
          <div className="space-y-2">
            {user.achievements.slice(-3).map((achievement) => (
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

export default HomePage
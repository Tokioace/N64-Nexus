import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { Brain, Clock, Calendar, Zap, Trophy, Star, Gamepad2 } from 'lucide-react'
import SimpleCard from '../components/SimpleCard'
import SimpleButton from '../components/SimpleButton'

const HomePage: React.FC = () => {
  const { user } = useUser()
  const navigate = useNavigate()

  if (!user) return null

  const accuracy = user.totalAnswers > 0 
    ? Math.round((user.correctAnswers / user.totalAnswers) * 100) 
    : 0

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🎮 Willkommen, {user.username}!
        </h1>
        <p className="text-gray-600 text-lg">
          Level {user.level} • {user.points} Punkte
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <SimpleCard className="text-center">
          <div className="text-2xl font-bold text-blue-600">{user.points}</div>
          <div className="text-sm text-gray-600">Punkte</div>
        </SimpleCard>
        
        <SimpleCard className="text-center">
          <div className="text-2xl font-bold text-green-600">{user.level}</div>
          <div className="text-sm text-gray-600">Level</div>
        </SimpleCard>
        
        <SimpleCard className="text-center">
          <div className="text-2xl font-bold text-purple-600">{user.correctAnswers}</div>
          <div className="text-sm text-gray-600">Richtig</div>
        </SimpleCard>
        
        <SimpleCard className="text-center">
          <div className="text-2xl font-bold text-orange-600">{accuracy}%</div>
          <div className="text-sm text-gray-600">Genauigkeit</div>
        </SimpleCard>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Quiz Card */}
        <SimpleCard className="p-6">
          <div className="flex items-center mb-4">
            <Brain className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Quiz starten</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Teste dein Wissen über Nintendo 64 Spiele und sammle Punkte!
          </p>
          <div className="space-y-3">
            <Link to="/quiz?mode=single">
              <SimpleButton variant="primary" className="w-full">
                Einzelnes Quiz
              </SimpleButton>
            </Link>
            <Link to="/quiz?mode=daily">
              <SimpleButton variant="secondary" className="w-full">
                Tägliches Quiz
              </SimpleButton>
            </Link>
            <Link to="/quiz?mode=speed">
              <SimpleButton variant="warning" className="w-full">
                Speed Quiz
              </SimpleButton>
            </Link>
          </div>
        </SimpleCard>

        {/* Achievements Card */}
        <SimpleCard className="p-6">
          <div className="flex items-center mb-4">
            <Trophy className="w-8 h-8 text-yellow-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Erfolge</h2>
          </div>
          <div className="space-y-3">
            {user.achievements.slice(0, 3).map((achievement, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Star className="w-5 h-5 text-yellow-500 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">{achievement.name}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                </div>
              </div>
            ))}
          </div>
          <Link to="/profile" className="block mt-4">
            <SimpleButton variant="secondary" className="w-full">
              Alle Erfolge anzeigen
            </SimpleButton>
          </Link>
        </SimpleCard>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/leaderboard">
          <SimpleCard className="p-4 text-center hover:bg-gray-50 transition-colors">
            <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="font-medium text-gray-900">Bestenliste</div>
          </SimpleCard>
        </Link>
        
        <Link to="/events">
          <SimpleCard className="p-4 text-center hover:bg-gray-50 transition-colors">
            <Calendar className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="font-medium text-gray-900">Events</div>
          </SimpleCard>
        </Link>
        
        <Link to="/minigames">
          <SimpleCard className="p-4 text-center hover:bg-gray-50 transition-colors">
            <Gamepad2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="font-medium text-gray-900">Minispiele</div>
          </SimpleCard>
        </Link>
        
        <Link to="/profile">
          <SimpleCard className="p-4 text-center hover:bg-gray-50 transition-colors">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="font-medium text-gray-900">Profil</div>
          </SimpleCard>
        </Link>
      </div>
    </div>
  )
}

export default HomePage
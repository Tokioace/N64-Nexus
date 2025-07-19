import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useAvatar } from '../contexts/AvatarContext'
import { useFace } from '../contexts/FaceContext'
import AvatarRenderer from '../components/AvatarRenderer'
import FaceRenderer from '../components/FaceRenderer'
import AvatarCreator from '../components/AvatarCreator'
import { LogOut, Settings, Trophy, Target, Clock, Star, Edit, Gamepad2, User, Sparkles } from 'lucide-react'

const ProfilePage: React.FC = () => {
  const { user, logout } = useUser()
  const { saveAvatar } = useAvatar()
  const { currentFace } = useFace()
  const [showAvatarCreator, setShowAvatarCreator] = useState(false)

  if (!user) return null

  const accuracy = user.totalAnswers > 0 
    ? Math.round((user.correctAnswers / user.totalAnswers) * 100) 
    : 0

  const getLevelProgress = () => {
    const pointsInCurrentLevel = user.points % 100
    return (pointsInCurrentLevel / 100) * 100
  }

  const getNextLevelPoints = () => {
    return user.level * 100
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center space-x-8 mb-6">
          {/* Face Creator (New System) */}
          <div className="relative">
            <div className="text-center mb-2">
              <div className="flex items-center justify-center space-x-2 text-pink-400 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Face Creator</span>
                <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>
              </div>
            </div>
            {currentFace ? (
              <FaceRenderer 
                face={currentFace} 
                size="xl" 
                animate={true}
                className="mx-auto"
              />
            ) : (
              <div className="w-48 h-56 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto border border-pink-400/30">
                <div className="text-center text-pink-300">
                  <User className="w-12 h-12 mx-auto mb-2" />
                  <div className="text-sm">Create Your Face</div>
                </div>
              </div>
            )}
            <Link
              to="/face-creator"
              className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
            >
              <Edit className="w-5 h-5 text-white" />
            </Link>
          </div>

          {/* Classic Avatar (Legacy System) */}
          <div className="relative">
            <div className="text-center mb-2">
              <div className="flex items-center justify-center space-x-2 text-blue-400 mb-2">
                <Gamepad2 className="w-4 h-4" />
                <span className="text-sm font-medium">Classic Avatar</span>
              </div>
            </div>
            {user.avatar ? (
              <AvatarRenderer 
                avatar={user.avatar} 
                size="xl" 
                animate={true}
                className="mx-auto"
              />
            ) : (
              <div className="w-48 h-48 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto text-4xl">
                👤
              </div>
            )}
            <button
              onClick={() => setShowAvatarCreator(true)}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Edit className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white flex items-center justify-center">
          <Gamepad2 className="mr-2 text-blue-400" />
          {user.username}
        </h1>
        <p className="text-white/70">
          Level {user.level} • {user.points} Punkte
        </p>
      </div>

      {/* Level Progress */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white/70">Level Fortschritt</span>
          <span className="text-sm font-bold">
            {user.points % 100} / 100 Punkte
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3 mb-2">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${getLevelProgress()}%` }}
          ></div>
        </div>
        <div className="text-xs text-white/50">
          Nächstes Level in {getNextLevelPoints() - user.points} Punkten
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
          <div className="text-sm text-white/70">Genauigkeit</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{user.totalQuizzes}</div>
          <div className="text-sm text-white/70">Quizzes gespielt</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">{user.correctAnswers}</div>
          <div className="text-sm text-white/70">Richtige Antworten</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{user.achievements.length}</div>
          <div className="text-sm text-white/70">Errungenschaften</div>
        </div>
      </div>

      {/* Category Progress */}
      <div className="card mb-6">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Target className="mr-2" size={20} />
          Kategorie-Fortschritt
        </h3>
        <div className="space-y-3">
          {Object.entries(user.quizProgress.categories).map(([category, stats]) => {
            const percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
            return (
              <div key={category} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium capitalize">{category}</div>
                  <div className="text-sm text-white/70">
                    {stats.correct} von {stats.total} richtig
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">{percentage}%</div>
                  <div className="w-16 bg-white/10 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="card mb-6">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Trophy className="mr-2" size={20} />
          Errungenschaften ({user.achievements.length})
        </h3>
        {user.achievements.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {user.achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="font-bold">{achievement.name}</div>
                  <div className="text-sm text-white/70">{achievement.description}</div>
                  <div className="text-xs text-white/50">
                    Freigeschaltet am {achievement.unlockedAt.toLocaleDateString('de-DE')}
                  </div>
                </div>
                <div className="text-xs text-white/50 capitalize">
                  {achievement.rarity}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-white/50">
            <Star className="mx-auto mb-2" size={32} />
            <p>Noch keine Errungenschaften freigeschaltet</p>
            <p className="text-sm">Spiele Quizzes um Errungenschaften zu sammeln!</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="card mb-6">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <Clock className="mr-2" size={20} />
          Letzte Aktivität
        </h3>
        <div className="space-y-2 text-sm text-white/70">
          <div className="flex justify-between">
            <span>Letzter Quiz gespielt</span>
            <span>Heute</span>
          </div>
          <div className="flex justify-between">
            <span>Beste Punktzahl</span>
            <span className="text-blue-600 font-bold">150 Punkte</span>
          </div>
          <div className="flex justify-between">
            <span>Längste Serie</span>
            <span>8 richtige Antworten</span>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-3">
        <button className="card w-full flex items-center justify-between hover:bg-white/15 transition-all duration-200">
          <div className="flex items-center space-x-3">
            <Settings size={20} />
            <span>Einstellungen</span>
          </div>
          <div className="text-white/50">→</div>
        </button>

        <button 
          onClick={logout}
          className="card w-full flex items-center justify-between hover:bg-white/15 transition-all duration-200 text-red-600"
        >
          <div className="flex items-center space-x-3">
            <LogOut size={20} />
            <span>Abmelden</span>
          </div>
          <div className="text-white/50">→</div>
        </button>
      </div>

      {/* Avatar Creator Modal */}
      {showAvatarCreator && (
        <div className="fixed inset-0 z-50">
          <AvatarCreator
            initialAvatar={user.avatar}
            onSave={(avatarData) => {
              saveAvatar(avatarData)
              setShowAvatarCreator(false)
            }}
            onCancel={() => setShowAvatarCreator(false)}
          />
        </div>
      )}
    </div>
  )
}

export default ProfilePage
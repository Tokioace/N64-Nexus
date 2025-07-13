import { useState } from 'react'
import { User, Trophy, Settings, Shield, Edit3 } from 'lucide-react'
import { User as UserType } from '../types'

interface ProfileProps {
  currentUser: UserType
  setCurrentUser: (user: UserType) => void
}

const Profile = ({ currentUser, setCurrentUser }: ProfileProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(currentUser.username)
  const [avatar, setAvatar] = useState(currentUser.avatar)

  const handleSave = () => {
    setCurrentUser({
      ...currentUser,
      username,
      avatar
    })
    setIsEditing(false)
  }

  const badges = [
    { name: 'Speedrunner', icon: '🏃', description: '10 Speedruns abgeschlossen' },
    { name: 'Fan Artist', icon: '🎨', description: '5 Fanart Challenges gewonnen' },
    { name: 'Quiz Master', icon: '🧠', description: 'Alle Quiz-Fragen richtig beantwortet' },
    { name: '100 Days', icon: '👑', description: '100 Tage mit Battle64' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-gaming text-white">👤 Profil</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-secondary flex items-center space-x-2"
        >
          <Edit3 size={16} />
          <span>{isEditing ? 'Abbrechen' : 'Bearbeiten'}</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={avatar}
              alt={currentUser.username}
              className="w-24 h-24 rounded-full border-4 border-n64-purple"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/96x96/6B46C1/FFFFFF?text=64'
              }}
            />
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 bg-n64-purple text-white p-2 rounded-full hover:bg-purple-700 transition-colors">
                <Edit3 size={16} />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="input-field w-full"
                  />
                </div>
                <div className="flex space-x-3">
                  <button onClick={handleSave} className="btn-success">
                    Speichern
                  </button>
                  <button onClick={() => setIsEditing(false)} className="btn-secondary">
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-medium text-white mb-2">{currentUser.username}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Level</span>
                    <p className="text-white font-medium">{currentUser.level}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">XP</span>
                    <p className="text-white font-medium">{currentUser.xp}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Freunde</span>
                    <p className="text-white font-medium">{currentUser.friends.length}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Challenges</span>
                    <p className="text-white font-medium">{currentUser.challenges.length}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-gaming text-n64-green mb-2">42</div>
          <div className="text-sm text-gray-400">Gewonnene Challenges</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-gaming text-n64-blue mb-2">156</div>
          <div className="text-sm text-gray-400">Teilgenommene Challenges</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-gaming text-n64-purple mb-2">23</div>
          <div className="text-sm text-gray-400">Erstellte Challenges</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-gaming text-n64-yellow mb-2">89%</div>
          <div className="text-sm text-gray-400">Gewinnrate</div>
        </div>
      </div>

      {/* Badges */}
      <div className="card">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
          <Trophy className="text-n64-yellow" size={20} />
          <span>Badges & Achievements</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4 text-center hover:bg-gray-600 transition-colors">
              <div className="text-3xl mb-2">{badge.icon}</div>
              <h4 className="font-medium text-white mb-1">{badge.name}</h4>
              <p className="text-sm text-gray-400">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="card">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
          <Shield className="text-n64-purple" size={20} />
          <span>Privatsphäre</span>
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <span className="font-medium text-white">Profil-Sichtbarkeit</span>
              <p className="text-sm text-gray-400">Wer kann dein Profil sehen?</p>
            </div>
            <span className="text-n64-purple font-medium capitalize">{currentUser.privacy}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <span className="font-medium text-white">Online-Status</span>
              <p className="text-sm text-gray-400">Freunden deinen Status anzeigen</p>
            </div>
            <span className="text-n64-green font-medium">Aktiviert</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <span className="font-medium text-white">Challenge-Einladungen</span>
              <p className="text-sm text-gray-400">Erlaube Freunden, dich einzuladen</p>
            </div>
            <span className="text-n64-green font-medium">Aktiviert</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-medium text-white mb-4">Letzte Aktivitäten</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-n64-green rounded-full"></div>
            <span className="text-white">Challenge "DK Jungle Speedrun" gewonnen</span>
            <span className="text-gray-400 text-sm ml-auto">vor 2 Stunden</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-n64-blue rounded-full"></div>
            <span className="text-white">Neue Challenge "Zelda Fanart" erstellt</span>
            <span className="text-gray-400 text-sm ml-auto">vor 1 Tag</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-n64-purple rounded-full"></div>
            <span className="text-white">Freund "MarioFan99" hinzugefügt</span>
            <span className="text-gray-400 text-sm ml-auto">vor 3 Tagen</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
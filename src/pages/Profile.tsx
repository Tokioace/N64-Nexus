import { useGameData } from '../contexts/GameDataContext'
import { User } from '../types'
import { User as UserIcon, Trophy, Calendar, TrendingUp, Award } from 'lucide-react'

interface ProfileProps {
  user: User
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const { getUserStats, achievements } = useGameData()
  const stats = getUserStats()

  const unlockedAchievements = achievements.filter(achievement => achievement.unlockedAt)
  const totalAchievements = achievements.length

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="retro-card">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gradient-to-r from-retro-green to-retro-cyan rounded-full flex items-center justify-center">
            <span className="text-white font-arcade text-2xl">
              {user.username.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-4xl font-arcade text-white mb-2">{user.username}</h1>
            <div className="flex items-center space-x-4 text-retro-gray font-retro">
              <span>Mitglied seit {user.joinDate.toLocaleDateString('de-DE')}</span>
              <span>•</span>
              <span>{user.totalGames} Spiele</span>
              <span>•</span>
              <span>{user.totalRuns} Runs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-retro-green" />
            <div>
              <p className="text-sm font-retro text-retro-gray">Gesamt Runs</p>
              <p className="text-2xl font-arcade text-white">{stats.totalRuns}</p>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8 text-retro-yellow" />
            <div>
              <p className="text-sm font-retro text-retro-gray">Persönliche Bestzeiten</p>
              <p className="text-2xl font-arcade text-white">{stats.personalBests}</p>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center space-x-3">
            <Award className="w-8 h-8 text-retro-purple" />
            <div>
              <p className="text-sm font-retro text-retro-gray">Erfolge</p>
              <p className="text-2xl font-arcade text-white">
                {unlockedAchievements.length}/{totalAchievements}
              </p>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-retro-blue" />
            <div>
              <p className="text-sm font-retro text-retro-gray">Durchschnittszeit</p>
              <p className="text-2xl font-arcade text-white">
                {formatTime(stats.averageTime)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="retro-card">
        <h2 className="text-2xl font-arcade text-white mb-6 flex items-center">
          <Award className="w-6 h-6 mr-3 text-retro-purple" />
          Erfolge ({unlockedAchievements.length}/{totalAchievements})
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unlockedAchievements.map((achievement) => (
            <div key={achievement.id} className="bg-retro-darker border border-retro-green rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <h3 className="font-arcade text-white text-sm">{achievement.name}</h3>
                  <p className="text-xs text-retro-gray font-retro">{achievement.description}</p>
                  {achievement.unlockedAt && (
                    <p className="text-xs text-retro-green font-retro mt-1">
                      {achievement.unlockedAt.toLocaleDateString('de-DE')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {unlockedAchievements.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-retro-gray mx-auto mb-4" />
            <p className="text-retro-gray font-retro">Noch keine Erfolge freigeschaltet</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="retro-card">
        <h2 className="text-2xl font-arcade text-white mb-6">Letzte Aktivität</h2>
        <div className="space-y-4">
          <div className="bg-retro-darker rounded-lg p-4 border border-retro-gray">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-retro">Neuer PB in Mario Kart 64</p>
                <p className="text-retro-gray text-sm font-retro">vor 2 Stunden</p>
              </div>
              <div className="text-right">
                <p className="text-retro-green font-arcade">1:58.42</p>
                <p className="text-xs text-retro-gray">-3.2s</p>
              </div>
            </div>
          </div>
          
          <div className="bg-retro-darker rounded-lg p-4 border border-retro-gray">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-retro">Erfolg freigeschaltet: Speed Demon</p>
                <p className="text-retro-gray text-sm font-retro">vor 1 Tag</p>
              </div>
              <div className="text-right">
                <span className="achievement-badge achievement-gold">
                  <Trophy className="w-3 h-3" />
                  <span className="ml-1 text-xs">🏁</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
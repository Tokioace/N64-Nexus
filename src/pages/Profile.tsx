import React from 'react'
import { Link } from 'react-router-dom'
import { Camera, Trophy, Star, TrendingUp, Award, Target, CheckCircle, Plus } from 'lucide-react'

const Profile: React.FC = () => {
  // Mock user data
  const userStats = {
    username: 'RetroGamer64',
    level: 15,
    totalPoints: 1250,
    gamesScanned: 23,
    totalGames: 45,
    collectionValue: 2800,
    achievements: [
      { id: 1, name: 'Scan-Experte', description: '25 Module gescannt', earned: true, icon: Camera },
      { id: 2, name: 'Sammler', description: '50 Spiele in Sammlung', earned: true, icon: Trophy },
      { id: 3, name: 'Raritäten-Jäger', description: '10 seltene Spiele', earned: false, icon: Star },
      { id: 4, name: 'Wertvoll', description: 'Sammlung im Wert von €5000', earned: false, icon: TrendingUp }
    ],
    recentActivity: [
      { type: 'scan', game: 'Super Mario 64', date: '2024-01-20' },
      { type: 'add', game: 'GoldenEye 007', date: '2024-01-19' },
      { type: 'achievement', achievement: 'Scan-Experte', date: '2024-01-18' }
    ]
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="retro-card mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-retro-purple rounded-full flex items-center justify-center">
            <span className="text-white font-pixel text-2xl">RG</span>
          </div>
          <div>
            <h1 className="text-3xl font-pixel text-retro-purple mb-2">{userStats.username}</h1>
            <div className="flex items-center space-x-4 text-retro-light">
              <span>Level {userStats.level}</span>
              <span>•</span>
              <span>{userStats.totalPoints} Punkte</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="retro-card text-center">
          <Camera size={32} className="text-retro-green mx-auto mb-2" />
          <div className="text-2xl font-pixel text-retro-purple">{userStats.gamesScanned}</div>
          <div className="text-retro-light text-sm">Gescannt</div>
        </div>
        
        <div className="retro-card text-center">
          <Trophy size={32} className="text-retro-yellow mx-auto mb-2" />
          <div className="text-2xl font-pixel text-retro-purple">{userStats.totalGames}</div>
          <div className="text-retro-light text-sm">In Sammlung</div>
        </div>
        
        <div className="retro-card text-center">
          <TrendingUp size={32} className="text-retro-green mx-auto mb-2" />
          <div className="text-2xl font-pixel text-retro-purple">€{userStats.collectionValue}</div>
          <div className="text-retro-light text-sm">Sammlungswert</div>
        </div>
        
        <div className="retro-card text-center">
          <Award size={32} className="text-retro-purple mx-auto mb-2" />
          <div className="text-2xl font-pixel text-retro-purple">
            {userStats.achievements.filter(a => a.earned).length}
          </div>
          <div className="text-retro-light text-sm">Achievements</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Achievements */}
        <div className="retro-card">
          <h2 className="text-xl font-pixel text-retro-yellow mb-4">Achievements</h2>
          <div className="space-y-3">
            {userStats.achievements.map((achievement) => {
              const Icon = achievement.icon
              return (
                <div
                  key={achievement.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 ${
                    achievement.earned
                      ? 'border-retro-green bg-retro-green bg-opacity-10'
                      : 'border-retro-gray bg-retro-gray bg-opacity-20'
                  }`}
                >
                  <Icon
                    size={24}
                    className={achievement.earned ? 'text-retro-green' : 'text-retro-gray'}
                  />
                  <div className="flex-1">
                    <div className={`font-pixel ${
                      achievement.earned ? 'text-retro-green' : 'text-retro-gray'
                    }`}>
                      {achievement.name}
                    </div>
                    <div className="text-sm text-retro-light">
                      {achievement.description}
                    </div>
                  </div>
                  {achievement.earned && (
                    <CheckCircle size={20} className="text-retro-green" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="retro-card">
          <h2 className="text-xl font-pixel text-retro-yellow mb-4">Letzte Aktivitäten</h2>
          <div className="space-y-3">
            {userStats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-retro-dark rounded-lg">
                {activity.type === 'scan' && <Camera size={16} className="text-retro-green" />}
                {activity.type === 'add' && <Plus size={16} className="text-retro-blue" />}
                {activity.type === 'achievement' && <Award size={16} className="text-retro-yellow" />}
                
                <div className="flex-1">
                  <div className="text-retro-light font-retro">
                    {activity.type === 'scan' && `"${activity.game}" gescannt`}
                    {activity.type === 'add' && `"${activity.game}" zur Sammlung hinzugefügt`}
                    {activity.type === 'achievement' && `Achievement "${activity.achievement}" freigeschaltet`}
                  </div>
                  <div className="text-sm text-retro-gray">{activity.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="retro-card mt-8">
        <h2 className="text-xl font-pixel text-retro-yellow mb-4">Schnellzugriff</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/scanner"
            className="retro-button bg-retro-green hover:bg-retro-blue flex items-center justify-center space-x-2"
          >
            <Camera size={20} />
            <span>Neues Spiel scannen</span>
          </Link>
          
          <Link
            to="/collection"
            className="retro-button bg-retro-purple hover:bg-retro-blue flex items-center justify-center space-x-2"
          >
            <Trophy size={20} />
            <span>Sammlung anzeigen</span>
          </Link>
          
          <button className="retro-button bg-retro-yellow hover:bg-yellow-600 flex items-center justify-center space-x-2">
            <Target size={20} />
            <span>Ziele setzen</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
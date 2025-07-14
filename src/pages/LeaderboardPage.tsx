import React from 'react'
import { useUser } from '../contexts/UserContext'
import { Trophy, Medal, Crown } from 'lucide-react'

const LeaderboardPage: React.FC = () => {
  const { user } = useUser()

  // Mock leaderboard data - in a real app this would come from a backend
  const leaderboardData = [
    { id: '1', username: 'N64Master', points: 2500, level: 25, accuracy: 95, quizzes: 50 },
    { id: '2', username: 'RetroGamer', points: 2200, level: 22, accuracy: 92, quizzes: 45 },
    { id: '3', username: 'MarioFan', points: 2000, level: 20, accuracy: 88, quizzes: 40 },
    { id: '4', username: 'ZeldaPro', points: 1800, level: 18, accuracy: 85, quizzes: 35 },
    { id: '5', username: 'BanjoLover', points: 1600, level: 16, accuracy: 82, quizzes: 30 },
    { id: '6', username: 'GoldenEye', points: 1400, level: 14, accuracy: 78, quizzes: 25 },
    { id: '7', username: 'WaveRacer', points: 1200, level: 12, accuracy: 75, quizzes: 20 },
    { id: '8', username: 'ConkerFan', points: 1000, level: 10, accuracy: 70, quizzes: 15 },
    { id: '9', username: 'DK64Player', points: 800, level: 8, accuracy: 65, quizzes: 10 },
    { id: '10', username: 'StarFox', points: 600, level: 6, accuracy: 60, quizzes: 5 },
  ]

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="text-yellow-400" size={20} />
    if (rank === 2) return <Medal className="text-gray-300" size={20} />
    if (rank === 3) return <Medal className="text-amber-600" size={20} />
    return <span className="text-white/50 font-bold">{rank}</span>
  }

  const getUserRank = () => {
    if (!user) return null
    const userRank = leaderboardData.findIndex(entry => entry.username === user.username)
    return userRank >= 0 ? userRank + 1 : null
  }

  const userRank = getUserRank()

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-shadow mb-2">
          🏆 Rangliste
        </h1>
        <p className="text-white/70">
          Die besten N64-Experten
        </p>
      </div>

      {/* User's Current Rank */}
      {user && userRank && (
        <div className="card mb-6 bg-n64-purple/20 border-n64-purple/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">👤</div>
              <div>
                <div className="font-bold">{user.username}</div>
                <div className="text-sm text-white/70">Dein Rang</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-n64-purple">#{userRank}</div>
              <div className="text-sm text-white/70">{user.points} Punkte</div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="space-y-2">
        {leaderboardData.map((entry, index) => (
          <div 
            key={entry.id} 
            className={`card flex items-center justify-between ${
              entry.username === user?.username ? 'bg-n64-purple/20 border-n64-purple/50' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8">
                {getRankIcon(index + 1)}
              </div>
              <div>
                <div className="font-bold">{entry.username}</div>
                <div className="text-sm text-white/70">
                  Level {entry.level} • {entry.accuracy}% Genauigkeit
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-n64-purple">{entry.points}</div>
              <div className="text-sm text-white/70">{entry.quizzes} Quizzes</div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-shadow mb-4">Statistiken</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-n64-green">
              {Math.round(leaderboardData.reduce((sum, entry) => sum + entry.accuracy, 0) / leaderboardData.length)}%
            </div>
            <div className="text-sm text-white/70">Durchschnittliche Genauigkeit</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-n64-blue">
              {leaderboardData.reduce((sum, entry) => sum + entry.quizzes, 0)}
            </div>
            <div className="text-sm text-white/70">Gesamte Quizzes gespielt</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-n64-yellow">
              {leaderboardData[0]?.points || 0}
            </div>
            <div className="text-sm text-white/70">Höchste Punktzahl</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-n64-purple">
              {leaderboardData.length}
            </div>
            <div className="text-sm text-white/70">Aktive Spieler</div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8">
        <div className="card">
          <h3 className="text-lg font-bold mb-3">💡 Tipps für bessere Platzierungen</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>• Spiele täglich die Daily Challenge</li>
            <li>• Versuche Speed-Quizzes für Bonus-Punkte</li>
            <li>• Lerne aus deinen Fehlern</li>
            <li>• Sammle alle Errungenschaften</li>
            <li>• Übe schwierige Kategorien</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardPage
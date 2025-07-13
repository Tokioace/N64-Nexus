import React, { useState } from 'react'
import { Trophy, Medal, Star, TrendingUp, Calendar, Clock } from 'lucide-react'

const LeaderboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'alltime'>('daily')

  // Mock leaderboard data
  const leaderboardData = {
    daily: [
      { rank: 1, username: 'MarioMaster64', score: 2850, level: 15, xp: 12500 },
      { rank: 2, username: 'ZeldaPro', score: 2720, level: 12, xp: 9800 },
      { rank: 3, username: 'BanjoFan', score: 2650, level: 14, xp: 11200 },
      { rank: 4, username: 'RetroGamer', score: 2480, level: 10, xp: 8500 },
      { rank: 5, username: 'N64Legend', score: 2350, level: 13, xp: 10500 },
    ],
    weekly: [
      { rank: 1, username: 'MarioMaster64', score: 18500, level: 15, xp: 12500 },
      { rank: 2, username: 'ZeldaPro', score: 17200, level: 12, xp: 9800 },
      { rank: 3, username: 'BanjoFan', score: 16500, level: 14, xp: 11200 },
      { rank: 4, username: 'RetroGamer', score: 14800, level: 10, xp: 8500 },
      { rank: 5, username: 'N64Legend', score: 13500, level: 13, xp: 10500 },
    ],
    alltime: [
      { rank: 1, username: 'MarioMaster64', score: 125000, level: 15, xp: 12500 },
      { rank: 2, username: 'ZeldaPro', score: 112000, level: 12, xp: 9800 },
      { rank: 3, username: 'BanjoFan', score: 105000, level: 14, xp: 11200 },
      { rank: 4, username: 'RetroGamer', score: 98000, level: 10, xp: 8500 },
      { rank: 5, username: 'N64Legend', score: 85000, level: 13, xp: 10500 },
    ]
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-n64-yellow" />
      case 2: return <Medal className="w-6 h-6 text-n64-gray" />
      case 3: return <Star className="w-6 h-6 text-n64-orange" />
      default: return <span className="font-pixel text-white/50">{rank}</span>
    }
  }

  const getRankClass = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-n64-yellow/20 to-n64-orange/20 border-n64-yellow/30'
      case 2: return 'bg-gradient-to-r from-n64-gray/20 to-n64-blue/20 border-n64-gray/30'
      case 3: return 'bg-gradient-to-r from-n64-orange/20 to-n64-red/20 border-n64-orange/30'
      default: return 'bg-white/5 border-white/10'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-pixel text-4xl text-white mb-4">🏆 Rangliste</h1>
        <p className="text-white/80 font-retro">
          Die besten N64-Quiz-Meister aller Zeiten
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-2">
        {[
          { id: 'daily', label: 'Heute', icon: Calendar },
          { id: 'weekly', label: 'Diese Woche', icon: TrendingUp },
          { id: 'alltime', label: 'Allzeit', icon: Trophy }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-pixel transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-n64-purple/30 text-white border-2 border-n64-purple/50'
                  : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Leaderboard */}
      <div className="quiz-card">
        <div className="space-y-4">
          {leaderboardData[activeTab].map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${getRankClass(entry.rank)}`}
            >
              {/* Rank */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12">
                  {getRankIcon(entry.rank)}
                </div>
                <div>
                  <h3 className="font-pixel text-white text-lg">{entry.username}</h3>
                  <p className="text-white/70 text-sm">Level {entry.level}</p>
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="score-display">{entry.score.toLocaleString()}</div>
                <p className="text-white/70 text-sm">{entry.xp.toLocaleString()} XP</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="quiz-card text-center">
          <Trophy className="w-12 h-12 text-n64-yellow mx-auto mb-3" />
          <h3 className="font-pixel text-white mb-1">Top Score</h3>
          <p className="text-white/70 text-sm">
            {Math.max(...leaderboardData[activeTab].map(e => e.score)).toLocaleString()}
          </p>
        </div>
        
        <div className="quiz-card text-center">
          <Star className="w-12 h-12 text-n64-purple mx-auto mb-3" />
          <h3 className="font-pixel text-white mb-1">Aktive Spieler</h3>
          <p className="text-white/70 text-sm">
            {leaderboardData[activeTab].length} Spieler
          </p>
        </div>
        
        <div className="quiz-card text-center">
          <TrendingUp className="w-12 h-12 text-n64-green mx-auto mb-3" />
          <h3 className="font-pixel text-white mb-1">Durchschnitt</h3>
          <p className="text-white/70 text-sm">
            {Math.round(leaderboardData[activeTab].reduce((sum, e) => sum + e.score, 0) / leaderboardData[activeTab].length).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Achievement Showcase */}
      <div className="quiz-card">
        <h2 className="font-pixel text-2xl text-white mb-6 text-center">🏅 Top Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Quiz-Meister 64', description: 'Top 1 im Monat', icon: '👑' },
            { name: 'Retro-Brain', description: 'Alle Kategorien >90%', icon: '🧠' },
            { name: 'Speed Demon', description: 'Quiz in unter 2 Minuten', icon: '⚡' },
            { name: 'Perfect Score', description: '100% in einem Quiz', icon: '💯' },
            { name: 'Duell Champion', description: '10 Duelle gewonnen', icon: '⚔️' },
            { name: 'Daily Streak', description: '7 Tage in Folge', icon: '🔥' }
          ].map((achievement, index) => (
            <div key={index} className="bg-gradient-to-br from-n64-purple/10 to-n64-blue/10 rounded-lg p-4 border border-white/10 text-center">
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h3 className="font-pixel text-white text-sm mb-1">{achievement.name}</h3>
              <p className="text-white/70 text-xs">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Your Position */}
      <div className="quiz-card text-center">
        <h3 className="font-pixel text-xl text-white mb-4">Deine Position</h3>
        <div className="bg-gradient-to-r from-n64-green/20 to-n64-blue/20 rounded-lg p-6 border border-n64-green/30">
          <p className="text-white/70 mb-2">Du bist noch nicht in der Rangliste</p>
          <p className="text-white/80 font-retro text-sm">
            Spiele mehr Quiz und steige in die Rangliste auf!
          </p>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardPage
import React, { useState } from 'react'
import { useUser } from '../contexts/UserContext'
import { User, Trophy, Star, Calendar, Target, TrendingUp, Award, Clock } from 'lucide-react'

const ProfilePage: React.FC = () => {
  const { state } = useUser()
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'history'>('overview')

  // Mock user data for demonstration
  const mockProfile = {
    id: 'user_001',
    username: 'RetroGamer64',
    level: 8,
    xp: 7500,
    totalScore: 12500,
    quizzesCompleted: 45,
    achievements: [
      { id: 'ach_001', name: 'First Quiz', description: 'Erstes Quiz absolviert', icon: '🎯', unlockedAt: new Date('2024-01-15') },
      { id: 'ach_002', name: 'Perfect Score', description: '100% in einem Quiz', icon: '💯', unlockedAt: new Date('2024-01-20') },
      { id: 'ach_003', name: 'Speed Demon', description: 'Quiz in unter 2 Minuten', icon: '⚡', unlockedAt: new Date('2024-01-25') },
    ],
    titles: ['Quiz-Anfänger', 'Retro-Fan'],
    joinDate: new Date('2024-01-01'),
    lastActive: new Date()
  }

  const profile = state.profile || mockProfile

  const quizHistory = [
    { date: '2024-01-25', category: 'Spielwissen', score: 85, totalQuestions: 10, timeSpent: 180 },
    { date: '2024-01-24', category: 'Release-Historie', score: 90, totalQuestions: 10, timeSpent: 210 },
    { date: '2024-01-23', category: 'Musik & Sounds', score: 75, totalQuestions: 10, timeSpent: 240 },
    { date: '2024-01-22', category: 'Tagesquiz', score: 95, totalQuestions: 10, timeSpent: 165 },
    { date: '2024-01-21', category: 'Glitches & Speedruns', score: 60, totalQuestions: 10, timeSpent: 300 },
  ]

  const getLevelProgress = () => {
    const xpForCurrentLevel = (profile.level - 1) * 1000
    const xpForNextLevel = profile.level * 1000
    const xpInCurrentLevel = profile.xp - xpForCurrentLevel
    const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel
    return (xpInCurrentLevel / xpNeededForNextLevel) * 100
  }

  const getCategoryStats = () => {
    return [
      { name: 'Spielwissen', completed: 12, average: 85, icon: '🎮' },
      { name: 'Release-Historie', completed: 8, average: 78, icon: '📅' },
      { name: 'Fanart-Quiz', completed: 5, average: 72, icon: '🧑‍🎨' },
      { name: 'Musik & Sounds', completed: 10, average: 88, icon: '🎼' },
      { name: 'Glitches & Speedruns', completed: 6, average: 65, icon: '🐞' },
      { name: 'Saison-Quiz', completed: 4, average: 90, icon: '🎉' },
    ]
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="quiz-card">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gradient-to-br from-n64-green to-n64-blue rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="font-pixel text-3xl text-white mb-2">{profile.username}</h1>
            <div className="flex items-center space-x-4 text-white/70">
              <span className="font-retro">Level {profile.level}</span>
              <span className="font-retro">{profile.xp} XP</span>
              <span className="font-retro">Mitglied seit {profile.joinDate.toLocaleDateString('de-DE')}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.titles.map((title, index) => (
                <span key={index} className="px-3 py-1 bg-n64-purple/30 text-n64-purple text-xs font-pixel rounded-full border border-n64-purple/50">
                  {title}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-white/70 text-sm mb-2">
            <span>Level {profile.level}</span>
            <span>Level {profile.level + 1}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-n64-green to-n64-blue h-3 rounded-full transition-all duration-300"
              style={{ width: `${getLevelProgress()}%` }}
            ></div>
          </div>
          <p className="text-white/70 text-sm mt-2">
            {profile.xp - ((profile.level - 1) * 1000)} / {1000} XP für nächstes Level
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-2">
        {[
          { id: 'overview', label: 'Übersicht', icon: User },
          { id: 'achievements', label: 'Achievements', icon: Trophy },
          { id: 'history', label: 'Verlauf', icon: Calendar }
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="quiz-card text-center">
              <Target className="w-8 h-8 text-n64-green mx-auto mb-2" />
              <div className="score-display">{profile.quizzesCompleted}</div>
              <p className="text-white/70 text-sm">Quiz absolviert</p>
            </div>
            <div className="quiz-card text-center">
              <Star className="w-8 h-8 text-n64-yellow mx-auto mb-2" />
              <div className="score-display">{profile.totalScore}</div>
              <p className="text-white/70 text-sm">Gesamtpunkte</p>
            </div>
            <div className="quiz-card text-center">
              <Trophy className="w-8 h-8 text-n64-purple mx-auto mb-2" />
              <div className="score-display">{profile.achievements.length}</div>
              <p className="text-white/70 text-sm">Achievements</p>
            </div>
            <div className="quiz-card text-center">
              <TrendingUp className="w-8 h-8 text-n64-blue mx-auto mb-2" />
              <div className="score-display">{Math.round(profile.totalScore / profile.quizzesCompleted)}</div>
              <p className="text-white/70 text-sm">Ø Punkte/Quiz</p>
            </div>
          </div>

          {/* Category Performance */}
          <div className="quiz-card">
            <h2 className="font-pixel text-2xl text-white mb-6 text-center">📊 Kategorie-Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getCategoryStats().map((category, index) => (
                <div key={index} className="bg-gradient-to-br from-n64-purple/10 to-n64-blue/10 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="font-pixel text-white">{category.average}%</span>
                  </div>
                  <h3 className="font-pixel text-white text-sm mb-1">{category.name}</h3>
                  <p className="text-white/70 text-xs">{category.completed} Quiz absolviert</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="quiz-card">
          <h2 className="font-pixel text-2xl text-white mb-6 text-center">🏆 Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.achievements.map((achievement) => (
              <div key={achievement.id} className="bg-gradient-to-br from-n64-yellow/20 to-n64-orange/20 rounded-lg p-4 border border-n64-yellow/30">
                <div className="text-3xl mb-3">{achievement.icon}</div>
                <h3 className="font-pixel text-white text-lg mb-2">{achievement.name}</h3>
                <p className="text-white/80 text-sm mb-3">{achievement.description}</p>
                <p className="text-white/70 text-xs">
                  Freigeschaltet: {achievement.unlockedAt.toLocaleDateString('de-DE')}
                </p>
              </div>
            ))}
          </div>
          
          {/* Locked Achievements Preview */}
          <div className="mt-8">
            <h3 className="font-pixel text-xl text-white mb-4 text-center">🔒 Noch zu erreichen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Quiz-Meister 64', description: 'Top 1 im Monat', icon: '👑', progress: 0 },
                { name: 'Retro-Brain', description: 'Alle Kategorien >90%', icon: '🧠', progress: 60 },
                { name: 'Duell Champion', description: '10 Duelle gewonnen', icon: '⚔️', progress: 30 },
                { name: 'Daily Streak', description: '7 Tage in Folge', icon: '🔥', progress: 85 },
                { name: 'Speed Demon', description: 'Quiz in unter 1 Minute', icon: '⚡', progress: 0 },
                { name: 'Perfect Score', description: '100% in 5 Quiz', icon: '💯', progress: 40 }
              ].map((achievement, index) => (
                <div key={index} className="bg-gradient-to-br from-white/5 to-white/10 rounded-lg p-4 border border-white/10 opacity-60">
                  <div className="text-3xl mb-3">{achievement.icon}</div>
                  <h3 className="font-pixel text-white/70 text-lg mb-2">{achievement.name}</h3>
                  <p className="text-white/50 text-sm mb-3">{achievement.description}</p>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-n64-purple h-2 rounded-full transition-all duration-300"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-white/50 text-xs mt-2">{achievement.progress}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="quiz-card">
          <h2 className="font-pixel text-2xl text-white mb-6 text-center">📅 Quiz-Verlauf</h2>
          <div className="space-y-4">
            {quizHistory.map((quiz, index) => (
              <div key={index} className="bg-gradient-to-br from-n64-purple/10 to-n64-blue/10 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-pixel text-white text-lg">{quiz.category}</h3>
                    <p className="text-white/70 text-sm">{quiz.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="score-display">{quiz.score}/{quiz.totalQuestions * 10}</div>
                    <p className="text-white/70 text-sm">
                      {Math.floor(quiz.timeSpent / 60)}:{(quiz.timeSpent % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-n64-green to-n64-blue h-2 rounded-full"
                      style={{ width: `${(quiz.score / (quiz.totalQuestions * 10)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
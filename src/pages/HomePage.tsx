import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { getDailyQuestions } from '../data/questions'
import { Brain, Trophy, Users, Calendar, Star, Zap } from 'lucide-react'

const HomePage: React.FC = () => {
  const { state } = useUser()
  const [dailyQuestions] = useState(getDailyQuestions())

  const categories = [
    {
      id: 'game-knowledge',
      name: '🎮 Spielwissen',
      description: 'Teste dein Wissen über N64-Spiele',
      icon: Brain,
      color: 'from-n64-green to-n64-blue',
      questionCount: 25
    },
    {
      id: 'release-history',
      name: '📅 Release-Historie',
      description: 'Wann erschien welches Spiel?',
      icon: Calendar,
      color: 'from-n64-purple to-n64-red',
      questionCount: 20
    },
    {
      id: 'fanart',
      name: '🧑‍🎨 Fanart-Quiz',
      description: 'Erkenne N64-Charaktere und Künstler',
      icon: Star,
      color: 'from-n64-yellow to-n64-orange',
      questionCount: 15
    },
    {
      id: 'music-sounds',
      name: '🎼 Musik & Sounds',
      description: 'Errate Soundtracks und Soundeffekte',
      icon: Zap,
      color: 'from-n64-blue to-n64-purple',
      questionCount: 18
    },
    {
      id: 'glitches-speedruns',
      name: '🐞 Glitches & Speedruns',
      description: 'Kennst du die berühmten Tricks?',
      icon: Trophy,
      color: 'from-n64-red to-n64-yellow',
      questionCount: 12
    },
    {
      id: 'seasonal',
      name: '🎉 Saison-Quiz',
      description: 'Spezielle Feiertags- und Saisonfragen',
      icon: Calendar,
      color: 'from-n64-purple to-n64-green',
      questionCount: 10
    }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="font-pixel text-4xl md:text-6xl text-white">
          🧠 Battle64 Quiz System
        </h1>
        <p className="text-xl text-white/80 font-retro max-w-2xl mx-auto">
          Teste dein N64-Wissen und sammle Belohnungen! 
          Von Spielwissen bis Speedrun-Techniken - hier ist alles dabei.
        </p>
        
        {state.isAuthenticated && state.profile && (
          <div className="bg-gradient-to-r from-n64-purple/20 to-n64-blue/20 rounded-lg p-4 border border-white/20">
            <p className="font-pixel text-lg text-white">
              Willkommen zurück, {state.profile.username}!
            </p>
            <p className="text-white/70">
              Level {state.profile.level} • {state.profile.xp} XP • {state.profile.quizzesCompleted} Quiz absolviert
            </p>
          </div>
        )}
      </div>

      {/* Daily Quiz Section */}
      <div className="quiz-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-pixel text-2xl text-white">📅 Tagesquiz</h2>
          <div className="flex items-center space-x-2">
            <Calendar className="text-n64-yellow" size={20} />
            <span className="text-white/70 font-retro">
              {new Date().toLocaleDateString('de-DE')}
            </span>
          </div>
        </div>
        <p className="text-white/80 mb-4">
          Täglich neue Fragen! Heute: {dailyQuestions.length} Fragen aus verschiedenen Kategorien.
        </p>
        <Link to="/quiz?mode=daily" className="retro-button inline-flex items-center space-x-2">
          <Brain size={16} />
          <span>Tagesquiz starten</span>
        </Link>
      </div>

      {/* Quiz Categories */}
      <div className="space-y-6">
        <h2 className="font-pixel text-3xl text-white text-center">🎯 Quiz-Kategorien</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <div key={category.id} className="quiz-card group">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-pixel text-lg text-white">{category.name}</h3>
                    <p className="text-xs text-white/70">{category.questionCount} Fragen</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm mb-4">{category.description}</p>
                <Link 
                  to={`/quiz?category=${category.id}`}
                  className="retro-button w-full justify-center group-hover:scale-105 transition-transform"
                >
                  <span>Kategorie starten</span>
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/duel" className="quiz-card text-center hover:scale-105 transition-transform">
          <Users className="w-12 h-12 text-n64-green mx-auto mb-3" />
          <h3 className="font-pixel text-lg text-white mb-2">Duell-Modus</h3>
          <p className="text-white/70 text-sm">Fordere Freunde heraus!</p>
        </Link>
        
        <Link to="/leaderboard" className="quiz-card text-center hover:scale-105 transition-transform">
          <Trophy className="w-12 h-12 text-n64-yellow mx-auto mb-3" />
          <h3 className="font-pixel text-lg text-white mb-2">Rangliste</h3>
          <p className="text-white/70 text-sm">Sieh die Besten!</p>
        </Link>
        
        <Link to="/profile" className="quiz-card text-center hover:scale-105 transition-transform">
          <Star className="w-12 h-12 text-n64-purple mx-auto mb-3" />
          <h3 className="font-pixel text-lg text-white mb-2">Profil</h3>
          <p className="text-white/70 text-sm">Deine Erfolge</p>
        </Link>
      </div>

      {/* Features Overview */}
      <div className="quiz-card">
        <h2 className="font-pixel text-2xl text-white mb-6 text-center">🎁 Belohnungssystem</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-n64-green to-n64-blue rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="font-pixel text-white text-lg">+10</span>
            </div>
            <h3 className="font-pixel text-white mb-1">XP pro Antwort</h3>
            <p className="text-white/70 text-sm">Für jede richtige Antwort</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-n64-yellow to-n64-red rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="font-pixel text-white text-lg">+100</span>
            </div>
            <h3 className="font-pixel text-white mb-1">Perfektes Quiz</h3>
            <p className="text-white/70 text-sm">Bonus für 100%</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-n64-purple to-n64-blue rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="font-pixel text-white text-lg">🏆</span>
            </div>
            <h3 className="font-pixel text-white mb-1">Trophäen</h3>
            <p className="text-white/70 text-sm">Sammle Titel</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-n64-red to-n64-yellow rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="font-pixel text-white text-lg">📊</span>
            </div>
            <h3 className="font-pixel text-white mb-1">Leaderboard</h3>
            <p className="text-white/70 text-sm">Vergleiche dich</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
import React, { useState } from 'react'
import { 
  Gamepad2, 
  Zap, 
  Target, 
  Puzzle, 
  Timer, 
  Star,
  Play,
  Trophy,
  Users
} from 'lucide-react'

interface Minigame {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  icon: any
  color: string
  available: boolean
  highScore?: number
  players?: number
}

const MinigamesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const minigames: Minigame[] = [
    {
      id: 'memory-match',
      title: 'N64 Memory Match',
      description: 'Finde die passenden N64-Spiele-Cover in diesem Gedächtnisspiel.',
      difficulty: 'easy',
      category: 'puzzle',
      icon: Puzzle,
      color: 'text-blue-400',
      available: true,
      highScore: 1250,
      players: 1
    },
    {
      id: 'reaction-test',
      title: 'Controller Reaktionstest',
      description: 'Wie schnell sind deine Reflexe? Teste deine Reaktionszeit!',
      difficulty: 'medium',
      category: 'skill',
      icon: Zap,
      color: 'text-yellow-400',
      available: true,
      highScore: 180,
      players: 1
    },
    {
      id: 'trivia-rush',
      title: 'N64 Trivia Rush',
      description: 'Beantworte N64-Fragen so schnell wie möglich!',
      difficulty: 'medium',
      category: 'quiz',
      icon: Target,
      color: 'text-green-400',
      available: true,
      highScore: 2100,
      players: 1
    },
    {
      id: 'speed-typing',
      title: 'Cheat Code Typing',
      description: 'Tippe berühmte N64 Cheat Codes so schnell wie möglich!',
      difficulty: 'hard',
      category: 'skill',
      icon: Timer,
      color: 'text-red-400',
      available: true,
      players: 1
    },
    {
      id: 'sound-guess',
      title: 'N64 Sound Quiz',
      description: 'Erkenne N64-Spiele an ihren Soundeffekten und Musik.',
      difficulty: 'medium',
      category: 'quiz',
      icon: Star,
      color: 'text-purple-400',
      available: false,
      players: 1
    },
    {
      id: 'multiplayer-duel',
      title: 'Battle64 Duell',
      description: 'Fordere andere Spieler zu einem schnellen Quiz-Duell heraus!',
      difficulty: 'hard',
      category: 'multiplayer',
      icon: Users,
      color: 'text-cyan-400',
      available: false,
      players: 2
    }
  ]

  const categories = [
    { key: 'all', label: 'Alle', count: minigames.length },
    { key: 'puzzle', label: 'Puzzle', count: minigames.filter(g => g.category === 'puzzle').length },
    { key: 'skill', label: 'Geschicklichkeit', count: minigames.filter(g => g.category === 'skill').length },
    { key: 'quiz', label: 'Quiz', count: minigames.filter(g => g.category === 'quiz').length },
    { key: 'multiplayer', label: 'Multiplayer', count: minigames.filter(g => g.category === 'multiplayer').length }
  ]

  const filteredGames = selectedCategory === 'all' 
    ? minigames 
    : minigames.filter(game => game.category === selectedCategory)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/20'
      case 'hard': return 'text-red-400 bg-red-400/20'
      default: return 'text-slate-400 bg-slate-400/20'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Einfach'
      case 'medium': return 'Mittel'
      case 'hard': return 'Schwer'
      default: return difficulty
    }
  }

  const handlePlayGame = (gameId: string) => {
    alert(`Spiel "${gameId}" wird geladen... (Demo-Modus)`)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <Gamepad2 className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-slate-100 mb-2">
          Battle64 Minispiele
        </h1>
        <p className="text-slate-400 text-lg">
          Kleine Spiele für zwischendurch - N64-Style!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="simple-tile text-center">
          <Gamepad2 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-100">
            {minigames.filter(g => g.available).length}
          </div>
          <div className="text-sm text-slate-400">Verfügbar</div>
        </div>
        
        <div className="simple-tile text-center">
          <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-100">
            {Math.max(...minigames.filter(g => g.highScore).map(g => g.highScore || 0)).toLocaleString()}
          </div>
          <div className="text-sm text-slate-400">Höchster Score</div>
        </div>
        
        <div className="simple-tile text-center">
          <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-100">
            {minigames.filter(g => g.difficulty === 'easy').length}
          </div>
          <div className="text-sm text-slate-400">Einfache Spiele</div>
        </div>
        
        <div className="simple-tile text-center">
          <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-100">
            {minigames.filter(g => g.category === 'multiplayer').length}
          </div>
          <div className="text-sm text-slate-400">Multiplayer</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-800 rounded-lg p-1 inline-flex flex-wrap">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-4 py-2 rounded-md transition-all duration-200 text-sm ${
                selectedCategory === category.key
                  ? 'bg-slate-700 text-slate-100'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredGames.map((game) => {
          const IconComponent = game.icon
          
          return (
            <div 
              key={game.id} 
              className={`simple-tile simple-tile-large ${
                game.available ? 'hover:scale-105 transition-transform duration-200' : 'opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <IconComponent className={`w-8 h-8 ${game.color}`} />
                <div className="flex items-center space-x-2">
                  {game.players && (
                    <span className="px-2 py-1 rounded-full bg-slate-700 text-slate-300 text-xs">
                      {game.players}P
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
                    {getDifficultyLabel(game.difficulty)}
                  </span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-100 mb-2">{game.title}</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">{game.description}</p>
              
              {game.highScore && (
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-slate-400">Bester Score:</span>
                  <span className="text-yellow-400 font-medium">{game.highScore.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex space-x-2">
                {game.available ? (
                  <>
                    <button 
                      onClick={() => handlePlayGame(game.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 
                               bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg 
                               transition-colors duration-200"
                    >
                      <Play className="w-4 h-4" />
                      <span>Spielen</span>
                    </button>
                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 
                                     font-medium rounded-lg transition-colors duration-200">
                      Highscores
                    </button>
                  </>
                ) : (
                  <button 
                    disabled
                    className="flex-1 px-4 py-2 bg-slate-700/50 text-slate-500 font-medium 
                             rounded-lg cursor-not-allowed"
                  >
                    Bald verfügbar
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Coming Soon Section */}
      <div className="simple-tile text-center py-8">
        <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-100 mb-2">Weitere Spiele in Entwicklung</h3>
        <p className="text-slate-400 mb-4">
          Wir arbeiten an noch mehr N64-inspirierten Minispielen! Hast du Ideen?
        </p>
        <button className="px-6 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 
                         text-blue-400 hover:text-blue-300 rounded-lg transition-all duration-200">
          💡 Spiel vorschlagen
        </button>
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-slate-400 text-sm">
          Alle Minispiele sind kostenlos und ohne Anmeldung spielbar!
        </p>
      </div>
    </div>
  )
}

export default MinigamesPage
import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Trophy, 
  Star, 
  Users, 
  Play,
  Eye,
  Target,
  Gamepad2,
  Timer,
  Award,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react'
import { n64RacingGames, getAllTracks, getDifficultyColor, getDifficultyBgColor, N64RacingTrack } from '../data/n64RacingGames'
import SimpleCard from '../components/SimpleCard'
import SimpleButton from '../components/SimpleButton'

type TrackWithGame = N64RacingTrack & {
  gameId: string
  gameTitle: string
}

const N64TracksPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGame, setSelectedGame] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'length' | 'worldRecord'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedTrack, setSelectedTrack] = useState<TrackWithGame | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const allTracks = getAllTracks()

  const filteredAndSortedTracks = useMemo(() => {
    let filtered = allTracks.filter(track => {
      const matchesSearch = track.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           track.gameTitle.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGame = selectedGame === 'all' || track.gameId === selectedGame
      const matchesDifficulty = selectedDifficulty === 'all' || track.difficulty === selectedDifficulty
      
      return matchesSearch && matchesGame && matchesDifficulty
    })

    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3, expert: 4 }
          aValue = difficultyOrder[a.difficulty]
          bValue = difficultyOrder[b.difficulty]
          break
        case 'length':
          aValue = a.length
          bValue = b.length
          break
        case 'worldRecord':
          aValue = parseTimeToMs(a.worldRecord.time)
          bValue = parseTimeToMs(b.worldRecord.time)
          break
        default:
          return 0
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [searchTerm, selectedGame, selectedDifficulty, sortBy, sortOrder, allTracks])

  const parseTimeToMs = (timeStr: string): number => {
    const parts = timeStr.split(':')
    const minutes = parseInt(parts[0])
    const seconds = parseFloat(parts[1])
    return minutes * 60000 + seconds * 1000
  }

  const formatTime = (time: string) => {
    return time.replace(/(\d):(\d{2})\.(\d{3})/, '$1:$2.$3')
  }

  const getGameIcon = (gameId: string) => {
    switch (gameId) {
      case 'mario-kart-64': return '🏎️'
      case 'san-francisco-rush': return '🌉'
      case 'star-wars-episode-i-racer': return '🚀'
      case 'f-zero-x': return '⚡'
      case 'diddy-kong-racing': return '🏁'
      case 'wave-race-64': return '🌊'
      case 'beetle-adventure-racing': return '🚗'
      case 'excitebike-64': return '🏍️'
      case 'snowboard-kids': return '🏂'
      default: return '🎮'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      {/* Header */}
      <motion.div 
        className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border-b border-purple-500/30 py-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-4">
              <MapPin className="text-yellow-400" />
              N64 Racing Strecken
              <Target className="text-red-400" />
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Entdecke alle legendären Rennstrecken aus den klassischen N64-Rennspielen. 
              Vergleiche Weltrekorde, erkunde Schwierigkeitsgrade und finde deine nächste Herausforderung.
            </p>
            <div className="mt-6 text-gray-400">
              <span className="font-bold text-yellow-400">{allTracks.length}</span> Strecken aus 
              <span className="font-bold text-blue-400 ml-1">{n64RacingGames.length}</span> Spielen verfügbar
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <motion.div 
            className="lg:w-80"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SimpleCard>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4 lg:hidden">
                  <h3 className="text-xl font-bold">Filter & Suche</h3>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Suche</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Streckenname oder Spiel..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Game Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Spiel</label>
                    <select
                      value={selectedGame}
                      onChange={(e) => setSelectedGame(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="all">Alle Spiele</option>
                      {n64RacingGames.map(game => (
                        <option key={game.id} value={game.id}>{game.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Schwierigkeit</label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="all">Alle Schwierigkeiten</option>
                      <option value="easy">Einfach</option>
                      <option value="medium">Mittel</option>
                      <option value="hard">Schwer</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Sortieren nach</label>
                    <div className="space-y-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="name">Name</option>
                        <option value="difficulty">Schwierigkeit</option>
                        <option value="length">Länge</option>
                        <option value="worldRecord">Weltrekord</option>
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSortOrder('asc')}
                          className={`flex-1 py-2 px-3 rounded-lg transition-colors ${
                            sortOrder === 'asc' 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          Aufsteigend
                        </button>
                        <button
                          onClick={() => setSortOrder('desc')}
                          className={`flex-1 py-2 px-3 rounded-lg transition-colors ${
                            sortOrder === 'desc' 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          Absteigend
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="bg-gray-800/50 rounded-lg p-4 mt-6">
                    <h4 className="font-bold mb-3 text-yellow-400">Statistiken</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Gefundene Strecken:</span>
                        <span className="font-bold text-green-400">{filteredAndSortedTracks.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Einfach:</span>
                        <span className="font-bold text-green-400">
                          {filteredAndSortedTracks.filter(t => t.difficulty === 'easy').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mittel:</span>
                        <span className="font-bold text-yellow-400">
                          {filteredAndSortedTracks.filter(t => t.difficulty === 'medium').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Schwer:</span>
                        <span className="font-bold text-orange-400">
                          {filteredAndSortedTracks.filter(t => t.difficulty === 'hard').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expert:</span>
                        <span className="font-bold text-red-400">
                          {filteredAndSortedTracks.filter(t => t.difficulty === 'expert').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SimpleCard>
          </motion.div>

          {/* Main Content - Track List */}
          <motion.div 
            className="flex-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {filteredAndSortedTracks.length} Strecken gefunden
              </h2>
              <div className="text-sm text-gray-400">
                Sortiert nach {sortBy === 'name' ? 'Name' : sortBy === 'difficulty' ? 'Schwierigkeit' : sortBy === 'length' ? 'Länge' : 'Weltrekord'} ({sortOrder === 'asc' ? 'aufsteigend' : 'absteigend'})
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedTracks.map((track, index) => (
                <motion.div
                  key={`${track.gameId}-${track.id}`}
                  variants={itemVariants}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => setSelectedTrack(track)}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{getGameIcon(track.gameId)}</div>
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">{track.name}</h3>
                          <p className="text-sm text-gray-400">{track.gameTitle}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-bold border ${getDifficultyBgColor(track.difficulty)}`}>
                        <span className={getDifficultyColor(track.difficulty)}>
                          {track.difficulty.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Track Info */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Länge</div>
                        <div className="font-bold text-blue-400">{track.length}m</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Weltrekord</div>
                        <div className="font-mono text-green-400 font-bold">{formatTime(track.worldRecord.time)}</div>
                      </div>
                    </div>

                    {/* World Record Holder */}
                    <div className="bg-yellow-400/10 rounded-lg p-3 mb-4 border border-yellow-400/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs font-bold text-yellow-400">Weltrekord-Halter</span>
                      </div>
                      <div className="text-white font-bold">{track.worldRecord.player}</div>
                      <div className="text-xs text-gray-400">{new Date(track.worldRecord.date).toLocaleDateString('de-DE')}</div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <SimpleButton size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Details
                      </SimpleButton>
                      <SimpleButton size="sm" variant="secondary">
                        <Play className="w-4 h-4" />
                      </SimpleButton>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredAndSortedTracks.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏁</div>
                <h3 className="text-xl font-bold mb-2">Keine Strecken gefunden</h3>
                <p className="text-gray-400">Versuche andere Suchkriterien oder Filter.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Track Detail Modal */}
      {selectedTrack && (
        <motion.div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedTrack(null)}
        >
          <motion.div 
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{getGameIcon(selectedTrack.gameId)}</div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedTrack.name}</h2>
                    <p className="text-lg text-gray-300">{selectedTrack.gameTitle}</p>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold border mt-2 ${getDifficultyBgColor(selectedTrack.difficulty)}`}>
                      <span className={getDifficultyColor(selectedTrack.difficulty)}>
                        {selectedTrack.difficulty.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTrack(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Track Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-gray-400">Streckenlänge</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">{selectedTrack.length} Meter</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-gray-400">Weltrekord</span>
                  </div>
                  <div className="text-2xl font-mono font-bold text-green-400">{formatTime(selectedTrack.worldRecord.time)}</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className={`w-5 h-5 ${getDifficultyColor(selectedTrack.difficulty)}`} />
                    <span className="text-sm text-gray-400">Schwierigkeit</span>
                  </div>
                  <div className={`text-2xl font-bold ${getDifficultyColor(selectedTrack.difficulty)}`}>
                    {selectedTrack.difficulty.charAt(0).toUpperCase() + selectedTrack.difficulty.slice(1)}
                  </div>
                </div>
              </div>

              {/* World Record Details */}
              <div className="bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-lg p-6 mb-6 border border-yellow-400/20">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Trophy className="text-yellow-400" />
                  Weltrekord Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Rekord-Halter</div>
                    <div className="text-lg font-bold text-white">{selectedTrack.worldRecord.player}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Datum</div>
                    <div className="text-lg font-bold text-gray-300">
                      {new Date(selectedTrack.worldRecord.date).toLocaleDateString('de-DE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                {selectedTrack.worldRecord.video && (
                  <div className="mt-4">
                    <SimpleButton>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Video ansehen
                    </SimpleButton>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <SimpleButton>
                  <Play className="w-4 h-4 mr-2" />
                  Speedrun starten
                </SimpleButton>
                <SimpleButton variant="secondary">
                  <Timer className="w-4 h-4 mr-2" />
                  Time Trial
                </SimpleButton>
                <SimpleButton variant="secondary">
                  <Trophy className="w-4 h-4 mr-2" />
                  Leaderboard
                </SimpleButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default N64TracksPage
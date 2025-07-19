import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Clock, 
  Zap, 
  Target, 
  Star, 
  Users, 
  Calendar,
  Gamepad2,
  Timer,
  Award,
  TrendingUp,
  Play,
  ChevronRight,
  Medal,
  Crown
} from 'lucide-react'
import { getCurrentWeeklyEvents, getUpcomingWeeklyEvents, getPreviousWeeklyEvents, getWeeklyStats } from '../data/weeklyEvents'
import { n64RacingGames, getTotalActiveSpeedrunners, getDifficultyColor } from '../data/n64RacingGames'
import SimpleCard from '../components/SimpleCard'
import SimpleButton from '../components/SimpleButton'

const N64SpeedrunHub: React.FC = () => {
  const [currentEvents] = useState(getCurrentWeeklyEvents())
  const [upcomingEvents] = useState(getUpcomingWeeklyEvents())
  const [previousEvents] = useState(getPreviousWeeklyEvents())
  const [weeklyStats] = useState(getWeeklyStats())
  const [selectedEventIndex, setSelectedEventIndex] = useState(0)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  const getGameIcon = (gameId: string) => {
    switch (gameId) {
      case 'mario-kart-64': return '🏎️'
      case 'san-francisco-rush': return '🌉'
      case 'star-wars-episode-i-racer': return '🚀'
      case 'f-zero-x': return '⚡'
      case 'diddy-kong-racing': return '🏁'
      case 'wave-race-64': return '🌊'
      default: return '🎮'
    }
  }

  const formatTime = (time: string) => {
    return time.replace(/(\d):(\d{2})\.(\d{3})/, '$1:$2.$3')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      {/* Hero Section */}
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border-b border-purple-500/30"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center">
            <motion.div
              className="flex justify-center items-center gap-4 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="text-6xl">🏁</div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                N64 SPEEDRUN MEKKA
              </h1>
              <div className="text-6xl">🏆</div>
            </motion.div>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Das ultimative Ziel für N64-Rennspiel-Speedrunner! Messe dich mit den besten Piloten der Welt 
              in wöchentlichen Events auf legendären Strecken.
            </motion.p>

            <motion.div 
              className="flex justify-center gap-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
                <div className="text-3xl font-bold text-yellow-400">{getTotalActiveSpeedrunners().toLocaleString()}</div>
                <div className="text-sm text-gray-300">Aktive Speedrunner</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
                <div className="text-3xl font-bold text-green-400">{n64RacingGames.length}</div>
                <div className="text-sm text-gray-300">Racing Games</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border border-white/20">
                <div className="text-3xl font-bold text-blue-400">${weeklyStats.totalPrizesMoney.toLocaleString()}</div>
                <div className="text-sm text-gray-300">Preisgelder</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Current Weekly Events */}
      <motion.div 
        className="container mx-auto px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Calendar className="text-yellow-400" />
            Diese Woche: Triple Challenge
          </h2>
          <p className="text-gray-300 mb-8">
            Drei epische Events laufen parallel - Mario Kart 64 + zwei zufällige N64-Rennspiele!
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {currentEvents.events.map((event, index) => (
              <motion.div
                key={event.id}
                className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 cursor-pointer ${
                  selectedEventIndex === index 
                    ? 'border-yellow-400/50 shadow-lg shadow-yellow-400/20' 
                    : 'border-gray-700/50 hover:border-gray-600/50'
                }`}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedEventIndex(index)}
                variants={itemVariants}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{getGameIcon(event.gameId)}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{event.title}</h3>
                    <p className="text-sm text-gray-400">{event.category}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Teilnehmer</span>
                    <span className="text-white font-bold">{event.participants}/{event.maxParticipants}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {event.currentLeader && (
                  <div className="bg-yellow-400/10 rounded-lg p-3 mb-4 border border-yellow-400/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Crown className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-bold text-yellow-400">Aktueller Leader</span>
                    </div>
                    <div className="text-white font-bold">{event.currentLeader.player}</div>
                    <div className="text-2xl font-mono text-green-400">{formatTime(event.currentLeader.time)}</div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    Preisgeld: <span className="text-green-400 font-bold">${event.prizePool}</span>
                  </div>
                  <SimpleButton size="sm">
                    <Play className="w-4 h-4 mr-1" />
                    Teilnehmen
                  </SimpleButton>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Event Details */}
        <motion.div variants={itemVariants} className="mb-12">
          <SimpleCard>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Target className="text-yellow-400" />
                {currentEvents.events[selectedEventIndex].title}
              </h3>
              <p className="text-gray-300 mb-6">{currentEvents.events[selectedEventIndex].description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Spiel</div>
                  <div className="font-bold">{n64RacingGames.find(g => g.id === currentEvents.events[selectedEventIndex].gameId)?.title}</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Kategorie</div>
                  <div className="font-bold">{currentEvents.events[selectedEventIndex].category}</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Teilnehmer</div>
                  <div className="font-bold">{currentEvents.events[selectedEventIndex].participants}</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Preisgeld</div>
                  <div className="font-bold text-green-400">${currentEvents.events[selectedEventIndex].prizePool}</div>
                </div>
              </div>
            </div>
          </SimpleCard>
        </motion.div>

        {/* Racing Games Showcase */}
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Gamepad2 className="text-blue-400" />
            N64 Racing Games
          </h2>
          <p className="text-gray-300 mb-8">
            Alle legendären N64-Rennspiele mit ihren ikonischen Strecken und aktiven Communities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {n64RacingGames.slice(0, 6).map((game, index) => (
              <motion.div
                key={game.id}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -5 }}
                variants={itemVariants}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-4xl">{getGameIcon(game.id)}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{game.title}</h3>
                      <p className="text-sm text-gray-400">{game.releaseYear} • {game.developer}</p>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4">{game.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-sm text-gray-400 mb-1">Strecken</div>
                      <div className="font-bold text-blue-400">{game.tracks.length}</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-sm text-gray-400 mb-1">Speedrunner</div>
                      <div className="font-bold text-green-400">{game.activeSpeedrunners}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {game.speedrunCategories.slice(0, 3).map(category => (
                      <span key={category} className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded border border-purple-600/30">
                        {category}
                      </span>
                    ))}
                    {game.speedrunCategories.length > 3 && (
                      <span className="text-xs bg-gray-600/20 text-gray-300 px-2 py-1 rounded border border-gray-600/30">
                        +{game.speedrunCategories.length - 3}
                      </span>
                    )}
                  </div>

                  <SimpleButton className="w-full" variant="secondary">
                    <ChevronRight className="w-4 h-4 ml-1" />
                    Strecken erkunden
                  </SimpleButton>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Global Leaderboard */}
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Trophy className="text-yellow-400" />
            Global Leaderboard
          </h2>
          <p className="text-gray-300 mb-8">
            Die besten Speedrunner aller N64-Rennspiele im Überblick.
          </p>

          <SimpleCard>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { rank: 1, player: 'abney317', game: 'Mario Kart 64', track: 'Luigi Raceway', time: '1:52.863', points: 15420 },
                  { rank: 2, player: 'Weatherton', game: 'Mario Kart 64', track: 'Moo Moo Farm', time: '1:35.962', points: 14830 },
                  { rank: 3, player: 'TheTrueBrawler', game: 'Diddy Kong Racing', track: 'Ancient Lake', time: '1:43.620', points: 14250 },
                  { rank: 4, player: 'CGN', game: 'F-Zero X', track: 'Mute City I', time: '1:29.847', points: 13890 },
                  { rank: 5, player: 'PodracerPro', game: 'Star Wars Racer', track: 'Boonta Eve Classic', time: '3:47.923', points: 13456 }
                ].map((entry) => (
                  <div key={entry.rank} className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      entry.rank === 1 ? 'bg-yellow-500 text-black' :
                      entry.rank === 2 ? 'bg-gray-400 text-black' :
                      entry.rank === 3 ? 'bg-orange-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {entry.rank}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-bold text-white">{entry.player}</div>
                      <div className="text-sm text-gray-400">{entry.game} • {entry.track}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-mono text-lg font-bold text-green-400">{entry.time}</div>
                      <div className="text-sm text-gray-400">{entry.points.toLocaleString()} Punkte</div>
                    </div>

                    {entry.rank <= 3 && (
                      <Medal className={`w-6 h-6 ${
                        entry.rank === 1 ? 'text-yellow-500' :
                        entry.rank === 2 ? 'text-gray-400' :
                        'text-orange-600'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </SimpleCard>
        </motion.div>

        {/* Upcoming Events Preview */}
        <motion.div variants={itemVariants}>
          <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Clock className="text-purple-400" />
            Nächste Woche
          </h2>
          <p className="text-gray-300 mb-8">
            Bereite dich auf die kommenden Herausforderungen vor!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.events.map((event, index) => (
              <motion.div
                key={event.id}
                className="bg-gradient-to-br from-purple-800/20 to-blue-800/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
                whileHover={{ scale: 1.02, y: -5 }}
                variants={itemVariants}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl opacity-70">{getGameIcon(event.gameId)}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{event.title}</h3>
                    <p className="text-sm text-gray-400">{event.category}</p>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4">{event.description}</p>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    Preisgeld: <span className="text-green-400 font-bold">${event.prizePool}</span>
                  </div>
                  <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded border border-purple-600/30">
                    Bald verfügbar
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default N64SpeedrunHub
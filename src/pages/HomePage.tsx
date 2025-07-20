import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useEvent } from '../contexts/EventContext'
import { GameEvent } from '../types'
import {
  Trophy,
  Target,
  Gamepad2,
  Star,
  Users as UsersIcon,
  Camera,
  Package,
  MessageSquare,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Award,
  TrendingUp
} from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  content: string
  date: Date
  type: 'event_winner' | 'n64_history' | 'community_news'
}

const HomePage: React.FC = () => {
  const { user } = useUser()
  const { events, activeEvents } = useEvent()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isNewsExpanded, setIsNewsExpanded] = useState(false)
  const [isEventExpanded, setIsEventExpanded] = useState(false)

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Mock news data - in a real app, this would come from an API
  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Event Winner: Mario Kart 64 Challenge',
      content: 'Spieler "SpeedDemon64" hat das Mario Kart 64 Speedrun Event mit einer Zeit von 1:47:32 gewonnen!',
      date: new Date(),
      type: 'event_winner'
    },
    {
      id: '2',
      title: 'Heute in der N64 Geschichte',
      content: 'Vor 27 Jahren (1996) wurde das Nintendo 64 in Japan veröffentlicht. Das erste Spiel war Super Mario 64!',
      date: new Date(),
      type: 'n64_history'
    },
    {
      id: '3',
      title: 'Community Update',
      content: 'Neue Speedrun-Kategorien für GoldenEye 007 wurden hinzugefügt. Jetzt mit Agent, Secret Agent und 00 Agent Modi!',
      date: new Date(),
      type: 'community_news'
    }
  ]

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getActiveEvent = () => {
    return activeEvents.length > 0 ? activeEvents[0] : null
  }

  const getEventTimeRemaining = (event: GameEvent) => {
    const now = new Date()
    const endTime = new Date(event.endDate)
    const timeLeft = endTime.getTime() - now.getTime()
    
    if (timeLeft <= 0) return 'Beendet'
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h verbleibend`
    return `${hours}h verbleibend`
  }

  const activeEvent = getActiveEvent()

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-100 mb-2">
          🎮 Battle64
        </h1>
        <p className="text-slate-400 text-lg">
          Die N64-Community für Millennials
        </p>
        <p className="text-blue-400 mt-2">
          {formatDate(currentTime)} - {formatTime(currentTime)}
        </p>
        {user && (
          <p className="text-green-400 mt-1">
            Willkommen zurück, {user.username}! (Level {user.level})
          </p>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* News Feed Tile */}
        <div className="n64-tile n64-tile-large bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border-l-4 border-yellow-400">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold text-slate-100">News Feed</h2>
            </div>
            <button
              onClick={() => setIsNewsExpanded(!isNewsExpanded)}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
            >
              {isNewsExpanded ? (
                <ChevronUp className="w-5 h-5 text-slate-300" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-300" />
              )}
            </button>
          </div>

          <div className="space-y-3">
            {newsItems.slice(0, isNewsExpanded ? newsItems.length : 2).map((item, index) => (
              <div key={item.id} className="p-3 rounded-lg bg-slate-800/30 border border-slate-600/30">
                <div className="flex items-center space-x-2 mb-2">
                  {item.type === 'event_winner' && <Award className="w-4 h-4 text-yellow-400" />}
                  {item.type === 'n64_history' && <Clock className="w-4 h-4 text-blue-400" />}
                  {item.type === 'community_news' && <UsersIcon className="w-4 h-4 text-green-400" />}
                  <span className="text-sm font-medium text-slate-200">{item.title}</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{item.content}</p>
                <p className="text-xs text-slate-500 mt-2">{formatTime(item.date)}</p>
              </div>
            ))}
          </div>

          {!isNewsExpanded && newsItems.length > 2 && (
            <div className="mt-3 text-center">
              <button
                onClick={() => setIsNewsExpanded(true)}
                className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                +{newsItems.length - 2} weitere News anzeigen
              </button>
            </div>
          )}
        </div>

        {/* Event Feed Tile */}
        <div className="n64-tile n64-tile-large bg-gradient-to-br from-red-600/20 to-pink-600/20 border-l-4 border-red-400">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Trophy className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-bold text-slate-100">Live Events</h2>
            </div>
            <button
              onClick={() => setIsEventExpanded(!isEventExpanded)}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
            >
              {isEventExpanded ? (
                <ChevronUp className="w-5 h-5 text-slate-300" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-300" />
              )}
            </button>
          </div>

          {activeEvent ? (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-600/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                    🔴 LIVE
                  </span>
                  <span className="text-xs text-slate-400">{getEventTimeRemaining(activeEvent)}</span>
                </div>
                <h3 className="font-bold text-slate-100 mb-2">{activeEvent.title}</h3>
                <p className="text-sm text-slate-400 mb-3">{activeEvent.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <UsersIcon className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-300">{activeEvent.participants}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Gamepad2 className="w-4 h-4 text-purple-400" />
                      <span className="text-slate-300">{activeEvent.game}</span>
                    </div>
                  </div>
                  <Link 
                    to="/events" 
                    className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-xs font-medium"
                  >
                    Teilnehmen
                  </Link>
                </div>
              </div>

              {isEventExpanded && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-200">Top 3 Leaderboard:</h4>
                  {[1, 2, 3].map((position) => (
                    <div key={position} className="flex items-center justify-between p-2 rounded bg-slate-800/20">
                      <div className="flex items-center space-x-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          position === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                          position === 2 ? 'bg-gray-500/20 text-gray-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {position}
                        </span>
                        <span className="text-sm text-slate-300">Player{position}</span>
                      </div>
                      <span className="text-sm text-slate-400">1:4{7 + position}:32</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400">Keine aktiven Events</p>
              <Link 
                to="/events" 
                className="inline-block mt-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm"
              >
                Alle Events anzeigen
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        
        {/* Quiz Tile */}
        <Link to="/quiz" className="n64-tile n64-tile-small bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-l-4 border-purple-400">
          <div className="text-center">
            <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="font-medium text-slate-100 text-sm">Quiz</div>
            <div className="text-xs text-slate-400">N64 Wissen testen</div>
          </div>
        </Link>

        {/* Events Tile */}
        <Link to="/events" className="n64-tile n64-tile-small bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-l-4 border-yellow-400">
          <div className="text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="font-medium text-slate-100 text-sm">Events</div>
            <div className="text-xs text-slate-400">Turniere & Challenges</div>
          </div>
        </Link>

        {/* Speedrun Media Tile */}
        <Link to="/speedrun-media" className="n64-tile n64-tile-small bg-gradient-to-br from-green-600/20 to-green-800/20 border-l-4 border-green-400">
          <div className="text-center">
            <Camera className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="font-medium text-slate-100 text-sm">Media</div>
            <div className="text-xs text-slate-400">Speedrun Videos</div>
          </div>
        </Link>

        {/* Collector Mode Tile */}
        <Link to="/collector" className="n64-tile n64-tile-small bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-l-4 border-orange-400">
          <div className="text-center">
            <Package className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <div className="font-medium text-slate-100 text-sm">Sammler</div>
            <div className="text-xs text-slate-400">Deine Kollektion</div>
          </div>
        </Link>

        {/* Forum Tile */}
        <Link to="/forum" className="n64-tile n64-tile-small bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border-l-4 border-cyan-400">
          <div className="text-center">
            <MessageSquare className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="font-medium text-slate-100 text-sm">Forum</div>
            <div className="text-xs text-slate-400">Community Talk</div>
          </div>
        </Link>

        {/* Profile Tile */}
        <Link to="/profile" className="n64-tile n64-tile-small bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-l-4 border-blue-400">
          <div className="text-center">
            <UsersIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="font-medium text-slate-100 text-sm">Profil</div>
            <div className="text-xs text-slate-400">Mein Account</div>
          </div>
        </Link>

        {/* Leaderboard Tile */}
        <Link to="/leaderboard" className="n64-tile n64-tile-small bg-gradient-to-br from-pink-600/20 to-pink-800/20 border-l-4 border-pink-400">
          <div className="text-center">
            <Star className="w-8 h-8 text-pink-400 mx-auto mb-2" />
            <div className="font-medium text-slate-100 text-sm">Rangliste</div>
            <div className="text-xs text-slate-400">Top Spieler</div>
          </div>
        </Link>

        {/* Minigames Tile */}
        <Link to="/minigames" className="n64-tile n64-tile-small bg-gradient-to-br from-red-600/20 to-red-800/20 border-l-4 border-red-400">
          <div className="text-center">
            <Gamepad2 className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="font-medium text-slate-100 text-sm">Minispiele</div>
            <div className="text-xs text-slate-400">Kleine Games</div>
          </div>
        </Link>

      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-slate-400 text-sm">
          Battle64 - Wo Nostalgie auf Community trifft
        </p>
        <Link 
          to="/" 
          className="inline-block mt-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors text-sm text-slate-300"
        >
          🎮 Zur Retro-Ansicht
        </Link>
      </div>
    </div>
  )
}

export default HomePage
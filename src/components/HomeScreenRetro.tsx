import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useEvents } from '../contexts/EventContext'
import { useRetroSounds } from './RetroSoundEffects'
import { 
  Brain, 
  Clock, 
  Calendar, 
  Zap, 
  Trophy, 
  Star, 
  Gamepad2, 
  User,
  Target,
  Award,
  ChevronRight,
  Timer,
  Sparkles
} from 'lucide-react'

interface NewsFeedData {
  date: string
  eventWinner: string
  n64Game: string
  gameHistory: string
}

interface EventData {
  name: string
  mode: string
  topUsers: Array<{ name: string; score: string }>
  isActive: boolean
  timeRemaining?: string
}

const HomeScreenRetro: React.FC = () => {
  const { user } = useUser()
  const { activeEvents, upcomingEvents } = useEvents()
  const { playStartSound, playPowerUpSound } = useRetroSounds()
  const navigate = useNavigate()
  
  const [newsExpanded, setNewsExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second for live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Mock news data - in real app this would come from API
  const newsData: NewsFeedData = {
    date: currentTime.toLocaleDateString('de-DE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    eventWinner: user?.username || 'Mario64Pro',
    n64Game: 'Super Mario 64',
    gameHistory: 'Released on June 23, 1996, Super Mario 64 was a revolutionary 3D platformer that launched alongside the Nintendo 64 console. It introduced analog control and full 3D movement to the Mario series.'
  }

  // Get current/active event data
  const currentEvent = activeEvents[0] || upcomingEvents[0]
  const eventData: EventData = currentEvent ? {
    name: currentEvent.title,
    mode: currentEvent.type === 'Time Trial' ? 'Time Trial' : 'Competition',
    topUsers: [
      { name: 'Oli', score: ':55' },
      { name: 'Delia', score: '1:06*7' },
      { name: 'Erik', score: '1:10:22' }
    ],
    isActive: currentEvent.isActive || false,
    timeRemaining: currentEvent.isActive ? '2d 14h' : 'Starts in 1d 5h'
  } : {
    name: 'Tata Tuga Volcano',
    mode: 'Time Trial',
    topUsers: [
      { name: 'Oli', score: ':55' },
      { name: 'Delia', score: '1:06*7' },
      { name: 'Erik', score: '1:10:22' }
    ],
    isActive: true,
    timeRemaining: '2d 14h'
  }

  const handleTileClick = (sound: 'start' | 'powerup') => {
    if (sound === 'start') playStartSound()
    else playPowerUpSound()
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-n64-gray via-gray-900 to-n64-gray p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpolygon points="30 0 60 30 30 60 0 30"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-shadow-lg mb-2 neon-text text-n64-purple font-tech animate-pulse">
          🎮 BATTLE64
        </h1>
        <p className="text-white/70 font-game text-sm md:text-base">
          Welcome back, {user.username}! • Level {user.level}
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Top Row - Large Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* News Feed Tile */}
          <div 
            className={`retro-tile retro-tile-news ${newsExpanded ? 'expanded' : ''} cursor-pointer`}
            onClick={() => {
              setNewsExpanded(!newsExpanded)
              handleTileClick('start')
            }}
          >
            <div className="retro-tile-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-n64-yellow" />
                  <span className="font-tech text-n64-yellow text-sm">NEWS FEED</span>
                </div>
                <div className="text-n64-yellow animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            <div className="retro-tile-content">
              <div className="text-xs text-white/80 font-game mb-2">
                {newsData.date}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-n64-yellow" />
                  <span className="text-sm font-game text-white">
                    Winner: <span className="text-n64-yellow">{newsData.eventWinner}</span>
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Gamepad2 className="w-4 h-4 text-n64-blue" />
                  <span className="text-sm font-game text-white">
                    Game: <span className="text-n64-blue">{newsData.n64Game}</span>
                  </span>
                </div>
              </div>
              
              {newsExpanded && (
                <div className="mt-4 pt-4 border-t border-white/20 animate-fade-in">
                  <p className="text-xs text-white/70 font-game leading-relaxed">
                    {newsData.gameHistory}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Event Info Tile */}
          <div className="retro-tile retro-tile-event">
            <div className="retro-tile-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-n64-red animate-pulse" />
                  <span className="font-tech text-n64-red text-sm">EVENTS</span>
                  <span className="text-xs text-n64-green font-game">1 ACTIVE</span>
                </div>
                <div className="text-n64-red animate-bounce">
                  <Timer className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            <div className="retro-tile-content">
              <div className="mb-3">
                <h3 className="text-sm font-tech text-white mb-1">{eventData.name}</h3>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-n64-purple font-game">{eventData.mode}</span>
                  <span className="text-white/60">•</span>
                  <span className="text-n64-green font-game">{eventData.timeRemaining}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-n64-yellow font-tech mb-1">TOP 3</div>
                {eventData.topUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-n64-yellow font-tech">{index + 1}.</span>
                      <span className="text-white font-game">{user.name}</span>
                    </div>
                    <span className="text-n64-green font-tech">{user.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tiles Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Quiz Tile */}
          <Link to="/quiz" className="block">
            <div 
              className="retro-tile retro-tile-small retro-tile-quiz"
              onClick={() => handleTileClick('start')}
            >
              <div className="retro-tile-icon">
                <Brain className="w-6 h-6 text-n64-purple" />
              </div>
              <div className="retro-tile-label">
                <span className="font-tech text-xs text-white">QUIZ</span>
              </div>
            </div>
          </Link>

          {/* Minigames Tile */}
          <Link to="/minigames" className="block">
            <div 
              className="retro-tile retro-tile-small retro-tile-minigames"
              onClick={() => handleTileClick('start')}
            >
              <div className="retro-tile-icon">
                <Gamepad2 className="w-6 h-6 text-n64-blue" />
              </div>
              <div className="retro-tile-label">
                <span className="font-tech text-xs text-white">MINI</span>
              </div>
            </div>
          </Link>

          {/* Leaderboard Tile */}
          <Link to="/leaderboard" className="block">
            <div 
              className="retro-tile retro-tile-small retro-tile-leaderboard"
              onClick={() => handleTileClick('start')}
            >
              <div className="retro-tile-icon">
                <Trophy className="w-6 h-6 text-n64-yellow" />
              </div>
              <div className="retro-tile-label">
                <span className="font-tech text-xs text-white">RANKS</span>
              </div>
            </div>
          </Link>

          {/* Profile Tile */}
          <Link to="/profile" className="block">
            <div 
              className="retro-tile retro-tile-small retro-tile-profile"
              onClick={() => handleTileClick('start')}
            >
              <div className="retro-tile-icon">
                <User className="w-6 h-6 text-n64-green" />
              </div>
              <div className="retro-tile-label">
                <span className="font-tech text-xs text-white">PROFILE</span>
              </div>
            </div>
          </Link>

          {/* Events Tile */}
          <Link to="/events" className="block">
            <div 
              className="retro-tile retro-tile-small retro-tile-events"
              onClick={() => handleTileClick('powerup')}
            >
              <div className="retro-tile-icon">
                <Target className="w-6 h-6 text-n64-red" />
              </div>
              <div className="retro-tile-label">
                <span className="font-tech text-xs text-white">EVENTS</span>
              </div>
            </div>
          </Link>

          {/* Speedrun Media Tile */}
          <Link to="/speedrun-media" className="block">
            <div 
              className="retro-tile retro-tile-small retro-tile-media"
              onClick={() => handleTileClick('powerup')}
            >
              <div className="retro-tile-icon">
                <Award className="w-6 h-6 text-n64-purple" />
              </div>
              <div className="retro-tile-label">
                <span className="font-tech text-xs text-white">MEDIA</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Floating N64 Logo Switch Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            handleTileClick('powerup')
            navigate('/')
          }}
          className="retro-switch-button"
          title="Switch to Classic View"
        >
          <div className="retro-n64-logo">
            <span className="font-tech text-xs text-white">N64</span>
          </div>
        </button>
      </div>
    </div>
  )
}

export default HomeScreenRetro
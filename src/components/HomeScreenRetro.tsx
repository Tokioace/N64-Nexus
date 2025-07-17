import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useEvents } from '../contexts/EventContext'
import { useRetroSounds } from './RetroSoundEffects'
import { 
  Brain, 
  Calendar, 
  Zap, 
  Trophy, 
  Gamepad2, 
  User,
  Target,
  Award,
  Timer,
  Sparkles,
  Clock,
  Star,
  ChevronRight,
  Users,
  Camera
} from 'lucide-react'

interface NewsFeedData {
  date: string
  eventWinner: {
    name: string
    score: string
    event: string
  }
  n64Game: {
    title: string
    releaseDate: string
    trivia: string
  }
  todayInHistory: string
}

interface LiveEventData {
  name: string
  mode: string
  timeRemaining: string
  topUsers: Array<{ 
    name: string
    score: string
    position: number
  }>
  isActive: boolean
  participants: number
}

const HomeScreenRetro: React.FC = () => {
  const { user } = useUser()
  const { activeEvents, upcomingEvents, getTimeRemaining } = useEvents()
  const { playStartSound, playPowerUpSound } = useRetroSounds()
  const navigate = useNavigate()
  
  const [newsExpanded, setNewsExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hoveredTile, setHoveredTile] = useState<string | null>(null)

  // Update time every second for live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Historical N64 games data for "today in history"
  const getHistoricalN64Game = () => {
    const today = new Date()
    const month = today.getMonth() + 1
    const day = today.getDate()
    
    // Mock historical data - in real app this would come from API
    const historicalGames = [
      { title: 'Super Mario 64', date: '6/23', trivia: 'Launched alongside the N64, introducing 3D analog movement to Mario.' },
      { title: 'Mario Kart 64', date: '2/10', trivia: 'Featured the iconic Rainbow Road and 4-player split-screen racing.' },
      { title: 'GoldenEye 007', date: '8/25', trivia: 'Revolutionized console FPS gaming with its split-screen multiplayer.' },
      { title: 'The Legend of Zelda: Ocarina of Time', date: '11/21', trivia: 'First 3D Zelda adventure with Z-targeting system.' },
      { title: 'Super Smash Bros.', date: '1/21', trivia: 'Nintendo characters fighting for the first time in gaming history.' }
    ]
    
    const todayKey = `${month}/${day}`
    return historicalGames.find(game => game.date === todayKey) || historicalGames[0]
  }

  // Mock news data - in real app this would come from API
  const newsData: NewsFeedData = {
    date: currentTime.toLocaleDateString('de-DE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    eventWinner: {
      name: user?.username || 'Mario64Pro',
      score: '1:02.55',
      event: 'Tata Tuga Volcano Time Trial'
    },
    n64Game: getHistoricalN64Game(),
    todayInHistory: `On this day in 1996, the Nintendo 64 changed gaming forever.`
  }

  // Get current/active event data with better structure
  const currentEvent = activeEvents[0] || upcomingEvents[0]
  const liveEventData: LiveEventData = currentEvent ? {
    name: currentEvent.title,
    mode: currentEvent.type,
    timeRemaining: currentEvent.isActive ? '2d 14h 23m' : 'Starts in 1d 5h',
    topUsers: [
      { name: 'Oli', score: ':55', position: 1 },
      { name: 'Delia', score: '1:06.97', position: 2 },
      { name: 'Erik', score: '1:10.22', position: 3 }
    ],
    isActive: currentEvent.isActive || false,
    participants: currentEvent.participants || 47
  } : {
    name: 'Tata Tuga Volcano',
    mode: 'Time Trial',
    timeRemaining: '2d 14h 23m',
    topUsers: [
      { name: 'Oli', score: ':55', position: 1 },
      { name: 'Delia', score: '1:06.97', position: 2 },
      { name: 'Erik', score: '1:10.22', position: 3 }
    ],
    isActive: true,
    participants: 47
  }

  const handleTileClick = (tileId: string, sound: 'start' | 'powerup' = 'start') => {
    if (sound === 'start') playStartSound()
    else playPowerUpSound()
  }

  const handleTileHover = (tileId: string | null) => {
    setHoveredTile(tileId)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-n64-gray via-gray-900 to-black p-4 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2280%22%20height%3D%2280%22%20viewBox%3D%220%200%2080%2080%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpolygon%20points%3D%2240%200%2080%2040%2040%2080%200%2040%22/%3E%3Cpolygon%20points%3D%2220%2010%2030%2020%2020%2030%2010%2020%22/%3E%3Cpolygon%20points%3D%2260%2010%2070%2020%2260%2030%2050%2020%22/%3E%3Cpolygon%20points%3D%2220%2050%2030%2060%2020%2070%2010%2060%22/%3E%3Cpolygon%20points%3D%2260%2050%2070%2060%2260%2070%2050%2060%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Header with Live Clock */}
      <div className="relative z-10 text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-shadow-lg mb-3 neon-text text-n64-purple font-tech">
          🎮 BATTLE64
        </h1>
        <div className="flex items-center justify-center space-x-4 text-white/80 font-game text-sm">
          <span>Welcome back, {user.username}!</span>
          <span>•</span>
          <span>Level {user.level}</span>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{currentTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Top Row - Large Feature Tiles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* News Feed Tile */}
          <div 
            className={`n64-tile n64-tile-large n64-tile-news ${newsExpanded ? 'expanded' : ''} ${hoveredTile === 'news' ? 'hovered' : ''}`}
            onClick={() => {
              setNewsExpanded(!newsExpanded)
              handleTileClick('news', 'start')
            }}
            onMouseEnter={() => handleTileHover('news')}
            onMouseLeave={() => handleTileHover(null)}
          >
            <div className="n64-tile-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-n64-yellow" />
                  <span className="font-tech text-n64-yellow text-lg">NEWS FEED</span>
                </div>
                <div className="text-n64-yellow animate-pulse">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div className="n64-tile-content">
              <div className="text-sm text-white/90 font-game mb-4">
                {newsData.date}
              </div>
              
              <div className="space-y-4">
                {/* Event Winner Section */}
                <div className="bg-black/20 rounded-lg p-4 border border-n64-yellow/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Trophy className="w-5 h-5 text-n64-yellow" />
                    <span className="text-sm font-tech text-n64-yellow">LATEST WINNER</span>
                  </div>
                  <div className="text-white font-game">
                    <div className="text-lg text-n64-yellow">{newsData.eventWinner.name}</div>
                    <div className="text-sm text-white/80">{newsData.eventWinner.event}</div>
                    <div className="text-lg text-n64-green font-tech">{newsData.eventWinner.score}</div>
                  </div>
                </div>
                
                {/* Historical Game Section */}
                <div className="bg-black/20 rounded-lg p-4 border border-n64-blue/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Gamepad2 className="w-5 h-5 text-n64-blue" />
                    <span className="text-sm font-tech text-n64-blue">TODAY IN N64 HISTORY</span>
                  </div>
                  <div className="text-white font-game">
                    <div className="text-lg text-n64-blue">{newsData.n64Game.title}</div>
                    {newsExpanded && (
                      <div className="mt-2 text-sm text-white/80 leading-relaxed animate-fade-in">
                        {newsData.n64Game.trivia}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center text-n64-purple text-sm font-game">
                <span>Click to {newsExpanded ? 'collapse' : 'expand'}</span>
                <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${newsExpanded ? 'rotate-90' : ''}`} />
              </div>
            </div>
          </div>

          {/* Live Events Tile */}
          <div 
            className={`n64-tile n64-tile-large n64-tile-events ${hoveredTile === 'events' ? 'hovered' : ''}`}
            onMouseEnter={() => handleTileHover('events')}
            onMouseLeave={() => handleTileHover(null)}
          >
            <div className="n64-tile-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-n64-red animate-pulse" />
                  <span className="font-tech text-n64-red text-lg">EVENTS LIVE</span>
                  <span className={`text-sm font-game px-2 py-1 rounded ${liveEventData.isActive ? 'bg-n64-green/20 text-n64-green' : 'bg-n64-yellow/20 text-n64-yellow'}`}>
                    {liveEventData.isActive ? 'ACTIVE' : 'UPCOMING'}
                  </span>
                </div>
                <div className="text-n64-red animate-bounce">
                  <Timer className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div className="n64-tile-content">
              {/* Event Info */}
              <div className="mb-6">
                <h3 className="text-xl font-tech text-white mb-2">{liveEventData.name}</h3>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-n64-purple font-game">{liveEventData.mode}</span>
                    <div className="flex items-center space-x-1 text-n64-blue">
                      <Users className="w-4 h-4" />
                      <span className="font-game">{liveEventData.participants}</span>
                    </div>
                  </div>
                  <div className="text-n64-green font-tech text-lg">
                    {liveEventData.timeRemaining}
                  </div>
                </div>
              </div>
              
              {/* Live Leaderboard */}
              <div className="bg-black/30 rounded-lg p-4 border border-n64-red/30">
                <div className="text-sm text-n64-yellow font-tech mb-3 flex items-center space-x-2">
                  <Trophy className="w-4 h-4" />
                  <span>LIVE TOP 3</span>
                </div>
                <div className="space-y-2">
                  {liveEventData.topUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-tech ${
                          index === 0 ? 'bg-n64-yellow text-black' : 
                          index === 1 ? 'bg-gray-400 text-black' : 
                          'bg-orange-600 text-white'
                        }`}>
                          {user.position}
                        </div>
                        <span className="text-white font-game">{user.name}</span>
                      </div>
                      <span className="text-n64-green font-tech text-lg">{user.score}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Link to="/events" className="block mt-4">
                <div className="text-center bg-n64-red/20 hover:bg-n64-red/30 border border-n64-red/50 rounded-lg py-2 transition-all duration-200 font-game text-n64-red">
                  View All Events →
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tiles Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Quiz Tile */}
          <Link to="/quiz" className="block">
            <div 
              className={`n64-tile n64-tile-small n64-tile-quiz ${hoveredTile === 'quiz' ? 'hovered' : ''}`}
              onClick={() => handleTileClick('quiz', 'start')}
              onMouseEnter={() => handleTileHover('quiz')}
              onMouseLeave={() => handleTileHover(null)}
            >
              <div className="n64-tile-icon">
                <Brain className="w-8 h-8 text-n64-purple" />
              </div>
              <div className="n64-tile-label">
                <span className="font-tech text-sm text-white">QUIZ</span>
              </div>
            </div>
          </Link>

          {/* Minigames Tile */}
          <Link to="/minigames" className="block">
            <div 
              className={`n64-tile n64-tile-small n64-tile-minigames ${hoveredTile === 'minigames' ? 'hovered' : ''}`}
              onClick={() => handleTileClick('minigames', 'start')}
              onMouseEnter={() => handleTileHover('minigames')}
              onMouseLeave={() => handleTileHover(null)}
            >
              <div className="n64-tile-icon">
                <Star className="w-8 h-8 text-n64-blue" />
              </div>
              <div className="n64-tile-label">
                <span className="font-tech text-sm text-white">MINI</span>
              </div>
            </div>
          </Link>

          {/* Speedrun Media Tile */}
          <Link to="/speedrun-media" className="block">
            <div 
              className={`n64-tile n64-tile-small n64-tile-media ${hoveredTile === 'media' ? 'hovered' : ''}`}
              onClick={() => handleTileClick('media', 'powerup')}
              onMouseEnter={() => handleTileHover('media')}
              onMouseLeave={() => handleTileHover(null)}
            >
              <div className="n64-tile-icon">
                <Camera className="w-8 h-8 text-n64-yellow" />
              </div>
              <div className="n64-tile-label">
                <span className="font-tech text-sm text-white">MEDIA</span>
              </div>
            </div>
          </Link>

          {/* Community/Rankings Tile */}
          <Link to="/leaderboard" className="block">
            <div 
              className={`n64-tile n64-tile-small n64-tile-leaderboard ${hoveredTile === 'leaderboard' ? 'hovered' : ''}`}
              onClick={() => handleTileClick('leaderboard', 'start')}
              onMouseEnter={() => handleTileHover('leaderboard')}
              onMouseLeave={() => handleTileHover(null)}
            >
              <div className="n64-tile-icon">
                <Trophy className="w-8 h-8 text-n64-green" />
              </div>
              <div className="n64-tile-label">
                <span className="font-tech text-sm text-white">RANKS</span>
              </div>
            </div>
          </Link>

          {/* Events Tile */}
          <Link to="/events" className="block">
            <div 
              className={`n64-tile n64-tile-small n64-tile-events-small ${hoveredTile === 'events-small' ? 'hovered' : ''}`}
              onClick={() => handleTileClick('events-small', 'powerup')}
              onMouseEnter={() => handleTileHover('events-small')}
              onMouseLeave={() => handleTileHover(null)}
            >
              <div className="n64-tile-icon">
                <Target className="w-8 h-8 text-n64-red" />
              </div>
              <div className="n64-tile-label">
                <span className="font-tech text-sm text-white">EVENTS</span>
              </div>
            </div>
          </Link>

          {/* Profile Tile */}
          <Link to="/profile" className="block">
            <div 
              className={`n64-tile n64-tile-small n64-tile-profile ${hoveredTile === 'profile' ? 'hovered' : ''}`}
              onClick={() => handleTileClick('profile', 'start')}
              onMouseEnter={() => handleTileHover('profile')}
              onMouseLeave={() => handleTileHover(null)}
            >
              <div className="n64-tile-icon">
                <User className="w-8 h-8 text-n64-purple" />
              </div>
              <div className="n64-tile-label">
                <span className="font-tech text-sm text-white">PROFILE</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Floating N64 Switch Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            handleTileClick('switch', 'powerup')
            navigate('/classic')
          }}
          className="n64-switch-button"
          title="Switch to Classic View"
        >
          <div className="n64-logo">
            <span className="font-tech text-sm text-white">N64</span>
          </div>
        </button>
      </div>
    </div>
  )
}

export default HomeScreenRetro
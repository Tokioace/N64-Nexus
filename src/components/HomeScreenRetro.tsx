import React from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useEvents } from '../contexts/EventContext'

import { 
  Brain, 
  Calendar, 
  Zap, 
  Trophy, 
  Gamepad2, 
  Camera,
  Clock,
  Star,
  Package,
  MessageSquare
} from 'lucide-react'

const HomeScreenRetro: React.FC = () => {
  const { user } = useUser()
  const { activeEvents, upcomingEvents } = useEvents()
  
  const currentEvent = activeEvents[0] || upcomingEvents[0]

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-900 p-4 overflow-hidden">
      {/* Kompakter Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">
          🎮 BATTLE64
        </h1>
        <div className="flex items-center justify-center space-x-4 text-slate-300 text-sm">
          <span>Welcome back, {user.username}!</span>
          <span>•</span>
          <span>Level {user.level}</span>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Hauptlayout - Kompakt ohne Scrollen */}
      <div className="max-w-7xl mx-auto">
        {/* Obere Reihe - Events links, News rechts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Events Tile - Links */}
          <div className="simple-tile" style={{ minHeight: '180px' }}>
            <div className="simple-tile-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-red-400" />
                  <span className="font-medium text-red-400">LIVE EVENT</span>
                </div>
                <Link to="/events" className="text-red-400 hover:text-red-300 transition-colors">
                  <Calendar className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="simple-tile-content">
              <div className="text-xl font-bold text-slate-100 mb-2">
                {currentEvent?.title || 'Tata Tuga Volcano'}
              </div>
              <div className="text-sm text-slate-400 mb-3">
                {currentEvent?.type || 'Time Trial'} • 2d 14h 23m
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Participants</span>
                  <span className="font-medium text-slate-100">{currentEvent?.participants || 47}</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">1. Oli</span>
                    <span className="font-medium text-slate-100">:55</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">2. Delia</span>
                    <span className="font-medium text-slate-100">1:06.97</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* News Feed Tile - Rechts */}
          <div className="simple-tile" style={{ minHeight: '180px' }}>
            <div className="simple-tile-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <span className="font-medium text-blue-400">NEWS FEED</span>
                </div>
                <div className="text-blue-400">
                  <Star className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            <div className="simple-tile-content">
              <div className="text-sm text-slate-400 mb-3">
                {new Date().toLocaleDateString('de-DE', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              
              <div className="space-y-3">
                {/* Latest Winner */}
                <div className="bg-slate-700 rounded-lg p-3 border border-slate-600">
                  <div className="flex items-center space-x-2 mb-1">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="font-medium text-slate-100 text-sm">Latest Winner</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-200">
                    {user.profileImage ? (
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-purple-400/50">
                        <img
                          src={user.profileImage}
                          alt="N64 Character"
                          className="w-full h-full object-cover"
                          style={{
                            imageRendering: 'pixelated'
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center text-sm">
                        🎮
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-sm">{user.username}</div>
                      <div className="text-xs text-slate-400">Tata Tuga Volcano - 1:02.55</div>
                    </div>
                  </div>
                </div>

                {/* N64 History */}
                <div className="bg-slate-700 rounded-lg p-3 border border-slate-600">
                  <div className="flex items-center space-x-2 mb-1">
                    <Gamepad2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium text-slate-100 text-sm">N64 History</span>
                  </div>
                  <div className="text-slate-200">
                    <div className="font-medium text-sm">Super Mario 64</div>
                    <div className="text-xs text-slate-400">3D analog movement pioneer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Untere Reihe - Alle Features kompakt */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-3">
          {/* NEW: N64 Camera Creator Tile - Featured */}
          <Link to="/n64-camera" className="simple-tile simple-tile-small hover:scale-105 transition-transform bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-pink-400/30">
            <div className="simple-tile-icon">
              <Camera className="w-7 h-7 text-pink-400 mx-auto" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-pink-100 text-sm">N64 Camera</div>
              <div className="text-xs text-pink-300">NEW!</div>
            </div>
          </Link>

          {/* Quiz Tile */}
          <Link to="/quiz" className="simple-tile simple-tile-small hover:scale-105 transition-transform">
            <div className="simple-tile-icon">
              <Brain className="w-7 h-7 text-purple-400 mx-auto" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm">Quiz</div>
              <div className="text-xs text-slate-400">Test Knowledge</div>
            </div>
          </Link>

          {/* Minigames Tile */}
          <Link to="/minigames" className="simple-tile simple-tile-small hover:scale-105 transition-transform">
            <div className="simple-tile-icon">
              <Gamepad2 className="w-7 h-7 text-blue-400 mx-auto" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm">Minigames</div>
              <div className="text-xs text-slate-400">Play Games</div>
            </div>
          </Link>

          {/* Speedrun Media Tile */}
          <Link to="/speedrun-media" className="simple-tile simple-tile-small hover:scale-105 transition-transform">
            <div className="simple-tile-icon">
              <Camera className="w-7 h-7 text-yellow-400 mx-auto" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm">Media</div>
              <div className="text-xs text-slate-400">Speedrun Videos</div>
            </div>
          </Link>

          {/* Leaderboard Tile */}
          <Link to="/leaderboard" className="simple-tile simple-tile-small hover:scale-105 transition-transform">
            <div className="simple-tile-icon">
              <Trophy className="w-7 h-7 text-emerald-400 mx-auto" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm">Leaderboard</div>
              <div className="text-xs text-slate-400">Rankings</div>
            </div>
          </Link>

          {/* Events Tile */}
          <Link to="/events" className="simple-tile simple-tile-small hover:scale-105 transition-transform">
            <div className="simple-tile-icon">
              <Calendar className="w-7 h-7 text-red-400 mx-auto" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm">Events</div>
              <div className="text-xs text-slate-400">Competitions</div>
            </div>
          </Link>

          {/* Collector Mode Tile */}
          <Link to="/collector" className="simple-tile simple-tile-small hover:scale-105 transition-transform">
            <div className="simple-tile-icon">
              <Package className="w-7 h-7 text-orange-400 mx-auto" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm">Sammlung</div>
              <div className="text-xs text-slate-400">N64 Games</div>
            </div>
          </Link>

          {/* Forum Tile */}
          <Link to="/forum" className="simple-tile simple-tile-small">
            <div className="simple-tile-icon">
              <MessageSquare className="w-7 h-7 text-cyan-400 mx-auto" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm">Forum</div>
              <div className="text-xs text-slate-400">Community</div>
            </div>
          </Link>

          {/* Profile Tile */}
          <Link to="/profile" className="simple-tile simple-tile-small hover:scale-105 transition-transform">
            <div className="simple-tile-icon">
              <Gamepad2 className="w-7 h-7 text-indigo-400 mx-auto" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-slate-100 text-sm">Profile</div>
              <div className="text-xs text-slate-400">Your Stats</div>
            </div>
          </Link>
        </div>
      </div>


    </div>
  )
}

export default HomeScreenRetro
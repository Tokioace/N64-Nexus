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
  User,
  Target,
  Award,
  Timer,
  Clock,
  Star,
  Users,
  Camera
} from 'lucide-react'

const HomeScreenRetro: React.FC = () => {
  const { user } = useUser()
  const { activeEvents, upcomingEvents } = useEvents()
  
  const currentEvent = activeEvents[0] || upcomingEvents[0]

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          🎮 BATTLE64
        </h1>
        <div className="flex items-center justify-center space-x-4 text-gray-600 text-sm">
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

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto">
        {/* Top Row - Large Feature Tiles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* News Feed Tile */}
          <div className="simple-tile simple-tile-large">
            <div className="simple-tile-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <span className="font-medium text-blue-600 text-lg">NEWS FEED</span>
                </div>
                <div className="text-blue-600">
                  <Star className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div className="simple-tile-content">
              <div className="text-sm text-gray-600 mb-4">
                {new Date().toLocaleDateString('de-DE', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              
              <div className="space-y-4">
                {/* Event Winner Section */}
                <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-gray-900">Latest Winner</span>
                  </div>
                  <div className="text-gray-700">
                    <div className="font-medium">{user.username}</div>
                    <div className="text-sm text-gray-500">Tata Tuga Volcano Time Trial - 1:02.55</div>
                  </div>
                </div>

                {/* Today in History */}
                <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Gamepad2 className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">Today in N64 History</span>
                  </div>
                  <div className="text-gray-700">
                    <div className="font-medium">Super Mario 64</div>
                    <div className="text-sm text-gray-500">Launched alongside the N64, introducing 3D analog movement to Mario.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Event Tile */}
          <div className="simple-tile simple-tile-large">
            <div className="simple-tile-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap className="w-6 h-6 text-red-600" />
                  <span className="font-medium text-red-600 text-lg">LIVE EVENT</span>
                </div>
                <div className="text-red-600">
                  <Timer className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div className="simple-tile-content">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {currentEvent?.title || 'Tata Tuga Volcano'}
              </div>
              <div className="text-sm text-gray-600 mb-4">
                {currentEvent?.type || 'Time Trial'} • 2d 14h 23m remaining
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Participants</span>
                  <span className="font-medium text-gray-900">{currentEvent?.participants || 47}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-900">Top Players</div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">1. Oli</span>
                      <span className="font-medium text-gray-900">:55</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">2. Delia</span>
                      <span className="font-medium text-gray-900">1:06.97</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">3. Erik</span>
                      <span className="font-medium text-gray-900">1:10.22</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Navigation Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Quiz Tile */}
          <Link to="/quiz" className="simple-tile simple-tile-small">
            <div className="simple-tile-icon">
              <Brain className="w-8 h-8 text-purple-600 mx-auto" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-gray-900">Quiz</div>
              <div className="text-xs text-gray-500">Test Knowledge</div>
            </div>
          </Link>

          {/* Minigames Tile */}
          <Link to="/minigames" className="simple-tile simple-tile-small">
            <div className="simple-tile-icon">
              <Gamepad2 className="w-8 h-8 text-blue-600 mx-auto" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-gray-900">Minigames</div>
              <div className="text-xs text-gray-500">Play Games</div>
            </div>
          </Link>

          {/* Speedrun Media Tile */}
          <Link to="/speedrun-media" className="simple-tile simple-tile-small">
            <div className="simple-tile-icon">
              <Camera className="w-8 h-8 text-yellow-600 mx-auto" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-gray-900">Media</div>
              <div className="text-xs text-gray-500">Speedrun Videos</div>
            </div>
          </Link>

          {/* Leaderboard Tile */}
          <Link to="/leaderboard" className="simple-tile simple-tile-small">
            <div className="simple-tile-icon">
              <Trophy className="w-8 h-8 text-green-600 mx-auto" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-gray-900">Leaderboard</div>
              <div className="text-xs text-gray-500">Rankings</div>
            </div>
          </Link>

          {/* Events Tile */}
          <Link to="/events" className="simple-tile simple-tile-small">
            <div className="simple-tile-icon">
              <Calendar className="w-8 h-8 text-red-600 mx-auto" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-gray-900">Events</div>
              <div className="text-xs text-gray-500">Competitions</div>
            </div>
          </Link>

          {/* Profile Tile */}
          <Link to="/profile" className="simple-tile simple-tile-small">
            <div className="simple-tile-icon">
              <User className="w-8 h-8 text-indigo-600 mx-auto" />
            </div>
            <div className="simple-tile-label">
              <div className="font-medium text-gray-900">Profile</div>
              <div className="text-xs text-gray-500">Your Stats</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomeScreenRetro
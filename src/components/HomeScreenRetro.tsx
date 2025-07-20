import React from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import {
  Trophy,
  Target,
  Gamepad2,
  Star,
  Users as UsersIcon,
  Camera,
  Package,
  MessageSquare
} from 'lucide-react'

const HomeScreenRetro: React.FC = () => {
  const { user } = useUser()

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
        {user && (
          <p className="text-blue-400 mt-2">
            Willkommen zurück, {user.username}! (Level {user.level})
          </p>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        
        {/* Quiz Tile */}
        <Link to="/quiz" className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <Target className="w-7 h-7 text-purple-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-slate-100 text-sm">Quiz</div>
            <div className="text-xs text-slate-400">N64 Wissen</div>
          </div>
        </Link>

        {/* Events Tile */}
        <Link to="/events" className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <Trophy className="w-7 h-7 text-yellow-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-slate-100 text-sm">Events</div>
            <div className="text-xs text-slate-400">Turniere</div>
          </div>
        </Link>

        {/* Speedrun Media Tile */}
        <Link to="/speedrun-media" className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <Camera className="w-7 h-7 text-green-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-slate-100 text-sm">Media</div>
            <div className="text-xs text-slate-400">Speedruns</div>
          </div>
        </Link>

        {/* Collector Mode Tile */}
        <Link to="/collector" className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <Package className="w-7 h-7 text-orange-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-slate-100 text-sm">Sammler</div>
            <div className="text-xs text-slate-400">Kollektion</div>
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
        <Link to="/profile" className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <UsersIcon className="w-7 h-7 text-blue-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-slate-100 text-sm">Profil</div>
            <div className="text-xs text-slate-400">Mein Account</div>
          </div>
        </Link>

        {/* Leaderboard Tile */}
        <Link to="/leaderboard" className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <Star className="w-7 h-7 text-pink-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-slate-100 text-sm">Rangliste</div>
            <div className="text-xs text-slate-400">Top Spieler</div>
          </div>
        </Link>

        {/* Minigames Tile */}
        <Link to="/minigames" className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <Gamepad2 className="w-7 h-7 text-red-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="font-medium text-slate-100 text-sm">Minispiele</div>
            <div className="text-xs text-slate-400">Spaß</div>
          </div>
        </Link>

      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-slate-400 text-sm">
          Retro neu entfacht - Für die N64-Generation
        </p>
      </div>
    </div>
  )
}

export default HomeScreenRetro
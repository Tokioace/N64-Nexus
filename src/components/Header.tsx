import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { Brain, Trophy, Users, User, Home } from 'lucide-react'

const Header: React.FC = () => {
  const { state } = useUser()
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/quiz', label: 'Quiz', icon: Brain },
    { path: '/duel', label: 'Duell', icon: Users },
    { path: '/leaderboard', label: 'Rangliste', icon: Trophy },
    { path: '/profile', label: 'Profil', icon: User },
  ]

  return (
    <header className="bg-gradient-to-r from-n64-purple/90 to-n64-blue/90 backdrop-blur-sm border-b-2 border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-n64-yellow to-n64-red rounded-lg flex items-center justify-center">
              <span className="font-pixel text-white text-lg">64</span>
            </div>
            <div>
              <h1 className="font-pixel text-xl text-white">Battle64</h1>
              <p className="text-xs text-white/70 font-retro">Quiz System</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white/20 text-white border-2 border-white/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={16} />
                  <span className="font-retro text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            {state.isAuthenticated && state.profile ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="font-pixel text-sm text-white">
                    {state.profile.username}
                  </p>
                  <p className="text-xs text-white/70">
                    Level {state.profile.level} • {state.profile.xp} XP
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-n64-green to-n64-blue rounded-full flex items-center justify-center">
                  <span className="font-pixel text-white text-sm">
                    {state.profile.level}
                  </span>
                </div>
              </div>
            ) : (
              <button className="retro-button">
                <span className="font-pixel text-sm">Anmelden</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex justify-center space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={20} />
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

export default Header
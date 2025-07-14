import { Link, useLocation } from 'react-router-dom'
import { Trophy, Target, History, User, BarChart3, Home } from 'lucide-react'
import { User as UserType } from '../types'

interface NavigationProps {
  user: UserType
}

const Navigation: React.FC<NavigationProps> = ({ user }) => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/goals', label: 'Ziele', icon: Target },
    { path: '/history', label: 'Verlauf', icon: History },
    { path: '/profile', label: 'Profil', icon: User },
  ]

  return (
    <nav className="bg-retro-dark border-b border-retro-purple shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-retro-purple to-retro-pink rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-arcade text-white">Battle64</h1>
              <p className="text-xs text-retro-gray">Statistiken & Fortschritt</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-retro-purple text-white shadow-lg'
                      : 'text-retro-gray hover:text-white hover:bg-retro-darker'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-retro">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-retro text-white">{user.username}</p>
                <p className="text-xs text-retro-gray">
                  {user.totalRuns} Runs • {user.totalGames} Spiele
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-retro-green to-retro-cyan rounded-full flex items-center justify-center">
                <span className="text-white font-arcade text-sm">
                  {user.username.charAt(0)}
                </span>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg bg-retro-purple text-white">
              <BarChart3 className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-4 border-t border-retro-gray">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-retro-purple text-white'
                      : 'text-retro-gray hover:text-white hover:bg-retro-darker'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-retro">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
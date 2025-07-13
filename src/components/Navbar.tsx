import { Link, useLocation } from 'react-router-dom'
import { Users, Trophy, User, Search, Bell } from 'lucide-react'
import { User as UserType } from '../types'

interface NavbarProps {
  currentUser: UserType
}

const Navbar = ({ currentUser }: NavbarProps) => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Freunde', icon: Users },
    { path: '/challenges', label: 'Challenges', icon: Trophy },
    { path: '/profile', label: 'Profil', icon: User },
  ]

  return (
    <nav className="bg-retro-gray border-b border-gray-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-n64-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-gaming text-xs">64</span>
            </div>
            <span className="text-white font-gaming text-lg">Battle64</span>
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
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-n64-purple text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors">
              <Search size={20} />
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-n64-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-white font-medium">{currentUser.username}</p>
                <p className="text-gray-400 text-sm">Level {currentUser.level}</p>
              </div>
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-10 h-10 rounded-full border-2 border-n64-purple"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/40x40/6B46C1/FFFFFF?text=64'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
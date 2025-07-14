import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Camera, Home, Trophy, User } from 'lucide-react'

const Navigation: React.FC = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/scanner', icon: Camera, label: 'Scanner' },
    { path: '/collection', icon: Trophy, label: 'Sammlung' },
    { path: '/profile', icon: User, label: 'Profil' }
  ]

  return (
    <nav className="bg-retro-gray border-b-2 border-retro-purple">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-retro-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-pixel text-xs">64</span>
            </div>
            <span className="text-white font-pixel text-lg">N64-Nexus</span>
          </Link>
          
          <div className="flex space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-retro-purple text-white border-2 border-retro-yellow'
                      : 'text-retro-light hover:bg-retro-dark hover:text-white'
                  }`}
                >
                  <Icon size={20} />
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
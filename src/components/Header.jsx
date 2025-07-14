import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Trophy, User, Home, Search } from 'lucide-react'

function Header() {
  const location = useLocation()

  const playCameraSound = () => {
    // Simulate camera click sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
    audio.play().catch(() => {}) // Ignore errors if audio fails
  }

  return (
    <header className="bg-gradient-to-r from-retro-darker to-retro-dark border-b-2 border-pixel-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
            onClick={playCameraSound}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-retro-purple to-retro-blue rounded-lg flex items-center justify-center border-2 border-pixel-border group-hover:animate-glow transition-all duration-300">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-retro text-white text-shadow">
                Battle64
              </h1>
              <p className="text-xs text-retro-gray font-pixel">
                Highlight Archiv
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                location.pathname === '/'
                  ? 'bg-retro-purple text-white shadow-lg'
                  : 'text-retro-gray hover:text-white hover:bg-retro-dark'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="font-pixel">Archiv</span>
            </Link>
            
            <Link
              to="/profile"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                location.pathname === '/profile'
                  ? 'bg-retro-purple text-white shadow-lg'
                  : 'text-retro-gray hover:text-white hover:bg-retro-dark'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="font-pixel">Profil</span>
            </Link>
          </nav>

          {/* Search Icon */}
          <button className="p-2 text-retro-gray hover:text-white hover:bg-retro-dark rounded-lg transition-all duration-300">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Star, Users, Home } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-n64-purple/90 to-n64-blue/90 backdrop-blur-sm border-b border-n64-purple/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-n64-yellow to-n64-red rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <span className="text-white font-retro text-lg">64</span>
            </div>
            <div>
              <h1 className="text-2xl font-retro text-white text-shadow">
                N64-Nexus
              </h1>
              <p className="text-xs text-n64-light/80 font-n64">
                Battle64 Gallery
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-white hover:text-n64-yellow transition-colors duration-200"
            >
              <Home size={20} />
              <span className="font-n64">Home</span>
            </Link>
            <Link 
              to="/gallery" 
              className="flex items-center space-x-2 text-white hover:text-n64-yellow transition-colors duration-200"
            >
              <Star size={20} />
              <span className="font-n64">Gallery</span>
            </Link>
            <Link 
              to="/leaderboard" 
              className="flex items-center space-x-2 text-white hover:text-n64-yellow transition-colors duration-200"
            >
              <Trophy size={20} />
              <span className="font-n64">Top 10</span>
            </Link>
            <Link 
              to="/community" 
              className="flex items-center space-x-2 text-white hover:text-n64-yellow transition-colors duration-200"
            >
              <Users size={20} />
              <span className="font-n64">Community</span>
            </Link>
          </nav>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-white">
              <div className="w-8 h-8 bg-gradient-to-br from-n64-green to-n64-blue rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">C</span>
              </div>
              <div className="text-sm">
                <div className="font-n64">Collector64</div>
                <div className="text-xs text-n64-light/80 collector-title legendary">
                  🏆 Legendary Collector
                </div>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden text-white hover:text-n64-yellow transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
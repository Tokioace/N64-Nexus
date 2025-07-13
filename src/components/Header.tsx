import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNews } from '../context/NewsContext';

const Header: React.FC = () => {
  const { state } = useNews();
  const location = useLocation();

  return (
    <header className="bg-n64-dark/80 backdrop-blur-sm border-b-2 border-n64-blue/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-n64-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-pixel text-xs">64</span>
              </div>
              <h1 className="text-2xl font-pixel text-n64-blue glow-text">
                Battle64 News
              </h1>
            </Link>
          </div>

          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className={`font-n64 transition-colors ${
                location.pathname === '/'
                  ? 'text-n64-blue glow-text'
                  : 'text-white hover:text-n64-blue'
              }`}
            >
              📰 News Feed
            </Link>
            
            {(state.currentUser.role === 'admin' || state.currentUser.role === 'editor') && (
              <Link
                to="/admin"
                className={`font-n64 transition-colors ${
                  location.pathname === '/admin'
                    ? 'text-n64-blue glow-text'
                    : 'text-white hover:text-n64-blue'
                }`}
              >
                ⚙️ Admin Panel
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-n64 text-n64-blue">
                {state.currentUser.username}
              </div>
              <div className="text-xs text-n64-gray">
                {state.currentUser.role.toUpperCase()}
              </div>
            </div>
            <div className="w-8 h-8 bg-n64-blue/20 rounded-full border-2 border-n64-blue/50 flex items-center justify-center">
              <span className="text-n64-blue font-pixel text-xs">
                {state.currentUser.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
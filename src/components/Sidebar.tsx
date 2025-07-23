import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useUser } from '../contexts/UserContext'
import LanguageSelector from './LanguageSelector'
import { LogIn, LogOut, User } from 'lucide-react'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const location = useLocation()
  const { t } = useLanguage()
  const { user, isAuthenticated, logout } = useUser()

  const handleLinkClick = () => {
    // Close mobile sidebar when a link is clicked
    if (onClose) {
      onClose()
    }
  }

  const handleLogout = () => {
    logout()
    handleLinkClick()
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="flex flex-col h-full responsive-max-width" style={{ touchAction: 'pan-y' }}>
        {/* Header with Logo and Language Selector */}
        <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-slate-700 responsive-max-width">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-400 truncate">Battle64</h1>
          <div className="flex-shrink-0 ml-2">
            <LanguageSelector />
          </div>
        </div>
        
        {/* User Info Section */}
        {isAuthenticated && user && (
          <div className="p-3 sm:p-4 border-b border-slate-700 responsive-max-width">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-sm sm:text-lg flex-shrink-0">
                {user.avatar || '🎮'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-100 truncate text-sm sm:text-base">
                  {user.username}
                </div>
                <div className="text-xs sm:text-sm text-slate-400 truncate">
                  Level {user.level} • {user.xp} XP
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto scrollable-container responsive-max-width">
          <nav className="p-3 sm:p-4 lg:p-6">
            <ul className="space-y-1">
              <li className={location.pathname === '/' ? 'active' : ''}>
                <Link to="/" onClick={handleLinkClick} className="nav-link">
                  <span className="mr-2 sm:mr-3">🏠</span>
                  <span className="truncate">{t('nav.home')}</span>
                </Link>
              </li>
              <li className={location.pathname === '/classic' ? 'active' : ''}>
                <Link to="/classic" onClick={handleLinkClick} className="nav-link">
                  <span className="mr-2 sm:mr-3">🎮</span>
                  <span className="truncate">{t('nav.classic')}</span>
                </Link>
              </li>
              <li className={location.pathname === '/events' ? 'active' : ''}>
                <Link to="/events" onClick={handleLinkClick} className="nav-link">
                  <span className="mr-2 sm:mr-3">🏆</span>
                  <span className="truncate">{t('nav.events')}</span>
                </Link>
              </li>
              <li className={location.pathname === '/speedrun-media' ? 'active' : ''}>
                <Link to="/speedrun-media" onClick={handleLinkClick} className="nav-link">
                  <span className="mr-2 sm:mr-3">📹</span>
                  <span className="truncate">{t('nav.speedrun')}</span>
                </Link>
              </li>
              <li className={location.pathname === '/collector' ? 'active' : ''}>
                <Link to="/collector" onClick={handleLinkClick} className="nav-link">
                  <span className="mr-2 sm:mr-3">📦</span>
                  <span className="truncate">{t('nav.collector')}</span>
                </Link>
              </li>
              <li className={location.pathname === '/leaderboard' ? 'active' : ''}>
                <Link to="/leaderboard" onClick={handleLinkClick} className="nav-link">
                  <span className="mr-2 sm:mr-3">📊</span>
                  <span className="truncate">{t('nav.leaderboard')}</span>
                </Link>
              </li>
              <li className={location.pathname === '/minigames' ? 'active' : ''}>
                <Link to="/minigames" onClick={handleLinkClick} className="nav-link">
                  <span className="mr-2 sm:mr-3">🎯</span>
                  <span className="truncate">{t('nav.minigames')}</span>
                </Link>
              </li>
              <li className={location.pathname === '/marktplatz' ? 'active' : ''}>
                <Link to="/marktplatz" onClick={handleLinkClick} className="nav-link">
                  <span className="mr-2 sm:mr-3">🛒</span>
                  <span className="truncate">{t('nav.marketplace')}</span>
                </Link>
              </li>
              <li className={location.pathname === '/community' ? 'active' : ''}>
                <Link to="/community" onClick={handleLinkClick} className="nav-link">
                  <span className="mr-2 sm:mr-3">👥</span>
                  <span className="truncate">{t('nav.community')}</span>
                </Link>
              </li>
              <li className={location.pathname === '/quiz' ? 'active' : ''}>
                <Link to="/quiz" onClick={handleLinkClick} className="nav-link">
                  <span className="mr-2 sm:mr-3">❓</span>
                  <span className="truncate">{t('nav.quiz')}</span>
                </Link>
              </li>
              <li className={location.pathname.startsWith('/forum') ? 'active' : ''}>
                <Link to="/forum" onClick={handleLinkClick} className="nav-link">
                  <span className="mr-2 sm:mr-3">💬</span>
                  <span className="truncate">{t('nav.forum')}</span>
                </Link>
              </li>
              <li className={location.pathname === '/chat' ? 'active' : ''}>
                <Link to="/chat" onClick={handleLinkClick} className="nav-link">
                  <span className="mr-2 sm:mr-3">💭</span>
                  <span className="truncate">{t('nav.chat')}</span>
                </Link>
              </li>
              <li className={location.pathname === '/fanart' ? 'active' : ''}>
                <Link to="/fanart" onClick={handleLinkClick} className="nav-link">
                  <span className="mr-2 sm:mr-3">🎨</span>
                  <span className="truncate">{t('nav.fanart')}</span>
                </Link>
              </li>
              <li className={location.pathname === '/newsfeed' ? 'active' : ''}>
                <Link to="/newsfeed" onClick={handleLinkClick} className="nav-link">
                  <span className="mr-2 sm:mr-3">📰</span>
                  <span className="truncate">{t('nav.news')}</span>
                </Link>
              </li>
              
              {/* Authentication-dependent menu items */}
              {isAuthenticated ? (
                <li className={location.pathname === '/profile' ? 'active' : ''}>
                  <Link to="/profile" onClick={handleLinkClick} className="nav-link">
                    <span className="mr-2 sm:mr-3">👤</span>
                    <span className="truncate">{t('nav.profile')}</span>
                  </Link>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>

        {/* Authentication Section */}
        <div className="p-3 sm:p-4 border-t border-slate-700 responsive-max-width">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 text-slate-300 hover:text-slate-100 hover:bg-slate-700 rounded-lg transition-colors min-h-[44px] text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">{t('auth.logout')}</span>
            </button>
          ) : (
            <Link
              to="/auth"
              onClick={handleLinkClick}
              className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 text-slate-300 hover:text-slate-100 hover:bg-slate-700 rounded-lg transition-colors min-h-[44px] text-sm sm:text-base"
            >
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">{t('auth.login')}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
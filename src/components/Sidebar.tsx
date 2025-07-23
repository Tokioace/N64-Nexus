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
      <div className="flex flex-col h-full">
        {/* Header with Logo and Language Selector */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-blue-400">Battle64</h1>
          <LanguageSelector />
        </div>
        
        {/* User Info Section */}
        {isAuthenticated && user && (
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-lg">
                {user.avatar || '🎮'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-100 truncate">
                  {user.username}
                </div>
                <div className="text-sm text-slate-400">
                  Level {user.level} • {user.xp} XP
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-6">
            <ul>
              <li className={location.pathname === '/' ? 'active' : ''}><Link to="/" onClick={handleLinkClick}>🏠 {t('nav.home')}</Link></li>
              <li className={location.pathname === '/classic' ? 'active' : ''}><Link to="/classic" onClick={handleLinkClick}>🎮 {t('nav.classic')}</Link></li>
              <li className={location.pathname === '/events' ? 'active' : ''}><Link to="/events" onClick={handleLinkClick}>🏆 {t('nav.events')}</Link></li>
              <li className={location.pathname === '/speedrun-media' ? 'active' : ''}><Link to="/speedrun-media" onClick={handleLinkClick}>📹 {t('nav.speedrun')}</Link></li>
              <li className={location.pathname === '/collector' ? 'active' : ''}><Link to="/collector" onClick={handleLinkClick}>📦 {t('nav.collector')}</Link></li>
              <li className={location.pathname === '/leaderboard' ? 'active' : ''}><Link to="/leaderboard" onClick={handleLinkClick}>📊 {t('nav.leaderboard')}</Link></li>
              <li className={location.pathname === '/minigames' ? 'active' : ''}><Link to="/minigames" onClick={handleLinkClick}>🎯 {t('nav.minigames')}</Link></li>
              <li className={location.pathname === '/marktplatz' ? 'active' : ''}><Link to="/marktplatz" onClick={handleLinkClick}>🛒 {t('nav.marketplace')}</Link></li>
              <li className={location.pathname === '/community' ? 'active' : ''}><Link to="/community" onClick={handleLinkClick}>👥 {t('nav.community')}</Link></li>
              <li className={location.pathname === '/quiz' ? 'active' : ''}><Link to="/quiz" onClick={handleLinkClick}>❓ {t('nav.quiz')}</Link></li>
              <li className={location.pathname.startsWith('/forum') ? 'active' : ''}><Link to="/forum" onClick={handleLinkClick}>💬 {t('nav.forum')}</Link></li>
              <li className={location.pathname === '/chat' ? 'active' : ''}><Link to="/chat" onClick={handleLinkClick}>💭 {t('nav.chat')}</Link></li>
              <li className={location.pathname === '/fanart' ? 'active' : ''}><Link to="/fanart" onClick={handleLinkClick}>🎨 {t('nav.fanart')}</Link></li>
              <li className={location.pathname === '/newsfeed' ? 'active' : ''}><Link to="/newsfeed" onClick={handleLinkClick}>📰 {t('nav.news')}</Link></li>
              
              {/* Authentication-dependent menu items */}
              {isAuthenticated ? (
                <li className={location.pathname === '/profile' ? 'active' : ''}><Link to="/profile" onClick={handleLinkClick}>👤 {t('nav.profile')}</Link></li>
              ) : null}
            </ul>
          </nav>
        </div>

        {/* Authentication Section */}
        <div className="p-4 border-t border-slate-700">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-slate-100 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>{t('auth.logout')}</span>
            </button>
          ) : (
            <Link
              to="/auth"
              onClick={handleLinkClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-slate-100 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <LogIn className="w-5 h-5" />
              <span>{t('auth.login')}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
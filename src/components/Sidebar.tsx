import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSelector from './LanguageSelector'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const location = useLocation()
  const { t } = useLanguage()

  const handleLinkClick = () => {
    // Close mobile sidebar when a link is clicked
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="flex flex-col h-full">
        {/* Header with Logo and Language Selector */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-blue-400">Battle64</h1>
          <LanguageSelector />
        </div>
        
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
              <li className={location.pathname === '/freunde' ? 'active' : ''}><Link to="/freunde" onClick={handleLinkClick}>👥 {t('nav.friends')}</Link></li>
              <li className={location.pathname === '/quiz' ? 'active' : ''}><Link to="/quiz" onClick={handleLinkClick}>❓ {t('nav.quiz')}</Link></li>
              <li className={location.pathname.startsWith('/forum') ? 'active' : ''}><Link to="/forum" onClick={handleLinkClick}>💬 {t('nav.forum')}</Link></li>
              <li className={location.pathname === '/fanart' ? 'active' : ''}><Link to="/fanart" onClick={handleLinkClick}>🎨 {t('nav.fanart')}</Link></li>
              <li className={location.pathname === '/newsfeed' ? 'active' : ''}><Link to="/newsfeed" onClick={handleLinkClick}>📰 {t('nav.news')}</Link></li>
              <li className={location.pathname === '/profile' ? 'active' : ''}><Link to="/profile" onClick={handleLinkClick}>👤 {t('nav.profile')}</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSelector from './LanguageSelector'

const Sidebar: React.FC = () => {
  const location = useLocation()
  const { t } = useLanguage()

  return (
    <div className="sidebar">
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
              <li className={location.pathname === '/' ? 'active' : ''}><Link to="/">🏠 {t('nav.home')}</Link></li>
              <li className={location.pathname === '/classic' ? 'active' : ''}><Link to="/classic">🎮 {t('nav.classic')}</Link></li>
              <li className={location.pathname === '/events' ? 'active' : ''}><Link to="/events">🏆 {t('nav.events')}</Link></li>
              <li className={location.pathname === '/speedrun-media' ? 'active' : ''}><Link to="/speedrun-media">📹 {t('nav.speedrun')}</Link></li>
              <li className={location.pathname === '/collector' ? 'active' : ''}><Link to="/collector">📦 {t('nav.collector')}</Link></li>
              <li className={location.pathname === '/leaderboard' ? 'active' : ''}><Link to="/leaderboard">📊 {t('nav.leaderboard')}</Link></li>
              <li className={location.pathname === '/minigames' ? 'active' : ''}><Link to="/minigames">🎯 {t('nav.minigames')}</Link></li>
              <li className={location.pathname === '/marktplatz' ? 'active' : ''}><Link to="/marktplatz">🛒 {t('nav.marketplace')}</Link></li>
              <li className={location.pathname === '/freunde' ? 'active' : ''}><Link to="/freunde">👥 {t('nav.friends')}</Link></li>
              <li className={location.pathname === '/quiz' ? 'active' : ''}><Link to="/quiz">❓ {t('nav.quiz')}</Link></li>
              <li className={location.pathname.startsWith('/forum') ? 'active' : ''}><Link to="/forum">💬 {t('nav.forum')}</Link></li>
              <li className={location.pathname === '/fanart' ? 'active' : ''}><Link to="/fanart">🎨 {t('nav.fanart')}</Link></li>
              <li className={location.pathname === '/newsfeed' ? 'active' : ''}><Link to="/newsfeed">📰 {t('nav.news')}</Link></li>
              <li className={location.pathname === '/profile' ? 'active' : ''}><Link to="/profile">👤 {t('nav.profile')}</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
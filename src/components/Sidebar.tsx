import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const Sidebar: React.FC = () => {
  const location = useLocation()
  const { t } = useLanguage()

  return (
    <div className="sidebar">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-400 mb-8">Battle64</h1>
        <nav>
          <ul>
            <li className={location.pathname === '/' ? 'active' : ''}><Link to="/">🏠 {t('nav.home')}</Link></li>
            <li className={location.pathname === '/classic' ? 'active' : ''}><Link to="/classic">🎮 Klassisch</Link></li>
            <li className={location.pathname === '/events' ? 'active' : ''}><Link to="/events">🏆 {t('nav.events')}</Link></li>
            <li className={location.pathname === '/speedrun-media' ? 'active' : ''}><Link to="/speedrun-media">📹 {t('nav.speedrun')}</Link></li>
            <li className={location.pathname === '/collector' ? 'active' : ''}><Link to="/collector">📦 {t('nav.collector')}</Link></li>
            <li className={location.pathname === '/leaderboard' ? 'active' : ''}><Link to="/leaderboard">📊 {t('nav.leaderboard')}</Link></li>
            <li className={location.pathname === '/minigames' ? 'active' : ''}><Link to="/minigames">🎯 {t('nav.minigames')}</Link></li>
            <li className={location.pathname === '/marktplatz' ? 'active' : ''}><Link to="/marktplatz">🛒 Marktplatz</Link></li>
            <li className={location.pathname === '/freunde' ? 'active' : ''}><Link to="/freunde">👥 Freunde</Link></li>
            <li className={location.pathname === '/quiz' ? 'active' : ''}><Link to="/quiz">❓ {t('nav.quiz')}</Link></li>
            <li className={location.pathname.startsWith('/forum') ? 'active' : ''}><Link to="/forum">💬 {t('nav.forum')}</Link></li>
            <li className={location.pathname === '/fanart' ? 'active' : ''}><Link to="/fanart">🎨 Fanart</Link></li>
            <li className={location.pathname === '/newsfeed' ? 'active' : ''}><Link to="/newsfeed">📰 News</Link></li>
            <li className={location.pathname === '/profile' ? 'active' : ''}><Link to="/profile">👤 {t('nav.profile')}</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
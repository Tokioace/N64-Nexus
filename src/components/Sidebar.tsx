import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar: React.FC = () => {
  const location = useLocation()

  return (
    <div className="sidebar">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-400 mb-8">Battle64</h1>
        <nav>
          <ul>
            <li className={location.pathname === '/' ? 'active' : ''}><Link to="/">🏠 Home</Link></li>
            <li className={location.pathname === '/classic' ? 'active' : ''}><Link to="/classic">🎮 Klassisch</Link></li>
            <li className={location.pathname === '/events' ? 'active' : ''}><Link to="/events">🏆 Events</Link></li>
            <li className={location.pathname === '/speedrun-media' ? 'active' : ''}><Link to="/speedrun-media">📹 Media</Link></li>
            <li className={location.pathname === '/collector' ? 'active' : ''}><Link to="/collector">📦 Sammler</Link></li>
            <li className={location.pathname === '/leaderboard' ? 'active' : ''}><Link to="/leaderboard">📊 Bestenliste</Link></li>
            <li className={location.pathname === '/minigames' ? 'active' : ''}><Link to="/minigames">🎯 Minispiele</Link></li>
            <li className={location.pathname === '/marktplatz' ? 'active' : ''}><Link to="/marktplatz">🛒 Marktplatz</Link></li>
            <li className={location.pathname === '/freunde' ? 'active' : ''}><Link to="/freunde">👥 Freunde</Link></li>
            <li className={location.pathname === '/quiz' ? 'active' : ''}><Link to="/quiz">❓ Quiz</Link></li>
            <li className={location.pathname.startsWith('/forum') ? 'active' : ''}><Link to="/forum">💬 Forum</Link></li>
            <li className={location.pathname === '/fanart' ? 'active' : ''}><Link to="/fanart">🎨 Fanart</Link></li>
            <li className={location.pathname === '/newsfeed' ? 'active' : ''}><Link to="/newsfeed">📰 News</Link></li>
            <li className={location.pathname === '/profile' ? 'active' : ''}><Link to="/profile">👤 Profil</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
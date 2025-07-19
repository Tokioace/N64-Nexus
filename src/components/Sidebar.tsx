import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button className="hamburger" onClick={toggleSidebar}>
        ☰
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h2>🏁 N64 Speedrun Mekka</h2>
        <nav>
          <ul>
            <li className={location.pathname === '/' ? 'active' : ''}><Link to="/">🏠 Speedrun Hub</Link></li>
            <li className={location.pathname === '/tracks' ? 'active' : ''}><Link to="/tracks">🏁 Strecken Browser</Link></li>
            <li className={location.pathname === '/events' ? 'active' : ''}><Link to="/events">🏆 Weekly Events</Link></li>
            <li className={location.pathname === '/leaderboard' ? 'active' : ''}><Link to="/leaderboard">📊 Global Leaderboard</Link></li>
            <li className={location.pathname === '/profile' ? 'active' : ''}><Link to="/profile">👤 Profil</Link></li>
            <li className={location.pathname === '/speedrun-media' ? 'active' : ''}><Link to="/speedrun-media">📹 Speedrun Videos</Link></li>
            <li className={location.pathname.startsWith('/forum') ? 'active' : ''}><Link to="/forum">💬 Community Forum</Link></li>
            <li className={location.pathname === '/collector' ? 'active' : ''}><Link to="/collector">💎 Sammler Modus</Link></li>
            <li className={location.pathname === '/quiz' ? 'active' : ''}><Link to="/quiz">🧠 N64 Quiz</Link></li>
            <li className={location.pathname === '/classic' ? 'active' : ''}><Link to="/classic">🎮 Retro Home</Link></li>
          </ul>
        </nav>
        
        {/* Quick Stats Section */}
        <div className="sidebar-stats">
          <h3>🌟 Live Stats</h3>
          <div className="stat-item">
            <span className="stat-label">Aktive Events:</span>
            <span className="stat-value">3</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Online Speedrunner:</span>
            <span className="stat-value">1,247</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Diese Woche:</span>
            <span className="stat-value">Mario Kart 64</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
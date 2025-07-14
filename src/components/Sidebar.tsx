import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="sidebar">
      <h2>🎮 Battle64</h2>
      <nav>
        <ul>
          <li><Link to="/" className={isActive('/') ? 'active' : ''}>🏠 Home</Link></li>
          <li><Link to="/profil" className={isActive('/profil') ? 'active' : ''}>👤 Profil</Link></li>
          <li><Link to="/events" className={isActive('/events') ? 'active' : ''}>🏁 Events</Link></li>
          <li><Link to="/scanner" className={isActive('/scanner') ? 'active' : ''}>📷 Scanner</Link></li>
          <li><Link to="/marktplatz" className={isActive('/marktplatz') ? 'active' : ''}>🛒 Marktplatz</Link></li>
          <li><Link to="/freunde" className={isActive('/freunde') ? 'active' : ''}>👥 Freunde</Link></li>
          <li><Link to="/quiz" className={isActive('/quiz') ? 'active' : ''}>❓ Quiz</Link></li>
          <li><Link to="/fanart" className={isActive('/fanart') ? 'active' : ''}>🎨 Fanart</Link></li>
          <li><Link to="/newsfeed" className={isActive('/newsfeed') ? 'active' : ''}>📰 News</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
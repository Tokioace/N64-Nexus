import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <h2>🎮 Battle64</h2>
      <nav>
        <ul>
          <li><Link to="/">🏠 Home</Link></li>
          <li><Link to="/profil">👤 Profil</Link></li>
          <li><Link to="/events">🏁 Events</Link></li>
          <li><Link to="/scanner">📷 Scanner</Link></li>
          <li><Link to="/marktplatz">🛒 Marktplatz</Link></li>
          <li><Link to="/freunde">👥 Freunde</Link></li>
          <li><Link to="/quiz">❓ Quiz</Link></li>
          <li><Link to="/fanart">🎨 Fanart</Link></li>
          <li><Link to="/newsfeed">📰 News</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
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
        <h2>🎮 Battle64</h2>
        <nav>
          <ul>
            <li className={location.pathname === '/' ? 'active' : ''}><Link to="/">🏠 Home</Link></li>
            <li className={location.pathname === '/profil' ? 'active' : ''}><Link to="/profil">👤 Profil</Link></li>
            <li className={location.pathname === '/events' ? 'active' : ''}><Link to="/events">🏁 Events</Link></li>
            <li className={location.pathname === '/scanner' ? 'active' : ''}><Link to="/scanner">📷 Scanner</Link></li>
            <li className={location.pathname === '/marktplatz' ? 'active' : ''}><Link to="/marktplatz">🛒 Marktplatz</Link></li>
            <li className={location.pathname === '/freunde' ? 'active' : ''}><Link to="/freunde">👥 Freunde</Link></li>
            <li className={location.pathname === '/quiz' ? 'active' : ''}><Link to="/quiz">❓ Quiz</Link></li>
            <li className={location.pathname === '/fanart' ? 'active' : ''}><Link to="/fanart">🎨 Fanart</Link></li>
            <li className={location.pathname === '/newsfeed' ? 'active' : ''}><Link to="/newsfeed">📰 News</Link></li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
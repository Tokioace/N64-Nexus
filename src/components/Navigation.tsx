import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/friends', label: 'Friends', icon: '👥' },
    { path: '/groups', label: 'Groups', icon: '🏆' },
    { path: '/messages', label: 'Messages', icon: '💬' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h1 className="nav-title">Battle64</h1>
        <div className="user-info">
          <span className="username">{user?.username}</span>
          <span className="level">Lv.{user?.level}</span>
        </div>
      </div>
      
      <ul className="nav-menu">
        {navItems.map((item) => (
          <li key={item.path} className="nav-item">
            <Link
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.path === '/messages' && unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>

      <div className="nav-footer">
        <button onClick={logout} className="logout-btn">
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
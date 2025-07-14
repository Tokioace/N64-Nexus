import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, User, Clock, Calendar, Trophy, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import DarkModeToggle from './DarkModeToggle'
import './Sidebar.css'

const Sidebar: React.FC = () => {
  const { isDarkMode } = useTheme()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/profile', icon: User, label: 'Profil' },
    { path: '/speedruns', icon: Clock, label: 'Speedruns' },
    { path: '/events', icon: Calendar, label: 'Events' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">SpeedRun</h1>
        <DarkModeToggle />
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
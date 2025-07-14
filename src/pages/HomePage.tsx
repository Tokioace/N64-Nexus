import React from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Clock, Calendar, TrendingUp } from 'lucide-react'
import './HomePage.css'

const HomePage: React.FC = () => {
  const stats = [
    { icon: Trophy, label: 'Bestenzeit', value: '1:23:45' },
    { icon: Clock, label: 'Gesamtzeit', value: '45:32:10' },
    { icon: Calendar, label: 'Events', value: '12' },
    { icon: TrendingUp, label: 'Level', value: '42' },
  ]

  return (
    <div className="home-page">
      <header className="hero">
        <h1>Willkommen bei SpeedRun</h1>
        <p>Deine Plattform für Speedrunning und Gaming Events</p>
      </header>

      <section className="stats-grid">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="stat-card">
            <Icon size={32} />
            <div className="stat-content">
              <h3>{value}</h3>
              <p>{label}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="quick-actions">
        <h2>Schnellzugriff</h2>
        <div className="action-buttons">
          <Link to="/speedruns" className="action-button">
            <Clock size={24} />
            <span>Speedruns starten</span>
          </Link>
          <Link to="/events" className="action-button">
            <Calendar size={24} />
            <span>Events anzeigen</span>
          </Link>
          <Link to="/leaderboard" className="action-button">
            <Trophy size={24} />
            <span>Leaderboard</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
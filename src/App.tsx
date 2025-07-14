import React, { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Rulebook from './components/Rulebook'
import FAQ from './components/FAQ'
import './App.css'

function App() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(() => {
    return location.pathname === '/faq' ? 'faq' : 'rulebook'
  })

  return (
    <div className="App">
      <div className="retro-container">
        <header className="retro-header">
          <h1>🎮 BATTLE64</h1>
          <p>Regelwerk & FAQ-Bereich</p>
        </header>

        <nav className="navigation-tabs">
          <Link 
            to="/" 
            className={`nav-tab ${activeTab === 'rulebook' ? 'active' : ''}`}
            onClick={() => setActiveTab('rulebook')}
          >
            📚 Regelwerk
          </Link>
          <Link 
            to="/faq" 
            className={`nav-tab ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            ❓ FAQ
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Rulebook />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>

        <div className="update-info">
          <p>📅 Letztes Update: {new Date().toLocaleDateString('de-DE')}</p>
          <p>🔄 Version: 1.0.0 | Battle64 Community</p>
        </div>
      </div>
    </div>
  )
}

export default App
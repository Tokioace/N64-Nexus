import React, { useState } from 'react';
import { Cartbit } from './components/Cartbit/Cartbit';
import './App.css';

function App() {
  const [isCartbitMinimized, setIsCartbitMinimized] = useState(false);

  return (
    <div className="App">
      {/* Battle64 Header */}
      <header className="battle64-header">
        <div className="header-content">
          <h1 className="logo">🎮 Battle64</h1>
          <nav className="nav-menu">
            <button className="nav-btn">Events</button>
            <button className="nav-btn">Leaderboard</button>
            <button className="nav-btn">Regeln</button>
            <button className="nav-btn">Profil</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="welcome-section">
          <h2>Willkommen bei Battle64! 🚀</h2>
          <p>Die ultimative Retro-Gaming-Community für N64-Speedruns und Events</p>
          
          <div className="feature-grid">
            <div className="feature-card">
              <h3>🎯 Events</h3>
              <p>Starte dein eigenes Event oder nimm an bestehenden teil</p>
            </div>
            <div className="feature-card">
              <h3>🏃‍♂️ Glitchruns</h3>
              <p>Nutze Glitches für die schnellsten Zeiten</p>
            </div>
            <div className="feature-card">
              <h3>🏆 Leaderboard</h3>
              <p>Vergleiche dich mit anderen Spielern</p>
            </div>
            <div className="feature-card">
              <h3>👥 Community</h3>
              <p>Verbinde dich mit anderen Retro-Gamern</p>
            </div>
          </div>
        </div>

        {/* Demo Buttons */}
        <div className="demo-section">
          <h3>Demo: Teste Cartbit's Hilfe</h3>
          <div className="demo-buttons">
            <button 
              className="demo-btn"
              onClick={() => {
                // This would trigger Cartbit's help in a real app
                console.log('Demo: Event starten clicked');
              }}
            >
              🎮 Event starten
            </button>
            <button 
              className="demo-btn"
              onClick={() => {
                console.log('Demo: Glitchrun clicked');
              }}
            >
              🏃‍♂️ Glitchrun
            </button>
            <button 
              className="demo-btn"
              onClick={() => {
                console.log('Demo: Regeln clicked');
              }}
            >
              📖 Regeln
            </button>
          </div>
        </div>
      </main>

      {/* Cartbit HelpBot */}
      <Cartbit 
        isMinimized={isCartbitMinimized}
        onToggleMinimize={() => setIsCartbitMinimized(!isCartbitMinimized)}
      />

      {/* Footer */}
      <footer className="battle64-footer">
        <p>&copy; 2024 Battle64 - Retro Gaming Community</p>
      </footer>
    </div>
  );
}

export default App;
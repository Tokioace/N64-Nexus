import React, { useState } from 'react'
import EventCard from './EventCard'
import LiveTicker from './LiveTicker'
import './Demo.css'

const Demo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'ticker' | 'combined'>('combined')

  const sampleEvents = [
    {
      id: 'rainbow-raceway-001',
      name: 'Rainbow Raceway Time Trial',
      startDate: new Date('2024-07-19T10:00:00'),
      endDate: new Date('2024-07-21T10:00:00'),
      platform: 'NTSC',
      emulator: 'Emulator',
      glitchFree: true,
      game: 'Mario Kart 64',
      reward: { xp: 300, medal: 'Goldmedaille' },
      participants: 146,
      screenshots: 121,
      status: 'active' as const
    },
    {
      id: 'dk-mountain-002',
      name: 'DK Mountain Speedrun',
      startDate: new Date('2024-07-22T14:00:00'),
      endDate: new Date('2024-07-24T14:00:00'),
      platform: 'PAL',
      emulator: 'Original',
      glitchFree: false,
      game: 'Mario Kart 64',
      reward: { xp: 500, medal: 'Platinmedaille' },
      participants: 89,
      screenshots: 67,
      status: 'upcoming' as const
    },
    {
      id: 'yoshi-valley-003',
      name: 'Yoshi Valley Glitchless',
      startDate: new Date('2024-07-15T09:00:00'),
      endDate: new Date('2024-07-17T09:00:00'),
      platform: 'NTSC',
      emulator: 'Emulator',
      glitchFree: true,
      game: 'Mario Kart 64',
      reward: { xp: 200, medal: 'Silbermedaille' },
      participants: 234,
      screenshots: 189,
      status: 'completed' as const
    }
  ]

  const sampleTickerItems = [
    { id: 1, time: '14:12', user: 'RetroKing93', action: 'hat eine neue Zeit eingereicht: 2:11.45', type: 'submission' as const },
    { id: 2, time: '14:15', user: 'PixelHero', action: 'Neuer Screenshot verfügbar', type: 'screenshot' as const },
    { id: 3, time: '14:17', user: 'System', action: 'Platz 1 von NTSC/Original wurde aktualisiert', type: 'update' as const },
    { id: 4, time: '14:20', user: 'SpeedDemon', action: 'läuft live! 🔥', type: 'livestream' as const },
    { id: 5, time: '14:22', user: 'Admin', action: 'Finalrunde beginnt jetzt!', type: 'admin' as const },
    { id: 6, time: '14:25', user: 'TimeLord', action: 'hat eine neue Zeit eingereicht: 2:10.89', type: 'submission' as const },
    { id: 7, time: '14:28', user: 'RetroQueen', action: 'Neuer Screenshot verfügbar', type: 'screenshot' as const },
    { id: 8, time: '14:30', user: 'System', action: 'Neuer Rekord: 2:09.45 von SpeedDemon', type: 'record' as const },
    { id: 9, time: '14:33', user: 'GlitchMaster', action: 'hat eine neue Zeit eingereicht: 2:08.12', type: 'submission' as const },
    { id: 10, time: '14:35', user: 'Admin', action: 'Event-Regeln wurden aktualisiert', type: 'admin' as const },
    { id: 11, time: '14:38', user: 'RetroRacer', action: 'läuft live! 🔥', type: 'livestream' as const },
    { id: 12, time: '14:40', user: 'System', action: 'Neuer Teilnehmer: MarioFan64', type: 'update' as const }
  ]

  return (
    <div className="demo-container">
      <header className="demo-header">
        <h1 className="demo-title">🏁 Battle64 Nexus Demo</h1>
        <p className="demo-subtitle">Retro Gaming Events & Live Competition System</p>
        
        <div className="demo-tabs">
          <button 
            className={`demo-tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            📋 Event Cards
          </button>
          <button 
            className={`demo-tab ${activeTab === 'ticker' ? 'active' : ''}`}
            onClick={() => setActiveTab('ticker')}
          >
            📡 Live Ticker
          </button>
          <button 
            className={`demo-tab ${activeTab === 'combined' ? 'active' : ''}`}
            onClick={() => setActiveTab('combined')}
          >
            🎮 Kombiniert
          </button>
        </div>
      </header>

      <main className="demo-main">
        {activeTab === 'events' && (
          <div className="events-demo">
            <h2>🎯 Event Cards Demo</h2>
            <div className="events-grid">
              {sampleEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ticker' && (
          <div className="ticker-demo">
            <h2>📡 Live Ticker Demo</h2>
            <LiveTicker items={sampleTickerItems} />
          </div>
        )}

        {activeTab === 'combined' && (
          <div className="combined-demo">
            <div className="demo-layout">
              <section className="demo-events">
                <h2>🎯 Aktuelle Events</h2>
                <EventCard event={sampleEvents[0]} />
              </section>
              
              <section className="demo-ticker">
                <h2>📡 Live Updates</h2>
                <LiveTicker items={sampleTickerItems} />
              </section>
            </div>
          </div>
        )}
      </main>

      <footer className="demo-footer">
        <div className="demo-features">
          <h3>✨ Features</h3>
          <ul>
            <li>🎮 Retro-Pixelart Design</li>
            <li>⏰ Live Countdown Timer</li>
            <li>📡 Echtzeit-Updates</li>
            <li>🔥 Livestream Integration</li>
            <li>📱 Responsive Design</li>
            <li>🎨 Scanline-Effekte</li>
          </ul>
        </div>
        
        <div className="demo-info">
          <h3>ℹ️ Info</h3>
          <p>Dies ist eine Demo-Version des Battle64 Event Systems.</p>
          <p>Alle Daten sind Beispieldaten für Demonstrationszwecke.</p>
          <p>Entwickelt mit React, TypeScript und Vite.</p>
        </div>
      </footer>
    </div>
  )
}

export default Demo
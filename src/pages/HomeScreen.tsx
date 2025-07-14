import React from 'react';
import './HomeScreen.css';

interface MenuButton {
  id: string;
  emoji: string;
  label: string;
  onClick: () => void;
}

interface NewsItem {
  id: string;
  message: string;
  timestamp: string;
}

const HomeScreen: React.FC = () => {
  const menuButtons: MenuButton[] = [
    {
      id: 'speedrun',
      emoji: '🎮',
      label: 'Speedrun-Events',
      onClick: () => console.log('Speedrun-Events clicked')
    },
    {
      id: 'collection',
      emoji: '📁',
      label: 'Sammlung',
      onClick: () => console.log('Sammlung clicked')
    },
    {
      id: 'profile',
      emoji: '👤',
      label: 'Mein Profil',
      onClick: () => console.log('Mein Profil clicked')
    },
    {
      id: 'marketplace',
      emoji: '🛍️',
      label: 'Marktplatz',
      onClick: () => console.log('Marktplatz clicked')
    },
    {
      id: 'newsfeed',
      emoji: '📰',
      label: 'Newsfeed',
      onClick: () => console.log('Newsfeed clicked')
    }
  ];

  const newsItems: NewsItem[] = [
    {
      id: '1',
      message: '🎉 Neuer Speedrun-Rekord in Super Mario 64!',
      timestamp: 'vor 2 Minuten'
    },
    {
      id: '2',
      message: '🏆 Community-Turnier startet nächste Woche',
      timestamp: 'vor 5 Minuten'
    },
    {
      id: '3',
      message: '🆕 Neue Retro-Spiele im Marktplatz verfügbar',
      timestamp: 'vor 8 Minuten'
    }
  ];

  return (
    <div className="home-screen">
      <div className="header">
        <h1 className="main-title">Battle64</h1>
        <h2 className="subtitle">Willkommen, Held der Retro-Rennen!</h2>
      </div>

      <div className="menu-container">
        <div className="menu-grid">
          {menuButtons.map((button) => (
            <button
              key={button.id}
              className="menu-button"
              onClick={button.onClick}
            >
              <span className="button-emoji">{button.emoji}</span>
              <span className="button-label">{button.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="news-ticker">
        <h3 className="ticker-title">📡 Live-Ticker</h3>
        <div className="ticker-content">
          {newsItems.map((item) => (
            <div key={item.id} className="news-item">
              <span className="news-message">{item.message}</span>
              <span className="news-timestamp">{item.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
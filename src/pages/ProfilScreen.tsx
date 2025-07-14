import React, { useState, useEffect } from 'react';
import { Player, Achievement, CollectionLocation } from '../types/Player';
import './ProfilScreen.css';

// Mock-Daten für die Demo
const mockPlayer: Player = {
  id: '1',
  name: 'SpeedRunner64',
  avatar: '/api/avatars/default.png',
  rank: 'Ultimate Champion',
  xp: 8475,
  maxXp: 10000,
  level: 42,
  stats: {
    gamesPlayed: 156,
    speedrunBestTimes: [
      { game: 'Super Mario 64', time: '1:39:28', category: '120 Stars', date: '2024-01-15' },
      { game: 'The Legend of Zelda: OoT', time: '2:14:33', category: 'Any%', date: '2024-02-03' },
      { game: 'GoldenEye 007', time: '0:12:45', category: 'Facility', date: '2024-01-28' }
    ],
    collectionRarity: 87
  },
  achievements: [
    {
      id: '1',
      title: 'Speed Demon',
      description: 'Complete 10 speedruns under world record +10%',
      icon: '🏃‍♂️',
      unlocked: true,
      unlockedDate: '2024-01-20',
      rarity: 'epic'
    },
    {
      id: '2',
      title: 'Collection Master',
      description: 'Collect 100 rare items',
      icon: '💎',
      unlocked: true,
      unlockedDate: '2024-02-01',
      rarity: 'legendary'
    },
    {
      id: '3',
      title: 'N64 Veteran',
      description: 'Play 50 different N64 games',
      icon: '🎮',
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: '4',
      title: 'Perfect Run',
      description: 'Complete a speedrun without any mistakes',
      icon: '⭐',
      unlocked: true,
      unlockedDate: '2024-01-10',
      rarity: 'common'
    }
  ],
  collectionRarity: 87
};

const mockLocations: CollectionLocation[] = [
  {
    id: '1',
    name: 'Retro Gaming Store',
    coordinates: { lat: 52.5200, lng: 13.4050 },
    items: 15,
    rarity: 85
  },
  {
    id: '2',
    name: 'Flea Market',
    coordinates: { lat: 52.5100, lng: 13.4150 },
    items: 8,
    rarity: 72
  }
];

const ProfilScreen: React.FC = () => {
  const [player, setPlayer] = useState<Player>(mockPlayer);
  const [locations, setLocations] = useState<CollectionLocation[]>(mockLocations);
  const [showMap, setShowMap] = useState(false);

  const renderStars = (value: number, max: number = 5) => {
    const stars = [];
    const filledStars = Math.floor((value / 100) * max);
    
    for (let i = 0; i < max; i++) {
      stars.push(
        <span key={i} className={`star ${i < filledStars ? 'filled' : 'empty'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const renderProgressBar = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    return (
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="progress-text">{current} / {max} XP</span>
      </div>
    );
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#ffd700';
      case 'epic': return '#9932cc';
      case 'rare': return '#0066cc';
      case 'common': return '#666666';
      default: return '#666666';
    }
  };

  return (
    <div className="profil-screen">
      <div className="profil-container">
        {/* Header mit Avatar und Spielerinfo */}
        <div className="profil-header">
          <div className="avatar-section">
            <div className="avatar-container">
              <img 
                src={player.avatar} 
                alt={player.name}
                className="player-avatar"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiM0QjU2NjMiLz4KPHN2ZyB4PSIzMiIgeT0iMjQiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAxMmMyLjIxIDAgNC0xLjc5IDQtNHMtMS43OS00LTQtNC00IDEuNzktNCA0IDEuNzkgNCA0IDR6bTAgMmMtMi42NyAwLTggMS4zNC04IDR2MmgxNnYtMmMwLTIuNjYtNS4zMy00LTgtNHoiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                }}
              />
            </div>
          </div>
          
          <div className="player-info">
            <h1 className="player-name">{player.name}</h1>
            <div className="player-rank">{player.rank}</div>
            <div className="player-level">Level {player.level}</div>
            {renderProgressBar(player.xp, player.maxXp)}
          </div>
        </div>

        {/* Statistik-Bereich */}
        <div className="stats-section">
          <h2 className="section-title">Statistiken</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎮</div>
              <div className="stat-content">
                <div className="stat-label">Gespielte Spiele</div>
                <div className="stat-value">{player.stats.gamesPlayed}</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-content">
                <div className="stat-label">Speedrun Bestzeiten</div>
                <div className="stat-value">{player.stats.speedrunBestTimes.length}</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">💎</div>
              <div className="stat-content">
                <div className="stat-label">Sammlung Seltenheit</div>
                <div className="stat-stars">
                  {renderStars(player.collectionRarity)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Speedrun Bestzeiten */}
        <div className="speedrun-section">
          <h2 className="section-title">Speedrun Bestzeiten</h2>
          <div className="speedrun-list">
            {player.stats.speedrunBestTimes.map((time, index) => (
              <div key={index} className="speedrun-item">
                <div className="speedrun-game">{time.game}</div>
                <div className="speedrun-time">{time.time}</div>
                <div className="speedrun-category">{time.category}</div>
                <div className="speedrun-date">{time.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sammlerstandorte */}
        <div className="locations-section">
          <div className="section-header">
            <h2 className="section-title">Sammlerstandorte</h2>
            <button 
              className="map-toggle"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? 'Kartenansicht ausblenden' : 'Kartenansicht anzeigen'}
            </button>
          </div>
          
          {showMap && (
            <div className="map-placeholder">
              <div className="map-content">
                <div className="map-icon">🗺️</div>
                <p>Kartenansicht für Sammlerstandorte</p>
                <p>Hier würde eine interaktive Karte angezeigt werden</p>
              </div>
            </div>
          )}
          
          <div className="locations-list">
            {locations.map(location => (
              <div key={location.id} className="location-item">
                <div className="location-name">{location.name}</div>
                <div className="location-stats">
                  <span>{location.items} Items</span>
                  <span className="location-rarity">
                    Seltenheit: {renderStars(location.rarity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="achievements-section">
          <h2 className="section-title">Achievements</h2>
          <div className="achievements-grid">
            {player.achievements.map(achievement => (
              <div 
                key={achievement.id} 
                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                style={{ borderColor: getRarityColor(achievement.rarity) }}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-content">
                  <h3 className="achievement-title">{achievement.title}</h3>
                  <p className="achievement-description">{achievement.description}</p>
                  {achievement.unlocked && (
                    <div className="achievement-date">
                      Freigeschaltet: {achievement.unlockedDate}
                    </div>
                  )}
                </div>
                <div 
                  className="achievement-rarity"
                  style={{ backgroundColor: getRarityColor(achievement.rarity) }}
                >
                  {achievement.rarity.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilScreen;
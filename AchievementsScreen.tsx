import React, { useState, useEffect } from 'react';
import './AchievementsScreen.css';

// Types
interface Achievement {
  id: string;
  name: string;
  description: string;
  game: string;
  eventType: 'tournament' | 'challenge' | 'daily' | 'special';
  points: number;
  icon: string;
  unlockedAt?: Date;
  progress?: number; // 0-100 for meta achievements
  isMeta?: boolean;
  isUnlocked: boolean;
}

interface SortOption {
  label: string;
  value: 'name' | 'game' | 'eventType' | 'points' | 'date';
}

// Sample data
const sampleAchievements: Achievement[] = [
  {
    id: '1',
    name: 'Erster Sieg',
    description: 'Gewinne dein erstes Turnier',
    game: 'Poker',
    eventType: 'tournament',
    points: 100,
    icon: '🏆',
    unlockedAt: new Date('2024-01-15'),
    isUnlocked: true,
  },
  {
    id: '2',
    name: 'Serienmeister',
    description: 'Gewinne 5 Turniere in Folge',
    game: 'Poker',
    eventType: 'tournament',
    points: 500,
    icon: '👑',
    progress: 60,
    isMeta: true,
    isUnlocked: false,
  },
  {
    id: '3',
    name: 'Täglicher Champion',
    description: 'Spiele 30 Tage in Folge',
    game: 'Blackjack',
    eventType: 'daily',
    points: 200,
    icon: '📅',
    progress: 85,
    isMeta: true,
    isUnlocked: false,
  },
  {
    id: '4',
    name: 'High Roller',
    description: 'Gewinne 10.000 Chips in einem Spiel',
    game: 'Roulette',
    eventType: 'challenge',
    points: 300,
    icon: '💰',
    unlockedAt: new Date('2024-02-20'),
    isUnlocked: true,
  },
  {
    id: '5',
    name: 'Lucky Streak',
    description: 'Gewinne 7 Spiele in Folge',
    game: 'Blackjack',
    eventType: 'challenge',
    points: 250,
    icon: '🍀',
    isUnlocked: false,
  },
];

const AchievementsScreen: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>(sampleAchievements);
  const [sortBy, setSortBy] = useState<SortOption['value']>('name');
  const [filterGame, setFilterGame] = useState<string>('all');
  const [filterEventType, setFilterEventType] = useState<string>('all');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState<boolean>(false);
  const [playSound, setPlaySound] = useState<boolean>(true);

  // Get unique games and event types for filters
  const games = ['all', ...Array.from(new Set(achievements.map(a => a.game)))];
  const eventTypes = ['all', ...Array.from(new Set(achievements.map(a => a.eventType)))];

  // Sort options
  const sortOptions: SortOption[] = [
    { label: 'Name', value: 'name' },
    { label: 'Spiel', value: 'game' },
    { label: 'Event-Typ', value: 'eventType' },
    { label: 'Punkte', value: 'points' },
    { label: 'Datum', value: 'date' },
  ];

  // Filter and sort achievements
  const filteredAndSortedAchievements = achievements
    .filter(achievement => {
      if (showUnlockedOnly && !achievement.isUnlocked) return false;
      if (filterGame !== 'all' && achievement.game !== filterGame) return false;
      if (filterEventType !== 'all' && achievement.eventType !== filterEventType) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'game':
          return a.game.localeCompare(b.game);
        case 'eventType':
          return a.eventType.localeCompare(b.eventType);
        case 'points':
          return b.points - a.points;
        case 'date':
          if (!a.unlockedAt && !b.unlockedAt) return 0;
          if (!a.unlockedAt) return 1;
          if (!b.unlockedAt) return -1;
          return b.unlockedAt.getTime() - a.unlockedAt.getTime();
        default:
          return 0;
      }
    });

  // Play achievement unlock sound
  const playUnlockSound = () => {
    if (playSound) {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  };

  // Handle achievement click
  const handleAchievementClick = (achievement: Achievement) => {
    if (achievement.isUnlocked) {
      playUnlockSound();
    }
  };

  // Get event type icon
  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'tournament': return '🏆';
      case 'challenge': return '🎯';
      case 'daily': return '📅';
      case 'special': return '⭐';
      default: return '🎮';
    }
  };

  // Get event type label
  const getEventTypeLabel = (eventType: string) => {
    switch (eventType) {
      case 'tournament': return 'Turnier';
      case 'challenge': return 'Herausforderung';
      case 'daily': return 'Täglich';
      case 'special': return 'Spezial';
      default: return eventType;
    }
  };

  return (
    <div className="achievements-screen">
      <div className="achievements-header">
        <h1 className="achievements-title">
          <span className="title-icon">🏅</span>
          Errungenschaften
        </h1>
        <div className="achievements-stats">
          <div className="stat">
            <span className="stat-number">
              {achievements.filter(a => a.isUnlocked).length}
            </span>
            <span className="stat-label">Freigeschaltet</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {achievements.reduce((sum, a) => sum + (a.isUnlocked ? a.points : 0), 0)}
            </span>
            <span className="stat-label">Gesamtpunkte</span>
          </div>
        </div>
      </div>

      <div className="achievements-controls">
        <div className="control-group">
          <label htmlFor="sort-select">Sortieren nach:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption['value'])}
            className="control-select"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="game-filter">Spiel:</label>
          <select
            id="game-filter"
            value={filterGame}
            onChange={(e) => setFilterGame(e.target.value)}
            className="control-select"
          >
            {games.map(game => (
              <option key={game} value={game}>
                {game === 'all' ? 'Alle Spiele' : game}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="event-filter">Event-Typ:</label>
          <select
            id="event-filter"
            value={filterEventType}
            onChange={(e) => setFilterEventType(e.target.value)}
            className="control-select"
          >
            {eventTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'Alle Events' : getEventTypeLabel(type)}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showUnlockedOnly}
              onChange={(e) => setShowUnlockedOnly(e.target.checked)}
              className="control-checkbox"
            />
            Nur freigeschaltete
          </label>
        </div>

        <div className="control-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={playSound}
              onChange={(e) => setPlaySound(e.target.checked)}
              className="control-checkbox"
            />
            Sound-Effekte
          </label>
        </div>
      </div>

      <div className="achievements-grid">
        {filteredAndSortedAchievements.map(achievement => (
          <div
            key={achievement.id}
            className={`achievement-card ${achievement.isUnlocked ? 'unlocked' : 'locked'}`}
            onClick={() => handleAchievementClick(achievement)}
          >
            <div className="achievement-icon">
              {achievement.icon}
              {achievement.isUnlocked && (
                <div className="unlock-badge">✓</div>
              )}
            </div>
            
            <div className="achievement-content">
              <h3 className="achievement-name">{achievement.name}</h3>
              <p className="achievement-description">{achievement.description}</p>
              
              <div className="achievement-meta">
                <div className="meta-item">
                  <span className="meta-icon">🎮</span>
                  <span className="meta-text">{achievement.game}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">{getEventTypeIcon(achievement.eventType)}</span>
                  <span className="meta-text">{getEventTypeLabel(achievement.eventType)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">⭐</span>
                  <span className="meta-text">{achievement.points} Punkte</span>
                </div>
              </div>

              {achievement.unlockedAt && (
                <div className="achievement-date">
                  <span className="date-icon">📅</span>
                  <span className="date-text">
                    Freigeschaltet am {achievement.unlockedAt.toLocaleDateString('de-DE')}
                  </span>
                </div>
              )}

              {achievement.isMeta && achievement.progress !== undefined && (
                <div className="achievement-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{achievement.progress}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedAchievements.length === 0 && (
        <div className="no-achievements">
          <div className="no-achievements-icon">🏆</div>
          <h3>Keine Errungenschaften gefunden</h3>
          <p>Versuche andere Filtereinstellungen zu verwenden.</p>
        </div>
      )}
    </div>
  );
};

export default AchievementsScreen;
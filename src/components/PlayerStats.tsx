import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayerStats, SpecialAbility } from '../types/battle64';
import './PlayerStats.css';

interface PlayerStatsProps {
  stats: PlayerStats;
  username: string;
  specialAbility?: SpecialAbility;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({
  stats,
  username,
  specialAbility
}) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= rating ? 'filled' : 'empty'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const getStatColor = (value: number) => {
    if (value >= 8) return 'var(--n64-green)';
    if (value >= 6) return 'var(--n64-yellow)';
    if (value >= 4) return 'var(--n64-orange)';
    return 'var(--n64-red)';
  };

  const statItems = [
    {
      label: 'Geschwindigkeit',
      value: stats.speed,
      icon: '⚡',
      tooltip: `Durchschnittliche Zeit: ${stats.averageTime} / Bestzeit: ${stats.bestTime} auf ${stats.totalMaps} Maps`,
      maxValue: 10,
      unit: '/10'
    },
    {
      label: 'Präzision (Time-Trial)',
      value: stats.precision,
      icon: '🎯',
      tooltip: `Präzisionsrate: ${stats.precision * 10}%`,
      maxValue: 10,
      unit: '/10'
    },
    {
      label: 'Glitch-Kompetenz',
      value: stats.glitchMastery,
      icon: '🌟',
      tooltip: 'Beherrschung von Glitches und Exploits',
      maxValue: 10,
      unit: '/10'
    },
    {
      label: 'Spielvielfalt',
      value: stats.gameVariety,
      icon: '🎮',
      tooltip: `Spielt ${stats.gameVariety} verschiedene Spiele`,
      unit: ' Spiele'
    },
    {
      label: 'Original-Hardware',
      value: stats.originalHardware,
      icon: '🕹️',
      tooltip: stats.originalHardware ? 'Verwendet originale Hardware' : 'Verwendet Emulator/PC',
      displayValue: stats.originalHardware ? '✅' : '❌'
    },
    {
      label: 'Eventaktivität',
      value: stats.eventActivity,
      icon: '🏆',
      tooltip: `${stats.eventActivity} Event-Teilnahmen`,
      unit: ' Teilnahmen'
    }
  ];

  return (
    <div className="player-stats">
      {/* Header */}
      <div className="stats-header">
        <h2 className="stats-title">SPIELERSTATS: "{username}"</h2>
        <div className="stats-divider"></div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            className="stat-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setShowTooltip(item.tooltip || '')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <div className="stat-label">
              <span className="stat-icon">{item.icon}</span>
              <span className="stat-name">{item.label}</span>
            </div>
            
            <div className="stat-value">
              {item.displayValue ? (
                <span className="stat-display">{item.displayValue}</span>
              ) : (
                <>
                  <div className="star-rating">
                    {renderStars(Math.ceil((item.value as number) / 2))}
                  </div>
                  <span className="stat-number" style={{ color: getStatColor(item.value as number) }}>
                    {item.value}{item.unit}
                  </span>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Special Ability */}
      {specialAbility && (
        <motion.div
          className="special-ability"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="ability-header">
            <span className="ability-icon">{specialAbility.icon}</span>
            <h3 className="ability-title">🏆 Spezialwertung: {specialAbility.name}</h3>
          </div>
          <p className="ability-description">{specialAbility.description}</p>
          <div className="ability-requirements">
            <strong>Voraussetzungen:</strong>
            <ul>
              {specialAbility.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div className="stats-tooltip">
          {showTooltip}
        </div>
      )}
    </div>
  );
};

export default PlayerStats;
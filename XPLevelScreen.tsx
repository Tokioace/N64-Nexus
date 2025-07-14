import React, { useState, useEffect } from 'react';
import './XPLevelScreen.css';

interface LevelReward {
  id: string;
  type: 'item' | 'title' | 'skin';
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface LevelUpHistory {
  id: string;
  level: number;
  timestamp: Date;
  rewards: LevelReward[];
}

interface XPLevelScreenProps {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  onClose?: () => void;
}

const XPLevelScreen: React.FC<XPLevelScreenProps> = ({
  currentLevel,
  currentXP,
  xpToNextLevel,
  totalXP,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Sample rewards data
  const levelRewards: Record<number, LevelReward[]> = {
    1: [
      { id: '1', type: 'item', name: 'Iron Sword', description: 'A basic iron sword', icon: '⚔️', rarity: 'common' },
      { id: '2', type: 'title', name: 'Novice', description: 'Beginner adventurer', icon: '👤', rarity: 'common' }
    ],
    2: [
      { id: '3', type: 'skin', name: 'Forest Armor', description: 'Green leather armor', icon: '🛡️', rarity: 'rare' }
    ],
    3: [
      { id: '4', type: 'item', name: 'Magic Staff', description: 'Staff of arcane power', icon: '🔮', rarity: 'epic' },
      { id: '5', type: 'title', name: 'Mage Apprentice', description: 'Student of the arcane', icon: '🧙‍♂️', rarity: 'rare' }
    ],
    4: [
      { id: '6', type: 'skin', name: 'Dragon Scale Armor', description: 'Legendary dragon armor', icon: '🐉', rarity: 'legendary' }
    ],
    5: [
      { id: '7', type: 'item', name: 'Excalibur', description: 'The legendary sword', icon: '🗡️', rarity: 'legendary' },
      { id: '8', type: 'title', name: 'Legendary Hero', description: 'Champion of the realm', icon: '👑', rarity: 'legendary' }
    ]
  };

  // Sample history data
  const levelUpHistory: LevelUpHistory[] = [
    {
      id: '1',
      level: 4,
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      rewards: levelRewards[4] || []
    },
    {
      id: '2',
      level: 3,
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      rewards: levelRewards[3] || []
    },
    {
      id: '3',
      level: 2,
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
      rewards: levelRewards[2] || []
    }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const progressPercentage = ((currentXP / xpToNextLevel) * 100);
  const nextLevelRewards = levelRewards[currentLevel + 1] || [];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#9d9d9d';
      case 'rare': return '#0070dd';
      case 'epic': return '#a335ee';
      case 'legendary': return '#ff8000';
      default: return '#9d9d9d';
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  if (!isVisible) return null;

  return (
    <div className="xp-level-screen-overlay">
      <div className="xp-level-screen">
        {/* Header */}
        <div className="xp-header">
          <h1 className="xp-title">Level & Experience</h1>
          <button className="xp-close-btn" onClick={handleClose}>×</button>
        </div>

        {/* Current Level Info */}
        <div className="current-level-section">
          <div className="level-display">
            <div className="level-number">{currentLevel}</div>
            <div className="level-label">Current Level</div>
          </div>
          
          <div className="xp-info">
            <div className="xp-stats">
              <span className="xp-current">{currentXP.toLocaleString()}</span>
              <span className="xp-separator">/</span>
              <span className="xp-required">{xpToNextLevel.toLocaleString()}</span>
            </div>
            <div className="xp-total">Total XP: {totalXP.toLocaleString()}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="progress-glow"></div>
              </div>
            </div>
            <div className="progress-text">
              {xpToNextLevel - currentXP} XP to next level
            </div>
          </div>
        </div>

        {/* Next Level Rewards */}
        <div className="rewards-section">
          <h3 className="section-title">Next Level Rewards</h3>
          <div className="rewards-grid">
            {nextLevelRewards.length > 0 ? (
              nextLevelRewards.map((reward) => (
                <div 
                  key={reward.id} 
                  className="reward-item"
                  style={{ borderColor: getRarityColor(reward.rarity) }}
                >
                  <div className="reward-icon">{reward.icon}</div>
                  <div className="reward-info">
                    <div className="reward-name">{reward.name}</div>
                    <div className="reward-description">{reward.description}</div>
                    <div 
                      className="reward-rarity"
                      style={{ color: getRarityColor(reward.rarity) }}
                    >
                      {reward.rarity.charAt(0).toUpperCase() + reward.rarity.slice(1)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-rewards">No rewards for next level</div>
            )}
          </div>
        </div>

        {/* Level Up History */}
        <div className="history-section">
          <div className="history-header">
            <h3 className="section-title">Level Up History</h3>
            <button 
              className="history-toggle"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Hide' : 'Show'} History
            </button>
          </div>
          
          {showHistory && (
            <div className="history-list">
              {levelUpHistory.map((entry) => (
                <div key={entry.id} className="history-entry">
                  <div className="history-level">
                    <span className="history-level-number">{entry.level}</span>
                    <span className="history-date">
                      {entry.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="history-rewards">
                    {entry.rewards.map((reward) => (
                      <div 
                        key={reward.id} 
                        className="history-reward"
                        style={{ borderColor: getRarityColor(reward.rarity) }}
                      >
                        <span className="history-reward-icon">{reward.icon}</span>
                        <span className="history-reward-name">{reward.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default XPLevelScreen;
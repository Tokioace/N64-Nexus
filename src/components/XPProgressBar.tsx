import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserLevel, LEVEL_COLORS } from '../types/xp';
import './XPProgressBar.css';

interface XPProgressBarProps {
  userLevel: UserLevel;
  onLevelUp?: () => void;
}

export const XPProgressBar: React.FC<XPProgressBarProps> = ({ userLevel, onLevelUp }) => {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpTitle, setLevelUpTitle] = useState('');

  const progress = userLevel.xpToNextLevel > 0 
    ? ((userLevel.totalXP - (userLevel.totalXP - userLevel.currentXP)) / userLevel.xpToNextLevel) * 100
    : 100;

  const currentColor = LEVEL_COLORS[userLevel.currentLevel as keyof typeof LEVEL_COLORS] || '#4CAF50';

  const handleLevelUp = () => {
    const titles = [
      'Retro Rookie',
      'Pixel Pioneer', 
      'N64 Navigator',
      'Game Master',
      'Retro Commander',
      'Level Legend',
      'Pixel Master',
      'Gaming Guru',
      'Nostalgia Knight',
      'Elite Gamer',
      'Retro Royalty',
      'Pixel Prince',
      'Gaming Grandmaster',
      'N64 Noble',
      'Beta Tester',
      'Retro Regent',
      'Pixel Emperor',
      'Gaming God',
      'N64 Legend',
      'Community Creator'
    ];

    setLevelUpTitle(titles[userLevel.currentLevel - 1] || 'Level Up!');
    setShowLevelUp(true);
    
    // Play level up sound (if available)
    if (typeof window !== 'undefined' && 'Audio' in window) {
      const audio = new Audio('/sounds/level-up.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore errors if sound file doesn't exist
    }

    setTimeout(() => {
      setShowLevelUp(false);
      onLevelUp?.();
    }, 3000);
  };

  useEffect(() => {
    if (userLevel.currentLevel > 1) {
      handleLevelUp();
    }
  }, [userLevel.currentLevel]);

  return (
    <div className="xp-progress-container">
      {/* Level Display */}
      <div className="level-display">
        <div className="level-number">Level {userLevel.currentLevel}</div>
        <div className="level-title">
          {userLevel.currentLevel >= 5 ? 'Retro Commander' : 'Rookie'}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar-background">
          <motion.div
            className="progress-bar-fill"
            style={{ backgroundColor: currentColor }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        
        {/* XP Text */}
        <div className="xp-text">
          {userLevel.xpToNextLevel > 0 
            ? `${userLevel.currentXP} / ${userLevel.currentXP + userLevel.xpToNextLevel} XP bis Level ${userLevel.currentLevel + 1}`
            : `${userLevel.totalXP} XP - Max Level erreicht!`
          }
        </div>
      </div>

      {/* Total XP Display */}
      <div className="total-xp">
        Gesamt: {userLevel.totalXP} XP
      </div>

      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="level-up-overlay"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}
          >
            <div className="level-up-content">
              <motion.div
                className="level-up-text"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                LEVEL UP!
              </motion.div>
              <motion.div
                className="level-up-title"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                You are now a '{levelUpTitle}'!
              </motion.div>
              
              {/* Confetti Effect */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 5)]
                  }}
                  initial={{ y: -20, opacity: 0, rotate: 0 }}
                  animate={{ 
                    y: window.innerHeight, 
                    opacity: [0, 1, 0], 
                    rotate: 360 
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 2,
                    delay: Math.random() * 0.5
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
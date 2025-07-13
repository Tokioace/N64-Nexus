import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XPService } from '../services/xpService';
import { XPProgressBar } from './XPProgressBar';
import { XPHistoryComponent } from './XPHistory';
import { RewardsDisplay } from './RewardsDisplay';
import { XPTestingInterface } from './XPTestingInterface';
import { UserLevel, XPSource } from '../types/xp';
import './Battle64XPLevelSystem.css';

export const Battle64XPLevelSystem: React.FC = () => {
  const [userLevel, setUserLevel] = useState<UserLevel>(XPService.getInstance().getUserLevel());
  const [showCommunityComparison, setShowCommunityComparison] = useState(false);
  const [activeTab, setActiveTab] = useState<'progress' | 'history' | 'rewards' | 'testing'>('progress');

  const xpService = XPService.getInstance();

  const handleXPAdded = () => {
    setUserLevel(xpService.getUserLevel());
  };

  const handleLevelUp = () => {
    // Additional level up effects can be added here
    console.log('Level up achieved!');
  };

  // Mock community data for comparison
  const communityMembers = [
    { name: 'Sergio', level: 12, xp: 7800, xpToNext: 1300 },
    { name: 'Alex', level: 15, xp: 10500, xpToNext: 1500 },
    { name: 'Maya', level: 8, xp: 3600, xpToNext: 900 },
    { name: 'Tom', level: 20, xp: 19000, xpToNext: 0 }
  ];

  const getLevelColor = (level: number): string => {
    if (level <= 4) return '#4CAF50'; // Grün
    if (level <= 9) return '#FFC107'; // Gelb
    if (level <= 14) return '#FF5722'; // Rot
    return '#9C27B0'; // Violett
  };

  return (
    <div className="battle64-xp-system">
      {/* Header */}
      <motion.div 
        className="xp-system-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="xp-system-title">
          <span className="title-icon">🎮</span>
          Battle64 XP Levelsystem
          <span className="title-icon">🎮</span>
        </h1>
        <p className="xp-system-subtitle">
          Sammle XP, steige auf und schalte exklusive Belohnungen frei!
        </p>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="xp-tabs">
        {[
          { id: 'progress', label: 'Fortschritt', icon: '📊' },
          { id: 'history', label: 'Historie', icon: '📜' },
          { id: 'rewards', label: 'Belohnungen', icon: '🏆' },
          { id: 'testing', label: 'Testing', icon: '🧪' }
        ].map((tab) => (
          <button
            key={tab.id}
            className={`xp-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="xp-content">
        <AnimatePresence mode="wait">
          {activeTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="tab-content"
            >
              {/* XP Progress Bar */}
              <XPProgressBar userLevel={userLevel} onLevelUp={handleLevelUp} />

              {/* Community Comparison */}
              <div className="community-comparison">
                <h3 className="comparison-title">
                  <span className="comparison-icon">👥</span>
                  Community Vergleich
                </h3>
                <div className="community-members">
                  {communityMembers.map((member, index) => (
                    <motion.div
                      key={member.name}
                      className="community-member"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="member-info">
                        <div className="member-name">{member.name}</div>
                        <div className="member-level">Level {member.level}</div>
                      </div>
                      <div className="member-progress">
                        <div className="member-progress-bar">
                          <div 
                            className="member-progress-fill"
                            style={{ 
                              backgroundColor: getLevelColor(member.level),
                              width: `${member.xpToNext > 0 ? (member.xp / (member.xp + member.xpToNext)) * 100 : 100}%`
                            }}
                          />
                        </div>
                        <div className="member-xp">
                          {member.xpToNext > 0 ? `${member.xpToNext} XP entfernt` : 'Max Level!'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="tab-content"
            >
              <XPHistoryComponent history={userLevel.xpHistory} />
            </motion.div>
          )}

          {activeTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="tab-content"
            >
              <RewardsDisplay rewards={userLevel.rewards} currentLevel={userLevel.currentLevel} />
            </motion.div>
          )}

          {activeTab === 'testing' && (
            <motion.div
              key="testing"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="tab-content"
            >
              <XPTestingInterface onXPAdded={handleXPAdded} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Stats Footer */}
      <motion.div 
        className="xp-stats-footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="stat-item">
          <span className="stat-icon">⭐</span>
          <span className="stat-label">Gesamt XP:</span>
          <span className="stat-value">{userLevel.totalXP}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🎯</span>
          <span className="stat-label">Aktuelles Level:</span>
          <span className="stat-value">{userLevel.currentLevel}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🏆</span>
          <span className="stat-label">Freigeschaltet:</span>
          <span className="stat-value">{userLevel.rewards.filter(r => r.unlocked).length}</span>
        </div>
      </motion.div>
    </div>
  );
};
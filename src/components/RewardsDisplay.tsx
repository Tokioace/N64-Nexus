import React from 'react';
import { LevelReward } from '../types/xp';
import './RewardsDisplay.css';

interface RewardsDisplayProps {
  rewards: LevelReward[];
  currentLevel: number;
}

export const RewardsDisplay: React.FC<RewardsDisplayProps> = ({ rewards, currentLevel }) => {
  const unlockedRewards = rewards.filter(reward => reward.unlocked);
  const lockedRewards = rewards.filter(reward => !reward.unlocked);

  const getRewardIcon = (type: string): string => {
    switch (type) {
      case 'profile_frame': return '🖼️';
      case 'icon': return '🎨';
      case 'private_events': return '🔒';
      case 'beta_access': return '🧪';
      case 'fanart_contests': return '🏆';
      default: return '🎁';
    }
  };

  return (
    <div className="rewards-container">
      <h3 className="rewards-title">Belohnungen</h3>
      
      {/* Unlocked Rewards */}
      {unlockedRewards.length > 0 && (
        <div className="rewards-section">
          <h4 className="rewards-section-title unlocked">Freigeschaltet</h4>
          <div className="rewards-grid">
            {unlockedRewards.map((reward) => (
              <div key={reward.level} className="reward-card unlocked">
                <div className="reward-icon">{getRewardIcon(reward.type)}</div>
                <div className="reward-content">
                  <div className="reward-title">{reward.title}</div>
                  <div className="reward-description">{reward.description}</div>
                  <div className="reward-level">Level {reward.level}</div>
                </div>
                <div className="reward-status">✓</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Rewards */}
      {lockedRewards.length > 0 && (
        <div className="rewards-section">
          <h4 className="rewards-section-title locked">Kommende Belohnungen</h4>
          <div className="rewards-grid">
            {lockedRewards.map((reward) => (
              <div key={reward.level} className="reward-card locked">
                <div className="reward-icon">{getRewardIcon(reward.type)}</div>
                <div className="reward-content">
                  <div className="reward-title">{reward.title}</div>
                  <div className="reward-description">{reward.description}</div>
                  <div className="reward-level">
                    Level {reward.level} 
                    <span className="level-progress">
                      ({currentLevel}/{reward.level})
                    </span>
                  </div>
                </div>
                <div className="reward-status">🔒</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No rewards message */}
      {rewards.length === 0 && (
        <div className="rewards-empty">
          Noch keine Belohnungen verfügbar.
        </div>
      )}
    </div>
  );
};
import React from 'react';
import { motion } from 'framer-motion';
import { PlayerProfile } from '../types/battle64';
import './ProfileCard.css';

interface ProfileCardProps {
  profile: PlayerProfile;
  onViewGallery?: () => void;
  onAddFriend?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onViewGallery,
  onAddFriend
}) => {
  const xpPercentage = (profile.xp / profile.maxXp) * 100;

  return (
    <div className="profile-card">
      <div className="profile-header">
        {/* Avatar Section */}
        <div className="avatar-section">
          <div className="avatar-container">
            <img 
              src={profile.avatar} 
              alt={`${profile.username}'s avatar`}
              className="avatar-image"
            />
            <div className="avatar-border"></div>
          </div>
          
          {/* Rank Badge */}
          <div className="rank-badge">
            <span className="rank-icon">🏅</span>
            <span className="rank-title">{profile.rankTitle}</span>
          </div>
        </div>

        {/* User Info */}
        <div className="user-info">
          <h2 className="username">👾 {profile.username}</h2>
          <div className="user-details">
            <span className="region">📍 {profile.region}</span>
            <span className="platform">🎮 {profile.platform}</span>
          </div>
          
          {/* XP Bar */}
          <div className="xp-section">
            <div className="xp-label">
              <span>⭐ Fanpunkte: {profile.fanPoints}</span>
              <span>XP: {profile.xp}/{profile.maxXp}</span>
            </div>
            <div className="xp-bar">
              <motion.div 
                className="xp-fill"
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Favorite Game */}
          <div className="favorite-game">
            <span className="game-icon">🧩</span>
            <span className="game-name">{profile.favoriteGame}</span>
          </div>
        </div>
      </div>

      {/* Medals Section */}
      <div className="medals-section">
        <h3 className="section-title">🏆 Medaillen</h3>
        <div className="medals-grid">
          {profile.medals.slice(0, 6).map((medal) => (
            <motion.div
              key={medal.id}
              className={`medal ${medal.rarity}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={`${medal.name}: ${medal.description}`}
            >
              <span className="medal-icon">{medal.icon}</span>
            </motion.div>
          ))}
          {profile.medals.length > 6 && (
            <div className="medal-more">
              <span>+{profile.medals.length - 6}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className="retro-button gallery-btn"
          onClick={onViewGallery}
        >
          🖼️ Galerie
        </button>
        <button 
          className="retro-button friend-btn"
          onClick={onAddFriend}
        >
          👥 Freund hinzufügen
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
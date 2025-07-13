import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerProfile, StatDisplay } from '../types/battle64';
import ProfileCard from './ProfileCard';
import PlayerStats from './PlayerStats';
import './Battle64Profile.css';

interface Battle64ProfileProps {
  profile: PlayerProfile;
  onTogglePrivacy?: (isPublic: boolean) => void;
  onViewGallery?: () => void;
  onAddFriend?: () => void;
}

const Battle64Profile: React.FC<Battle64ProfileProps> = ({
  profile,
  onTogglePrivacy,
  onViewGallery,
  onAddFriend
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'stats'>('profile');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const handleTabChange = (tab: 'profile' | 'stats') => {
    setActiveTab(tab);
  };

  return (
    <div className="battle64-container">
      {/* Header with Tab Navigation */}
      <div className="battle64-header">
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile')}
          >
            🎮 Profilkarte
          </button>
          <button
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => handleTabChange('stats')}
          >
            📊 Spielerstats
          </button>
        </div>
        
        {/* Privacy Toggle */}
        <div className="privacy-toggle">
          <button
            className={`retro-button ${profile.isPublic ? 'public' : 'private'}`}
            onClick={() => onTogglePrivacy?.(!profile.isPublic)}
            title={profile.isPublic ? 'Profil ist öffentlich' : 'Profil ist privat'}
          >
            {profile.isPublic ? '🌐 Öffentlich' : '🔒 Privat'}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <ProfileCard
              profile={profile}
              onViewGallery={onViewGallery}
              onAddFriend={onAddFriend}
            />
          </motion.div>
        )}
        
        {activeTab === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PlayerStats
              stats={profile.stats}
              username={profile.username}
              specialAbility={profile.specialAbility}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip Container */}
      {showTooltip && (
        <div className="tooltip" style={{ left: '50%', top: '50%' }}>
          {showTooltip}
        </div>
      )}
    </div>
  );
};

export default Battle64Profile;
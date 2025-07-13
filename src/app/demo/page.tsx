'use client';

import React, { useState, useEffect } from 'react';
import AchievementAlbum from '@/components/achievements/AchievementAlbum';
import TrophyDisplay from '@/components/achievements/TrophyDisplay';
import AchievementNotification from '@/components/achievements/AchievementNotification';
import CommunityTicker from '@/components/achievements/CommunityTicker';
import ChatNotification from '@/components/achievements/ChatNotification';
import { Achievement, UserAchievement, CommunityAchievementEvent, AchievementNotification as NotificationType } from '@/types/achievement';
import { TrophyCalculator } from '@/utils/trophyCalculator';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Users, Crown, Target, Gamepad2 } from 'lucide-react';

// Sample achievements for demo
const sampleAchievements: Achievement[] = [
  {
    id: 'rainbow_road_master',
    title: 'Rainbow Road Master',
    description: 'Beende 100 Runden auf Rainbow Road',
    category: 'game-specific',
    trophyType: 'gold',
    rarity: 'rare',
    xpReward: 500,
    rules: [],
    isRepeatable: false,
    isLimited: false,
    icon: '🏁',
    backgroundColor: '#4A90E2',
    borderColor: '#FFD700',
    status: 'locked',
    isPublic: true,
    rewards: {
      title: 'Rainbow King',
      cosmetic: 'rainbow_trail'
    }
  },
  {
    id: 'ntsc_speedrun_first',
    title: 'NTSC Speedrun Pioneer',
    description: 'Erster NTSC-Speedrun in der Community',
    category: 'platform',
    trophyType: 'platinum',
    rarity: 'legendary',
    xpReward: 1000,
    rules: [],
    isRepeatable: false,
    isLimited: false,
    icon: '⚡',
    backgroundColor: '#7ED321',
    borderColor: '#E5E4E2',
    status: 'locked',
    isPublic: true,
    rewards: {
      title: 'Speed Demon',
      frame: 'platinum_frame'
    }
  },
  {
    id: 'fanart_critic',
    title: 'Fanart Kritiker',
    description: 'Bewerte 10 Fanarts in der Community',
    category: 'community',
    trophyType: 'silver',
    rarity: 'uncommon',
    xpReward: 200,
    rules: [],
    isRepeatable: false,
    isLimited: false,
    icon: '🎨',
    backgroundColor: '#F5A623',
    borderColor: '#C0C0C0',
    status: 'locked',
    isPublic: true,
    rewards: {
      title: 'Art Critic'
    }
  },
  {
    id: 'rarest_item_share',
    title: 'Seltenstes Item Sammler',
    description: 'Teile das seltenste Item in der Community',
    category: 'collector',
    trophyType: 'gold',
    rarity: 'epic',
    xpReward: 750,
    rules: [],
    isRepeatable: false,
    isLimited: false,
    icon: '💎',
    backgroundColor: '#D0021B',
    borderColor: '#FFD700',
    status: 'locked',
    isPublic: true,
    rewards: {
      title: 'Treasure Hunter',
      cosmetic: 'diamond_aura'
    }
  },
  {
    id: 'event_marathon',
    title: 'Event Marathon',
    description: 'Schließe 30 Events ab',
    category: 'recurring',
    trophyType: 'bronze',
    rarity: 'common',
    xpReward: 100,
    rules: [],
    isRepeatable: true,
    isLimited: false,
    icon: '🏃',
    backgroundColor: '#9B9B9B',
    borderColor: '#CD7F32',
    status: 'locked',
    isPublic: true,
    rewards: {
      title: 'Event Runner'
    }
  },
  {
    id: 'oktoberfest_champion_2025',
    title: 'Oktoberfest-Champion 2025',
    description: 'Gewinne das Oktoberfest-Event 2025',
    category: 'limited',
    trophyType: 'platinum',
    rarity: 'legendary',
    xpReward: 1500,
    rules: [],
    isRepeatable: false,
    isLimited: true,
    limitedTime: {
      start: '2025-10-01T00:00:00Z',
      end: '2025-10-31T23:59:59Z'
    },
    icon: '🍺',
    backgroundColor: '#5A4A9F',
    borderColor: '#E5E4E2',
    status: 'locked',
    isPublic: true,
    rewards: {
      title: 'Oktoberfest King',
      frame: 'oktoberfest_frame'
    }
  },
  {
    id: 'n64_drift_hero',
    title: 'N64 Drift Hero',
    description: 'Perfekte Drift in Mario Kart 64 unter 2 Minuten',
    category: 'game-specific',
    trophyType: 'gold',
    rarity: 'rare',
    xpReward: 400,
    rules: [],
    isRepeatable: false,
    isLimited: false,
    icon: '🔄',
    backgroundColor: '#4A90E2',
    borderColor: '#FFD700',
    status: 'locked',
    isPublic: true,
    rewards: {
      title: 'Drift Master'
    }
  },
  {
    id: 'community_helper',
    title: 'Community Helper',
    description: 'Hilfe 50 neuen Spielern beim Start',
    category: 'community',
    trophyType: 'gold',
    rarity: 'rare',
    xpReward: 600,
    rules: [],
    isRepeatable: false,
    isLimited: false,
    icon: '🤝',
    backgroundColor: '#F5A623',
    borderColor: '#FFD700',
    status: 'locked',
    isPublic: true,
    rewards: {
      title: 'Community Guardian'
    }
  }
];

// Sample user achievements
const sampleUserAchievements: UserAchievement[] = [
  {
    achievementId: 'rainbow_road_master',
    status: 'unlocked',
    unlockedAt: '2024-01-15T10:30:00Z',
    progress: 100,
    maxProgress: 100
  },
  {
    achievementId: 'fanart_critic',
    status: 'in-progress',
    progress: 7,
    maxProgress: 10
  },
  {
    achievementId: 'event_marathon',
    status: 'unlocked',
    unlockedAt: '2024-01-10T08:15:00Z',
    progress: 30,
    maxProgress: 30
  },
  {
    achievementId: 'n64_drift_hero',
    status: 'unlocked',
    unlockedAt: '2024-01-20T14:22:00Z',
    progress: 100,
    maxProgress: 100
  }
];

// Sample community events
const sampleCommunityEvents: CommunityAchievementEvent[] = [
  {
    id: '1',
    userId: 'Sergio',
    username: 'Sergio',
    achievement: sampleAchievements[1], // NTSC Speedrun Pioneer
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    isRare: true
  },
  {
    id: '2',
    userId: 'MarioFan',
    username: 'MarioFan',
    achievement: sampleAchievements[3], // Rarest Item Collector
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    isRare: true
  },
  {
    id: '3',
    userId: 'RetroGamer',
    username: 'RetroGamer',
    achievement: sampleAchievements[0], // Rainbow Road Master
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    isRare: false
  }
];

// Sample chat notification
const sampleChatNotification: NotificationType = {
  id: '1',
  userId: 'Sergio',
  achievementId: 'ntsc_speedrun_first',
  message: 'Sergio hat "NTSC Speedrun Pioneer" freigeschaltet!',
  timestamp: new Date().toISOString(),
  isRead: false,
  showInChat: true
};

export default function DemoPage() {
  const [achievements] = useState<Achievement[]>(sampleAchievements);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>(sampleUserAchievements);
  const [communityEvents] = useState<CommunityAchievementEvent[]>(sampleCommunityEvents);
  const [showNotification, setShowNotification] = useState(false);
  const [showChatNotification, setShowChatNotification] = useState(false);
  const [lastUnlockedAchievement, setLastUnlockedAchievement] = useState<Achievement | null>(null);
  const [activeTab, setActiveTab] = useState<'album' | 'trophies' | 'community'>('album');

  const handleAchievementUnlock = (achievement: Achievement) => {
    setLastUnlockedAchievement(achievement);
    setShowNotification(true);
    
    // Update user achievements
    setUserAchievements(prev => [
      ...prev,
      {
        achievementId: achievement.id,
        status: 'unlocked',
        unlockedAt: new Date().toISOString(),
        progress: 1,
        maxProgress: 1
      }
    ]);

    // Hide notification after 6 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 6000);
  };

  const handleCommunityEventClick = (event: CommunityAchievementEvent) => {
    console.log('Community event clicked:', event);
  };

  const handleChatNotificationClose = () => {
    setShowChatNotification(false);
  };

  const handleMarkAsRead = (id: string) => {
    console.log('Marked as read:', id);
  };

  const stats = TrophyCalculator.calculateStats(achievements, userAchievements);

  // Demo function to trigger achievement unlock
  const triggerDemoUnlock = () => {
    const lockedAchievements = achievements.filter(a => 
      !userAchievements.find(ua => ua.achievementId === a.id && ua.status === 'unlocked')
    );
    
    if (lockedAchievements.length > 0) {
      const randomAchievement = lockedAchievements[Math.floor(Math.random() * lockedAchievements.length)];
      handleAchievementUnlock(randomAchievement);
    }
  };

  // Demo function to trigger chat notification
  const triggerChatNotification = () => {
    setShowChatNotification(true);
    setTimeout(() => {
      setShowChatNotification(false);
    }, 8000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-n64-purple via-n64-blue to-n64-green p-4">
      {/* Header */}
      <header className="text-center mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-retro text-4xl md:text-6xl text-white mb-4 drop-shadow-lg"
        >
          🏆 Battle64 Demo
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-white opacity-90 mb-8"
        >
          Erlebe das Achievement-System in Aktion
        </motion.p>

        {/* Demo Controls */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center mb-8"
        >
          <button
            onClick={triggerDemoUnlock}
            className="btn-primary flex items-center space-x-2"
          >
            <Trophy className="w-5 h-5" />
            <span>Achievement Freischalten</span>
          </button>
          <button
            onClick={triggerChatNotification}
            className="btn-secondary flex items-center space-x-2"
          >
            <Users className="w-5 h-5" />
            <span>Chat Benachrichtigung</span>
          </button>
        </motion.div>
      </header>

      {/* Stats Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="card-retro p-4 text-center">
          <div className="text-2xl font-bold text-n64-blue">{stats.totalUnlocked}</div>
          <div className="text-sm text-gray-600">Freigeschaltet</div>
        </div>
        <div className="card-retro p-4 text-center">
          <div className="text-2xl font-bold text-gold">{stats.completionPercentage}%</div>
          <div className="text-sm text-gray-600">Vollständig</div>
        </div>
        <div className="card-retro p-4 text-center">
          <div className="text-2xl font-bold text-n64-green">{stats.totalXP}</div>
          <div className="text-sm text-gray-600">Gesamt XP</div>
        </div>
        <div className="card-retro p-4 text-center">
          <div className="text-2xl font-bold text-platinum">{stats.byTrophyType.platinum}</div>
          <div className="text-sm text-gray-600">Platin</div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center mb-6"
      >
        <div className="flex bg-white rounded-lg p-1 shadow-lg">
          <button
            onClick={() => setActiveTab('album')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'album'
                ? 'bg-n64-blue text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Gamepad2 className="w-4 h-4" />
              <span>Achievement Album</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('trophies')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'trophies'
                ? 'bg-n64-blue text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Trophäen</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'community'
                ? 'bg-n64-blue text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Community</span>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'album' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AchievementAlbum
              achievements={achievements}
              userAchievements={userAchievements}
              onAchievementClick={handleAchievementUnlock}
            />
          </motion.div>
        )}

        {activeTab === 'trophies' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TrophyDisplay
              achievements={achievements}
              userAchievements={userAchievements}
              stats={stats}
            />
          </motion.div>
        )}

        {activeTab === 'community' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <CommunityTicker
              events={communityEvents}
              onEventClick={handleCommunityEventClick}
            />
            <div className="space-y-6">
              <div className="card-retro p-6">
                <h3 className="font-retro text-lg text-gray-800 mb-4 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-n64-blue" />
                  <span>Community Highlights</span>
                </h3>
                <div className="space-y-3">
                  {communityEvents.map((event) => (
                    <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-n64-blue to-n64-purple rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {event.username.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-800">
                          {event.username}
                        </div>
                        <div className="text-xs text-gray-600">
                          {event.achievement.title}
                        </div>
                      </div>
                      {event.isRare && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Notifications */}
      {showNotification && lastUnlockedAchievement && (
        <AchievementNotification
          achievement={lastUnlockedAchievement}
          onClose={() => setShowNotification(false)}
        />
      )}

      {showChatNotification && (
        <ChatNotification
          notification={sampleChatNotification}
          onClose={handleChatNotificationClose}
          onMarkAsRead={handleMarkAsRead}
        />
      )}
    </div>
  );
}
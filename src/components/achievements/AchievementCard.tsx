'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Lock, Unlock, Clock, Repeat } from 'lucide-react';
import { Achievement, AchievementStatus } from '@/types/achievement';
import { AchievementLogic } from '@/utils/achievementLogic';
import { TrophyCalculator } from '@/utils/trophyCalculator';

interface AchievementCardProps {
  achievement: Achievement;
  userProgress?: {
    progress: number;
    maxProgress: number;
    status: AchievementStatus;
    unlockedAt?: string;
  };
  onCardClick?: (achievement: Achievement) => void;
  showDetails?: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  userProgress,
  onCardClick,
  showDetails = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const status = userProgress?.status || achievement.status;
  const progress = userProgress?.progress || 0;
  const maxProgress = userProgress?.maxProgress || 1;
  const progressPercentage = maxProgress > 0 ? (progress / maxProgress) * 100 : 0;

  // Check if achievement is limited and get time remaining
  const timeRemaining = AchievementLogic.getTimeRemaining(achievement);
  const isAvailable = AchievementLogic.isAchievementAvailable(achievement);

  // Get trophy icon and colors
  const getTrophyIcon = () => {
    switch (achievement.trophyType) {
      case 'bronze':
        return <Trophy className="w-6 h-6 text-bronze" />;
      case 'silver':
        return <Trophy className="w-6 h-6 text-silver" />;
      case 'gold':
        return <Trophy className="w-6 h-6 text-gold" />;
      case 'platinum':
        return <Trophy className="w-6 h-6 text-platinum" />;
      default:
        return <Trophy className="w-6 h-6 text-gray-400" />;
    }
  };

  const getRarityColor = () => {
    switch (achievement.rarity) {
      case 'common':
        return 'text-gray-400';
      case 'uncommon':
        return 'text-green-400';
      case 'rare':
        return 'text-blue-400';
      case 'epic':
        return 'text-purple-400';
      case 'legendary':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getCategoryColor = () => {
    switch (achievement.category) {
      case 'game-specific':
        return 'bg-game-specific';
      case 'platform':
        return 'bg-platform';
      case 'community':
        return 'bg-community';
      case 'collector':
        return 'bg-collector';
      case 'recurring':
        return 'bg-recurring';
      case 'limited':
        return 'bg-limited';
      default:
        return 'bg-gray-500';
    }
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(achievement);
    }
  };

  return (
    <motion.div
      className={`relative group cursor-pointer transition-all duration-300 ${
        status === 'unlocked' ? 'achievement-unlock' : ''
      }`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Main Card */}
      <div
        className={`
          relative overflow-hidden rounded-lg border-2 p-4 h-48
          transition-all duration-300 ease-in-out
          ${status === 'unlocked' 
            ? 'border-gold bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-lg' 
            : status === 'in-progress'
            ? 'border-silver bg-gradient-to-br from-gray-50 to-gray-100 shadow-md'
            : 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm'
          }
          ${!isAvailable ? 'opacity-50' : ''}
          ${achievement.trophyType === 'platinum' && status === 'unlocked' ? 'animate-trophy-glow' : ''}
        `}
        style={{
          backgroundImage: status === 'unlocked' ? 'var(--retro-pattern)' : 'none'
        }}
      >
        {/* Status Overlay */}
        {status === 'locked' && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <Lock className="w-8 h-8 text-gray-400" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getTrophyIcon()}
            <div className="flex flex-col">
              <h3 className="font-retro text-sm font-bold text-gray-800 leading-tight">
                {achievement.title}
              </h3>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${getCategoryColor()}`} />
                <span className="text-xs text-gray-600 capitalize">
                  {achievement.category.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center space-x-1">
              <Star className={`w-3 h-3 ${getRarityColor()}`} />
              <span className="text-xs text-gray-600 capitalize">
                {achievement.rarity}
              </span>
            </div>
            <div className="text-xs font-bold text-gray-700">
              +{achievement.xpReward} XP
            </div>
          </div>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-3">
          <div className="text-4xl">{achievement.icon}</div>
        </div>

        {/* Progress Bar */}
        {status === 'in-progress' && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="text-xs text-gray-500 text-center mt-1">
              {progress} / {maxProgress}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              {achievement.isRepeatable && <Repeat className="w-3 h-3" />}
              {achievement.isLimited && <Clock className="w-3 h-3" />}
            </div>
            {status === 'unlocked' && userProgress?.unlockedAt && (
              <span className="text-xs">
                {new Date(userProgress.unlockedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Limited Time Warning */}
        {achievement.isLimited && timeRemaining && timeRemaining > 0 && (
          <div className="absolute top-2 right-2">
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {AchievementLogic.formatTimeRemaining(timeRemaining)}
            </div>
          </div>
        )}

        {/* Shimmer Effect for Platinum */}
        {achievement.trophyType === 'platinum' && status === 'unlocked' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer" />
          </div>
        )}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white p-3 rounded-lg shadow-xl"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className="text-sm font-semibold mb-2">{achievement.title}</div>
            <div className="text-xs text-gray-300 mb-2">{achievement.description}</div>
            
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Trophy:</span>
                <span className="capitalize">{achievement.trophyType}</span>
              </div>
              <div className="flex justify-between">
                <span>Rarity:</span>
                <span className="capitalize">{achievement.rarity}</span>
              </div>
              <div className="flex justify-between">
                <span>XP Reward:</span>
                <span>{achievement.xpReward}</span>
              </div>
              {achievement.rewards?.title && (
                <div className="flex justify-between">
                  <span>Title:</span>
                  <span>{achievement.rewards.title}</span>
                </div>
              )}
            </div>
            
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AchievementCard;
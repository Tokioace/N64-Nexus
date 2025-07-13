'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Star, Zap, Gift } from 'lucide-react';
import { Achievement } from '@/types/achievement';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose
}) => {
  useEffect(() => {
    // Auto-close after 6 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 6000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getTrophyColor = () => {
    switch (achievement.trophyType) {
      case 'bronze':
        return 'text-bronze';
      case 'silver':
        return 'text-silver';
      case 'gold':
        return 'text-gold';
      case 'platinum':
        return 'text-platinum';
      default:
        return 'text-gray-400';
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

  const getTrophyGlow = () => {
    switch (achievement.trophyType) {
      case 'bronze':
        return 'shadow-bronze-glow';
      case 'silver':
        return 'shadow-silver-glow';
      case 'gold':
        return 'shadow-gold-glow';
      case 'platinum':
        return 'shadow-platinum-glow';
      default:
        return '';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.8, rotateX: -90 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        exit={{ opacity: 0, y: -100, scale: 0.8, rotateX: -90 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25,
          duration: 0.6 
        }}
        className="fixed top-4 right-4 z-50 max-w-sm w-full"
      >
        <div className="relative bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-2xl border-2 border-yellow-300 overflow-hidden">
          {/* Shimmer Effect for Platinum/Legendary */}
          {achievement.trophyType === 'platinum' && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
            </div>
          )}

          {/* Header */}
          <div className="bg-black bg-opacity-20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className={`relative ${getTrophyGlow()}`}
                >
                  <Trophy className={`w-6 h-6 ${getTrophyColor()}`} />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full"
                  />
                </motion.div>
                <div>
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-retro text-sm text-white font-bold"
                  >
                    ACHIEVEMENT FREIGESCHALTET!
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xs text-yellow-100"
                  >
                    Du hast ein neues Achievement erreicht!
                  </motion.p>
                </div>
              </div>
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                onClick={onClose}
                className="text-white hover:text-yellow-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* "You unlocked" Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-2 text-center"
          >
            <div className="font-retro text-sm text-white font-bold">
              You unlocked: {achievement.title}!
            </div>
          </motion.div>

          {/* Content */}
          <div className="p-4 bg-white">
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                className="text-4xl flex-shrink-0"
              >
                {achievement.icon}
              </motion.div>
              
              {/* Details */}
              <div className="flex-1 min-w-0">
                <motion.h4 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="font-bold text-gray-800 text-lg mb-1"
                >
                  {achievement.title}
                </motion.h4>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="text-sm text-gray-600 mb-3"
                >
                  {achievement.description}
                </motion.p>
                
                {/* Stats */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Trophy className={`w-4 h-4 ${getTrophyColor()}`} />
                      <span className="text-xs font-semibold text-gray-700 capitalize">
                        {achievement.trophyType}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className={`w-4 h-4 ${getRarityColor()}`} />
                      <span className="text-xs font-semibold text-gray-700 capitalize">
                        {achievement.rarity}
                      </span>
                    </div>
                  </div>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ delay: 1.1, duration: 0.3 }}
                    className="text-right"
                  >
                    <div className="text-lg font-bold text-n64-blue flex items-center space-x-1">
                      <Zap className="w-4 h-4" />
                      <span>+{achievement.xpReward} XP</span>
                    </div>
                    <div className="text-xs text-gray-500">Belohnung</div>
                  </motion.div>
                </motion.div>

                {/* Rewards */}
                {achievement.rewards && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="mt-3 pt-3 border-t border-gray-200"
                  >
                    <div className="text-xs text-gray-500 mb-1 flex items-center space-x-1">
                      <Gift className="w-3 h-3" />
                      <span>Belohnungen:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {achievement.rewards.title && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
                          className="px-2 py-1 bg-n64-blue text-white text-xs rounded-full"
                        >
                          {achievement.rewards.title}
                        </motion.span>
                      )}
                      {achievement.rewards.cosmetic && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
                          className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full"
                        >
                          {achievement.rewards.cosmetic}
                        </motion.span>
                      )}
                      {achievement.rewards.frame && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                          className="px-2 py-1 bg-gold text-white text-xs rounded-full"
                        >
                          {achievement.rewards.frame}
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-100 px-4 py-2">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Fortschritt</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-n64-blue to-n64-green h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 1.6 }}
              />
            </div>
          </div>

          {/* Sound Effect Indicator */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full"
          />
        </div>

        {/* Celebration Particles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute inset-0 pointer-events-none"
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0, 
                scale: 0, 
                x: 0, 
                y: 0 
              }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0, 1, 0], 
                x: Math.cos(i * 60 * Math.PI / 180) * 100,
                y: Math.sin(i * 60 * Math.PI / 180) * 100
              }}
              transition={{ 
                delay: 0.5 + i * 0.1, 
                duration: 1.5,
                ease: "easeOut"
              }}
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-300 rounded-full"
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AchievementNotification;
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, MessageCircle, Users, Zap, Crown } from 'lucide-react';
import { AchievementNotification } from '@/types/achievement';

interface ChatNotificationProps {
  notification: AchievementNotification;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}

const ChatNotification: React.FC<ChatNotificationProps> = ({
  notification,
  onClose,
  onMarkAsRead
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 8 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300);
    }, 8000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleMarkAsRead = () => {
    onMarkAsRead(notification.id);
  };

  const getTrophyIcon = (type: string) => {
    switch (type) {
      case 'bronze':
        return <Trophy className="w-4 h-4 text-bronze" />;
      case 'silver':
        return <Trophy className="w-4 h-4 text-silver" />;
      case 'gold':
        return <Trophy className="w-4 h-4 text-gold" />;
      case 'platinum':
        return <Trophy className="w-4 h-4 text-platinum" />;
      default:
        return <Trophy className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
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

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const eventTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - eventTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Gerade eben';
    if (diffInMinutes < 60) return `vor ${diffInMinutes} Min.`;
    if (diffInMinutes < 1440) return `vor ${Math.floor(diffInMinutes / 60)} Std.`;
    return `vor ${Math.floor(diffInMinutes / 1440)} Tag(en)`;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            duration: 0.5 
          }}
          className="fixed bottom-4 right-4 z-50 max-w-sm w-full"
        >
          <div className="bg-white rounded-lg shadow-2xl border-2 border-n64-blue overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-n64-blue to-n64-purple p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <MessageCircle className="w-5 h-5 text-white" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="font-retro text-sm text-white font-bold">
                      Gruppenchat Benachrichtigung
                    </h3>
                    <p className="text-xs text-blue-100">
                      Neues Achievement in der Community
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={handleClose}
                  className="text-white hover:text-blue-200 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start space-x-3">
                {/* User Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-n64-green to-n64-blue rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {notification.userId.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Crown className="w-2 h-2 text-white" />
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-sm text-gray-800">
                      {notification.userId}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(notification.timestamp)}
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 border border-yellow-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="text-lg">🏆</div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 font-medium">
                          {notification.message}
                        </p>
                      </div>
                    </div>

                    {/* Achievement Details */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {getTrophyIcon('gold')}
                          <span className="text-gray-600">Gold</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span className="text-gray-600">Legendär</span>
                        </div>
                      </div>
                      <div className="text-n64-blue font-bold">
                        +500 XP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleMarkAsRead}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    notification.isRead
                      ? 'bg-green-100 text-green-700'
                      : 'bg-n64-blue text-white hover:bg-n64-purple'
                  }`}
                >
                  {notification.isRead ? '✓ Gelesen' : 'Als gelesen markieren'}
                </button>
              </div>
              
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                <span>Gruppenchat</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-200">
              <motion.div
                className="h-1 bg-gradient-to-r from-n64-blue to-n64-purple"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 8, ease: 'linear' }}
              />
            </div>
          </div>

          {/* Celebration Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(4)].map((_, i) => (
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
                  x: Math.cos(i * 90 * Math.PI / 180) * 80,
                  y: Math.sin(i * 90 * Math.PI / 180) * 80
                }}
                transition={{ 
                  delay: 0.5 + i * 0.1, 
                  duration: 1.2,
                  ease: "easeOut"
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatNotification;
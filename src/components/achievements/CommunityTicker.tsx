'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Users, Zap, Crown, TrendingUp } from 'lucide-react';
import { CommunityAchievementEvent, Achievement } from '@/types/achievement';

interface CommunityTickerProps {
  events: CommunityAchievementEvent[];
  onEventClick?: (event: CommunityAchievementEvent) => void;
}

const CommunityTicker: React.FC<CommunityTickerProps> = ({
  events,
  onEventClick
}) => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (events.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % events.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [events.length, isPaused]);

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

  if (events.length === 0) {
    return (
      <div className="card-retro p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <Users className="w-5 h-5" />
          <span className="text-sm">Keine Community-Events verfügbar</span>
        </div>
      </div>
    );
  }

  const currentEvent = events[currentEventIndex];

  return (
    <div className="card-retro p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <TrendingUp className="w-5 h-5 text-n64-blue" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <h3 className="font-retro text-sm text-gray-800">Community Ticker</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-1 rounded transition-colors ${
              isPaused 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {isPaused ? '▶' : '⏸'}
          </button>
          <span className="text-xs text-gray-500">
            {currentEventIndex + 1}/{events.length}
          </span>
        </div>
      </div>

      {/* Event Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentEvent.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="cursor-pointer"
          onClick={() => onEventClick?.(currentEvent)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className={`
            p-3 rounded-lg border-2 transition-all duration-300
            ${currentEvent.isRare 
              ? 'border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md' 
              : 'border-gray-200 bg-white shadow-sm'
            }
            hover:shadow-lg hover:scale-105
          `}>
            <div className="flex items-center space-x-3">
              {/* User Avatar */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-n64-blue to-n64-purple rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {currentEvent.username.charAt(0).toUpperCase()}
                </div>
                {currentEvent.isRare && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Crown className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>

              {/* Event Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-sm text-gray-800">
                    {currentEvent.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    hat freigeschaltet:
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <div className="text-lg">{currentEvent.achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-800 truncate">
                      {currentEvent.achievement.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      {getTrophyIcon(currentEvent.achievement.trophyType)}
                      <span className="text-xs font-semibold text-gray-600 capitalize">
                        {currentEvent.achievement.trophyType}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className={`w-3 h-3 ${getRarityColor(currentEvent.achievement.rarity)}`} />
                      <span className="text-xs font-semibold text-gray-600 capitalize">
                        {currentEvent.achievement.rarity}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xs font-bold text-n64-blue">
                      +{currentEvent.achievement.xpReward} XP
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTimeAgo(currentEvent.timestamp)}
                    </div>
                  </div>
                </div>

                {/* Rare Achievement Badge */}
                {currentEvent.isRare && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mt-2 flex items-center space-x-1"
                  >
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs font-bold text-purple-600">
                      SELTENES ACHIEVEMENT!
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Dots */}
      {events.length > 1 && (
        <div className="flex justify-center space-x-1 mt-3">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentEventIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentEventIndex
                  ? 'bg-n64-blue'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityTicker;
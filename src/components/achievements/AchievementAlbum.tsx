'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Lock, Unlock, BookOpen, Grid, List, Filter, Search } from 'lucide-react';
import { Achievement, AchievementStatus, AchievementCategory, AchievementFilters, AchievementSortBy, SortOrder } from '@/types/achievement';

interface AchievementAlbumProps {
  achievements: Achievement[];
  userAchievements: {
    achievementId: string;
    status: AchievementStatus;
    progress?: number;
    maxProgress?: number;
    unlockedAt?: string;
  }[];
  onAchievementClick?: (achievement: Achievement) => void;
}

const AchievementAlbum: React.FC<AchievementAlbumProps> = ({
  achievements,
  userAchievements,
  onAchievementClick
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [filters, setFilters] = useState<AchievementFilters>({});
  const [sortBy, setSortBy] = useState<AchievementSortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const getAchievementProgress = (achievementId: string) => {
    return userAchievements.find(ua => ua.achievementId === achievementId);
  };

  // Filter and sort achievements
  const filteredAndSortedAchievements = achievements
    .filter(achievement => {
      // Category filter
      if (selectedCategory !== 'all' && achievement.category !== selectedCategory) {
        return false;
      }
      
      // Search filter
      if (searchTerm && !achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !achievement.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Status filter
      const userProgress = getAchievementProgress(achievement.id);
      const status = userProgress?.status || achievement.status;
      
      if (filters.status && status !== filters.status) {
        return false;
      }
      
      if (filters.showLocked === false && status === 'locked') {
        return false;
      }
      
      if (filters.showUnlocked === false && status === 'unlocked') {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'trophyType':
          const trophyOrder = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
          comparison = trophyOrder[a.trophyType] - trophyOrder[b.trophyType];
          break;
        case 'rarity':
          const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
          comparison = rarityOrder[a.rarity] - rarityOrder[b.rarity];
          break;
        case 'xpReward':
          comparison = a.xpReward - b.xpReward;
          break;
        case 'unlockDate':
          const aDate = getAchievementProgress(a.id)?.unlockedAt || '';
          const bDate = getAchievementProgress(b.id)?.unlockedAt || '';
          comparison = aDate.localeCompare(bDate);
          break;
        case 'progress':
          const aProgress = getAchievementProgress(a.id)?.progress || 0;
          const bProgress = getAchievementProgress(b.id)?.progress || 0;
          comparison = aProgress - bProgress;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

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

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'game-specific': 'Spielspezifisch',
      'platform': 'Plattform',
      'community': 'Community',
      'collector': 'Sammler',
      'recurring': 'Wiederkehrend',
      'limited': 'Limitiert'
    };
    return labels[category] || category;
  };

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    onAchievementClick?.(achievement);
  };

  const unlockedCount = userAchievements.filter(ua => ua.status === 'unlocked').length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-6">
      {/* Album Header - Retro Inlay Style */}
      <div className="card-retro p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <BookOpen className="w-8 h-8 text-n64-blue" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="font-retro text-xl text-gray-800">Achievement Album</h2>
              <p className="text-sm text-gray-600">Deine digitale Trophäensammlung</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-n64-blue">
              {unlockedCount}/{totalCount}
            </div>
            <div className="text-sm text-gray-600">Freigeschaltet</div>
            <div className="text-xs text-gray-500">
              {Math.round((unlockedCount / totalCount) * 100)}% Vollständig
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card-retro p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Achievements durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-n64-blue focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-n64-blue text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Alle
            </button>
            {(['game-specific', 'platform', 'community', 'collector', 'recurring', 'limited'] as AchievementCategory[]).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  selectedCategory === category
                    ? 'bg-n64-blue text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {getCategoryLabel(category)}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-n64-blue text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-n64-blue text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sort Options */}
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Sortieren nach:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as AchievementSortBy)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-n64-blue"
          >
            <option value="name">Name</option>
            <option value="category">Kategorie</option>
            <option value="trophyType">Trophäe</option>
            <option value="rarity">Seltenheit</option>
            <option value="xpReward">XP</option>
            <option value="unlockDate">Datum</option>
            <option value="progress">Fortschritt</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Album Content - Slot Fields Style */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' : 'space-y-3'}>
        {filteredAndSortedAchievements.map((achievement) => {
          const userProgress = getAchievementProgress(achievement.id);
          const status = userProgress?.status || achievement.status;
          const progress = userProgress?.progress || 0;
          const maxProgress = userProgress?.maxProgress || 1;
          const progressPercentage = maxProgress > 0 ? (progress / maxProgress) * 100 : 0;

          if (viewMode === 'grid') {
            return (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer group"
                onClick={() => handleAchievementClick(achievement)}
              >
                <div className={`
                  relative aspect-square rounded-lg border-2 p-3 transition-all duration-300
                  ${status === 'unlocked' 
                    ? 'border-gold bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-lg' 
                    : status === 'in-progress'
                    ? 'border-silver bg-gradient-to-br from-gray-50 to-gray-100 shadow-md'
                    : 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm'
                  }
                  ${achievement.trophyType === 'platinum' && status === 'unlocked' ? 'animate-trophy-glow' : ''}
                  group-hover:shadow-xl group-hover:border-n64-blue
                `}>
                  {/* Status Overlay */}
                  {status === 'locked' && (
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-lg">
                      <Lock className="w-6 h-6 text-gray-400" />
                    </div>
                  )}

                  {/* Icon */}
                  <div className="flex justify-center mb-2">
                    <div className="text-2xl">{achievement.icon}</div>
                  </div>

                  {/* Title */}
                  <div className="text-center mb-2">
                    <h3 className="font-semibold text-xs text-gray-800 line-clamp-2">
                      {achievement.title}
                    </h3>
                  </div>

                  {/* Trophy and Rarity */}
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    {getTrophyIcon(achievement.trophyType)}
                    <Star className={`w-3 h-3 ${getRarityColor(achievement.rarity)}`} />
                  </div>

                  {/* Progress Bar */}
                  {status === 'in-progress' && (
                    <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
                      <div 
                        className="bg-n64-blue h-1 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  )}

                  {/* XP Reward */}
                  <div className="text-center">
                    <div className="text-xs font-bold text-n64-blue">
                      +{achievement.xpReward} XP
                    </div>
                  </div>

                  {/* Hover Info */}
                  <div className="absolute inset-0 bg-black bg-opacity-80 text-white p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center">
                    <div className="text-center">
                      <div className="text-lg mb-2">{achievement.icon}</div>
                      <h4 className="font-bold text-sm mb-1">{achievement.title}</h4>
                      <p className="text-xs mb-2">{achievement.description}</p>
                      <div className="text-xs">
                        <div className="flex items-center justify-center space-x-2 mb-1">
                          {getTrophyIcon(achievement.trophyType)}
                          <span className="capitalize">{achievement.trophyType}</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <Star className={`w-3 h-3 ${getRarityColor(achievement.rarity)}`} />
                          <span className="capitalize">{achievement.rarity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          } else {
            // List view
            return (
              <motion.div
                key={achievement.id}
                whileHover={{ x: 5 }}
                className="cursor-pointer"
                onClick={() => handleAchievementClick(achievement)}
              >
                <div className={`
                  flex items-center space-x-4 p-4 rounded-lg border-2 transition-all duration-300
                  ${status === 'unlocked' 
                    ? 'border-gold bg-gradient-to-r from-yellow-50 to-yellow-100' 
                    : status === 'in-progress'
                    ? 'border-silver bg-gradient-to-r from-gray-50 to-gray-100'
                    : 'border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100'
                  }
                  hover:shadow-md hover:border-n64-blue
                `}>
                  {/* Icon */}
                  <div className="text-2xl flex-shrink-0">{achievement.icon}</div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-1">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    <div className="flex items-center space-x-4 text-xs">
                      <span className="text-gray-500">{getCategoryLabel(achievement.category)}</span>
                      <div className="flex items-center space-x-1">
                        {getTrophyIcon(achievement.trophyType)}
                        <span className="capitalize">{achievement.trophyType}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className={`w-3 h-3 ${getRarityColor(achievement.rarity)}`} />
                        <span className="capitalize">{achievement.rarity}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress/Reward */}
                  <div className="text-right flex-shrink-0">
                    {status === 'in-progress' ? (
                      <div className="text-sm">
                        <div className="text-gray-600">{progress}/{maxProgress}</div>
                        <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-n64-blue h-1 rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm font-bold text-n64-blue">
                        +{achievement.xpReward} XP
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          }
        })}
      </div>

      {/* Empty State */}
      {filteredAndSortedAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="font-retro text-xl text-gray-600 mb-2">Keine Achievements gefunden</h3>
          <p className="text-gray-500">Versuche andere Filter oder Suchbegriffe</p>
        </div>
      )}
    </div>
  );
};

export default AchievementAlbum;
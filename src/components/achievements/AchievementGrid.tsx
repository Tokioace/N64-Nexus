'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, SortAsc, SortDesc } from 'lucide-react';
import AchievementCard from './AchievementCard';
import { Achievement, AchievementCategory, TrophyType, AchievementRarity, AchievementStatus, AchievementFilters, AchievementSortBy, SortOrder } from '@/types/achievement';

interface AchievementGridProps {
  achievements: Achievement[];
  userAchievements: {
    achievementId: string;
    status: AchievementStatus;
    progress?: number;
    maxProgress?: number;
    unlockedAt?: string;
  }[];
  onAchievementUnlock?: (achievement: Achievement) => void;
}

const AchievementGrid: React.FC<AchievementGridProps> = ({
  achievements,
  userAchievements,
  onAchievementUnlock
}) => {
  const [filters, setFilters] = useState<AchievementFilters>({
    showLocked: true,
    showUnlocked: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<AchievementSortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showFilters, setShowFilters] = useState(false);

  // Get user progress for each achievement
  const getAchievementProgress = (achievementId: string) => {
    return userAchievements.find(ua => ua.achievementId === achievementId);
  };

  // Filter and sort achievements
  const filteredAndSortedAchievements = useMemo(() => {
    let filtered = achievements.filter(achievement => {
      const userProgress = getAchievementProgress(achievement.id);
      const status = userProgress?.status || achievement.status;

      // Status filter
      if (status === 'locked' && !filters.showLocked) return false;
      if (status === 'unlocked' && !filters.showUnlocked) return false;

      // Category filter
      if (filters.category && achievement.category !== filters.category) return false;

      // Trophy type filter
      if (filters.trophyType && achievement.trophyType !== filters.trophyType) return false;

      // Rarity filter
      if (filters.rarity && achievement.rarity !== filters.rarity) return false;

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesTitle = achievement.title.toLowerCase().includes(searchLower);
        const matchesDescription = achievement.description.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDescription) return false;
      }

      return true;
    });

    // Sort achievements
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'trophyType':
          aValue = a.trophyType;
          bValue = b.trophyType;
          break;
        case 'rarity':
          aValue = a.rarity;
          bValue = b.rarity;
          break;
        case 'xpReward':
          aValue = a.xpReward;
          bValue = b.xpReward;
          break;
        case 'unlockDate':
          const aProgress = getAchievementProgress(a.id);
          const bProgress = getAchievementProgress(b.id);
          aValue = aProgress?.unlockedAt || '';
          bValue = bProgress?.unlockedAt || '';
          break;
        case 'progress':
          const aProg = getAchievementProgress(a.id);
          const bProg = getAchievementProgress(b.id);
          aValue = aProg?.progress || 0;
          bValue = bProg?.progress || 0;
          break;
        default:
          aValue = a.title;
          bValue = b.title;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' 
          ? (aValue < bValue ? -1 : aValue > bValue ? 1 : 0)
          : (bValue < aValue ? -1 : bValue > aValue ? 1 : 0);
      }
    });

    return filtered;
  }, [achievements, userAchievements, filters, searchTerm, sortBy, sortOrder]);

  const handleCardClick = (achievement: Achievement) => {
    if (onAchievementUnlock) {
      onAchievementUnlock(achievement);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const clearFilters = () => {
    setFilters({
      showLocked: true,
      showUnlocked: true
    });
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Achievements suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-n64-blue focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as AchievementSortBy)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-n64-blue focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="category">Kategorie</option>
              <option value="trophyType">Trophäe</option>
              <option value="rarity">Seltenheit</option>
              <option value="xpReward">XP</option>
              <option value="unlockDate">Freischaltungsdatum</option>
              <option value="progress">Fortschritt</option>
            </select>
            <button
              onClick={toggleSortOrder}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-n64-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.showLocked}
                      onChange={(e) => setFilters(prev => ({ ...prev, showLocked: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm">Gesperrt</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.showUnlocked}
                      onChange={(e) => setFilters(prev => ({ ...prev, showUnlocked: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm">Freigeschaltet</span>
                  </label>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as AchievementCategory || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-n64-blue focus:border-transparent"
                >
                  <option value="">Alle Kategorien</option>
                  <option value="game-specific">Spielspezifisch</option>
                  <option value="platform">Plattform</option>
                  <option value="community">Community</option>
                  <option value="collector">Sammlerstücke</option>
                  <option value="recurring">Wiederholte Teilnahme</option>
                  <option value="limited">Limitierte Challenges</option>
                </select>
              </div>

              {/* Trophy Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trophäe</label>
                <select
                  value={filters.trophyType || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, trophyType: e.target.value as TrophyType || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-n64-blue focus:border-transparent"
                >
                  <option value="">Alle Trophäen</option>
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silber</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platin</option>
                </select>
              </div>

              {/* Rarity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seltenheit</label>
                <select
                  value={filters.rarity || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, rarity: e.target.value as AchievementRarity || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-n64-blue focus:border-transparent"
                >
                  <option value="">Alle Seltenheiten</option>
                  <option value="common">Häufig</option>
                  <option value="uncommon">Ungewöhnlich</option>
                  <option value="rare">Selten</option>
                  <option value="epic">Episch</option>
                  <option value="legendary">Legendär</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Filter zurücksetzen
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-white text-center">
        <p className="text-lg">
          {filteredAndSortedAchievements.length} von {achievements.length} Achievements
        </p>
      </div>

      {/* Achievement Grid */}
      <div className="achievement-grid">
        {filteredAndSortedAchievements.map((achievement, index) => {
          const userProgress = getAchievementProgress(achievement.id);
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AchievementCard
                achievement={achievement}
                userProgress={userProgress}
                onCardClick={handleCardClick}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAndSortedAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold text-white mb-2">Keine Achievements gefunden</h3>
          <p className="text-white opacity-75">
            Versuche andere Filtereinstellungen oder Suchbegriffe.
          </p>
        </div>
      )}
    </div>
  );
};

export default AchievementGrid;
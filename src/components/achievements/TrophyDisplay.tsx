'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, TrendingUp, Award } from 'lucide-react';
import { AchievementStats } from '@/types/achievement';
import { TrophyCalculator } from '@/utils/trophyCalculator';

interface TrophyDisplayProps {
  stats: AchievementStats;
}

const TrophyDisplay: React.FC<TrophyDisplayProps> = ({ stats }) => {
  const totalPoints = TrophyCalculator.calculateTotalTrophyPoints(
    stats.recentUnlocks.map(() => ({ id: '', trophyType: 'bronze', xpReward: 0, rules: [], isRepeatable: false, isLimited: false, icon: '', backgroundColor: '', borderColor: '', status: 'locked', isPublic: true, title: '', description: '', category: 'game-specific', rarity: 'common' })),
    stats.recentUnlocks.map(() => ({ achievementId: '', status: 'unlocked' }))
  );
  const trophyLevel = TrophyCalculator.getTrophyLevel(totalPoints);

  const getTrophyColor = (type: string) => {
    switch (type) {
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

  return (
    <div className="space-y-6">
      {/* Trophy Level */}
      <div className="card-retro p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🏆</div>
            <div>
              <h3 className="font-retro text-lg text-gray-800">Trophy Level</h3>
              <p className="text-2xl font-bold text-n64-blue">{trophyLevel.title}</p>
              <p className="text-sm text-gray-600">{totalPoints} Punkte</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-n64-green">{Math.round(stats.completionPercentage)}%</div>
            <div className="text-sm text-gray-600">Vervollständigung</div>
          </div>
        </div>
      </div>

      {/* Trophy Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-retro p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className={`w-8 h-8 ${getTrophyColor('bronze')}`} />
          </div>
          <div className="text-2xl font-bold text-bronze">{stats.byTrophyType.bronze}</div>
          <div className="text-sm text-gray-600">Bronze</div>
        </div>

        <div className="card-retro p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className={`w-8 h-8 ${getTrophyColor('silver')}`} />
          </div>
          <div className="text-2xl font-bold text-silver">{stats.byTrophyType.silver}</div>
          <div className="text-sm text-gray-600">Silber</div>
        </div>

        <div className="card-retro p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className={`w-8 h-8 ${getTrophyColor('gold')}`} />
          </div>
          <div className="text-2xl font-bold text-gold">{stats.byTrophyType.gold}</div>
          <div className="text-sm text-gray-600">Gold</div>
        </div>

        <div className="card-retro p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className={`w-8 h-8 ${getTrophyColor('platinum')}`} />
          </div>
          <div className="text-2xl font-bold text-platinum">{stats.byTrophyType.platinum}</div>
          <div className="text-sm text-gray-600">Platin</div>
        </div>
      </div>

      {/* Category Progress */}
      <div className="card-retro p-6">
        <h3 className="font-retro text-lg text-gray-800 mb-4">Kategorie Fortschritt</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stats.byCategory).map(([category, count]) => {
            const totalInCategory = stats.totalAvailable; // This should be calculated per category
            const percentage = totalInCategory > 0 ? (count / totalInCategory) * 100 : 0;
            
            return (
              <div key={category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{category.replace('-', ' ')}</span>
                  <span className="font-semibold">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-n64-blue to-n64-green h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rarity Breakdown */}
      <div className="card-retro p-6">
        <h3 className="font-retro text-lg text-gray-800 mb-4">Seltenheit Verteilung</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(stats.byRarity).map(([rarity, count]) => (
            <div key={rarity} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className={`w-6 h-6 ${getRarityColor(rarity)}`} />
              </div>
              <div className={`text-xl font-bold ${getRarityColor(rarity)}`}>{count}</div>
              <div className="text-xs text-gray-600 capitalize">{rarity}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Unlocks */}
      {stats.recentUnlocks.length > 0 && (
        <div className="card-retro p-6">
          <h3 className="font-retro text-lg text-gray-800 mb-4">Letzte Freischaltungen</h3>
          <div className="space-y-3">
            {stats.recentUnlocks.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{achievement.title}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${getTrophyColor(achievement.trophyType)}`}>
                    {achievement.trophyType.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-600">+{achievement.xpReward} XP</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Rarest Achievement */}
      {stats.rarestAchievement && (
        <div className="card-retro p-6 border-2 border-yellow-400">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">💎</div>
            <div className="flex-1">
              <h3 className="font-retro text-lg text-gray-800">Seltenstes Achievement</h3>
              <div className="text-xl font-bold text-yellow-600">{stats.rarestAchievement.title}</div>
              <div className="text-sm text-gray-600">{stats.rarestAchievement.description}</div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getRarityColor(stats.rarestAchievement.rarity)}`}>
                {stats.rarestAchievement.rarity.toUpperCase()}
              </div>
              <div className="text-sm text-gray-600">Legendär</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrophyDisplay;
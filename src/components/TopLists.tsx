import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Gem, Crown, Medal, TrendingUp, Eye } from 'lucide-react';
import { User, GalleryItem } from '../types';

interface TopListsProps {
  users: User[];
  items: GalleryItem[];
}

const TopLists: React.FC<TopListsProps> = ({ users, items }) => {
  // Calculate top collectors (by points)
  const topCollectors = [...users]
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  // Calculate merchandise masters (by average rating)
  const merchandiseMasters = [...users]
    .filter(user => user.itemsSubmitted > 0)
    .sort((a, b) => {
      const aItems = items.filter(item => item.uploader.id === a.id);
      const bItems = items.filter(item => item.uploader.id === b.id);
      const aAvg = aItems.reduce((sum, item) => sum + item.rarity, 0) / aItems.length;
      const bAvg = bItems.reduce((sum, item) => sum + item.rarity, 0) / bItems.length;
      return bAvg - aAvg;
    })
    .slice(0, 5);

  // Calculate hidden gems (rare items with few votes but high rating)
  const hiddenGems = [...items]
    .filter(item => item.views < 100 && item.rarity >= 4)
    .sort((a, b) => b.rarity - a.rarity)
    .slice(0, 3);

  const getTitleIcon = (title: string) => {
    switch (title) {
      case 'legendary': return '🏆';
      case 'archivist': return '🎖️';
      case 'collector': return '⭐';
      case 'beginner': return '🌱';
      default: return '🌱';
    }
  };

  const getTitleClass = (title: string) => {
    switch (title) {
      case 'legendary': return 'legendary';
      case 'archivist': return 'archivist';
      case 'collector': return 'collector';
      case 'beginner': return 'beginner';
      default: return 'beginner';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Top 10 Collectors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="n64-card"
      >
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-n64-yellow to-n64-red rounded-lg flex items-center justify-center">
            <Crown size={16} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-white">💎 Top 10 Collectors</h3>
        </div>
        
        <div className="space-y-3">
          {topCollectors.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="flex items-center justify-between p-3 bg-n64-dark/30 rounded-lg hover:bg-n64-purple/20 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-n64-purple to-n64-blue rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <div className="font-n64 text-white text-sm">
                    {user.username}
                  </div>
                  <div className={`text-xs collector-title ${getTitleClass(user.title)}`}>
                    {getTitleIcon(user.title)} {user.title.charAt(0).toUpperCase() + user.title.slice(1)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-n64-yellow">
                  {user.points} pts
                </div>
                <div className="text-xs text-n64-light/60">
                  {user.itemsSubmitted} Items
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Merchandise Masters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="n64-card"
      >
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-n64-green to-n64-blue rounded-lg flex items-center justify-center">
            <Medal size={16} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-white">🧸 Merchandise-Meister</h3>
        </div>
        
        <div className="space-y-3">
          {merchandiseMasters.map((user, index) => {
            const userItems = items.filter(item => item.uploader.id === user.id);
            const avgRating = userItems.reduce((sum, item) => sum + item.rarity, 0) / userItems.length;
            
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-n64-dark/30 rounded-lg hover:bg-n64-purple/20 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-n64-green to-n64-blue rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-n64 text-white text-sm">
                      {user.username}
                    </div>
                    <div className="text-xs text-n64-light/60">
                      {userItems.length} Items
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star size={12} className="text-yellow-400" fill="currentColor" />
                    <span className="text-sm font-bold text-yellow-400">
                      {avgRating.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-xs text-n64-light/60">
                    Ø Bewertung
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Hidden Gems */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="n64-card"
      >
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-n64-purple to-n64-yellow rounded-lg flex items-center justify-center">
            <Gem size={16} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-white">🔍 Hidden Gems</h3>
        </div>
        
        <div className="space-y-3">
          {hiddenGems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-3 bg-n64-dark/30 rounded-lg hover:bg-n64-purple/20 transition-colors duration-200"
            >
              <div className="flex items-start space-x-3">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">
                    {item.title}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <Star size={10} className="text-yellow-400" fill="currentColor" />
                      <span className="text-xs text-yellow-400 font-bold">
                        {item.rarity}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye size={10} className="text-n64-light/60" />
                      <span className="text-xs text-n64-light/60">
                        {item.views}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-n64-light/60 mt-1">
                    von {item.uploader.username}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TopLists;
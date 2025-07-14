import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Grid, 
  List, 
  Search, 
  Filter, 
  SortAsc, 
  Star,
  Gamepad2,
  Trophy,
  Image,
  Calendar,
  User,
  Bookmark,
  Heart
} from 'lucide-react';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { FavoriteType } from '@/types/favorites';

const typeIcons: Record<FavoriteType, React.ComponentType<any>> = {
  game: Gamepad2,
  track: Trophy,
  fanart: Image,
  event: Calendar,
  user: User,
  quiz: Bookmark,
  trade: Heart
};

const typeLabels: Record<FavoriteType, string> = {
  game: 'Spiel',
  track: 'Strecke',
  fanart: 'Fanart',
  event: 'Event',
  user: 'User',
  quiz: 'Quiz',
  trade: 'Tausch'
};

export const FavoritesOverview: React.FC = () => {
  const {
    favorites,
    viewMode,
    sortBy,
    filterType,
    searchQuery,
    setViewMode,
    setSortBy,
    setFilterType,
    setSearchQuery,
    getFilteredFavorites,
    removeFavorite
  } = useFavoritesStore();

  const [showFilters, setShowFilters] = useState(false);

  const filteredFavorites = getFilteredFavorites();

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <Star className="w-16 h-16 text-retro-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-retro-gray-400 mb-2">
          Noch keine Favoriten
        </h3>
        <p className="text-retro-gray-500">
          Füge deine ersten Favoriten hinzu, um sie hier zu sehen!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Meine Favoriten</h2>
          <p className="text-retro-gray-400">
            {filteredFavorites.length} von {favorites.length} Favoriten
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex bg-retro-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' 
                  ? 'bg-n64-purple-500 text-white' 
                  : 'text-retro-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list' 
                  ? 'bg-n64-purple-500 text-white' 
                  : 'text-retro-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-retro-gray-400" />
          <input
            type="text"
            placeholder="Favoriten durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-retro-gray-800 border border-retro-gray-700 rounded-lg text-white placeholder-retro-gray-400 focus:outline-none focus:border-n64-purple-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-3 py-2 bg-retro-gray-800 border border-retro-gray-700 rounded-lg text-retro-gray-300 hover:border-n64-purple-500"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2"
            >
              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FavoriteType | 'all')}
                className="px-3 py-2 bg-retro-gray-800 border border-retro-gray-700 rounded-lg text-white focus:outline-none focus:border-n64-purple-500"
              >
                <option value="all">Alle Typen</option>
                {Object.entries(typeLabels).map(([type, label]) => (
                  <option key={type} value={type}>{label}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-retro-gray-800 border border-retro-gray-700 rounded-lg text-white focus:outline-none focus:border-n64-purple-500"
              >
                <option value="date">Datum</option>
                <option value="name">Name</option>
                <option value="type">Typ</option>
              </select>
            </motion.div>
          )}
        </div>
      </div>

      {/* Favorites Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
      }>
        {filteredFavorites.map((favorite, index) => {
          const Icon = typeIcons[favorite.type];
          
          return (
            <motion.div
              key={favorite.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`retro-card retro-card-hover p-4 ${
                viewMode === 'list' ? 'flex items-center space-x-4' : ''
              }`}
            >
              {viewMode === 'list' && (
                <div className="flex-shrink-0">
                  <img
                    src={favorite.imageUrl}
                    alt={favorite.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`type-badge ${favorite.type}`}>
                      {typeLabels[favorite.type]}
                    </span>
                    <Icon className="w-4 h-4 text-retro-gray-400" />
                  </div>
                  
                  <button
                    onClick={() => removeFavorite(favorite.id)}
                    className="text-retro-gray-400 hover:text-n64-red-500 transition-colors"
                    title="Von Favoriten entfernen"
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {viewMode === 'grid' && favorite.imageUrl && (
                  <div className="mb-3">
                    <img
                      src={favorite.imageUrl}
                      alt={favorite.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                <h4 className="font-bold text-lg mb-2 text-white">{favorite.title}</h4>
                <p className="text-sm text-retro-gray-400 mb-3">
                  {favorite.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {favorite.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-retro-gray-700 text-retro-gray-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Metadata */}
                <div className="text-xs text-retro-gray-500">
                  Hinzugefügt: {new Date(favorite.addedAt).toLocaleDateString('de-DE')}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredFavorites.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-retro-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-retro-gray-400 mb-2">
            Keine Ergebnisse
          </h3>
          <p className="text-retro-gray-500">
            Versuche andere Suchbegriffe oder Filter zu verwenden.
          </p>
        </div>
      )}
    </div>
  );
};
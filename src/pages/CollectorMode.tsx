import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Search, Package, Trophy, TrendingUp, Star, Grid, List, Plus, X, Check } from 'lucide-react';
import { 
  n64Games, 
  N64Game, 
  CollectedGame, 
  getRarityColor, 
  getRarityLabel, 
  getGameValue,
  searchGames,
  filterByRarity,
  filterByGenre,
  getUniqueGenres,
  getCollectorLevel
} from '../data/n64Games';

interface GameModalProps {
  game: N64Game | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCollection: (gameId: string, collectedGame: Omit<CollectedGame, 'gameId' | 'addedDate'>) => void;
  isCollected: boolean;
}

const GameModal: React.FC<GameModalProps> = ({ game, isOpen, onClose, onAddToCollection, isCollected }) => {
  const { t } = useLanguage();
  const [condition, setCondition] = useState<'mint' | 'used'>('used');
  const [hasBox, setHasBox] = useState(false);
  const [hasManual, setHasManual] = useState(false);
  const [hasModule, setHasModule] = useState(true);
  const [notes, setNotes] = useState('');

  if (!isOpen || !game) return null;

  const handleSubmit = () => {
    onAddToCollection(game.id, {
      condition,
      hasBox,
      hasManual,
      hasModule,
      notes: notes.trim() || undefined
    });
    onClose();
  };

  const getCurrentValue = () => {
    const mockCollectedGame: CollectedGame = {
      gameId: game.id,
      condition,
      hasBox,
      hasManual,
      hasModule,
      addedDate: new Date().toISOString()
    };
    return getGameValue(game, mockCollectedGame);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-100">{game.title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${getRarityColor(game.rarity)}`}>
              {getRarityLabel(game.rarity, t)}
            </span>
            <p className="text-slate-400 text-sm mt-1">{game.genre} • {game.releaseYear}</p>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">{t('collection.condition')}</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="condition"
                  value="mint"
                  checked={condition === 'mint'}
                  onChange={(e) => setCondition(e.target.value as 'mint')}
                  className="mr-2"
                />
                <span className="text-slate-300">{t('collection.mint')}</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="condition"
                  value="used"
                  checked={condition === 'used'}
                  onChange={(e) => setCondition(e.target.value as 'used')}
                  className="mr-2"
                />
                <span className="text-slate-300">{t('collection.used')}</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">{t('collection.includedParts')}</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hasModule}
                  onChange={(e) => setHasModule(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-slate-300">{t('collection.module')}</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hasBox}
                  onChange={(e) => setHasBox(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-slate-300">{t('collection.packaging')}</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hasManual}
                  onChange={(e) => setHasManual(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-slate-300">{t('collection.manual')}</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">{t('collection.notesOptional')}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-slate-100"
              rows={3}
                                placeholder={t('placeholder.additionalInfo')}
            />
          </div>

          <div className="bg-slate-700 p-3 rounded">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">{t('collection.estimatedValue')}:</span>
              <span className="text-green-400 font-bold">€{getCurrentValue()}</span>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-600 text-slate-300 rounded hover:bg-slate-500 transition-colors"
            >
              {t('collection.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!hasModule}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
  {isCollected ? t('collection.updateGame') : t('collection.addToCollection')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CollectorMode: React.FC = () => {
  const { t } = useLanguage();
  const [collection, setCollection] = useState<CollectedGame[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedGame, setSelectedGame] = useState<N64Game | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Load collection from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('n64-collection');
    if (saved) {
      try {
        setCollection(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading collection:', error);
      }
    }
  }, []);

  // Save collection to localStorage
  useEffect(() => {
    localStorage.setItem('n64-collection', JSON.stringify(collection));
  }, [collection]);

  // Filter and search games
  const filteredGames = useMemo(() => {
    let filtered = searchGames(n64Games, searchQuery);
    filtered = filterByRarity(filtered, rarityFilter);
    filtered = filterByGenre(filtered, genreFilter);
    return filtered;
  }, [searchQuery, rarityFilter, genreFilter]);

  // Collection statistics
  const stats = useMemo(() => {
    const totalGames = n64Games.length;
    const collectedCount = collection.length;
    const completionPercentage = Math.round((collectedCount / totalGames) * 100);
    
    const totalValue = collection.reduce((sum, collectedGame) => {
      const game = n64Games.find(g => g.id === collectedGame.gameId);
      if (game) {
        return sum + getGameValue(game, collectedGame);
      }
      return sum;
    }, 0);

    const collectorLevel = getCollectorLevel(collectedCount, t);

    return {
      collectedCount,
      totalGames,
      completionPercentage,
      totalValue,
      collectorLevel
    };
  }, [collection]);

  const handleAddToCollection = (gameId: string, gameData: Omit<CollectedGame, 'gameId' | 'addedDate'>) => {
    const newCollectedGame: CollectedGame = {
      ...gameData,
      gameId,
      addedDate: new Date().toISOString()
    };

    setCollection(prev => {
      const existingIndex = prev.findIndex(item => item.gameId === gameId);
      if (existingIndex >= 0) {
        // Update existing
        const updated = [...prev];
        updated[existingIndex] = newCollectedGame;
        return updated;
      } else {
        // Add new
        return [...prev, newCollectedGame];
      }
    });
  };

  const handleRemoveFromCollection = (gameId: string) => {
    setCollection(prev => prev.filter(item => item.gameId !== gameId));
  };

  const isGameCollected = (gameId: string) => {
    return collection.some(item => item.gameId === gameId);
  };

  const openGameModal = (game: N64Game) => {
    setSelectedGame(game);
    setShowModal(true);
  };

  const genres = getUniqueGenres(n64Games);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-100 mb-2">{t('collection.collectorMode')}</h1>
        <p className="text-slate-400">{t('collection.manageCollection')}</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-3">
            <Package className="text-blue-400" size={24} />
            <div>
              <p className="text-slate-400 text-sm">{t('collection.gamesCollected')}</p>
              <p className="text-2xl font-bold text-slate-100">{stats.collectedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-3">
            <TrendingUp className="text-green-400" size={24} />
            <div>
              <p className="text-slate-400 text-sm">{t('collection.completeness')}</p>
              <p className="text-2xl font-bold text-slate-100">{stats.completionPercentage}%</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-3">
            <Trophy className="text-yellow-400" size={24} />
            <div>
              <p className="text-slate-400 text-sm">{t('collection.collectionValue')}</p>
              <p className="text-2xl font-bold text-slate-100">€{stats.totalValue}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-3">
            <Star className="text-purple-400" size={24} />
            <div>
              <p className="text-slate-400 text-sm">{t('collection.collectorLevel')}</p>
                              <p className="text-lg font-bold text-slate-100">{t(stats.collectorLevel.titleKey)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder={t('placeholder.searchGames')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 placeholder-slate-400"
              />
            </div>
          </div>

          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100"
          >
            <option value="all">{t('collection.allRarities')}</option>
            <option value="common">{t('common.common')}</option>
            <option value="uncommon">{t('common.uncommon')}</option>
            <option value="rare">{t('common.rare')}</option>
            <option value="very-rare">{t('common.veryRare')}</option>
            <option value="ultra-rare">{t('common.ultraRare')}</option>
          </select>

          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100"
          >
            <option value="all">{t('collection.allGenres')}</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>

          <div className="flex border border-slate-600 rounded overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Games Grid/List */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
        : 'space-y-2'
      }>
        {filteredGames.map(game => {
          const collected = isGameCollected(game.id);
          const collectedGame = collection.find(c => c.gameId === game.id);
          const currentValue = collectedGame ? getGameValue(game, collectedGame) : 0;

          if (viewMode === 'list') {
            return (
              <div key={game.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-slate-100">{game.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${getRarityColor(game.rarity)}`}>
                      {getRarityLabel(game.rarity, t)}
                    </span>
                    {collected && <Check className="text-green-400" size={16} />}
                  </div>
                  <p className="text-slate-400 text-sm">{game.genre} • {game.releaseYear}</p>
                  {collected && collectedGame && (
                    <p className="text-green-400 text-sm">{t('collection.value')}: €{currentValue}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  {collected ? (
                    <>
                      <button
                        onClick={() => openGameModal(game)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                      >
{t('collection.editGame')}
                      </button>
                      <button
                        onClick={() => handleRemoveFromCollection(game.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                      >
{t('collection.removeGame')}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => openGameModal(game)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                    >
                      <Plus size={16} />
                      <span>{t('collection.addGame')}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div key={game.id} className={`bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors ${collected ? 'ring-2 ring-green-500' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs px-2 py-1 rounded ${getRarityColor(game.rarity)}`}>
                  {getRarityLabel(game.rarity, t)}
                </span>
                {collected && <Check className="text-green-400" size={20} />}
              </div>
              
              <h3 className="font-semibold text-slate-100 mb-1">{game.title}</h3>
              <p className="text-slate-400 text-sm mb-3">{game.genre} • {game.releaseYear}</p>
              
              {collected && collectedGame && (
                <div className="mb-3 p-2 bg-slate-700 rounded">
                  <p className="text-green-400 text-sm font-medium">{t('collection.inCollectionStatus')}</p>
                  <p className="text-slate-300 text-xs">{t('collection.value')}: €{currentValue}</p>
                  <div className="flex space-x-2 text-xs text-slate-400 mt-1">
                    {collectedGame.hasModule && <span>📦 Modul</span>}
                    {collectedGame.hasBox && <span>📄 Box</span>}
                    {collectedGame.hasManual && <span>📖 Anleitung</span>}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                {collected ? (
                  <>
                    <button
                      onClick={() => openGameModal(game)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
{t('collection.editGame')}
                    </button>
                    <button
                      onClick={() => handleRemoveFromCollection(game.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => openGameModal(game)}
                    className="w-full px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Plus size={16} />
                    <span>{t('collection.addGame')}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">{t('collection.noGamesFound')}</p>
        </div>
      )}

      {/* Game Modal */}
      <GameModal
        game={selectedGame}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAddToCollection={handleAddToCollection}
        isCollected={selectedGame ? isGameCollected(selectedGame.id) : false}
      />
    </div>
  );
};

export default CollectorMode;
import React, { useState, useEffect, useMemo } from 'react'
import { Search, Plus, Grid, List, Package, BookOpen, HardDrive, Trophy, Star, Filter, X } from 'lucide-react'
import { CollectionItem, CollectionStats } from '../types'
import { N64Game, n64Games, getTotalN64Games, searchGames, getRarityColor, getRarityBgColor } from '../data/n64Games'
import SimpleCard from '../components/SimpleCard'
import SimpleButton from '../components/SimpleButton'

const CollectorMode: React.FC = () => {
  const [collection, setCollection] = useState<CollectionItem[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRarity, setSelectedRarity] = useState<string>('all')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [showAddGame, setShowAddGame] = useState(false)
  const [selectedGame, setSelectedGame] = useState<N64Game | null>(null)
  const [newGameForm, setNewGameForm] = useState({
    hasBox: false,
    hasManual: false,
    hasModule: true,
    notes: ''
  })

  // Load collection from localStorage on mount
  useEffect(() => {
    const savedCollection = localStorage.getItem('n64-collection')
    if (savedCollection) {
      try {
        const parsed = JSON.parse(savedCollection)
        // Convert date strings back to Date objects
        const collectionWithDates = parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }))
        setCollection(collectionWithDates)
      } catch (error) {
        console.error('Error loading collection:', error)
      }
    }
  }, [])

  // Save collection to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('n64-collection', JSON.stringify(collection))
  }, [collection])

  // Calculate collection statistics
  const stats: CollectionStats = useMemo(() => {
    const totalGames = collection.length
    const totalValue = collection.reduce((sum, item) => {
      const game = n64Games.find(g => g.id === item.gameId)
      if (!game) return sum
      
      let value = 0
      if (item.hasModule) value += game.estimatedValue.module
      if (item.hasBox && item.hasManual) value = game.estimatedValue.complete
      else if (item.hasBox) value = game.estimatedValue.withBox
      
      return sum + value
    }, 0)
    
    const completionPercentage = Math.round((totalGames / getTotalN64Games()) * 100)
    
    // Calculate collector level
    let level = 1
    let levelName = 'Rookie Sammler'
    
    if (totalGames >= 200) {
      level = 10
      levelName = 'N64 Legende'
    } else if (totalGames >= 150) {
      level = 9
      levelName = 'Master Sammler'
    } else if (totalGames >= 100) {
      level = 8
      levelName = 'Elite Sammler'
    } else if (totalGames >= 75) {
      level = 7
      levelName = 'Zelda Meister'
    } else if (totalGames >= 50) {
      level = 6
      levelName = 'Mario Experte'
    } else if (totalGames >= 30) {
      level = 5
      levelName = 'Retro Kenner'
    } else if (totalGames >= 20) {
      level = 4
      levelName = 'Sammler'
    } else if (totalGames >= 10) {
      level = 3
      levelName = 'Enthusiast'
    } else if (totalGames >= 5) {
      level = 2
      levelName = 'Anfänger'
    }
    
    return {
      totalGames,
      totalValue,
      completionPercentage,
      level,
      levelName
    }
  }, [collection])

  // Filter games based on search and filters
  const filteredGames = useMemo(() => {
    let games = n64Games
    
    if (searchTerm) {
      games = searchGames(searchTerm)
    }
    
    if (selectedRarity !== 'all') {
      games = games.filter(game => game.rarity === selectedRarity)
    }
    
    if (selectedGenre !== 'all') {
      games = games.filter(game => game.genre === selectedGenre)
    }
    
    return games
  }, [searchTerm, selectedRarity, selectedGenre])

  // Get unique genres for filter
  const genres = useMemo(() => {
    const uniqueGenres = [...new Set(n64Games.map(game => game.genre))]
    return uniqueGenres.sort()
  }, [])

  const addToCollection = (game: N64Game) => {
    const existingItem = collection.find(item => item.gameId === game.id)
    if (existingItem) {
      return // Game already in collection
    }
    
    const newItem: CollectionItem = {
      gameId: game.id,
      hasBox: newGameForm.hasBox,
      hasManual: newGameForm.hasManual,
      hasModule: newGameForm.hasModule,
      addedAt: new Date(),
      notes: newGameForm.notes.trim() || undefined
    }
    
    setCollection(prev => [...prev, newItem])
    setShowAddGame(false)
    setSelectedGame(null)
    setNewGameForm({
      hasBox: false,
      hasManual: false,
      hasModule: true,
      notes: ''
    })
  }

  const removeFromCollection = (gameId: string) => {
    setCollection(prev => prev.filter(item => item.gameId !== gameId))
  }

  const updateCollectionItem = (gameId: string, updates: Partial<CollectionItem>) => {
    setCollection(prev => prev.map(item => 
      item.gameId === gameId ? { ...item, ...updates } : item
    ))
  }

  const getCollectionItem = (gameId: string) => {
    return collection.find(item => item.gameId === gameId)
  }

  const getGameValue = (game: N64Game, item: CollectionItem) => {
    if (item.hasBox && item.hasManual) return game.estimatedValue.complete
    if (item.hasBox) return game.estimatedValue.withBox
    return game.estimatedValue.module
  }

  const GameCard: React.FC<{ game: N64Game; isInCollection?: boolean }> = ({ game, isInCollection = false }) => {
    const collectionItem = getCollectionItem(game.id)
    const gameValue = collectionItem ? getGameValue(game, collectionItem) : game.estimatedValue.module
    
    return (
      <SimpleCard
        variant="secondary"
        className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
          isInCollection ? 'ring-2 ring-green-500/50' : ''
        }`}
      >
        {/* Game Box Art Placeholder */}
        <div className="aspect-square bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="text-white text-center z-10 p-2">
            <div className="text-xs font-bold mb-1">N64</div>
            <div className="text-sm font-medium leading-tight">{game.title}</div>
          </div>
          {isInCollection && (
            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
              <Package className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Game Info */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-white text-sm leading-tight mb-1">
              {game.title}
            </h3>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{game.genre}</span>
              <span className="text-slate-400">{game.releaseYear}</span>
            </div>
          </div>

          {/* Rarity */}
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRarityBgColor(game.rarity)}`}>
            <Star className={`w-3 h-3 mr-1 ${getRarityColor(game.rarity)}`} />
            <span className={getRarityColor(game.rarity)}>
              {game.rarity.charAt(0).toUpperCase() + game.rarity.slice(1).replace('-', ' ')}
            </span>
          </div>

          {/* Collection Status */}
          {isInCollection && collectionItem && (
            <div className="flex items-center space-x-2 text-xs">
              <div className={`flex items-center ${collectionItem.hasBox ? 'text-green-400' : 'text-slate-500'}`}>
                <Package className="w-3 h-3 mr-1" />
                <span>📦</span>
              </div>
              <div className={`flex items-center ${collectionItem.hasManual ? 'text-green-400' : 'text-slate-500'}`}>
                <BookOpen className="w-3 h-3 mr-1" />
                <span>📘</span>
              </div>
              <div className={`flex items-center ${collectionItem.hasModule ? 'text-green-400' : 'text-slate-500'}`}>
                <HardDrive className="w-3 h-3 mr-1" />
                <span>🟩</span>
              </div>
            </div>
          )}

          {/* Value */}
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">
              {gameValue}€
            </div>
            <div className="text-xs text-slate-400">
              {isInCollection ? 'Sammlungswert' : 'Geschätzt'}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            {isInCollection ? (
              <SimpleButton
                variant="danger"
                size="sm"
                onClick={() => removeFromCollection(game.id)}
                className="flex-1 text-xs"
              >
                Entfernen
              </SimpleButton>
            ) : (
              <SimpleButton
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedGame(game)
                  setShowAddGame(true)
                }}
                className="flex-1 text-xs"
              >
                Hinzufügen
              </SimpleButton>
            )}
          </div>
        </div>
      </SimpleCard>
    )
  }

  const ListGameCard: React.FC<{ game: N64Game; isInCollection?: boolean }> = ({ game, isInCollection = false }) => {
    const collectionItem = getCollectionItem(game.id)
    const gameValue = collectionItem ? getGameValue(game, collectionItem) : game.estimatedValue.module
    
    return (
      <SimpleCard
        variant="secondary"
        className={`transition-all duration-200 hover:shadow-lg ${
          isInCollection ? 'ring-2 ring-green-500/50' : ''
        }`}
      >
        <div className="flex items-center space-x-4">
          {/* Mini Box Art */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <div className="text-white text-center">
              <div className="text-xs font-bold">N64</div>
            </div>
            {isInCollection && (
              <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                <Package className="w-2 h-2" />
              </div>
            )}
          </div>

          {/* Game Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm truncate">
              {game.title}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span>{game.genre}</span>
              <span>•</span>
              <span>{game.releaseYear}</span>
              <span>•</span>
              <span className={getRarityColor(game.rarity)}>
                {game.rarity.charAt(0).toUpperCase() + game.rarity.slice(1).replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Collection Status */}
          {isInCollection && collectionItem && (
            <div className="flex items-center space-x-2 text-xs">
              <span className={collectionItem.hasBox ? 'text-green-400' : 'text-slate-500'}>📦</span>
              <span className={collectionItem.hasManual ? 'text-green-400' : 'text-slate-500'}>📘</span>
              <span className={collectionItem.hasModule ? 'text-green-400' : 'text-slate-500'}>🟩</span>
            </div>
          )}

          {/* Value */}
          <div className="text-right">
            <div className="text-lg font-bold text-yellow-400">
              {gameValue}€
            </div>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0">
            {isInCollection ? (
              <SimpleButton
                variant="danger"
                size="sm"
                onClick={() => removeFromCollection(game.id)}
                className="text-xs"
              >
                Entfernen
              </SimpleButton>
            ) : (
              <SimpleButton
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedGame(game)
                  setShowAddGame(true)
                }}
                className="text-xs"
              >
                Hinzufügen
              </SimpleButton>
            )}
          </div>
        </div>
      </SimpleCard>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎮 Meine N64-Sammlung
          </h1>
          <p className="text-slate-300 text-lg">
            Tracke deine N64-Spiele, vervollständige deine Sammlung und erhalte Sammler-Levels.
          </p>
        </div>

        {/* Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <SimpleCard variant="primary" className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {stats.totalGames}
            </div>
            <div className="text-sm text-slate-300">Spiele gesammelt</div>
          </SimpleCard>
          
          <SimpleCard variant="success" className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {stats.completionPercentage}%
            </div>
            <div className="text-sm text-slate-300">Komplett</div>
          </SimpleCard>
          
          <SimpleCard variant="warning" className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {stats.totalValue}€
            </div>
            <div className="text-sm text-slate-300">Sammlungswert</div>
          </SimpleCard>
          
          <SimpleCard variant="secondary" className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
              <span className="text-2xl font-bold text-white">
                {stats.level}
              </span>
            </div>
            <div className="text-sm text-slate-300">{stats.levelName}</div>
          </SimpleCard>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Spiel suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-2">
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alle Seltenheiten</option>
              <option value="common">Häufig</option>
              <option value="uncommon">Ungewöhnlich</option>
              <option value="rare">Selten</option>
              <option value="very-rare">Sehr selten</option>
              <option value="ultra-rare">Ultra selten</option>
            </select>

            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alle Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-slate-800 border border-slate-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Collection Section */}
        {collection.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Meine Sammlung ({collection.length} Spiele)
            </h2>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {collection.map(item => {
                  const game = n64Games.find(g => g.id === item.gameId)
                  if (!game) return null
                  return (
                    <GameCard key={item.gameId} game={game} isInCollection={true} />
                  )
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {collection.map(item => {
                  const game = n64Games.find(g => g.id === item.gameId)
                  if (!game) return null
                  return (
                    <ListGameCard key={item.gameId} game={game} isInCollection={true} />
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* All Games Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Alle N64-Spiele ({filteredGames.length} von {getTotalN64Games()})
          </h2>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredGames.map(game => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  isInCollection={collection.some(item => item.gameId === game.id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredGames.map(game => (
                <ListGameCard 
                  key={game.id} 
                  game={game} 
                  isInCollection={collection.some(item => item.gameId === game.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add Game Modal */}
        {showAddGame && selectedGame && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  Spiel hinzufügen
                </h3>
                <button
                  onClick={() => {
                    setShowAddGame(false)
                    setSelectedGame(null)
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-white mb-2">
                  {selectedGame.title}
                </h4>
                <p className="text-slate-400 text-sm">
                  {selectedGame.genre} • {selectedGame.releaseYear}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Zustand:
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newGameForm.hasBox}
                        onChange={(e) => setNewGameForm(prev => ({ ...prev, hasBox: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-white">📦 OVP (Originalverpackung)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newGameForm.hasManual}
                        onChange={(e) => setNewGameForm(prev => ({ ...prev, hasManual: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-white">📘 Anleitung</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newGameForm.hasModule}
                        onChange={(e) => setNewGameForm(prev => ({ ...prev, hasModule: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-white">🟩 Modul</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Notizen (optional):
                  </label>
                  <textarea
                    value={newGameForm.notes}
                    onChange={(e) => setNewGameForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Zustand, Besonderheiten, etc."
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-3">
                  <SimpleButton
                    variant="secondary"
                    onClick={() => {
                      setShowAddGame(false)
                      setSelectedGame(null)
                    }}
                    className="flex-1"
                  >
                    Abbrechen
                  </SimpleButton>
                  <SimpleButton
                    variant="primary"
                    onClick={() => addToCollection(selectedGame)}
                    className="flex-1"
                  >
                    Hinzufügen
                  </SimpleButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DSGVO Notice */}
        <div className="mt-8 p-4 bg-slate-800 border border-slate-700 rounded-lg">
          <p className="text-sm text-slate-400 text-center">
            🔒 Deine Sammlung wird nur auf diesem Gerät gespeichert. Keine Daten werden übertragen.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CollectorMode
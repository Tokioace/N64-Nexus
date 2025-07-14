import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Star, Trophy, TrendingUp, Filter } from 'lucide-react'

interface CollectionGame {
  id: string
  name: string
  year: number
  developer: string
  region: string
  coverUrl: string
  rarity: number
  marketPrice: number
  addedDate: string
  verificationStatus: 'scanned' | 'manual'
}

const Collection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'scanned' | 'manual'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'year' | 'rarity' | 'price'>('name')

  // Mock collection data
  const collection: CollectionGame[] = [
    {
      id: '1',
      name: 'Super Mario 64',
      year: 1996,
      developer: 'Nintendo',
      region: 'NTSC',
      coverUrl: '/covers/super-mario-64.jpg',
      rarity: 85,
      marketPrice: 45,
      addedDate: '2024-01-15',
      verificationStatus: 'scanned'
    },
    {
      id: '2',
      name: 'The Legend of Zelda: Ocarina of Time',
      year: 1998,
      developer: 'Nintendo',
      region: 'NTSC',
      coverUrl: '/covers/zelda-ocarina.jpg',
      rarity: 90,
      marketPrice: 60,
      addedDate: '2024-01-10',
      verificationStatus: 'manual'
    },
    {
      id: '3',
      name: 'GoldenEye 007',
      year: 1997,
      developer: 'Rare',
      region: 'PAL',
      coverUrl: '/covers/goldeneye.jpg',
      rarity: 80,
      marketPrice: 35,
      addedDate: '2024-01-20',
      verificationStatus: 'scanned'
    }
  ]

  const filteredCollection = collection.filter(game => {
    if (filter === 'all') return true
    return game.verificationStatus === filter
  })

  const sortedCollection = [...filteredCollection].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'year':
        return a.year - b.year
      case 'rarity':
        return b.rarity - a.rarity
      case 'price':
        return b.marketPrice - a.marketPrice
      default:
        return 0
    }
  })

  const totalValue = collection.reduce((sum, game) => sum + game.marketPrice, 0)
  const averageRarity = collection.reduce((sum, game) => sum + game.rarity, 0) / collection.length
  const scannedCount = collection.filter(game => game.verificationStatus === 'scanned').length

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-pixel text-retro-purple mb-2">
            Meine Sammlung
          </h1>
          <p className="text-retro-light">
            {collection.length} Spiele • Gesamtwert: ~€{totalValue}
          </p>
        </div>
        <Link
          to="/scanner"
          className="retro-button flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Spiel scannen</span>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="retro-card text-center">
          <Trophy size={32} className="text-retro-yellow mx-auto mb-2" />
          <div className="text-2xl font-pixel text-retro-purple">{collection.length}</div>
          <div className="text-retro-light text-sm">Spiele</div>
        </div>
        
        <div className="retro-card text-center">
          <TrendingUp size={32} className="text-retro-green mx-auto mb-2" />
          <div className="text-2xl font-pixel text-retro-purple">€{totalValue}</div>
          <div className="text-retro-light text-sm">Gesamtwert</div>
        </div>
        
        <div className="retro-card text-center">
          <Star size={32} className="text-retro-yellow mx-auto mb-2" />
          <div className="text-2xl font-pixel text-retro-purple">{Math.round(averageRarity)}</div>
          <div className="text-retro-light text-sm">Ø Seltenheit</div>
        </div>
        
        <div className="retro-card text-center">
          <Trophy size={32} className="text-retro-green mx-auto mb-2" />
          <div className="text-2xl font-pixel text-retro-purple">{scannedCount}</div>
          <div className="text-retro-light text-sm">Verifiziert</div>
        </div>
      </div>

      {/* Filters */}
      <div className="retro-card mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <span className="text-retro-light font-retro">Filter:</span>
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'Alle' },
                { key: 'scanned', label: 'Verifiziert' },
                { key: 'manual', label: 'Manuell' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-3 py-1 rounded border-2 transition-all ${
                    filter === key
                      ? 'border-retro-green bg-retro-green bg-opacity-20 text-retro-green'
                      : 'border-retro-gray text-retro-light hover:border-retro-purple'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-retro-light font-retro">Sortieren:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-retro-dark border border-retro-purple text-retro-light px-3 py-1 rounded"
            >
              <option value="name">Name</option>
              <option value="year">Jahr</option>
              <option value="rarity">Seltenheit</option>
              <option value="price">Preis</option>
            </select>
          </div>
        </div>
      </div>

      {/* Collection Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCollection.map((game) => (
          <div key={game.id} className="retro-card hover:border-retro-yellow transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-pixel text-retro-yellow mb-1">{game.name}</h3>
                <p className="text-retro-light text-sm">{game.year} • {game.developer}</p>
              </div>
              <div className="flex items-center space-x-1">
                {game.verificationStatus === 'scanned' ? (
                  <Star size={16} className="text-retro-green" title="Verifiziert durch Scan" />
                ) : (
                  <Trophy size={16} className="text-retro-yellow" title="Manuell hinzugefügt" />
                )}
              </div>
            </div>
            
            <div className="w-full h-32 bg-retro-gray border border-retro-purple rounded-lg mb-4 flex items-center justify-center">
              <span className="text-retro-light font-retro text-sm">Cover</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-retro-light">Region:</span>
                <span className="font-retro text-retro-yellow">{game.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-retro-light">Seltenheit:</span>
                <span className="font-retro text-retro-purple">{game.rarity}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-retro-light">Wert:</span>
                <span className="font-retro text-retro-green">€{game.marketPrice}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedCollection.length === 0 && (
        <div className="text-center py-12">
          <Trophy size={64} className="text-retro-gray mx-auto mb-4" />
          <h3 className="text-xl font-pixel text-retro-gray mb-2">Keine Spiele gefunden</h3>
          <p className="text-retro-light mb-6">
            {filter === 'all' 
              ? 'Deine Sammlung ist noch leer. Scanne dein erstes Spiel!'
              : 'Keine Spiele mit diesem Filter gefunden.'
            }
          </p>
          {filter === 'all' && (
            <Link to="/scanner" className="retro-button">
              <Plus size={20} className="mr-2" />
              Erstes Spiel scannen
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default Collection
import React from 'react'
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react'
import { HIGHLIGHT_TYPES, PRIVACY_LEVELS } from '../context/HighlightContext'

function FilterBar({ 
  filters, 
  sortBy, 
  sortOrder, 
  uniqueGames, 
  onFiltersChange, 
  onSortChange 
}) {
  const handleFilterChange = (key, value) => {
    onFiltersChange({ [key]: value })
  }

  const handleSortChange = (newSortBy) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'asc' ? 'desc' : 'asc'
    onSortChange(newSortBy, newSortOrder)
  }

  const clearFilters = () => {
    onFiltersChange({
      type: 'all',
      game: 'all',
      privacy: 'all',
      search: ''
    })
  }

  const hasActiveFilters = filters.type !== 'all' || 
                          filters.game !== 'all' || 
                          filters.privacy !== 'all' || 
                          filters.search

  return (
    <div className="retro-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-retro text-white flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filter & Sortierung
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-pixel text-retro-gray hover:text-white transition-colors duration-300"
          >
            Filter zurücksetzen
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-xs font-pixel text-retro-gray mb-2">
            Suche
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-retro-gray" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Titel, Beschreibung, Spiel..."
              className="w-full pl-10 pr-4 py-2 bg-retro-dark border border-pixel-border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple transition-colors duration-300"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-xs font-pixel text-retro-gray mb-2">
            Typ
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-4 py-2 bg-retro-dark border border-pixel-border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple transition-colors duration-300"
          >
            <option value="all">Alle Typen</option>
            <option value={HIGHLIGHT_TYPES.BEST_GAME}>Beste Spielrunde</option>
            <option value={HIGHLIGHT_TYPES.FANART}>Fanart</option>
            <option value={HIGHLIGHT_TYPES.TROPHY}>Trophäe</option>
            <option value={HIGHLIGHT_TYPES.LIVESTREAM}>Livestream</option>
            <option value={HIGHLIGHT_TYPES.SEASON_MILESTONE}>Saison-Meilenstein</option>
          </select>
        </div>

        {/* Game Filter */}
        <div>
          <label className="block text-xs font-pixel text-retro-gray mb-2">
            Spiel
          </label>
          <select
            value={filters.game}
            onChange={(e) => handleFilterChange('game', e.target.value)}
            className="w-full px-4 py-2 bg-retro-dark border border-pixel-border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple transition-colors duration-300"
          >
            <option value="all">Alle Spiele</option>
            {uniqueGames.map(game => (
              <option key={game} value={game}>{game}</option>
            ))}
          </select>
        </div>

        {/* Privacy Filter */}
        <div>
          <label className="block text-xs font-pixel text-retro-gray mb-2">
            Sichtbarkeit
          </label>
          <select
            value={filters.privacy}
            onChange={(e) => handleFilterChange('privacy', e.target.value)}
            className="w-full px-4 py-2 bg-retro-dark border border-pixel-border rounded-lg text-white font-pixel text-sm focus:outline-none focus:border-retro-purple transition-colors duration-300"
          >
            <option value="all">Alle</option>
            <option value={PRIVACY_LEVELS.PUBLIC}>Öffentlich</option>
            <option value={PRIVACY_LEVELS.FRIENDS}>Nur Freunde</option>
            <option value={PRIVACY_LEVELS.PRIVATE}>Privat</option>
          </select>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center space-x-4">
        <span className="text-xs font-pixel text-retro-gray">Sortierung:</span>
        
        <button
          onClick={() => handleSortChange('date')}
          className={`flex items-center space-x-1 px-3 py-1 rounded transition-all duration-300 ${
            sortBy === 'date'
              ? 'bg-retro-purple text-white'
              : 'text-retro-gray hover:text-white hover:bg-retro-dark'
          }`}
        >
          <span className="text-xs font-pixel">Datum</span>
          {sortBy === 'date' && (
            sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
          )}
        </button>

        <button
          onClick={() => handleSortChange('title')}
          className={`flex items-center space-x-1 px-3 py-1 rounded transition-all duration-300 ${
            sortBy === 'title'
              ? 'bg-retro-purple text-white'
              : 'text-retro-gray hover:text-white hover:bg-retro-dark'
          }`}
        >
          <span className="text-xs font-pixel">Titel</span>
          {sortBy === 'title' && (
            sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
          )}
        </button>

        <button
          onClick={() => handleSortChange('game')}
          className={`flex items-center space-x-1 px-3 py-1 rounded transition-all duration-300 ${
            sortBy === 'game'
              ? 'bg-retro-purple text-white'
              : 'text-retro-gray hover:text-white hover:bg-retro-dark'
          }`}
        >
          <span className="text-xs font-pixel">Spiel</span>
          {sortBy === 'game' && (
            sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
          )}
        </button>

        <button
          onClick={() => handleSortChange('type')}
          className={`flex items-center space-x-1 px-3 py-1 rounded transition-all duration-300 ${
            sortBy === 'type'
              ? 'bg-retro-purple text-white'
              : 'text-retro-gray hover:text-white hover:bg-retro-dark'
          }`}
        >
          <span className="text-xs font-pixel">Typ</span>
          {sortBy === 'type' && (
            sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
          )}
        </button>
      </div>
    </div>
  )
}

export default FilterBar
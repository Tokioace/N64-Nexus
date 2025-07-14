import React, { useState, useMemo } from 'react'
import { useHighlights, HIGHLIGHT_TYPES } from '../context/HighlightContext'
import HighlightCard from './HighlightCard'
import FilterBar from './FilterBar'
import AddHighlightModal from './AddHighlightModal'
import { Plus, Grid, List, Filter, Trophy } from 'lucide-react'

function HighlightArchive() {
  const { 
    highlights, 
    filters, 
    sortBy, 
    sortOrder, 
    setFilters, 
    setSort,
    userPlan,
    maxHighlights,
    addHighlight 
  } = useHighlights()
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort highlights
  const filteredAndSortedHighlights = useMemo(() => {
    let filtered = highlights.filter(highlight => {
      // Type filter
      if (filters.type !== 'all' && highlight.type !== filters.type) return false
      
      // Game filter
      if (filters.game !== 'all' && highlight.game !== filters.game) return false
      
      // Privacy filter
      if (filters.privacy !== 'all' && highlight.privacy !== filters.privacy) return false
      
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          highlight.title.toLowerCase().includes(searchLower) ||
          highlight.description.toLowerCase().includes(searchLower) ||
          highlight.game.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }
      
      return true
    })

    // Sort highlights
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date)
          bValue = new Date(b.date)
          break
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'game':
          aValue = a.game.toLowerCase()
          bValue = b.game.toLowerCase()
          break
        case 'type':
          aValue = a.type
          bValue = b.type
          break
        default:
          aValue = new Date(a.date)
          bValue = new Date(b.date)
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [highlights, filters, sortBy, sortOrder])

  // Get unique games for filter
  const uniqueGames = useMemo(() => {
    const games = [...new Set(highlights.map(h => h.game))]
    return games.sort()
  }, [highlights])

  const handleAddHighlight = (highlightData) => {
    try {
      addHighlight(highlightData)
      setShowAddModal(false)
    } catch (error) {
      alert(error.message)
    }
  }

  const pinnedHighlight = highlights.find(h => h.isPinned)
  const displayHighlights = filteredAndSortedHighlights.filter(h => !h.isPinned)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-retro text-white text-shadow mb-2">
            Meine Highlights
          </h1>
          <p className="text-retro-gray font-pixel">
            {filteredAndSortedHighlights.length} von {highlights.length} Highlights
            {userPlan === 'free' && ` (${highlights.length}/${maxHighlights} kostenlos)`}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              showFilters 
                ? 'bg-retro-purple text-white' 
                : 'text-retro-gray hover:text-white hover:bg-retro-dark'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
          
          {/* View Mode Toggle */}
          <div className="flex bg-retro-dark rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-all duration-300 ${
                viewMode === 'grid' 
                  ? 'bg-retro-purple text-white' 
                  : 'text-retro-gray hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-all duration-300 ${
                viewMode === 'list' 
                  ? 'bg-retro-purple text-white' 
                  : 'text-retro-gray hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          {/* Add Highlight Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-retro-purple to-retro-blue text-white px-4 py-2 rounded-lg hover:from-retro-blue hover:to-retro-purple transition-all duration-300 font-pixel"
          >
            <Plus className="w-4 h-4" />
            <span>Highlight hinzufügen</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <FilterBar
          filters={filters}
          sortBy={sortBy}
          sortOrder={sortOrder}
          uniqueGames={uniqueGames}
          onFiltersChange={setFilters}
          onSortChange={setSort}
        />
      )}

      {/* Pinned Highlight */}
      {pinnedHighlight && (
        <div className="mb-8">
          <h2 className="text-xl font-retro text-retro-yellow mb-4 flex items-center">
            📌 Angepinntes Highlight
          </h2>
          <div className="max-w-2xl">
            <HighlightCard 
              highlight={pinnedHighlight} 
              viewMode="featured"
            />
          </div>
        </div>
      )}

      {/* Highlights Grid/List */}
      {displayHighlights.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {displayHighlights.map(highlight => (
            <HighlightCard 
              key={highlight.id} 
              highlight={highlight} 
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-retro-dark rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-12 h-12 text-retro-gray" />
          </div>
          <h3 className="text-xl font-retro text-retro-gray mb-2">
            Keine Highlights gefunden
          </h3>
          <p className="text-retro-gray font-pixel">
            {filters.search || filters.type !== 'all' || filters.game !== 'all'
              ? 'Versuche andere Filter-Einstellungen'
              : 'Füge dein erstes Highlight hinzu!'
            }
          </p>
        </div>
      )}

      {/* Add Highlight Modal */}
      {showAddModal && (
        <AddHighlightModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddHighlight}
          userPlan={userPlan}
          currentCount={highlights.length}
          maxCount={maxHighlights}
        />
      )}
    </div>
  )
}

export default HighlightArchive
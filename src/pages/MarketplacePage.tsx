import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useMarketplace } from '../contexts/MarketplaceContext'
import { useChat } from '../contexts/ChatContext'
import { useUser } from '../contexts/UserContext'
import { 
  Search, 
  Filter, 
  SortAsc, 
  Plus, 
  Eye, 
  Heart, 
  MessageCircle, 
  Star,
  MapPin,
  Calendar,
  Package,
  Truck,
  Euro,
  ChevronDown,
  X,
  Grid,
  List
} from 'lucide-react'
import { MarketplaceListing, MarketplaceFilter, MarketplaceSort } from '../types'
import { N64_GAMES } from '../contexts/MarketplaceContext'

const MarketplacePage: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useUser()
  const { 
    listings, 
    myListings, 
    watchedListings, 
    filters, 
    sort, 
    isLoading, 
    setFilters, 
    setSort, 
    clearFilters,
    watchListing,
    unwatchListing,
    getListing
  } = useMarketplace()
  const { createConversation } = useChat()

  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showCreateListing, setShowCreateListing] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTab, setSelectedTab] = useState<'all' | 'my' | 'watched'>('all')
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null)

  // Filter state
  const [localFilters, setLocalFilters] = useState<MarketplaceFilter>(filters)
  const [priceMin, setPriceMin] = useState<string>('')
  const [priceMax, setPriceMax] = useState<string>('')

  const getCurrentListings = () => {
    switch (selectedTab) {
      case 'my':
        return myListings
      case 'watched':
        return watchedListings
      default:
        return listings
    }
  }

  const filteredListings = getCurrentListings().filter(listing =>
    listing.gameName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleContactSeller = async (listing: MarketplaceListing) => {
    if (!user || listing.sellerId === user.id) return
    
    const conversationId = await createConversation([listing.sellerId], listing.id)
    if (conversationId) {
      // Navigate to chat - in a real app this would use router
      console.log('Opening chat with seller:', listing.sellerName)
    }
  }

  const handleWatchListing = async (listingId: string) => {
    const listing = listings.find(l => l.id === listingId)
    if (!listing) return

    if (listing.watchedBy.includes(user?.id || '')) {
      await unwatchListing(listingId)
    } else {
      await watchListing(listingId)
    }
  }

  const handleApplyFilters = () => {
    const newFilters: MarketplaceFilter = {
      ...localFilters,
      priceRange: priceMin && priceMax ? {
        min: parseFloat(priceMin),
        max: parseFloat(priceMax)
      } : undefined
    }
    setFilters(newFilters)
    setShowFilters(false)
  }

  const handleClearFilters = () => {
    setLocalFilters({})
    setPriceMin('')
    setPriceMax('')
    clearFilters()
    setShowFilters(false)
  }

  const formatPrice = (price: number, currency: string) => {
    const symbol = t(`currency.${currency}`)
    return `${symbol}${price.toFixed(2)}`
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString()
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'mint': return 'text-green-400'
      case 'very-good': return 'text-blue-400'
      case 'good': return 'text-yellow-400'
      case 'fair': return 'text-orange-400'
      case 'poor': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const ListingCard: React.FC<{ listing: MarketplaceListing }> = ({ listing }) => {
    const isWatched = listing.watchedBy.includes(user?.id || '')
    const isOwner = listing.sellerId === user?.id

    return (
      <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors border border-gray-700">
        {/* Game Image Placeholder */}
        <div className="w-full h-48 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
          <Package className="w-16 h-16 text-gray-500" />
        </div>

        {/* Game Info */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-white mb-1">{listing.gameName}</h3>
          <p className="text-sm text-gray-400 mb-2">{listing.platform} • {listing.region}</p>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-cyan-400">
              {formatPrice(listing.price, listing.currency)}
            </span>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${getConditionColor(listing.condition)}`}>
                {t(`condition.${listing.condition}`)}
              </span>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-400 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            {listing.location}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {listing.views} {t('listing.views').toLowerCase()}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(listing.createdAt)}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">
          {listing.description}
        </p>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {!isOwner && (
            <>
              <button
                onClick={() => handleContactSeller(listing)}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                {t('listing.contactSeller')}
              </button>
              <button
                onClick={() => handleWatchListing(listing.id)}
                className={`p-2 rounded-lg transition-colors ${
                  isWatched 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWatched ? 'fill-current' : ''}`} />
              </button>
            </>
          )}
          {isOwner && (
            <div className="flex-1 text-center text-sm text-gray-400">
              {t('listing.seller')}: {t('common.you')}
            </div>
          )}
        </div>
      </div>
    )
  }

  const FilterPanel: React.FC = () => (
    <div className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 rounded-lg mt-2 p-4 z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Game Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('createListing.selectGame')}
          </label>
          <select
            value={localFilters.gameId || ''}
            onChange={(e) => setLocalFilters({...localFilters, gameId: e.target.value || undefined})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="">{t('filter.allGames')}</option>
            {N64_GAMES.map(game => (
              <option key={game.id} value={game.id}>{game.name}</option>
            ))}
          </select>
        </div>

        {/* Condition Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('listing.condition')}
          </label>
          <select
            value={localFilters.condition?.[0] || ''}
            onChange={(e) => setLocalFilters({
              ...localFilters, 
              condition: e.target.value ? [e.target.value] : undefined
            })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="">{t('filter.allConditions')}</option>
            <option value="mint">{t('condition.mint')}</option>
            <option value="very-good">{t('condition.very-good')}</option>
            <option value="good">{t('condition.good')}</option>
            <option value="fair">{t('condition.fair')}</option>
            <option value="poor">{t('condition.poor')}</option>
          </select>
        </div>

        {/* Region Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('listing.region')}
          </label>
          <select
            value={localFilters.region?.[0] || ''}
            onChange={(e) => setLocalFilters({
              ...localFilters, 
              region: e.target.value ? [e.target.value] : undefined
            })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="">{t('filter.allRegions')}</option>
            <option value="PAL">PAL</option>
            <option value="NTSC">NTSC</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('filter.priceRange')}
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            />
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('filter.location')}
          </label>
          <input
            type="text"
            placeholder={t('filter.location')}
            value={localFilters.location || ''}
            onChange={(e) => setLocalFilters({...localFilters, location: e.target.value || undefined})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-gray-700">
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          {t('filter.clear')}
        </button>
        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
        >
          {t('filter.apply')}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{t('marketplace.title')}</h1>
              <p className="text-gray-400 mt-1">{t('marketplace.subtitle')}</p>
            </div>
            <button
              onClick={() => setShowCreateListing(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t('marketplace.createListing')}
            </button>
          </div>

          {/* Search and Controls */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('marketplace.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Filters */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <Filter className="w-5 h-5 mr-2" />
                {t('marketplace.filters')}
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
              {showFilters && <FilterPanel />}
            </div>

            {/* Sort */}
            <select
              value={`${sort.field}-${sort.direction}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-') as [any, 'asc' | 'desc']
                setSort({ field, direction })
              }}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="createdAt-desc">{t('sort.newestFirst')}</option>
              <option value="createdAt-asc">{t('sort.oldestFirst')}</option>
              <option value="price-asc">{t('sort.priceAsc')}</option>
              <option value="price-desc">{t('sort.priceDesc')}</option>
              <option value="views-desc">{t('sort.mostViewed')}</option>
              <option value="views-asc">{t('sort.leastViewed')}</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-6 mt-4">
            <button
              onClick={() => setSelectedTab('all')}
              className={`pb-2 border-b-2 transition-colors ${
                selectedTab === 'all' 
                  ? 'border-cyan-500 text-cyan-400' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {t('filter.allGames')} ({listings.length})
            </button>
            <button
              onClick={() => setSelectedTab('my')}
              className={`pb-2 border-b-2 transition-colors ${
                selectedTab === 'my' 
                  ? 'border-cyan-500 text-cyan-400' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {t('marketplace.myListings')} ({myListings.length})
            </button>
            <button
              onClick={() => setSelectedTab('watched')}
              className={`pb-2 border-b-2 transition-colors ${
                selectedTab === 'watched' 
                  ? 'border-cyan-500 text-cyan-400' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {t('marketplace.watchedListings')} ({watchedListings.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-400">{t('marketplace.loadingListings')}</div>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {t('marketplace.noListings')}
            </h3>
            <p className="text-gray-500">
              {selectedTab === 'all' 
                ? t('marketplace.subtitle')
                : selectedTab === 'my'
                ? t('marketplace.createListing')
                : t('marketplace.watchedListings')
              }
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MarketplacePage
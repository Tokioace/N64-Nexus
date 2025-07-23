import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { MarketplaceListing, MarketplaceContextType, MarketplaceFilter, MarketplaceSort, ShippingOption } from '../types'
import { useUser } from './UserContext'

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined)

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext)
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider')
  }
  return context
}

// Mock N64 games data
const N64_GAMES = [
  { id: 'mario64', name: 'Super Mario 64' },
  { id: 'mariokart64', name: 'Mario Kart 64' },
  { id: 'zelda_oot', name: 'The Legend of Zelda: Ocarina of Time' },
  { id: 'zelda_mm', name: 'The Legend of Zelda: Majora\'s Mask' },
  { id: 'smash_bros', name: 'Super Smash Bros.' },
  { id: 'mario_party', name: 'Mario Party' },
  { id: 'mario_party_2', name: 'Mario Party 2' },
  { id: 'mario_party_3', name: 'Mario Party 3' },
  { id: 'goldeneye', name: 'GoldenEye 007' },
  { id: 'perfect_dark', name: 'Perfect Dark' },
  { id: 'donkey_kong_64', name: 'Donkey Kong 64' },
  { id: 'banjo_kazooie', name: 'Banjo-Kazooie' },
  { id: 'banjo_tooie', name: 'Banjo-Tooie' },
  { id: 'paper_mario', name: 'Paper Mario' },
  { id: 'star_fox_64', name: 'Star Fox 64' },
  { id: 'f_zero_x', name: 'F-Zero X' },
  { id: 'wave_race_64', name: 'Wave Race 64' },
  { id: 'pilot_wings_64', name: 'Pilotwings 64' },
  { id: 'mario_tennis', name: 'Mario Tennis' },
  { id: 'mario_golf', name: 'Mario Golf' },
  { id: 'pokemon_stadium', name: 'Pokémon Stadium' },
  { id: 'pokemon_stadium_2', name: 'Pokémon Stadium 2' },
  { id: 'diddy_kong_racing', name: 'Diddy Kong Racing' },
  { id: 'yoshi_story', name: 'Yoshi\'s Story' },
  { id: 'kirby_64', name: 'Kirby 64: The Crystal Shards' }
]

// Mock shipping options
const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'standard', name: 'Standard Shipping', price: 4.99, estimatedDays: 5 },
  { id: 'express', name: 'Express Shipping', price: 9.99, estimatedDays: 2 },
  { id: 'overnight', name: 'Overnight Shipping', price: 19.99, estimatedDays: 1 },
  { id: 'pickup', name: 'Local Pickup', price: 0, estimatedDays: 0 }
]

// Mock marketplace listings
const mockListings: MarketplaceListing[] = [
  {
    id: '1',
    sellerId: '2',
    sellerName: 'N64Collector',
    gameId: 'mario64',
    gameName: 'Super Mario 64',
    platform: 'N64',
    region: 'PAL',
    condition: 'mint',
    completeness: 'complete',
    price: 89.99,
    currency: 'EUR',
    description: 'Perfekter Zustand! Originalverpackung mit Anleitung. Wurde kaum gespielt und sorgfältig aufbewahrt.',
    images: ['/images/mario64_1.jpg', '/images/mario64_2.jpg'],
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
    status: 'active',
    location: 'Berlin, Deutschland',
    shippingOptions: SHIPPING_OPTIONS.slice(0, 3),
    tags: ['mario', 'platform', 'classic'],
    views: 45,
    watchedBy: ['1', '3']
  },
  {
    id: '2',
    sellerId: '3',
    sellerName: 'RetroGaming_Fan',
    gameId: 'zelda_oot',
    gameName: 'The Legend of Zelda: Ocarina of Time',
    platform: 'N64',
    region: 'NTSC',
    condition: 'very-good',
    completeness: 'complete',
    price: 75.00,
    currency: 'EUR',
    description: 'Sehr guter Zustand. Kleine Gebrauchsspuren an der Hülle, Spiel funktioniert einwandfrei.',
    images: ['/images/zelda_oot_1.jpg'],
    createdAt: new Date('2025-01-14'),
    updatedAt: new Date('2025-01-14'),
    status: 'active',
    location: 'München, Deutschland',
    shippingOptions: SHIPPING_OPTIONS,
    tags: ['zelda', 'adventure', 'rpg'],
    views: 32,
    watchedBy: ['1']
  },
  {
    id: '3',
    sellerId: '1',
    sellerName: 'RetroGamer64',
    gameId: 'mariokart64',
    gameName: 'Mario Kart 64',
    platform: 'N64',
    region: 'PAL',
    condition: 'good',
    completeness: 'cart-only',
    price: 35.00,
    currency: 'EUR',
    description: 'Nur die Cartridge, funktioniert perfekt. Ideal für Sammler die bereits eine Hülle haben.',
    images: ['/images/mariokart64_1.jpg'],
    createdAt: new Date('2025-01-13'),
    updatedAt: new Date('2025-01-13'),
    status: 'active',
    location: 'Hamburg, Deutschland',
    shippingOptions: SHIPPING_OPTIONS.slice(0, 2),
    tags: ['mario', 'racing', 'multiplayer'],
    views: 28,
    watchedBy: ['2']
  },
  {
    id: '4',
    sellerId: '4',
    sellerName: 'GoldenEye_Master',
    gameId: 'goldeneye',
    gameName: 'GoldenEye 007',
    platform: 'N64',
    region: 'PAL',
    condition: 'very-good',
    completeness: 'complete',
    price: 45.00,
    currency: 'EUR',
    description: 'Klassiker in sehr gutem Zustand! Perfekt für Multiplayer-Sessions mit Freunden.',
    images: ['/images/goldeneye_1.jpg', '/images/goldeneye_2.jpg'],
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-12'),
    status: 'active',
    location: 'Köln, Deutschland',
    shippingOptions: SHIPPING_OPTIONS,
    tags: ['fps', 'multiplayer', 'action'],
    views: 67,
    watchedBy: ['1', '2', '3']
  },
  {
    id: '5',
    sellerId: '5',
    sellerName: 'SmashBros_Pro',
    gameId: 'smash_bros',
    gameName: 'Super Smash Bros.',
    platform: 'N64',
    region: 'NTSC',
    condition: 'mint',
    completeness: 'complete',
    price: 95.00,
    currency: 'EUR',
    description: 'Mint condition! Originalverpackung versiegelt. Sammlerstück für echte Fans.',
    images: ['/images/smash_bros_1.jpg'],
    createdAt: new Date('2025-01-11'),
    updatedAt: new Date('2025-01-11'),
    status: 'active',
    location: 'Frankfurt, Deutschland',
    shippingOptions: SHIPPING_OPTIONS.slice(1, 4),
    tags: ['fighting', 'nintendo', 'multiplayer'],
    views: 89,
    watchedBy: ['1', '2', '3', '4']
  }
]

interface MarketplaceProviderProps {
  children: ReactNode
}

export const MarketplaceProvider: React.FC<MarketplaceProviderProps> = ({ children }) => {
  const { user } = useUser()
  const [listings, setListings] = useState<MarketplaceListing[]>(mockListings)
  const [filters, setFiltersState] = useState<MarketplaceFilter>({})
  const [sort, setSortState] = useState<MarketplaceSort>({ field: 'createdAt', direction: 'desc' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Computed values
  const myListings = listings.filter(listing => listing.sellerId === user?.id)
  const watchedListings = listings.filter(listing => 
    user?.id && listing.watchedBy.includes(user.id)
  )

  // Helper function to generate unique IDs
  const generateId = () => Math.random().toString(36).substr(2, 9)

  // Filter and sort listings
  const getFilteredAndSortedListings = (
    allListings: MarketplaceListing[],
    currentFilters: MarketplaceFilter,
    currentSort: MarketplaceSort
  ): MarketplaceListing[] => {
    let filtered = [...allListings]

    // Apply filters
    if (currentFilters.gameId) {
      filtered = filtered.filter(listing => listing.gameId === currentFilters.gameId)
    }
    if (currentFilters.condition && currentFilters.condition.length > 0) {
      filtered = filtered.filter(listing => currentFilters.condition!.includes(listing.condition))
    }
    if (currentFilters.completeness && currentFilters.completeness.length > 0) {
      filtered = filtered.filter(listing => currentFilters.completeness!.includes(listing.completeness))
    }
    if (currentFilters.priceRange) {
      filtered = filtered.filter(listing => 
        listing.price >= currentFilters.priceRange!.min && 
        listing.price <= currentFilters.priceRange!.max
      )
    }
    if (currentFilters.region && currentFilters.region.length > 0) {
      filtered = filtered.filter(listing => currentFilters.region!.includes(listing.region))
    }
    if (currentFilters.location) {
      filtered = filtered.filter(listing => 
        listing.location.toLowerCase().includes(currentFilters.location!.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      switch (currentSort.field) {
        case 'price':
          comparison = a.price - b.price
          break
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime()
          break
        case 'views':
          comparison = a.views - b.views
          break
        case 'sellerRating':
          // Mock seller rating - in real app would come from user ratings
          comparison = 0
          break
        default:
          comparison = 0
      }
      return currentSort.direction === 'asc' ? comparison : -comparison
    })

    return filtered
  }

  const createListing = async (
    listingData: Omit<MarketplaceListing, 'id' | 'sellerId' | 'sellerName' | 'createdAt' | 'updatedAt' | 'views' | 'watchedBy'>
  ): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)
    setError(null)

    try {
      const newListing: MarketplaceListing = {
        ...listingData,
        id: generateId(),
        sellerId: user.id,
        sellerName: user.username,
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        watchedBy: []
      }

      setListings(prev => [newListing, ...prev])
      return true
    } catch (err) {
      setError('Failed to create listing')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updateListing = async (listingId: string, updates: Partial<MarketplaceListing>): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)
    setError(null)

    try {
      setListings(prev => prev.map(listing => {
        if (listing.id === listingId && listing.sellerId === user.id) {
          return {
            ...listing,
            ...updates,
            updatedAt: new Date()
          }
        }
        return listing
      }))
      return true
    } catch (err) {
      setError('Failed to update listing')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const deleteListing = async (listingId: string): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)
    setError(null)

    try {
      setListings(prev => prev.filter(listing => 
        !(listing.id === listingId && listing.sellerId === user.id)
      ))
      return true
    } catch (err) {
      setError('Failed to delete listing')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const getListing = async (listingId: string): Promise<MarketplaceListing | null> => {
    const listing = listings.find(l => l.id === listingId)
    if (listing) {
      // Increment view count
      setListings(prev => prev.map(l => 
        l.id === listingId ? { ...l, views: l.views + 1 } : l
      ))
    }
    return listing || null
  }

  const getListings = async (
    currentFilters?: MarketplaceFilter, 
    currentSort?: MarketplaceSort
  ): Promise<MarketplaceListing[]> => {
    const activeFilters = currentFilters || filters
    const activeSort = currentSort || sort
    return getFilteredAndSortedListings(listings, activeFilters, activeSort)
  }

  const watchListing = async (listingId: string): Promise<boolean> => {
    if (!user) return false

    setListings(prev => prev.map(listing => {
      if (listing.id === listingId && !listing.watchedBy.includes(user.id)) {
        return {
          ...listing,
          watchedBy: [...listing.watchedBy, user.id]
        }
      }
      return listing
    }))
    return true
  }

  const unwatchListing = async (listingId: string): Promise<boolean> => {
    if (!user) return false

    setListings(prev => prev.map(listing => {
      if (listing.id === listingId) {
        return {
          ...listing,
          watchedBy: listing.watchedBy.filter(id => id !== user.id)
        }
      }
      return listing
    }))
    return true
  }

  const setFilters = (newFilters: MarketplaceFilter) => {
    setFiltersState(newFilters)
  }

  const setSort = (newSort: MarketplaceSort) => {
    setSortState(newSort)
  }

  const clearFilters = () => {
    setFiltersState({})
  }

  const contextValue: MarketplaceContextType = {
    listings: getFilteredAndSortedListings(listings, filters, sort),
    myListings,
    watchedListings,
    filters,
    sort,
    isLoading,
    error,
    createListing,
    updateListing,
    deleteListing,
    getListing,
    getListings,
    watchListing,
    unwatchListing,
    setFilters,
    setSort,
    clearFilters
  }

  return (
    <MarketplaceContext.Provider value={contextValue}>
      {children}
    </MarketplaceContext.Provider>
  )
}

export { N64_GAMES, SHIPPING_OPTIONS }
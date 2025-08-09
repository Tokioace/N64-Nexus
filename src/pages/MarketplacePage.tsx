/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { logger } from '../lib/logger';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocation } from 'react-router-dom';
import { Search, Plus, Package, Clock, Star, Grid, List, Eye, MessageCircle, Heart, ShoppingCart } from 'lucide-react';

interface MarketplaceOffer {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  condition: 'mint' | 'very-good' | 'good' | 'fair';
  images: string[];
  seller: {
    id: string;
    name: string;
    rating: number;
    verified: boolean;
  };
  category: string;
  createdAt: string;
  views: number;
  likes: number;
  comments: number;
  isActive: boolean;
}

interface CreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (offer: Omit<MarketplaceOffer, 'id' | 'createdAt' | 'views' | 'likes' | 'comments' | 'seller'>) => void;
}

const CreateOfferModal: React.FC<CreateOfferModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'EUR',
    condition: 'good' as const,
    category: 'games',
    images: [] as string[]
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      isActive: true
    });
    setFormData({
      title: '',
      description: '',
      price: '',
      currency: 'EUR',
      condition: 'good',
      category: 'games',
      images: []
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3 sm:p-4">
              <div className="bg-slate-800 rounded-xl max-w-2xl w-full overflow-y-auto" style={{ maxHeight: 'clamp(400px, 90vh, 800px)' }}>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 sm:gap-0">
            <h2 className="text-responsive-xl font-bold text-slate-100">{t('marketplace.createOffer')}</h2>
            <button 
              onClick={onClose}
              className="self-end sm:self-auto text-slate-400 hover:text-slate-200 transition-colors p-2 hover:bg-slate-700 rounded-lg"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-responsive">
            <div>
              <label className="block text-slate-300 text-responsive-sm font-medium mb-2">
                {t('marketplace.title')}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-responsive-sm"
                placeholder={t('marketplace.titlePlaceholder')}
                required
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-slate-300 text-responsive-sm font-medium mb-2">
                {t('marketplace.description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 sm:h-32 resize-none text-responsive-sm"
                placeholder={t('marketplace.descriptionPlaceholder')}
                required
                maxLength={500}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-responsive-sm font-medium mb-2">
                  {t('marketplace.price')}
                </label>
                <div className="flex">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-l-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-responsive-sm"
                    placeholder={t('placeholder.marketplacePrice')}
                    required
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    className="px-2 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-r-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-responsive-sm"
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-responsive-sm font-medium mb-2">
                  {t('marketplace.condition')}
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value as any }))}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-responsive-sm"
                >
                  <option value="mint">{t('marketplace.conditionMint')}</option>
                  <option value="very-good">{t('marketplace.conditionVeryGood')}</option>
                  <option value="good">{t('marketplace.conditionGood')}</option>
                  <option value="fair">{t('marketplace.conditionFair')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-responsive-sm font-medium mb-2">
                {t('marketplace.category')}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-responsive-sm"
              >
                <option value="games">{t('marketplace.categoryGames')}</option>
                <option value="consoles">{t('marketplace.categoryConsoles')}</option>
                <option value="accessories">{t('marketplace.categoryAccessories')}</option>
                <option value="collectibles">{t('marketplace.categoryCollectibles')}</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 sm:px-6 py-2 sm:py-3 text-slate-300 hover:text-slate-100 transition-colors text-responsive-sm order-2 sm:order-1"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-responsive-sm order-1 sm:order-2"
              >
                {t('marketplace.publishOffer')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const MarketplacePage: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [offers, setOffers] = useState<MarketplaceOffer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);

  // Load marketplace data from localStorage and handle highlighting
  useEffect(() => {
    let highlightTimeout: NodeJS.Timeout | null = null;
    let clearHighlightTimeout: NodeJS.Timeout | null = null;

    const loadMarketplaceData = () => {
      try {
        const savedMarketplace = localStorage.getItem('marketplace_items');
        if (savedMarketplace) {
          const parsedMarketplace = JSON.parse(savedMarketplace);
          const sortedMarketplace = parsedMarketplace
            .map((item: any) => ({
              ...item,
              createdAt: item.createdAt || new Date().toISOString()
            }))
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOffers(sortedMarketplace);
        } else {
          // Use mock data and save to localStorage
          const mockOffers: MarketplaceOffer[] = [
            {
              id: '1',
              title: 'Super Mario 64 - Mint Condition',
              description: 'Original N64 Spiel in perfektem Zustand mit Originalverpackung und Anleitung.',
              price: 45.99,
              currency: 'EUR',
              condition: 'mint',
              images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTVFN0VCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPjMwMHgyMDA8L3RleHQ+PC9zdmc+'],
              seller: {
                id: 'user1',
                name: 'RetroGamer92',
                rating: 4.8,
                verified: true
              },
              category: 'games',
              createdAt: '2024-01-15T10:30:00Z',
              views: 127,
              likes: 23,
              comments: 5,
              isActive: true
            },
            {
              id: '2',
              title: 'N64 Controller - Original Nintendo',
              description: 'Originaler N64 Controller in gutem Zustand. Alle Knöpfe funktionieren einwandfrei.',
              price: 25.00,
              currency: 'EUR',
              condition: 'good',
              images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTVFN0VCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPjMwMHgyMDA8L3RleHQ+PC9zdmc+'],
              seller: {
                id: 'user2',
                name: 'N64Collector',
                rating: 4.9,
                verified: true
              },
              category: 'accessories',
              createdAt: '2024-01-14T15:45:00Z',
              views: 89,
              likes: 12,
              comments: 3,
              isActive: true
            },
            {
              id: '3',
              title: 'The Legend of Zelda: Ocarina of Time',
              description: 'Kultspiel für N64. Modul in sehr gutem Zustand, funktioniert perfekt.',
              price: 35.50,
              currency: 'EUR',
              condition: 'very-good',
              images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTVFN0VCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPjMwMHgyMDA8L3RleHQ+PC9zdmc+'],
              seller: {
                id: 'user3',
                name: 'ZeldaFan2000',
                rating: 4.7,
                verified: false
              },
              category: 'games',
              createdAt: '2024-01-13T09:20:00Z',
              views: 156,
              likes: 31,
              comments: 8,
              isActive: true
            }
          ];
          setOffers(mockOffers);
          // Save to localStorage for homepage
          localStorage.setItem('marketplace_items', JSON.stringify(mockOffers));
        }
      } catch (error) {
        logger.error('Error loading marketplace data:', error);
        setOffers([]);
      }
    };

    loadMarketplaceData();

    // Check if we need to highlight a specific item
    if (location.state?.highlightItemId) {
      setHighlightedItemId(location.state.highlightItemId);
      // Auto-scroll to the highlighted item after a short delay
      highlightTimeout = setTimeout(() => {
        const element = document.getElementById(`marketplace-${location.state.highlightItemId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
      
      // Clear the highlight after a few seconds
      clearHighlightTimeout = setTimeout(() => {
        setHighlightedItemId(null);
      }, 3000);
    }

    // Cleanup function to clear timeouts
    return () => {
      if (highlightTimeout) {
        clearTimeout(highlightTimeout);
      }
      if (clearHighlightTimeout) {
        clearTimeout(clearHighlightTimeout);
      }
    };
  }, [location.state]);

  const handleCreateOffer = (offerData: Omit<MarketplaceOffer, 'id' | 'createdAt' | 'views' | 'likes' | 'comments' | 'seller'>) => {
    const newOffer: MarketplaceOffer = {
      ...offerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: 0,
      seller: {
        id: 'current-user',
        name: 'Du',
        rating: 5.0,
        verified: true
      }
    };
    
    const updatedOffers = [newOffer, ...offers];
    setOffers(updatedOffers);
    
    // Save to localStorage for homepage
    try {
      localStorage.setItem('marketplace_items', JSON.stringify(updatedOffers));
      // Trigger storage event for HomePage to update
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'marketplace_items',
        newValue: JSON.stringify(updatedOffers)
      }));
    } catch (error) {
      logger.error('Error saving marketplace data:', error);
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'mint': return 'text-green-400 bg-green-400/10';
      case 'very-good': return 'text-blue-400 bg-blue-400/10';
      case 'good': return 'text-yellow-400 bg-yellow-400/10';
      case 'fair': return 'text-orange-400 bg-orange-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || offer.category === selectedCategory;
    const matchesPrice = (!priceRange.min || offer.price >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || offer.price <= parseFloat(priceRange.max));
    
    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'popular': return b.views - a.views;
      default: return 0;
    }
  });

  return (
    <div className="container-lg py-responsive space-responsive responsive-max-width responsive-overflow-hidden">
      {/* Header */}
      <div className="text-center mb-responsive responsive-max-width">
        <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-400 mx-auto mb-4" />
        <h1 className="text-responsive-2xl font-bold text-slate-100 mb-2 responsive-word-break">
          {t('nav.marketplace')}
        </h1>
        <p className="text-responsive-base text-slate-400 max-w-2xl mx-auto responsive-word-break px-2">
          {t('marketplace.subtitle')}
        </p>
      </div>

      {/* Create Offer Button */}
      <div className="text-center mb-responsive responsive-max-width">
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2 mx-auto"
        >
          <Plus size={18} className="sm:w-5 sm:h-5" />
          <span>{t('marketplace.createOffer')}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="simple-tile mb-responsive">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-responsive">
          <div>
            <label className="block text-slate-300 text-responsive-sm font-medium mb-2">
              {t('common.search')}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-responsive-sm"
                placeholder={t('marketplace.searchPlaceholder')}
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-responsive-sm font-medium mb-2">
              {t('marketplace.category')}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-responsive-sm"
            >
              <option value="all">{t('marketplace.allCategories')}</option>
              <option value="games">{t('marketplace.categoryGames')}</option>
              <option value="consoles">{t('marketplace.categoryConsoles')}</option>
              <option value="accessories">{t('marketplace.categoryAccessories')}</option>
              <option value="collectibles">{t('marketplace.categoryCollectibles')}</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 text-responsive-sm font-medium mb-2">
              {t('marketplace.sortBy')}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-responsive-sm"
            >
              <option value="newest">{t('marketplace.sortNewest')}</option>
              <option value="oldest">{t('marketplace.sortOldest')}</option>
              <option value="price-low">{t('marketplace.sortPriceLow')}</option>
              <option value="price-high">{t('marketplace.sortPriceHigh')}</option>
              <option value="popular">{t('marketplace.sortPopular')}</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              aria-label={t('aria.gridView')}
            >
              <Grid size={16} className="sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              aria-label={t('aria.listView')}
            >
              <List size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-responsive-sm text-slate-400">
          {filteredOffers.length} {t('marketplace.offersFound')}
        </p>
      </div>

      {/* Offers Grid/List */}
      <div className={`grid gap-responsive ${
        viewMode === 'grid' 
          ? 'grid-1-2-4' 
          : 'grid-cols-1'
      }`}>
        {filteredOffers.map(offer => (
          <div 
            key={offer.id} 
            id={`marketplace-${offer.id}`}
            className={`simple-tile hover:border-slate-600 transition-all duration-200 overflow-hidden ${
              viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
            } ${highlightedItemId === offer.id ? 'border-2 border-blue-500' : ''}`}
          >
            <div className={`${viewMode === 'list' ? 'w-full sm:w-40 lg:w-48 flex-shrink-0 aspect-video sm:aspect-square' : 'aspect-video'} bg-slate-700 relative`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="text-slate-500" size={viewMode === 'list' ? 32 : 40} />
              </div>
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(offer.condition)}`}>
                  {t(`marketplace.condition${offer.condition.charAt(0).toUpperCase() + offer.condition.slice(1).replace('-', '')}` as any)}
                </span>
              </div>
            </div>
            
            <div className="p-3 sm:p-4 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                <h3 className="text-responsive-base font-semibold text-slate-100 line-clamp-2 flex-1">{offer.title}</h3>
                <div className="text-left sm:text-right">
                  <p className="text-responsive-lg font-bold text-green-400">
                    {offer.price.toFixed(2)} {offer.currency}
                  </p>
                </div>
              </div>
              
              <p className="text-responsive-sm text-slate-400 mb-3 line-clamp-2">{offer.description}</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-responsive-sm text-slate-300 font-medium">{offer.seller.name}</span>
                  {offer.seller.verified && (
                    <span className="text-blue-400">✓</span>
                  )}
                  <div className="flex items-center">
                    <Star className="text-yellow-400 fill-current" size={12} />
                    <span className="text-responsive-xs text-slate-400 ml-1">{offer.seller.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-responsive-xs text-white gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Eye size={12} className="text-white" />
                    <span>{offer.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={12} className="text-white" />
                    <span>{offer.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={12} className="text-white" />
                    <span>{offer.comments}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{new Date(offer.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOffers.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <Package className="mx-auto text-slate-600 mb-4" size={48} />
          <h3 className="text-responsive-lg font-semibold text-slate-300 mb-2">
            {t('marketplace.noOffersFound')}
          </h3>
          <p className="text-responsive-sm text-slate-400">
            {t('marketplace.noOffersDescription')}
          </p>
        </div>
      )}

      {/* Create Offer Modal */}
      <CreateOfferModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateOffer}
      />
    </div>
  );
};

export default MarketplacePage;
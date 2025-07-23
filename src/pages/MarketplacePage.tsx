import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Search, Plus, Package, DollarSign, Clock, Star, Filter, Grid, List, Eye, MessageCircle, Heart } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">{t('marketplace.createOffer')}</h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                {t('marketplace.title')}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('marketplace.titlePlaceholder')}
                required
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                {t('marketplace.description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                placeholder={t('marketplace.descriptionPlaceholder')}
                required
                maxLength={500}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  {t('marketplace.price')}
                </label>
                <div className="flex">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-l-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    required
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-r-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  {t('marketplace.condition')}
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value as any }))}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="mint">{t('marketplace.conditionMint')}</option>
                  <option value="very-good">{t('marketplace.conditionVeryGood')}</option>
                  <option value="good">{t('marketplace.conditionGood')}</option>
                  <option value="fair">{t('marketplace.conditionFair')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                {t('marketplace.category')}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="games">{t('marketplace.categoryGames')}</option>
                <option value="consoles">{t('marketplace.categoryConsoles')}</option>
                <option value="accessories">{t('marketplace.categoryAccessories')}</option>
                <option value="collectibles">{t('marketplace.categoryCollectibles')}</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-slate-300 hover:text-slate-100 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
  const [offers, setOffers] = useState<MarketplaceOffer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockOffers: MarketplaceOffer[] = [
      {
        id: '1',
        title: 'Super Mario 64 - Mint Condition',
        description: 'Original N64 Spiel in perfektem Zustand mit Originalverpackung und Anleitung.',
        price: 45.99,
        currency: 'EUR',
        condition: 'mint',
        images: ['/api/placeholder/300/200'],
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
        images: ['/api/placeholder/300/200'],
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
        images: ['/api/placeholder/300/200'],
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
  }, []);

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
    setOffers(prev => [newOffer, ...prev]);
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
    const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchQuery.toLowerCase());
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
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-100 mb-2">
              {t('nav.marketplace')}
            </h1>
            <p className="text-slate-400">{t('marketplace.subtitle')}</p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 self-start lg:self-auto"
          >
            <Plus size={20} />
            <span>{t('marketplace.createOffer')}</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-xl p-4 md:p-6 mb-8 border border-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                {t('common.search')}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('marketplace.searchPlaceholder')}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                {t('marketplace.category')}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t('marketplace.allCategories')}</option>
                <option value="games">{t('marketplace.categoryGames')}</option>
                <option value="consoles">{t('marketplace.categoryConsoles')}</option>
                <option value="accessories">{t('marketplace.categoryAccessories')}</option>
                <option value="collectibles">{t('marketplace.categoryCollectibles')}</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                {t('marketplace.sortBy')}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">{t('marketplace.sortNewest')}</option>
                <option value="oldest">{t('marketplace.sortOldest')}</option>
                <option value="price-low">{t('marketplace.sortPriceLow')}</option>
                <option value="price-high">{t('marketplace.sortPriceHigh')}</option>
                <option value="popular">{t('marketplace.sortPopular')}</option>
              </select>
            </div>

            <div className="flex items-end space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-slate-400">
            {filteredOffers.length} {t('marketplace.offersFound')}
          </p>
        </div>

        {/* Offers Grid/List */}
        <div className={`grid gap-4 md:gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredOffers.map(offer => (
            <div 
              key={offer.id} 
              className={`bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-200 overflow-hidden ${
                viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
              }`}
            >
                              <div className={`${viewMode === 'list' ? 'w-full sm:w-48 flex-shrink-0 aspect-video sm:aspect-square' : 'aspect-video'} bg-slate-700 relative`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="text-slate-500" size={48} />
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(offer.condition)}`}>
                    {t(`marketplace.condition${offer.condition.charAt(0).toUpperCase() + offer.condition.slice(1).replace('-', '')}`)}
                  </span>
                </div>
              </div>
              
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-slate-100 line-clamp-2">{offer.title}</h3>
                  <div className="text-right ml-4">
                    <p className="text-xl font-bold text-green-400">
                      {offer.price.toFixed(2)} {offer.currency}
                    </p>
                  </div>
                </div>
                
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{offer.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-300 font-medium">{offer.seller.name}</span>
                    {offer.seller.verified && (
                      <span className="text-blue-400">✓</span>
                    )}
                    <div className="flex items-center">
                      <Star className="text-yellow-400 fill-current" size={14} />
                      <span className="text-slate-400 text-sm ml-1">{offer.seller.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-slate-400 text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye size={14} />
                      <span>{offer.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart size={14} />
                      <span>{offer.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle size={14} />
                      <span>{offer.comments}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{new Date(offer.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOffers.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto text-slate-600 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              {t('marketplace.noOffersFound')}
            </h3>
            <p className="text-slate-400">
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
    </div>
  );
};

export default MarketplacePage;
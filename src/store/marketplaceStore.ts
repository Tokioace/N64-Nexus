import { create } from 'zustand';
import { 
  MarketplaceItem, 
  MarketplaceFilters, 
  SortOption, 
  User, 
  TradeOffer, 
  WishlistItem,
  Notification,
  ChatRoom
} from '../types';

interface MarketplaceState {
  // Items and listings
  items: MarketplaceItem[];
  filteredItems: MarketplaceItem[];
  selectedItem: MarketplaceItem | null;
  
  // Filters and search
  filters: MarketplaceFilters;
  sortOption: SortOption;
  searchTerm: string;
  
  // User data
  currentUser: User | null;
  userItems: MarketplaceItem[];
  userWishlist: WishlistItem[];
  
  // Trading system
  tradeOffers: TradeOffer[];
  activeTrades: TradeOffer[];
  
  // Chat and communication
  chatRooms: ChatRoom[];
  activeChatRoom: ChatRoom | null;
  
  // Notifications
  notifications: Notification[];
  unreadNotifications: number;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  showFilters: boolean;
  showTradeModal: boolean;
  showChatModal: boolean;
}

interface MarketplaceActions {
  // Item management
  setItems: (items: MarketplaceItem[]) => void;
  addItem: (item: MarketplaceItem) => void;
  updateItem: (id: string, updates: Partial<MarketplaceItem>) => void;
  removeItem: (id: string) => void;
  selectItem: (item: MarketplaceItem | null) => void;
  
  // Filtering and search
  setFilters: (filters: MarketplaceFilters) => void;
  setSortOption: (sort: SortOption) => void;
  setSearchTerm: (term: string) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  
  // User management
  setCurrentUser: (user: User | null) => void;
  updateUserPoints: (points: number) => void;
  addUserItem: (item: MarketplaceItem) => void;
  removeUserItem: (id: string) => void;
  
  // Wishlist management
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  updateWishlistItem: (id: string, updates: Partial<WishlistItem>) => void;
  
  // Trading system
  createTradeOffer: (offer: TradeOffer) => void;
  updateTradeStatus: (id: string, status: string) => void;
  addTradeMessage: (tradeId: string, message: any) => void;
  
  // Chat system
  createChatRoom: (room: ChatRoom) => void;
  setActiveChatRoom: (room: ChatRoom | null) => void;
  addChatMessage: (roomId: string, message: any) => void;
  
  // Notifications
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  
  // UI state
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleFilters: () => void;
  toggleTradeModal: () => void;
  toggleChatModal: () => void;
}

export const useMarketplaceStore = create<MarketplaceState & MarketplaceActions>((set: any, get: any) => ({
  // Initial state
  items: [],
  filteredItems: [],
  selectedItem: null,
  filters: {},
  sortOption: SortOption.NEWEST,
  searchTerm: '',
  currentUser: null,
  userItems: [],
  userWishlist: [],
  tradeOffers: [],
  activeTrades: [],
  chatRooms: [],
  activeChatRoom: null,
  notifications: [],
  unreadNotifications: 0,
  isLoading: false,
  error: null,
  showFilters: false,
  showTradeModal: false,
  showChatModal: false,

  // Item management actions
  setItems: (items: MarketplaceItem[]) => set({ items, filteredItems: items }),
  addItem: (item: MarketplaceItem) => set((state: MarketplaceState) => ({ 
    items: [...state.items, item],
    filteredItems: [...state.filteredItems, item]
  })),
  updateItem: (id: string, updates: Partial<MarketplaceItem>) => set((state: MarketplaceState) => ({
    items: state.items.map(item => item.id === id ? { ...item, ...updates } : item),
    filteredItems: state.filteredItems.map(item => item.id === id ? { ...item, ...updates } : item)
  })),
  removeItem: (id: string) => set((state: MarketplaceState) => ({
    items: state.items.filter((item: MarketplaceItem) => item.id !== id),
    filteredItems: state.filteredItems.filter((item: MarketplaceItem) => item.id !== id)
  })),
  selectItem: (item: MarketplaceItem | null) => set({ selectedItem: item }),

  // Filtering and search actions
  setFilters: (filters: MarketplaceFilters) => set({ filters }),
  setSortOption: (sortOption: SortOption) => set({ sortOption }),
  setSearchTerm: (searchTerm: string) => set({ searchTerm }),
  applyFilters: () => {
    const { items, filters, sortOption, searchTerm } = get();
    let filtered = [...items];

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (filters.category?.length) {
      filtered = filtered.filter(item => filters.category!.includes(item.category));
    }

    // Apply condition filter
    if (filters.condition?.length) {
      filtered = filtered.filter(item => filters.condition!.includes(item.condition));
    }

    // Apply region filter
    if (filters.region?.length) {
      filtered = filtered.filter(item => filters.region!.includes(item.region));
    }

    // Apply platform filter
    if (filters.platform?.length) {
      filtered = filtered.filter(item => filters.platform!.includes(item.platform));
    }

    // Apply price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(item => 
        item.price && 
        item.price >= filters.priceRange!.min && 
        item.price <= filters.priceRange!.max
      );
    }

    // Apply points range filter
    if (filters.pointsRange) {
      filtered = filtered.filter(item => 
        item.pointsValue && 
        item.pointsValue >= filters.pointsRange!.min && 
        item.pointsValue <= filters.pointsRange!.max
      );
    }

    // Apply rarity filter
    if (filters.rarity?.length) {
      filtered = filtered.filter(item => filters.rarity!.includes(item.rarity));
    }

    // Apply sorting
    switch (sortOption) {
      case SortOption.NEWEST:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case SortOption.PRICE_LOW_HIGH:
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case SortOption.PRICE_HIGH_LOW:
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case SortOption.POINTS_VALUE:
        filtered.sort((a, b) => (b.pointsValue || 0) - (a.pointsValue || 0));
        break;
      case SortOption.RARITY:
        const rarityOrder = ['common', 'uncommon', 'rare', 'very_rare', 'legendary'];
        filtered.sort((a, b) => rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity));
        break;
    }

    set({ filteredItems: filtered });
  },
  clearFilters: () => set({ 
    filters: {}, 
    searchTerm: '', 
    sortOption: SortOption.NEWEST,
    filteredItems: get().items 
  }),

  // User management actions
  setCurrentUser: (user: User | null) => set({ currentUser: user }),
  updateUserPoints: (points: number) => set((state: MarketplaceState) => ({
    currentUser: state.currentUser ? { ...state.currentUser, points } : null
  })),
  addUserItem: (item: MarketplaceItem) => set((state: MarketplaceState) => ({ userItems: [...state.userItems, item] })),
  removeUserItem: (id: string) => set((state: MarketplaceState) => ({ 
    userItems: state.userItems.filter((item: MarketplaceItem) => item.id !== id) 
  })),

  // Wishlist management actions
  addToWishlist: (item) => set((state) => ({ userWishlist: [...state.userWishlist, item] })),
  removeFromWishlist: (id) => set((state) => ({ 
    userWishlist: state.userWishlist.filter(item => item.id !== id) 
  })),
  updateWishlistItem: (id, updates) => set((state) => ({
    userWishlist: state.userWishlist.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
  })),

  // Trading system actions
  createTradeOffer: (offer) => set((state) => ({ 
    tradeOffers: [...state.tradeOffers, offer] 
  })),
  updateTradeStatus: (id, status) => set((state) => ({
    tradeOffers: state.tradeOffers.map(offer => 
      offer.id === id ? { ...offer, status } : offer
    )
  })),
  addTradeMessage: (tradeId, message) => set((state) => ({
    tradeOffers: state.tradeOffers.map(offer => 
      offer.id === tradeId 
        ? { ...offer, messages: [...offer.messages, message] }
        : offer
    )
  })),

  // Chat system actions
  createChatRoom: (room) => set((state) => ({ chatRooms: [...state.chatRooms, room] })),
  setActiveChatRoom: (room) => set({ activeChatRoom: room }),
  addChatMessage: (roomId, message) => set((state) => ({
    chatRooms: state.chatRooms.map(room => 
      room.id === roomId 
        ? { ...room, messages: [...room.messages, message] }
        : room
    )
  })),

  // Notification actions
  addNotification: (notification) => set((state) => ({ 
    notifications: [notification, ...state.notifications],
    unreadNotifications: state.unreadNotifications + 1
  })),
  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ),
    unreadNotifications: Math.max(0, state.unreadNotifications - 1)
  })),
  clearNotifications: () => set({ notifications: [], unreadNotifications: 0 }),

  // UI state actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  toggleFilters: () => set((state) => ({ showFilters: !state.showFilters })),
  toggleTradeModal: () => set((state) => ({ showTradeModal: !state.showTradeModal })),
  toggleChatModal: () => set((state) => ({ showChatModal: !state.showChatModal })),
}));
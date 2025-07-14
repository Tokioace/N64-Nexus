import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  FavoriteItem, 
  FavoriteList, 
  FavoriteType, 
  FavoriteStats,
  FavoriteNotificationSettings 
} from '@/types/favorites';

interface FavoritesState {
  // State
  favorites: FavoriteItem[];
  lists: FavoriteList[];
  selectedListId: string | null;
  viewMode: 'grid' | 'list';
  sortBy: 'date' | 'name' | 'type' | 'custom';
  filterType: FavoriteType | 'all';
  searchQuery: string;
  notificationSettings: FavoriteNotificationSettings;
  
  // Actions
  addFavorite: (favorite: Omit<FavoriteItem, 'id' | 'addedAt' | 'updatedAt'>) => void;
  removeFavorite: (id: string) => void;
  updateFavorite: (id: string, updates: Partial<FavoriteItem>) => void;
  toggleFavorite: (favorite: Omit<FavoriteItem, 'id' | 'addedAt' | 'updatedAt'>) => void;
  isFavorited: (url: string) => boolean;
  
  // Lists
  createList: (list: Omit<FavoriteList, 'id' | 'createdAt' | 'updatedAt' | 'favoriteIds'>) => void;
  updateList: (id: string, updates: Partial<FavoriteList>) => void;
  deleteList: (id: string) => void;
  addToList: (listId: string, favoriteId: string) => void;
  removeFromList: (listId: string, favoriteId: string) => void;
  
  // UI
  setSelectedList: (listId: string | null) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSortBy: (sort: 'date' | 'name' | 'type' | 'custom') => void;
  setFilterType: (type: FavoriteType | 'all') => void;
  setSearchQuery: (query: string) => void;
  
  // Notifications
  updateNotificationSettings: (settings: Partial<FavoriteNotificationSettings>) => void;
  
  // Computed
  getFilteredFavorites: () => FavoriteItem[];
  getFavoritesByType: (type: FavoriteType) => FavoriteItem[];
  getStats: () => FavoriteStats;
  getFavoritesInList: (listId: string) => FavoriteItem[];
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      // Initial state
      favorites: [],
      lists: [
        {
          id: 'default',
          name: 'Alle Favoriten',
          description: 'Alle deine gespeicherten Inhalte',
          isPublic: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          favoriteIds: [],
          color: '#8b5cf6',
          icon: 'star'
        }
      ],
      selectedListId: 'default',
      viewMode: 'grid',
      sortBy: 'date',
      filterType: 'all',
      searchQuery: '',
      notificationSettings: {
        enabled: true,
        eventReminders: true,
        newContent: true,
        friendActivity: false,
        weeklyDigest: true
      },

      // Actions
      addFavorite: (favorite) => {
        const newFavorite: FavoriteItem = {
          ...favorite,
          id: crypto.randomUUID(),
          addedAt: new Date(),
          updatedAt: new Date()
        };
        
        set((state) => ({
          favorites: [...state.favorites, newFavorite],
          lists: state.lists.map(list => 
            list.id === 'default' 
              ? { ...list, favoriteIds: [...list.favoriteIds, newFavorite.id], updatedAt: new Date() }
              : list
          )
        }));
      },

      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter(f => f.id !== id),
          lists: state.lists.map(list => ({
            ...list,
            favoriteIds: list.favoriteIds.filter(favId => favId !== id),
            updatedAt: new Date()
          }))
        }));
      },

      updateFavorite: (id, updates) => {
        set((state) => ({
          favorites: state.favorites.map(f => 
            f.id === id 
              ? { ...f, ...updates, updatedAt: new Date() }
              : f
          )
        }));
      },

      toggleFavorite: (favorite) => {
        const { isFavorited, addFavorite, removeFavorite } = get();
        const existingFavorite = get().favorites.find(f => f.url === favorite.url);
        
        if (existingFavorite) {
          removeFavorite(existingFavorite.id);
        } else {
          addFavorite(favorite);
        }
      },

      isFavorited: (url) => {
        return get().favorites.some(f => f.url === url);
      },

      // Lists
      createList: (list) => {
        const newList: FavoriteList = {
          ...list,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          favoriteIds: []
        };
        
        set((state) => ({
          lists: [...state.lists, newList]
        }));
      },

      updateList: (id, updates) => {
        set((state) => ({
          lists: state.lists.map(list => 
            list.id === id 
              ? { ...list, ...updates, updatedAt: new Date() }
              : list
          )
        }));
      },

      deleteList: (id) => {
        set((state) => ({
          lists: state.lists.filter(list => list.id !== id),
          selectedListId: state.selectedListId === id ? 'default' : state.selectedListId
        }));
      },

      addToList: (listId, favoriteId) => {
        set((state) => ({
          lists: state.lists.map(list => 
            list.id === listId 
              ? { 
                  ...list, 
                  favoriteIds: [...list.favoriteIds, favoriteId],
                  updatedAt: new Date()
                }
              : list
          )
        }));
      },

      removeFromList: (listId, favoriteId) => {
        set((state) => ({
          lists: state.lists.map(list => 
            list.id === listId 
              ? { 
                  ...list, 
                  favoriteIds: list.favoriteIds.filter(id => id !== favoriteId),
                  updatedAt: new Date()
                }
              : list
          )
        }));
      },

      // UI
      setSelectedList: (listId) => set({ selectedListId: listId }),
      setViewMode: (viewMode) => set({ viewMode }),
      setSortBy: (sortBy) => set({ sortBy }),
      setFilterType: (filterType) => set({ filterType }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      // Notifications
      updateNotificationSettings: (settings) => {
        set((state) => ({
          notificationSettings: { ...state.notificationSettings, ...settings }
        }));
      },

      // Computed
      getFilteredFavorites: () => {
        const { favorites, selectedListId, lists, filterType, searchQuery, sortBy } = get();
        
        let filtered = favorites;
        
        // Filter by selected list
        if (selectedListId && selectedListId !== 'default') {
          const selectedList = lists.find(l => l.id === selectedListId);
          if (selectedList) {
            filtered = favorites.filter(f => selectedList.favoriteIds.includes(f.id));
          }
        }
        
        // Filter by type
        if (filterType !== 'all') {
          filtered = filtered.filter(f => f.type === filterType);
        }
        
        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(f => 
            f.title.toLowerCase().includes(query) ||
            f.description?.toLowerCase().includes(query) ||
            f.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }
        
        // Sort
        filtered.sort((a, b) => {
          switch (sortBy) {
            case 'date':
              return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
            case 'name':
              return a.title.localeCompare(b.title);
            case 'type':
              return a.type.localeCompare(b.type);
            default:
              return 0;
          }
        });
        
        return filtered;
      },

      getFavoritesByType: (type) => {
        return get().favorites.filter(f => f.type === type);
      },

      getStats: () => {
        const { favorites } = get();
        const favoritesByType = favorites.reduce((acc, favorite) => {
          acc[favorite.type] = (acc[favorite.type] || 0) + 1;
          return acc;
        }, {} as Record<FavoriteType, number>);
        
        const allTags = favorites.flatMap(f => f.tags);
        const tagCounts = allTags.reduce((acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const mostUsedTags = Object.entries(tagCounts)
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
        
        const recentActivity = favorites
          .map(f => f.updatedAt)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
          .slice(0, 10);
        
        return {
          totalFavorites: favorites.length,
          favoritesByType,
          mostUsedTags,
          recentActivity
        };
      },

      getFavoritesInList: (listId) => {
        const { favorites, lists } = get();
        const list = lists.find(l => l.id === listId);
        if (!list) return [];
        return favorites.filter(f => list.favoriteIds.includes(f.id));
      }
    }),
    {
      name: 'battle64-favorites',
      partialize: (state) => ({
        favorites: state.favorites,
        lists: state.lists,
        notificationSettings: state.notificationSettings
      })
    }
  )
);
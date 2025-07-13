import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Trophy, TrophyRarity, TrophyCategory } from '../types';

interface TrophyState {
  trophies: Trophy[];
  unlockedTrophies: Trophy[];
  totalTrophies: number;
  collectionProgress: Record<TrophyCategory, number>;
  
  // Actions
  unlockTrophy: (trophy: Omit<Trophy, 'id' | 'unlockedAt'>) => void;
  addTrophy: (trophy: Trophy) => void;
  removeTrophy: (id: string) => void;
  getTrophiesByCategory: (category: TrophyCategory) => Trophy[];
  getTrophiesByRarity: (rarity: TrophyRarity) => Trophy[];
  getCollectionProgress: () => Record<TrophyCategory, { unlocked: number; total: number; percentage: number }>;
  isCollectionComplete: (category: TrophyCategory) => boolean;
  getTotalXP: () => number;
}

export const useTrophyStore = create<TrophyState>()(
  devtools(
    persist(
      (set, get) => ({
        trophies: [],
        unlockedTrophies: [],
        totalTrophies: 0,
        collectionProgress: {
          [TrophyCategory.SPEEDRUN]: 0,
          [TrophyCategory.FANART]: 0,
          [TrophyCategory.QUIZ]: 0,
          [TrophyCategory.COLLECTION]: 0,
          [TrophyCategory.TEAM]: 0,
          [TrophyCategory.SPECIAL]: 0,
        },

        unlockTrophy: (trophyData) => {
          const newTrophy: Trophy = {
            ...trophyData,
            id: crypto.randomUUID(),
            unlockedAt: new Date(),
          };

          set((state) => {
            const updatedUnlockedTrophies = [...state.unlockedTrophies, newTrophy];
            const updatedCollectionProgress = { ...state.collectionProgress };
            updatedCollectionProgress[newTrophy.category]++;
            
            return {
              unlockedTrophies: updatedUnlockedTrophies,
              collectionProgress: updatedCollectionProgress,
            };
          });

          // Trigger trophy unlock animation
          triggerTrophyUnlockAnimation(newTrophy);
        },

        addTrophy: (trophy) => {
          set((state) => {
            const updatedTrophies = [...state.trophies, trophy];
            return {
              trophies: updatedTrophies,
              totalTrophies: updatedTrophies.length,
            };
          });
        },

        removeTrophy: (id) => {
          set((state) => {
            const updatedTrophies = state.trophies.filter(t => t.id !== id);
            const updatedUnlockedTrophies = state.unlockedTrophies.filter(t => t.id !== id);
            
            return {
              trophies: updatedTrophies,
              unlockedTrophies: updatedUnlockedTrophies,
              totalTrophies: updatedTrophies.length,
            };
          });
        },

        getTrophiesByCategory: (category) => {
          const { unlockedTrophies } = get();
          return unlockedTrophies.filter(trophy => trophy.category === category);
        },

        getTrophiesByRarity: (rarity) => {
          const { unlockedTrophies } = get();
          return unlockedTrophies.filter(trophy => trophy.rarity === rarity);
        },

        getCollectionProgress: () => {
          const { unlockedTrophies, trophies } = get();
          const progress: Record<TrophyCategory, { unlocked: number; total: number; percentage: number }> = {} as any;
          
          Object.values(TrophyCategory).forEach(category => {
            const unlocked = unlockedTrophies.filter(t => t.category === category).length;
            const total = trophies.filter(t => t.category === category).length;
            const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0;
            
            progress[category] = { unlocked, total, percentage };
          });
          
          return progress;
        },

        isCollectionComplete: (category) => {
          const progress = get().getCollectionProgress();
          return progress[category].unlocked === progress[category].total && progress[category].total > 0;
        },

        getTotalXP: () => {
          const { unlockedTrophies } = get();
          return unlockedTrophies.reduce((total, trophy) => total + trophy.xpValue, 0);
        },
      }),
      {
        name: 'battle64-trophies',
        partialize: (state) => ({
          trophies: state.trophies,
          unlockedTrophies: state.unlockedTrophies,
          totalTrophies: state.totalTrophies,
          collectionProgress: state.collectionProgress,
        }),
      }
    ),
    {
      name: 'trophy-store',
    }
  )
);

// Trophy unlock animation utility
const triggerTrophyUnlockAnimation = (trophy: Trophy) => {
  // Create a custom event for the trophy unlock animation
  const event = new CustomEvent('trophyUnlocked', {
    detail: { trophy }
  });
  window.dispatchEvent(event);
  
  // Play trophy unlock sound
  playTrophyUnlockSound(trophy.rarity);
};

// Trophy unlock sound utility
const playTrophyUnlockSound = (rarity: TrophyRarity) => {
  try {
    const audio = new Audio(`/sounds/trophy-${rarity}.mp3`);
    audio.volume = 0.4;
    audio.play().catch(() => {
      // Fallback: create different sounds based on rarity
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different rarities
      const frequencies = {
        [TrophyRarity.BRONZE]: 400,
        [TrophyRarity.SILVER]: 600,
        [TrophyRarity.GOLD]: 800,
        [TrophyRarity.PLATINUM]: 1000,
      };
      
      oscillator.frequency.setValueAtTime(frequencies[rarity], audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    });
  } catch (error) {
    console.warn('Could not play trophy unlock sound:', error);
  }
};
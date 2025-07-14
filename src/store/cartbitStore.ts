import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartbitState, CartbitMode, CartbitMessage } from '../types/cartbit';

interface CartbitStore extends CartbitState {
  // Actions
  setMode: (mode: CartbitMode) => void;
  toggleVisibility: () => void;
  addMessage: (message: Omit<CartbitMessage, 'id' | 'timestamp' | 'isRead'>) => void;
  markMessageAsRead: (id: string) => void;
  toggleMinimized: () => void;
  resetToStandard: () => void;
  earnXP: (amount: number) => void;
  updateSettings: (settings: Partial<CartbitState['settings']>) => void;
}

const getDefaultSettings = (mode: CartbitMode) => {
  switch (mode) {
    case 'profi':
      return {
        isVisible: false,
        showAnimations: false,
        showSounds: false,
        autoStart: false,
        showTooltips: true,
      };
    case 'disabled':
      return {
        isVisible: false,
        showAnimations: false,
        showSounds: false,
        autoStart: false,
        showTooltips: false,
      };
    case 'text-only':
      return {
        isVisible: true,
        showAnimations: false,
        showSounds: false,
        autoStart: false,
        showTooltips: true,
      };
    case 'error-only':
      return {
        isVisible: false,
        showAnimations: false,
        showSounds: false,
        autoStart: false,
        showTooltips: true,
      };
    default: // standard
      return {
        isVisible: true,
        showAnimations: true,
        showSounds: true,
        autoStart: true,
        showTooltips: true,
      };
  }
};

export const useCartbitStore = create<CartbitStore>()(
  persist(
    (set, get) => ({
      // Initial state
      settings: {
        mode: 'standard',
        ...getDefaultSettings('standard'),
      },
      messages: [],
      isMinimized: false,
      lastActivity: Date.now(),
      xpEarned: 0,

      // Actions
      setMode: (mode) => {
        const defaultSettings = getDefaultSettings(mode);
        set((state) => ({
          settings: {
            ...state.settings,
            mode,
            ...defaultSettings,
          },
          lastActivity: Date.now(),
        }));
      },

      toggleVisibility: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            isVisible: !state.settings.isVisible,
          },
          lastActivity: Date.now(),
        }));
      },

      addMessage: (message) => {
        const newMessage: CartbitMessage = {
          ...message,
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          isRead: false,
        };

        set((state) => ({
          messages: [...state.messages, newMessage],
          lastActivity: Date.now(),
        }));
      },

      markMessageAsRead: (id) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, isRead: true } : msg
          ),
        }));
      },

      toggleMinimized: () => {
        set((state) => ({
          isMinimized: !state.isMinimized,
          lastActivity: Date.now(),
        }));
      },

      resetToStandard: () => {
        const defaultSettings = getDefaultSettings('standard');
        set((state) => ({
          settings: {
            ...state.settings,
            mode: 'standard',
            ...defaultSettings,
          },
          lastActivity: Date.now(),
        }));
      },

      earnXP: (amount) => {
        set((state) => ({
          xpEarned: state.xpEarned + amount,
          lastActivity: Date.now(),
        }));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
          lastActivity: Date.now(),
        }));
      },
    }),
    {
      name: 'cartbit-storage',
      partialize: (state) => ({
        settings: state.settings,
        xpEarned: state.xpEarned,
        lastActivity: state.lastActivity,
      }),
    }
  )
);
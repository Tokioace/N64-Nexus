import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Notification, NotificationType, NotificationPriority } from '../types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  filters: NotificationType[];
  soundEnabled: boolean;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  setFilters: (filters: NotificationType[]) => void;
  toggleSound: () => void;
  getFilteredNotifications: () => Notification[];
  getUnreadNotifications: () => Notification[];
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    persist(
      (set, get) => ({
        notifications: [],
        unreadCount: 0,
        filters: [],
        soundEnabled: true,

        addNotification: (notificationData) => {
          const newNotification: Notification = {
            ...notificationData,
            id: crypto.randomUUID(),
            timestamp: new Date(),
            read: false,
          };

          set((state) => {
            const updatedNotifications = [newNotification, ...state.notifications];
            const unreadCount = updatedNotifications.filter(n => !n.read).length;
            
            // Keep only last 100 notifications
            const trimmedNotifications = updatedNotifications.slice(0, 100);
            
            return {
              notifications: trimmedNotifications,
              unreadCount,
            };
          });

          // Play sound if enabled
          if (get().soundEnabled) {
            playNotificationSound();
          }
        },

        markAsRead: (id) => {
          set((state) => {
            const updatedNotifications = state.notifications.map(notification =>
              notification.id === id ? { ...notification, read: true } : notification
            );
            const unreadCount = updatedNotifications.filter(n => !n.read).length;
            
            return {
              notifications: updatedNotifications,
              unreadCount,
            };
          });
        },

        markAllAsRead: () => {
          set((state) => {
            const updatedNotifications = state.notifications.map(notification => ({
              ...notification,
              read: true,
            }));
            
            return {
              notifications: updatedNotifications,
              unreadCount: 0,
            };
          });
        },

        removeNotification: (id) => {
          set((state) => {
            const updatedNotifications = state.notifications.filter(n => n.id !== id);
            const unreadCount = updatedNotifications.filter(n => !n.read).length;
            
            return {
              notifications: updatedNotifications,
              unreadCount,
            };
          });
        },

        clearAll: () => {
          set({
            notifications: [],
            unreadCount: 0,
          });
        },

        setFilters: (filters) => {
          set({ filters });
        },

        toggleSound: () => {
          set((state) => ({ soundEnabled: !state.soundEnabled }));
        },

        getFilteredNotifications: () => {
          const { notifications, filters } = get();
          if (filters.length === 0) return notifications;
          
          return notifications.filter(notification => 
            filters.includes(notification.type)
          );
        },

        getUnreadNotifications: () => {
          const { notifications } = get();
          return notifications.filter(notification => !notification.read);
        },
      }),
      {
        name: 'battle64-notifications',
        partialize: (state) => ({
          notifications: state.notifications,
          unreadCount: state.unreadCount,
          filters: state.filters,
          soundEnabled: state.soundEnabled,
        }),
      }
    ),
    {
      name: 'notification-store',
    }
  )
);

// Sound utility function
const playNotificationSound = () => {
  try {
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Fallback: create a simple beep sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    });
  } catch (error) {
    console.warn('Could not play notification sound:', error);
  }
};
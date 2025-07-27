// Safe localStorage utilities for SSR compatibility

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// Helper for JSON operations
export const safeJSONStorage = {
  get: <T>(key: string, defaultValue: T): T => {
    const item = safeLocalStorage.getItem(key);
    if (!item) return defaultValue;
    try {
      return JSON.parse(item);
    } catch (error) {
      console.error('Error parsing JSON from localStorage:', error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      safeLocalStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error stringifying JSON for localStorage:', error);
    }
  }
};
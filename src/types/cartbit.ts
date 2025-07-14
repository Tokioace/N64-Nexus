export type CartbitMode = 'standard' | 'profi' | 'disabled' | 'text-only' | 'error-only';

export interface CartbitSettings {
  mode: CartbitMode;
  isVisible: boolean;
  showAnimations: boolean;
  showSounds: boolean;
  autoStart: boolean;
  showTooltips: boolean;
}

export interface CartbitMessage {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'hint';
  message: string;
  context?: string;
  timestamp: number;
  isRead: boolean;
}

export interface CartbitState {
  settings: CartbitSettings;
  messages: CartbitMessage[];
  isMinimized: boolean;
  lastActivity: number;
  xpEarned: number;
}

export interface CartbitContextType {
  state: CartbitState;
  setMode: (mode: CartbitMode) => void;
  toggleVisibility: () => void;
  addMessage: (message: Omit<CartbitMessage, 'id' | 'timestamp' | 'isRead'>) => void;
  markMessageAsRead: (id: string) => void;
  toggleMinimized: () => void;
  resetToStandard: () => void;
  earnXP: (amount: number) => void;
}
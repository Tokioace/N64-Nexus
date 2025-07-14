import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartbitStore } from '../../store/cartbitStore';
import { CartbitIcon } from './CartbitIcon';
import { CartbitSettings } from './CartbitSettings';
import { CartbitMessage } from './CartbitMessage';
import { CartbitContextType } from '../../types/cartbit';

const CartbitContext = createContext<CartbitContextType | null>(null);

export const useCartbit = () => {
  const context = useContext(CartbitContext);
  if (!context) {
    throw new Error('useCartbit must be used within a CartbitProvider');
  }
  return context;
};

interface CartbitProviderProps {
  children: React.ReactNode;
}

export const CartbitProvider: React.FC<CartbitProviderProps> = ({ children }) => {
  const {
    state,
    setMode,
    toggleVisibility,
    addMessage,
    markMessageAsRead,
    toggleMinimized,
    resetToStandard,
    earnXP,
  } = useCartbitStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);

  // Auto-start functionality
  useEffect(() => {
    if (state.settings.autoStart && state.settings.mode !== 'disabled') {
      // Add welcome message based on mode
      const welcomeMessages = {
        standard: {
          type: 'info' as const,
          message: 'Willkommen bei Battle64! Ich bin Cartbit, dein Gaming-Assistent.',
          context: 'Ich helfe dir beim Spielen und Lernen neuer Features.',
        },
        profi: {
          type: 'info' as const,
          message: 'Profi-Modus aktiviert! Du erhältst XP für selbstständiges Spielen.',
          context: 'Klicke auf mein Icon, wenn du Hilfe brauchst.',
        },
        'text-only': {
          type: 'info' as const,
          message: 'Text-Hilfe aktiviert. Keine Animationen, nur klare Informationen.',
          context: 'Hover über Elemente für zusätzliche Hinweise.',
        },
        'error-only': {
          type: 'info' as const,
          message: 'Error-Only Modus: Ich erscheine nur bei Problemen.',
          context: 'Genieße dein Spiel ohne Ablenkungen!',
        },
      };

      const message = welcomeMessages[state.settings.mode];
      if (message) {
        addMessage(message);
      }
    }
  }, [state.settings.autoStart, state.settings.mode, addMessage]);

  // Manage visible messages
  useEffect(() => {
    const unreadMessages = state.messages.filter(msg => !msg.isRead);
    setVisibleMessages(unreadMessages.map(msg => msg.id));
  }, [state.messages]);

  // Remove messages after 5 seconds in profi mode
  useEffect(() => {
    if (state.settings.mode === 'profi') {
      const timer = setTimeout(() => {
        state.messages.forEach(msg => {
          if (!msg.isRead) {
            markMessageAsRead(msg.id);
          }
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [state.messages, state.settings.mode, markMessageAsRead]);

  // XP Challenge system for profi mode
  const handleProfiChallenge = (challengeType: string, difficulty: number) => {
    if (state.settings.mode === 'profi') {
      const xpReward = difficulty * 10;
      earnXP(xpReward);
      
      addMessage({
        type: 'success',
        message: `Profi-Challenge abgeschlossen! +${xpReward} XP`,
        context: `Du hast "${challengeType}" ohne Hilfe gemeistert!`,
      });
    }
  };

  const contextValue: CartbitContextType = {
    state,
    setMode,
    toggleVisibility,
    addMessage,
    markMessageAsRead,
    toggleMinimized,
    resetToStandard,
    earnXP,
  };

  return (
    <CartbitContext.Provider value={contextValue}>
      {children}

      {/* Cartbit Icon - Always visible in profi mode */}
      {(state.settings.mode === 'profi' || state.settings.isVisible) && (
        <CartbitIcon />
      )}

      {/* Settings Modal */}
      <CartbitSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Messages */}
      <AnimatePresence>
        {visibleMessages.map((messageId) => {
          const message = state.messages.find(msg => msg.id === messageId);
          if (!message) return null;

          return (
            <CartbitMessage
              key={messageId}
              message={message}
              onClose={() => {
                setVisibleMessages(prev => prev.filter(id => id !== messageId));
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* Settings Trigger (hidden in disabled mode) */}
      {state.settings.mode !== 'disabled' && (
        <motion.button
          className="fixed bottom-4 left-4 z-40 p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          onClick={() => setIsSettingsOpen(true)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 }}
          title="Cartbit-Einstellungen"
        >
          ⚙️
        </motion.button>
      )}
    </CartbitContext.Provider>
  );
};

// Hook for triggering profi challenges
export const useProfiChallenge = () => {
  const { state, earnXP, addMessage } = useCartbitStore();

  const triggerChallenge = (challengeType: string, difficulty: number) => {
    if (state.settings.mode === 'profi') {
      const xpReward = difficulty * 10;
      earnXP(xpReward);
      
      addMessage({
        type: 'success',
        message: `Profi-Challenge: ${challengeType} (+${xpReward} XP)`,
        context: 'Du hast diese Aufgabe ohne Hilfe gemeistert!',
      });
    }
  };

  return { triggerChallenge };
};
import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Eye, EyeOff } from 'lucide-react';
import { useCartbitStore } from '../../store/cartbitStore';

interface CartbitIconProps {
  className?: string;
}

export const CartbitIcon: React.FC<CartbitIconProps> = ({ className = '' }) => {
  const { settings, toggleVisibility, toggleMinimized } = useCartbitStore();

  const handleClick = () => {
    if (settings.mode === 'profi' || settings.mode === 'disabled') {
      toggleVisibility();
    } else {
      toggleMinimized();
    }
  };

  const getIconColor = () => {
    switch (settings.mode) {
      case 'profi':
        return 'text-gray-500 hover:text-gray-700';
      case 'disabled':
        return 'text-gray-400 hover:text-gray-600';
      case 'text-only':
        return 'text-blue-500 hover:text-blue-700';
      case 'error-only':
        return 'text-orange-500 hover:text-orange-700';
      default:
        return 'text-green-500 hover:text-green-700';
    }
  };

  const getTooltipText = () => {
    switch (settings.mode) {
      case 'profi':
        return 'Cartbit ist im Profi-Modus – klick für Hilfe';
      case 'disabled':
        return 'Cartbit ist deaktiviert – klick zum Aktivieren';
      case 'text-only':
        return 'Cartbit: Nur Text-Hilfe aktiv';
      case 'error-only':
        return 'Cartbit: Nur bei Fehlern aktiv';
      default:
        return 'Cartbit: Standard-Modus aktiv';
    }
  };

  return (
    <motion.div
      className={`fixed bottom-4 right-4 z-50 ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={handleClick}
        className={`
          relative p-3 rounded-full shadow-lg bg-white border-2 border-gray-200
          hover:shadow-xl transition-all duration-200 cursor-pointer
          ${getIconColor()}
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={getTooltipText()}
      >
        <div className="relative">
          <Gamepad2 size={24} />
          {settings.mode === 'profi' && (
            <div className="absolute -top-1 -right-1">
              <div className="w-3 h-3 bg-gray-400 rounded-full flex items-center justify-center">
                <Eye size={8} className="text-white" />
              </div>
            </div>
          )}
        </div>
        
        {/* XP Badge for Profi Mode */}
        {settings.mode === 'profi' && (
          <motion.div
            className="absolute -top-2 -left-2 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            XP
          </motion.div>
        )}
      </motion.button>
    </motion.div>
  );
};
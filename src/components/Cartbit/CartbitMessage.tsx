import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { useCartbitStore } from '../../store/cartbitStore';
import { CartbitMessage as CartbitMessageType } from '../../types/cartbit';

interface CartbitMessageProps {
  message: CartbitMessageType;
  onClose?: () => void;
}

export const CartbitMessage: React.FC<CartbitMessageProps> = ({ message, onClose }) => {
  const { settings, markMessageAsRead } = useCartbitStore();

  const handleClose = () => {
    markMessageAsRead(message.id);
    onClose?.();
  };

  const getIcon = () => {
    switch (message.type) {
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'hint':
        return <HelpCircle className="w-5 h-5 text-purple-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (message.type) {
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'hint':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Don't show messages in disabled mode
  if (settings.mode === 'disabled') {
    return null;
  }

  // Only show error messages in error-only mode
  if (settings.mode === 'error-only' && message.type !== 'error') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`
          fixed top-4 right-4 z-40 max-w-sm w-full p-4 rounded-lg border shadow-lg
          ${getBackgroundColor()}
        `}
        initial={{ opacity: 0, x: 300, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 300, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-800">
              {message.message}
            </div>
            {message.context && (
              <div className="mt-1 text-xs text-gray-600">
                {message.context}
              </div>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Contextual tooltip component for inline help
interface CartbitTooltipProps {
  message: string;
  context?: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const CartbitTooltip: React.FC<CartbitTooltipProps> = ({
  message,
  context,
  children,
  position = 'top'
}) => {
  const { settings } = useCartbitStore();
  const [isVisible, setIsVisible] = React.useState(false);

  // Don't show tooltips in disabled mode or if tooltips are disabled
  if (settings.mode === 'disabled' || !settings.showTooltips) {
    return <>{children}</>;
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`
              absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg
              ${getPositionClasses()}
            `}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="font-medium">{message}</div>
            {context && (
              <div className="text-xs text-gray-300 mt-1">{context}</div>
            )}
            
            {/* Arrow */}
            <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45" 
                 style={{
                   [position === 'top' ? 'top' : position === 'bottom' ? 'bottom' : position === 'left' ? 'left' : 'right']: '-4px',
                   left: position === 'top' || position === 'bottom' ? '50%' : 'auto',
                   top: position === 'left' || position === 'right' ? '50%' : 'auto',
                   transform: position === 'top' || position === 'bottom' 
                     ? 'translateX(-50%) rotate(45deg)' 
                     : 'translateY(-50%) rotate(45deg)'
                 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaCog, FaTimes } from 'react-icons/fa';
import { useNotificationStore } from '../../stores/notificationStore';
import { NotificationType } from '../../types';
import NotificationDropdown from './NotificationDropdown';

const BellContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BellButton = styled(motion.button)`
  position: relative;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border: 2px solid #8b4513;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 
      0 6px 12px rgba(0, 0, 0, 0.4),
      inset 0 2px 4px rgba(255, 255, 255, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const BellIcon = styled(FaBell)`
  color: #fff;
  font-size: 20px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
`;

const NotificationBadge = styled(motion.div)`
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(135deg, #ff4757, #ff3742);
  color: white;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 10;
`;

const SettingsButton = styled(motion.button)`
  position: absolute;
  top: -5px;
  left: -5px;
  background: linear-gradient(135deg, #3742fa, #2f3542);
  border: 2px solid #2f3542;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  &:hover {
    transform: scale(1.1);
  }
`;

const SettingsIcon = styled(FaCog)`
  color: #fff;
  font-size: 12px;
`;

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { unreadCount, markAllAsRead, soundEnabled, toggleSound } = useNotificationStore();

  // Animation for new notifications
  useEffect(() => {
    if (unreadCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      markAllAsRead();
    }
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSound();
  };

  return (
    <BellContainer>
      <SettingsButton
        onClick={handleSettingsClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={soundEnabled ? 'Sound On' : 'Sound Off'}
      >
        <SettingsIcon style={{ opacity: soundEnabled ? 1 : 0.5 }} />
      </SettingsButton>
      
      <BellButton
        onClick={handleBellClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isAnimating ? { 
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.1, 1]
        } : {}}
        transition={{ duration: 0.5 }}
        title="Notifications"
      >
        <BellIcon />
      </BellButton>

      <AnimatePresence>
        {unreadCount > 0 && (
          <NotificationBadge
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </NotificationBadge>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <NotificationDropdown onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </BellContainer>
  );
};

export default NotificationBell;
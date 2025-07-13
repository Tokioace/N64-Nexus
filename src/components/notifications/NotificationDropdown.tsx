import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaFilter, FaCheck, FaTrash } from 'react-icons/fa';
import { useNotificationStore } from '../../stores/notificationStore';
import { NotificationType } from '../../types';
import NotificationItem from './NotificationItem';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

const DropdownContainer = styled(motion.div)`
  position: absolute;
  top: 60px;
  right: -10px;
  width: 400px;
  max-height: 500px;
  background: linear-gradient(135deg, #2c3e50, #34495e);
  border: 2px solid #8b4513;
  border-radius: 12px;
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
  z-index: 1000;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #8b4513, #a0522d);
  border-bottom: 2px solid #654321;
`;

const Title = styled.h3`
  color: #fff;
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const FilterSection = styled.div`
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid #555;
`;

const FilterButton = styled.button<{ active: boolean }>`
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #ff6b35, #f7931e)' 
    : 'linear-gradient(135deg, #555, #666)'
  };
  border: 1px solid ${props => props.active ? '#ff6b35' : '#777'};
  color: #fff;
  padding: 6px 12px;
  margin: 2px;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const NotificationsList = styled.div`
  max-height: 350px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #ff6b35, #f7931e);
    border-radius: 4px;
  }
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #ccc;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  margin: 0;
  font-size: 14px;
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid #555;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #3742fa, #2f3542);
  border: 1px solid #2f3542;
  color: #fff;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const [activeFilters, setActiveFilters] = useState<NotificationType[]>([]);
  const { 
    notifications, 
    getFilteredNotifications, 
    markAllAsRead, 
    clearAll,
    unreadCount 
  } = useNotificationStore();

  const filteredNotifications = getFilteredNotifications();
  const displayNotifications = activeFilters.length > 0 
    ? filteredNotifications.filter(n => activeFilters.includes(n.type))
    : filteredNotifications;

  const toggleFilter = (type: NotificationType) => {
    setActiveFilters(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    clearAll();
  };

  const getTypeLabel = (type: NotificationType): string => {
    const labels = {
      [NotificationType.EVENT]: 'Events',
      [NotificationType.RANKING]: 'Ranglisten',
      [NotificationType.FANART]: 'Fanart',
      [NotificationType.LEVEL_UP]: 'Level-Up',
      [NotificationType.TROPHY]: 'Trophäen',
      [NotificationType.COMMENT]: 'Kommentare',
      [NotificationType.FRIEND_REQUEST]: 'Freunde',
      [NotificationType.TRADE]: 'Trades'
    };
    return labels[type];
  };

  return (
    <DropdownContainer
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Header>
        <Title>🔔 Benachrichtigungen ({unreadCount})</Title>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
      </Header>

      <FilterSection>
        <div style={{ marginBottom: 8, fontSize: 12, color: '#ccc' }}>
          <FaFilter style={{ marginRight: 4 }} />
          Filter:
        </div>
        <div>
          {Object.values(NotificationType).map(type => (
            <FilterButton
              key={type}
              active={activeFilters.includes(type)}
              onClick={() => toggleFilter(type)}
            >
              {getTypeLabel(type)}
            </FilterButton>
          ))}
        </div>
      </FilterSection>

      <NotificationsList>
        <AnimatePresence>
          {displayNotifications.length > 0 ? (
            displayNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <NotificationItem notification={notification} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <EmptyState>
                <EmptyIcon>🔔</EmptyIcon>
                <EmptyText>
                  {activeFilters.length > 0 
                    ? 'Keine Benachrichtigungen in dieser Kategorie'
                    : 'Keine Benachrichtigungen vorhanden'
                  }
                </EmptyText>
              </EmptyState>
            </motion.div>
          )}
        </AnimatePresence>
      </NotificationsList>

      <ActionsBar>
        <ActionButton onClick={handleMarkAllRead}>
          <FaCheck style={{ marginRight: 4 }} />
          Alle als gelesen
        </ActionButton>
        <ActionButton onClick={handleClearAll}>
          <FaTrash style={{ marginRight: 4 }} />
          Alle löschen
        </ActionButton>
      </ActionsBar>
    </DropdownContainer>
  );
};

export default NotificationDropdown;
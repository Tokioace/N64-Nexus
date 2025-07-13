import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaTimes, FaExternalLinkAlt } from 'react-icons/fa';
import { useNotificationStore } from '../../stores/notificationStore';
import { Notification, NotificationType } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

const ItemContainer = styled(motion.div)<{ read: boolean }>`
  padding: 12px 16px;
  border-bottom: 1px solid #555;
  background: ${props => props.read ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 107, 53, 0.1)'};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background: ${props => props.read ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 107, 53, 0.2)'};
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${props => props.read ? 'transparent' : 'linear-gradient(135deg, #ff6b35, #f7931e)'};
  }
`;

const ItemContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const IconContainer = styled.div<{ type: NotificationType }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => getIconBackground(props.type)};
  border: 2px solid ${props => getIconBorder(props.type)};
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Icon = styled.div`
  font-size: 18px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
`;

const TextContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h4<{ read: boolean }>`
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: ${props => props.read ? 'normal' : 'bold'};
  color: #fff;
  line-height: 1.3;
`;

const Message = styled.p`
  margin: 0 0 6px 0;
  font-size: 12px;
  color: #ccc;
  line-height: 1.4;
`;

const TimeStamp = styled.span`
  font-size: 11px;
  color: #999;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-left: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const getIconBackground = (type: NotificationType): string => {
  const backgrounds = {
    [NotificationType.EVENT]: 'linear-gradient(135deg, #e74c3c, #c0392b)',
    [NotificationType.RANKING]: 'linear-gradient(135deg, #f39c12, #e67e22)',
    [NotificationType.FANART]: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
    [NotificationType.LEVEL_UP]: 'linear-gradient(135deg, #27ae60, #2ecc71)',
    [NotificationType.TROPHY]: 'linear-gradient(135deg, #f1c40f, #f39c12)',
    [NotificationType.COMMENT]: 'linear-gradient(135deg, #3498db, #2980b9)',
    [NotificationType.FRIEND_REQUEST]: 'linear-gradient(135deg, #1abc9c, #16a085)',
    [NotificationType.TRADE]: 'linear-gradient(135deg, #e67e22, #d35400)'
  };
  return backgrounds[type];
};

const getIconBorder = (type: NotificationType): string => {
  const borders = {
    [NotificationType.EVENT]: '#c0392b',
    [NotificationType.RANKING]: '#e67e22',
    [NotificationType.FANART]: '#8e44ad',
    [NotificationType.LEVEL_UP]: '#2ecc71',
    [NotificationType.TROPHY]: '#f39c12',
    [NotificationType.COMMENT]: '#2980b9',
    [NotificationType.FRIEND_REQUEST]: '#16a085',
    [NotificationType.TRADE]: '#d35400'
  };
  return borders[type];
};

const getTypeIcon = (type: NotificationType): string => {
  const icons = {
    [NotificationType.EVENT]: '🎮',
    [NotificationType.RANKING]: '🏆',
    [NotificationType.FANART]: '🎨',
    [NotificationType.LEVEL_UP]: '⭐',
    [NotificationType.TROPHY]: '🏅',
    [NotificationType.COMMENT]: '💬',
    [NotificationType.FRIEND_REQUEST]: '👥',
    [NotificationType.TRADE]: '🔄'
  };
  return icons[type];
};

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { markAsRead, removeNotification } = useNotificationStore();

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank');
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeNotification(notification.id);
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (notification.actionUrl) {
      window.open(notification.actionUrl, '_blank');
    }
  };

  return (
    <ItemContainer
      read={notification.read}
      onClick={handleClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <ItemContent>
        <IconContainer type={notification.type}>
          <Icon>{getTypeIcon(notification.type)}</Icon>
        </IconContainer>
        
        <TextContent>
          <Title read={notification.read}>
            {notification.title}
          </Title>
          <Message>{notification.message}</Message>
          <TimeStamp>
            {formatDistanceToNow(notification.timestamp, { 
              addSuffix: true, 
              locale: de 
            })}
          </TimeStamp>
        </TextContent>
        
        <ActionsContainer>
          {notification.actionUrl && (
            <ActionButton
              onClick={handleExternalLink}
              title="Öffnen"
            >
              <FaExternalLinkAlt size={12} />
            </ActionButton>
          )}
          <ActionButton
            onClick={handleRemove}
            title="Löschen"
          >
            <FaTimes size={12} />
          </ActionButton>
        </ActionsContainer>
      </ItemContent>
    </ItemContainer>
  );
};

export default NotificationItem;
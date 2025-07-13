import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { Pin, MoreVertical, Star } from 'lucide-react';
import { Conversation, User } from '../types/messaging';

interface InboxProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onMarkAsRead: (conversationId: string) => void;
  onTogglePin: (conversationId: string) => void;
  currentUser: User;
}

const Inbox: React.FC<InboxProps> = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  onMarkAsRead,
  onTogglePin,
  currentUser
}) => {
  const handleConversationClick = (conversation: Conversation) => {
    onSelectConversation(conversation);
    if (conversation.unreadCount > 0) {
      onMarkAsRead(conversation.id);
    }
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.type === 'group') {
      return conversation.groupName || 'Gruppenchat';
    }
    
    const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
    return otherParticipant?.username || 'Unbekannt';
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.type === 'group') {
      return conversation.groupAvatar || '👥';
    }
    
    const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
    return otherParticipant?.avatar || '👤';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-retro-green';
      case 'away': return 'bg-retro-orange';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-retro-gray';
      default: return 'bg-retro-gray';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true, locale: de });
    } else {
      return date.toLocaleDateString('de-DE', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-2">📭</div>
          <p className="text-retro-gray font-retro">Keine Konversationen gefunden</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 overflow-y-auto h-full">
      {conversations.map((conversation) => {
        const isSelected = selectedConversation?.id === conversation.id;
        const hasUnread = conversation.unreadCount > 0;
        
        return (
          <div
            key={conversation.id}
            onClick={() => handleConversationClick(conversation)}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
              isSelected
                ? 'bg-retro-blue text-white border-retro-blue shadow-lg'
                : hasUnread
                ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                : 'bg-white border-retro-light hover:bg-retro-light hover:border-retro-gray'
            }`}
          >
            <div className="flex items-start space-x-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-retro-blue to-retro-purple flex items-center justify-center text-2xl shadow-md">
                  {getConversationAvatar(conversation)}
                </div>
                
                {/* Status indicator for direct chats */}
                {conversation.type === 'direct' && (
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(conversation.participants[0]?.status || 'offline')}`} />
                )}
                
                {/* Unread badge */}
                {hasUnread && (
                  <div className="absolute -top-1 -right-1 notification-badge">
                    {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-retro font-bold truncate ${
                    isSelected ? 'text-white' : 'text-retro-dark'
                  }`}>
                    {getConversationName(conversation)}
                    {conversation.isPinned && (
                      <Pin className="inline w-4 h-4 ml-1 text-retro-orange" />
                    )}
                  </h3>
                  
                  <div className="flex items-center space-x-1">
                    {conversation.lastMessage?.isImportant && (
                      <Star className="w-4 h-4 text-retro-orange" />
                    )}
                    <span className={`text-xs font-retro ${
                      isSelected ? 'text-white/80' : 'text-retro-gray'
                    }`}>
                      {conversation.lastMessage && formatTime(conversation.lastMessage.timestamp)}
                    </span>
                  </div>
                </div>

                {conversation.lastMessage && (
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${
                      isSelected 
                        ? 'text-white/90' 
                        : hasUnread 
                        ? 'text-retro-dark font-semibold' 
                        : 'text-retro-gray'
                    }`}>
                      {conversation.lastMessage.senderId === currentUser.id && 'Du: '}
                      {conversation.lastMessage.content}
                    </p>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(conversation.id);
                      }}
                      className={`p-1 rounded hover:bg-white/20 transition-colors ${
                        isSelected ? 'text-white/70' : 'text-retro-gray'
                      }`}
                      title={conversation.isPinned ? 'Markierung entfernen' : 'Markieren'}
                    >
                      <Pin className={`w-4 h-4 ${conversation.isPinned ? 'text-retro-orange' : ''}`} />
                    </button>
                  </div>
                )}

                {/* Group info */}
                {conversation.type === 'group' && (
                  <div className="flex items-center space-x-1 mt-1">
                    <span className={`text-xs ${
                      isSelected ? 'text-white/70' : 'text-retro-gray'
                    }`}>
                      {conversation.participants.length} Mitglieder
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Inbox;
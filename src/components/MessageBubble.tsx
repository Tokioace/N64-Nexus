import React, { useState } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Heart, Star, MoreVertical, Flag } from 'lucide-react';
import { Message, User, Conversation } from '../types/messaging';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  currentUser: User;
  conversation: Conversation;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  currentUser,
  conversation
}) => {
  const [showActions, setShowActions] = useState(false);

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm', { locale: de });
  };

  const handleLike = () => {
    // Toggle like functionality would be implemented here
    console.log('Toggle like for message:', message.id);
  };

  const handleMarkImportant = () => {
    // Mark as important functionality would be implemented here
    console.log('Mark as important:', message.id);
  };

  const handleReport = () => {
    // Report functionality would be implemented here
    console.log('Report message:', message.id);
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'sticker':
        return (
          <div className="text-4xl text-center">
            {message.content}
          </div>
        );
      case 'image':
        return (
          <div className="space-y-2">
            <img 
              src={message.attachments?.[0]?.url || message.content} 
              alt="Attached image"
              className="max-w-xs rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform"
              onClick={() => window.open(message.attachments?.[0]?.url || message.content, '_blank')}
            />
            {message.content && (
              <p className="text-sm">{message.content}</p>
            )}
          </div>
        );
      case 'link':
        return (
          <div className="space-y-2">
            <a 
              href={message.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-retro-blue hover:text-retro-purple underline break-all"
            >
              {message.content}
            </a>
          </div>
        );
      default:
        return (
          <p className="whitespace-pre-wrap break-words">
            {message.content}
          </p>
        );
    }
  };

  const getSenderName = () => {
    if (isOwn) return 'Du';
    
    if (conversation.type === 'direct') {
      return conversation.participants[0]?.username || 'Unbekannt';
    }
    
    // For group chats, we'd need to find the sender in participants
    const sender = conversation.participants.find(p => p.id === message.senderId);
    return sender?.username || 'Unbekannt';
  };

  const getSenderAvatar = () => {
    if (isOwn) return currentUser.avatar;
    
    if (conversation.type === 'direct') {
      return conversation.participants[0]?.avatar || '👤';
    }
    
    const sender = conversation.participants.find(p => p.id === message.senderId);
    return sender?.avatar || '👤';
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        {/* Sender info for group chats */}
        {conversation.type === 'group' && !isOwn && (
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-retro-blue to-retro-purple flex items-center justify-center text-xs">
              {getSenderAvatar()}
            </div>
            <span className="text-xs font-retro text-retro-gray">
              {getSenderName()}
            </span>
          </div>
        )}
        
        {/* Message bubble */}
        <div className="relative group">
          <div className={`chat-bubble ${
            isOwn ? 'chat-bubble-own' : 'chat-bubble-other'
          } ${message.isImportant ? 'ring-2 ring-retro-orange' : ''}`}>
            {renderMessageContent()}
            
            {/* Message actions */}
            <div className={`absolute top-0 ${isOwn ? '-left-12' : '-right-12'} opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1`}>
              <button
                onClick={handleLike}
                className={`p-1 rounded hover:bg-white/20 transition-colors ${
                  message.isLiked ? 'text-red-500' : 'text-retro-gray'
                }`}
                title={message.isLiked ? 'Like entfernen' : 'Gefällt mir'}
              >
                <Heart className={`w-4 h-4 ${message.isLiked ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={handleMarkImportant}
                className={`p-1 rounded hover:bg-white/20 transition-colors ${
                  message.isImportant ? 'text-retro-orange' : 'text-retro-gray'
                }`}
                title={message.isImportant ? 'Wichtig entfernen' : 'Als wichtig markieren'}
              >
                <Star className={`w-4 h-4 ${message.isImportant ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 rounded hover:bg-white/20 transition-colors text-retro-gray"
                title="Weitere Aktionen"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Dropdown actions */}
          {showActions && (
            <div className={`absolute top-8 ${isOwn ? '-left-12' : '-right-12'} bg-white border-2 border-retro-gray rounded-lg shadow-lg z-10 min-w-32`}>
              <button
                onClick={handleReport}
                className="w-full px-3 py-2 text-left text-sm font-retro text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Flag className="w-4 h-4" />
                <span>Melden</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs font-retro text-retro-gray mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
          {message.isRead && isOwn && (
            <span className="ml-1">✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Paperclip, Star, Heart, MoreVertical, Volume2 } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Conversation, User, Message, ChatSettings } from '../types/messaging';
import { mockData } from '../data/mockData';
import MessageBubble from './MessageBubble';
import QuickReplies from './QuickReplies';
import StickerPicker from './StickerPicker';

interface ChatWindowProps {
  conversation: Conversation;
  currentUser: User;
  onNewMessage: (conversationId: string, message: Message) => void;
  onMarkAsRead: (conversationId: string) => void;
  settings: ChatSettings;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  currentUser,
  onNewMessage,
  onMarkAsRead,
  settings
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load messages for this conversation
  useEffect(() => {
    const conversationMessages = mockData.messages.filter(
      msg => msg.conversationId === conversation.id
    );
    setMessages(conversationMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()));
  }, [conversation.id]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark conversation as read when opened
  useEffect(() => {
    if (conversation.unreadCount > 0) {
      onMarkAsRead(conversation.id);
    }
  }, [conversation.id, conversation.unreadCount, onMarkAsRead]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId: conversation.id,
      senderId: currentUser.id,
      content: newMessage,
      type: 'text',
      timestamp: new Date(),
      isRead: false,
      isLiked: false,
      isImportant: false
    };

    setMessages(prev => [...prev, message]);
    onNewMessage(conversation.id, message);
    setNewMessage('');
    setShowStickers(false);

    // Play sound if enabled
    if (settings.soundEnabled) {
      playMessageSound();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickReply = (text: string) => {
    setNewMessage(text);
    inputRef.current?.focus();
  };

  const handleStickerSelect = (sticker: string) => {
    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId: conversation.id,
      senderId: currentUser.id,
      content: sticker,
      type: 'sticker',
      timestamp: new Date(),
      isRead: false,
      isLiked: false,
      isImportant: false
    };

    setMessages(prev => [...prev, message]);
    onNewMessage(conversation.id, message);
    setShowStickers(false);

    if (settings.soundEnabled) {
      playMessageSound();
    }
  };

  const playMessageSound = () => {
    // Simple beep sound simulation
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const getConversationName = () => {
    if (conversation.type === 'group') {
      return conversation.groupName || 'Gruppenchat';
    }
    
    const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
    return otherParticipant?.username || 'Unbekannt';
  };

  const getConversationAvatar = () => {
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

  return (
    <div className="retro-card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-retro-gray">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-retro-blue to-retro-purple flex items-center justify-center text-xl shadow-md">
              {getConversationAvatar()}
            </div>
            {conversation.type === 'direct' && (
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(conversation.participants[0]?.status || 'offline')}`} />
            )}
          </div>
          
          <div>
            <h3 className="font-pixel text-lg text-retro-dark">
              {getConversationName()}
            </h3>
            {conversation.type === 'direct' && (
              <p className="text-sm font-retro text-retro-gray">
                {conversation.participants[0]?.status === 'online' ? 'Online' : 'Offline'}
              </p>
            )}
            {conversation.type === 'group' && (
              <p className="text-sm font-retro text-retro-gray">
                {conversation.participants.length} Mitglieder
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {settings.soundEnabled && (
            <button className="p-2 hover:bg-retro-light rounded transition-colors">
              <Volume2 className="w-5 h-5 text-retro-gray" />
            </button>
          )}
          <button className="p-2 hover:bg-retro-light rounded transition-colors">
            <MoreVertical className="w-5 h-5 text-retro-gray" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-retro-gray font-retro">
              Starte eine neue Unterhaltung!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUser.id}
              currentUser={currentUser}
              conversation={conversation}
            />
          ))
        )}
        
        {isTyping && (
          <div className="flex items-center space-x-2 text-retro-gray">
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
              <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-sm font-retro">schreibt...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <QuickReplies onSelect={handleQuickReply} />

      {/* Input Area */}
      <div className="p-4 border-t-2 border-retro-gray">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowStickers(!showStickers)}
            className="p-2 hover:bg-retro-light rounded transition-colors"
            title="Sticker"
          >
            <Smile className="w-5 h-5 text-retro-gray" />
          </button>
          
          <button className="p-2 hover:bg-retro-light rounded transition-colors" title="Anhängen">
            <Paperclip className="w-5 h-5 text-retro-gray" />
          </button>
          
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nachricht eingeben..."
              className="retro-input w-full pr-12"
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="retro-button disabled:opacity-50 disabled:cursor-not-allowed"
            title="Senden"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Sticker Picker */}
        {showStickers && (
          <div className="mt-2">
            <StickerPicker onSelect={handleStickerSelect} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
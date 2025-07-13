import React, { useState, useEffect } from 'react';
import { Bell, Search, Settings, Plus, Filter } from 'lucide-react';
import Inbox from './Inbox';
import ChatWindow from './ChatWindow';
import { Conversation, User, Message, ChatSettings } from '../types/messaging';
import { mockData } from '../data/mockData';

const MessagingSystem: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockData.conversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [currentUser] = useState<User>(mockData.currentUser);
  const [settings, setSettings] = useState<ChatSettings>(mockData.settings);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'friends' | 'pinned'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState(mockData.notifications);

  // Filter conversations based on search and filter
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participants.some(p => 
      p.username.toLowerCase().includes(searchTerm.toLowerCase())
    ) || conv.groupName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'unread' && conv.unreadCount > 0) ||
      (filter === 'friends' && conv.participants.some(p => p.isFriend)) ||
      (filter === 'pinned' && conv.isPinned);
    
    return matchesSearch && matchesFilter;
  });

  // Handle new message
  const handleNewMessage = (conversationId: string, message: Message) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessage: message,
          unreadCount: conv.unreadCount + 1,
          updatedAt: new Date()
        };
      }
      return conv;
    }));
  };

  // Mark conversation as read
  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, unreadCount: 0 };
      }
      return conv;
    }));
  };

  // Toggle conversation pin
  const togglePin = (conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, isPinned: !conv.isPinned };
      }
      return conv;
    }));
  };

  // Get unread count
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[80vh]">
      {/* Inbox Panel */}
      <div className="lg:col-span-1">
        <div className="retro-card h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-retro-gray">
            <h2 className="text-2xl font-pixel text-retro-dark">📥 Inbox</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-retro-light rounded transition-colors"
                title="Einstellungen"
              >
                <Settings className="w-5 h-5 text-retro-gray" />
              </button>
              <div className="relative">
                <button className="p-2 hover:bg-retro-light rounded transition-colors">
                  <Bell className="w-5 h-5 text-retro-gray" />
                </button>
                {totalUnread > 0 && (
                  <span className="notification-badge absolute -top-1 -right-1">
                    {totalUnread > 99 ? '99+' : totalUnread}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-4 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-retro-gray" />
              <input
                type="text"
                placeholder="Nach Benutzern suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="retro-input w-full pl-10"
              />
            </div>
            
            <div className="flex space-x-2">
              {(['all', 'unread', 'friends', 'pinned'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1 text-sm rounded border-2 transition-colors ${
                    filter === filterType
                      ? 'bg-retro-blue text-white border-retro-blue'
                      : 'bg-white text-retro-gray border-retro-gray hover:bg-retro-light'
                  }`}
                >
                  {filterType === 'all' && 'Alle'}
                  {filterType === 'unread' && 'Ungelesen'}
                  {filterType === 'friends' && 'Freunde'}
                  {filterType === 'pinned' && 'Markiert'}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations List */}
          <Inbox
            conversations={filteredConversations}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
            onMarkAsRead={markAsRead}
            onTogglePin={togglePin}
            currentUser={currentUser}
          />
        </div>
      </div>

      {/* Chat Window */}
      <div className="lg:col-span-2">
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            currentUser={currentUser}
            onNewMessage={handleNewMessage}
            onMarkAsRead={markAsRead}
            settings={settings}
          />
        ) : (
          <div className="retro-card h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-2xl font-pixel text-retro-dark mb-2">
                Willkommen bei Battle64!
              </h3>
              <p className="text-retro-gray font-retro">
                Wähle eine Konversation aus, um zu chatten
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="retro-card max-w-md w-full mx-4">
            <h3 className="text-xl font-pixel text-retro-dark mb-4">⚙️ Einstellungen</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-retro text-retro-gray mb-2">
                  Wer darf mir schreiben?
                </label>
                <select
                  value={settings.allowMessagesFrom}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    allowMessagesFrom: e.target.value as 'all' | 'friends' | 'none'
                  }))}
                  className="retro-input w-full"
                >
                  <option value="all">Alle</option>
                  <option value="friends">Nur Freunde</option>
                  <option value="none">Niemand</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-retro text-retro-gray mb-2">
                  Chatverlauf nach X Tagen löschen
                </label>
                <input
                  type="number"
                  value={settings.autoDeleteAfterDays}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    autoDeleteAfterDays: parseInt(e.target.value) || 30
                  }))}
                  className="retro-input w-full"
                  min="1"
                  max="365"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="soundEnabled"
                  checked={settings.soundEnabled}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    soundEnabled: e.target.checked
                  }))}
                  className="w-4 h-4"
                />
                <label htmlFor="soundEnabled" className="text-sm font-retro text-retro-gray">
                  Soundeffekte aktivieren
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="notificationEnabled"
                  checked={settings.notificationEnabled}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    notificationEnabled: e.target.checked
                  }))}
                  className="w-4 h-4"
                />
                <label htmlFor="notificationEnabled" className="text-sm font-retro text-retro-gray">
                  Benachrichtigungen aktivieren
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="retro-button"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingSystem;
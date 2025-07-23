import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useChat } from '../contexts/ChatContext'
import { useUser } from '../contexts/UserContext'
import { 
  MessageCircle, 
  Search, 
  Plus, 
  MoreVertical, 
  Circle, 
  Check, 
  CheckCheck,
  Clock,
  Package,
  User,
  Phone,
  Video,
  Archive
} from 'lucide-react'
import { ChatConversation } from '../types'
import ChatWindow from '../components/ChatWindow'

const ChatPage: React.FC = () => {
  const { t } = useLanguage()
  const { user } = useUser()
  const { 
    conversations, 
    activeConversation, 
    getConversations, 
    setActiveConversation 
  } = useChat()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [showNewChatModal, setShowNewChatModal] = useState(false)

  useEffect(() => {
    getConversations()
  }, [getConversations])

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = conv.participants.find(p => p.userId !== user?.id)
    return otherParticipant?.username.toLowerCase().includes(searchTerm.toLowerCase()) || false
  })

  const formatLastActivity = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 1) return t('chat.now') || 'now'
    if (diffMinutes < 60) return `${diffMinutes}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return date.toLocaleDateString()
  }

  const getUnreadCount = (conversation: ChatConversation) => {
    return conversation.unreadCount[user?.id || ''] || 0
  }

  const ConversationItem: React.FC<{ conversation: ChatConversation }> = ({ conversation }) => {
    const otherParticipant = conversation.participants.find(p => p.userId !== user?.id)
    const unreadCount = getUnreadCount(conversation)
    const isActive = selectedConversationId === conversation.id

    return (
      <div
        onClick={() => setSelectedConversationId(conversation.id)}
        className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors ${
          isActive ? 'bg-gray-750 border-l-4 border-l-cyan-500' : ''
        }`}
      >
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
              {otherParticipant?.avatar || (
                <User className="w-6 h-6 text-gray-300" />
              )}
            </div>
            {otherParticipant?.isActive && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-white truncate">
                {otherParticipant?.username || 'Unknown User'}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">
                  {formatLastActivity(conversation.lastActivity)}
                </span>
                {unreadCount > 0 && (
                  <div className="bg-cyan-500 text-white rounded-full px-2 py-1 text-xs font-medium">
                    {unreadCount}
                  </div>
                )}
              </div>
            </div>

            {/* Last message preview */}
            <div className="flex items-center space-x-2">
              {conversation.listingId && (
                <Package className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              )}
              <p className="text-sm text-gray-400 truncate">
                {conversation.lastMessage?.content || t('chat.noMessages') || 'No messages yet'}
              </p>
            </div>

            {/* Marketplace listing info */}
            {conversation.listingId && (
              <div className="mt-1">
                <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">
                  {t('chat.aboutListing', { gameName: 'N64 Game' })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const EmptyState: React.FC = () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
          {selectedConversationId ? t('chat.selectConversation') : t('chat.noConversations')}
        </h3>
        <p className="text-gray-500 mb-4">
          {selectedConversationId 
            ? t('chat.selectConversationDesc')
            : t('chat.startConversationDesc')
          }
        </p>
        <button
          onClick={() => setShowNewChatModal(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {t('chat.startConversation')}
        </button>
      </div>
    </div>
  )

  return (
    <div className="h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">{t('chat.title')}</h1>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('placeholder.searchPlayers')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-9 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              {searchTerm ? t('search.noResults') : t('chat.noConversations')}
            </div>
          ) : (
            filteredConversations.map(conversation => (
              <ConversationItem key={conversation.id} conversation={conversation} />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{filteredConversations.length} {t('chat.conversations').toLowerCase()}</span>
            <button className="hover:text-white transition-colors">
              <Archive className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversationId ? (
          <ChatWindow 
            conversationId={selectedConversationId} 
            onClose={() => setSelectedConversationId(null)}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}

export default ChatPage
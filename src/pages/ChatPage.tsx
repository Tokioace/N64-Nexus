import React, { useState, useEffect, useRef } from 'react'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import { usePoints } from '../contexts/PointsContext'
import { Send, Users, MessageCircle, Star, Info, Search, Plus, ArrowLeft, MoreVertical } from 'lucide-react'
import { User } from '../types'

interface ChatMessage {
  id: string
  senderId: string
  receiverId?: string
  username: string
  avatar: string
  message: string
  timestamp: Date
  userPoints?: number
  isPrivate?: boolean
}

interface ActiveChat {
  userId: string
  username: string
  avatar: string
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
}

const ChatPage: React.FC = () => {
  const { user, isAuthenticated, getAllUsers } = useUser()
  const { t } = useLanguage()
  const { userPoints, awardPoints } = usePoints()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [onlineUsers] = useState(12)
  const [lastPointsTime, setLastPointsTime] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Messenger features
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null) // null = community chat, userId = private chat
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showUserSearch, setShowUserSearch] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)

  // Check for mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    
    checkMobileView()
    window.addEventListener('resize', checkMobileView)
    return () => window.removeEventListener('resize', checkMobileView)
  }, [])

  // Load all users for search
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await getAllUsers()
        setAllUsers(users.filter(u => u.id !== user?.id)) // Exclude current user
      } catch (error) {
        console.error('Error loading users:', error)
      }
    }

    if (isAuthenticated) {
      loadUsers()
    }
  }, [getAllUsers, isAuthenticated, user?.id])

  // Mock initial community messages
  useEffect(() => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        senderId: 'user1',
        username: 'SpeedrunKing',
        avatar: '🏃',
        message: 'Hat jemand schon das neue Super Mario 64 Event ausprobiert?',
        timestamp: new Date(Date.now() - 300000),
        userPoints: 1254,
        isPrivate: false
      },
      {
        id: '2',
        senderId: 'user2',
        username: 'N64Collector',
        avatar: '📦',
        message: 'Ja! Die Zeiten sind echt hart. Wer hat schon unter 16:20 geschafft?',
        timestamp: new Date(Date.now() - 240000),
        userPoints: 867,
        isPrivate: false
      },
      {
        id: '3',
        senderId: 'user3',
        username: 'RetroGamer98',
        avatar: '🎮',
        message: 'Ich bin bei 16:45 hängen geblieben. Muss noch an meinen BLJs arbeiten 😅',
        timestamp: new Date(Date.now() - 180000),
        userPoints: 432,
        isPrivate: false
      }
    ]
    setMessages(mockMessages)
  }, [])

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !isAuthenticated || !user) return

    const now = Date.now()
    const canEarnPoints = now - lastPointsTime > 60000 // 1 minute cooldown

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: selectedChat || undefined,
      username: user.username,
      avatar: user.avatar || '🎮',
      message: newMessage.trim(),
      timestamp: new Date(),
      userPoints: userPoints?.totalPoints || 0,
      isPrivate: selectedChat !== null
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Update active chats if it's a private message
    if (selectedChat) {
      const targetUser = allUsers.find(u => u.id === selectedChat)
      if (targetUser) {
        setActiveChats(prev => {
          const existingChat = prev.find(chat => chat.userId === selectedChat)
          if (existingChat) {
            return prev.map(chat => 
              chat.userId === selectedChat 
                ? { ...chat, lastMessage: newMessage.trim(), lastMessageTime: new Date() }
                : chat
            )
          } else {
            return [...prev, {
              userId: selectedChat,
              username: targetUser.username,
              avatar: targetUser.avatar || '🎮',
              lastMessage: newMessage.trim(),
              lastMessageTime: new Date(),
              unreadCount: 0
            }]
          }
        })
      }
    }

    // Award points for meaningful messages (with cooldown)
    if (canEarnPoints && newMessage.trim().length > 10) {
      try {
        await awardPoints('chat.messages', 'Chat message sent')
        setLastPointsTime(now)
      } catch (error) {
        console.error('Error awarding chat points:', error)
      }
    }
  }

  const startChat = (targetUser: User) => {
    setSelectedChat(targetUser.id)
    setShowUserSearch(false)
    
    // Add to active chats if not already there
    setActiveChats(prev => {
      const existingChat = prev.find(chat => chat.userId === targetUser.id)
      if (!existingChat) {
        return [...prev, {
          userId: targetUser.id,
          username: targetUser.username,
          avatar: targetUser.avatar || '🎮',
          unreadCount: 0
        }]
      }
      return prev
    })
  }

  const filteredUsers = allUsers.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCurrentMessages = () => {
    if (selectedChat === null) {
      return messages.filter(msg => !msg.isPrivate)
    } else {
      return messages.filter(msg => 
        msg.isPrivate && 
        ((msg.senderId === user?.id && msg.receiverId === selectedChat) ||
         (msg.senderId === selectedChat && msg.receiverId === user?.id))
      )
    }
  }

  const getCurrentChatTitle = () => {
    if (selectedChat === null) {
      return t('chat.title')
    } else {
      const targetUser = allUsers.find(u => u.id === selectedChat)
      return targetUser?.username || 'Private Chat'
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    
    if (isToday) {
      return formatTime(date)
    } else {
      return new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }
  }

  // Mobile layout: show chat list or chat view
  if (isMobileView) {
    return (
      <div className="container-lg py-responsive space-responsive responsive-max-width responsive-overflow-hidden">
        {/* Feature Header - Centered like other pages */}
        <div className="text-center mb-responsive responsive-max-width">
          <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-violet-400 mx-auto mb-4" />
          <h1 className="text-responsive-2xl font-bold text-slate-100 mb-2 responsive-word-break">
            Chat
          </h1>
          <p className="text-responsive-base text-slate-400 max-w-2xl mx-auto responsive-word-break px-2">
            {onlineUsers} {t('chat.onlineUsers')}
          </p>
        </div>

        <div className="chatWrapper w-full flex flex-col bg-slate-800 rounded-lg border border-slate-700" style={{ height: 'calc(100vh - 200px)' }}>
          {(!selectedChat && !showUserSearch) ? (
            // Chat List View (Mobile)
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="bg-slate-800 border-b border-slate-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-slate-100">{t('chat.chats')}</h1>
                  </div>
                  <button
                    onClick={() => setShowUserSearch(true)}
                    className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

            {/* Community Chat */}
            <div 
              onClick={() => setSelectedChat(null)}
              className="p-4 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-100">{t('chat.title')}</h3>
                  <p className="text-sm text-slate-400">{onlineUsers} {t('chat.onlineUsers')}</p>
                </div>
              </div>
            </div>

            {/* Active Chats */}
            <div className="flex-1 overflow-y-auto">
              {activeChats.map(chat => (
                <div
                  key={chat.userId}
                  onClick={() => setSelectedChat(chat.userId)}
                  className="p-4 border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-lg">
                      {chat.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-100 truncate">{chat.username}</h3>
                        {chat.lastMessageTime && (
                          <span className="text-xs text-slate-500">
                            {formatTime(chat.lastMessageTime)}
                          </span>
                        )}
                      </div>
                      {chat.lastMessage && (
                        <p className="text-sm text-slate-400 truncate">{chat.lastMessage}</p>
                      )}
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">{chat.unreadCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : showUserSearch ? (
          // User Search View (Mobile)
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-slate-800 border-b border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowUserSearch(false)}
                  className="p-1 rounded-lg hover:bg-slate-700"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-400" />
                </button>
                                 <h1 className="text-xl font-bold text-slate-100">{t('chat.newChat')}</h1>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                                       placeholder={t('chat.searchUsers')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  onClick={() => startChat(user)}
                  className="p-4 hover:bg-slate-700/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-lg">
                      {user.avatar || '🎮'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100">{user.username}</h3>
                      <p className="text-sm text-slate-400">Level {user.level}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Chat View (Mobile)
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-slate-800 border-b border-slate-700 p-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="p-1 rounded-lg hover:bg-slate-700"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-400" />
                </button>
                <div className="flex items-center gap-3 flex-1">
                  {selectedChat ? (
                    <>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-lg">
                        {allUsers.find(u => u.id === selectedChat)?.avatar || '🎮'}
                      </div>
                      <h1 className="text-lg font-bold text-slate-100">{getCurrentChatTitle()}</h1>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h1 className="text-lg font-bold text-slate-100">{getCurrentChatTitle()}</h1>
                        <p className="text-sm text-slate-400">{onlineUsers} {t('chat.onlineUsers')}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {getCurrentMessages().map((message) => (
                <div key={message.id} className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    {message.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-semibold text-slate-100 text-sm">
                        {message.username}
                      </span>
                      {message.userPoints !== undefined && !selectedChat && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-600/20 border border-yellow-500/30 rounded-full text-xs text-yellow-300">
                          <Star className="w-3 h-3" />
                          <span>{message.userPoints.toLocaleString()}</span>
                        </div>
                      )}
                      <span className="text-xs text-slate-500">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-slate-200 break-words text-sm leading-relaxed">
                      {message.message}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {isAuthenticated ? (
              <div className="border-t border-slate-700 p-4">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('chat.messagePlaceholder')}
                    className="flex-1 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="border-t border-slate-700 p-4 text-center">
                <p className="text-slate-400">
                  <a href="/auth" className="text-blue-400 hover:text-blue-300 font-semibold">
                    {t('chat.joinPrompt')}
                  </a>
                </p>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    )
  }

  // Desktop layout
  return (
    <div className="container-lg py-responsive space-responsive responsive-max-width responsive-overflow-hidden">
      {/* Feature Header - Centered like other pages */}
      <div className="text-center mb-responsive responsive-max-width">
        <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-violet-400 mx-auto mb-4" />
        <h1 className="text-responsive-2xl font-bold text-slate-100 mb-2 responsive-word-break">
          Chat
        </h1>
        <p className="text-responsive-base text-slate-400 max-w-2xl mx-auto responsive-word-break px-2">
          {onlineUsers} {t('chat.onlineUsers')}
        </p>
      </div>

      <div className="chatWrapper w-full flex justify-center">
        <div className="max-w-[1200px] w-full px-4">
        <div className="flex gap-6 h-[calc(100vh-120px)]">
          {/* Sidebar - Chat List */}
          <div className="w-80 bg-slate-800 rounded-lg border border-slate-700 flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between mb-4">
                                 <h2 className="text-lg font-bold text-slate-100">{t('chat.chats')}</h2>
                <button
                  onClick={() => setShowUserSearch(!showUserSearch)}
                  className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {showUserSearch ? <ArrowLeft className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
              </div>

              {showUserSearch && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t('chat.searchUsers')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              )}
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {showUserSearch ? (
                // User Search Results
                <div className="p-2">
                  {filteredUsers.map(user => (
                    <div
                      key={user.id}
                      onClick={() => startChat(user)}
                      className="p-3 rounded-lg hover:bg-slate-700/50 cursor-pointer mb-1"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-sm">
                          {user.avatar || '🎮'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-100 text-sm">{user.username}</h3>
                          <p className="text-xs text-slate-400">Level {user.level}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Active Chats
                <div className="p-2">
                  {/* Community Chat */}
                  <div 
                    onClick={() => setSelectedChat(null)}
                    className={`p-3 rounded-lg cursor-pointer mb-1 ${
                      selectedChat === null ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-100 text-sm">{t('chat.title')}</h3>
                        <p className="text-xs text-slate-400">{onlineUsers} {t('chat.onlineUsers')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Private Chats */}
                  {activeChats.map(chat => (
                    <div
                      key={chat.userId}
                      onClick={() => setSelectedChat(chat.userId)}
                      className={`p-3 rounded-lg cursor-pointer mb-1 ${
                        selectedChat === chat.userId ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-sm">
                          {chat.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-slate-100 text-sm truncate">{chat.username}</h3>
                            {chat.lastMessageTime && (
                              <span className="text-xs text-slate-500">
                                {formatTime(chat.lastMessageTime)}
                              </span>
                            )}
                          </div>
                          {chat.lastMessage && (
                            <p className="text-xs text-slate-400 truncate">{chat.lastMessage}</p>
                          )}
                        </div>
                        {chat.unreadCount > 0 && (
                          <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white">{chat.unreadCount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 bg-slate-800 rounded-lg border border-slate-700 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedChat ? (
                    <>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-lg">
                        {allUsers.find(u => u.id === selectedChat)?.avatar || '🎮'}
                      </div>
                      <div>
                        <h1 className="text-lg font-bold text-slate-100">{getCurrentChatTitle()}</h1>
                                                 <p className="text-sm text-slate-400">{t('chat.privateChat')}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-8 h-8 text-blue-400" />
                      <div>
                        <h1 className="text-xl font-bold text-slate-100">{getCurrentChatTitle()}</h1>
                        <p className="text-slate-300">{t('chat.description')}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400 ml-4">
                        <Users className="w-4 h-4" />
                        <span>{onlineUsers} {t('chat.onlineUsers')}</span>
                      </div>
                    </>
                  )}
                </div>
                {selectedChat && (
                  <button className="p-2 rounded-lg hover:bg-slate-700">
                    <MoreVertical className="w-5 h-5 text-slate-400" />
                  </button>
                )}
              </div>

              {/* Login Prompt for unauthenticated users */}
              {!isAuthenticated && (
                <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 mt-4 text-center">
                  <p className="text-blue-200 mb-0">
                    <a href="/auth" className="text-blue-400 hover:text-blue-300 font-semibold underline">
                      {t('chat.joinPrompt')}
                    </a>
                  </p>
                </div>
              )}
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {getCurrentMessages().map((message) => (
                <div key={message.id} className="flex gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    {message.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-semibold text-slate-100">
                        {message.username}
                      </span>
                      {message.userPoints !== undefined && !selectedChat && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-600/20 border border-yellow-500/30 rounded-full text-xs text-yellow-300 cursor-help"
                             title={t('chat.pointsTooltip')}>
                          <Star className="w-3 h-3" />
                          <span>{message.userPoints.toLocaleString()} {t('chat.points')}</span>
                        </div>
                      )}
                      <span className="text-xs text-slate-500">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-slate-200 break-words leading-relaxed">
                      {message.message}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {isAuthenticated ? (
              <div className="border-t border-slate-700 p-4">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    {user?.avatar || '🎮'}
                  </div>
                  <div className="w-full flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={t('chat.messagePlaceholder')}
                      className="flex-grow px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      maxLength={500}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white transition-colors flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">{t('chat.send')}</span>
                    </button>
                  </div>
                </form>
                <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                  <span>
                    {newMessage.length}/500 {t('chat.charactersLeft')} • {t('chat.beRespectful')}
                  </span>
                  {userPoints && (
                    <span className="text-yellow-400">
                      <Star className="w-3 h-3 inline mr-1" />
                      {userPoints.totalPoints.toLocaleString()} {t('chat.points')}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-700 p-6 text-center">
                <p className="text-slate-400 text-lg">
                  <a href="/auth" className="text-blue-400 hover:text-blue-300 font-semibold">
                    {t('chat.joinPrompt')}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Guidelines - Only show for community chat */}
        {selectedChat === null && (
          <div className="simple-tile p-4 sm:p-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-slate-200 text-lg">{t('chat.rulesTitle')}</h3>
            </div>
            <ul className="text-sm text-slate-300 space-y-3 list-disc list-inside pl-2 leading-relaxed font-['Inter',system-ui,sans-serif]">
              <li>{t('chat.rules.respect')}</li>
              <li>{t('chat.rules.noSpam')}</li>
              <li>{t('chat.rules.shareExperience')}</li>
              <li>{t('chat.rules.noLinks')}</li>
            </ul>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

export default ChatPage
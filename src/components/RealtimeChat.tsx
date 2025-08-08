import React, { useState, useEffect, useRef } from 'react'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useChat } from '../hooks/useSupabaseData'
import { Send, Users, Smile, MoreVertical } from 'lucide-react'
import { logger } from '../lib/logger'

interface RealtimeChatProps {
  channel?: string
  maxHeight?: string
}

const RealtimeChat: React.FC<RealtimeChatProps> = ({ 
  channel = 'general', 
  maxHeight = 'h-96' 
}) => {
  const { user, isAuthenticated } = useUser()
  const { t } = useLanguage()
  const { data: messages, loading, error, sendMessage } = useChat(channel)
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [userScrolled, setUserScrolled] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)

  // Auto-scroll to bottom when new messages arrive (only if user hasn't scrolled up)
  useEffect(() => {
    if (!userScrolled && messages.length > 0) {
      scrollToBottom()
    }
  }, [messages, userScrolled])

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const container = chatContainerRef.current
      if (!container) return

      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      
      setUserScrolled(!isNearBottom)
      setShowScrollButton(!isNearBottom && messages.length > 0)
    }

    const container = chatContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [messages.length])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    setUserScrolled(false)
    setShowScrollButton(false)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !isAuthenticated || !user) return

    try {
      setIsTyping(true)
      await sendMessage({
        message: newMessage.trim(),
        sender_id: user.id,
        channel: channel
      })
      
      setNewMessage('')
      // Scroll to bottom when user sends a message
      setTimeout(() => scrollToBottom(), 100)
    } catch (error) {
      logger.error('Error sending chat message:', error)
    } finally {
      setIsTyping(false)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return t('time.today')
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('time.yesterday')
    } else {
      return date.toLocaleDateString('de-DE')
    }
  }

  const groupMessagesByDate = () => {
    const groups: { [key: string]: typeof messages } = {}
    
    messages.forEach(message => {
      const date = new Date(message.created_at).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    
    return Object.entries(groups).sort(([a], [b]) => 
      new Date(a).getTime() - new Date(b).getTime()
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32 text-red-500">
        <p>{t('chat.errorLoading')}: {error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-slate-800 rounded-lg shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <h3 className="font-semibold text-white">
            {channel === 'general' ? t('chat.communityChat') : `#${channel}`}
          </h3>
          <span className="text-slate-300 text-sm">
            <Users className="w-4 h-4 inline mr-1" />
            {messages.length > 0 && `${new Set(messages.map(m => m.user_id)).size} ${t('chat.activeUsers')}`}
          </span>
        </div>
        <button className="text-slate-300 hover:text-white transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${maxHeight} relative`}
      >
        {loading ? (
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
            <span className="ml-2 text-slate-400">{t('chat.loading')}</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            <p>{t('chat.noMessages')}</p>
            <p className="text-sm mt-2">{t('chat.startConversation')}</p>
          </div>
        ) : (
          groupMessagesByDate().map(([dateString, dayMessages]) => (
            <div key={dateString}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-slate-600 text-slate-300 px-3 py-1 rounded-full text-sm">
                  {formatDate(dayMessages[0].created_at)}
                </div>
              </div>

              {/* Messages for this date */}
              {dayMessages.map((message, index) => {
                const isCurrentUser = message.user_id === user?.id
                const showAvatar = index === 0 || dayMessages[index - 1].user_id !== message.user_id
                
                return (
                  <div 
                    key={message.id}
                    className={`flex items-start space-x-3 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div className={`flex-shrink-0 ${showAvatar ? 'visible' : 'invisible'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCurrentUser 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-slate-600 text-slate-200'
                      }`}>
                        {message.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className={`flex-1 ${isCurrentUser ? 'text-right' : ''}`}>
                      {showAvatar && (
                        <div className={`flex items-center space-x-2 mb-1 ${isCurrentUser ? 'justify-end' : ''}`}>
                          <span className="text-sm font-medium text-slate-300">
                            {message.username || 'Anonymous'}
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatTime(message.created_at)}
                          </span>
                        </div>
                      )}
                      
                      <div className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        isCurrentUser
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-slate-700 text-slate-100 rounded-bl-md'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
        
        <div ref={messagesEndRef} />

        {/* Scroll to Bottom Button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-20 right-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 z-10"
            title={t('chat.scrollToBottom')}
          >
            ↓
          </button>
        )}
      </div>

      {/* Message Input */}
      {isAuthenticated ? (
        <form onSubmit={handleSendMessage} className="p-4 bg-slate-700 border-t border-slate-600">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="text-slate-400 hover:text-slate-200 transition-colors"
              title={t('chat.emoji')}
            >
              <Smile className="w-5 h-5" />
            </button>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('chat.typeMessage')}
              className="flex-1 bg-slate-600 text-white placeholder-slate-400 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              maxLength={500}
              disabled={isTyping}
            />
            
            <button
              type="submit"
              disabled={!newMessage.trim() || isTyping}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white p-2 rounded-full transition-all duration-200"
              title={t('chat.send')}
            >
              {isTyping ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {/* Character Count */}
          <div className="text-xs text-slate-400 mt-1 text-right">
            {newMessage.length}/500
          </div>
        </form>
      ) : (
        <div className="p-4 bg-slate-700 border-t border-slate-600 text-center">
                      <p className="text-slate-400">{t('auth.loginRequired')}</p>
        </div>
      )}
    </div>
  )
}

export default RealtimeChat
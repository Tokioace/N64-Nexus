import React, { useState, useEffect, useRef } from 'react'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import { usePoints } from '../contexts/PointsContext'
import { Send, Users, MessageCircle, Star, Info } from 'lucide-react'

interface ChatMessage {
  id: string
  userId: string
  username: string
  avatar: string
  message: string
  timestamp: Date
  userPoints?: number
}

const ChatPage: React.FC = () => {
  const { user, isAuthenticated } = useUser()
  const { t } = useLanguage()
  const { userPoints, awardPoints } = usePoints()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [onlineUsers] = useState(12) // Mock online users count
  const [lastPointsTime, setLastPointsTime] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock initial messages with points
  useEffect(() => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        userId: 'user1',
        username: 'SpeedrunKing',
        avatar: '🏃',
        message: 'Hat jemand schon das neue Super Mario 64 Event ausprobiert?',
        timestamp: new Date(Date.now() - 300000),
        userPoints: 1254
      },
      {
        id: '2',
        userId: 'user2',
        username: 'N64Collector',
        avatar: '📦',
        message: 'Ja! Die Zeiten sind echt hart. Wer hat schon unter 16:20 geschafft?',
        timestamp: new Date(Date.now() - 240000),
        userPoints: 867
      },
      {
        id: '3',
        userId: 'user3',
        username: 'RetroGamer98',
        avatar: '🎮',
        message: 'Ich bin bei 16:45 hängen geblieben. Muss noch an meinen BLJs arbeiten 😅',
        timestamp: new Date(Date.now() - 180000),
        userPoints: 432
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
      userId: user.id,
      username: user.username,
      avatar: user.avatar || '🎮',
      message: newMessage.trim(),
      timestamp: new Date(),
      userPoints: userPoints?.totalPoints || 0
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

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

  return (
    <div className="w-full min-h-screen bg-slate-900 px-2 sm:px-4 py-2 sm:py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
          {/* Header - Mobile Optimized */}
          <div className="simple-tile mb-3 sm:mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100">{t('chat.title')}</h1>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mb-2">
                <Users className="w-4 h-4" />
                <span>{onlineUsers} {t('chat.onlineUsers')}</span>
              </div>
              <p className="text-slate-300 text-sm sm:text-base">{t('chat.description')}</p>
            </div>
            
            {/* Login Prompt for unauthenticated users */}
            {!isAuthenticated && (
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 sm:p-4 text-center mt-3">
                <p className="text-blue-200 text-sm sm:text-base">
                  <a href="/auth" className="text-blue-400 hover:text-blue-300 font-semibold underline">
                    {t('chat.joinPrompt')}
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* Messages Container - Mobile Optimized */}
          <div className="simple-tile flex-1 flex flex-col overflow-hidden">
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4" style={{ minHeight: 0 }}>
              {messages.map((message) => (
                <div key={message.id} className="flex gap-2 sm:gap-3">
                  {/* Avatar - Smaller on mobile */}
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-sm sm:text-lg flex-shrink-0">
                    {message.avatar}
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                      <span className="font-semibold text-slate-100 text-sm sm:text-base">
                        {message.username}
                      </span>
                      {/* Points Display - Smaller on mobile */}
                      {message.userPoints !== undefined && (
                        <div 
                          className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-yellow-600/20 border border-yellow-500/30 rounded-full text-xs text-yellow-300 cursor-help"
                          title={t('chat.pointsTooltip')}
                        >
                          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span className="hidden sm:inline">{message.userPoints.toLocaleString()} {t('chat.points')}</span>
                          <span className="sm:hidden">{message.userPoints > 999 ? `${Math.floor(message.userPoints/1000)}k` : message.userPoints}</span>
                        </div>
                      )}
                      <span className="text-xs text-slate-500">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-slate-200 break-words leading-relaxed text-sm sm:text-base">
                      {message.message}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input - Mobile Optimized */}
            {isAuthenticated ? (
              <div className="border-t border-slate-700 p-2 sm:p-4">
                <form onSubmit={handleSendMessage} className="space-y-2">
                  <div className="flex gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-sm sm:text-lg flex-shrink-0">
                      {user?.avatar || '🎮'}
                    </div>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t('chat.messagePlaceholder')}
                        className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                        maxLength={500}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white transition-colors flex items-center gap-1 sm:gap-2 justify-center min-w-[44px] sm:min-w-auto"
                      >
                        <Send className="w-4 h-4" />
                        <span className="hidden sm:inline text-sm sm:text-base">{t('chat.send')}</span>
                      </button>
                    </div>
                  </div>
                </form>
                <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                  <span>
                    {newMessage.length}/500
                    <span className="hidden sm:inline"> {t('chat.charactersLeft')} • {t('chat.beRespectful')}</span>
                  </span>
                  {userPoints && (
                    <span className="text-yellow-400 flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      <span className="hidden sm:inline">{userPoints.totalPoints.toLocaleString()} {t('chat.points')}</span>
                      <span className="sm:hidden">{userPoints.totalPoints > 999 ? `${Math.floor(userPoints.totalPoints/1000)}k` : userPoints.totalPoints}</span>
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-700 p-4 sm:p-6 text-center">
                <p className="text-slate-400 text-sm sm:text-lg">
                  <a href="/auth" className="text-blue-400 hover:text-blue-300 font-semibold">
                    {t('chat.joinPrompt')}
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* Chat Guidelines - Mobile Optimized */}
          <div className="simple-tile mt-3 sm:mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <h3 className="font-semibold text-slate-200 text-sm sm:text-lg">{t('chat.rulesTitle')}</h3>
            </div>
            <ul className="text-xs sm:text-sm text-slate-300 space-y-1 sm:space-y-2 list-disc list-inside pl-2 leading-relaxed">
              <li>{t('chat.rules.respect')}</li>
              <li>{t('chat.rules.noSpam')}</li>
              <li>{t('chat.rules.shareExperience')}</li>
              <li>{t('chat.rules.noLinks')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
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
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [isUserScrolling, setIsUserScrolling] = useState(false)

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

  // Handle scroll detection to prevent auto-scroll when user is manually scrolling
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      setIsUserScrolling(true)
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setIsUserScrolling(false)
      }, 1000)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  // Auto scroll to bottom when new messages arrive (only if user isn't scrolling)
  useEffect(() => {
    if (!isUserScrolling) {
      scrollToBottom()
    }
  }, [messages, isUserScrolling])

  const scrollToBottom = () => {
    const container = messagesContainerRef.current
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100
      if (isNearBottom || !isUserScrolling) {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        })
      }
    }
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

    // Force scroll to bottom for new messages from current user
    setIsUserScrolling(false)

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
    <div className="w-full max-w-none px-2 sm:px-4 py-4 sm:py-6" style={{ height: 'clamp(400px, calc(100vh - 120px), 900px)' }}>
      <div className="container mx-auto max-w-6xl h-full">
        <div className="flex flex-col h-full">
          {/* Header - Improved Layout */}
          <div className="simple-tile p-4 sm:p-6 mb-4 sm:mb-6 flex-shrink-0">
          <div className="relative">
            {/* CRT Mascot for larger screens */}
            <div className="hidden lg:block absolute -left-4 -top-4">
              <img 
                src="/mascot.png" 
                alt="Battle64 CRT-TV Mascot" 
                className="w-16 h-16 opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
            
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                <MessageCircle className="w-8 h-8 text-blue-400" />
                <h1 className="text-3xl font-bold text-slate-100">{t('chat.title')}</h1>
                <div className="flex items-center gap-2 text-sm text-slate-400 ml-4">
                  <Users className="w-4 h-4" />
                  <span>{onlineUsers} {t('chat.onlineUsers')}</span>
                </div>
              </div>
              <p className="text-slate-300 text-lg">{t('chat.description')}</p>
            </div>
          </div>
          
          {/* Login Prompt for unauthenticated users */}
          {!isAuthenticated && (
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 text-center flex-shrink-0 mb-4">
              <p className="text-blue-200">
                <a href="/auth" className="text-blue-400 hover:text-blue-300 font-semibold underline">
                  {t('chat.joinPrompt')}
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Messages Container - Fixed scrolling behavior */}
        <div className="simple-tile flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Messages List - Improved scrolling */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollable-container"
            style={{ 
              minHeight: 0,
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain'
            }}
          >
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  {message.avatar}
                </div>
                
                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-semibold text-slate-100">
                      {message.username}
                    </span>
                    {/* Points Display */}
                    {message.userPoints !== undefined && (
                      <div 
                        className="flex items-center gap-1 px-2 py-1 bg-yellow-600/20 border border-yellow-500/30 rounded-full text-xs text-yellow-300 cursor-help"
                        title={t('chat.pointsTooltip')}
                      >
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
            <div className="border-t border-slate-700 p-4 flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  {user?.avatar || '🎮'}
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('chat.messagePlaceholder')}
                    className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
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
            <div className="border-t border-slate-700 p-6 text-center flex-shrink-0">
              <p className="text-slate-400 text-lg">
                <a href="/auth" className="text-blue-400 hover:text-blue-300 font-semibold">
                  {t('chat.joinPrompt')}
                </a>
              </p>
            </div>
          )}
        </div>

          {/* Chat Guidelines - Improved Typography */}
          <div className="simple-tile p-4 sm:p-6 mt-4 sm:mt-6 flex-shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-slate-200 text-lg">{t('chat.rulesTitle')}</h3>
          </div>
          <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside pl-2 leading-relaxed font-['Inter',system-ui,sans-serif]">
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
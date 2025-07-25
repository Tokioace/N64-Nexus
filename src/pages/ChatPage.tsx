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
    <div className="chatWrapper w-full flex justify-center">
      <div className="max-w-[600px] w-full px-4">
        <div className="flex flex-col space-y-4 sm:space-y-6">
          {/* Header - Improved Layout */}
          <div className="simple-tile p-4 sm:p-6">
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
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 mb-4 text-center">
              <p className="text-blue-200 mb-0">
                <a href="/auth" className="text-blue-400 hover:text-blue-300 font-semibold underline">
                  {t('chat.joinPrompt')}
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Messages Container - No internal scrolling */}
        <div className="simple-tile flex flex-col">
          {/* Messages List */}
          <div className="p-4 space-y-4">
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
            <div className="border-t border-slate-700 p-4">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  {user?.avatar || '🎮'}
                </div>
                <div className="w-full flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('chat.messagePlaceholder')}
                    className="flex-grow px-4 py-2 rounded bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white transition-colors flex items-center gap-2 justify-center"
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

          {/* Chat Guidelines - Full content display */}
          <div className="simple-tile p-4 sm:p-6">
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
        </div>
      </div>
    </div>
  )
}

export default ChatPage
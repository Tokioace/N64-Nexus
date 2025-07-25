import React, { useState, useEffect, useRef } from 'react'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Send, Users, MessageCircle, Clock } from 'lucide-react'

interface ChatMessage {
  id: string
  userId: string
  username: string
  avatar: string
  message: string
  timestamp: Date
}

const ChatPage: React.FC = () => {
  const { user, isAuthenticated } = useUser()
  const { t } = useLanguage()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [onlineUsers] = useState(12) // Mock online users count
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock initial messages
  useEffect(() => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        userId: 'user1',
        username: 'SpeedrunKing',
        avatar: '🏃',
        message: 'Hat jemand schon das neue Super Mario 64 Event ausprobiert?',
        timestamp: new Date(Date.now() - 300000)
      },
      {
        id: '2',
        userId: 'user2',
        username: 'N64Collector',
        avatar: '📦',
        message: 'Ja! Die Zeiten sind echt hart. Wer hat schon unter 16:20 geschafft?',
        timestamp: new Date(Date.now() - 240000)
      },
      {
        id: '3',
        userId: 'user3',
        username: 'RetroGamer98',
        avatar: '🎮',
        message: 'Ich bin bei 16:45 hängen geblieben. Muss noch an meinen BLJs arbeiten 😅',
        timestamp: new Date(Date.now() - 180000)
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !isAuthenticated || !user) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      avatar: user.avatar || '🎮',
      message: newMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
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
          <div className="container mx-auto px-4 py-6" style={{ height: 'clamp(400px, calc(100vh - 120px), 800px)' }}>
      <div className="flex flex-col h-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="simple-tile p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-slate-100">Community Chat</h1>
                <p className="text-slate-400">Chatte mit anderen N64-Fans</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Users className="w-4 h-4" />
              <span>{onlineUsers} online</span>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="simple-tile flex-1 flex flex-col p-0 overflow-hidden">
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  {message.avatar}
                </div>
                
                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-100">
                      {message.username}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-slate-200 break-words">
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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  {user?.avatar || '🎮'}
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Schreibe eine Nachricht..."
                    className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
              <div className="text-xs text-slate-500 mt-2">
                {newMessage.length}/500 Zeichen • Sei respektvoll und freundlich
              </div>
            </div>
          ) : (
            <div className="border-t border-slate-700 p-4 text-center">
              <p className="text-slate-400">
                <a href="/auth" className="text-blue-400 hover:text-blue-300">
                  Melde dich an
                </a>
                {' '}um am Chat teilzunehmen
              </p>
            </div>
          )}
        </div>

        {/* Chat Guidelines */}
        <div className="simple-tile p-4 mt-4">
          <h3 className="font-semibold text-slate-200 mb-2">Chat-Regeln</h3>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• Sei respektvoll und freundlich zu anderen Mitgliedern</li>
            <li>• Keine Beleidigungen, Spam oder Off-Topic-Diskussionen</li>
            <li>• Teile deine N64-Erfahrungen und hilf anderen Spielern</li>
            <li>• Verwende keine externen Links ohne Kontext</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
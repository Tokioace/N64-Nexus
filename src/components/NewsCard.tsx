import React, { useState } from 'react'
import { TrendingUp } from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  content: string
  date: Date
  type: 'event_winner' | 'n64_history' | 'community_news' | 'event_announcement'
}

interface NewsCardProps {
  newsItem: NewsItem
  index: number
}

const NewsCard: React.FC<NewsCardProps> = ({ newsItem, index }) => {
  const [showMessage, setShowMessage] = useState(false)
  const [messageText, setMessageText] = useState('')

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCardClick = () => {
    const messages = [
      '📰 News gelesen!',
      '✨ Interessant!',
      '🎮 N64 News!',
      '📱 Artikel geöffnet!',
      '🎯 News entdeckt!',
      '⭐ Mehr erfahren!',
      '🔥 Hot News!',
      '💫 News geladen!'
    ]
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    setMessageText(randomMessage)
    setShowMessage(true)
    
    // Hide message after 2 seconds
    setTimeout(() => {
      setShowMessage(false)
    }, 2000)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event_winner':
        return 'text-yellow-400'
      case 'n64_history':
        return 'text-purple-400'
      case 'community_news':
        return 'text-blue-400'
      case 'event_announcement':
        return 'text-green-400'
      default:
        return 'text-slate-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'event_winner':
        return '🏆'
      case 'n64_history':
        return '🎮'
      case 'community_news':
        return '📢'
      case 'event_announcement':
        return '📅'
      default:
        return '📰'
    }
  }

  return (
    <div 
      className="swipeable-card bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-l-4 border-blue-400 relative cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
      onClick={handleCardClick}
    >
      <div className="swipeable-card-header">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h3 className="text-responsive-base font-bold text-slate-100">
            {getTypeIcon(newsItem.type)} News #{index + 1}
          </h3>
        </div>
        <div className="text-xs text-slate-400">
          <span className={`capitalize ${getTypeColor(newsItem.type)}`}>
            {newsItem.type.replace('_', ' ')}
          </span>
        </div>
      </div>
      
      <div className="swipeable-card-content">
        <div className="swipeable-item p-3 h-full flex flex-col">
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-slate-100 mb-2 line-clamp-2">
              {newsItem.title}
            </h4>
            <p className="text-xs text-slate-300 mb-3 line-clamp-4">
              {newsItem.content}
            </p>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{formatTime(newsItem.date)}</span>
            <span className="text-blue-400">Klicken für mehr</span>
          </div>
        </div>
      </div>

      {/* Click Message Overlay */}
      {showMessage && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 transition-opacity duration-300">
          <div className="bg-slate-800/90 border border-slate-600 rounded-lg px-4 py-3 text-center backdrop-blur-sm">
            <p className="text-slate-100 text-sm font-medium">{messageText}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewsCard
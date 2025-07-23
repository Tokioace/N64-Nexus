import React from 'react'
import { TrendingUp, X } from 'lucide-react'

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
  onDismiss?: () => void
  isAnimating?: boolean
}

const NewsCard: React.FC<NewsCardProps> = ({ newsItem, index, onDismiss, isAnimating = false }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    })
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
    <div className={`swipeable-card bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-l-4 border-blue-400 relative transition-all duration-300 ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
      {/* Dismiss Button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white transition-colors"
          aria-label="Dismiss news"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      
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
        <div className="p-3 h-full flex flex-col">
          <div className="flex-1">
            <h4 className="text-sm sm:text-base font-semibold text-slate-100 mb-2 leading-tight">
              {newsItem.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mb-3 leading-relaxed">
              {newsItem.content}
            </p>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-auto">
            <span>{formatTime(newsItem.date)}</span>
            <span className="text-blue-400">News Details</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsCard
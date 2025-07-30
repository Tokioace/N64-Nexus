import React from 'react'
import { Newspaper, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLanguage, getLocaleString } from '../contexts/LanguageContext'

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
  const { t, currentLanguage } = useLanguage()
  const navigate = useNavigate()
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(getLocaleString(currentLanguage), {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking the dismiss button
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    navigate('/newsfeed')
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event_winner':
        return 'text-blue-400'
      case 'n64_history':
        return 'text-blue-300'
      case 'community_news':
        return 'text-blue-400'
      case 'event_announcement':
        return 'text-blue-500'
      default:
        return 'text-slate-400'
    }
  }

  const getTypeTranslation = (type: string) => {
    switch (type) {
      case 'event_winner':
        return t('news.type.eventWinner')
      case 'n64_history':
        return t('news.type.n64History')
      case 'community_news':
        return t('news.type.communityNews')
      case 'event_announcement':
        return t('news.type.eventAnnouncement')
      default:
        return t('news.type.general')
    }
  }

  return (
    <div 
      className={`compact-card relative transition-all duration-300 cursor-pointer ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}
      onClick={handleCardClick}
    >
      {/* Event Winner Label - Compact */}
      {newsItem.type === 'event_winner' && (
        <div className="absolute top-0 left-0 bg-blue-500 text-white compact-text-xs px-2 py-1 rounded-tl-lg rounded-br-lg font-medium">
          {t('news.eventWinnerLabel')}
        </div>
      )}
      
      {/* Dismiss Button - Compact */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`absolute top-2 z-10 p-1 rounded-full bg-black/50 text-slate-300 hover:bg-black/70 hover:text-white transition-colors ${
            newsItem.type === 'event_winner' ? 'left-2' : 'right-2'
          }`}
          aria-label={t('aria.dismissNews')}
        >
          <X className="w-3 h-3" />
        </button>
      )}
      
      <div className="compact-card-header">
        <div className="flex items-center gap-2">
          <Newspaper className="w-3 h-3 text-blue-400" />
          <h3 className="compact-card-title">
            {t('news.title')} #{index + 1}
          </h3>
        </div>
        <div className="compact-text-xs text-slate-400">
          <span className={`capitalize ${getTypeColor(newsItem.type)}`}>
            {getTypeTranslation(newsItem.type)}
          </span>
        </div>
      </div>
      
      <div className="compact-card-content">
        <div className="space-y-2">
          <h4 className="compact-text-sm font-semibold text-slate-100 leading-tight line-clamp-2">
            {newsItem.title}
          </h4>
          <p className="compact-text-xs text-slate-300 leading-relaxed line-clamp-3">
            {newsItem.content}
          </p>
          <div className="border-t border-slate-600/20 pt-2 mt-3">
            <div className="flex items-center justify-between compact-text-xs text-slate-400">
              <span className="font-medium">{formatTime(newsItem.date)}</span>
              <span className="text-blue-400 font-medium">{t('ui.newsDetails')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsCard
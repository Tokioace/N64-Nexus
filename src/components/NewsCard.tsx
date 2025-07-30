import React from 'react'
import { Newspaper, X } from 'lucide-react'
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
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(getLocaleString(currentLanguage), {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event_winner':
        return 'text-accent-yellow'
      case 'n64_history':
        return 'text-accent-purple'
      case 'community_news':
        return 'text-accent-blue'
      case 'event_announcement':
        return 'text-accent-green'
      default:
        return 'text-text-muted'
    }
  }

  const getCardClass = (type: string) => {
    switch (type) {
      case 'event_winner':
        return 'card-event-winner'
      case 'n64_history':
        return 'card-news-post'
      case 'community_news':
        return 'card-community-update'
      case 'event_announcement':
        return 'card-live-event'
      default:
        return 'card-news-post'
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
    <div className={`swipeable-card ${getCardClass(newsItem.type)} relative transition-all duration-300 ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
      {/* Event Winner Label */}
      {newsItem.type === 'event_winner' && (
        <div className="news-event-winner-label">
          {t('news.eventWinnerLabel')}
        </div>
      )}
      
      {/* Dismiss Button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`absolute top-2 z-10 p-1 rounded-full transition-colors ${
            newsItem.type === 'event_winner' ? 'left-2' : 'right-2'
          }`}
          style={{
            backgroundColor: 'rgba(46, 47, 64, 0.8)',
            color: '#CCCCCC'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(58, 60, 85, 0.8)'
            e.currentTarget.style.color = '#FFFFFF'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(46, 47, 64, 0.8)'
            e.currentTarget.style.color = '#CCCCCC'
          }}
          aria-label={t('aria.dismissNews')}
        >
          <X className="w-4 h-4" />
        </button>
      )}
      
      <div className="swipeable-card-header">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-accent-blue" />
          <h3 className="text-responsive-base font-bold text-text-primary">
            {t('news.title')} #{index + 1}
          </h3>
        </div>
        <div className="text-xs text-text-muted">
          <span className={`capitalize ${getTypeColor(newsItem.type)}`}>
            {getTypeTranslation(newsItem.type)}
          </span>
        </div>
      </div>
      
      <div className="swipeable-card-content">
        <div className="p-4 h-full flex flex-col">
          <div className="flex-1">
            <h4 className="text-base sm:text-lg font-semibold text-text-primary mb-3 leading-tight">
              {newsItem.title}
            </h4>
            <p className="text-base text-text-secondary mb-4 leading-relaxed line-clamp-2">
              {newsItem.content}
            </p>
          </div>
          <div className="border-t border-slate-600/30 pt-3 mt-auto">
            <div className="flex items-center justify-between text-sm text-text-muted">
              <span className="font-medium">{formatTime(newsItem.date)}</span>
              <span className="text-accent-blue font-medium">{t('ui.newsDetails')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsCard
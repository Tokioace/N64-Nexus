import React, { memo, useMemo, useCallback } from 'react'
import { useForum } from '../contexts/ForumContext'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  MessageSquare, 
  Users, 
  Clock, 
  TrendingUp,
  Zap,
  Calendar,
  Brain,
  Package
} from 'lucide-react'
import { Link } from 'react-router-dom'

const ForumPage: React.FC = () => {
  const { categories, stats, loading, selectCategory } = useForum()
  const { user } = useUser()
  const { t } = useLanguage()

  const getIconComponent = useCallback((iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
      case 'Calendar': return <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
      case 'Brain': return <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
      case 'Package': return <Package className="w-5 h-5 sm:w-6 sm:h-6" />
      case 'Users': return <Users className="w-5 h-5 sm:w-6 sm:h-6" />
      default: return <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
    }
  }, [])

  const getColorClasses = useCallback((color: string) => {
    switch (color) {
      case 'red': return 'text-red-400 border-red-600 bg-red-900/20'
      case 'blue': return 'text-blue-400 border-blue-600 bg-blue-900/20'
      case 'purple': return 'text-purple-400 border-purple-600 bg-purple-900/20'
      case 'green': return 'text-green-400 border-green-600 bg-green-900/20'
      case 'yellow': return 'text-yellow-400 border-yellow-600 bg-yellow-900/20'
      default: return 'text-slate-400 border-slate-600 bg-slate-900/20'
    }
  }, [])

  const formatDate = useCallback((date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }, [])

  // Memoize the stats cards to prevent unnecessary re-renders
  const statsCards = useMemo(() => [
    {
      icon: <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mx-auto" />,
      value: stats.totalThreads,
      label: t('forum.threads')
    },
    {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mx-auto" />,
      value: stats.totalPosts,
      label: t('forum.posts')
    },
    {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mx-auto" />,
      value: stats.totalMembers,
      label: t('community.members')
    },
    {
      icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mx-auto" />,
      value: stats.mostActiveCategory,
      label: t('forum.mostActive')
    }
  ], [stats, t])

  if (loading) {
    return (
      <div className="container-lg py-responsive space-responsive responsive-max-width responsive-overflow-hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">{t('forum.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-lg py-responsive space-responsive responsive-max-width responsive-overflow-hidden">
      {/* Header */}
      <div className="text-center mb-responsive responsive-max-width">
        <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 mx-auto mb-4" />
        <h1 className="text-responsive-2xl font-bold text-slate-100 mb-2 responsive-word-break">
          {t('forum.communityNexus')}
        </h1>
        <p className="text-responsive-base text-slate-400 responsive-word-break px-2">
          {t('forum.discussWithCommunity')}
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid-auto-fit mb-responsive responsive-max-width">
        {statsCards.map((stat, index) => (
          <div key={index} className="simple-tile simple-tile-small">
            <div className="simple-tile-icon">
              {stat.icon}
            </div>
            <div className="simple-tile-label">
              <div className="text-responsive-lg font-bold text-slate-100">{stat.value}</div>
              <div className="text-responsive-xs text-slate-400 responsive-word-break">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 responsive-max-width">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/forum/category/${category.id}`}
            onClick={() => selectCategory(category)}
            className="simple-tile block hover:scale-105 transition-transform duration-200 responsive-max-width"
          >
            <div className="simple-tile-header">
              <div className="flex items-center justify-between">
                <div className={`flex items-center space-x-2 sm:space-x-3 ${getColorClasses(category.color)}`}>
                  <div className="p-2 rounded-lg border flex-shrink-0">
                    {getIconComponent(category.icon)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-100 responsive-word-break">{category.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 responsive-word-break">{category.description}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="simple-tile-content">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-slate-400">
                  <span>{category.threadCount} Threads</span>
                </div>
              </div>
              
              {category.lastPost && (
                <div className="border-t border-slate-700 pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-slate-100 truncate responsive-word-break">
                        {category.lastPost.threadTitle}
                      </div>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-slate-400 mt-1">
                        <span className="responsive-word-break">von {category.lastPost.authorName}</span>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span className="text-xs">{formatDate(category.lastPost.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Welcome Message for New Users */}
      {user && (
        <div className="mt-responsive simple-tile responsive-max-width">
          <div className="simple-tile-header">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
              <span className="font-medium text-blue-400 text-sm sm:text-base responsive-word-break">{t('forum.title')}!</span>
            </div>
          </div>
          <div className="simple-tile-content">
            <p className="text-slate-300 mb-3 text-sm sm:text-base responsive-word-break">
              {t('forum.welcomeMessage').replace('{username}', user.username)}
            </p>
            <div className="text-xs sm:text-sm text-slate-400 responsive-word-break">
              <strong>{t('common.note')}:</strong> {t('forum.publicNotice')}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(ForumPage)
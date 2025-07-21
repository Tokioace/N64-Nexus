import React, { memo } from 'react'
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

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-6 h-6" />
      case 'Calendar': return <Calendar className="w-6 h-6" />
      case 'Brain': return <Brain className="w-6 h-6" />
      case 'Package': return <Package className="w-6 h-6" />
      case 'Users': return <Users className="w-6 h-6" />
      default: return <MessageSquare className="w-6 h-6" />
    }
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red': return 'text-red-400 border-red-600 bg-red-900/20'
      case 'blue': return 'text-blue-400 border-blue-600 bg-blue-900/20'
      case 'purple': return 'text-purple-400 border-purple-600 bg-purple-900/20'
      case 'green': return 'text-green-400 border-green-600 bg-green-900/20'
      case 'yellow': return 'text-yellow-400 border-yellow-600 bg-yellow-900/20'
      default: return 'text-slate-400 border-slate-600 bg-slate-900/20'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-slate-400">{t('forum.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-100 mb-2">
          🎮 {t('forum.communityNexus')}
        </h1>
        <p className="text-slate-400 text-lg">
          {t('forum.discussWithCommunity')}
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <MessageSquare className="w-6 h-6 text-blue-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="text-xl font-bold text-slate-100">{stats.totalThreads}</div>
            <div className="text-sm text-slate-400">{t('forum.threads')}</div>
          </div>
        </div>
        
        <div className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <Users className="w-6 h-6 text-green-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="text-xl font-bold text-slate-100">{stats.totalPosts}</div>
            <div className="text-sm text-slate-400">{t('forum.posts')}</div>
          </div>
        </div>
        
        <div className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <Users className="w-6 h-6 text-purple-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="text-xl font-bold text-slate-100">{stats.totalMembers}</div>
                          <div className="text-sm text-slate-400">{t('community.members')}</div>
          </div>
        </div>
        
        <div className="simple-tile simple-tile-small">
          <div className="simple-tile-icon">
            <TrendingUp className="w-6 h-6 text-yellow-400 mx-auto" />
          </div>
          <div className="simple-tile-label">
            <div className="text-xl font-bold text-slate-100">{stats.mostActiveCategory}</div>
                          <div className="text-sm text-slate-400">{t('forum.mostActive')}</div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/forum/category/${category.id}`}
            onClick={() => selectCategory(category)}
            className="simple-tile block"
          >
            <div className="simple-tile-header">
              <div className="flex items-center justify-between">
                <div className={`flex items-center space-x-3 ${getColorClasses(category.color)}`}>
                  <div className="p-2 rounded-lg border">
                    {getIconComponent(category.icon)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">{category.name}</h3>
                    <p className="text-sm text-slate-400">{category.description}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="simple-tile-content">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <span>{category.threadCount} Threads</span>
                </div>
              </div>
              
              {category.lastPost && (
                <div className="border-t border-slate-700 pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-100 truncate">
                        {category.lastPost.threadTitle}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                        <span>von {category.lastPost.authorName}</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(category.lastPost.createdAt)}</span>
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
        <div className="mt-8 simple-tile">
          <div className="simple-tile-header">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="font-medium text-blue-400">{t('forum.title')}!</span>
            </div>
          </div>
          <div className="simple-tile-content">
            <p className="text-slate-300 mb-3">
              {t('forum.welcomeMessage').replace('{username}', user.username)}
            </p>
            <div className="text-sm text-slate-400">
              <strong>{t('common.note')}:</strong> {t('forum.publicNotice')}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(ForumPage)
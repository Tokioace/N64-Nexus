import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForum } from '../contexts/ForumContext'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  MessageSquare, 
  Clock, 
  Eye, 
  Pin,
  Lock,
  Plus,
  ArrowLeft,
  User,
  AlertCircle
} from 'lucide-react'

const ForumCategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>()
  const { 
    categories,
    threads, 
    selectedCategory,
    loading, 
    error,
    selectCategory,
    getThreadsByCategory
  } = useForum()
  const { isAuthenticated } = useUser()
  const { t } = useLanguage()

  useEffect(() => {
    if (categoryId) {
      // Find the category in the categories array
      const category = categories.find(c => c.id === categoryId)
      if (category) {
        selectCategory(category)
        getThreadsByCategory(categoryId)
      }
    }
  }, [categoryId, categories, selectCategory, getThreadsByCategory])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <div className="text-red-400">⚡</div>
      case 'Calendar': return <div className="text-blue-400">📅</div>
      case 'Brain': return <div className="text-purple-400">🧠</div>
      case 'Package': return <div className="text-green-400">📦</div>
      case 'Users': return <div className="text-yellow-400">👥</div>
      default: return <MessageSquare className="w-6 h-6" />
    }
  }

  const sortedThreads = threads
    .filter(thread => thread.categoryId === categoryId)
    .sort((a, b) => {
      // Pinned threads first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      // Then by last updated
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-slate-400">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="simple-tile text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100 mb-2">{t('error.title')}</h2>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    )
  }

  if (!selectedCategory) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="simple-tile text-center">
          <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100 mb-2">{t('forum.categoryNotFound')}</h2>
          <p className="text-slate-400">Die angeforderte Kategorie existiert nicht.</p>
          <Link 
            to="/forum" 
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zum Forum
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back to Forum */}
      <div className="mb-6">
        <Link 
          to="/forum" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors py-2 px-1 -mx-1 rounded-lg hover:bg-slate-700/50 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm sm:text-base">{t('common.back')} zum Forum</span>
        </Link>
      </div>

      {/* Category Header */}
      <div className="simple-tile mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="p-2 sm:p-3 rounded-lg border border-slate-600 flex-shrink-0">
              {getIconComponent(selectedCategory.icon)}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100 break-words">
                {selectedCategory.name}
              </h1>
              <p className="text-slate-400 mt-1 text-sm sm:text-base break-words">
                {selectedCategory.description}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                <span className="whitespace-nowrap">{selectedCategory.threadCount} {t('forum.threads')}</span>
              </div>
            </div>
          </div>

          {/* New Thread Button */}
          {isAuthenticated && (
            <Link
              to={`/forum/category/${categoryId}/new-thread`}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              <span>{t('forum.newThread')}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Threads List */}
      {sortedThreads.length === 0 ? (
        <div className="simple-tile text-center py-12">
          <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
                            {t('forum.noThreads')}
          </h3>
          <p className="text-slate-400 mb-4">
                          {t('forum.createFirstThread')}
          </p>
          {isAuthenticated && (
            <Link
              to={`/forum/category/${categoryId}/new-thread`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
                              <span>{t('forum.firstThread')}</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {sortedThreads.map((thread) => (
            <Link
              key={thread.id}
              to={`/forum/thread/${thread.id}`}
              className="simple-tile block hover:border-blue-500/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Thread Icons */}
                  <div className="flex items-center gap-1 flex-shrink-0 pt-1">
                    {thread.isPinned && (
                      <Pin className="w-4 h-4 text-yellow-400" />
                    )}
                    {thread.isLocked ? (
                      <Lock className="w-4 h-4 text-red-400" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  {/* Thread Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                      <h3 className="font-semibold text-slate-100 break-words text-sm sm:text-base">
                        {thread.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        {thread.isPinned && (
                          <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 text-xs rounded-full whitespace-nowrap">
                            Angepinnt
                          </span>
                        )}
                        {thread.isLocked && (
                          <span className="px-2 py-1 bg-red-600/20 text-red-400 text-xs rounded-full whitespace-nowrap">
                            Geschlossen
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 flex-shrink-0" />
                        <span className="break-words">{thread.authorName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className="whitespace-nowrap">{formatDate(thread.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thread Stats & Last Post */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  {/* Thread Stats */}
                  <div className="flex items-center gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 text-white">
                      <MessageSquare className="w-4 h-4 text-white flex-shrink-0" />
                      <span className="whitespace-nowrap">{thread.postCount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white">
                      <Eye className="w-4 h-4 text-white flex-shrink-0" />
                      <span className="whitespace-nowrap">{thread.views}</span>
                    </div>
                  </div>

                  {/* Last Post */}
                  {thread.lastPost && (
                    <div className="text-left sm:text-right text-xs sm:text-sm text-slate-400 min-w-0">
                      <div className="break-words sm:truncate">
                        {t('forum.createdBy')} {thread.lastPost.authorName}
                      </div>
                      <div className="text-xs whitespace-nowrap">
                        {formatDate(thread.lastPost.createdAt)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Login Prompt */}
      {!isAuthenticated && (
        <div className="simple-tile text-center mt-6">
          <p className="text-slate-400">
            <Link to="/auth" className="text-blue-400 hover:text-blue-300">
                              {t('auth.login')}
            </Link>
            {' '}{t('forum.loginToCreateThreads')}
          </p>
        </div>
      )}
    </div>
  )
}

export default ForumCategoryPage
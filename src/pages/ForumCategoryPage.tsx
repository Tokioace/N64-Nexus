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
          <h2 className="text-xl font-bold text-slate-100 mb-2">Kategorie nicht gefunden</h2>
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
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')} zum Forum
        </Link>
      </div>

      {/* Category Header */}
      <div className="simple-tile mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg border border-slate-600">
              {getIconComponent(selectedCategory.icon)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-100">
                {selectedCategory.name}
              </h1>
              <p className="text-slate-400 mt-1">
                {selectedCategory.description}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                <span>{selectedCategory.threadCount} Threads</span>
              </div>
            </div>
          </div>

          {/* New Thread Button */}
          {isAuthenticated && (
            <Link
              to={`/forum/category/${categoryId}/new-thread`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Neuer Thread</span>
            </Link>
          )}
        </div>
      </div>

      {/* Threads List */}
      {sortedThreads.length === 0 ? (
        <div className="simple-tile text-center py-12">
          <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            Noch keine Threads
          </h3>
          <p className="text-slate-400 mb-4">
            Sei der Erste, der in dieser Kategorie einen Thread erstellt!
          </p>
          {isAuthenticated && (
            <Link
              to={`/forum/category/${categoryId}/new-thread`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Ersten Thread erstellen</span>
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
              <div className="flex items-center gap-4">
                {/* Thread Icons */}
                <div className="flex items-center gap-1">
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
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-100 truncate">
                      {thread.title}
                    </h3>
                    {thread.isPinned && (
                      <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 text-xs rounded-full">
                        Angepinnt
                      </span>
                    )}
                    {thread.isLocked && (
                      <span className="px-2 py-1 bg-red-600/20 text-red-400 text-xs rounded-full">
                        Geschlossen
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{thread.authorName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(thread.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Thread Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1 text-slate-400">
                    <MessageSquare className="w-4 h-4" />
                    <span>{thread.postCount}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Eye className="w-4 h-4" />
                    <span>{thread.views}</span>
                  </div>
                </div>

                {/* Last Post */}
                {thread.lastPost && (
                  <div className="text-right text-sm text-slate-400 min-w-0">
                    <div className="truncate">
                      von {thread.lastPost.authorName}
                    </div>
                    <div className="text-xs">
                      {formatDate(thread.lastPost.createdAt)}
                    </div>
                  </div>
                )}
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
              Melde dich an
            </Link>
            {' '}um neue Threads zu erstellen und zu antworten
          </p>
        </div>
      )}
    </div>
  )
}

export default ForumCategoryPage
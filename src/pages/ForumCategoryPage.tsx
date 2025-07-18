import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useForum } from '../contexts/ForumContext'
import { useUser } from '../contexts/UserContext'
import { 
  ArrowLeft, 
  Plus, 
  MessageSquare, 
  Eye, 
  Clock, 
  Pin,
  Lock,
  Search,
  Filter
} from 'lucide-react'

const ForumCategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()
  const { categories, threads, loading, selectedCategory, selectCategory, selectThread } = useForum()
  const { user } = useUser()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'oldest'>('recent')

  useEffect(() => {
    if (categoryId) {
      const category = categories.find(c => c.id === categoryId)
      if (category) {
        selectCategory(category)
      }
    }
  }, [categoryId, categories, selectCategory])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'vor wenigen Minuten'
    if (diffInHours < 24) return `vor ${diffInHours}h`
    if (diffInHours < 48) return 'gestern'
    return formatDate(date)
  }

  const filteredAndSortedThreads = threads
    .filter(thread => 
      thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.authorName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.views - a.views
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'recent':
        default:
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      }
    })

  const handleThreadClick = (thread: any) => {
    selectThread(thread)
    navigate(`/forum/thread/${thread.id}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-slate-400">Threads werden geladen...</p>
        </div>
      </div>
    )
  }

  if (!selectedCategory) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-slate-400">Kategorie nicht gefunden</p>
          <Link to="/forum" className="btn-primary mt-4 inline-block">
            Zurück zum Forum
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link to="/forum" className="btn-secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">
              {selectedCategory.name}
            </h1>
            <p className="text-slate-400">{selectedCategory.description}</p>
          </div>
        </div>
        
        {user && (
          <Link to={`/forum/category/${categoryId}/new-thread`} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Neues Thema
          </Link>
        )}
      </div>

      {/* Search and Filter */}
      <div className="simple-tile mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Threads durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-400"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular' | 'oldest')}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-400"
            >
              <option value="recent">Neueste Aktivität</option>
              <option value="popular">Beliebteste</option>
              <option value="oldest">Älteste</option>
            </select>
          </div>
        </div>
      </div>

      {/* Thread List */}
      <div className="space-y-4">
        {filteredAndSortedThreads.length === 0 ? (
          <div className="simple-tile text-center py-12">
            <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-100 mb-2">
              {searchTerm ? 'Keine Threads gefunden' : 'Noch keine Threads'}
            </h3>
            <p className="text-slate-400 mb-4">
              {searchTerm 
                ? 'Versuche es mit anderen Suchbegriffen.'
                : 'Sei der Erste und erstelle ein neues Thema!'
              }
            </p>
            {user && !searchTerm && (
              <Link to={`/forum/category/${categoryId}/new-thread`} className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Erstes Thema erstellen
              </Link>
            )}
          </div>
        ) : (
          filteredAndSortedThreads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => handleThreadClick(thread)}
              className="simple-tile hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {thread.isPinned && (
                      <Pin className="w-4 h-4 text-yellow-400" />
                    )}
                    {thread.isLocked && (
                      <Lock className="w-4 h-4 text-red-400" />
                    )}
                    <h3 className="text-lg font-bold text-slate-100 hover:text-blue-400 transition-colors">
                      {thread.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                    <span>von {thread.authorName}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatRelativeTime(thread.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-slate-400">
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{thread.postCount} Beiträge</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{thread.views} Aufrufe</span>
                    </div>
                  </div>
                </div>
                
                {thread.lastPost && (
                  <div className="text-right text-sm text-slate-400 min-w-0 ml-4">
                    <div className="text-slate-300 font-medium truncate">
                      {thread.lastPost.authorName}
                    </div>
                    <div className="flex items-center space-x-1 justify-end">
                      <Clock className="w-3 h-3" />
                      <span>{formatRelativeTime(thread.lastPost.createdAt)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Category Stats */}
      <div className="mt-8 simple-tile">
        <div className="simple-tile-header">
          <h3 className="text-lg font-bold text-slate-100">Kategorie-Statistiken</h3>
        </div>
        <div className="simple-tile-content">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{threads.length}</div>
              <div className="text-sm text-slate-400">Threads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {threads.reduce((sum, thread) => sum + thread.postCount, 0)}
              </div>
              <div className="text-sm text-slate-400">Beiträge</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {threads.reduce((sum, thread) => sum + thread.views, 0)}
              </div>
              <div className="text-sm text-slate-400">Aufrufe</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {new Set(threads.map(t => t.authorId)).size}
              </div>
              <div className="text-sm text-slate-400">Autoren</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForumCategoryPage
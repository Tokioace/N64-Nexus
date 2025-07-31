import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForum } from '../contexts/ForumContext'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import ImageUpload from '../components/ImageUpload'
import { 
  MessageSquare, 
  Clock, 
  Eye, 
  Pin,
  Lock,
  Reply,
  ArrowLeft,
  Send,
  User,
  AlertCircle
} from 'lucide-react'

const ForumThreadPage: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>()
  const { 
    selectedThread, 
    posts, 
    loading, 
    error,
    selectThread,
    createPost,
    getThreadById
  } = useForum()
  const { user, isAuthenticated } = useUser()
  const { t } = useLanguage()
  // const navigate = useNavigate() // Reserved for future navigation features
  
  const [replyContent, setReplyContent] = useState('')
  const [replyImageUrl, setReplyImageUrl] = useState<string>('')
  const [, setReplyImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)

  useEffect(() => {
    if (threadId) {
      // Find the thread in the threads array
      const thread = getThreadById(threadId)
      if (thread) {
        selectThread(thread)
      }
    }
  }, [threadId, getThreadById, selectThread])

  const handleSubmitReply = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!threadId || !replyContent.trim() || !isAuthenticated) return

    setIsSubmitting(true)
    const success = await createPost(threadId, replyContent.trim(), replyImageUrl || undefined)
    
    if (success) {
      setReplyContent('')
      setReplyImageUrl('')
      setReplyImageFile(null)
      setShowReplyForm(false)
    }
    setIsSubmitting(false)
  }, [threadId, replyContent, isAuthenticated, createPost, replyImageUrl])

  const formatDate = useCallback((date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }, [])

  const handleReplyImageSelect = useCallback((url: string, file: File) => {
    setReplyImageUrl(url)
    setReplyImageFile(file)
  }, [])

  const handleReplyImageRemove = useCallback(() => {
    setReplyImageUrl('')
    setReplyImageFile(null)
  }, [])

  // Memoize the filtered and sorted posts to prevent unnecessary recalculations
  const threadPosts = useMemo(() => {
    return posts.filter(post => post.threadId === threadId && !post.isDeleted)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }, [posts, threadId])

  // Memoize form reset function
  const resetReplyForm = useCallback(() => {
    setShowReplyForm(false)
    setReplyContent('')
    setReplyImageUrl('')
    setReplyImageFile(null)
  }, [])

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

  if (!selectedThread) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="simple-tile text-center">
          <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100 mb-2">{t('forum.threadNotFound')}</h2>
                      <p className="text-slate-400">{t('forum.threadNotFoundDesc')}</p>
          <Link 
            to="/forum" 
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('forum.backToForum')}
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
{t('common.back')} {t('forum.backToCategory')} Forum
        </Link>
      </div>

      {/* Thread Header */}
      <div className="simple-tile mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {selectedThread.isPinned && (
                <Pin className="w-4 h-4 text-yellow-400" />
              )}
              {selectedThread.isLocked && (
                <Lock className="w-4 h-4 text-red-400" />
              )}
              <h1 className="text-2xl font-bold text-slate-100">
                {selectedThread.title}
              </h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{t('forum.createdBy')} {selectedThread.authorName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDate(selectedThread.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{selectedThread.views} Aufrufe</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{selectedThread.postCount} Beiträge</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4 mb-6">
        {threadPosts.map((post, index) => (
          <div key={post.id} className="simple-tile">
            <div className="flex gap-4">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-lg">
                  🎮
                </div>
              </div>

              {/* Post Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100">
                      {post.authorName}
                    </span>
                    {index === 0 && (
                      <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                        Ersteller
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>#{index + 1}</span>
                    <span>•</span>
                    <span>{formatDate(post.createdAt)}</span>
                    {post.isEdited && (
                      <>
                        <span>•</span>
                        <span className="text-yellow-400">{t('forum.edited')}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <div className="text-slate-200 mb-3 whitespace-pre-wrap">
                  {post.content}
                </div>

                {/* Post Image */}
                {post.imageUrl && (
                  <div className="mb-3">
                    <img 
                      src={post.imageUrl} 
                      alt={t('alt.postAttachment')} 
                      className="max-w-full h-auto rounded-lg border border-slate-600"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Section */}
      {isAuthenticated && !selectedThread.isLocked ? (
        <div className="simple-tile">
          {!showReplyForm ? (
            <button
              onClick={() => setShowReplyForm(true)}
              className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-600 hover:border-blue-500 text-slate-400 hover:text-blue-400 rounded-lg transition-colors"
            >
              <Reply className="w-5 h-5" />
                              <span>{t('forum.reply')}</span>
            </button>
          ) : (
            <form onSubmit={handleSubmitReply}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  {user?.avatar || '🎮'}
                </div>
                <div>
                  <div className="font-semibold text-slate-100">{user?.username}</div>
                  <div className="text-sm text-slate-400">{t('forum.replyWrite')}</div>
                </div>
              </div>

              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={t('placeholder.replyContent')}
                className="w-full h-32 p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                maxLength={2000}
                required
              />

              {/* Image Upload for Reply */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Bild anhängen (optional)
                </label>
                <ImageUpload
                  onImageSelect={handleReplyImageSelect}
                  onImageRemove={handleReplyImageRemove}
                  currentImage={replyImageUrl}
                  disabled={isSubmitting}
                  isAuthenticated={isAuthenticated}
                  className="mb-2"
                />
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-slate-400">
                  {replyContent.length}/2000 Zeichen
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={resetReplyForm}
                    className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
                    disabled={isSubmitting}
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={!replyContent.trim() || isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{isSubmitting ? 'Wird gesendet...' : 'Antworten'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="simple-tile text-center">
          {selectedThread.isLocked ? (
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <Lock className="w-5 h-5" />
                              <span>{t('forum.threadClosed')}</span>
            </div>
          ) : (
            <div className="text-slate-400">
              <Link to="/auth" className="text-blue-400 hover:text-blue-300">
                Melde dich an
              </Link>
              {' '}um zu antworten
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ForumThreadPage
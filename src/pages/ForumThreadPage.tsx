import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useForum } from '../contexts/ForumContext'
import { useUser } from '../contexts/UserContext'
import { 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  User, 
  Image as ImageIcon,
  Send,
  Eye,
  Pin,
  Lock,
  Star
} from 'lucide-react'

const ForumThreadPage: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>()
  const { threads, posts, loading, selectedThread, selectThread, createPost, selectedCategory } = useForum()
  const { user } = useUser()
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostImage, setNewPostImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (threadId) {
      const thread = threads.find(t => t.id === threadId)
      if (thread) {
        selectThread(thread)
      }
    }
  }, [threadId, threads, selectThread])

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewPostImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostContent.trim() || !selectedThread || !user) return

    setIsSubmitting(true)
    try {
      const success = await createPost(selectedThread.id, newPostContent, newPostImage || undefined)
      if (success) {
        setNewPostContent('')
        setNewPostImage(null)
        // Reset file input
        const fileInput = document.getElementById('image-upload') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getUserLevel = (userId: string) => {
    // Mock user level calculation based on user ID
    const levels = ['Neuling', 'Sammler', 'Veteran', 'Experte', 'Meister']
    return levels[parseInt(userId) % levels.length] || 'Neuling'
  }

  const getUserXP = (userId: string) => {
    // Mock XP calculation
    return (parseInt(userId) * 250) + 150
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-slate-400">Thread wird geladen...</p>
        </div>
      </div>
    )
  }

  if (!selectedThread) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-slate-400">Thread nicht gefunden</p>
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
          <Link 
            to={selectedCategory ? `/forum/category/${selectedCategory.id}` : '/forum'} 
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Link>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              {selectedThread.isPinned && (
                <Pin className="w-4 h-4 text-yellow-400" />
              )}
              {selectedThread.isLocked && (
                <Lock className="w-4 h-4 text-red-400" />
              )}
              <h1 className="text-3xl font-bold text-slate-100">
                {selectedThread.title}
              </h1>
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <span>von {selectedThread.authorName}</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(selectedThread.createdAt)}</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{selectedThread.views} Aufrufe</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post, index) => (
          <div key={post.id} className="simple-tile">
            <div className="flex items-start space-x-4">
              {/* User Avatar and Info */}
              <div className="flex-shrink-0 text-center">
                <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center mb-2">
                  <User className="w-8 h-8 text-slate-400" />
                </div>
                <div className="text-sm">
                  <Link 
                    to={`/profile/${post.authorId}`}
                    className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {post.authorName}
                  </Link>
                  <div className="text-xs text-slate-400 mt-1">
                    {getUserLevel(post.authorId)}
                  </div>
                  <div className="text-xs text-slate-400">
                    {getUserXP(post.authorId)} XP
                  </div>
                  {index === 0 && (
                    <div className="flex items-center justify-center mt-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-400">
                      #{index + 1}
                    </span>
                    <span className="text-sm text-slate-400">
                      {formatRelativeTime(post.createdAt)}
                    </span>
                    {post.isEdited && (
                      <span className="text-xs text-slate-500">
                        (bearbeitet)
                      </span>
                    )}
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-100 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {post.imageUrl && (
                  <div className="mt-4">
                    <img 
                      src={post.imageUrl} 
                      alt="Post attachment" 
                      className="max-w-md rounded-lg border border-slate-600"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Form */}
      {user && !selectedThread.isLocked ? (
        <div className="mt-8 simple-tile">
          <div className="simple-tile-header">
            <h3 className="text-lg font-bold text-slate-100">Antwort schreiben</h3>
          </div>
          <div className="simple-tile-content">
            <form onSubmit={handleSubmitPost} className="space-y-4">
              <div>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Schreibe deine Antwort..."
                  className="w-full h-32 p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-400 resize-none"
                  required
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center space-x-2 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 hover:bg-slate-600 cursor-pointer transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Bild anhängen</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !newPostContent.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Antwort posten
                    </>
                  )}
                </button>
              </div>

              {newPostImage && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Angehängtes Bild:</span>
                    <button
                      type="button"
                      onClick={() => setNewPostImage(null)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Entfernen
                    </button>
                  </div>
                  <img 
                    src={newPostImage} 
                    alt="Preview" 
                    className="max-w-xs rounded-lg border border-slate-600"
                  />
                </div>
              )}

              <div className="text-xs text-slate-400 bg-slate-800 p-3 rounded-lg">
                <strong>DSGVO-Hinweis:</strong> Deine Antwort wird öffentlich gespeichert und ist für alle Nutzer sichtbar.
              </div>
            </form>
          </div>
        </div>
      ) : selectedThread.isLocked ? (
        <div className="mt-8 simple-tile text-center">
          <Lock className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-100 mb-2">Thread gesperrt</h3>
          <p className="text-slate-400">
            Dieser Thread wurde von einem Moderator gesperrt. Neue Antworten sind nicht möglich.
          </p>
        </div>
      ) : (
        <div className="mt-8 simple-tile text-center">
          <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-100 mb-2">Anmeldung erforderlich</h3>
          <p className="text-slate-400">
            Du musst angemeldet sein, um auf diesen Thread antworten zu können.
          </p>
        </div>
      )}
    </div>
  )
}

export default ForumThreadPage
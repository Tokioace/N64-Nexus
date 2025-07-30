import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForum } from '../contexts/ForumContext'
import { useUser } from '../contexts/UserContext'
import { useLanguage } from '../contexts/LanguageContext'
import ImageUpload from '../components/ImageUpload'
import { 
  ArrowLeft,
  Send,
  AlertCircle
} from 'lucide-react'

const ForumNewThreadPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>()
  const { 
    categories,
    selectedCategory,
    loading,
    error,
    selectCategory,
    createThread
  } = useForum()
  const { user, isAuthenticated } = useUser()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth')
      return
    }

    if (categoryId) {
      const category = categories.find(c => c.id === categoryId)
      if (category) {
        selectCategory(category)
      }
    }
  }, [categoryId, categories, selectCategory, isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryId || !title.trim() || !content.trim()) {
      setFormError(t('validation.allFieldsRequired'))
      return
    }

    if (title.length > 100) {
      setFormError(t('validation.titleTooLong'))
      return
    }

    if (content.length > 2000) {
      setFormError(t('validation.contentTooLong'))
      return
    }

    setIsSubmitting(true)
    setFormError('')

    try {
      const success = await createThread(categoryId, title.trim(), content.trim(), imageUrl || undefined)
      
      if (success) {
        // Navigate back to category page
        navigate(`/forum/category/${categoryId}`)
      } else {
        setFormError(t('error.threadCreationFailed'))
      }
    } catch {
      setFormError(t('error.generic'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageSelect = (url: string, file: File) => {
    setImageUrl(url)
    setImageFile(file)
  }

  const handleImageRemove = () => {
    setImageUrl('')
    setImageFile(null)
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <div className="text-red-400">⚡</div>
      case 'Calendar': return <div className="text-blue-400">📅</div>
      case 'Brain': return <div className="text-purple-400">🧠</div>
      case 'Package': return <div className="text-green-400">📦</div>
      case 'Users': return <div className="text-yellow-400">👥</div>
      default: return <div className="text-slate-400">💬</div>
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="simple-tile text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100 mb-2">{t('forum.loginRequired')}</h2>
                      <p className="text-slate-400 mb-4">{t('forum.loginRequiredDesc')}</p>
          <Link 
            to="/auth" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
{t('ui.login')}
          </Link>
        </div>
      </div>
    )
  }

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

  if (!selectedCategory) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="simple-tile text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-100 mb-2">{t('forum.categoryNotFound')}</h2>
                      <p className="text-slate-400">{t('forum.categoryNotFoundDesc')}</p>
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
      {/* Back Navigation */}
      <div className="mb-6">
        <Link 
          to={`/forum/category/${categoryId}`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
{t('common.back')} {t('forum.backToCategory')} {selectedCategory.name}
        </Link>
      </div>

      {/* Header */}
      <div className="simple-tile mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg border border-slate-600">
            {getIconComponent(selectedCategory.icon)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">
{t('forum.newThread')}
            </h1>
            <p className="text-slate-400 mt-1">
              Erstelle einen neuen Thread in "{selectedCategory.name}"
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="simple-tile">
        <form onSubmit={handleSubmit}>
          {/* User Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-lg">
              {user?.avatar || '🎮'}
            </div>
            <div>
              <div className="font-semibold text-slate-100">{user?.username}</div>
              <div className="text-sm text-slate-400">{t('forum.createThread')}</div>
            </div>
          </div>

          {/* Error Message */}
          {(formError || error) && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-600 rounded-lg">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>{formError || error}</span>
              </div>
            </div>
          )}

          {/* Title Input */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-slate-200 mb-2">
              {t('forum.threadTitle')} *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('placeholder.threadTitle')}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={100}
              required
            />
            <div className="text-sm text-slate-400 mt-1">
              {title.length}/100 Zeichen
            </div>
          </div>

          {/* Content Input */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-slate-200 mb-2">
              Thread-Inhalt *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('placeholder.threadContent')}
              className="w-full h-48 p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              maxLength={2000}
              required
            />
            <div className="text-sm text-slate-400 mt-1">
              {content.length}/2000 Zeichen
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Bild anhängen (optional)
            </label>
            <ImageUpload
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
              currentImage={imageUrl}
              disabled={isSubmitting}
              isAuthenticated={isAuthenticated}
              className="mb-2"
            />
            <p className="text-xs text-slate-500">
              Du kannst ein Bild zu deinem Thread hinzufügen, um ihn visuell zu unterstützen.
            </p>
          </div>

          {/* Guidelines */}
          <div className="mb-6 p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
            <h3 className="font-semibold text-slate-200 mb-2">{t('forum.communityGuidelines')}</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• {t('forum.guidelines.respectful')}</li>
              <li>• {t('forum.guidelines.meaningfulTitles')}</li>
              <li>• {t('forum.guidelines.rightCategory')}</li>
              <li>• {t('forum.guidelines.noSpam')}</li>
              <li>• {t('forum.guidelines.useSearch')}</li>
            </ul>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-between">
            <Link
              to={`/forum/category/${categoryId}`}
              className="px-6 py-3 text-slate-400 hover:text-slate-200 transition-colors"
            >
              Abbrechen
            </Link>
            <button
              type="submit"
              disabled={!title.trim() || !content.trim() || isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg transition-colors"
            >
              {isSubmitting ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span>
                {isSubmitting ? 'Thread wird erstellt...' : 'Thread erstellen'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForumNewThreadPage
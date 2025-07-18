import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useForum } from '../contexts/ForumContext'
import { useUser } from '../contexts/UserContext'
import { validateThreadTitle, validatePostContent, validateImageFile } from '../utils/forumValidation'
import { 
  ArrowLeft, 
  Send, 
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react'

const ForumNewThreadPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()
  const { categories, selectedCategory, selectCategory, createThread } = useForum()
  const { user } = useUser()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (categoryId) {
      const category = categories.find(c => c.id === categoryId)
      if (category) {
        selectCategory(category)
      }
    }
  }, [categoryId, categories, selectCategory])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        setError(validation.error!)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        setError(null)
      }
      reader.onerror = () => {
        setError('Fehler beim Lesen der Bilddatei')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory || !user) return

    // Validate title
    const titleValidation = validateThreadTitle(title)
    if (!titleValidation.isValid) {
      setError(titleValidation.error!)
      return
    }

    // Validate content
    const contentValidation = validatePostContent(content)
    if (!contentValidation.isValid) {
      setError(contentValidation.error!)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const success = await createThread(selectedCategory.id, title, content, image || undefined)
      if (success) {
        navigate(`/forum/category/${selectedCategory.id}`)
      } else {
        setError('Fehler beim Erstellen des Threads. Bitte versuche es erneut.')
      }
    } catch (err) {
      setError('Ein unerwarteter Fehler ist aufgetreten.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-slate-400">Du musst angemeldet sein, um einen Thread zu erstellen.</p>
          <Link to="/forum" className="btn-primary mt-4 inline-block">
            Zurück zum Forum
          </Link>
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
      <div className="flex items-center space-x-4 mb-6">
        <Link to={`/forum/category/${categoryId}`} className="btn-secondary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            Neues Thema erstellen
          </h1>
          <p className="text-slate-400">
            in {selectedCategory.name}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="simple-tile">
        <div className="simple-tile-header">
          <h3 className="text-lg font-bold text-slate-100">Thread-Details</h3>
        </div>
        <div className="simple-tile-content">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-100 mb-2">
                Betreff *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Gib deinem Thread einen aussagekräftigen Titel..."
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-400"
                required
                maxLength={100}
              />
              <div className="text-xs text-slate-400 mt-1">
                {title.length}/100 Zeichen
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-slate-100 mb-2">
                Inhalt *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Beschreibe dein Thema ausführlich..."
                className="w-full h-48 p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-400 resize-none"
                required
                maxLength={2000}
              />
              <div className="text-xs text-slate-400 mt-1">
                {content.length}/2000 Zeichen
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-100 mb-2">
                Bild anhängen (optional)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                                  <label
                    htmlFor="image-upload"
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Bild auswählen</span>
                  </label>
                <span className="text-sm text-slate-400">
                  Max. 5MB, JPG/PNG
                </span>
              </div>

              {image && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Vorschau:</span>
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="text-red-400 text-sm"
                    >
                      Entfernen
                    </button>
                  </div>
                  <img 
                    src={image} 
                    alt="Preview" 
                    className="max-w-md rounded-lg border border-slate-600"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Wird erstellt...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Thema veröffentlichen
                  </>
                )}
              </button>

              <Link 
                to={`/forum/category/${categoryId}`} 
                className="btn-secondary"
              >
                Abbrechen
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Guidelines */}
      <div className="mt-8 simple-tile">
        <div className="simple-tile-header">
          <h3 className="text-lg font-bold text-slate-100">Community-Richtlinien</h3>
        </div>
        <div className="simple-tile-content">
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-start space-x-2">
              <span className="text-blue-400">•</span>
              <span>Sei respektvoll und höflich zu anderen Community-Mitgliedern</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-400">•</span>
              <span>Verwende aussagekräftige Titel, die das Thema gut beschreiben</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-400">•</span>
              <span>Suche vor dem Posten nach ähnlichen Threads</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-400">•</span>
              <span>Teile nur Inhalte, die du selbst erstellt hast oder verwenden darfst</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-400">•</span>
              <span>Spam und Werbung sind nicht erlaubt</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-slate-800 rounded-lg">
            <div className="text-xs text-slate-400">
              <strong>DSGVO-Hinweis:</strong> Dein Thread wird öffentlich gespeichert und ist für alle Nutzer sichtbar. 
              Teile keine persönlichen Informationen, die du nicht öffentlich preisgeben möchtest.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForumNewThreadPage
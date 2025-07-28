import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useUser } from '../contexts/UserContext'
import { useMedia } from '../contexts/MediaContext'
import { usePoints } from '../contexts/PointsContext'
import { useEvent } from '../contexts/EventContext'
import { MediaMeta, PointsConfig } from '../types'
import UserMediaHistory from '../components/UserMediaHistory'
import { 
  Camera, 
  Video, 
  Upload, 
  Play, 
  Pause, 
  Eye, 
  Heart, 
  Share2, 
  Filter, 
  Search,
  Trophy,
  Star,
  Clock,
  Users,
  Zap,
  Award,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Download,
  ExternalLink,
  Tv,
  Radio
} from 'lucide-react'

interface MediaUploadData {
  title: string
  description: string
  gameId: string
  gameName: string
  eventId?: string
  eventName?: string
  type: 'speedrun' | 'screenshot' | 'achievement'
  tags: string[]
  file?: File
  livestreamUrl?: string
}

interface StreamData {
  title: string
  url: string
  game: string
  description: string
}

// Error Boundary Component
class MediaErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Media component error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-100 mb-2">Something went wrong</h2>
            <p className="text-slate-400 mb-4">The media feature encountered an error.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const SpeedrunMediaPage: React.FC = () => {
  const { t } = useLanguage()
  const { user, isAuthenticated } = useUser()
  const { media, userMedia, loading, error, uploadMedia, uploadMediaFromUrl, likeMedia, getMediaByGame, getMediaByUser, getMediaStats } = useMedia()
  const { awardPoints } = usePoints()
  const { events, activeEvents } = useEvent()
  
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'speedrun' | 'screenshot' | 'achievement'>('all')
  const [selectedGame, setSelectedGame] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaMeta | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const [uploadData, setUploadData] = useState<MediaUploadData>({
    title: '',
    description: '',
    gameId: '',
    gameName: '',
    eventId: '',
    eventName: '',
    type: 'speedrun',
    tags: [],
    livestreamUrl: ''
  })

  const [streamData, setStreamData] = useState<StreamData>({
    title: '',
    url: '',
    game: '',
    description: ''
  })

  // Sample games data (memoized)
  const games = useMemo(() => [
    { id: 'mario64', name: 'Super Mario 64' },
    { id: 'mariokart64', name: 'Mario Kart 64' },
    { id: 'zelda-oot', name: 'The Legend of Zelda: Ocarina of Time' },
    { id: 'goldeneye', name: 'GoldenEye 007' },
    { id: 'perfect-dark', name: 'Perfect Dark' },
    { id: 'smash64', name: 'Super Smash Bros.' },
    { id: 'dk64', name: 'Donkey Kong 64' }
  ], [])

  // Memoized filtered media to prevent unnecessary recalculations
  const filteredMedia = useMemo(() => {
    return media.filter(item => {
      const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter
      const matchesGame = selectedGame === 'all' || item.gameId === selectedGame
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.gameName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      return matchesFilter && matchesGame && matchesSearch
    }).sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
  }, [media, selectedFilter, selectedGame, searchTerm])

  // Form validation
  const validateUploadForm = useCallback((): boolean => {
    const errors: Record<string, string> = {}

    if (!uploadData.title.trim()) {
      errors.title = 'Title is required'
    } else if (uploadData.title.length > 100) {
      errors.title = 'Title must be less than 100 characters'
    }

    if (!uploadData.gameName.trim()) {
      errors.game = 'Game selection is required'
    }

    if (uploadMethod === 'file' && !uploadData.file) {
      errors.file = 'Please select a file to upload'
    }

    if (uploadMethod === 'url' && !uploadData.livestreamUrl?.trim()) {
      errors.url = 'Please enter a valid URL'
    }

    if (uploadMethod === 'url' && uploadData.livestreamUrl) {
      try {
        new URL(uploadData.livestreamUrl)
      } catch {
        errors.url = 'Please enter a valid URL format'
      }
    }

    if (uploadData.description && uploadData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }, [uploadData, uploadMethod])

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // In a real app, you might want to redirect to login
      console.log('User not authenticated')
    }
  }, [isAuthenticated])

  const handleUpload = useCallback(async () => {
    if (!isAuthenticated || !user) {
      alert(t('auth.loginRequired'))
      return
    }

    if (!validateUploadForm()) {
      return
    }

    setUploading(true)
    
    try {
      let success = false
      
      // Prepare metadata for upload
      const metadata: Partial<MediaMeta> = {
        gameId: uploadData.gameId,
        gameName: uploadData.gameName,
        eventId: uploadData.eventId,
        type: uploadData.type,
        title: uploadData.title,
        description: uploadData.description,
        tags: uploadData.tags
      }

      // Upload via file or URL
      if (uploadMethod === 'file' && uploadData.file) {
        success = await uploadMedia(uploadData.file, metadata)
      } else if (uploadMethod === 'url' && uploadData.livestreamUrl && uploadMediaFromUrl) {
        success = await uploadMediaFromUrl(uploadData.livestreamUrl, metadata)
      }

      if (success) {
        // Award points for upload based on media type
        const pointsMap = {
          'speedrun': 'media.speedrun' as keyof PointsConfig,
          'screenshot': 'media.screenshot' as keyof PointsConfig,
          'achievement': 'media.achievement' as keyof PointsConfig
        }
        
        await awardPoints(pointsMap[uploadData.type], `${uploadData.type} uploaded: ${uploadData.title}`)

        // Reset form
        setUploadData({
          title: '',
          description: '',
          gameId: '',
          gameName: '',
          eventId: '',
          eventName: '',
          type: 'speedrun',
          tags: [],
          livestreamUrl: ''
        })
        setFormErrors({})
        setShowUploadModal(false)
        
        // Show success message with points info
        const pointsEarned = uploadData.type === 'speedrun' ? 50 : uploadData.type === 'achievement' ? 30 : 25
        alert(`${t('success.uploaded')} 🎉\n+${pointsEarned} Punkte erhalten!`)
      } else {
        alert(error || t('error.generic'))
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert(t('error.generic'))
    } finally {
      setUploading(false)
    }
  }, [isAuthenticated, user, validateUploadForm, uploadMethod, uploadData, uploadMedia, uploadMediaFromUrl, awardPoints, error, t])

  const handleLike = useCallback(async (mediaId: string) => {
    if (!isAuthenticated) {
      alert(t('auth.loginRequired'))
      return
    }

    await likeMedia(mediaId)
  }, [isAuthenticated, likeMedia, t])

  const startStream = useCallback(async () => {
    if (!isAuthenticated || !user) {
      alert(t('auth.loginRequired'))
      return
    }

    if (!streamData.title || !streamData.url) {
      alert(t('validation.allFieldsRequired'))
      return
    }

    setIsStreaming(true)
    
    // Award points for starting a stream
    await awardPoints('media.stream', `Live stream started: ${streamData.title}`)
    
    alert('🔴 Stream gestartet! +50 Punkte erhalten! 🎉')
  }, [isAuthenticated, user, streamData, awardPoints, t])

  const stopStream = useCallback(() => {
    setIsStreaming(false)
    setStreamData({
      title: '',
      url: '',
      game: '',
      description: ''
    })
    alert('⏹️ Stream beendet!')
  }, [])

  // Memoized MediaCard component to prevent unnecessary re-renders
  const MediaCard = React.memo(({ media }: { media: MediaMeta }) => (
    <div className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-750 transition-colors">
      <div className="relative">
        <img
          src={media.thumbnailUrl || 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop'}
          alt={media.title}
          className="w-full h-48 object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop'
          }}
        />
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            media.type === 'speedrun' ? 'bg-red-600 text-white' :
            media.type === 'screenshot' ? 'bg-blue-600 text-white' :
            'bg-green-600 text-white'
          }`}>
            {media.type === 'speedrun' && '🏃‍♂️ Speedrun'}
            {media.type === 'screenshot' && '📷 Screenshot'}
            {media.type === 'achievement' && '🏆 Achievement'}
          </span>
        </div>
        {media.verified && (
          <div className="absolute top-2 right-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-slate-100 mb-1 truncate">{media.title}</h3>
        <p className="text-sm text-slate-400 mb-2">{media.gameName}</p>
        <p className="text-xs text-slate-500 mb-2 line-clamp-2">{media.description}</p>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>by {media.username}</span>
          <span>{new Date(media.uploadDate).toLocaleDateString('de-DE')}</span>
        </div>
        {media.eventId && (
          <div className="text-xs text-blue-400 mb-2 flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            Event Upload
          </div>
        )}
        <div className="flex flex-wrap gap-1">
          {media.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-1 bg-slate-700 text-xs text-slate-300 rounded">
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {media.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {media.likes}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleLike(media.id)}
              className="p-1 text-slate-400 hover:text-red-400 transition-colors"
              disabled={loading}
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSelectedMedia(media)
                setShowDetailModal(true)
              }}
              className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  ))

  return (
    <MediaErrorBoundary>
      <div className="container-lg py-responsive space-responsive responsive-max-width responsive-overflow-hidden">
        {/* Header */}
        <div className="text-center mb-responsive responsive-max-width">
          <Camera className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 mx-auto mb-4" />
          <h1 className="text-responsive-2xl font-bold text-slate-100 mb-2 responsive-word-break">
            {t('nav.media')}
          </h1>
          <p className="text-responsive-base text-slate-400 max-w-2xl mx-auto responsive-word-break px-2">
            {t('home.media.subtitle')}
          </p>
        </div>

        {/* Upload Button */}
        <div className="text-center mb-responsive responsive-max-width">
          {isAuthenticated && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary flex items-center gap-2 mx-auto"
              disabled={loading}
            >
              <Upload className="w-5 h-5" />
              {t('media.upload')}
            </button>
          )}
        </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">{error}</span>
              </div>
            </div>
          )}

          {/* Live Stream Section */}
          {isAuthenticated && (
            <div className="mb-8">
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                    <Radio className="w-5 h-5 text-red-400" />
                    Live Stream
                  </h2>
                  {isStreaming && (
                    <div className="flex items-center gap-2 text-red-400">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">LIVE STREAM AKTIV</span>
                    </div>
                  )}
                </div>

                {!isStreaming ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{t('media.streamTitle')} *</label>
                      <input
                        type="text"
                        value={streamData.title}
                        onChange={(e) => setStreamData({...streamData, title: e.target.value})}
                        className="w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2"
                        placeholder={t('placeholder.speedrunTitle')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Stream URL *</label>
                      <input
                        type="url"
                        value={streamData.url}
                        onChange={(e) => setStreamData({...streamData, url: e.target.value})}
                        className="w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2"
                        placeholder={t('placeholder.speedrunUrl')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{t('media.game')}</label>
                      <input
                        type="text"
                        value={streamData.game}
                        onChange={(e) => setStreamData({...streamData, game: e.target.value})}
                        className="w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2"
                        placeholder={t('placeholder.speedrunGame')}
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={startStream}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Tv className="w-4 h-4" />
                        Stream starten (+50 Punkte)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-slate-300 mb-4">Stream läuft: <strong>{streamData.title}</strong></p>
                    <button
                      onClick={stopStream}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                    >
                      <Pause className="w-4 h-4" />
                      Stream beenden
                    </button>
                  </div>
                )}

                <div className="mt-4 p-3 bg-slate-700 rounded-lg">
                  <p className="text-xs text-slate-400">
                    <strong>Unterstützte Plattformen:</strong> Twitch, YouTube, Discord, OBS Studio
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <Video className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-100">{getMediaStats?.()?.mediaByType.speedrun || 0}</div>
              <div className="text-sm text-slate-400">{t('media.speedruns')}</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <Camera className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-100">{getMediaStats?.()?.mediaByType.screenshot || 0}</div>
              <div className="text-sm text-slate-400">{t('media.screenshots')}</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-100">{getMediaStats?.()?.mediaByType.achievement || 0}</div>
              <div className="text-sm text-slate-400">{t('media.achievements')}</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <Eye className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-100">{getMediaStats?.()?.totalViews || 0}</div>
              <div className="text-sm text-slate-400">{t('media.totalViews')}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-slate-800 rounded-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value as any)}
                    className="bg-slate-700 text-slate-100 rounded-lg px-4 py-2 min-w-0 w-full sm:w-auto"
                  >
                    <option value="all">{t('media.allTypes')}</option>
                    <option value="speedrun">{t('media.speedruns')}</option>
                    <option value="screenshot">{t('media.screenshots')}</option>
                    <option value="achievement">{t('media.achievements')}</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Tv className="w-4 h-4 text-slate-400" />
                  <select
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value)}
                    className="bg-slate-700 text-slate-100 rounded-lg px-4 py-2 min-w-0 w-full sm:w-auto"
                  >
                    <option value="all">{t('media.allGames')}</option>
                    {games.map(game => (
                      <option key={game.id} value={game.id}>{game.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('placeholder.mediaSearch')}
                  className="bg-slate-700 text-slate-100 rounded-lg px-4 py-2 flex-1 min-w-0 w-full"
                />
              </div>
            </div>
          </div>

          {/* User Media History */}
          {isAuthenticated && user && (
            <div className="mb-8">
              <UserMediaHistory />
            </div>
          )}

          {/* Media Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedia.map(media => (
                <MediaCard key={media.id} media={media} />
              ))}
            </div>
          )}

          {filteredMedia.length === 0 && !loading && (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">{t('media.noMediaFound')}</h3>
              <p className="text-slate-400">{t('media.tryOtherFilters')}</p>
            </div>
          )}

          {/* Upload Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-slate-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-100">{t('media.upload')}</h2>
                    <button
                      onClick={() => {
                        setShowUploadModal(false)
                        setFormErrors({})
                      }}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Upload Method Selection */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{t('media.uploadMethod')}</label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="file"
                            checked={uploadMethod === 'file'}
                            onChange={(e) => setUploadMethod(e.target.value as 'file' | 'url')}
                            className="mr-2"
                          />
                          <span className="text-slate-300">{t('media.fileUpload')}</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="url"
                            checked={uploadMethod === 'url'}
                            onChange={(e) => setUploadMethod(e.target.value as 'file' | 'url')}
                            className="mr-2"
                          />
                          <span className="text-slate-300">{t('media.urlInput')}</span>
                        </label>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{t('media.titleRequired')}</label>
                      <input
                        type="text"
                        value={uploadData.title}
                        onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                        className={`w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2 ${
                          formErrors.title ? 'border border-red-500' : ''
                        }`}
                        placeholder={t('media.titlePlaceholder')}
                      />
                      {formErrors.title && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.title}</p>
                      )}
                    </div>

                    {/* Game Selection */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Spiel *</label>
                      <select
                        value={uploadData.gameId}
                        onChange={(e) => {
                          const game = games.find(g => g.id === e.target.value)
                          setUploadData({
                            ...uploadData, 
                            gameId: e.target.value,
                            gameName: game?.name || ''
                          })
                        }}
                        className={`w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2 ${
                          formErrors.game ? 'border border-red-500' : ''
                        }`}
                      >
                        <option value="">{t('placeholder.speedrunGame')}</option>
                        {games.map(game => (
                          <option key={game.id} value={game.id}>{game.name}</option>
                        ))}
                      </select>
                      {formErrors.game && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.game}</p>
                      )}
                    </div>

                    {/* Event Selection */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Event (optional)</label>
                      <select
                        value={uploadData.eventId}
                        onChange={(e) => {
                          const event = [...(events || []), ...(activeEvents || [])].find(ev => ev.id === e.target.value)
                          setUploadData({
                            ...uploadData, 
                            eventId: e.target.value,
                            eventName: event?.title || ''
                          })
                        }}
                        className="w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2"
                      >
                        <option value="">{t('media.noEvent')}</option>
                        {activeEvents?.map(event => (
                          <option key={event.id} value={event.id}>🔴 {event.title} (Aktiv)</option>
                        ))}
                        {events?.filter(event => !activeEvents?.some(ae => ae.id === event.id)).map(event => (
                          <option key={event.id} value={event.id}>{event.title}</option>
                        ))}
                      </select>
                      <p className="text-xs text-slate-400 mt-1">
                        Wähle ein Event aus, wenn dein Media für ein bestimmtes Event ist
                      </p>
                    </div>

                    {/* Media Type */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Media Typ</label>
                      <select
                        value={uploadData.type}
                        onChange={(e) => setUploadData({...uploadData, type: e.target.value as any})}
                        className="w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2"
                      >
                        <option value="speedrun">🏃‍♂️ Speedrun (+50 Punkte)</option>
                        <option value="screenshot">📷 Screenshot (+25 Punkte)</option>
                        <option value="achievement">🏆 Achievement (+30 Punkte)</option>
                      </select>
                    </div>

                    {/* File Upload or URL Input */}
                    {uploadMethod === 'file' ? (
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Datei *</label>
                        <input
                          type="file"
                          accept="video/*,image/*"
                          onChange={(e) => setUploadData({...uploadData, file: e.target.files?.[0]})}
                          className={`w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2 ${
                            formErrors.file ? 'border border-red-500' : ''
                          }`}
                        />
                        <p className="text-xs text-slate-400 mt-1">
                          Unterstützte Formate: MP4, WebM, JPG, PNG, GIF (max. 100MB)
                        </p>
                        {formErrors.file && (
                          <p className="text-red-400 text-sm mt-1">{formErrors.file}</p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Media URL *</label>
                        <input
                          type="url"
                          value={uploadData.livestreamUrl}
                          onChange={(e) => setUploadData({...uploadData, livestreamUrl: e.target.value})}
                          className={`w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2 ${
                            formErrors.url ? 'border border-red-500' : ''
                          }`}
                          placeholder={t('placeholder.mediaUrl')}
                        />
                        <p className="text-xs text-slate-400 mt-1">
                          YouTube, Twitch, oder andere Video/Bild URLs
                        </p>
                        {formErrors.url && (
                          <p className="text-red-400 text-sm mt-1">{formErrors.url}</p>
                        )}
                      </div>
                    )}

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{t('media.description')}</label>
                      <textarea
                        value={uploadData.description}
                        onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                        className={`w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2 h-24 resize-none ${
                          formErrors.description ? 'border border-red-500' : ''
                        }`}
                        placeholder={t('placeholder.mediaDescription')}
                      />
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-slate-400">
                          {uploadData.description.length}/500 Zeichen
                        </span>
                        {formErrors.description && (
                          <p className="text-red-400 text-sm">{formErrors.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Tags (optional)</label>
                      <input
                        type="text"
                        placeholder={t('placeholder.mediaTags')}
                        className="w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault()
                            const value = e.currentTarget.value.trim()
                            if (value && !uploadData.tags.includes(value)) {
                              setUploadData({
                                ...uploadData,
                                tags: [...uploadData.tags, value]
                              })
                              e.currentTarget.value = ''
                            }
                          }
                        }}
                      />
                      {uploadData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {uploadData.tags.map(tag => (
                            <span key={tag} className="bg-slate-600 text-slate-200 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                              #{tag}
                              <button
                                onClick={() => setUploadData({
                                  ...uploadData,
                                  tags: uploadData.tags.filter(t => t !== tag)
                                })}
                                className="text-slate-400 hover:text-slate-200"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Upload Button */}
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => {
                          setShowUploadModal(false)
                          setFormErrors({})
                        }}
                        className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Abbrechen
                      </button>
                      <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            {t('common.uploading')}
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            {t('common.upload')}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Media Detail Modal */}
          {showDetailModal && selectedMedia && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-slate-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-100">{selectedMedia.title}</h2>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      {selectedMedia.url.includes('youtube.com') || selectedMedia.url.includes('youtu.be') ? (
                        <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center">
                          <p className="text-slate-400">YouTube Video Player würde hier angezeigt</p>
                        </div>
                      ) : selectedMedia.type === 'speedrun' ? (
                        <video
                          src={selectedMedia.url}
                          controls
                          className="w-full aspect-video bg-slate-900 rounded-lg"
                          poster={selectedMedia.thumbnailUrl}
                        />
                      ) : (
                        <img
                          src={selectedMedia.url}
                          alt={selectedMedia.title}
                          className="w-full aspect-video object-cover bg-slate-900 rounded-lg"
                        />
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-slate-300 mb-1">Spiel</h3>
                        <p className="text-slate-100">{selectedMedia.gameName}</p>
                      </div>

                      <div>
                        <h3 className="font-medium text-slate-300 mb-1">Typ</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedMedia.type === 'speedrun' ? 'bg-red-600 text-white' :
                          selectedMedia.type === 'screenshot' ? 'bg-blue-600 text-white' :
                          'bg-green-600 text-white'
                        }`}>
                          {selectedMedia.type === 'speedrun' && '🏃‍♂️ Speedrun'}
                          {selectedMedia.type === 'screenshot' && '📷 Screenshot'}
                          {selectedMedia.type === 'achievement' && '🏆 Achievement'}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-medium text-slate-300 mb-1">{t('media.uploadedBy')}</h3>
                        <p className="text-slate-100">{selectedMedia.username}</p>
                      </div>

                      <div>
                        <h3 className="font-medium text-slate-300 mb-1">{t('media.uploadedOn')}</h3>
                        <p className="text-slate-100">{new Date(selectedMedia.uploadDate).toLocaleString('de-DE')}</p>
                      </div>

                      {selectedMedia.eventId && (
                        <div>
                          <h3 className="font-medium text-slate-300 mb-1">Event</h3>
                          <p className="text-slate-100 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            Event Upload
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{selectedMedia.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{selectedMedia.likes}</span>
                        </div>
                        {selectedMedia.verified && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400">Verifiziert</span>
                          </div>
                        )}
                      </div>

                      {selectedMedia.description && (
                        <div>
                          <h3 className="font-medium text-slate-300 mb-1">{t('media.description')}</h3>
                          <p className="text-slate-100 text-sm">{selectedMedia.description}</p>
                        </div>
                      )}

                      {selectedMedia.tags.length > 0 && (
                        <div>
                          <h3 className="font-medium text-slate-300 mb-2">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedMedia.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-slate-700 text-xs text-slate-300 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-4">
                        <button
                          onClick={() => handleLike(selectedMedia.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                          disabled={loading}
                        >
                          <Heart className="w-4 h-4" />
                          Like
                        </button>
                        <button
                          onClick={() => window.open(selectedMedia.url, '_blank')}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Öffnen
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
    </MediaErrorBoundary>
  )
}

export default SpeedrunMediaPage
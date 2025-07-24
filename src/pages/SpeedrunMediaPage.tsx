import React, { useState, useEffect } from 'react'
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

const SpeedrunMediaPage: React.FC = () => {
  const { t } = useLanguage()
  const { user, isAuthenticated } = useUser()
  const { media, userMedia, loading, uploadMedia, uploadMediaFromUrl, likeMedia, getMediaByGame, getMediaByUser, getMediaStats } = useMedia()
  const { awardPoints } = usePoints()
  const { events, activeEvents } = useEvent()
  
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'speedrun' | 'screenshot' | 'achievement'>('all')
  const [selectedGame, setSelectedGame] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
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
  const [uploading, setUploading] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaMeta | null>(null)
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamData, setStreamData] = useState({
    title: '',
    game: '',
    url: '',
    description: ''
  })

  // Sample games list - in real app this would come from a games context
  const games = [
    { id: 'mario64', name: 'Super Mario 64' },
    { id: 'mariokart64', name: 'Mario Kart 64' },
    { id: 'goldeneye', name: 'GoldenEye 007' },
    { id: 'zelda-oot', name: 'The Legend of Zelda: Ocarina of Time' },
    { id: 'smash64', name: 'Super Smash Bros.' },
    { id: 'paper-mario', name: 'Paper Mario' },
    { id: 'perfect-dark', name: 'Perfect Dark' },
    { id: 'dk64', name: 'Donkey Kong 64' }
  ]

  const filteredMedia = media.filter(item => {
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter
    const matchesGame = selectedGame === 'all' || item.gameId === selectedGame
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesFilter && matchesGame && matchesSearch
  })

  const handleUpload = async () => {
    if (!isAuthenticated || !user) {
      alert(t('auth.loginRequired'))
      return
    }

    if (!uploadData.title || !uploadData.gameName || (!uploadData.file && !uploadData.livestreamUrl)) {
      alert(t('validation.allFieldsRequired'))
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
      if (uploadData.file) {
        success = await uploadMedia(uploadData.file, metadata)
      } else if (uploadData.livestreamUrl && uploadMediaFromUrl) {
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
        setShowUploadModal(false)
        
        // Show success message with points info
        const pointsEarned = uploadData.type === 'speedrun' ? 50 : uploadData.type === 'achievement' ? 30 : 25
        alert(`${t('success.uploaded')} 🎉\n+${pointsEarned} Punkte erhalten!`)
      } else {
        alert(t('error.generic'))
      }
    } catch (error) {
      alert(t('error.generic'))
    } finally {
      setUploading(false)
    }
  }

  const handleLike = async (mediaId: string) => {
    if (!isAuthenticated) {
      alert(t('auth.loginRequired'))
      return
    }

    await likeMedia(mediaId)
  }

  const startStream = async () => {
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
  }

  const stopStream = () => {
    setIsStreaming(false)
    setStreamData({ title: '', game: '', url: '', description: '' })
  }

  const MediaCard: React.FC<{ media: MediaMeta }> = ({ media }) => (
    <div className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-750 transition-colors cursor-pointer"
         onClick={() => { setSelectedMedia(media); setShowMediaModal(true) }}>
      <div className="relative">
        <img 
          src={media.thumbnailUrl} 
          alt={media.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            media.type === 'speedrun' ? 'bg-red-600 text-white' :
            media.type === 'screenshot' ? 'bg-blue-600 text-white' :
            'bg-green-600 text-white'
          }`}>
            {media.type === 'speedrun' ? '🏃‍♂️ Speedrun' :
             media.type === 'screenshot' ? '📷 Screenshot' :
             '🏆 Achievement'}
          </span>
        </div>
        {media.verified && (
          <div className="absolute top-2 right-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
        )}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-white text-sm">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {media.views}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {media.likes}
          </span>
        </div>
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
      </div>
    </div>
  )

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Camera className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-100 mb-4">{t('nav.media')}</h1>
          <p className="text-slate-400 mb-6">{t('auth.loginRequiredMessage')}</p>
          <a href="/auth" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
            {t('auth.login')}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-responsive-2xl font-bold text-slate-100 mb-4 flex items-center justify-center gap-2">
          <Camera className="w-8 h-8 text-green-400" />
          {t('nav.media')}
        </h1>
        <p className="text-responsive-base text-slate-400 max-w-2xl mx-auto mb-6">
          Teile deine Speedruns, Screenshots und Erfolge mit der Community. Verdiene Punkte für Uploads und Streams!
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Media hochladen (+50 Punkte)
          </button>
          
          {!isStreaming ? (
            <button
              onClick={() => setIsStreaming(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <Radio className="w-5 h-5" />
              Live Stream starten (+50 Punkte)
            </button>
          ) : (
            <button
              onClick={stopStream}
              className="bg-red-800 hover:bg-red-900 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Stream beenden
            </button>
          )}
        </div>
      </div>

      {/* Live Stream Section */}
      {isStreaming && (
        <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h2 className="text-xl font-bold text-red-400">🔴 LIVE STREAM AKTIV</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Stream Titel..."
                value={streamData.title}
                onChange={(e) => setStreamData({...streamData, title: e.target.value})}
                className="w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2 mb-3"
              />
              <input
                type="text"
                placeholder="Spiel..."
                value={streamData.game}
                onChange={(e) => setStreamData({...streamData, game: e.target.value})}
                className="w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2 mb-3"
              />
              <input
                type="url"
                placeholder="Stream URL (Twitch, YouTube, etc.)..."
                value={streamData.url}
                onChange={(e) => setStreamData({...streamData, url: e.target.value})}
                className="w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2 mb-3"
              />
            </div>
            <div>
              <textarea
                placeholder="Stream Beschreibung..."
                value={streamData.description}
                onChange={(e) => setStreamData({...streamData, description: e.target.value})}
                className="w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2 h-32 resize-none"
              />
            </div>
          </div>
          
          <div className="flex gap-4 mt-4">
            <button
              onClick={startStream}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Stream Daten speichern
            </button>
            <button
              onClick={stopStream}
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Stream beenden
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <Video className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-100">{getMediaStats?.()?.mediaByType.speedrun || 0}</div>
          <div className="text-sm text-slate-400">Speedruns</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <Camera className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-100">{getMediaStats?.()?.mediaByType.screenshot || 0}</div>
          <div className="text-sm text-slate-400">Screenshots</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-100">{getMediaStats?.()?.mediaByType.achievement || 0}</div>
          <div className="text-sm text-slate-400">Achievements</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <Eye className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-100">{getMediaStats?.()?.totalViews || 0}</div>
          <div className="text-sm text-slate-400">Total Views</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <span className="text-slate-300">Filter:</span>
          </div>
          
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as any)}
            className="bg-slate-700 text-slate-100 rounded-lg px-3 py-2"
          >
            <option value="all">Alle Typen</option>
            <option value="speedrun">Speedruns</option>
            <option value="screenshot">Screenshots</option>
            <option value="achievement">Achievements</option>
          </select>
          
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="bg-slate-700 text-slate-100 rounded-lg px-3 py-2"
          >
            <option value="all">Alle Spiele</option>
            {games.map(game => (
              <option key={game.id} value={game.id}>{game.name}</option>
            ))}
          </select>
          
          <div className="flex items-center gap-2 ml-auto">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 text-slate-100 rounded-lg px-3 py-2 w-48"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedia.map(media => (
          <MediaCard key={media.id} media={media} />
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-12">
          <Camera className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">Keine Media gefunden</h3>
          <p className="text-slate-400 mb-4">Versuche andere Filter oder lade dein erstes Media hoch!</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Erstes Media hochladen
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Upload className="w-6 h-6 text-green-400" />
                  Media hochladen
                </h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Titel *</label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                    className="w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2"
                    placeholder="z.B. Mario 64 120 Stars Speedrun"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Typ *</label>
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
                    className="w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2"
                  >
                    <option value="">Spiel auswählen...</option>
                    {games.map(game => (
                      <option key={game.id} value={game.id}>{game.name}</option>
                    ))}
                  </select>
                </div>

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
                    <option value="">Kein Event</option>
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

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Beschreibung</label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                    className="w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2 h-24 resize-none"
                    placeholder="Beschreibe dein Media..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Upload Methode</label>
                  <div className="space-y-3">
                    <div>
                      <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                        <input
                          type="radio"
                          name="uploadMethod"
                          checked={!uploadData.livestreamUrl}
                          onChange={() => setUploadData({...uploadData, livestreamUrl: ''})}
                          className="text-green-600"
                        />
                        <Upload className="w-4 h-4" />
                        Datei hochladen
                      </label>
                      {!uploadData.livestreamUrl && (
                        <div className="mt-2 ml-6">
                          <input
                            type="file"
                            accept="video/*,image/*"
                            onChange={(e) => setUploadData({...uploadData, file: e.target.files?.[0]})}
                            className="w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2"
                          />
                          <p className="text-xs text-slate-400 mt-1">
                            Unterstützt: MP4, WebM, JPG, PNG (max. 100MB)
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                        <input
                          type="radio"
                          name="uploadMethod"
                          checked={!!uploadData.livestreamUrl}
                          onChange={() => setUploadData({...uploadData, livestreamUrl: 'https://'})}
                          className="text-green-600"
                        />
                        <ExternalLink className="w-4 h-4" />
                        Livestream/Video URL
                      </label>
                      {uploadData.livestreamUrl !== undefined && (
                        <div className="mt-2 ml-6">
                          <input
                            type="url"
                            value={uploadData.livestreamUrl}
                            onChange={(e) => setUploadData({...uploadData, livestreamUrl: e.target.value})}
                            className="w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2"
                            placeholder="https://twitch.tv/... oder https://youtube.com/..."
                          />
                          <p className="text-xs text-slate-400 mt-1">
                            Twitch, YouTube, oder andere Video URLs
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
                  <input
                    type="text"
                    value={uploadData.tags.join(', ')}
                    onChange={(e) => setUploadData({
                      ...uploadData, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    })}
                    className="w-full bg-slate-700 text-slate-100 rounded-lg px-4 py-2"
                    placeholder="speedrun, weltrekord, mario64 (durch Kommas getrennt)"
                  />
                </div>

                <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-green-400" />
                    <span className="font-medium text-green-400">Punkte Belohnung</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    {uploadData.type === 'speedrun' && '🏃‍♂️ Speedrun Upload: +50 Punkte'}
                    {uploadData.type === 'screenshot' && '📷 Screenshot Upload: +25 Punkte'}
                    {uploadData.type === 'achievement' && '🏆 Achievement Upload: +30 Punkte'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Wird hochgeladen...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Hochladen & Punkte erhalten
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Detail Modal */}
      {showMediaModal && selectedMedia && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-100">{selectedMedia.title}</h2>
                <button
                  onClick={() => setShowMediaModal(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.title}
                    className="w-full rounded-lg"
                  />
                </div>
                <div>
                  <div className="space-y-4">
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedMedia.type === 'speedrun' ? 'bg-red-600 text-white' :
                        selectedMedia.type === 'screenshot' ? 'bg-blue-600 text-white' :
                        'bg-green-600 text-white'
                      }`}>
                        {selectedMedia.type === 'speedrun' ? '🏃‍♂️ Speedrun' :
                         selectedMedia.type === 'screenshot' ? '📷 Screenshot' :
                         '🏆 Achievement'}
                      </span>
                      {selectedMedia.verified && (
                        <span className="ml-2 px-2 py-1 bg-green-600 text-white rounded text-sm">
                          <CheckCircle className="w-4 h-4 inline mr-1" />
                          Verifiziert
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-medium text-slate-300 mb-1">Spiel</h3>
                      <p className="text-slate-100">{selectedMedia.gameName}</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-slate-300 mb-1">Beschreibung</h3>
                      <p className="text-slate-100">{selectedMedia.description}</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-slate-300 mb-1">Von</h3>
                      <p className="text-slate-100">{selectedMedia.username}</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-slate-300 mb-1">Hochgeladen</h3>
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
                        <span className="text-slate-300">{selectedMedia.views} Views</span>
                      </div>
                      <button
                        onClick={() => handleLike(selectedMedia.id)}
                        className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        <span>{selectedMedia.likes} Likes</span>
                      </button>
                    </div>

                    <div>
                      <h3 className="font-medium text-slate-300 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedMedia.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SpeedrunMediaPage
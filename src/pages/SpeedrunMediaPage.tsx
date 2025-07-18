import React, { useState, useCallback } from 'react'
import { 
  Camera, 
  Trophy, 
  Shield, 
  Eye, 
  Upload, 
  Users, 
  Video, 
  Image, 
  FileText, 
  Check, 
  AlertCircle,
  Clock,
  Star,
  Download,
  ExternalLink,
  Trash2
} from 'lucide-react'
import { useUser } from '../contexts/UserContext'
import { useEvents } from '../contexts/EventContext'
import MediaCaptureComponent from '../components/MediaCaptureComponent'
import MediaGallery from '../components/MediaGallery'
import SpeedrunLeaderboard from '../components/SpeedrunLeaderboard'
import MediaAdminPanel from '../components/MediaAdminPanel'
import SimpleCard from '../components/SimpleCard'
import SimpleButton from '../components/SimpleButton'

type TabType = 'capture' | 'gallery' | 'community' | 'leaderboard' | 'admin'
type MediaType = 'photo' | 'video' | 'stream'

interface MediaFile {
  id: string
  type: MediaType
  filename: string
  timestamp: string
  gameTime?: string
  verified: boolean
  userId: string
  username: string
  eventId?: string
  thumbnailUrl?: string
  url: string
  size: number
  uploadDate: string
}

const SpeedrunMediaPage: React.FC = () => {
  const { user } = useUser()
  const { activeEvents } = useEvents()
  
  const [activeTab, setActiveTab] = useState<TabType>('capture')
  const [selectedGame, setSelectedGame] = useState('mario-kart-64')
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>(
    activeEvents.length > 0 ? activeEvents[0].id : undefined
  )
  const [showCaptureModal, setShowCaptureModal] = useState(false)
  const [gdprConsent, setGdprConsent] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadQueue, setUploadQueue] = useState<File[]>([])
  const [latestMedia, setLatestMedia] = useState<MediaFile | null>(null)

  // Mock data - in real app this would come from API
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([
    {
      id: '1',
      type: 'video',
      filename: 'mario_kart_rainbow_road_wr.mp4',
      timestamp: '1:02.55',
      gameTime: '1:02.55',
      verified: true,
      userId: user?.id || 'user1',
      username: user?.username || 'SpeedRunner64',
      eventId: activeEvents[0]?.id,
      url: '/media/mario_kart_rainbow_road_wr.mp4',
      size: 25600000,
      uploadDate: new Date().toISOString()
    },
    {
      id: '2',
      type: 'photo',
      filename: 'mario64_speedrun_screenshot.jpg',
      timestamp: '16:42',
      verified: false,
      userId: 'user2',
      username: 'RetroGamer',
      url: '/media/mario64_speedrun_screenshot.jpg',
      size: 1200000,
      uploadDate: new Date(Date.now() - 86400000).toISOString()
    }
  ])

  const games = [
    { id: 'mario-kart-64', name: 'Mario Kart 64' },
    { id: 'super-mario-64', name: 'Super Mario 64' },
    { id: 'goldeneye-007', name: 'GoldenEye 007' },
    { id: 'super-smash-bros', name: 'Super Smash Bros.' },
    { id: 'mario-party', name: 'Mario Party' },
    { id: 'zelda-ocarina', name: 'Zelda: Ocarina of Time' }
  ]

  const tabs = [
    { id: 'capture' as TabType, label: 'Aufnahme', icon: Camera, color: 'text-blue-600' },
    { id: 'gallery' as TabType, label: 'Galerie', icon: Image, color: 'text-blue-600' },
    { id: 'community' as TabType, label: 'Community', icon: Users, color: 'text-green-600' },
    { id: 'leaderboard' as TabType, label: 'Bestenliste', icon: Trophy, color: 'text-yellow-600' },
    ...(user?.username === 'admin' ? [{ id: 'admin' as TabType, label: 'Admin', icon: Shield, color: 'text-red-600' }] : [])
  ]

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      setUploadQueue(prev => [...prev, ...files])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setUploadQueue(prev => [...prev, ...files])
    }
  }

  const handleUpload = async (file: File) => {
    if (!gdprConsent) {
      alert('Bitte stimmen Sie der DSGVO-konformen Verarbeitung zu.')
      return
    }

    // Mock upload process
    const newMedia: MediaFile = {
      id: Date.now().toString(),
      type: file.type.startsWith('video/') ? 'video' : 'photo',
      filename: file.name,
      timestamp: '',
      verified: false,
      userId: user?.id || 'current-user',
      username: user?.username || 'Unbekannt',
      url: URL.createObjectURL(file),
      size: file.size,
      uploadDate: new Date().toISOString()
    }

    setMediaFiles(prev => [newMedia, ...prev])
    setLatestMedia(newMedia)
    setUploadQueue(prev => prev.filter(f => f !== file))
  }

  const removeFromQueue = (file: File) => {
    setUploadQueue(prev => prev.filter(f => f !== file))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleMediaCaptured = (mediaId: string) => {
    console.log('Media captured:', mediaId)
    setShowCaptureModal(false)
  }

  const isAdmin = user?.username === 'admin' || user?.id === 'admin'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <SimpleCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3 ">
                <Camera className="w-8 h-8 text-blue-600" />
                Speedrun Media Center
              </h1>
              <p className="text-gray-300 ">
                Teile deine besten Speedrun-Momente mit der Community
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-white/70 ">Aktuelle Events</div>
                <div className="text-yellow-600 ">
                  {activeEvents.length} aktiv
                </div>
              </div>
            </div>
          </div>
        </SimpleCard>

        {/* Game Selection */}
        <SimpleCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-white ">Spiel:</span>
              <select 
                value={selectedGame} 
                onChange={(e) => setSelectedGame(e.target.value)}
                className="bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white "
              >
                {games.map(game => (
                  <option key={game.id} value={game.id} className="bg-gray-900">
                    {game.name}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedEvent && (
              <div className="flex items-center space-x-2">
                <span className="text-white/70 ">Event:</span>
                <span className="text-green-600 ">
                  {activeEvents.find(e => e.id === selectedEvent)?.title || 'Aktuelles Event'}
                </span>
              </div>
            )}
          </div>
        </SimpleCard>

        {/* Latest Media Highlight */}
        {latestMedia && (
          <SimpleCard className="p-6 bg-gradient-to-r from-blue-600/20 to-blue-600/20 border-blue-600/50">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-blue-600/30 rounded-lg flex items-center justify-center">
                  {latestMedia.type === 'video' ? 
                    <Video className="w-8 h-8 text-blue-600" /> : 
                    <Image className="w-8 h-8 text-blue-600" />
                  }
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span className="text-yellow-600 ">NEUESTE AUFNAHME</span>
                </div>
                <h3 className="text-white ">{latestMedia.filename}</h3>
                <p className="text-white/70 ">
                  Hochgeladen von {latestMedia.username} • {formatFileSize(latestMedia.size)}
                </p>
              </div>
              <div className="text-right">
                {latestMedia.verified ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="">Verifiziert</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-yellow-600">
                    <Clock className="w-4 h-4" />
                    <span className="">Wartend</span>
                  </div>
                )}
              </div>
            </div>
          </SimpleCard>
        )}

        {/* Tab Navigation */}
        <SimpleCard className="p-2">
          <div className="flex space-x-2">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg 
                    activeTab === tab.id 
                      ? 'bg-blue-600/30 text-white border border-blue-600/50' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : ''}`} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </SimpleCard>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Capture Tab */}
          {activeTab === 'capture' && (
            <div className="space-y-6">
              {/* GDPR Consent */}
              <SimpleCard className="p-6 border-yellow-600/50">
                <div className="flex items-start space-x-4">
                  <Shield className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl ">DSGVO-Hinweis</h3>
                    <p className="text-white/80 ">
                      Ihre Medien werden lokal gespeichert und nur mit Ihrer ausdrücklichen Zustimmung hochgeladen. 
                      Nur verifizierte Medien mit Zeitstempel werden für die Bestenlisten berücksichtigt. 
                      Sie können Ihre Daten jederzeit löschen lassen.
                    </p>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={gdprConsent}
                        onChange={(e) => setGdprConsent(e.target.checked)}
                        className="w-5 h-5 rounded border-2 border-white/20 bg-black/30 text-blue-600 focus:ring-blue-600"
                      />
                      <span className="text-white ">
                        Ich stimme der DSGVO-konformen Verarbeitung meiner Medien zu
                      </span>
                    </label>
                  </div>
                </div>
              </SimpleCard>

              {/* Upload Area */}
              <SimpleCard 
                className={`p-8 border-2 border-dashed transition-all duration-300 ${
                  dragActive 
                    ? 'border-blue-600 bg-blue-600/10' 
                    : 'border-white/30 hover:border-blue-600/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <Upload className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl ">
                    Dateien hochladen
                  </h3>
                  <p className="text-white/70 ">
                    Ziehen Sie Ihre Speedrun-Videos oder Screenshots hierher oder klicken Sie zum Auswählen
                  </p>
                  
                  <div className="flex justify-center space-x-4">
                    <label className="cursor-pointer">
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*,video/*" 
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <SimpleButton variant="primary">
                        <Camera className="w-5 h-5 mr-2" />
                        Dateien auswählen
                      </SimpleButton>
                    </label>
                    
                    <SimpleButton 
                      variant="secondary"
                      onClick={() => setShowCaptureModal(true)}
                    >
                      <Video className="w-5 h-5 mr-2" />
                      Live aufnehmen
                    </SimpleButton>
                  </div>
                </div>
              </SimpleCard>

              {/* Upload Queue */}
              {uploadQueue.length > 0 && (
                <SimpleCard className="p-6">
                  <h3 className="text-xl ">Upload-Warteschlange</h3>
                  <div className="space-y-3">
                    {uploadQueue.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-black/20 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center space-x-3">
                          {file.type.startsWith('video/') ? 
                            <Video className="w-6 h-6 text-blue-600" /> : 
                            <Image className="w-6 h-6 text-green-600" />
                          }
                          <div>
                            <div className="text-white ">{file.name}</div>
                            <div className="text-white/60 ">{formatFileSize(file.size)}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <SimpleButton 
                            variant="success" 
                            size="sm"
                            onClick={() => handleUpload(file)}
                            disabled={!gdprConsent}
                          >
                            Upload
                          </SimpleButton>
                          <button 
                            onClick={() => removeFromQueue(file)}
                            className="text-red-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </SimpleCard>
              )}
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <MediaGallery 
              gameId={selectedGame}
              eventId={selectedEvent}
            />
          )}

          {/* Community Tab */}
          {activeTab === 'community' && (
            <div className="space-y-6">
              <SimpleCard className="p-6">
                <h3 className="text-xl ">Community Runs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mediaFiles.map(media => (
                    <div key={media.id} className="bg-black/20 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {media.type === 'video' ? 
                            <Video className="w-5 h-5 text-blue-600" /> : 
                            <Image className="w-5 h-5 text-green-600" />
                          }
                          <span className="text-white ">{media.username}</span>
                        </div>
                        {media.verified && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="text-white/80 ">{media.filename}</div>
                      {media.timestamp && (
                        <div className="text-yellow-600 ">{media.timestamp}</div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 ">
                          {new Date(media.uploadDate).toLocaleDateString('de-DE')}
                        </span>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-400 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-400 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SimpleCard>
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <SpeedrunLeaderboard 
              gameId={selectedGame}
              eventId={selectedEvent}
            />
          )}

          {/* Admin Tab */}
          {activeTab === 'admin' && isAdmin && (
            <MediaAdminPanel />
          )}
        </div>

        {/* Capture Modal */}
        {showCaptureModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl ">Live-Aufnahme</h2>
                <button 
                  onClick={() => setShowCaptureModal(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <FileText className="w-6 h-6" />
                </button>
              </div>
              <MediaCaptureComponent
                gameId={selectedGame}
                eventId={selectedEvent}
                onMediaCaptured={handleMediaCaptured}
                onClose={() => setShowCaptureModal(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SpeedrunMediaPage
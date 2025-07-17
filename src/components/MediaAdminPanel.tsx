import React, { useState, useEffect } from 'react'
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Flag, 
  Trash2, 
  Clock, 
  User, 
  Calendar,
  Filter,
  Search,
  MoreHorizontal,
  Download,
  Ban
} from 'lucide-react'
import { useMedia } from '../contexts/MediaContext'
import { useUser } from '../contexts/UserContext'
import { MediaMeta } from '../types'
import RetroCard3D from './RetroCard3D'
import RetroButton3D from './RetroButton3D'

interface MediaAdminPanelProps {
  onClose?: () => void
}

const MediaAdminPanel: React.FC<MediaAdminPanelProps> = ({ onClose }) => {
  const { user } = useUser()
  const { mediaList, verifyMedia, deleteMedia } = useMedia()
  
  const [filteredMedia, setFilteredMedia] = useState<MediaMeta[]>([])
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [typeFilter, setTypeFilter] = useState<'all' | 'photo' | 'video'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'mostReported' | 'mostLiked'>('newest')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<MediaMeta | null>(null)
  const [showReportedOnly, setShowReportedOnly] = useState(false)

  // Mock admin check - in real app, this would be based on user roles
  const isAdmin = user?.username === 'admin' || user?.id === 'admin'

  useEffect(() => {
    let media = [...mediaList]

    // Apply filters
    if (statusFilter !== 'all') {
      media = media.filter(m => m.status === statusFilter)
    }

    if (typeFilter !== 'all') {
      media = media.filter(m => m.type === typeFilter)
    }

    if (showReportedOnly) {
      media = media.filter(m => m.reports > 0)
    }

    if (searchTerm) {
      media = media.filter(m => 
        m.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.gameId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.comment?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort media
    media.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'mostReported':
          return b.reports - a.reports
        case 'mostLiked':
          return b.votes.likes - a.votes.likes
        default:
          return 0
      }
    })

    setFilteredMedia(media)
  }, [mediaList, statusFilter, typeFilter, sortBy, searchTerm, showReportedOnly])

  const handleVerify = async (mediaId: string, isVerified: boolean) => {
    try {
      await verifyMedia(mediaId, isVerified)
      setSelectedMedia(null)
    } catch (error) {
      console.error('Error verifying media:', error)
    }
  }

  const handleDelete = async (mediaId: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Medium dauerhaft löschen möchten?')) {
      try {
        await deleteMedia(mediaId)
        setSelectedMedia(null)
      } catch (error) {
        console.error('Error deleting media:', error)
      }
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'vor wenigen Sekunden'
    if (diffInSeconds < 3600) return `vor ${Math.floor(diffInSeconds / 60)} Min`
    if (diffInSeconds < 86400) return `vor ${Math.floor(diffInSeconds / 3600)} Std`
    return `vor ${Math.floor(diffInSeconds / 86400)} Tagen`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full">
            <CheckCircle className="w-3 h-3" />
            Genehmigt
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded-full">
            <XCircle className="w-3 h-3" />
            Abgelehnt
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded-full">
            <Clock className="w-3 h-3" />
            Ausstehend
          </span>
        )
      default:
        return null
    }
  }

  const getPriorityColor = (media: MediaMeta) => {
    if (media.reports > 5) return 'border-red-500'
    if (media.reports > 2) return 'border-yellow-500'
    if (media.status === 'pending') return 'border-blue-500'
    return 'border-gray-600'
  }

  if (!isAdmin) {
    return (
      <RetroCard3D className="max-w-md mx-auto">
        <div className="text-center p-6">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Zugriff verweigert</h3>
          <p className="text-gray-300">Sie haben keine Berechtigung für diesen Bereich.</p>
        </div>
      </RetroCard3D>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Shield className="w-8 h-8" />
          Media Admin Panel
        </h1>
        {onClose && (
          <RetroButton3D variant="secondary" onClick={onClose}>
            Schließen
          </RetroButton3D>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <RetroCard3D className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {mediaList.filter(m => m.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-400">Ausstehend</div>
        </RetroCard3D>
        <RetroCard3D className="p-4 text-center">
          <div className="text-2xl font-bold text-red-400">
            {mediaList.filter(m => m.reports > 0).length}
          </div>
          <div className="text-sm text-gray-400">Gemeldet</div>
        </RetroCard3D>
        <RetroCard3D className="p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {mediaList.filter(m => m.status === 'approved').length}
          </div>
          <div className="text-sm text-gray-400">Genehmigt</div>
        </RetroCard3D>
        <RetroCard3D className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {mediaList.length}
          </div>
          <div className="text-sm text-gray-400">Gesamt</div>
        </RetroCard3D>
      </div>

      {/* Filters */}
      <RetroCard3D className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="all">Alle Status</option>
              <option value="pending">Ausstehend</option>
              <option value="approved">Genehmigt</option>
              <option value="rejected">Abgelehnt</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Typ</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="all">Alle Typen</option>
              <option value="photo">Fotos</option>
              <option value="video">Videos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sortierung</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="newest">Neueste zuerst</option>
              <option value="oldest">Älteste zuerst</option>
              <option value="mostReported">Meist gemeldete</option>
              <option value="mostLiked">Beliebteste</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Suche</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nutzer, Spiel, Kommentar..."
                className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showReportedOnly}
              onChange={(e) => setShowReportedOnly(e.target.checked)}
              className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
            />
            <span className="text-sm text-gray-300">Nur gemeldete Medien</span>
          </label>

          <RetroButton3D
            variant="secondary"
            onClick={() => {
              setStatusFilter('all')
              setTypeFilter('all')
              setSortBy('newest')
              setSearchTerm('')
              setShowReportedOnly(false)
            }}
          >
            Filter zurücksetzen
          </RetroButton3D>
        </div>
      </RetroCard3D>

      {/* Media List */}
      <div className="space-y-4">
        {filteredMedia.length === 0 ? (
          <RetroCard3D className="text-center p-8">
            <div className="text-gray-400">
              <Filter className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Keine Medien gefunden</h3>
              <p className="text-sm">Keine Medien entsprechen den aktuellen Filterkriterien.</p>
            </div>
          </RetroCard3D>
        ) : (
          filteredMedia.map((media) => (
            <RetroCard3D key={media.id} className={`border-2 ${getPriorityColor(media)}`}>
              <div className="p-4">
                <div className="flex gap-4">
                  {/* Media Preview */}
                  <div className="flex-shrink-0 w-32 h-24 bg-gray-900 rounded-lg overflow-hidden">
                    {media.type === 'photo' ? (
                      <img
                        src={media.url}
                        alt={`Media by ${media.userId}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={media.url}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                      />
                    )}
                  </div>

                  {/* Media Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-white font-medium">{media.userId}</span>
                        {getStatusBadge(media.status)}
                        {media.reports > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded-full">
                            <Flag className="w-3 h-3" />
                            {media.reports} Meldung{media.reports > 1 ? 'en' : ''}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {formatTimeAgo(media.createdAt)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Spiel:</span>
                        <span className="text-white ml-2">{media.gameId}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Zeit:</span>
                        <span className="text-white ml-2">{media.gameTime || 'Keine Angabe'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Typ:</span>
                        <span className="text-white ml-2 capitalize">{media.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Sichtbarkeit:</span>
                        <span className="text-white ml-2 flex items-center gap-1">
                          {media.isPublic ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Öffentlich
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Privat
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {media.comment && (
                      <div className="bg-gray-800/50 p-2 rounded text-sm text-gray-300">
                        <strong>Kommentar:</strong> {media.comment}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>👍 {media.votes.likes}</span>
                        <span>👎 {media.votes.dislikes}</span>
                        <span>Dateigröße: {Math.round((media.metadata.fileSize || 0) / 1024)} KB</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <RetroButton3D
                          variant="secondary"
                          onClick={() => setSelectedMedia(media)}
                          className="text-xs px-2 py-1"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </RetroButton3D>

                        {media.status === 'pending' && (
                          <>
                            <RetroButton3D
                              variant="primary"
                              onClick={() => handleVerify(media.id, true)}
                              className="text-xs px-2 py-1"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Genehmigen
                            </RetroButton3D>
                            <RetroButton3D
                              variant="danger"
                              onClick={() => handleVerify(media.id, false)}
                              className="text-xs px-2 py-1"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Ablehnen
                            </RetroButton3D>
                          </>
                        )}

                        <RetroButton3D
                          variant="danger"
                          onClick={() => handleDelete(media.id)}
                          className="text-xs px-2 py-1"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Löschen
                        </RetroButton3D>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RetroCard3D>
          ))
        )}
      </div>

      {/* Media Detail Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <RetroCard3D className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Media Details</h3>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Media Preview */}
                <div className="bg-black rounded-lg overflow-hidden">
                  {selectedMedia.type === 'photo' ? (
                    <img
                      src={selectedMedia.url}
                      alt={`Media by ${selectedMedia.userId}`}
                      className="w-full max-h-96 object-contain"
                    />
                  ) : (
                    <video
                      src={selectedMedia.url}
                      className="w-full max-h-96 object-contain"
                      controls
                    />
                  )}
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">ID:</span>
                    <span className="text-white ml-2 font-mono">{selectedMedia.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Nutzer:</span>
                    <span className="text-white ml-2">{selectedMedia.userId}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Erstellt:</span>
                    <span className="text-white ml-2">{selectedMedia.createdAt.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Aktualisiert:</span>
                    <span className="text-white ml-2">{selectedMedia.updatedAt.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Gerät:</span>
                    <span className="text-white ml-2 text-xs">{selectedMedia.metadata.deviceInfo}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Auflösung:</span>
                    <span className="text-white ml-2">{selectedMedia.metadata.resolution || 'Unbekannt'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-600">
                  <RetroButton3D
                    variant="secondary"
                    onClick={() => setSelectedMedia(null)}
                  >
                    Schließen
                  </RetroButton3D>
                  
                  {selectedMedia.status === 'pending' && (
                    <>
                      <RetroButton3D
                        variant="primary"
                        onClick={() => handleVerify(selectedMedia.id, true)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Genehmigen
                      </RetroButton3D>
                      <RetroButton3D
                        variant="danger"
                        onClick={() => handleVerify(selectedMedia.id, false)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Ablehnen
                      </RetroButton3D>
                    </>
                  )}
                  
                  <RetroButton3D
                    variant="danger"
                    onClick={() => handleDelete(selectedMedia.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Löschen
                  </RetroButton3D>
                </div>
              </div>
            </div>
          </RetroCard3D>
        </div>
      )}
    </div>
  )
}

export default MediaAdminPanel
import React, { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useEvents } from '../../contexts/EventContext'
import { useMedia } from '../../contexts/MediaContext'
import SimpleCard from '../SimpleCard'
import SimpleButton from '../SimpleButton'
import MediaCaptureComponent from '../MediaCaptureComponent'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  Target,
  Gift,
  Camera,
  Video,
  Upload,
  Eye,
  Play,
  Square,
  CheckCircle,
  X
} from 'lucide-react'

interface EventDetailProps {
  event: any
  onBack?: () => void
  onParticipate?: () => void
}

interface EventParticipant {
  id: string
  username: string
  avatar?: string
  isLive: boolean
  hasUpload: boolean
  uploadType?: 'photo' | 'video'
  gameTime?: string
  uploadedAt?: string
  streamUrl?: string
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onBack, onParticipate }) => {
  const { user } = useUser()
  const { getEventProgress } = useEvents()
  // const { getMediaByEvent } = useMedia()
  const [isParticipating, setIsParticipating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showMediaCapture, setShowMediaCapture] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamUrl, setStreamUrl] = useState<string | null>(null)
  const [participants, setParticipants] = useState<EventParticipant[]>([])

  // Mock participants data - in real app this would come from API
  useEffect(() => {
    const mockParticipants: EventParticipant[] = [
      {
        id: '1',
        username: 'SpeedMaster64',
        isLive: true,
        hasUpload: false,
        streamUrl: 'https://stream.example.com/user1'
      },
      {
        id: '2',
        username: 'RetroRunner',
        isLive: false,
        hasUpload: true,
        uploadType: 'video',
        gameTime: '1:42.33',
        uploadedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '3',
        username: 'N64Legend',
        isLive: false,
        hasUpload: true,
        uploadType: 'photo',
        uploadedAt: '2024-01-15T09:15:00Z'
      },
      {
        id: '4',
        username: 'QuickFinish',
        isLive: true,
        hasUpload: true,
        uploadType: 'video',
        gameTime: '1:38.91',
        uploadedAt: '2024-01-15T11:00:00Z',
        streamUrl: 'https://stream.example.com/user4'
      }
    ]
    setParticipants(mockParticipants)
  }, [event.id])

  useEffect(() => {
    if (user && event) {
      const userProgress = getEventProgress(event.id) || 0
      setProgress(userProgress)
      setIsParticipating(userProgress > 0)
    }
  }, [user, event, getEventProgress])

  const handleParticipate = async () => {
    if (user && event) {
      try {
        // Mock participation - in real app this would call an API
        setIsParticipating(true)
        onParticipate?.()
      } catch (error) {
        console.error('Failed to participate in event:', error)
      }
    }
  }

  const handleStartStream = async () => {
    try {
      setIsStreaming(true)
      // Mock stream URL - in real app this would initiate actual streaming
      setStreamUrl(`https://stream.example.com/${user?.id}`)
      
      // Update participant list to show user as live
      setParticipants(prev => [
        ...prev.filter(p => p.id !== user?.id),
        {
          id: user?.id || 'current',
          username: user?.username || 'You',
          isLive: true,
          hasUpload: false,
          streamUrl: `https://stream.example.com/${user?.id}`
        }
      ])
    } catch (error) {
      console.error('Failed to start stream:', error)
      setIsStreaming(false)
    }
  }

  const handleStopStream = () => {
    setIsStreaming(false)
    setStreamUrl(null)
    
    // Update participant list to remove live status
    setParticipants(prev => 
      prev.map(p => 
        p.id === user?.id 
          ? { ...p, isLive: false }
          : p
      )
    )
  }

  const handleMediaCaptured = (_mediaId: string) => {
    setShowMediaCapture(false)
    // Update participant list to show user has uploaded
    setParticipants(prev => [
      ...prev.filter(p => p.id !== user?.id),
      {
        id: user?.id || 'current',
        username: user?.username || 'You',
        isLive: isStreaming,
        hasUpload: true,
        uploadType: 'video', // This would be determined by the actual upload
        uploadedAt: new Date().toISOString(),
        streamUrl: isStreaming ? streamUrl || undefined : undefined
      }
    ])
  }

  const formatTimeRemaining = () => {
    if (!event.endDate) return 'Läuft unbegrenzt'
    
    const now = new Date()
    const end = new Date(event.endDate)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Beendet'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const getEventRewards = (_eventId: string) => {
    return [
      { id: '1', name: 'Goldene Münze', description: '500 Punkte', icon: '🪙', rarity: 'common' },
      { id: '2', name: 'Silber Trophäe', description: 'Besonderer Titel', icon: '🏆', rarity: 'rare' },
      { id: '3', name: 'Legendäres Abzeichen', description: 'Exklusives Abzeichen', icon: '🏅', rarity: 'legendary' }
    ]
  }

  const rewards = getEventRewards(event.id)
  const timeLeft = formatTimeRemaining()

  const liveParticipants = participants.filter(p => p.isLive)
  const uploadParticipants = participants.filter(p => p.hasUpload)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        {onBack && (
          <SimpleButton
            variant="secondary"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </SimpleButton>
        )}
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-gray-600">Event Details</span>
        </div>
      </div>

      {/* Main Event Card */}
      <SimpleCard className="p-6">
        <div className="space-y-6">
          {/* Event Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
            <p className="text-gray-600 mb-4">{event.description}</p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{timeLeft}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{participants.length} Teilnehmer</span>
              </div>
            </div>
          </div>

          {/* Event Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{participants.length}</div>
              <div className="text-sm text-gray-600">Teilnehmer</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{liveParticipants.length}</div>
              <div className="text-sm text-gray-600">Live</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{uploadParticipants.length}</div>
              <div className="text-sm text-gray-600">Uploads</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{event.type}</div>
              <div className="text-sm text-gray-600">Typ</div>
            </div>
          </div>

          {/* Progress Bar (if participating) */}
          {isParticipating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fortschritt</span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-600 to-blue-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: progress + '%' }}
                />
              </div>
            </div>
          )}

          {/* Participation Button */}
          <div className="text-center">
            {!isParticipating ? (
              <SimpleButton
                variant="primary"
                onClick={handleParticipate}
                className="px-8 py-3 text-lg"
              >
                Teilnehmen
              </SimpleButton>
            ) : (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Du nimmst teil!</span>
              </div>
            )}
          </div>
        </div>
      </SimpleCard>

      {/* Participation Actions (only shown if participating) */}
      {isParticipating && (
        <SimpleCard className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Zeiten hochladen</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Upload Media Button */}
              <SimpleButton
                variant="primary"
                onClick={() => setShowMediaCapture(true)}
                className="flex items-center justify-center gap-2 p-4"
              >
                <Upload className="w-5 h-5" />
                <span>Foto/Video hochladen</span>
              </SimpleButton>

              {/* Live Stream Button */}
              {!isStreaming ? (
                <SimpleButton
                  variant="success"
                  onClick={handleStartStream}
                  className="flex items-center justify-center gap-2 p-4"
                >
                  <Play className="w-5 h-5" />
                  <span>Live Stream starten</span>
                </SimpleButton>
              ) : (
                <SimpleButton
                  variant="danger"
                  onClick={handleStopStream}
                  className="flex items-center justify-center gap-2 p-4"
                >
                  <Square className="w-5 h-5" />
                  <span>Stream beenden</span>
                </SimpleButton>
              )}

              {/* Stream Status */}
              <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 rounded-lg">
                {isStreaming ? (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Live</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-sm text-gray-500">Offline</span>
                  </>
                )}
              </div>
            </div>

            {/* Stream URL Display */}
            {streamUrl && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Dein Stream</span>
                </div>
                <div className="text-sm text-blue-700 font-mono bg-blue-100 px-2 py-1 rounded">
                  {streamUrl}
                </div>
              </div>
            )}
          </div>
        </SimpleCard>
      )}

      {/* Live Participants */}
      {liveParticipants.length > 0 && (
        <SimpleCard className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Live Teilnehmer</h2>
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse ml-2"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveParticipants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                      {participant.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{participant.username}</div>
                      <div className="text-sm text-red-600 flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        Live
                      </div>
                    </div>
                  </div>
                  <SimpleButton
                    variant="secondary"
                    onClick={() => window.open(participant.streamUrl, '_blank')}
                    className="flex items-center gap-1 px-3 py-1 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Ansehen
                  </SimpleButton>
                </div>
              ))}
            </div>
          </div>
        </SimpleCard>
      )}

      {/* Uploaded Media */}
      {uploadParticipants.length > 0 && (
        <SimpleCard className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Hochgeladene Zeiten</h2>
            </div>
            
            <div className="space-y-3">
              {uploadParticipants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      {participant.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{participant.username}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        {participant.uploadType === 'video' ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <Camera className="w-4 h-4" />
                        )}
                        <span>{participant.uploadType === 'video' ? 'Video' : 'Foto'}</span>
                        {participant.gameTime && (
                          <span className="font-mono text-green-600">• {participant.gameTime}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {participant.isLive && (
                      <div className="flex items-center gap-1 text-red-600">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm">Live</span>
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      {participant.uploadedAt && new Date(participant.uploadedAt).toLocaleString('de-DE')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SimpleCard>
      )}

      {/* Rewards Section */}
      <SimpleCard className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-bold text-gray-900">Belohnungen</h2>
          </div>
          
          <div className="space-y-3">
            {rewards.map((reward) => (
              <div 
                key={reward.id}
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg"
              >
                <div className="text-2xl">
                  {reward.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{reward.name}</div>
                  <div className="text-sm text-gray-600">{reward.description}</div>
                </div>
                <div className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                  {reward.rarity.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SimpleCard>

      {/* Event Rules */}
      <SimpleCard className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Regeln</h2>
          <div className="space-y-2 text-gray-600">
            <p>• Jeder kann nur einmal teilnehmen</p>
            <p>• Das Event läuft für eine begrenzte Zeit</p>
            <p>• Belohnungen werden nach Abschluss verteilt</p>
            <p>• Fair Play ist erforderlich</p>
            <p>• Live Streams und Uploads sind während des Events erlaubt</p>
            <p>• Zeiten müssen verifiziert werden</p>
          </div>
        </div>
              </SimpleCard>

      {/* Media Capture Modal */}
      {showMediaCapture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Zeiten hochladen</h3>
              <SimpleButton
                variant="secondary"
                onClick={() => setShowMediaCapture(false)}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </SimpleButton>
            </div>
            <MediaCaptureComponent
              gameId={event.game || 'mario-kart-64'}
              eventId={event.id}
              onMediaCaptured={handleMediaCaptured}
              onClose={() => setShowMediaCapture(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default EventDetail
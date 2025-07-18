import React, { useState, useRef, useEffect } from 'react'
import { Play, Square, Eye, EyeOff, Settings, AlertCircle, CheckCircle, Users } from 'lucide-react'
import SimpleButton from '../SimpleButton'
import SimpleCard from '../SimpleCard'

interface LiveStreamComponentProps {
  eventId: string
  gameId: string
  onStreamStart?: (streamUrl: string) => void
  onStreamStop?: () => void
  onViewerJoin?: (viewerId: string) => void
}

interface StreamSettings {
  quality: 'low' | 'medium' | 'high'
  enableChat: boolean
  enableAudio: boolean
  isPrivate: boolean
}

const LiveStreamComponent: React.FC<LiveStreamComponentProps> = ({
  eventId,
  gameId,
  onStreamStart,
  onStreamStop,
  onViewerJoin
}) => {
  const [isStreaming, setIsStreaming] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [streamUrl, setStreamUrl] = useState<string | null>(null)
  const [viewerCount, setViewerCount] = useState(0)
  const [streamDuration, setStreamDuration] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState<StreamSettings>({
    quality: 'medium',
    enableChat: true,
    enableAudio: true,
    isPrivate: false
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
    }
  }, [])

  const startStream = async () => {
    try {
      setIsInitializing(true)
      setError(null)

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: settings.quality === 'high' ? 1920 : settings.quality === 'medium' ? 1280 : 640,
          height: settings.quality === 'high' ? 1080 : settings.quality === 'medium' ? 720 : 480,
          frameRate: 30
        },
        audio: settings.enableAudio
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      // Mock stream URL generation - in real app this would be from streaming service
      const mockStreamUrl = `https://stream.battle64.com/live/${eventId}/${Date.now()}`
      setStreamUrl(mockStreamUrl)
      setIsStreaming(true)
      setStreamDuration(0)

      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setStreamDuration(prev => prev + 1)
      }, 1000)

      // Mock viewer count updates
      const viewerInterval = setInterval(() => {
        setViewerCount(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1))
      }, 5000)

      onStreamStart?.(mockStreamUrl)
      
      // Cleanup viewer interval when stream stops
      return () => clearInterval(viewerInterval)
    } catch (err) {
      setError('Fehler beim Starten des Streams. Bitte überprüfen Sie Ihre Kamera- und Mikrofon-Berechtigungen.')
      console.error('Stream start error:', err)
    } finally {
      setIsInitializing(false)
    }
  }

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
      durationIntervalRef.current = null
    }

    setIsStreaming(false)
    setStreamUrl(null)
    setViewerCount(0)
    setStreamDuration(0)
    onStreamStop?.()
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getQualityLabel = (quality: string) => {
    switch (quality) {
      case 'high': return '1080p'
      case 'medium': return '720p'
      case 'low': return '480p'
      default: return '720p'
    }
  }

  return (
    <SimpleCard className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-bold text-gray-900">Live Stream</h3>
            {isStreaming && (
              <div className="flex items-center gap-1 text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">LIVE</span>
              </div>
            )}
          </div>
          <SimpleButton
            variant="secondary"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2"
          >
            <Settings className="w-4 h-4" />
          </SimpleButton>
        </div>

        {/* Stream Preview */}
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-64 object-cover"
          />
          {!isStreaming && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center text-white">
                <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm opacity-75">Stream-Vorschau</p>
              </div>
            </div>
          )}
          
          {/* Stream Info Overlay */}
          {isStreaming && (
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>{formatDuration(streamDuration)}</span>
              </div>
            </div>
          )}

          {/* Viewer Count */}
          {isStreaming && (
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{viewerCount}</span>
              </div>
            </div>
          )}
        </div>

        {/* Stream Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isStreaming ? (
            <SimpleButton
              variant="success"
              onClick={startStream}
              disabled={isInitializing}
              className="flex items-center gap-2 px-6 py-3"
            >
              {isInitializing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Initialisiere...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Stream starten</span>
                </>
              )}
            </SimpleButton>
          ) : (
            <SimpleButton
              variant="danger"
              onClick={stopStream}
              className="flex items-center gap-2 px-6 py-3"
            >
              <Square className="w-5 h-5" />
              <span>Stream beenden</span>
            </SimpleButton>
          )}
        </div>

        {/* Stream URL */}
        {streamUrl && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Stream URL</span>
            </div>
            <div className="text-sm text-blue-700 font-mono bg-blue-100 px-2 py-1 rounded break-all">
              {streamUrl}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Teile diese URL mit anderen, damit sie deinen Stream ansehen können
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-900">Fehler</span>
            </div>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Stream-Einstellungen</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Qualität</label>
                <select
                  value={settings.quality}
                  onChange={(e) => setSettings(prev => ({ ...prev, quality: e.target.value as any }))}
                  disabled={isStreaming}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Niedrig (480p)</option>
                  <option value="medium">Mittel (720p)</option>
                  <option value="high">Hoch (1080p)</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Audio aktivieren</span>
                <input
                  type="checkbox"
                  checked={settings.enableAudio}
                  onChange={(e) => setSettings(prev => ({ ...prev, enableAudio: e.target.checked }))}
                  disabled={isStreaming}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Chat aktivieren</span>
                <input
                  type="checkbox"
                  checked={settings.enableChat}
                  onChange={(e) => setSettings(prev => ({ ...prev, enableChat: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Privater Stream</span>
                <input
                  type="checkbox"
                  checked={settings.isPrivate}
                  onChange={(e) => setSettings(prev => ({ ...prev, isPrivate: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Stream Stats */}
        {isStreaming && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{formatDuration(streamDuration)}</div>
              <div className="text-sm text-gray-600">Dauer</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{viewerCount}</div>
              <div className="text-sm text-gray-600">Zuschauer</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{getQualityLabel(settings.quality)}</div>
              <div className="text-sm text-gray-600">Qualität</div>
            </div>
          </div>
        )}
      </div>
    </SimpleCard>
  )
}

export default LiveStreamComponent
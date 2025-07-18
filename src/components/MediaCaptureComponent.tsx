import React, { useState, useRef, useEffect } from 'react'
import { 
  Camera, 
  Video, 
  Upload, 
  X, 
  Check, 
  AlertCircle, 
  Clock, 
  Shield, 
  Eye, 
  EyeOff,
  Loader2,
  Play,
  Square,
  Pause
} from 'lucide-react'
import { useMedia } from '../contexts/MediaContext'
import { useUser } from '../contexts/UserContext'
import { useEvents } from '../contexts/EventContext'
import { GameEvent } from '../types'
import SimpleCard from './SimpleCard'
import SimpleButton from './SimpleButton'

interface MediaCaptureComponentProps {
  gameId: string
  eventId?: string
  onMediaCaptured?: (mediaId: string) => void
  onClose?: () => void
}

const MediaCaptureComponent: React.FC<MediaCaptureComponentProps> = ({
  gameId,
  eventId,
  onMediaCaptured,
  onClose
}) => {
  const { user } = useUser()
  const { captureMedia, uploadMedia, settings, isCapturingAllowed } = useMedia()
  const { getEventById } = useEvents()
  
  const [mode, setMode] = useState<'photo' | 'video' | 'upload'>('photo')
  const [isCapturing, setIsCapturing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [gameTime, setGameTime] = useState('')
  const [comment, setComment] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [hasConsented, setHasConsented] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const event = eventId ? getEventById(eventId) : null
  const isEventRun = !!eventId
  const canCapture = !eventId || isCapturingAllowed(eventId)

  useEffect(() => {
    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }, [previewUrl])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: mode === 'video'
      })
      
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setError(null)
    } catch (err) {
      setError('Kamera-Zugriff verweigert. Bitte erlauben Sie den Zugriff auf die Kamera.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const takePhoto = async () => {
    if (!canCapture) {
      setError('Aufnahmen sind nur während der Event-Zeit erlaubt.')
      return
    }

    if (!gameTime.trim()) {
      setError('Bitte geben Sie Ihre Spielzeit ein.')
      return
    }

    setIsCapturing(true)
    setError(null)

    try {
      const mediaId = await captureMedia('photo', gameId, eventId)
      
      // Update metadata with additional info
      const mediaList = JSON.parse(localStorage.getItem('mediaList') || '[]')
      const updatedList = mediaList.map((media: any) => 
        media.id === mediaId 
          ? { ...media, gameTime, comment, isPublic }
          : media
      )
      localStorage.setItem('mediaList', JSON.stringify(updatedList))
      
      onMediaCaptured?.(mediaId)
      setIsCapturing(false)
      
      // Show success message
      setTimeout(() => {
        onClose?.()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Aufnehmen des Fotos')
      setIsCapturing(false)
    }
  }

  const startVideoRecording = async () => {
    if (!canCapture) {
      setError('Aufnahmen sind nur während der Event-Zeit erlaubt.')
      return
    }

    if (!gameTime.trim()) {
      setError('Bitte geben Sie Ihre Spielzeit ein.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })

      const mediaRecorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const file = new File([blob], `speedrun_${Date.now()}.webm`, { type: 'video/webm' })
        
        try {
          setIsProcessing(true)
          const mediaId = await uploadMedia(file, {
            gameId,
            eventId,
            type: 'video',
            gameTime,
            comment,
            isPublic
          })
          
          onMediaCaptured?.(mediaId)
          setIsProcessing(false)
          
          setTimeout(() => {
            onClose?.()
          }, 1500)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Fehler beim Hochladen des Videos')
          setIsProcessing(false)
        }
        
        // Cleanup
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1
          if (newTime >= settings.maxVideoDuration) {
            stopVideoRecording()
          }
          return newTime
        })
      }, 1000)

    } catch (err) {
      setError('Fehler beim Starten der Videoaufnahme')
    }
  }

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
        recordingIntervalRef.current = null
      }
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!gameTime.trim()) {
      setError('Bitte geben Sie Ihre Spielzeit ein.')
      return
    }

    try {
      setIsProcessing(true)
      const mediaId = await uploadMedia(file, {
        gameId,
        eventId,
        type: file.type.startsWith('video/') ? 'video' : 'photo',
        gameTime,
        comment,
        isPublic
      })
      
      onMediaCaptured?.(mediaId)
      setIsProcessing(false)
      
      setTimeout(() => {
        onClose?.()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Hochladen der Datei')
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!user) {
    return (
      <SimpleCard className="max-w-md mx-auto">
        <div className="text-center p-6">
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Anmeldung erforderlich</h3>
          <p className="text-gray-300">Sie müssen angemeldet sein, um Medien aufzunehmen.</p>
        </div>
      </SimpleCard>
    )
  }

  return (
    <SimpleCard className="max-w-2xl mx-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Camera className="w-6 h-6" />
            Speedrun Media Capture
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Event Info */}
        {event && (
          <div className="mb-6 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Event: {event.title}</h3>
            <p className="text-gray-300 text-sm">Spiel: {event.game}</p>
            {!canCapture && (
              <div className="mt-2 flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Aufnahmen sind nur während der Event-Zeit erlaubt</span>
              </div>
            )}
          </div>
        )}

        {/* Mode Selection */}
        <div className="flex gap-2 mb-6">
          <SimpleButton
            variant={mode === 'photo' ? 'primary' : 'secondary'}
            onClick={() => setMode('photo')}
            disabled={isRecording || isProcessing}
          >
            <Camera className="w-4 h-4 mr-2" />
            Foto
          </SimpleButton>
          <SimpleButton
            variant={mode === 'video' ? 'primary' : 'secondary'}
            onClick={() => setMode('video')}
            disabled={isRecording || isProcessing}
          >
            <Video className="w-4 h-4 mr-2" />
            Video
          </SimpleButton>
          <SimpleButton
            variant={mode === 'upload' ? 'primary' : 'secondary'}
            onClick={() => setMode('upload')}
            disabled={isRecording || isProcessing}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </SimpleButton>
        </div>

        {/* Required Fields */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Spielzeit (erforderlich) *
            </label>
            <input
              type="text"
              value={gameTime}
              onChange={(e) => setGameTime(e.target.value)}
              placeholder="z.B. 1:23:45 oder 83:45"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              disabled={isRecording || isProcessing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Kommentar (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Beschreiben Sie Ihren Run..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
              disabled={isRecording || isProcessing}
            />
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Datenschutz & Sichtbarkeit
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                disabled={isRecording || isProcessing}
              />
              <div className="flex items-center gap-2">
                {isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span className="text-sm text-gray-300">
                  Öffentlich sichtbar (Community kann abstimmen)
                </span>
              </div>
            </label>

            <div className="text-xs text-gray-400 bg-gray-900/50 p-3 rounded">
              <p className="mb-2">
                <strong>Hinweis:</strong> Alle Aufnahmen werden mit Datum, Uhrzeit, Spielname und Benutzer-ID versehen.
              </p>
              <p>
                Nur verifizierte Medien zählen für offizielle Ranglisten. 
                {isEventRun && ' Event-Runs erhalten Bonuspunkte.'}
              </p>
            </div>
          </div>
        </div>

        {/* GDPR Consent */}
        {(mode === 'video' || isPublic) && (
          <div className="mb-6 p-4 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasConsented}
                onChange={(e) => setHasConsented(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 mt-1"
                disabled={isRecording || isProcessing}
              />
              <div className="text-sm text-gray-300">
                <p className="mb-2">
                  Ich stimme zu, dass meine {mode === 'video' ? 'Video-' : ''}Aufnahme 
                  {isPublic ? ' öffentlich ' : ' '}verarbeitet und gespeichert wird.
                </p>
                <p className="text-xs text-gray-400">
                  DSGVO-konform: Sie können Ihre Zustimmung jederzeit widerrufen und 
                  Ihre Daten löschen lassen.
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Camera/Upload Interface */}
        <div className="mb-6">
          {mode === 'upload' ? (
            <div className="text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isProcessing}
              />
              <SimpleButton
                onClick={() => fileInputRef.current?.click()}
                disabled={!gameTime.trim() || isProcessing || (!hasConsented && (mode === 'video' || isPublic))}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 " />
                    Wird hochgeladen...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Datei auswählen
                  </>
                )}
              </SimpleButton>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Camera Preview */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-64 object-cover"
                  onLoadedMetadata={startCamera}
                />
                
                {isRecording && (
                  <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full " />
                    <span className="text-white text-sm font-medium">
                      REC {formatTime(recordingTime)}
                    </span>
                  </div>
                )}

                {mode === 'video' && (
                  <div className="absolute bottom-4 right-4 text-white text-sm bg-black/50 px-2 py-1 rounded">
                    Max: {formatTime(settings.maxVideoDuration)}
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="flex gap-2 justify-center">
                {mode === 'photo' ? (
                  <SimpleButton
                    onClick={takePhoto}
                    disabled={!canCapture || !gameTime.trim() || isCapturing || (!hasConsented && isPublic)}
                    className="flex-1"
                  >
                    {isCapturing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 " />
                        Aufnehmen...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        Foto aufnehmen
                      </>
                    )}
                  </SimpleButton>
                ) : (
                  <>
                    {!isRecording ? (
                      <SimpleButton
                        onClick={startVideoRecording}
                        disabled={!canCapture || !gameTime.trim() || isProcessing || (!hasConsented && (mode === 'video' || isPublic))}
                        variant="primary"
                        className="flex-1"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Aufnahme starten
                      </SimpleButton>
                    ) : (
                      <SimpleButton
                        onClick={stopVideoRecording}
                        variant="danger"
                        className="flex-1"
                      >
                        <Square className="w-4 h-4 mr-2" />
                        Aufnahme stoppen
                      </SimpleButton>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {(isCapturing || isProcessing) && (
          <div className="mb-4 p-3 bg-green-900/30 border border-green-500/30 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="text-green-300 text-sm">
              {isCapturing ? 'Foto wird aufgenommen...' : 'Wird verarbeitet...'}
            </span>
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-gray-400 bg-gray-900/50 p-3 rounded">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4" />
            <span>Automatische Zeitstempel und Metadaten</span>
          </div>
          <p>
            Alle Aufnahmen werden automatisch mit Datum, Uhrzeit und Geräteinformationen versehen. 
            Nur authentifizierte Aufnahmen über die App zählen für offizielle Ranglisten.
          </p>
        </div>
      </div>
    </SimpleCard>
  )
}

export default MediaCaptureComponent
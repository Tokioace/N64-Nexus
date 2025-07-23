import React, { useState, useEffect } from 'react'
import { Play, Square, Users, ExternalLink, X, Radio } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useMedia } from '../contexts/MediaContext'
import { useUser } from '../contexts/UserContext'

interface LivestreamManagerProps {
  onClose: () => void
}

const LivestreamManager: React.FC<LivestreamManagerProps> = ({ onClose }) => {
  const { t } = useLanguage()
  const { startLivestream, stopLivestream, getLivestreams, loading } = useMedia()
  const { user } = useUser()
  
  const [activeTab, setActiveTab] = useState<'start' | 'live'>('start')
  const [streamData, setStreamData] = useState({
    title: '',
    gameId: '',
    gameName: '',
    platform: 'Twitch' as 'Twitch' | 'YouTube' | 'Facebook' | 'Other',
    streamUrl: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [liveStreams, setLiveStreams] = useState<any[]>([])

  const games = [
    { id: 'mario64', name: 'Super Mario 64' },
    { id: 'mariokart64', name: 'Mario Kart 64' },
    { id: 'goldeneye', name: 'GoldenEye 007' },
    { id: 'zelda-oot', name: 'The Legend of Zelda: Ocarina of Time' },
    { id: 'smash64', name: 'Super Smash Bros.' },
    { id: 'mario-party', name: 'Mario Party' }
  ]

  const platforms = [
    { id: 'Twitch', name: 'Twitch', color: 'purple' },
    { id: 'YouTube', name: 'YouTube', color: 'red' },
    { id: 'Facebook', name: 'Facebook Gaming', color: 'blue' },
    { id: 'Other', name: 'Andere', color: 'gray' }
  ]

  useEffect(() => {
    setLiveStreams(getLivestreams())
  }, [getLivestreams])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!streamData.title.trim()) {
      newErrors.title = 'Stream Titel ist erforderlich'
    }
    if (!streamData.gameId) {
      newErrors.gameId = 'Spiel auswählen ist erforderlich'
    }
    if (!streamData.streamUrl.trim()) {
      newErrors.streamUrl = 'Stream URL ist erforderlich'
    } else if (!isValidStreamUrl(streamData.streamUrl)) {
      newErrors.streamUrl = 'Ungültige Stream URL'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidStreamUrl = (url: string) => {
    const patterns = [
      /^https?:\/\/(www\.)?twitch\.tv\/.+/,
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=.+/,
      /^https?:\/\/(www\.)?facebook\.com\/gaming\/.+/,
      /^https?:\/\/.+/
    ]
    return patterns.some(pattern => pattern.test(url))
  }

  const handleStartStream = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !user) return

    const success = await startLivestream({
      title: streamData.title,
      gameId: streamData.gameId,
      platform: streamData.platform,
      streamUrl: streamData.streamUrl
    })

    if (success) {
      setStreamData({
        title: '',
        gameId: '',
        gameName: '',
        platform: 'Twitch',
        streamUrl: ''
      })
      setActiveTab('live')
      setLiveStreams(getLivestreams())
    }
  }

  const handleStopStream = async (streamId: string) => {
    const success = await stopLivestream(streamId)
    if (success) {
      setLiveStreams(getLivestreams())
    }
  }

  const getPlatformColor = (platform: string) => {
    const platformObj = platforms.find(p => p.id === platform)
    return platformObj?.color || 'gray'
  }

  const getPlatformColorClasses = (platform: string) => {
    switch (getPlatformColor(platform)) {
      case 'purple': return 'bg-purple-600 text-white'
      case 'red': return 'bg-red-600 text-white'
      case 'blue': return 'bg-blue-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-xl font-bold text-slate-100 mb-4">Anmeldung erforderlich</h2>
          <p className="text-slate-400 mb-4">Du musst angemeldet sein, um zu streamen.</p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Radio className="w-6 h-6 text-red-400" />
              {t('speedrun.startStream')}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('start')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'start'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Stream starten
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'live'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Radio className="w-4 h-4" />
              {t('speedrun.viewStreams')} {liveStreams.length > 0 && `(${liveStreams.length})`}
            </button>
          </div>

          {activeTab === 'start' && (
            <form onSubmit={handleStartStream} className="space-y-6">
              {/* Stream Title */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  {t('speedrun.streamTitle')} *
                </label>
                <input
                  type="text"
                  value={streamData.title}
                  onChange={(e) => setStreamData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="Mein Super Mario 64 Any% Speedrun Attempt"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Game Selection */}
                <div>
                  <label className="block text-slate-300 font-medium mb-2">
                    {t('speedrun.selectGame')} *
                  </label>
                  <select
                    value={streamData.gameId}
                    onChange={(e) => {
                      const selectedGame = games.find(g => g.id === e.target.value)
                      setStreamData(prev => ({ 
                        ...prev, 
                        gameId: e.target.value,
                        gameName: selectedGame?.name || ''
                      }))
                    }}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">{t('speedrun.selectGame')}</option>
                    {games.map(game => (
                      <option key={game.id} value={game.id}>{game.name}</option>
                    ))}
                  </select>
                  {errors.gameId && <p className="text-red-400 text-sm mt-1">{errors.gameId}</p>}
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-slate-300 font-medium mb-2">
                    {t('speedrun.streamPlatform')} *
                  </label>
                  <select
                    value={streamData.platform}
                    onChange={(e) => setStreamData(prev => ({ ...prev, platform: e.target.value as any }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    {platforms.map(platform => (
                      <option key={platform.id} value={platform.id}>{platform.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stream URL */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  {t('speedrun.streamUrl')} *
                </label>
                <input
                  type="url"
                  value={streamData.streamUrl}
                  onChange={(e) => setStreamData(prev => ({ ...prev, streamUrl: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="https://twitch.tv/deinusername"
                />
                {errors.streamUrl && <p className="text-red-400 text-sm mt-1">{errors.streamUrl}</p>}
                <p className="text-slate-400 text-sm mt-1">
                  Unterstützt: Twitch, YouTube Live, Facebook Gaming und andere Plattformen
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-lg transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Stream wird gestartet...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      {t('speedrun.goLive')}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'live' && (
            <div className="space-y-4">
              {liveStreams.length === 0 ? (
                <div className="text-center py-12">
                  <Radio className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-300 mb-2">
                    {t('speedrun.noStreamsLive')}
                  </h3>
                  <p className="text-slate-400">
                    {t('speedrun.noStreamsDescription')}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {liveStreams.map(stream => (
                    <div key={stream.id} className="bg-slate-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-red-400 text-sm font-medium">
                              {t('speedrun.currentlyLive')}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${getPlatformColorClasses(stream.streamPlatform || 'Other')}`}>
                              {stream.streamPlatform || 'Other'}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-bold text-slate-100 mb-1">
                            {stream.title}
                          </h3>
                          
                          <p className="text-slate-300 mb-2">
                            {stream.username} • {stream.gameName}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {Math.floor(Math.random() * 500) + 10} {t('speedrun.viewers')}
                            </span>
                            <span>
                              {new Date(stream.uploadDate).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <a
                            href={stream.livestreamUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Stream öffnen
                          </a>
                          
                                                     {stream.userId === user.id && (
                            <button
                              onClick={() => handleStopStream(stream.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Square className="w-4 h-4" />
                              {t('speedrun.stopStream')}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LivestreamManager
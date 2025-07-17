import React, { useState } from 'react'
import { Camera, Trophy, Shield, Eye, Upload, Users } from 'lucide-react'
import { useUser } from '../contexts/UserContext'
import { useEvents } from '../contexts/EventContext'
import MediaCaptureComponent from '../components/MediaCaptureComponent'
import MediaGallery from '../components/MediaGallery'
import SpeedrunLeaderboard from '../components/SpeedrunLeaderboard'
import MediaAdminPanel from '../components/MediaAdminPanel'
import RetroCard3D from '../components/RetroCard3D'
import RetroButton3D from '../components/RetroButton3D'

const SpeedrunMediaPage: React.FC = () => {
  const { user } = useUser()
  const { activeEvents } = useEvents()
  
  const [activeTab, setActiveTab] = useState<'capture' | 'gallery' | 'leaderboard' | 'admin'>('capture')
  const [selectedGame, setSelectedGame] = useState('mario-kart-64')
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>(
    activeEvents.length > 0 ? activeEvents[0].id : undefined
  )
  const [showCaptureModal, setShowCaptureModal] = useState(false)

  const games = [
    { id: 'mario-kart-64', name: 'Mario Kart 64' },
    { id: 'super-mario-64', name: 'Super Mario 64' },
    { id: 'goldeneye-007', name: 'GoldenEye 007' },
    { id: 'super-smash-bros', name: 'Super Smash Bros.' },
    { id: 'mario-party', name: 'Mario Party' }
  ]

  const handleMediaCaptured = (mediaId: string) => {
    console.log('Media captured:', mediaId)
    setShowCaptureModal(false)
    // Could show success message or redirect
  }

  const isAdmin = user?.username === 'admin' || user?.id === 'admin'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <RetroCard3D className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Camera className="w-8 h-8" />
                Speedrun Media Center
              </h1>
              <p className="text-gray-300">
                Nehmen Sie Ihre Speedruns auf, teilen Sie sie mit der Community und kämpfen Sie um die Bestzeiten!
              </p>
            </div>
            
            {user && (
              <div className="flex items-center gap-2">
                <RetroButton3D
                  variant="primary"
                  onClick={() => setShowCaptureModal(true)}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Aufnehmen
                </RetroButton3D>
                
                {isAdmin && (
                  <RetroButton3D
                    variant="secondary"
                    onClick={() => setActiveTab('admin')}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </RetroButton3D>
                )}
              </div>
            )}
          </div>
        </RetroCard3D>

        {/* Game and Event Selection */}
        <RetroCard3D className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Spiel auswählen
              </label>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                {games.map(game => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event (optional)
              </label>
              <select
                value={selectedEvent || ''}
                onChange={(e) => setSelectedEvent(e.target.value || undefined)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Kein Event</option>
                {activeEvents.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </RetroCard3D>

        {/* Navigation Tabs */}
        <div className="flex gap-2">
          <RetroButton3D
            variant={activeTab === 'capture' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('capture')}
          >
            <Camera className="w-4 h-4 mr-2" />
            Aufnehmen
          </RetroButton3D>
          
          <RetroButton3D
            variant={activeTab === 'gallery' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('gallery')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Galerie
          </RetroButton3D>
          
          <RetroButton3D
            variant={activeTab === 'leaderboard' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('leaderboard')}
          >
            <Trophy className="w-4 h-4 mr-2" />
            Rangliste
          </RetroButton3D>
          
          {isAdmin && (
            <RetroButton3D
              variant={activeTab === 'admin' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('admin')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </RetroButton3D>
          )}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'capture' && (
            <div className="space-y-6">
              <RetroCard3D className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Camera className="w-6 h-6" />
                  Speedrun aufnehmen
                </h2>
                <p className="text-gray-300 mb-6">
                  Nehmen Sie Ihren Speedrun direkt über die App auf. Alle Aufnahmen werden automatisch 
                  mit Zeitstempel, Spielname und Benutzer-ID versehen.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                    <Camera className="w-8 h-8 text-blue-400 mb-2" />
                    <h3 className="font-semibold text-white mb-1">Foto</h3>
                    <p className="text-sm text-gray-300">Screenshot Ihrer Endzeit</p>
                  </div>
                  <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                    <Upload className="w-8 h-8 text-purple-400 mb-2" />
                    <h3 className="font-semibold text-white mb-1">Video</h3>
                    <p className="text-sm text-gray-300">Vollständige Aufnahme Ihres Runs</p>
                  </div>
                  <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30">
                    <Users className="w-8 h-8 text-green-400 mb-2" />
                    <h3 className="font-semibold text-white mb-1">Community</h3>
                    <p className="text-sm text-gray-300">Teilen und bewerten Sie Runs</p>
                  </div>
                </div>

                <RetroButton3D
                  variant="primary"
                  onClick={() => setShowCaptureModal(true)}
                  disabled={!user}
                  className="w-full"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {user ? 'Aufnahme starten' : 'Anmeldung erforderlich'}
                </RetroButton3D>
              </RetroCard3D>

              {/* Recent Captures */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Neueste Aufnahmen</h3>
                <MediaGallery
                  gameId={selectedGame}
                  eventId={selectedEvent}
                  maxItems={6}
                  showOnlyPublic={true}
                />
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <MediaGallery
              gameId={selectedGame}
              eventId={selectedEvent}
              showOnlyPublic={true}
            />
          )}

          {activeTab === 'leaderboard' && (
            <div className="space-y-6">
              {/* Multiple Leaderboards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <SpeedrunLeaderboard
                    gameId={selectedGame}
                    eventId={selectedEvent}
                    type="weekly"
                    maxEntries={5}
                    showMedia={true}
                  />
                </div>
                <div>
                  <SpeedrunLeaderboard
                    gameId={selectedGame}
                    eventId={selectedEvent}
                    type="all-time"
                    maxEntries={5}
                    showMedia={true}
                  />
                </div>
              </div>
              
              {selectedEvent && (
                <SpeedrunLeaderboard
                  gameId={selectedGame}
                  eventId={selectedEvent}
                  type="event"
                  maxEntries={10}
                  showMedia={true}
                />
              )}
            </div>
          )}

          {activeTab === 'admin' && isAdmin && (
            <MediaAdminPanel />
          )}
        </div>

        {/* Capture Modal */}
        {showCaptureModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <MediaCaptureComponent
              gameId={selectedGame}
              eventId={selectedEvent}
              onMediaCaptured={handleMediaCaptured}
              onClose={() => setShowCaptureModal(false)}
            />
          </div>
        )}

        {/* Info Footer */}
        <RetroCard3D className="p-4">
          <div className="text-center text-gray-400 text-sm">
            <p className="mb-2">
              🎮 <strong>DSGVO-konform:</strong> Alle Medien werden lokal gespeichert und nur mit Ihrer Zustimmung verarbeitet.
            </p>
            <p>
              🏆 <strong>Fairplay:</strong> Nur verifizierte Medien mit Zeitstempel zählen für offizielle Ranglisten.
            </p>
          </div>
        </RetroCard3D>
      </div>
    </div>
  )
}

export default SpeedrunMediaPage
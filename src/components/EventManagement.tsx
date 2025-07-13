import { useState, useEffect } from 'react'
import { 
  Plus, 
  Play, 
  Pause, 
  Archive, 
  Edit, 
  Trash2,
  Calendar,
  Users,
  Trophy,
  Clock
} from 'lucide-react'

interface Event {
  id: string
  name: string
  game: string
  category: string
  platform: string
  status: 'draft' | 'active' | 'paused' | 'archived'
  startDate: string
  endDate: string
  participants: number
  maxParticipants: number
  screenshotRequired: boolean
  rules: string
}

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    // Simulate loading events
    const loadEvents = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setEvents([
        {
          id: '1',
          name: 'Mario Kart 64 Championship',
          game: 'Mario Kart 64',
          category: 'Racing',
          platform: 'N64',
          status: 'active',
          startDate: '2024-03-15',
          endDate: '2024-03-20',
          participants: 45,
          maxParticipants: 64,
          screenshotRequired: true,
          rules: 'Standard MK64 rules apply'
        },
        {
          id: '2',
          name: 'GoldenEye Tournament',
          game: 'GoldenEye 007',
          category: 'FPS',
          platform: 'N64',
          status: 'draft',
          startDate: '2024-04-01',
          endDate: '2024-04-05',
          participants: 0,
          maxParticipants: 32,
          screenshotRequired: false,
          rules: 'No Oddjob allowed'
        }
      ])
    }
    
    loadEvents()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-retro-green'
      case 'draft': return 'text-retro-yellow'
      case 'paused': return 'text-retro-orange'
      case 'archived': return 'text-retro-light-gray'
      default: return 'text-retro-light-gray'
    }
  }

  const handleEventAction = (action: string, eventId: string) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        switch (action) {
          case 'start':
            return { ...event, status: 'active' as const }
          case 'pause':
            return { ...event, status: 'paused' as const }
          case 'archive':
            return { ...event, status: 'archived' as const }
          default:
            return event
        }
      }
      return event
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-retro text-retro-green">Eventverwaltung</h1>
          <p className="text-retro-blue font-pixel">Verwaltung von Gaming-Events und Turnieren</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="admin-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Event erstellen
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="admin-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-retro-green mb-1">{event.name}</h3>
                <p className="text-retro-blue font-pixel">{event.game}</p>
              </div>
              <span className={`text-sm font-bold ${getStatusColor(event.status)}`}>
                {event.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2 text-retro-light-gray" />
                <span className="text-retro-light-gray">{event.startDate} - {event.endDate}</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 mr-2 text-retro-light-gray" />
                <span className="text-retro-green">{event.participants}/{event.maxParticipants} Teilnehmer</span>
              </div>
              <div className="flex items-center text-sm">
                <Trophy className="w-4 h-4 mr-2 text-retro-light-gray" />
                <span className="text-retro-yellow">{event.category}</span>
              </div>
              {event.screenshotRequired && (
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2 text-retro-light-gray" />
                  <span className="text-retro-orange">Screenshot erforderlich</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {event.status === 'draft' && (
                  <button
                    onClick={() => handleEventAction('start', event.id)}
                    className="text-retro-green hover:text-green-400"
                    title="Event starten"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
                {event.status === 'active' && (
                  <button
                    onClick={() => handleEventAction('pause', event.id)}
                    className="text-retro-orange hover:text-orange-400"
                    title="Event pausieren"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleEventAction('archive', event.id)}
                  className="text-retro-light-gray hover:text-white"
                  title="Archivieren"
                >
                  <Archive className="w-4 h-4" />
                </button>
              </div>
              <div className="flex space-x-2">
                <button className="text-retro-blue hover:text-blue-400" title="Bearbeiten">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-retro-red hover:text-red-400" title="Löschen">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="admin-card w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-retro text-retro-green">Event erstellen</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-retro-light-gray hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-retro-light-gray text-sm mb-2">Event-Name</label>
                <input type="text" className="admin-input w-full" placeholder="Event Name" />
              </div>
              <div>
                <label className="block text-retro-light-gray text-sm mb-2">Spiel</label>
                <select className="admin-input w-full">
                  <option>Mario Kart 64</option>
                  <option>GoldenEye 007</option>
                  <option>Super Mario 64</option>
                  <option>Zelda: Ocarina of Time</option>
                </select>
              </div>
              <div>
                <label className="block text-retro-light-gray text-sm mb-2">Kategorie</label>
                <select className="admin-input w-full">
                  <option>Racing</option>
                  <option>FPS</option>
                  <option>Adventure</option>
                  <option>Fighting</option>
                </select>
              </div>
              <div>
                <label className="block text-retro-light-gray text-sm mb-2">Max. Teilnehmer</label>
                <input type="number" className="admin-input w-full" placeholder="64" />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="admin-button"
              >
                Abbrechen
              </button>
              <button className="admin-button">
                Event erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
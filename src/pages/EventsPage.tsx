import React, { useState } from 'react'
import { useEvents } from '../contexts/EventContext'
import { GameEvent } from '../types'
import { 
  Calendar, 
  Filter, 
  Search, 
  Grid, 
  List,
  Clock,
  Zap,
  Target,
  Star,
  Trophy
} from 'lucide-react'
import RetroCard3D from '../components/RetroCard3D'
import RetroButton3D from '../components/RetroButton3D'
import EventCard from '../components/Event/EventCard'
import EventCalendar from '../components/Event/EventCalendar'
import EventDetail from '../components/Event/EventDetail'

type ViewMode = 'grid' | 'list' | 'calendar'
type FilterType = 'all' | 'active' | 'upcoming' | 'completed'
type EventType = 'all' | 'Speedrun' | 'Time Trial' | 'Challenge' | 'Collection' | 'Anniversary'

const EventsPage: React.FC = () => {
  const { events, activeEvents, upcomingEvents, completedEvents } = useEvents()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filter, setFilter] = useState<FilterType>('all')
  const [eventTypeFilter, setEventTypeFilter] = useState<EventType>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null)

  const getFilteredEvents = () => {
    let filteredEvents: GameEvent[] = []
    
    switch (filter) {
      case 'active':
        filteredEvents = activeEvents
        break
      case 'upcoming':
        filteredEvents = upcomingEvents
        break
      case 'completed':
        filteredEvents = completedEvents
        break
      default:
        filteredEvents = events
    }

    if (eventTypeFilter !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.type === eventTypeFilter)
    }

    if (searchTerm) {
      filteredEvents = filteredEvents.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filteredEvents
  }

  const filteredEvents = getFilteredEvents()

  const handleEventClick = (event: GameEvent) => {
    setSelectedEvent(event)
  }

  const handleBackToList = () => {
    setSelectedEvent(null)
  }

  const getEventTypeIcon = (type: EventType) => {
    switch (type) {
      case 'Speedrun': return <Zap className="w-4 h-4" />
      case 'Time Trial': return <Clock className="w-4 h-4" />
      case 'Challenge': return <Target className="w-4 h-4" />
      case 'Collection': return <Star className="w-4 h-4" />
      case 'Anniversary': return <Trophy className="w-4 h-4" />
      default: return <Calendar className="w-4 h-4" />
    }
  }

  if (selectedEvent) {
    return (
      <div className="container mx-auto px-4 py-6">
        <EventDetail
          event={selectedEvent}
          onBack={handleBackToList}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-shadow-lg mb-2 neon-text text-n64-purple font-tech">
          🎮 Event-Zentrale
        </h1>
        <p className="text-white/70 font-game text-lg">
          Alle N64-Events auf einen Blick
        </p>
      </div>

      {/* Controls */}
      <RetroCard3D
        variant="primary"
        className="p-6 animate-slide-in-up"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Events durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white font-game placeholder-white/50 focus:outline-none focus:border-n64-purple focus:ring-1 focus:ring-n64-purple"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-n64-blue" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white font-game focus:outline-none focus:border-n64-blue"
            >
              <option value="all">Alle Events</option>
              <option value="active">Aktive Events</option>
              <option value="upcoming">Kommende Events</option>
              <option value="completed">Beendete Events</option>
            </select>

            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value as EventType)}
              className="bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white font-game focus:outline-none focus:border-n64-blue"
            >
              <option value="all">Alle Typen</option>
              <option value="Speedrun">Speedrun</option>
              <option value="Time Trial">Time Trial</option>
              <option value="Challenge">Challenge</option>
              <option value="Collection">Collection</option>
              <option value="Anniversary">Anniversary</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center space-x-1 bg-black/30 rounded-lg p-1">
            <RetroButton3D
              variant={viewMode === 'grid' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('grid')}
              className="p-2 text-sm"
            >
              <Grid className="w-4 h-4" />
            </RetroButton3D>
            <RetroButton3D
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('list')}
              className="p-2 text-sm"
            >
              <List className="w-4 h-4" />
            </RetroButton3D>
            <RetroButton3D
              variant={viewMode === 'calendar' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('calendar')}
              className="p-2 text-sm"
            >
              <Calendar className="w-4 h-4" />
            </RetroButton3D>
          </div>
        </div>
      </RetroCard3D>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <RetroCard3D
          variant="primary"
          className="p-4 text-center animate-bounce-in"
        >
          <div className="text-2xl font-bold text-n64-green font-tech mb-1">
            {events.length}
          </div>
          <div className="text-sm text-white/70 font-game">Gesamt Events</div>
        </RetroCard3D>
        
        <RetroCard3D
          variant="secondary"
          className="p-4 text-center animate-bounce-in"
        >
          <div className="text-2xl font-bold text-n64-red font-tech mb-1">
            {activeEvents.length}
          </div>
          <div className="text-sm text-white/70 font-game">Aktive Events</div>
        </RetroCard3D>
        
        <RetroCard3D
          variant="primary"
          className="p-4 text-center animate-bounce-in"
        >
          <div className="text-2xl font-bold text-n64-blue font-tech mb-1">
            {upcomingEvents.length}
          </div>
          <div className="text-sm text-white/70 font-game">Kommende Events</div>
        </RetroCard3D>
        
        <RetroCard3D
          variant="secondary"
          className="p-4 text-center animate-bounce-in"
        >
          <div className="text-2xl font-bold text-n64-yellow font-tech mb-1">
            {completedEvents.length}
          </div>
          <div className="text-sm text-white/70 font-game">Beendete Events</div>
        </RetroCard3D>
      </div>

      {/* Event Type Filter Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {(['all', 'Speedrun', 'Time Trial', 'Challenge', 'Collection', 'Anniversary'] as EventType[]).map((type) => (
          <RetroButton3D
            key={type}
            variant={eventTypeFilter === type ? 'primary' : 'secondary'}
            onClick={() => setEventTypeFilter(type)}
            className="text-sm"
          >
            <div className="flex items-center space-x-1">
              {getEventTypeIcon(type)}
              <span>{type === 'all' ? 'Alle' : type}</span>
            </div>
          </RetroButton3D>
        ))}
      </div>

      {/* Content */}
      {viewMode === 'calendar' ? (
        <EventCalendar
          onEventClick={handleEventClick}
        />
      ) : (
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <RetroCard3D
              variant="secondary"
              className="p-8 text-center animate-fade-in"
            >
              <div className="text-n64-purple mb-4">
                <Calendar className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-white font-tech mb-2">
                Keine Events gefunden
              </h3>
              <p className="text-white/70 font-game">
                {searchTerm ? 'Versuche einen anderen Suchbegriff' : 'Schau später wieder vorbei!'}
              </p>
            </RetroCard3D>
          ) : (
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }
            `}>
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  variant={viewMode === 'list' ? 'compact' : 'default'}
                  onViewDetails={handleEventClick}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results Info */}
      {filteredEvents.length > 0 && (
        <div className="text-center">
          <p className="text-white/70 font-game">
            {filteredEvents.length} von {events.length} Events angezeigt
          </p>
        </div>
      )}
    </div>
  )
}

export default EventsPage
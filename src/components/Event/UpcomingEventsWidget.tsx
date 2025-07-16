import React from 'react'
import { useEvents } from '../../contexts/EventContext'
import { Calendar, Clock, Zap, ArrowRight } from 'lucide-react'
import RetroCard3D from '../RetroCard3D'
import RetroButton3D from '../RetroButton3D'
import EventCard from './EventCard'

interface UpcomingEventsWidgetProps {
  onViewAllEvents?: () => void
  onViewEventDetails?: (eventId: string) => void
}

const UpcomingEventsWidget: React.FC<UpcomingEventsWidgetProps> = ({
  onViewAllEvents,
  onViewEventDetails
}) => {
  const { activeEvents, upcomingEvents } = useEvents()

  const featuredEvent = activeEvents[0] || upcomingEvents[0]
  const otherEvents = [...activeEvents.slice(1), ...upcomingEvents.slice(activeEvents.length > 0 ? 0 : 1)]
    .slice(0, 3)

  if (!featuredEvent && otherEvents.length === 0) {
    return (
      <RetroCard3D
        variant="secondary"
        className="p-6 text-center animate-fade-in"
      >
        <div className="text-n64-purple mb-4">
          <Calendar className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-bold text-white font-tech mb-2">
          Keine Events verfügbar
        </h3>
        <p className="text-white/70 text-sm font-game">
          Schau später wieder vorbei für neue Events!
        </p>
      </RetroCard3D>
    )
  }

  return (
    <div className="space-y-4">
      {/* Widget Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-n64-purple/20 rounded-lg border border-n64-purple/30">
            <Zap className="w-5 h-5 text-n64-purple" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-tech neon-text">
              Aktuelle Events
            </h2>
            <p className="text-white/70 text-sm font-game">
              {activeEvents.length} aktiv • {upcomingEvents.length} kommend
            </p>
          </div>
        </div>
        {onViewAllEvents && (
          <RetroButton3D
            variant="secondary"
            onClick={onViewAllEvents}
            className="text-sm"
          >
            <div className="flex items-center space-x-1">
              <span>Alle Events</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </RetroButton3D>
        )}
      </div>

      {/* Featured Event */}
      {featuredEvent && (
        <div className="mb-4">
          <EventCard
            event={featuredEvent}
            variant="featured"
            onViewDetails={onViewEventDetails}
          />
        </div>
      )}

      {/* Other Events */}
      {otherEvents.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white font-tech flex items-center space-x-2">
            <Clock className="w-5 h-5 text-n64-blue" />
            <span>Weitere Events</span>
          </h3>
          <div className="space-y-2">
            {otherEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                variant="compact"
                onViewDetails={onViewEventDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <RetroCard3D
        variant="primary"
        className="p-4 animate-slide-in-up"
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-n64-red font-tech">
              {activeEvents.length}
            </div>
            <div className="text-xs text-white/70 font-game">Aktive Events</div>
          </div>
          <div>
            <div className="text-lg font-bold text-n64-blue font-tech">
              {upcomingEvents.length}
            </div>
            <div className="text-xs text-white/70 font-game">Kommende Events</div>
          </div>
          <div>
            <div className="text-lg font-bold text-n64-green font-tech">
              {activeEvents.reduce((sum, event) => sum + (event.participants || 0), 0)}
            </div>
            <div className="text-xs text-white/70 font-game">Teilnehmer</div>
          </div>
        </div>
      </RetroCard3D>
    </div>
  )
}

export default UpcomingEventsWidget
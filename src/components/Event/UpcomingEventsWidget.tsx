import React from 'react'
import { useEvents } from '../../contexts/EventContext'
import { Calendar, Clock, Zap, ArrowRight } from 'lucide-react'
import SimpleCard from '../SimpleCard'
import SimpleButton from '../SimpleButton'
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
      <SimpleCard
        variant="secondary"
        className="p-6 text-center "
      >
        <div className="text-blue-600 mb-4">
          <Calendar className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-bold text-white ">
          Keine Events verfügbar
        </h3>
        <p className="text-white/70 text-sm ">
          Schau später wieder vorbei für neue Events!
        </p>
      </SimpleCard>
    )
  }

  return (
    <div className="space-y-4">
      {/* Widget Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-600/30">
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white ">
              Aktuelle Events
            </h2>
            <p className="text-white/70 text-sm ">
              <span className="inline-block mr-2">
                {activeEvents.length} aktiv
              </span>
              <span className="text-white/50">•</span>
              <span className="inline-block ml-2">
                {upcomingEvents.length} kommend
              </span>
            </p>
          </div>
        </div>
        {onViewAllEvents && (
          <SimpleButton
            variant="secondary"
            onClick={onViewAllEvents}
            className="text-sm"
          >
            <div className="flex items-center space-x-1">
              <span>Alle Events</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </SimpleButton>
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
          <h3 className="text-lg font-bold text-white ">
            <Clock className="w-5 h-5 text-blue-600" />
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
      <SimpleCard
        variant="primary"
        className="p-4 "
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-red-600 ">
              {activeEvents.length}
            </div>
            <div className="text-xs text-white/70 ">Aktive Events</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600 ">
              {upcomingEvents.length}
            </div>
            <div className="text-xs text-white/70 ">Kommende Events</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600 ">
              {activeEvents.reduce((sum, event) => sum + (event.participants || 0), 0)}
            </div>
            <div className="text-xs text-white/70 ">Teilnehmer</div>
          </div>
        </div>
      </SimpleCard>
    </div>
  )
}

export default UpcomingEventsWidget
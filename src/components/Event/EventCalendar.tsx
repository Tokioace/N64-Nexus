import React, { useState, useMemo } from 'react'
import { useEvents } from '../../contexts/EventContext'
import { GameEvent } from '../../types'
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Zap, 
  Target, 
  Star,
  Trophy
} from 'lucide-react'
import SimpleCard from '../SimpleCard'
import SimpleButton from '../SimpleButton'

interface EventCalendarProps {
  onEventClick?: (event: GameEvent) => void
  onDateClick?: (date: Date, events: GameEvent[]) => void
}

const EventCalendar: React.FC<EventCalendarProps> = ({
  onEventClick,
  onDateClick
}) => {
  const { events, isEventActive } = useEvents()
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ]

  const weekDays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const endDate = new Date(lastDay)
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()))
    
    const days = []
    const currentDay = new Date(startDate)
    
    while (currentDay <= endDate) {
      const dayEvents = events.filter(event => {
        const eventStart = new Date(event.startDate)
        const eventEnd = new Date(event.endDate)
        return currentDay >= eventStart && currentDay <= eventEnd
      })
      
      days.push({
        date: new Date(currentDay),
        isCurrentMonth: currentDay.getMonth() === month,
        isToday: currentDay.toDateString() === new Date().toDateString(),
        events: dayEvents,
        hasActiveEvent: dayEvents.some(event => isEventActive(event))
      })
      
      currentDay.setDate(currentDay.getDate() + 1)
    }
    
    return days
  }, [currentDate, events, isEventActive])

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Speedrun': return <Zap className="w-3 h-3" />
      case 'Time Trial': return <Clock className="w-3 h-3" />
      case 'Challenge': return <Target className="w-3 h-3" />
      case 'Collection': return <Star className="w-3 h-3" />
      case 'Anniversary': return <Trophy className="w-3 h-3" />
      default: return <Calendar className="w-3 h-3" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'Speedrun': return 'bg-red-600/20 text-red-600 border-red-600/30'
      case 'Time Trial': return 'bg-blue-600/20 text-blue-600 border-blue-600/30'
      case 'Challenge': return 'bg-blue-600/20 text-blue-600 border-blue-600/30'
      case 'Collection': return 'bg-green-600/20 text-green-600 border-green-600/30'
      case 'Anniversary': return 'bg-yellow-600/20 text-yellow-600 border-yellow-600/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const handleDateClick = (day: any) => {
    if (onDateClick) {
      onDateClick(day.date, day.events)
    }
  }

  const handleEventClick = (event: GameEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEventClick) {
      onEventClick(event)
    }
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <SimpleCard
        variant="primary"
        className="p-6 "
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-600/20 rounded-lg border border-blue-600/30">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white ">
                Event-Kalender
              </h1>
              <p className="text-white/70 ">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <SimpleButton
              variant="secondary"
              onClick={() => navigateMonth('prev')}
              className="p-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </SimpleButton>
            <SimpleButton
              variant="secondary"
              onClick={() => setCurrentDate(new Date())}
              className="text-sm px-4"
            >
              Heute
            </SimpleButton>
            <SimpleButton
              variant="secondary"
              onClick={() => navigateMonth('next')}
              className="p-2"
            >
              <ChevronRight className="w-5 h-5" />
            </SimpleButton>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div
              key={day}
              className="text-center p-2 text-sm "
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarData.map((day, index) => (
            <div
              key={index}
              className={`
                min-h-[100px] p-2 border border-white/10 cursor-pointer
                transition-all duration-200 hover:bg-white/5
                ${day.isCurrentMonth ? 'bg-black/20' : 'bg-black/10'}
                ${day.isToday ? 'ring-2 ring-yellow-600' : ''}
                ${day.hasActiveEvent ? 'bg-blue-600/10' : ''}
              `}
              onClick={() => handleDateClick(day)}
            >
              {/* Date Number */}
              <div className={`
                text-sm 
                ${day.isCurrentMonth ? 'text-white' : 'text-white/50'}
                ${day.isToday ? 'text-yellow-600 font-bold' : ''}
              `}>
                {day.date.getDate()}
              </div>

              {/* Events */}
              <div className="space-y-1">
                {day.events.slice(0, 3).map((event, eventIndex) => (
                  <div
                    key={event.id}
                    className={`
                      text-xs p-1 rounded border cursor-pointer
                      transition-all duration-200 hover:scale-105
                      ${getEventColor(event.type)}
                      ${isEventActive(event) ? 'bg-green-600 text-white' : ''}
                    `}
                    onClick={(e) => handleEventClick(event, e)}
                    title={event.title}
                  >
                    <div className="flex items-center space-x-1">
                      {getEventIcon(event.type)}
                      <span className="truncate ">
                        {event.title.length > 12 ? event.title.substring(0, 12) + '...' : event.title}
                      </span>
                    </div>
                  </div>
                ))}
                
                {day.events.length > 3 && (
                  <div className="text-xs text-white/50 ">
                    +{day.events.length - 3} mehr
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </SimpleCard>

      {/* Legend */}
      <SimpleCard
        variant="secondary"
        className="p-4 "
      >
        <h3 className="text-lg font-bold text-white ">Legende</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600/20 border border-red-600/30 rounded flex items-center justify-center">
              <Zap className="w-2 h-2 text-red-600" />
            </div>
            <span className="text-sm text-white/70 ">Speedrun</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600/20 border border-blue-600/30 rounded flex items-center justify-center">
              <Clock className="w-2 h-2 text-blue-600" />
            </div>
            <span className="text-sm text-white/70 ">Time Trial</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600/20 border border-blue-600/30 rounded flex items-center justify-center">
              <Target className="w-2 h-2 text-blue-600" />
            </div>
            <span className="text-sm text-white/70 ">Challenge</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-600/20 border border-green-600/30 rounded flex items-center justify-center">
              <Star className="w-2 h-2 text-green-600" />
            </div>
            <span className="text-sm text-white/70 ">Collection</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-600/20 border border-yellow-600/30 rounded flex items-center justify-center">
              <Trophy className="w-2 h-2 text-yellow-600" />
            </div>
            <span className="text-sm text-white/70 ">Anniversary</span>
          </div>
        </div>
      </SimpleCard>

      {/* Quick Stats */}
      <SimpleCard
        variant="primary"
        className="p-4 "
      >
        <h3 className="text-lg font-bold text-white ">Monats-Statistiken</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600 ">
              {events.filter(event => {
                const eventDate = new Date(event.startDate)
                return eventDate.getMonth() === currentDate.getMonth() && 
                       eventDate.getFullYear() === currentDate.getFullYear()
              }).length}
            </div>
            <div className="text-xs text-white/70 ">Events diesen Monat</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600 ">
              {events.filter(event => isEventActive(event)).length}
            </div>
            <div className="text-xs text-white/70 ">Aktive Events</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600 ">
              {events.filter(event => {
                const eventDate = new Date(event.startDate)
                return eventDate > new Date() && 
                       eventDate.getMonth() === currentDate.getMonth() && 
                       eventDate.getFullYear() === currentDate.getFullYear()
              }).length}
            </div>
            <div className="text-xs text-white/70 ">Kommende Events</div>
          </div>
        </div>
      </SimpleCard>
    </div>
  )
}

export default EventCalendar
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
import RetroCard3D from '../RetroCard3D'
import RetroButton3D from '../RetroButton3D'

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
      case 'Speedrun': return 'bg-n64-red/20 text-n64-red border-n64-red/30'
      case 'Time Trial': return 'bg-n64-blue/20 text-n64-blue border-n64-blue/30'
      case 'Challenge': return 'bg-n64-purple/20 text-n64-purple border-n64-purple/30'
      case 'Collection': return 'bg-n64-green/20 text-n64-green border-n64-green/30'
      case 'Anniversary': return 'bg-n64-yellow/20 text-n64-yellow border-n64-yellow/30'
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
      <RetroCard3D
        variant="primary"
        className="p-6 animate-slide-in-up"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-n64-blue/20 rounded-lg border border-n64-blue/30">
              <Calendar className="w-6 h-6 text-n64-blue" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white font-tech neon-text">
                Event-Kalender
              </h1>
              <p className="text-white/70 font-game">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <RetroButton3D
              variant="secondary"
              onClick={() => navigateMonth('prev')}
              className="p-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </RetroButton3D>
            <RetroButton3D
              variant="secondary"
              onClick={() => setCurrentDate(new Date())}
              className="text-sm px-4"
            >
              Heute
            </RetroButton3D>
            <RetroButton3D
              variant="secondary"
              onClick={() => navigateMonth('next')}
              className="p-2"
            >
              <ChevronRight className="w-5 h-5" />
            </RetroButton3D>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div
              key={day}
              className="text-center p-2 text-sm font-tech text-n64-purple font-bold"
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
                ${day.isToday ? 'ring-2 ring-n64-yellow' : ''}
                ${day.hasActiveEvent ? 'bg-n64-purple/10' : ''}
              `}
              onClick={() => handleDateClick(day)}
            >
              {/* Date Number */}
              <div className={`
                text-sm font-tech mb-1
                ${day.isCurrentMonth ? 'text-white' : 'text-white/50'}
                ${day.isToday ? 'text-n64-yellow font-bold' : ''}
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
                      ${isEventActive(event) ? 'animate-pulse' : ''}
                    `}
                    onClick={(e) => handleEventClick(event, e)}
                    title={event.title}
                  >
                    <div className="flex items-center space-x-1">
                      {getEventIcon(event.type)}
                      <span className="truncate font-game">
                        {event.title.length > 12 ? event.title.substring(0, 12) + '...' : event.title}
                      </span>
                    </div>
                  </div>
                ))}
                
                {day.events.length > 3 && (
                  <div className="text-xs text-white/50 font-game text-center">
                    +{day.events.length - 3} mehr
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </RetroCard3D>

      {/* Legend */}
      <RetroCard3D
        variant="secondary"
        className="p-4 animate-slide-in-left"
      >
        <h3 className="text-lg font-bold text-white font-tech mb-3">Legende</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-n64-red/20 border border-n64-red/30 rounded flex items-center justify-center">
              <Zap className="w-2 h-2 text-n64-red" />
            </div>
            <span className="text-sm text-white/70 font-game">Speedrun</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-n64-blue/20 border border-n64-blue/30 rounded flex items-center justify-center">
              <Clock className="w-2 h-2 text-n64-blue" />
            </div>
            <span className="text-sm text-white/70 font-game">Time Trial</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-n64-purple/20 border border-n64-purple/30 rounded flex items-center justify-center">
              <Target className="w-2 h-2 text-n64-purple" />
            </div>
            <span className="text-sm text-white/70 font-game">Challenge</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-n64-green/20 border border-n64-green/30 rounded flex items-center justify-center">
              <Star className="w-2 h-2 text-n64-green" />
            </div>
            <span className="text-sm text-white/70 font-game">Collection</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-n64-yellow/20 border border-n64-yellow/30 rounded flex items-center justify-center">
              <Trophy className="w-2 h-2 text-n64-yellow" />
            </div>
            <span className="text-sm text-white/70 font-game">Anniversary</span>
          </div>
        </div>
      </RetroCard3D>

      {/* Quick Stats */}
      <RetroCard3D
        variant="primary"
        className="p-4 animate-slide-in-right"
      >
        <h3 className="text-lg font-bold text-white font-tech mb-3">Monats-Statistiken</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-n64-green font-tech">
              {events.filter(event => {
                const eventDate = new Date(event.startDate)
                return eventDate.getMonth() === currentDate.getMonth() && 
                       eventDate.getFullYear() === currentDate.getFullYear()
              }).length}
            </div>
            <div className="text-xs text-white/70 font-game">Events diesen Monat</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-n64-blue font-tech">
              {events.filter(event => isEventActive(event)).length}
            </div>
            <div className="text-xs text-white/70 font-game">Aktive Events</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-n64-purple font-tech">
              {events.filter(event => {
                const eventDate = new Date(event.startDate)
                return eventDate > new Date() && 
                       eventDate.getMonth() === currentDate.getMonth() && 
                       eventDate.getFullYear() === currentDate.getFullYear()
              }).length}
            </div>
            <div className="text-xs text-white/70 font-game">Kommende Events</div>
          </div>
        </div>
      </RetroCard3D>
    </div>
  )
}

export default EventCalendar
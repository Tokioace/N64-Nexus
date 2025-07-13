import React, { useState, useEffect } from 'react';
import { Event, EventCategory } from '../types/event';
import { getMonthDays, isEventInDateRange, formatEventDate } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarProps {
  events: Event[];
  onDayClick?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
  className?: string;
}

const getEventsForDate = (events: Event[], date: Date): Event[] => {
  return events.filter(event => isEventInDateRange(event, date, date));
};

const getCategoryColor = (category: EventCategory): string => {
  switch (category) {
    case 'speedrun':
      return 'bg-battle64-speedrun';
    case 'fanart':
      return 'bg-battle64-fanart';
    case 'glitch':
      return 'bg-battle64-glitch';
    case 'teams':
      return 'bg-battle64-teams';
    default:
      return 'bg-battle64-primary';
  }
};

const getCategoryIcon = (category: EventCategory): string => {
  switch (category) {
    case 'speedrun':
      return '🏃';
    case 'fanart':
      return '🎨';
    case 'glitch':
      return '🐛';
    case 'teams':
      return '👥';
    default:
      return '🎮';
  }
};

export const Calendar: React.FC<CalendarProps> = ({
  events,
  onDayClick,
  onEventClick,
  className = ''
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getMonthDays(year, month);

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    onDayClick?.(date);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === month && date.getFullYear() === year;
  };

  const getDayEvents = (date: Date): Event[] => {
    return getEventsForDate(events, date);
  };

  return (
    <div className={`bg-battle64-dark border border-battle64-primary rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-battle64-primary/20 rounded transition-colors"
          >
            <ChevronLeft size={20} className="text-battle64-primary" />
          </button>
          
          <h2 className="font-pixel text-xl text-battle64-primary">
            {monthNames[month]} {year}
          </h2>
          
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-battle64-primary/20 rounded transition-colors"
          >
            <ChevronRight size={20} className="text-battle64-primary" />
          </button>
        </div>
        
        <button
          onClick={goToToday}
          className="px-4 py-2 bg-battle64-accent text-white rounded font-pixel text-sm hover:bg-battle64-accent/80 transition-colors"
        >
          Heute
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center font-pixel text-sm text-battle64-accent">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const dayEvents = getDayEvents(date);
          const hasEvents = dayEvents.length > 0;
          const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
          
          return (
            <div
              key={index}
              className={`calendar-day p-2 min-h-[80px] relative ${
                !isCurrentMonth(date) ? 'opacity-50' : ''
              } ${
                isToday(date) ? 'ring-2 ring-battle64-warning' : ''
              } ${
                isSelected ? 'bg-battle64-primary/30' : ''
              } ${
                hasEvents ? 'has-events' : ''
              }`}
              onClick={() => handleDayClick(date)}
            >
              <div className="text-sm font-pixel mb-1">
                {date.getDate()}
              </div>
              
              {/* Event Indicators */}
              {hasEvents && (
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className={`px-1 py-0.5 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity ${
                        getCategoryColor(event.category)
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                      title={`${getCategoryIcon(event.category)} ${event.title}`}
                    >
                      <div className="flex items-center gap-1">
                        <span>{getCategoryIcon(event.category)}</span>
                        <span className="truncate">{event.title}</span>
                      </div>
                    </div>
                  ))}
                  
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-battle64-light/70 text-center">
                      +{dayEvents.length - 3} weitere
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Day Events */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-battle64-dark/50 border border-battle64-primary rounded-lg">
          <h3 className="font-pixel text-lg text-battle64-primary mb-3">
            Events am {formatEventDate(selectedDate)}
          </h3>
          
          {getDayEvents(selectedDate).length === 0 ? (
            <p className="text-battle64-light/70">Keine Events an diesem Tag</p>
          ) : (
            <div className="space-y-2">
              {getDayEvents(selectedDate).map(event => (
                <div
                  key={event.id}
                  className="p-2 bg-battle64-dark border border-battle64-primary rounded cursor-pointer hover:bg-battle64-primary/10 transition-colors"
                  onClick={() => onEventClick?.(event)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(event.category)}</span>
                    <div className="flex-1">
                      <div className="font-pixel text-sm text-battle64-primary">{event.title}</div>
                      <div className="text-xs text-battle64-light/70">{event.description}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
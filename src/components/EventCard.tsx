import React, { useState, useEffect } from 'react';
import { Event, EventCategory } from '../types/event';
import { formatEventDate, formatCountdown, getEventStatus } from '../utils/dateUtils';
import { Calendar, Clock, Users, Trophy, Bell, BellOff } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onParticipate?: (eventId: string) => void;
  onSetReminder?: (eventId: string, enabled: boolean) => void;
  isParticipating?: boolean;
  hasReminder?: boolean;
  className?: string;
}

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

const getPlatformIcon = (platform: string): string => {
  switch (platform) {
    case 'NTSC':
      return '🇺🇸';
    case 'PAL':
      return '🇪🇺';
    case 'console':
      return '🎮';
    case 'emulator':
      return '💻';
    default:
      return '🎮';
  }
};

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onParticipate,
  onSetReminder,
  isParticipating = false,
  hasReminder = false,
  className = ''
}) => {
  const [countdown, setCountdown] = useState(formatCountdown(event.startDate));
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(formatCountdown(event.startDate));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [event.startDate]);

  const status = getEventStatus(event);
  const isActive = status === 'active';
  const isUpcoming = status === 'upcoming';

  return (
    <div
      className={`event-card ${className} ${isActive ? 'ring-2 ring-battle64-success' : ''} ${
        event.isTopEvent ? 'ring-2 ring-battle64-warning' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getCategoryIcon(event.category)}</span>
          <div>
            <h3 className="font-pixel text-lg text-battle64-primary">{event.title}</h3>
            <div className="flex items-center gap-2 text-sm text-battle64-light/80">
              <span>{getPlatformIcon(event.platform)} {event.platform}</span>
              <span>•</span>
              <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(event.category)}`}>
                {event.category}
              </span>
            </div>
          </div>
        </div>
        
        {event.isTopEvent && (
          <div className="flex items-center gap-1 text-battle64-warning">
            <Trophy size={16} />
            <span className="text-xs font-pixel">TOP</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-battle64-light/90 mb-3">{event.description}</p>

      {/* Event Details */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={14} className="text-battle64-accent" />
          <span>{formatEventDate(event.startDate)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Clock size={14} className="text-battle64-accent" />
          <span>Endet: {formatEventDate(event.endDate)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Users size={14} className="text-battle64-accent" />
          <span>{event.currentParticipants}/{event.maxParticipants || '∞'} Teilnehmer</span>
        </div>
      </div>

      {/* Countdown */}
      {isUpcoming && (
        <div className="mb-3 p-2 bg-battle64-dark/50 rounded border border-battle64-primary">
          <div className="text-center">
            <div className="countdown-timer text-lg font-pixel">{countdown}</div>
            <div className="text-xs text-battle64-light/70">bis zum Start</div>
          </div>
        </div>
      )}

      {/* Status Badge */}
      <div className="mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-pixel ${
          status === 'active' ? 'bg-battle64-success text-white' :
          status === 'upcoming' ? 'bg-battle64-warning text-white' :
          'bg-battle64-error text-white'
        }`}>
          {status === 'active' ? 'AKTIV' : status === 'upcoming' ? 'GEPLANT' : 'BEENDET'}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {onParticipate && isUpcoming && (
          <button
            onClick={() => onParticipate(event.id)}
            className={`flex-1 px-3 py-2 rounded font-pixel text-sm transition-colors ${
              isParticipating
                ? 'bg-battle64-success text-white'
                : 'bg-battle64-primary text-white hover:bg-battle64-primary/80'
            }`}
          >
            {isParticipating ? 'Teilgenommen' : 'Teilnehmen'}
          </button>
        )}
        
        {onSetReminder && isUpcoming && (
          <button
            onClick={() => onSetReminder(event.id, !hasReminder)}
            className={`px-3 py-2 rounded font-pixel text-sm transition-colors ${
              hasReminder
                ? 'bg-battle64-accent text-white'
                : 'bg-battle64-dark border border-battle64-accent text-battle64-accent hover:bg-battle64-accent hover:text-white'
            }`}
          >
            {hasReminder ? <Bell size={16} /> : <BellOff size={16} />}
          </button>
        )}
      </div>

      {/* Hover Details */}
      {isHovered && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-battle64-dark border border-battle64-primary rounded-lg p-3 z-10 shadow-lg">
          <div className="space-y-2 text-sm">
            <div>
              <strong className="text-battle64-primary">Organisator:</strong> {event.organizer}
            </div>
            {event.rules && (
              <div>
                <strong className="text-battle64-primary">Regeln:</strong> {event.rules}
              </div>
            )}
            {event.prizes && (
              <div>
                <strong className="text-battle64-warning">Preise:</strong> {event.prizes}
              </div>
            )}
            {event.tags.length > 0 && (
              <div>
                <strong className="text-battle64-accent">Tags:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {event.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-battle64-dark border border-battle64-accent rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
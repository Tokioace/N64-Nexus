import React, { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { de } from 'date-fns/locale'
import './EventCard.css'

interface EventReward {
  xp: number
  medal: string
}

interface Event {
  id: string
  name: string
  startDate: Date
  endDate: Date
  platform: string
  emulator: string
  glitchFree: boolean
  game: string
  reward: EventReward
  participants: number
  screenshots: number
  status: 'active' | 'completed' | 'upcoming'
}

interface EventCardProps {
  event: Event
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [isHovered, setIsHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const end = event.endDate
      
      if (now < end) {
        const distance = formatDistanceToNow(end, { 
          locale: de,
          addSuffix: false 
        })
        setTimeLeft(distance)
      } else {
        setTimeLeft('Event beendet')
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [event.endDate])

  const handleParticipate = () => {
    // TODO: Implement participation logic
    console.log('Participating in event:', event.id)
  }

  const handleScreenshot = () => {
    // TODO: Implement screenshot capture
    console.log('Taking screenshot for event:', event.id)
  }

  const getStatusBadge = () => {
    switch (event.status) {
      case 'active':
        return <span className="status-badge active">🏁 Aktiv</span>
      case 'completed':
        return <span className="status-badge completed">✅ Beendet</span>
      case 'upcoming':
        return <span className="status-badge upcoming">⏰ Bald</span>
      default:
        return null
    }
  }

  return (
    <div 
      className={`event-card pixel-border ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="event-header">
        <h3 className="event-name">🏁 {event.name}</h3>
        {getStatusBadge()}
      </div>

      <div className="event-info">
        <div className="info-row">
          <span className="info-label">📆 Datum:</span>
          <span className="info-value">
            {event.startDate.toLocaleDateString('de-DE')} – {event.endDate.toLocaleDateString('de-DE')}
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">🕓 Countdown:</span>
          <span className="info-value countdown">{timeLeft}</span>
        </div>

        <div className="info-row">
          <span className="info-label">🎮 Plattform:</span>
          <span className="info-value">
            {event.platform} / {event.emulator} / {event.glitchFree ? 'Glitchfrei' : 'Glitch erlaubt'}
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">🧩 Spiel:</span>
          <span className="info-value">{event.game}</span>
        </div>

        <div className="info-row">
          <span className="info-label">🏆 Belohnung:</span>
          <span className="info-value">{event.reward.xp} XP + {event.reward.medal}</span>
        </div>

        <div className="info-row">
          <span className="info-label">📷 Teilnehmer:</span>
          <span className="info-value">{event.participants} | Screenshots: {event.screenshots}</span>
        </div>
      </div>

      <div className="event-actions">
        <button 
          className="retro-button participate-btn"
          onClick={handleParticipate}
          disabled={event.status !== 'active'}
        >
          Teilnehmen
        </button>
        
        <button 
          className="retro-button screenshot-btn"
          onClick={handleScreenshot}
          disabled={event.status !== 'active'}
        >
          Screenshot
        </button>
        
        <button 
          className="retro-button details-btn"
          onClick={() => setShowDetails(!showDetails)}
        >
          Details
        </button>
      </div>

      {showDetails && (
        <div className="event-details fade-in">
          <h4>Event Details</h4>
          <p>Event ID: {event.id}</p>
          <p>Status: {event.status}</p>
          <p>Start: {event.startDate.toLocaleString('de-DE')}</p>
          <p>Ende: {event.endDate.toLocaleString('de-DE')}</p>
          <p>Dauer: {Math.round((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60 * 60))} Stunden</p>
        </div>
      )}

      {isHovered && (
        <div className="hover-preview">
          <div className="preview-content">
            <h4>🏆 Aktuelle Bestzeit</h4>
            <p className="best-time">2:09.45 - SpeedDemon</p>
            <p className="preview-note">Hover für Vorschau</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventCard
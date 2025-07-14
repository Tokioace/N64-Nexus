import React, { useState } from 'react'
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2 } from 'lucide-react'
import './EventsPage.css'

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  participants: number
  maxParticipants: number
  isRegistered: boolean
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Speedrunning Marathon',
      description: 'Ein 24-Stunden Speedrunning Event mit verschiedenen Spielen',
      date: '2024-02-15',
      time: '18:00',
      location: 'Online',
      participants: 45,
      maxParticipants: 100,
      isRegistered: false,
    },
    {
      id: '2',
      title: 'Retro Gaming Meetup',
      description: 'Treffen für Retro Gaming Enthusiasten',
      date: '2024-02-20',
      time: '14:00',
      location: 'Gaming Center Berlin',
      participants: 12,
      maxParticipants: 30,
      isRegistered: true,
    },
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: 50,
  })

  const toggleRegistration = (id: string) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === id
          ? {
              ...event,
              isRegistered: !event.isRegistered,
              participants: event.isRegistered
                ? event.participants - 1
                : event.participants + 1,
            }
          : event
      )
    )
  }

  const createEvent = () => {
    const event: Event = {
      id: Date.now().toString(),
      ...newEvent,
      participants: 0,
      isRegistered: false,
    }
    setEvents(prev => [...prev, event])
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      maxParticipants: 50,
    })
    setShowCreateForm(false)
  }

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id))
  }

  return (
    <div className="events-page">
      <header className="page-header">
        <h1>Events</h1>
        <p>Entdecke und organisiere Gaming Events</p>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Event erstellen
        </button>
      </header>

      {showCreateForm && (
        <div className="create-event-form">
          <h2>Neues Event erstellen</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Titel</label>
              <input
                type="text"
                id="title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent(prev => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Beschreibung</label>
              <textarea
                id="description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent(prev => ({ ...prev, description: e.target.value }))
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Datum</label>
              <input
                type="date"
                id="date"
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent(prev => ({ ...prev, date: e.target.value }))
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="time">Zeit</label>
              <input
                type="time"
                id="time"
                value={newEvent.time}
                onChange={(e) =>
                  setNewEvent(prev => ({ ...prev, time: e.target.value }))
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Ort</label>
              <input
                type="text"
                id="location"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent(prev => ({ ...prev, location: e.target.value }))
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="maxParticipants">Max. Teilnehmer</label>
              <input
                type="number"
                id="maxParticipants"
                value={newEvent.maxParticipants}
                onChange={(e) =>
                  setNewEvent(prev => ({
                    ...prev,
                    maxParticipants: parseInt(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          <div className="form-actions">
            <button onClick={createEvent} className="btn btn-primary">
              Event erstellen
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="btn btn-secondary"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <h3>{event.title}</h3>
              <div className="event-actions">
                <button className="btn-icon">
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="btn-icon btn-danger"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <p className="event-description">{event.description}</p>
            
            <div className="event-details">
              <div className="detail">
                <Calendar size={16} />
                <span>{new Date(event.date).toLocaleDateString('de-DE')}</span>
              </div>
              <div className="detail">
                <Clock size={16} />
                <span>{event.time}</span>
              </div>
              <div className="detail">
                <MapPin size={16} />
                <span>{event.location}</span>
              </div>
              <div className="detail">
                <Users size={16} />
                <span>
                  {event.participants}/{event.maxParticipants} Teilnehmer
                </span>
              </div>
            </div>

            <div className="event-actions">
              <button
                onClick={() => toggleRegistration(event.id)}
                className={`btn ${
                  event.isRegistered ? 'btn-secondary' : 'btn-primary'
                }`}
                disabled={
                  !event.isRegistered &&
                  event.participants >= event.maxParticipants
                }
              >
                {event.isRegistered ? 'Abmelden' : 'Anmelden'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EventsPage
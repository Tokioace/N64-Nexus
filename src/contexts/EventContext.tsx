import React, { createContext, useContext, useState, ReactNode } from 'react'
import { GameEvent, EventParticipation, EventContextType } from '../types'

const EventContext = createContext<EventContextType | undefined>(undefined)

const mockEvents: GameEvent[] = [
  {
    id: '1',
    title: 'Mario Kart 64 Speedrun Challenge',
    description: 'Wer schafft die schnellste Zeit auf der Mushroom Cup?',
    game: 'Mario Kart 64',
    category: 'Speedrun',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-15'),
    isActive: false,
    participants: 42,
    maxParticipants: 100,
    rules: ['PAL-Version', 'Keine Glitches', 'Video-Beweis erforderlich'],
    prizes: ['1. Platz: Goldene Cartridge', '2. Platz: Silberne Cartridge', '3. Platz: Bronze Cartridge'],
    region: 'PAL'
  },
  {
    id: '2',
    title: 'Mario Kart 64 - Luigi\'s Raceway Live Event',
    description: 'Eine Woche lang Luigi\'s Raceway Zeitrennen! Zeigt eure beste Zeit auf der klassischen Strecke und kämpft um die Krone!',
    game: 'Mario Kart 64',
    category: 'Time Trial',
    startDate: new Date('2025-07-20'),
    endDate: new Date('2025-07-27'),
    isActive: true,
    participants: 0,
    maxParticipants: 150,
    rules: [
      'Luigi\'s Raceway - 3 Runden',
      'PAL oder NTSC Version erlaubt',
      'Keine Glitches oder Shortcuts',
      'Screenshot oder Video als Beweis erforderlich',
      'Beste Zeit pro Spieler zählt',
      'Startzeit: Sonntag 20.07.2025',
      'Endzeit: Sonntag 27.07.2025 23:59 UTC'
    ],
    prizes: [
      '🥇 1. Platz: Goldener Luigi Trophy + 200 XP + Luigi\'s Raceway Master Badge',
      '🥈 2. Platz: Silberner Luigi Trophy + 150 XP + Speed Demon Badge', 
      '🥉 3. Platz: Bronzener Luigi Trophy + 100 XP + Time Trial Expert Badge',
      '🏆 Top 10: Luigi\'s Raceway Veteran Badge + 50 XP',
      '🎮 Alle Teilnehmer: Luigi\'s Raceway Participant Badge + 25 XP'
    ],
    region: 'BOTH'
  }
]

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<GameEvent[]>(mockEvents)
  const [activeEvents, setActiveEvents] = useState<GameEvent[]>(mockEvents.filter(e => e.isActive))
  const [userParticipations, setUserParticipations] = useState<EventParticipation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getEvents = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  const joinEvent = async (eventId: string): Promise<boolean> => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update the event participant count
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, participants: event.participants + 1 }
            : event
        )
      )
      
      // Update active events as well
      setActiveEvents(prevActiveEvents => 
        prevActiveEvents.map(event => 
          event.id === eventId 
            ? { ...event, participants: event.participants + 1 }
            : event
        )
      )
      
      // Add to user participations
      const newParticipation: EventParticipation = {
        id: Date.now().toString(),
        eventId,
        userId: '1', // Mock user ID
        username: 'RetroGamer64',
        submissionDate: new Date(),
        verified: false
      }
      
      setUserParticipations(prev => [...prev, newParticipation])
      setLoading(false)
      return true
    } catch (err) {
      setError('Fehler beim Beitreten zum Event')
      setLoading(false)
      return false
    }
  }

  const leaveEvent = async (eventId: string): Promise<boolean> => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update the event participant count
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, participants: Math.max(0, event.participants - 1) }
            : event
        )
      )
      
      // Update active events as well
      setActiveEvents(prevActiveEvents => 
        prevActiveEvents.map(event => 
          event.id === eventId 
            ? { ...event, participants: Math.max(0, event.participants - 1) }
            : event
        )
      )
      
      // Remove from user participations
      setUserParticipations(prev => prev.filter(p => p.eventId !== eventId))
      
      setLoading(false)
      return true
    } catch (err) {
      setError('Fehler beim Verlassen des Events')
      setLoading(false)
      return false
    }
  }

  const submitScore = async (eventId: string, score: number, time?: string, mediaUrl?: string): Promise<boolean> => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setLoading(false)
      return true
    } catch (err) {
      setError('Fehler beim Übermitteln der Punktzahl')
      setLoading(false)
      return false
    }
  }

  const getLeaderboard = (eventId: string): EventParticipation[] => {
    return userParticipations.filter(p => p.eventId === eventId)
  }

  const value: EventContextType = {
    events,
    activeEvents,
    userParticipations,
    loading,
    error,
    getEvents,
    joinEvent,
    leaveEvent,
    submitScore,
    getLeaderboard
  }

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  )
}

export const useEvent = () => {
  const context = useContext(EventContext)
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider')
  }
  return context
}
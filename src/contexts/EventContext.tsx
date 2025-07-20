import React, { createContext, useContext, useState, ReactNode } from 'react'
import { GameEvent, EventParticipation, EventContextType, RaceSubmissionData } from '../types'

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

const mockParticipations: EventParticipation[] = [
  {
    id: 'p1',
    eventId: '2',
    userId: 'user1',
    username: 'SpeedDemon64',
    time: '1:32.456',
    submissionDate: new Date('2025-07-21T10:30:00'),
    documentationType: 'video',
    mediaUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    verified: true
  },
  {
    id: 'p2',
    eventId: '2',
    userId: 'user2', 
    username: 'KartMaster',
    time: '1:34.123',
    submissionDate: new Date('2025-07-21T14:15:00'),
    documentationType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop&crop=center',
    verified: true
  },
  {
    id: 'p3',
    eventId: '2',
    userId: 'user3',
    username: 'RetroRacer',
    time: '1:29.789',
    submissionDate: new Date('2025-07-22T09:45:00'),
    documentationType: 'livestream',
    livestreamUrl: 'https://twitch.tv/retroracer',
    notes: 'Controller: Original N64 Controller, Setup: CRT TV',
    verified: false
  },
  {
    id: 'p4',
    eventId: '2',
    userId: 'user4',
    username: 'Luigi_Fan_2025',
    time: '1:35.678',
    submissionDate: new Date('2025-07-22T16:20:00'),
    documentationType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    notes: 'First time trying time trials!',
    verified: true
  }
]

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<GameEvent[]>(mockEvents)
  const [activeEvents, setActiveEvents] = useState<GameEvent[]>(mockEvents.filter(e => e.isActive))
  const [userParticipations, setUserParticipations] = useState<EventParticipation[]>(mockParticipations)
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

  const submitRaceTime = async (data: RaceSubmissionData): Promise<boolean> => {
    console.log('EventContext: submitRaceTime called with:', data)
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate upload time
      
      // Create or update participation entry
      const existingParticipationIndex = userParticipations.findIndex(p => 
        p.eventId === data.eventId && p.userId === '1' // Mock user ID
      )
      
      console.log('Existing participation index:', existingParticipationIndex)
      
      const newParticipation: EventParticipation = {
        id: existingParticipationIndex >= 0 ? userParticipations[existingParticipationIndex].id : Date.now().toString(),
        eventId: data.eventId,
        userId: '1', // Mock user ID
        username: 'RetroGamer64', // Mock username
        time: data.time,
        submissionDate: new Date(),
        documentationType: data.documentationType,
        mediaUrl: data.mediaFile ? URL.createObjectURL(data.mediaFile) : undefined,
        livestreamUrl: data.livestreamUrl,
        notes: data.notes,
        verified: false // Will be verified by admins
      }
      
      console.log('New participation:', newParticipation)
      
      if (existingParticipationIndex >= 0) {
        // Update existing participation
        setUserParticipations(prev => 
          prev.map((p, index) => index === existingParticipationIndex ? newParticipation : p)
        )
        console.log('Updated existing participation')
      } else {
        // Add new participation
        setUserParticipations(prev => [...prev, newParticipation])
        console.log('Added new participation')
      }
      
      setLoading(false)
      console.log('submitRaceTime: Success')
      return true
    } catch (err) {
      console.error('submitRaceTime error:', err)
      setError('Fehler beim Übermitteln der Rundenzeit')
      setLoading(false)
      return false
    }
  }

  const getLeaderboard = (eventId: string): EventParticipation[] => {
    return userParticipations.filter(p => p.eventId === eventId && p.time)
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
    submitRaceTime,
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
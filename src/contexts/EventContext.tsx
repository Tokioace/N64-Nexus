import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { GameEvent, EventParticipation, EventContextType, RaceSubmissionData } from '../types'
import { useLanguage } from './LanguageContext'

const EventContext = createContext<EventContextType | undefined>(undefined)

// Storage keys for localStorage persistence
const STORAGE_KEY_USER_PARTICIPATIONS = 'battle64_user_participations'
const STORAGE_KEY_ALL_SUBMISSIONS = 'battle64_all_event_submissions'
const STORAGE_KEY_EVENTS = 'battle64_events'

// Helper function to convert file to base64 for persistent storage
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

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
  const { t } = useLanguage()
  const [userParticipations, setUserParticipations] = useState<EventParticipation[]>([])
  const [allEventSubmissions, setAllEventSubmissions] = useState<EventParticipation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem(STORAGE_KEY_EVENTS)
    const savedUserParticipations = localStorage.getItem(STORAGE_KEY_USER_PARTICIPATIONS)
    const savedAllSubmissions = localStorage.getItem(STORAGE_KEY_ALL_SUBMISSIONS)
    
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents).map((e: any) => ({
          ...e,
          startDate: new Date(e.startDate),
          endDate: new Date(e.endDate)
        }))
        setEvents(parsedEvents)
        setActiveEvents(parsedEvents.filter((e: GameEvent) => e.isActive))
      } catch (error) {
        console.error('Error loading events from localStorage:', error)
        setEvents(mockEvents)
        setActiveEvents(mockEvents.filter(e => e.isActive))
      }
    }

    if (savedUserParticipations) {
      try {
        const parsedParticipations = JSON.parse(savedUserParticipations).map((p: any) => ({
          ...p,
          submissionDate: new Date(p.submissionDate)
        }))
        setUserParticipations(parsedParticipations)
      } catch (error) {
        console.error('Error loading user participations from localStorage:', error)
        setUserParticipations([])
      }
    }

    if (savedAllSubmissions) {
      try {
        const parsedSubmissions = JSON.parse(savedAllSubmissions).map((s: any) => ({
          ...s,
          submissionDate: new Date(s.submissionDate)
        }))
        setAllEventSubmissions(parsedSubmissions)
      } catch (error) {
        console.error('Error loading all submissions from localStorage:', error)
        setAllEventSubmissions(mockParticipations)
      }
    } else {
      // If no saved submissions, use mock data as initial data
      setAllEventSubmissions(mockParticipations)
    }
  }, [])

  // Save events to localStorage whenever events array changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events))
  }, [events])

  // Save user participations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER_PARTICIPATIONS, JSON.stringify(userParticipations))
  }, [userParticipations])

  // Save all submissions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ALL_SUBMISSIONS, JSON.stringify(allEventSubmissions))
  }, [allEventSubmissions])

  const getEvents = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  const joinEvent = async (eventId: string, currentUser?: { id: string; username: string }): Promise<boolean> => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Use current user or fallback to mock data
      const userId = currentUser?.id || '1'
      const username = currentUser?.username || 'RetroGamer64'
      
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
        userId: userId,
        username: username,
        submissionDate: new Date(),
        verified: false
      }
      
      setUserParticipations(prev => [...prev, newParticipation])
      setLoading(false)
      return true
    } catch (err) {
              setError(t('error.generic'))
      setLoading(false)
      return false
    }
  }

  const leaveEvent = async (eventId: string, currentUser?: { id: string; username: string }): Promise<boolean> => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Use current user or fallback to mock data
      const userId = currentUser?.id || '1'
      
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
      
      // Also remove from all submissions (for the current user)
      setAllEventSubmissions(prev => prev.filter(p => !(p.eventId === eventId && p.userId === userId)))
      
      setLoading(false)
      return true
    } catch (err) {
              setError(t('error.generic'))
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
              setError(t('error.generic'))
      setLoading(false)
      return false
    }
  }

  const submitRaceTime = async (data: RaceSubmissionData, currentUser?: { id: string; username: string }): Promise<boolean> => {
    console.log('EventContext: submitRaceTime called with:', data)
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate upload time
      
      // Use current user or fallback to mock data
      const userId = currentUser?.id || '1'
      const username = currentUser?.username || 'RetroGamer64'
      
      // Create or update participation entry
      const existingUserParticipation = userParticipations.find(p => 
        p.eventId === data.eventId && p.userId === userId
      )
      
      // Also check for existing submission in allEventSubmissions
      const existingAllSubmission = allEventSubmissions.find(p => 
        p.eventId === data.eventId && p.userId === userId
      )
      
      console.log('Existing user participation:', existingUserParticipation)
      console.log('Existing all submission:', existingAllSubmission)
      
      const participationId = existingUserParticipation?.id || existingAllSubmission?.id || Date.now().toString()
      
      // Handle media file storage
      let mediaUrl: string | undefined
      if (data.mediaFile) {
        // Convert file to base64 for persistent storage
        const base64 = await fileToBase64(data.mediaFile)
        mediaUrl = base64
      }
      
      const newParticipation: EventParticipation = {
        id: participationId,
        eventId: data.eventId,
        userId: userId,
        username: username,
        time: data.time,
        submissionDate: new Date(),
        documentationType: data.documentationType,
        mediaUrl: mediaUrl,
        livestreamUrl: data.livestreamUrl,
        notes: data.notes,
        verified: false // Will be verified by admins
      }
      
      console.log('New participation:', newParticipation)
      
      // Update or add to user participations
      if (existingUserParticipation) {
        setUserParticipations(prev => 
          prev.map(p => p.id === participationId ? newParticipation : p)
        )
        console.log('Updated existing user participation')
      } else {
        setUserParticipations(prev => [...prev, newParticipation])
        console.log('Added new user participation')
      }

      // Update or add to all submissions
      if (existingAllSubmission) {
        setAllEventSubmissions(prev => 
          prev.map(p => p.id === participationId ? newParticipation : p)
        )
        console.log('Updated existing all submission')
      } else {
        setAllEventSubmissions(prev => [...prev, newParticipation])
        console.log('Added new all submission')
      }
      
      setLoading(false)
      console.log('submitRaceTime: Success')
      return true
    } catch (err) {
      console.error('submitRaceTime error:', err)
              setError(t('error.generic'))
      setLoading(false)
      return false
    }
  }

  const getLeaderboard = (eventId: string): EventParticipation[] => {
    return allEventSubmissions.filter(p => p.eventId === eventId && p.time)
      .sort((a, b) => {
        // Sort by time (assuming time format like "1:32.456")
        const parseTime = (timeStr: string) => {
          const parts = timeStr.split(':')
          if (parts.length === 2) {
            return parseFloat(parts[0]) * 60 + parseFloat(parts[1])
          }
          return parseFloat(timeStr)
        }
        return parseTime(a.time!) - parseTime(b.time!)
      })
  }

  const getAllSubmissions = (): EventParticipation[] => {
    return allEventSubmissions
  }

  const getSubmissionsByUser = (userId: string): EventParticipation[] => {
    return allEventSubmissions.filter(p => p.userId === userId)
  }

  const value: EventContextType = {
    events,
    activeEvents,
    userParticipations,
    allEventSubmissions,
    loading,
    error,
    getEvents,
    joinEvent,
    leaveEvent,
    submitScore,
    submitRaceTime,
    getLeaderboard,
    getAllSubmissions,
    getSubmissionsByUser
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
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { GameEvent, EventParticipation, EventContextType, RaceSubmissionData } from '../types'
import { useLanguage } from './LanguageContext'
import { logger } from '../lib/logger'

const EventContext = createContext<EventContextType | undefined>(undefined)

// Storage keys for localStorage persistence
const STORAGE_KEY_USER_PARTICIPATIONS = 'battle64_user_participations'
const STORAGE_KEY_ALL_SUBMISSIONS = 'battle64_all_event_submissions'
const STORAGE_KEY_EVENTS = 'battle64_events'
const STORAGE_KEY_EVENT_POINTS_AWARDED = 'battle64_event_points_awarded'

// Helper function to convert file to base64 for persistent storage
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

// Function to get event data with translations
const getEventData = (t: (key: string) => string): GameEvent[] => [
  {
    id: 'mk64-luigis-raceway',
    title: t('events.mk64LuigisRaceway.title'),
    description: t('events.mk64LuigisRaceway.description'),
    game: 'Mario Kart 64',
    category: t('events.mk64LuigisRaceway.category'),
    startDate: new Date('2025-07-30'),
    endDate: new Date('2025-08-29'),
    isActive: true,
    participants: 0,
    maxParticipants: 200,
    rules: [
      t('events.mk64LuigisRaceway.rule1'),
      t('events.mk64LuigisRaceway.rule2'),
      t('events.mk64LuigisRaceway.rule3'),
      t('events.mk64LuigisRaceway.rule4'),
      t('events.mk64LuigisRaceway.rule5')
    ],
    prizes: [
      t('events.mk64LuigisRaceway.prize1'),
      t('events.mk64LuigisRaceway.prize2'),
      t('events.mk64LuigisRaceway.prize3'),
      t('events.mk64LuigisRaceway.prizeTop10'),
      t('events.mk64LuigisRaceway.prizeParticipation')
    ],
    region: 'BOTH',
    pointsSystem: {
      participation: 5,
      positions: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1] // F1-style points for top 10
    },
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    },
    bestLap: {
      time: '1:29.789',
      username: 'RetroRacer',
      mediaUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      mediaType: 'video',
      verified: true
    }
  },
  {
    id: 'sfr-downtown',
    title: t('events.sfrDowntown.title'),
    description: t('events.sfrDowntown.description'),
    game: 'San Francisco Rush: Extreme Racing',
    category: t('events.sfrDowntown.category'),
    startDate: new Date('2025-07-30'),
    endDate: new Date('2025-08-29'),
    isActive: true,
    participants: 0,
    maxParticipants: 200,
    rules: [
      t('events.sfrDowntown.rule1'),
      t('events.sfrDowntown.rule2'),
      t('events.sfrDowntown.rule3'),
      t('events.sfrDowntown.rule4'),
      t('events.sfrDowntown.rule5')
    ],
    prizes: [
      t('events.sfrDowntown.prize1'),
      t('events.sfrDowntown.prize2'),
      t('events.sfrDowntown.prize3'),
      t('events.sfrDowntown.prizeTop10'),
      t('events.sfrDowntown.prizeParticipation')
    ],
    region: 'BOTH',
    pointsSystem: {
      participation: 5,
      positions: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]
    },
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    },
    bestLap: {
      time: '2:08.234',
      username: 'SFRushFan',
      mediaUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop&crop=center',
      mediaType: 'photo',
      verified: true
    }
  },
  {
    id: 'dkr-ancient-lake',
    title: t('events.dkrAncientLake.title'),
    description: t('events.dkrAncientLake.description'),
    game: 'Diddy Kong Racing',
    category: t('events.dkrAncientLake.category'),
    startDate: new Date('2025-07-30'),
    endDate: new Date('2025-08-29'),
    isActive: true,
    participants: 0,
    maxParticipants: 200,
    rules: [
      t('events.dkrAncientLake.rule1'),
      t('events.dkrAncientLake.rule2'),
      t('events.dkrAncientLake.rule3'),
      t('events.dkrAncientLake.rule4'),
      t('events.dkrAncientLake.rule5')
    ],
    prizes: [
      t('events.dkrAncientLake.prize1'),
      t('events.dkrAncientLake.prize2'),
      t('events.dkrAncientLake.prize3'),
      t('events.dkrAncientLake.prizeTop10'),
      t('events.dkrAncientLake.prizeParticipation')
    ],
    region: 'BOTH',
    pointsSystem: {
      participation: 5,
      positions: [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]
    },
    interactions: {
      likes: 0,
      views: 0,
      comments: [],
      likedBy: [],
      viewedBy: []
    },
    bestLap: {
      time: '1:42.123',
      username: 'AncientLakeKing',
      livestreamUrl: 'https://twitch.tv/ancientlakeking',
      mediaType: 'livestream',
      verified: false
    }
  }
]

const mockParticipations: EventParticipation[] = [
  // Mario Kart 64 Luigi's Raceway
  {
    id: 'p1',
    eventId: 'mk64-luigis-raceway',
    userId: 'user1',
    username: 'SpeedDemon64',
    time: '1:32.456',
    submissionDate: new Date('2025-01-21T10:30:00'),
    documentationType: 'video',
    mediaUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    verified: true
  },
  {
    id: 'p2',
    eventId: 'mk64-luigis-raceway',
    userId: 'user2', 
    username: 'KartMaster',
    time: '1:34.123',
    submissionDate: new Date('2025-01-21T14:15:00'),
    documentationType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop&crop=center',
    verified: true
  },
  {
    id: 'p3',
    eventId: 'mk64-luigis-raceway',
    userId: 'user3',
    username: 'RetroRacer',
    time: '1:29.789',
    submissionDate: new Date('2025-01-22T09:45:00'),
    documentationType: 'livestream',
    livestreamUrl: 'https://twitch.tv/retroracer',
    notes: 'Controller: Original N64 Controller, Setup: CRT TV',
    verified: false
  },
  
  // San Francisco Rush Downtown
  {
    id: 'p4',
    eventId: 'sfr-downtown',
    userId: 'user4',
    username: 'RushExpert',
    time: '2:15.678',
    submissionDate: new Date('2025-01-22T16:20:00'),
    documentationType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    notes: 'First time on Downtown track!',
    verified: true
  },
  {
    id: 'p5',
    eventId: 'sfr-downtown',
    userId: 'user5',
    username: 'SFRushFan',
    time: '2:08.234',
    submissionDate: new Date('2025-01-23T11:30:00'),
    documentationType: 'photo',
    verified: true
  },
  
  // Diddy Kong Racing Ancient Lake
  {
    id: 'p6',
    eventId: 'dkr-ancient-lake',
    userId: 'user6',
    username: 'DiddyDriver',
    time: '1:45.567',
    submissionDate: new Date('2025-01-23T18:45:00'),
    documentationType: 'video',
    verified: true
  },
  {
    id: 'p7',
    eventId: 'dkr-ancient-lake',
    userId: 'user7',
    username: 'AncientLakeKing',
    time: '1:42.123',
    submissionDate: new Date('2025-01-24T08:20:00'),
    documentationType: 'livestream',
    livestreamUrl: 'https://twitch.tv/ancientlakeking',
    verified: false
  }
]

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useLanguage()
  const [events, setEvents] = useState<GameEvent[]>([])
  const [activeEvents, setActiveEvents] = useState<GameEvent[]>([])
  const [userParticipations, setUserParticipations] = useState<EventParticipation[]>([])
  const [allEventSubmissions, setAllEventSubmissions] = useState<EventParticipation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [eventPointsAwarded, setEventPointsAwarded] = useState<Record<string, boolean>>({})

  // Initialize events with translations
  useEffect(() => {
    const mockEvents = getEventData(t)
    setEvents(mockEvents)
    setActiveEvents(mockEvents.filter(e => e.isActive))
  }, [t])

  // Load points awarded tracking
  useEffect(() => {
    const savedPointsAwarded = localStorage.getItem(STORAGE_KEY_EVENT_POINTS_AWARDED)
    if (savedPointsAwarded) {
      try {
        setEventPointsAwarded(JSON.parse(savedPointsAwarded))
      } catch (error) {
        logger.error('Error loading event points awarded:', error)
      }
    }
  }, [])

  // Save points awarded tracking
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EVENT_POINTS_AWARDED, JSON.stringify(eventPointsAwarded))
  }, [eventPointsAwarded])

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
        logger.error('Error loading events from localStorage:', error)
        const fallbackEvents = getEventData(t)
        setEvents(fallbackEvents)
        setActiveEvents(fallbackEvents.filter(e => e.isActive))
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
        logger.error('Error loading user participations from localStorage:', error)
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
        logger.error('Error loading all submissions from localStorage:', error)
        setAllEventSubmissions(mockParticipations)
      }
    } else {
      // If no saved submissions, use mock data as initial data
      setAllEventSubmissions(mockParticipations)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Update events when language changes
  useEffect(() => {
    const translatedEvents = getEventData(t)
    setEvents(translatedEvents)
    setActiveEvents(translatedEvents.filter(e => e.isActive))
  }, [t])

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
    } catch {
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
    } catch {
              setError(t('error.generic'))
      setLoading(false)
      return false
    }
  }

  const submitScore = async (_eventId: string, _score: number, _time?: string, _mediaUrl?: string): Promise<boolean> => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setLoading(false)
      return true
    } catch {
              setError(t('error.generic'))
      setLoading(false)
      return false
    }
  }

  const submitRaceTime = async (data: RaceSubmissionData, currentUser?: { id: string; username: string }): Promise<boolean> => {
          logger.log('EventContext: submitRaceTime called with:', data)
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
      
              logger.log('Existing user participation:', existingUserParticipation)
        logger.log('Existing all submission:', existingAllSubmission)
      
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
      
              logger.log('New participation:', newParticipation)
      
      // Update or add to user participations
      if (existingUserParticipation) {
        setUserParticipations(prev => 
          prev.map(p => p.id === participationId ? newParticipation : p)
        )
                  logger.log('Updated existing user participation')
      } else {
        setUserParticipations(prev => [...prev, newParticipation])
                  logger.log('Added new user participation')
      }

      // Update or add to all submissions
      if (existingAllSubmission) {
        setAllEventSubmissions(prev => 
          prev.map(p => p.id === participationId ? newParticipation : p)
        )
                  logger.log('Updated existing all submission')
      } else {
        setAllEventSubmissions(prev => [...prev, newParticipation])
                  logger.log('Added new all submission')
      }
      
      setLoading(false)
              logger.log('submitRaceTime: Success')
      return true
    } catch (err) {
              logger.error('submitRaceTime error:', err)
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

  // Function to check if participation points should be awarded
  const shouldAwardParticipationPoints = (eventId: string, userId: string): boolean => {
    const key = `participation_${eventId}_${userId}`
    return !eventPointsAwarded[key]
  }

  // Function to mark participation points as awarded
  const markParticipationPointsAwarded = (eventId: string, userId: string) => {
    const key = `participation_${eventId}_${userId}`
    setEventPointsAwarded(prev => ({ ...prev, [key]: true }))
  }

  // Function to get event positions and points that should be awarded
  const getEventPositionPoints = (eventId: string): Array<{userId: string, position: number, points: number}> => {
    const leaderboard = getLeaderboard(eventId)
    const positionPoints = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1] // F1 style points
    
    return leaderboard.slice(0, 10).map((entry, index) => {
      const position = index + 1
      const key = `position_${eventId}_${entry.userId}_${position}`
      
      // Only return if points haven't been awarded yet
      if (!eventPointsAwarded[key]) {
        return {
          userId: entry.userId,
          position,
          points: positionPoints[index] || 0
        }
      }
      return null
    }).filter(Boolean) as Array<{userId: string, position: number, points: number}>
  }

  // Function to mark position points as awarded
  const markPositionPointsAwarded = (eventId: string, userId: string, position: number) => {
    const key = `position_${eventId}_${userId}_${position}`
    setEventPointsAwarded(prev => ({ ...prev, [key]: true }))
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
    getSubmissionsByUser,
    shouldAwardParticipationPoints,
    markParticipationPointsAwarded,
    getEventPositionPoints,
    markPositionPointsAwarded
  }

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useEvent = () => {
  const context = useContext(EventContext)
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider')
  }
  return context
}
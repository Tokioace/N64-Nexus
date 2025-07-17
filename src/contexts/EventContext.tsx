import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { GameEvent, EventParticipation, EventReward, EventContextType } from '../types'
import eventsData from '../data/events.json'

const EventContext = createContext<EventContextType | undefined>(undefined)

export const useEvents = () => {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider')
  }
  return context
}

interface EventProviderProps {
  children: ReactNode
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<GameEvent[]>([])
  const [participations, setParticipations] = useState<EventParticipation[]>([])

  useEffect(() => {
    // Load events from JSON
    const loadedEvents = eventsData.map(event => ({
      ...event,
      isActive: isEventActive(event as GameEvent),
      isCompleted: new Date(event.endDate) < new Date(),
      participants: Math.floor(Math.random() * (event.maxParticipants || 100)) // Mock participants
    })) as GameEvent[]
    setEvents(loadedEvents)

    // Load participations from localStorage
    const savedParticipations = localStorage.getItem('eventParticipations')
    if (savedParticipations) {
      setParticipations(JSON.parse(savedParticipations))
    }
  }, [])

  const isEventActive = (event: GameEvent): boolean => {
    const now = new Date()
    const start = new Date(event.startDate)
    const end = new Date(event.endDate)
    return now >= start && now <= end
  }

  const getTimeRemaining = (event: GameEvent) => {
    const now = new Date()
    const targetDate = isEventActive(event) ? new Date(event.endDate) : new Date(event.startDate)
    const diff = targetDate.getTime() - now.getTime()

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
  }

  const activeEvents = events.filter(event => isEventActive(event))
  const upcomingEvents = events.filter(event => new Date(event.startDate) > new Date())
  const completedEvents = events.filter(event => new Date(event.endDate) < new Date())

  const getEventById = (id: string): GameEvent | null => {
    return events.find(event => event.id === id) || null
  }

  const joinEvent = (eventId: string) => {
    const event = getEventById(eventId)
    if (!event || !isEventActive(event)) return

    const existingParticipation = participations.find(p => p.eventId === eventId)
    if (existingParticipation) return

    const newParticipation: EventParticipation = {
      eventId,
      userId: 'current-user', // This would come from UserContext
      joinedAt: new Date(),
      progress: 0,
      rewards: [],
      isCompleted: false
    }

    const updatedParticipations = [...participations, newParticipation]
    setParticipations(updatedParticipations)
    localStorage.setItem('eventParticipations', JSON.stringify(updatedParticipations))
  }

  const completeEvent = (eventId: string) => {
    const event = getEventById(eventId)
    if (!event) return

    const updatedParticipations = participations.map(p => 
      p.eventId === eventId 
        ? { ...p, isCompleted: true, completedAt: new Date(), progress: 100, rewards: event.rewards }
        : p
    )

    setParticipations(updatedParticipations)
    localStorage.setItem('eventParticipations', JSON.stringify(updatedParticipations))
  }

  const getEventProgress = (eventId: string): number => {
    const participation = participations.find(p => p.eventId === eventId)
    return participation?.progress || 0
  }

  const getEventRewards = (eventId: string): EventReward[] => {
    const event = getEventById(eventId)
    if (!event) return []

    return event.rewards.map((reward, index) => ({
      id: `${eventId}-reward-${index}`,
      name: reward,
      type: reward.includes('XP') ? 'XP' : reward.includes('Badge') ? 'Badge' : 'Token',
      value: reward.includes('XP') ? parseInt(reward.replace('XP', '')) : reward,
      icon: getRewardIcon(reward),
      description: `Belohnung für die Teilnahme an ${event.title}`,
      rarity: getRarity(reward)
    }))
  }

  const getRewardIcon = (reward: string): string => {
    if (reward.includes('XP')) return '⭐'
    if (reward.includes('Badge')) return '🏆'
    if (reward.includes('Token')) return '🪙'
    if (reward.includes('Golden')) return '🥇'
    if (reward.includes('Crown')) return '👑'
    if (reward.includes('Shield')) return '🛡️'
    return '🎁'
  }

  const getRarity = (reward: string): 'common' | 'rare' | 'epic' | 'legendary' => {
    if (reward.includes('Golden') || reward.includes('Master')) return 'legendary'
    if (reward.includes('Badge') || reward.includes('Crown')) return 'epic'
    if (reward.includes('Token') || reward.includes('Shield')) return 'rare'
    return 'common'
  }

  const contextValue: EventContextType = {
    events,
    activeEvents,
    upcomingEvents,
    completedEvents,
    participations,
    getEventById,
    joinEvent,
    completeEvent,
    getEventProgress,
    getEventRewards,
    isEventActive,
    getTimeRemaining
  }

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  )
}
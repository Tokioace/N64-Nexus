import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { GameEvent, EventParticipation, EventReward, EventContextType, EventTeam, TeamResult, EventStatistics } from '../types'
import { useUser } from './UserContext'
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
  const [teams, setTeams] = useState<EventTeam[]>([])
  const [teamResults, setTeamResults] = useState<TeamResult[]>([])
  const { user } = useUser()

  useEffect(() => {
    // Load events from JSON with enhanced statistics
    const loadedEvents = eventsData.map(event => {
      const participants = Math.floor(Math.random() * (event.maxParticipants || 100))
      const mediaSubmissions = Math.floor(participants * 0.3) // 30% submit media
      const totalSubmissions = Math.floor(participants * 0.8) // 80% submit results
      
      return {
        ...event,
        isActive: isEventActive(event as GameEvent),
        isCompleted: new Date(event.endDate) < new Date(),
        participants,
        eventType: event.type === 'Team' ? 'team' : 'individual',
        statistics: {
          totalParticipants: participants,
          averageTime: event.type === 'Speedrun' || event.type === 'Time Trial' ? 
            Math.floor(Math.random() * 300) + 120 : undefined, // 2-7 minutes
          mediaSubmissions,
          totalSubmissions
        } as EventStatistics
      }
    }) as GameEvent[]
    setEvents(loadedEvents)

    // Load participations from localStorage
    const savedParticipations = localStorage.getItem('eventParticipations')
    if (savedParticipations) {
      const parsed = JSON.parse(savedParticipations)
      setParticipations(parsed.map((p: any) => ({
        ...p,
        joinedAt: new Date(p.joinedAt),
        completedAt: p.completedAt ? new Date(p.completedAt) : undefined
      })))
    }

    // Load teams from localStorage
    const savedTeams = localStorage.getItem('eventTeams')
    if (savedTeams) {
      const parsed = JSON.parse(savedTeams)
      setTeams(parsed.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt)
      })))
    }

    // Load team results from localStorage
    const savedTeamResults = localStorage.getItem('teamResults')
    if (savedTeamResults) {
      const parsed = JSON.parse(savedTeamResults)
      setTeamResults(parsed.map((tr: any) => ({
        ...tr,
        completedAt: new Date(tr.completedAt)
      })))
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
    if (!event || !isEventActive(event) || !user) return

    const existingParticipation = participations.find(p => p.eventId === eventId && p.userId === user.id)
    if (existingParticipation) return

    const newParticipation: EventParticipation = {
      eventId,
      userId: user.id,
      joinedAt: new Date(),
      progress: 0,
      rewards: [],
      isCompleted: false
    }

    const updatedParticipations = [...participations, newParticipation]
    setParticipations(updatedParticipations)
    localStorage.setItem('eventParticipations', JSON.stringify(updatedParticipations))
  }

  const completeEvent = (eventId: string, score?: number, time?: number) => {
    const event = getEventById(eventId)
    if (!event || !user) return

    const updatedParticipations = participations.map(p => 
      p.eventId === eventId && p.userId === user.id
        ? { 
            ...p, 
            isCompleted: true, 
            completedAt: new Date(), 
            progress: 100, 
            rewards: event.rewards,
            score,
            time
          }
        : p
    )

    setParticipations(updatedParticipations)
    localStorage.setItem('eventParticipations', JSON.stringify(updatedParticipations))
    
    // Auto-assign medals after completion
    setTimeout(() => assignMedals(eventId), 100)
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

  // Team Management Functions
  const createTeam = (eventId: string, teamName: string) => {
    if (!user) return

    const newTeam: EventTeam = {
      id: `team-${Date.now()}`,
      name: teamName,
      memberIds: [user.id],
      members: [user.username],
      createdBy: user.id,
      eventId,
      createdAt: new Date()
    }

    const updatedTeams = [...teams, newTeam]
    setTeams(updatedTeams)
    localStorage.setItem('eventTeams', JSON.stringify(updatedTeams))
  }

  const joinTeam = (teamId: string) => {
    if (!user) return

    const updatedTeams = teams.map(team => {
      if (team.id === teamId && team.memberIds.length < 4 && !team.memberIds.includes(user.id)) {
        return {
          ...team,
          memberIds: [...team.memberIds, user.id],
          members: [...team.members, user.username]
        }
      }
      return team
    })

    setTeams(updatedTeams)
    localStorage.setItem('eventTeams', JSON.stringify(updatedTeams))
  }

  const leaveTeam = (teamId: string) => {
    if (!user) return

    const updatedTeams = teams.map(team => {
      if (team.id === teamId && team.memberIds.includes(user.id)) {
        return {
          ...team,
          memberIds: team.memberIds.filter(id => id !== user.id),
          members: team.members.filter(member => member !== user.username)
        }
      }
      return team
    }).filter(team => team.memberIds.length > 0) // Remove empty teams

    setTeams(updatedTeams)
    localStorage.setItem('eventTeams', JSON.stringify(updatedTeams))
  }

  const getTeamsByEvent = (eventId: string): EventTeam[] => {
    return teams.filter(team => team.eventId === eventId)
  }

  const getUserTeamForEvent = (eventId: string): EventTeam | null => {
    if (!user) return null
    return teams.find(team => team.eventId === eventId && team.memberIds.includes(user.id)) || null
  }

  // Medal Assignment Function
  const assignMedals = (eventId: string) => {
    const eventParticipations = participations
      .filter(p => p.eventId === eventId && p.isCompleted)
      .sort((a, b) => {
        // Sort by score (higher is better) or time (lower is better)
        if (a.score !== undefined && b.score !== undefined) {
          return b.score - a.score
        }
        if (a.time !== undefined && b.time !== undefined) {
          return a.time - b.time
        }
        // Fallback to completion date
        return (a.completedAt?.getTime() || 0) - (b.completedAt?.getTime() || 0)
      })

    const updatedParticipations = participations.map(p => {
      if (p.eventId === eventId && p.isCompleted) {
        const position = eventParticipations.findIndex(ep => ep.userId === p.userId) + 1
        let medal: 'gold' | 'silver' | 'bronze' | 'top10' | 'participant'
        
        if (position === 1) medal = 'gold'
        else if (position === 2) medal = 'silver'
        else if (position === 3) medal = 'bronze'
        else if (position <= 10) medal = 'top10'
        else medal = 'participant'

        return { ...p, medal, position }
      }
      return p
    })

    setParticipations(updatedParticipations)
    localStorage.setItem('eventParticipations', JSON.stringify(updatedParticipations))
  }

  // Statistics Function
  const getEventStatistics = (eventId: string): EventStatistics => {
    const event = getEventById(eventId)
    return event?.statistics || {
      totalParticipants: 0,
      mediaSubmissions: 0,
      totalSubmissions: 0
    }
  }

  // Reminder Functions
  const setEventReminder = (eventId: string, enabled: boolean) => {
    const reminders = getEventReminders()
    const updatedReminders = enabled 
      ? [...reminders.filter(id => id !== eventId), eventId]
      : reminders.filter(id => id !== eventId)
    
    localStorage.setItem('eventReminders', JSON.stringify(updatedReminders))
  }

  const getEventReminders = (): string[] => {
    const saved = localStorage.getItem('eventReminders')
    return saved ? JSON.parse(saved) : []
  }

  const checkEventReminders = (): { eventId: string; title: string }[] => {
    const reminders = getEventReminders()
    const now = new Date()
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    return reminders
      .map(eventId => {
        const event = getEventById(eventId)
        if (!event) return null
        
        const endDate = new Date(event.endDate)
        if (endDate <= twentyFourHoursFromNow && endDate > now) {
          return { eventId, title: event.title }
        }
        return null
      })
      .filter(Boolean) as { eventId: string; title: string }[]
  }

  const contextValue: EventContextType = {
    events,
    activeEvents,
    upcomingEvents,
    completedEvents,
    participations,
    teams,
    teamResults,
    getEventById,
    joinEvent,
    completeEvent,
    getEventProgress,
    getEventRewards,
    isEventActive,
    getTimeRemaining,
    createTeam,
    joinTeam,
    leaveTeam,
    getTeamsByEvent,
    getUserTeamForEvent,
    assignMedals,
    getEventStatistics,
    setEventReminder,
    getEventReminders,
    checkEventReminders
  }

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  )
}
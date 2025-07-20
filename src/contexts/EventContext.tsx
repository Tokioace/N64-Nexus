import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { GameEvent, EventParticipation, EventReward, EventContextType, Team, TeamMember, EventMedal, LiveLeaderboardEntry } from '../types'
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
  const [teams, setTeams] = useState<Team[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [eventMedals, setEventMedals] = useState<EventMedal[]>([])

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

  // Team-related functions
  const createTeam = async (name: string, description?: string): Promise<Team> => {
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name,
      description,
      createdBy: 'current-user', // Would come from UserContext
      createdAt: new Date(),
      maxMembers: 4,
      logoUrl: undefined
    }

    setTeams(prev => [...prev, newTeam])

    // Add creator as team leader
    const teamLeader: TeamMember = {
      teamId: newTeam.id,
      userId: 'current-user',
      username: 'Current User', // Would come from UserContext
      joinedAt: new Date(),
      isLeader: true
    }

    setTeamMembers(prev => [...prev, teamLeader])
    
    return newTeam
  }

  const joinTeam = async (teamId: string): Promise<void> => {
    const team = teams.find(t => t.id === teamId)
    if (!team) throw new Error('Team not found')

    const currentMembers = teamMembers.filter(m => m.teamId === teamId)
    if (currentMembers.length >= team.maxMembers) {
      throw new Error('Team is full')
    }

    const newMember: TeamMember = {
      teamId,
      userId: 'current-user',
      username: 'Current User',
      joinedAt: new Date(),
      isLeader: false
    }

    setTeamMembers(prev => [...prev, newMember])
  }

  const leaveTeam = async (teamId: string): Promise<void> => {
    setTeamMembers(prev => prev.filter(m => !(m.teamId === teamId && m.userId === 'current-user')))
  }

  const getEventTeams = (eventId: string): Team[] => {
    // Mock implementation - in real app would filter by event
    return teams
  }

  const getTeamMembers = (teamId: string): TeamMember[] => {
    return teamMembers.filter(m => m.teamId === teamId)
  }

  // Live leaderboard function
  const getLiveLeaderboard = (eventId: string): LiveLeaderboardEntry[] => {
    // Mock implementation - in real app would fetch from API
    const mockEntries: LiveLeaderboardEntry[] = [
      {
        rank: 1,
        user: { id: '1', username: 'SpeedMaster64', points: 1500, level: 5, totalQuizzes: 50, correctAnswers: 400, totalAnswers: 500, achievements: [], quizProgress: { totalQuestions: 500, correctAnswers: 400, categories: {} as any, achievements: [] } },
        score: 0,
        quizCount: 50,
        averageScore: 85,
        gameTime: '1:32.45',
        isLive: true,
        lastUpdate: new Date(),
        isVerified: true,
        submittedAt: new Date(Date.now() - 3600000),
        teamId: 'team-1',
        teamName: 'Speed Demons'
      },
      {
        rank: 2,
        user: { id: '2', username: 'RetroRunner', points: 1200, level: 4, totalQuizzes: 40, correctAnswers: 320, totalAnswers: 400, achievements: [], quizProgress: { totalQuestions: 400, correctAnswers: 320, categories: {} as any, achievements: [] } },
        score: 0,
        quizCount: 40,
        averageScore: 80,
        gameTime: '1:35.12',
        isLive: false,
        lastUpdate: new Date(),
        isVerified: true,
        submittedAt: new Date(Date.now() - 7200000)
      },
      {
        rank: 3,
        user: { id: '3', username: 'N64Legend', points: 1000, level: 3, totalQuizzes: 30, correctAnswers: 240, totalAnswers: 300, achievements: [], quizProgress: { totalQuestions: 300, correctAnswers: 240, categories: {} as any, achievements: [] } },
        score: 0,
        quizCount: 30,
        averageScore: 75,
        gameTime: '1:38.76',
        isLive: false,
        lastUpdate: new Date(),
        isVerified: false,
        submittedAt: new Date(Date.now() - 10800000)
      }
    ]

    return mockEntries
  }

  // Medal functions
  const getUserMedals = (userId: string): EventMedal[] => {
    return eventMedals.filter(medal => medal.userId === userId)
  }

  const awardMedal = (eventId: string, userId: string, type: 'gold' | 'silver' | 'bronze', rank?: number) => {
    const event = getEventById(eventId)
    if (!event) return

    const medal: EventMedal = {
      id: `medal-${Date.now()}`,
      eventId,
      userId,
      type,
      awardedAt: new Date(),
      eventTitle: event.title,
      eventDate: event.startDate,
      rank,
      condition: rank ? `Platz ${rank}` : type === 'gold' ? '1. Platz' : type === 'silver' ? 'Top 10%' : 'Teilnahme'
    }

    setEventMedals(prev => [...prev, medal])
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
    getTimeRemaining,
    // Team-related methods
    createTeam,
    joinTeam,
    leaveTeam,
    getEventTeams,
    getTeamMembers,
    // Leaderboard methods
    getLiveLeaderboard,
    // Medal methods
    getUserMedals,
    awardMedal
  }

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  )
}
import { N64RacingGame, N64RacingTrack } from './n64RacingGames'

export interface WeeklySpeedrunEvent {
  id: string
  week: number
  year: number
  startDate: string
  endDate: string
  events: [
    {
      id: string
      title: string
      gameId: 'mario-kart-64'
      trackId: string
      category: string
      description: string
      prizePool: number
      participants: number
      maxParticipants: number
      currentLeader?: {
        player: string
        time: string
        video?: string
      }
    },
    {
      id: string
      title: string
      gameId: string
      trackId: string
      category: string
      description: string
      prizePool: number
      participants: number
      maxParticipants: number
      currentLeader?: {
        player: string
        time: string
        video?: string
      }
    },
    {
      id: string
      title: string
      gameId: string
      trackId: string
      category: string
      description: string
      prizePool: number
      participants: number
      maxParticipants: number
      currentLeader?: {
        player: string
        time: string
        video?: string
      }
    }
  ]
  totalPrizePool: number
  totalParticipants: number
  status: 'upcoming' | 'active' | 'completed'
}

export const getCurrentWeeklyEvents = (): WeeklySpeedrunEvent => {
  const currentDate = new Date()
  const currentWeek = getWeekNumber(currentDate)
  const currentYear = currentDate.getFullYear()
  
  return {
    id: `week-${currentWeek}-${currentYear}`,
    week: currentWeek,
    year: currentYear,
    startDate: getWeekStartDate(currentWeek, currentYear).toISOString(),
    endDate: getWeekEndDate(currentWeek, currentYear).toISOString(),
    status: 'active',
    totalPrizePool: 1500,
    totalParticipants: 847,
    events: [
      {
        id: `mk64-week-${currentWeek}`,
        title: 'Mario Kart 64 Weekly Championship',
        gameId: 'mario-kart-64',
        trackId: 'rainbow-road',
        category: 'Time Trial',
        description: 'Wöchentliche Mario Kart 64 Herausforderung auf der legendären Rainbow Road! Zeige deine Drifting-Skills und sichere dir den ersten Platz.',
        prizePool: 750,
        participants: 423,
        maxParticipants: 500,
        currentLeader: {
          player: 'RainbowMaster64',
          time: '5:52.173',
          video: 'https://www.youtube.com/watch?v=example1'
        }
      },
      {
        id: `sfr-week-${currentWeek}`,
        title: 'San Francisco Rush: Golden Gate Challenge',
        gameId: 'san-francisco-rush',
        trackId: 'golden-gate',
        category: 'Circuit Race',
        description: 'Fahre durch die ikonische Golden Gate Bridge in San Francisco Rush! Nutze alle Shortcuts und Stunts für die beste Zeit.',
        prizePool: 400,
        participants: 187,
        maxParticipants: 300,
        currentLeader: {
          player: 'SFRushKing',
          time: '3:58.947',
          video: 'https://www.youtube.com/watch?v=example2'
        }
      },
      {
        id: `swr-week-${currentWeek}`,
        title: 'Star Wars Racer: Boonta Eve Speedrun',
        gameId: 'star-wars-episode-i-racer',
        trackId: 'boonta-eve-classic',
        category: 'Single Lap',
        description: 'Das berühmte Podracing auf Tatooine! Wähle deinen Lieblings-Podracer und dominiere die Boonta Eve Classic Strecke.',
        prizePool: 350,
        participants: 237,
        maxParticipants: 400,
        currentLeader: {
          player: 'PodracingLegend',
          time: '1:15.923',
          video: 'https://www.youtube.com/watch?v=example3'
        }
      }
    ]
  }
}

export const getUpcomingWeeklyEvents = (): WeeklySpeedrunEvent => {
  const nextWeekDate = new Date()
  nextWeekDate.setDate(nextWeekDate.getDate() + 7)
  const nextWeek = getWeekNumber(nextWeekDate)
  const nextYear = nextWeekDate.getFullYear()
  
  return {
    id: `week-${nextWeek}-${nextYear}`,
    week: nextWeek,
    year: nextYear,
    startDate: getWeekStartDate(nextWeek, nextYear).toISOString(),
    endDate: getWeekEndDate(nextWeek, nextYear).toISOString(),
    status: 'upcoming',
    totalPrizePool: 1500,
    totalParticipants: 0,
    events: [
      {
        id: `mk64-week-${nextWeek}`,
        title: 'Mario Kart 64 Weekly Championship',
        gameId: 'mario-kart-64',
        trackId: 'wario-stadium',
        category: 'Time Trial',
        description: 'Nächste Woche: Wario Stadium Herausforderung! Eine der schwierigsten Strecken in Mario Kart 64 wartet auf dich.',
        prizePool: 750,
        participants: 0,
        maxParticipants: 500
      },
      {
        id: `sfr-week-${nextWeek}`,
        title: 'San Francisco Rush: Alcatraz Escape',
        gameId: 'san-francisco-rush',
        trackId: 'alcatraz',
        category: 'Circuit Race',
        description: 'Nächste Woche: Entkomme von Alcatraz! Die anspruchsvollste Strecke in San Francisco Rush erwartet dich.',
        prizePool: 400,
        participants: 0,
        maxParticipants: 300
      },
      {
        id: `swr-week-${nextWeek}`,
        title: 'Star Wars Racer: Malastare Mayhem',
        gameId: 'star-wars-episode-i-racer',
        trackId: 'malastare-100',
        category: 'Championship',
        description: 'Nächste Woche: Malastare 100 - das ultimative Podracing-Event! Nur die besten Piloten überleben diese Strecke.',
        prizePool: 350,
        participants: 0,
        maxParticipants: 400
      }
    ]
  }
}

export const getPreviousWeeklyEvents = (): WeeklySpeedrunEvent => {
  const lastWeekDate = new Date()
  lastWeekDate.setDate(lastWeekDate.getDate() - 7)
  const lastWeek = getWeekNumber(lastWeekDate)
  const lastYear = lastWeekDate.getFullYear()
  
  return {
    id: `week-${lastWeek}-${lastYear}`,
    week: lastWeek,
    year: lastYear,
    startDate: getWeekStartDate(lastWeek, lastYear).toISOString(),
    endDate: getWeekEndDate(lastWeek, lastYear).toISOString(),
    status: 'completed',
    totalPrizePool: 1500,
    totalParticipants: 1234,
    events: [
      {
        id: `mk64-week-${lastWeek}`,
        title: 'Mario Kart 64 Weekly Championship',
        gameId: 'mario-kart-64',
        trackId: 'bowsers-castle',
        category: 'Time Trial',
        description: 'Letzte Woche: Bowsers Castle Herausforderung - Abgeschlossen!',
        prizePool: 750,
        participants: 678,
        maxParticipants: 500,
        currentLeader: {
          player: 'BowserSlayer',
          time: '2:59.842',
          video: 'https://www.youtube.com/watch?v=example4'
        }
      },
      {
        id: `sfr-week-${lastWeek}`,
        title: 'San Francisco Rush: Financial District Sprint',
        gameId: 'san-francisco-rush',
        trackId: 'financial-district',
        category: 'Circuit Race',
        description: 'Letzte Woche: Financial District Sprint - Abgeschlossen!',
        prizePool: 400,
        participants: 289,
        maxParticipants: 300,
        currentLeader: {
          player: 'WallStreetRacer',
          time: '2:41.892',
          video: 'https://www.youtube.com/watch?v=example5'
        }
      },
      {
        id: `swr-week-${lastWeek}`,
        title: 'Star Wars Racer: Aquilaris Ocean Cup',
        gameId: 'star-wars-episode-i-racer',
        trackId: 'aquilaris-classic',
        category: 'Time Trial',
        description: 'Letzte Woche: Aquilaris Classic - Abgeschlossen!',
        prizePool: 350,
        participants: 267,
        maxParticipants: 400,
        currentLeader: {
          player: 'AquaticAce',
          time: '3:25.891',
          video: 'https://www.youtube.com/watch?v=example6'
        }
      }
    ]
  }
}

// Utility functions
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

function getWeekStartDate(week: number, year: number): Date {
  const firstDayOfYear = new Date(year, 0, 1)
  const daysToAdd = (week - 1) * 7 - firstDayOfYear.getDay()
  const weekStart = new Date(firstDayOfYear.getTime() + daysToAdd * 86400000)
  return weekStart
}

function getWeekEndDate(week: number, year: number): Date {
  const weekStart = getWeekStartDate(week, year)
  const weekEnd = new Date(weekStart.getTime() + 6 * 86400000)
  weekEnd.setHours(23, 59, 59, 999)
  return weekEnd
}

export const getAllWeeklyEvents = () => [
  getPreviousWeeklyEvents(),
  getCurrentWeeklyEvents(),
  getUpcomingWeeklyEvents()
]

export const getEventById = (eventId: string) => {
  const allEvents = getAllWeeklyEvents()
  for (const weeklyEvent of allEvents) {
    const event = weeklyEvent.events.find(e => e.id === eventId)
    if (event) return event
  }
  return null
}

export const getLeaderboard = (eventId: string) => {
  // Mock leaderboard data - in a real app this would come from a database
  return [
    { rank: 1, player: 'SpeedDemon64', time: '1:52.345', points: 1000 },
    { rank: 2, player: 'RacingLegend', time: '1:53.678', points: 800 },
    { rank: 3, player: 'N64Master', time: '1:54.234', points: 600 },
    { rank: 4, player: 'KartKing', time: '1:55.567', points: 400 },
    { rank: 5, player: 'RetroRacer', time: '1:56.890', points: 200 }
  ]
}

export const getWeeklyStats = () => ({
  totalEvents: 156,
  totalParticipants: getTotalActiveSpeedrunners(),
  totalPrizesMoney: 234750,
  averageParticipantsPerEvent: 847,
  mostPopularGame: 'Mario Kart 64',
  mostPopularTrack: 'Rainbow Road',
  fastestOverallTime: '1:30.162',
  fastestPlayer: 'Dan'
})

// Helper function to get total active speedrunners (imported from n64RacingGames)
function getTotalActiveSpeedrunners(): number {
  return 7260 // Total from all racing games
}
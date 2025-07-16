import { GameEvent } from '../types'

export const eventUtils = {
  /**
   * Überprüft ob ein Event aktuell aktiv ist
   */
  isEventActive: (event: GameEvent): boolean => {
    const now = new Date()
    const start = new Date(event.startDate)
    const end = new Date(event.endDate)
    return now >= start && now <= end
  },

  /**
   * Überprüft ob ein Event bereits beendet ist
   */
  isEventCompleted: (event: GameEvent): boolean => {
    const now = new Date()
    const end = new Date(event.endDate)
    return now > end
  },

  /**
   * Überprüft ob ein Event noch nicht gestartet ist
   */
  isEventUpcoming: (event: GameEvent): boolean => {
    const now = new Date()
    const start = new Date(event.startDate)
    return now < start
  },

  /**
   * Berechnet die verbleibende Zeit bis zum Event-Start oder -Ende
   */
  getTimeRemaining: (event: GameEvent): { days: number; hours: number; minutes: number; seconds: number } => {
    const now = new Date()
    const targetDate = eventUtils.isEventActive(event) ? new Date(event.endDate) : new Date(event.startDate)
    const diff = targetDate.getTime() - now.getTime()

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
  },

  /**
   * Formatiert die verbleibende Zeit in einen lesbaren String
   */
  formatTimeRemaining: (event: GameEvent): string => {
    const { days, hours, minutes, seconds } = eventUtils.getTimeRemaining(event)
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`
    } else {
      return `${minutes}m ${seconds}s`
    }
  },

  /**
   * Sortiert Events nach Priorität (aktive zuerst, dann kommende, dann beendete)
   */
  sortEventsByPriority: (events: GameEvent[]): GameEvent[] => {
    return events.sort((a, b) => {
      const aActive = eventUtils.isEventActive(a)
      const bActive = eventUtils.isEventActive(b)
      const aUpcoming = eventUtils.isEventUpcoming(a)
      const bUpcoming = eventUtils.isEventUpcoming(b)

      // Aktive Events zuerst
      if (aActive && !bActive) return -1
      if (!aActive && bActive) return 1

      // Dann kommende Events
      if (aUpcoming && !bUpcoming && !bActive) return -1
      if (!aUpcoming && bUpcoming && !aActive) return 1

      // Innerhalb der gleichen Kategorie nach Startdatum sortieren
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    })
  },

  /**
   * Filtert Events nach Typ
   */
  filterEventsByType: (events: GameEvent[], type: string): GameEvent[] => {
    if (type === 'all') return events
    return events.filter(event => event.type === type)
  },

  /**
   * Filtert Events nach Schwierigkeit
   */
  filterEventsByDifficulty: (events: GameEvent[], difficulty: string): GameEvent[] => {
    if (difficulty === 'all') return events
    return events.filter(event => event.difficulty === difficulty)
  },

  /**
   * Sucht Events nach Suchbegriff
   */
  searchEvents: (events: GameEvent[], searchTerm: string): GameEvent[] => {
    if (!searchTerm.trim()) return events
    
    const term = searchTerm.toLowerCase()
    return events.filter(event =>
      event.title.toLowerCase().includes(term) ||
      event.game.toLowerCase().includes(term) ||
      event.description.toLowerCase().includes(term) ||
      event.type.toLowerCase().includes(term) ||
      event.category?.toLowerCase().includes(term)
    )
  },

  /**
   * Berechnet Event-Statistiken
   */
  getEventStats: (events: GameEvent[]) => {
    const now = new Date()
    const active = events.filter(eventUtils.isEventActive)
    const upcoming = events.filter(eventUtils.isEventUpcoming)
    const completed = events.filter(eventUtils.isEventCompleted)

    const totalParticipants = events.reduce((sum, event) => sum + (event.participants || 0), 0)
    const averageParticipants = events.length > 0 ? Math.round(totalParticipants / events.length) : 0

    const typeStats = events.reduce((stats, event) => {
      stats[event.type] = (stats[event.type] || 0) + 1
      return stats
    }, {} as Record<string, number>)

    return {
      total: events.length,
      active: active.length,
      upcoming: upcoming.length,
      completed: completed.length,
      totalParticipants,
      averageParticipants,
      typeStats
    }
  },

  /**
   * Generiert Event-Benachrichtigungen
   */
  getEventNotifications: (events: GameEvent[]): Array<{
    type: 'starting' | 'ending' | 'new'
    event: GameEvent
    message: string
  }> => {
    const notifications: Array<{
      type: 'starting' | 'ending' | 'new'
      event: GameEvent
      message: string
    }> = []

    events.forEach(event => {
      const timeRemaining = eventUtils.getTimeRemaining(event)
      const totalMinutes = timeRemaining.days * 24 * 60 + timeRemaining.hours * 60 + timeRemaining.minutes

      if (eventUtils.isEventActive(event)) {
        // Event endet bald
        if (totalMinutes <= 60) {
          notifications.push({
            type: 'ending',
            event,
            message: `Event "${event.title}" endet in ${eventUtils.formatTimeRemaining(event)}!`
          })
        }
      } else if (eventUtils.isEventUpcoming(event)) {
        // Event startet bald
        if (totalMinutes <= 60) {
          notifications.push({
            type: 'starting',
            event,
            message: `Event "${event.title}" startet in ${eventUtils.formatTimeRemaining(event)}!`
          })
        }
      }
    })

    return notifications
  },

  /**
   * Validiert Event-Daten
   */
  validateEvent: (event: Partial<GameEvent>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!event.title?.trim()) {
      errors.push('Event-Titel ist erforderlich')
    }

    if (!event.game?.trim()) {
      errors.push('Spiel ist erforderlich')
    }

    if (!event.startDate) {
      errors.push('Startdatum ist erforderlich')
    }

    if (!event.endDate) {
      errors.push('Enddatum ist erforderlich')
    }

    if (event.startDate && event.endDate) {
      const start = new Date(event.startDate)
      const end = new Date(event.endDate)
      
      if (start >= end) {
        errors.push('Startdatum muss vor dem Enddatum liegen')
      }
    }

    if (!event.description?.trim()) {
      errors.push('Beschreibung ist erforderlich')
    }

    if (!event.rewards || event.rewards.length === 0) {
      errors.push('Mindestens eine Belohnung ist erforderlich')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}
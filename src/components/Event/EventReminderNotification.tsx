import React, { useState, useEffect } from 'react'
import { useEvents } from '../../contexts/EventContext'
import { Bell, X, Clock, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const EventReminderNotification: React.FC = () => {
  const { checkEventReminders, getEventById } = useEvents()
  const [reminders, setReminders] = useState<{ eventId: string; title: string }[]>([])
  const [dismissed, setDismissed] = useState<string[]>([])

  useEffect(() => {
    const checkReminders = () => {
      const activeReminders = checkEventReminders()
      setReminders(activeReminders)
    }

    // Check immediately and then every minute
    checkReminders()
    const interval = setInterval(checkReminders, 60000)

    return () => clearInterval(interval)
  }, [checkEventReminders])

  const dismissReminder = (eventId: string) => {
    setDismissed(prev => [...prev, eventId])
  }

  const visibleReminders = reminders.filter(reminder => !dismissed.includes(reminder.eventId))

  if (visibleReminders.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {visibleReminders.map((reminder) => {
        const event = getEventById(reminder.eventId)
        if (!event) return null

        const endDate = new Date(event.endDate)
        const now = new Date()
        const hoursLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60))

        return (
          <div
            key={reminder.eventId}
            className="bg-blue-600 text-white p-4 rounded-lg shadow-lg border border-blue-500 max-w-sm animate-slide-in-right"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-blue-200" />
                <span className="font-medium">Event-Erinnerung</span>
              </div>
              <button
                onClick={() => dismissReminder(reminder.eventId)}
                className="text-blue-200 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="font-semibold">{reminder.title}</div>
              <div className="flex items-center space-x-1 text-blue-100 text-sm">
                <Clock className="w-3 h-3" />
                <span>Endet in {hoursLeft}h</span>
              </div>
              
              <Link
                to="/events"
                className="inline-flex items-center space-x-1 text-blue-100 hover:text-white transition-colors text-sm"
                onClick={() => dismissReminder(reminder.eventId)}
              >
                <ExternalLink className="w-3 h-3" />
                <span>Zu den Events</span>
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default EventReminderNotification
import React, { useState, useEffect } from 'react'
import { useEvents } from '../../contexts/EventContext'
import { Bell, BellOff } from 'lucide-react'

interface EventReminderProps {
  eventId: string
  compact?: boolean
}

const EventReminder: React.FC<EventReminderProps> = ({ 
  eventId, 
  compact = false 
}) => {
  const { setEventReminder, getEventReminders } = useEvents()
  const [isReminderSet, setIsReminderSet] = useState(false)

  useEffect(() => {
    const reminders = getEventReminders()
    setIsReminderSet(reminders.includes(eventId))
  }, [eventId, getEventReminders])

  const toggleReminder = () => {
    const newState = !isReminderSet
    setEventReminder(eventId, newState)
    setIsReminderSet(newState)
  }

  if (compact) {
    return (
      <button
        onClick={toggleReminder}
        className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs transition-colors ${
          isReminderSet 
            ? 'bg-blue-600/20 text-blue-400 border border-blue-600/40' 
            : 'bg-slate-700 text-slate-400 border border-slate-600'
        }`}
        title={isReminderSet ? 'Erinnerung entfernen' : 'Erinnerung setzen'}
      >
        {isReminderSet ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
        <span>{isReminderSet ? 'Aktiv' : 'Erinnern'}</span>
      </button>
    )
  }

  return (
    <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-600">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${isReminderSet ? 'bg-blue-600/20' : 'bg-slate-700'}`}>
          {isReminderSet ? (
            <Bell className="w-4 h-4 text-blue-400" />
          ) : (
            <BellOff className="w-4 h-4 text-slate-400" />
          )}
        </div>
        <div>
          <div className="font-medium text-slate-100">
            {isReminderSet ? 'Erinnerung aktiv' : 'Erinnerung setzen'}
          </div>
          <div className="text-sm text-slate-400">
            {isReminderSet 
              ? 'Du wirst benachrichtigt, wenn das Event bald endet' 
              : 'Erhalte eine Benachrichtigung 24h vor Event-Ende'
            }
          </div>
        </div>
      </div>
      <button
        onClick={toggleReminder}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          isReminderSet
            ? 'bg-red-600/20 text-red-400 border border-red-600/40'
            : 'bg-blue-600/20 text-blue-400 border border-blue-600/40'
        }`}
      >
        {isReminderSet ? 'Entfernen' : 'Aktivieren'}
      </button>
    </div>
  )
}

export default EventReminder
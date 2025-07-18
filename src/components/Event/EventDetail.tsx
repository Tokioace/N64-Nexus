import React, { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { useEvents } from '../../contexts/EventContext'
import SimpleCard from '../SimpleCard'
import SimpleButton from '../SimpleButton'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  Trophy, 
  Star,
  Target,
  Zap,
  Gift
} from 'lucide-react'

interface EventDetailProps {
  event: any
  onBack?: () => void
  onParticipate?: () => void
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onBack, onParticipate }) => {
  const { user } = useUser()
  const { participateInEvent, getEventProgress } = useEvents()
  const [isParticipating, setIsParticipating] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (user && event) {
      const userProgress = getEventProgress(event.id, user.id)
      setProgress(userProgress)
      setIsParticipating(userProgress > 0)
    }
  }, [user, event, getEventProgress])

  const handleParticipate = async () => {
    if (user && event) {
      try {
        await participateInEvent(event.id, user.id)
        setIsParticipating(true)
        onParticipate?.()
      } catch (error) {
        console.error('Failed to participate in event:', error)
      }
    }
  }

  const formatTimeRemaining = () => {
    if (!event.endDate) return 'Läuft unbegrenzt'
    
    const now = new Date()
    const end = new Date(event.endDate)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Beendet'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const getEventRewards = (eventId: string) => {
    return [
      { id: '1', name: 'Goldene Münze', description: '500 Punkte', icon: '🪙', rarity: 'common' },
      { id: '2', name: 'Silber Trophäe', description: 'Besonderer Titel', icon: '🏆', rarity: 'rare' },
      { id: '3', name: 'Legendäres Abzeichen', description: 'Exklusives Abzeichen', icon: '🏅', rarity: 'legendary' }
    ]
  }

  const rewards = getEventRewards(event.id)
  const timeLeft = formatTimeRemaining()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        {onBack && (
          <SimpleButton
            variant="secondary"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </SimpleButton>
        )}
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-gray-600">Event Details</span>
        </div>
      </div>

      {/* Main Event Card */}
      <SimpleCard className="p-6">
        <div className="space-y-6">
          {/* Event Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
            <p className="text-gray-600 mb-4">{event.description}</p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{timeLeft}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{event.participants || 0} Teilnehmer</span>
              </div>
            </div>
          </div>

          {/* Event Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{event.participants || 0}</div>
              <div className="text-sm text-gray-600">Teilnehmer</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{event.difficulty || 'Normal'}</div>
              <div className="text-sm text-gray-600">Schwierigkeit</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{rewards.length}</div>
              <div className="text-sm text-gray-600">Belohnungen</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{event.type}</div>
              <div className="text-sm text-gray-600">Typ</div>
            </div>
          </div>

          {/* Progress Bar (if participating) */}
          {isParticipating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fortschritt</span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-600 to-blue-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: progress + '%' }}
                />
              </div>
            </div>
          )}

          {/* Participation Button */}
          <div className="text-center">
            {!isParticipating ? (
              <SimpleButton
                variant="primary"
                onClick={handleParticipate}
                className="px-8 py-3 text-lg"
              >
                Teilnehmen
              </SimpleButton>
            ) : (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Target className="w-5 h-5" />
                <span className="font-medium">Du nimmst teil!</span>
              </div>
            )}
          </div>
        </div>
      </SimpleCard>

      {/* Rewards Section */}
      <SimpleCard className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-bold text-gray-900">Belohnungen</h2>
          </div>
          
          <div className="space-y-3">
            {rewards.map((reward, index) => (
              <div 
                key={reward.id}
                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg"
              >
                <div className="text-2xl">
                  {reward.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{reward.name}</div>
                  <div className="text-sm text-gray-600">{reward.description}</div>
                </div>
                <div className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                  {reward.rarity.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SimpleCard>

      {/* Event Rules */}
      <SimpleCard className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Regeln</h2>
          <div className="space-y-2 text-gray-600">
            <p>• Jeder kann nur einmal teilnehmen</p>
            <p>• Das Event läuft für eine begrenzte Zeit</p>
            <p>• Belohnungen werden nach Abschluss verteilt</p>
            <p>• Fair Play ist erforderlich</p>
          </div>
        </div>
      </SimpleCard>
    </div>
  )
}

export default EventDetail
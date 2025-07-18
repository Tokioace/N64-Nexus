import React, { useState, useEffect } from 'react'
import { GameEvent } from '../../types'
import { useEvents } from '../../contexts/EventContext'
import { 
  Calendar, 
  Clock, 
  Users, 
  Trophy, 
  Zap, 
  Target, 
  Star, 
  Award,
  Gift,
  ArrowLeft,
  Play,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import SimpleCard from '../SimpleCard'
import SimpleButton from '../SimpleButton'

interface EventDetailProps {
  event: GameEvent
  onBack?: () => void
  onJoinEvent?: (eventId: string) => void
  onStartGame?: (eventId: string) => void
}

const EventDetail: React.FC<EventDetailProps> = ({
  event,
  onBack,
  onJoinEvent,
  onStartGame
}) => {
  const { 
    getTimeRemaining, 
    isEventActive, 
    joinEvent, 
    participations,
    getEventRewards,
    getEventProgress
  } = useEvents()
  
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(event))
  const [isParticipating, setIsParticipating] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(event))
    }, 1000)

    return () => clearInterval(timer)
  }, [event, getTimeRemaining])

  useEffect(() => {
    const participation = participations.find(p => p.eventId === event.id)
    setIsParticipating(!!participation)
    setProgress(getEventProgress(event.id))
  }, [participations, event.id, getEventProgress])

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Speedrun': return <Zap className="w-8 h-8" />
      case 'Time Trial': return <Clock className="w-8 h-8" />
      case 'Challenge': return <Target className="w-8 h-8" />
      case 'Collection': return <Star className="w-8 h-8" />
      case 'Anniversary': return <Trophy className="w-8 h-8" />
      default: return <Calendar className="w-8 h-8" />
    }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'hard': return 'text-red-600'
      default: return 'text-blue-600'
    }
  }

  const getStatusIcon = () => {
    if (new Date(event.endDate) < new Date()) {
      return <CheckCircle className="w-6 h-6 text-green-600" />
    }
    if (isEventActive(event)) {
      return <Play className="w-6 h-6 text-yellow-600 " />
    }
    return <AlertCircle className="w-6 h-6 text-blue-600" />
  }

  const getStatusText = () => {
    if (new Date(event.endDate) < new Date()) {
      return 'Beendet'
    }
    if (isEventActive(event)) {
      return 'Läuft jetzt'
    }
    return 'Startet bald'
  }

  const formatTimeRemaining = () => {
    const { days, hours, minutes, seconds } = timeRemaining
    return { days, hours, minutes, seconds }
  }

  const handleJoin = () => {
    if (onJoinEvent) {
      onJoinEvent(event.id)
    } else {
      joinEvent(event.id)
    }
  }

  const handleStartGame = () => {
    if (onStartGame) {
      onStartGame(event.id)
    }
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
            className="text-sm"
          >
            <div className="flex items-center space-x-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Zurück</span>
            </div>
          </SimpleButton>
        )}
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm ">{getStatusText()}</span>
        </div>
      </div>

      {/* Hero Section */}
      <SimpleCard
        variant="primary"
        className="p-6 relative overflow-hidden "
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-600 to-green-600" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ij4KPHA+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz4KPHA+CjxwYXRoIGQ9Ik0yMCAwbDIwIDIwLTIwIDIwTDAgMjB6Ii8+CjwvZz4KPC9zdmc+')] " />
        </div>

        <div className="relative z-10">
          {/* Title and Game */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-blue-600/20 rounded-xl border border-blue-600/30">
                <div className="text-blue-600">
                  {getEventIcon(event.type)}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white ">
                  {event.title}
                </h1>
                <div className="flex items-center space-x-4">
                  <span className="text-blue-600 ">{event.game}</span>
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-600 rounded-full text-sm ">
                    {event.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/80 ">
            {event.description}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-black/20 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-yellow-600 ">
                {event.participants || 0}
              </div>
              <div className="text-xs text-white/70 ">Teilnehmer</div>
            </div>
            <div className="text-center p-4 bg-black/20 rounded-lg border border-white/10">
              <div className={`text-2xl font-bold 
                {event.difficulty?.toUpperCase() || 'NORMAL'}
              </div>
              <div className="text-xs text-white/70 ">Schwierigkeit</div>
            </div>
            <div className="text-center p-4 bg-black/20 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-green-600 ">
                {event.rewards.length}
              </div>
              <div className="text-xs text-white/70 ">Belohnungen</div>
            </div>
            <div className="text-center p-4 bg-black/20 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-red-600 ">
                {event.maxParticipants || '∞'}
              </div>
              <div className="text-xs text-white/70 ">Max. Teilnehmer</div>
            </div>
          </div>

          {/* Progress Bar (if participating) */}
          {isParticipating && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm">Fortschritt</span>
                <span className="text-sm">{progress}%</span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-3 border border-white/10">
                                  <div className="bg-gradient-to-r from-green-600 to-yellow-600 h-full rounded-full transition-all duration-500" style={{ width: progress + '%' }} />
              </div>
            </div>
          )}
        </div>
      </SimpleCard>

      {/* Countdown */}
      <SimpleCard
        variant="secondary"
        className="p-6 "
      >
        <div className="text-center">
          <h2 className="text-xl font-bold text-white ">
            <Clock className="w-6 h-6 text-yellow-600" />
            <span>{isEventActive(event) ? 'Endet in:' : 'Startet in:'}</span>
          </h2>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 ">
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-white/70 ">Tage</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 ">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-white/70 ">Stunden</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 ">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-white/70 ">Minuten</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 ">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-white/70 ">Sekunden</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 justify-center">
            {isEventActive(event) && !isParticipating && (
              <SimpleButton
                variant="primary"
                onClick={handleJoin}
                className="flex-1 max-w-xs"
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Event beitreten</span>
                </div>
              </SimpleButton>
            )}
            
            {isParticipating && (
              <SimpleButton
                variant="success"
                onClick={handleStartGame}
                className="flex-1 max-w-xs"
              >
                <div className="flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Spiel starten</span>
                </div>
              </SimpleButton>
            )}
          </div>
        </div>
      </SimpleCard>

      {/* Rewards */}
      <SimpleCard
        variant="primary"
        className="p-6 "
      >
        <h2 className="text-xl font-bold text-white ">
          <Gift className="w-6 h-6 text-yellow-600" />
          <span>Belohnungen</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((reward, index) => (
            <div 
              key={reward.id}
                              className="flex items-center space-x-3 p-4 bg-black/20 rounded-lg border border-white/10"
                              style={{ animationDelay: (index * 0.1) + 's' }}
            >
              <div className="text-2xl">
                {reward.icon}
              </div>
              <div className="flex-1">
                <div className="">
                  {reward.name}
                </div>
                <div className="text-sm text-white/70 ">
                  {reward.description}
                </div>
              </div>
              <div className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                {reward.rarity.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </SimpleCard>

      {/* Event Info */}
      <SimpleCard
        variant="secondary"
        className="p-6 "
      >
        <h2 className="text-xl font-bold text-white ">
          <Award className="w-6 h-6 text-blue-600" />
          <span>Event-Informationen</span>
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-white/70 ">Kategorie:</span>
            <span className="text-white ">{event.category || 'Allgemein'}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-white/70 ">Startdatum:</span>
            <span className="text-white ">
              {new Date(event.startDate).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-white/70 ">Enddatum:</span>
            <span className="text-white ">
              {new Date(event.endDate).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-white/70 ">Event-ID:</span>
            <span className="text-white ">{event.id}</span>
          </div>
        </div>
      </SimpleCard>
    </div>
  )
}

export default EventDetail
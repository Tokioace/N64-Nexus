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
import RetroCard3D from '../RetroCard3D'
import RetroButton3D from '../RetroButton3D'

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
      case 'easy': return 'text-n64-green'
      case 'medium': return 'text-n64-yellow'
      case 'hard': return 'text-n64-red'
      default: return 'text-n64-blue'
    }
  }

  const getStatusIcon = () => {
    if (new Date(event.endDate) < new Date()) {
      return <CheckCircle className="w-6 h-6 text-n64-green" />
    }
    if (isEventActive(event)) {
      return <Play className="w-6 h-6 text-n64-yellow animate-pulse" />
    }
    return <AlertCircle className="w-6 h-6 text-n64-blue" />
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
          <RetroButton3D
            variant="secondary"
            onClick={onBack}
            className="text-sm"
          >
            <div className="flex items-center space-x-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Zurück</span>
            </div>
          </RetroButton3D>
        )}
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-tech text-white/70">{getStatusText()}</span>
        </div>
      </div>

      {/* Hero Section */}
      <RetroCard3D
        variant="primary"
        className="p-6 relative overflow-hidden animate-slide-in-up"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-n64-purple via-n64-blue to-n64-green" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ij4KPHA+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz4KPHA+CjxwYXRoIGQ9Ik0yMCAwbDIwIDIwLTIwIDIwTDAgMjB6Ii8+CjwvZz4KPC9zdmc+')] animate-pulse" />
        </div>

        <div className="relative z-10">
          {/* Title and Game */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-n64-purple/20 rounded-xl border border-n64-purple/30">
                <div className="text-n64-purple">
                  {getEventIcon(event.type)}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white font-tech neon-text mb-2">
                  {event.title}
                </h1>
                <div className="flex items-center space-x-4">
                  <span className="text-n64-blue font-game text-lg">{event.game}</span>
                  <span className="px-3 py-1 bg-n64-purple/20 text-n64-purple rounded-full text-sm font-tech">
                    {event.type}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/80 font-game text-lg leading-relaxed mb-6">
            {event.description}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-black/20 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-n64-yellow font-tech mb-1">
                {event.participants || 0}
              </div>
              <div className="text-xs text-white/70 font-game">Teilnehmer</div>
            </div>
            <div className="text-center p-4 bg-black/20 rounded-lg border border-white/10">
              <div className={`text-2xl font-bold font-tech mb-1 ${getDifficultyColor(event.difficulty)}`}>
                {event.difficulty?.toUpperCase() || 'NORMAL'}
              </div>
              <div className="text-xs text-white/70 font-game">Schwierigkeit</div>
            </div>
            <div className="text-center p-4 bg-black/20 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-n64-green font-tech mb-1">
                {event.rewards.length}
              </div>
              <div className="text-xs text-white/70 font-game">Belohnungen</div>
            </div>
            <div className="text-center p-4 bg-black/20 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-n64-red font-tech mb-1">
                {event.maxParticipants || '∞'}
              </div>
              <div className="text-xs text-white/70 font-game">Max. Teilnehmer</div>
            </div>
          </div>

          {/* Progress Bar (if participating) */}
          {isParticipating && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-tech text-white/70">Fortschritt</span>
                <span className="text-sm font-tech text-n64-yellow">{progress}%</span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-3 border border-white/10">
                <div 
                  className="bg-gradient-to-r from-n64-green to-n64-yellow h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </RetroCard3D>

      {/* Countdown */}
      <RetroCard3D
        variant="secondary"
        className="p-6 animate-slide-in-left"
      >
        <div className="text-center">
          <h2 className="text-xl font-bold text-white font-tech mb-4 flex items-center justify-center space-x-2">
            <Clock className="w-6 h-6 text-n64-yellow" />
            <span>{isEventActive(event) ? 'Endet in:' : 'Startet in:'}</span>
          </h2>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-n64-red font-tech animate-pulse">
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-white/70 font-game">Tage</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-n64-blue font-tech animate-pulse">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-white/70 font-game">Stunden</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-n64-green font-tech animate-pulse">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-white/70 font-game">Minuten</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-n64-yellow font-tech animate-pulse">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-white/70 font-game">Sekunden</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 justify-center">
            {isEventActive(event) && !isParticipating && (
              <RetroButton3D
                variant="primary"
                onClick={handleJoin}
                className="flex-1 max-w-xs"
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Event beitreten</span>
                </div>
              </RetroButton3D>
            )}
            
            {isParticipating && (
              <RetroButton3D
                variant="success"
                onClick={handleStartGame}
                className="flex-1 max-w-xs"
              >
                <div className="flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Spiel starten</span>
                </div>
              </RetroButton3D>
            )}
          </div>
        </div>
      </RetroCard3D>

      {/* Rewards */}
      <RetroCard3D
        variant="primary"
        className="p-6 animate-slide-in-right"
      >
        <h2 className="text-xl font-bold text-white font-tech mb-4 flex items-center space-x-2">
          <Gift className="w-6 h-6 text-n64-yellow" />
          <span>Belohnungen</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((reward, index) => (
            <div 
              key={reward.id}
              className="flex items-center space-x-3 p-4 bg-black/20 rounded-lg border border-white/10 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-2xl">
                {reward.icon}
              </div>
              <div className="flex-1">
                <div className="font-tech font-bold text-white">
                  {reward.name}
                </div>
                <div className="text-sm text-white/70 font-game">
                  {reward.description}
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-tech ${
                reward.rarity === 'legendary' ? 'bg-n64-yellow/20 text-n64-yellow' :
                reward.rarity === 'epic' ? 'bg-n64-purple/20 text-n64-purple' :
                reward.rarity === 'rare' ? 'bg-n64-blue/20 text-n64-blue' :
                'bg-n64-green/20 text-n64-green'
              }`}>
                {reward.rarity.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </RetroCard3D>

      {/* Event Info */}
      <RetroCard3D
        variant="secondary"
        className="p-6 animate-slide-in-up"
      >
        <h2 className="text-xl font-bold text-white font-tech mb-4 flex items-center space-x-2">
          <Award className="w-6 h-6 text-n64-blue" />
          <span>Event-Informationen</span>
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-white/70 font-game">Kategorie:</span>
            <span className="text-white font-tech">{event.category || 'Allgemein'}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-white/70 font-game">Startdatum:</span>
            <span className="text-white font-tech">
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
            <span className="text-white/70 font-game">Enddatum:</span>
            <span className="text-white font-tech">
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
            <span className="text-white/70 font-game">Event-ID:</span>
            <span className="text-white font-tech text-sm">{event.id}</span>
          </div>
        </div>
      </RetroCard3D>
    </div>
  )
}

export default EventDetail
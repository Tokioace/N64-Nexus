import React, { useState, useEffect } from 'react'
import { GameEvent } from '../../types'
import { useEvents } from '../../contexts/EventContext'
import { Calendar, Clock, Users, Trophy, Zap, Target, Star } from 'lucide-react'
import RetroCard3D from '../RetroCard3D'
import RetroButton3D from '../RetroButton3D'

interface EventCardProps {
  event: GameEvent
  variant?: 'default' | 'compact' | 'featured'
  onJoin?: (eventId: string) => void
  onViewDetails?: (eventId: string) => void
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  variant = 'default', 
  onJoin,
  onViewDetails 
}) => {
  const { getTimeRemaining, isEventActive, joinEvent, participations } = useEvents()
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(event))
  const [isParticipating, setIsParticipating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(event))
    }, 1000)

    return () => clearInterval(timer)
  }, [event, getTimeRemaining])

  useEffect(() => {
    const participation = participations.find(p => p.eventId === event.id)
    setIsParticipating(!!participation)
  }, [participations, event.id])

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Speedrun': return <Zap className="w-5 h-5" />
      case 'Time Trial': return <Clock className="w-5 h-5" />
      case 'Challenge': return <Target className="w-5 h-5" />
      case 'Collection': return <Star className="w-5 h-5" />
      case 'Anniversary': return <Trophy className="w-5 h-5" />
      default: return <Calendar className="w-5 h-5" />
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Speedrun': return 'bg-n64-red/20 text-n64-red'
      case 'Time Trial': return 'bg-n64-blue/20 text-n64-blue'
      case 'Challenge': return 'bg-n64-purple/20 text-n64-purple'
      case 'Collection': return 'bg-n64-green/20 text-n64-green'
      case 'Anniversary': return 'bg-n64-yellow/20 text-n64-yellow'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const formatTimeRemaining = () => {
    const { days, hours, minutes, seconds } = timeRemaining
    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
    return `${minutes}m ${seconds}s`
  }

  const handleJoin = () => {
    if (onJoin) {
      onJoin(event.id)
    } else {
      joinEvent(event.id)
    }
  }

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(event.id)
    }
  }

  if (variant === 'compact') {
    return (
      <RetroCard3D
        variant="primary"
        hover3D={true}
        className="p-4 cursor-pointer animate-slide-in-left"
        onClick={handleViewDetails}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-n64-purple">
              {getEventIcon(event.type)}
            </div>
            <div>
              <h3 className="font-tech text-sm font-bold text-white">{event.title}</h3>
              <p className="text-xs text-white/70 font-game">{event.game}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-n64-yellow font-tech">
              {isEventActive(event) ? 'Läuft' : 'Startet in'}
            </div>
            <div className="text-xs text-white/70 font-game">
              {formatTimeRemaining()}
            </div>
          </div>
        </div>
      </RetroCard3D>
    )
  }

  if (variant === 'featured') {
    return (
      <RetroCard3D
        variant="primary"
        hover3D={true}
        className="p-6 animate-bounce-in relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-n64-purple to-n64-blue" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiPgo8cG9seWdvbiBwb2ludHM9IjAsMCAyMCwwIDEwLDIwIi8+CjwvZz4KPC9zdmc+')] animate-pulse" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-n64-purple/20 rounded-lg border border-n64-purple/30">
                {getEventIcon(event.type)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-tech neon-text">
                  {event.title}
                </h2>
                <p className="text-n64-blue font-game">{event.game}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-tech ${getTypeColor(event.type)}`}>
              {event.type}
            </div>
          </div>

          {/* Description */}
          <p className="text-white/80 text-sm font-game mb-4 leading-relaxed">
            {event.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-n64-yellow font-tech">
                {event.participants || 0}
              </div>
              <div className="text-xs text-white/70 font-game">Teilnehmer</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold font-tech ${getDifficultyColor(event.difficulty)}`}>
                {event.difficulty?.toUpperCase() || 'NORMAL'}
              </div>
              <div className="text-xs text-white/70 font-game">Schwierigkeit</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-n64-green font-tech">
                {event.rewards.length}
              </div>
              <div className="text-xs text-white/70 font-game">Belohnungen</div>
            </div>
          </div>

          {/* Countdown */}
          <div className="bg-black/30 rounded-lg p-3 mb-4 border border-n64-purple/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-n64-yellow" />
                <span className="text-sm font-game text-white/70">
                  {isEventActive(event) ? 'Endet in:' : 'Startet in:'}
                </span>
              </div>
              <div className="text-n64-yellow font-tech font-bold animate-pulse">
                {formatTimeRemaining()}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            {isEventActive(event) && (
              <RetroButton3D
                variant={isParticipating ? 'success' : 'primary'}
                onClick={handleJoin}
                disabled={isParticipating}
                className="flex-1"
              >
                {isParticipating ? '✓ Teilgenommen' : 'Teilnehmen'}
              </RetroButton3D>
            )}
            <RetroButton3D
              variant="secondary"
              onClick={handleViewDetails}
              className="flex-1"
            >
              Details
            </RetroButton3D>
          </div>
        </div>
      </RetroCard3D>
    )
  }

  // Default variant
  return (
    <RetroCard3D
      variant="primary"
      hover3D={true}
      className="p-5 animate-slide-in-up"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-n64-purple">
            {getEventIcon(event.type)}
          </div>
          <div>
            <h3 className="font-tech font-bold text-white text-lg">{event.title}</h3>
            <p className="text-n64-blue font-game text-sm">{event.game}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-tech ${getTypeColor(event.type)}`}>
          {event.type}
        </div>
      </div>

      {/* Description */}
      <p className="text-white/70 text-sm font-game mb-3 line-clamp-2">
        {event.description}
      </p>

      {/* Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-n64-green" />
            <span className="text-xs text-white/70 font-game">
              {event.participants || 0}
            </span>
          </div>
          <div className={`text-xs font-tech ${getDifficultyColor(event.difficulty)}`}>
            {event.difficulty?.toUpperCase() || 'NORMAL'}
          </div>
        </div>
        <div className="text-n64-yellow font-tech text-sm">
          {formatTimeRemaining()}
        </div>
      </div>

      {/* Rewards Preview */}
      <div className="flex items-center space-x-2 mb-4">
        <Trophy className="w-4 h-4 text-n64-yellow" />
        <div className="flex space-x-1">
          {event.rewards.slice(0, 3).map((reward, index) => (
            <span key={index} className="text-xs bg-n64-yellow/20 text-n64-yellow px-2 py-1 rounded font-game">
              {reward}
            </span>
          ))}
          {event.rewards.length > 3 && (
            <span className="text-xs text-white/50 font-game">+{event.rewards.length - 3}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        {isEventActive(event) && (
          <RetroButton3D
            variant={isParticipating ? 'success' : 'primary'}
            onClick={handleJoin}
            disabled={isParticipating}
            className="flex-1 text-sm"
          >
            {isParticipating ? '✓ Dabei' : 'Teilnehmen'}
          </RetroButton3D>
        )}
        <RetroButton3D
          variant="secondary"
          onClick={handleViewDetails}
          className="flex-1 text-sm"
        >
          Details
        </RetroButton3D>
      </div>
    </RetroCard3D>
  )
}

export default EventCard
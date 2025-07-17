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
      case 'Speedrun': return 'bg-n64-red/30 text-n64-red border border-n64-red/50'
      case 'Time Trial': return 'bg-n64-blue/30 text-n64-blue border border-n64-blue/50'
      case 'Challenge': return 'bg-n64-purple/30 text-n64-purple border border-n64-purple/50'
      case 'Collection': return 'bg-n64-green/30 text-n64-green border border-n64-green/50'
      case 'Anniversary': return 'bg-n64-yellow/30 text-n64-yellow border border-n64-yellow/50'
      default: return 'bg-gray-500/30 text-gray-300 border border-gray-500/50'
    }
  }

  const formatTimeRemaining = () => {
    const { days, hours, minutes, seconds } = timeRemaining
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
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
        hover3D={false}
        className="p-4 cursor-pointer animate-slide-in-left hover:scale-105 transition-transform duration-200"
        onClick={handleViewDetails}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="text-n64-purple flex-shrink-0">
              {getEventIcon(event.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-tech text-sm font-bold text-white truncate">
                {event.title}
              </h3>
              <p className="text-xs text-white/80 font-game truncate">
                {event.game}
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-3">
            <div className={`text-xs font-tech mb-1 ${isEventActive(event) ? 'text-n64-green' : 'text-n64-yellow'}`}>
              {isEventActive(event) ? 'LIVE' : 'BALD'}
            </div>
            <div className="text-xs text-white/80 font-game">
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
        hover3D={false}
        className="p-6 animate-bounce-in relative overflow-hidden hover:scale-102 transition-transform duration-300"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-n64-purple to-n64-blue" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiPgo8cG9seWdvbiBwb2ludHM9IjAsMCAyMCwwIDEwLDIwIi8+CjwvZz4KPC9zdmc+')] animate-pulse" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="p-3 bg-n64-purple/20 rounded-lg border border-n64-purple/30 flex-shrink-0">
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white font-tech neon-text mb-1">
                  {event.title}
                </h2>
                <p className="text-n64-blue font-game text-base">
                  {event.game}
                </p>
              </div>
            </div>
            <div className={`px-3 py-2 rounded-lg text-sm font-tech whitespace-nowrap ml-4 flex-shrink-0 ${getTypeColor(event.type)}`}>
              {event.type}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-white/90 text-base font-game leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="text-center bg-black/20 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-n64-yellow font-tech mb-1">
                {event.participants || 0}
              </div>
              <div className="text-sm text-white/80 font-game">Teilnehmer</div>
            </div>
            <div className="text-center bg-black/20 rounded-lg p-4 border border-white/10">
              <div className={`text-2xl font-bold font-tech mb-1 ${getDifficultyColor(event.difficulty)}`}>
                {event.difficulty?.toUpperCase() || 'NORMAL'}
              </div>
              <div className="text-sm text-white/80 font-game">Schwierigkeit</div>
            </div>
            <div className="text-center bg-black/20 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-n64-green font-tech mb-1">
                {event.rewards.length}
              </div>
              <div className="text-sm text-white/80 font-game">Belohnungen</div>
            </div>
          </div>

          {/* Countdown */}
          <div className="bg-black/30 rounded-lg p-4 mb-6 border border-n64-purple/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-n64-yellow" />
                <span className="text-base font-game text-white/90">
                  {isEventActive(event) ? 'Endet in:' : 'Startet in:'}
                </span>
              </div>
              <div className="text-xl text-n64-yellow font-tech font-bold">
                {formatTimeRemaining()}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            {isEventActive(event) && (
              <RetroButton3D
                variant={isParticipating ? 'success' : 'primary'}
                onClick={handleJoin}
                disabled={isParticipating}
                className="flex-1"
                size="lg"
              >
                {isParticipating ? '✓ Teilgenommen' : 'Teilnehmen'}
              </RetroButton3D>
            )}
            <RetroButton3D
              variant="secondary"
              onClick={handleViewDetails}
              className="flex-1"
              size="lg"
            >
              Details ansehen
            </RetroButton3D>
          </div>
        </div>
      </RetroCard3D>
    )
  }

  // Default variant - Fixed layout and readability
  return (
    <RetroCard3D
      variant="primary"
      hover3D={false}
      className="p-5 animate-slide-in-up hover:scale-102 transition-transform duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="text-n64-purple flex-shrink-0">
            {getEventIcon(event.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-tech font-bold text-white text-lg mb-1 leading-tight">
              {event.title}
            </h3>
            <p className="text-n64-blue font-game text-sm">
              {event.game}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-lg text-xs font-tech whitespace-nowrap ml-3 flex-shrink-0 ${getTypeColor(event.type)}`}>
          {event.type}
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-white/80 text-sm font-game leading-relaxed line-clamp-2">
          {event.description}
        </p>
      </div>

      {/* Info Bar */}
      <div className="flex items-center justify-between mb-4 bg-black/20 rounded-lg p-3 border border-white/10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-n64-green" />
            <span className="text-sm text-white/90 font-game">
              {event.participants || 0}
            </span>
          </div>
          <div className={`text-sm font-tech ${getDifficultyColor(event.difficulty)}`}>
            {event.difficulty?.toUpperCase() || 'NORMAL'}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-n64-yellow" />
          <span className="text-sm text-n64-yellow font-tech">
            {formatTimeRemaining()}
          </span>
        </div>
      </div>

      {/* Rewards Preview */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Trophy className="w-4 h-4 text-n64-yellow" />
          <span className="text-sm text-white/90 font-game">Belohnungen:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {event.rewards.slice(0, 3).map((reward, index) => (
            <span key={index} className="text-xs bg-n64-yellow/20 text-n64-yellow px-2 py-1 rounded-lg font-game border border-n64-yellow/30">
              {reward}
            </span>
          ))}
          {event.rewards.length > 3 && (
            <span className="text-xs text-white/60 font-game px-2 py-1">
              +{event.rewards.length - 3} weitere
            </span>
          )}
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
            size="md"
          >
            {isParticipating ? '✓ Dabei' : 'Teilnehmen'}
          </RetroButton3D>
        )}
        <RetroButton3D
          variant="secondary"
          onClick={handleViewDetails}
          className="flex-1"
          size="md"
        >
          Details
        </RetroButton3D>
      </div>
    </RetroCard3D>
  )
}

export default EventCard
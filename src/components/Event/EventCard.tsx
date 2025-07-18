import React, { useState, useEffect } from 'react'
import { GameEvent } from '../../types'
import { useEvents } from '../../contexts/EventContext'
import { Calendar, Clock, Users, Trophy, Zap, Target, Star } from 'lucide-react'
import SimpleCard from '../SimpleCard'
import SimpleButton from '../SimpleButton'

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
      case 'easy': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'hard': return 'text-red-600'
      default: return 'text-blue-600'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Speedrun': return 'bg-red-600/30 text-red-600 border border-red-600/50'
      case 'Time Trial': return 'bg-blue-600/30 text-blue-600 border border-blue-600/50'
      case 'Challenge': return 'bg-blue-600/30 text-blue-600 border border-blue-600/50'
      case 'Collection': return 'bg-green-600/30 text-green-600 border border-green-600/50'
      case 'Anniversary': return 'bg-yellow-600/30 text-yellow-600 border border-yellow-600/50'
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
      <SimpleCard
        variant="primary"
        className="p-4 cursor-pointer hover-scale-small"
        onClick={handleViewDetails}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="text-blue-600 flex-shrink-0">
              {getEventIcon(event.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-contrast font-semibold">
                {event.title}
              </h3>
              <p className="text-xs text-contrast-secondary">
                {event.game}
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-3">
            <div className="text-xs text-contrast font-bold">
              {isEventActive(event) ? 'LIVE' : 'BALD'}
            </div>
            <div className="text-xs text-contrast-secondary">
              {formatTimeRemaining()}
            </div>
          </div>
        </div>
      </SimpleCard>
    )
  }

  if (variant === 'featured') {
    return (
      <SimpleCard
        variant="primary"
        className="p-6"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-600" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiPgo8cG9seWdvbiBwb2ludHM9IjAsMCAyMCwwIDEwLDIwIi8+CjwvZz4KPC9zdmc+')]" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="p-3 bg-blue-600/20 rounded-lg border border-blue-600/30 flex-shrink-0">
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white">
                  {event.title}
                </h2>
                <p className="text-blue-600">
                  {event.game}
                </p>
              </div>
            </div>
            <div className="px-3 py-2 rounded-lg text-sm bg-gray-100 text-gray-700">
              {event.type}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-white/90 text-base">
              {event.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="text-center bg-black/20 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-yellow-600">
                {event.participants || 0}
              </div>
              <div className="text-sm text-white/80">Teilnehmer</div>
            </div>
            <div className="text-center bg-black/20 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">
                {event.difficulty?.toUpperCase() || 'NORMAL'}
              </div>
              <div className="text-sm text-white/80">Schwierigkeit</div>
            </div>
            <div className="text-center bg-black/20 rounded-lg p-4 border border-white/10">
              <div className="text-2xl font-bold text-green-600">
                {event.rewards.length}
              </div>
              <div className="text-sm text-white/80">Belohnungen</div>
            </div>
          </div>

          {/* Countdown */}
          <div className="bg-black/30 rounded-lg p-4 mb-6 border border-blue-600/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-base">
                  {isEventActive(event) ? 'Endet in:' : 'Startet in:'}
                </span>
              </div>
              <div className="text-xl text-yellow-600">
                {formatTimeRemaining()}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            {isEventActive(event) && (
              <SimpleButton
                variant={isParticipating ? 'success' : 'primary'}
                onClick={handleJoin}
                disabled={isParticipating}
                className="flex-1"
                size="lg"
              >
                {isParticipating ? '✓ Teilgenommen' : 'Teilnehmen'}
              </SimpleButton>
            )}
            <SimpleButton
              variant="secondary"
              onClick={handleViewDetails}
              className="flex-1"
              size="lg"
            >
              Details ansehen
            </SimpleButton>
          </div>
        </div>
      </SimpleCard>
    )
  }

  // Default variant - Fixed layout and readability
  return (
    <SimpleCard
      variant="primary"
      className="p-5 hover-scale-small"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="text-blue-600 flex-shrink-0">
            {getEventIcon(event.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-contrast font-semibold">
              {event.title}
            </h3>
            <p className="text-blue-400 font-medium">
              {event.game}
            </p>
          </div>
        </div>
                  <div className="px-3 py-1 rounded-lg text-xs bg-gray-100 text-gray-700">
            {event.type}
          </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-contrast-secondary text-sm">
          {event.description}
        </p>
      </div>

      {/* Info Bar */}
      <div className="flex items-center justify-between mb-4 bg-black/20 rounded-lg p-3 border border-white/10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-green-600" />
            <span className="text-sm text-contrast">
              {event.participants || 0}
            </span>
          </div>
          <div className="text-sm text-contrast-secondary font-medium">
            {event.difficulty?.toUpperCase() || 'NORMAL'}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-yellow-600" />
          <span className="text-sm text-yellow-600">
            {formatTimeRemaining()}
          </span>
        </div>
      </div>

      {/* Rewards Preview */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Trophy className="w-4 h-4 text-yellow-600" />
          <span className="text-sm text-contrast">Belohnungen:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {event.rewards.slice(0, 3).map((reward, index) => (
            <span key={index} className="text-xs bg-yellow-600/20 text-yellow-600 px-2 py-1 rounded-lg">
              {reward}
            </span>
          ))}
          {event.rewards.length > 3 && (
            <span className="text-xs text-contrast-secondary">
              +{event.rewards.length - 3} weitere
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        {isEventActive(event) && (
          <SimpleButton
            variant={isParticipating ? 'success' : 'primary'}
            onClick={handleJoin}
            disabled={isParticipating}
            className="flex-1"
            size="md"
          >
            {isParticipating ? '✓ Dabei' : 'Teilnehmen'}
          </SimpleButton>
        )}
        <SimpleButton
          variant="secondary"
          onClick={handleViewDetails}
          className="flex-1"
          size="md"
        >
          Details
        </SimpleButton>
      </div>
    </SimpleCard>
  )
}

export default EventCard
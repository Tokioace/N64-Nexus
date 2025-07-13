import { useState } from 'react'
import { Trophy, Clock, Users, Target, Image, Brain, CheckCircle, XCircle } from 'lucide-react'
import { User, Challenge } from '../types'

interface ChallengeCardProps {
  challenge: Challenge
  currentUser: User
  onUpdateChallenge: (challenge: Challenge) => void
}

const ChallengeCard = ({ challenge, currentUser, onUpdateChallenge }: ChallengeCardProps) => {
  const [showDetails, setShowDetails] = useState(false)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'speedrun': return Target
      case 'fanart': return Image
      case 'quiz': return Brain
      default: return Trophy
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'speedrun': return 'text-n64-green'
      case 'fanart': return 'text-n64-purple'
      case 'quiz': return 'text-n64-blue'
      default: return 'text-n64-yellow'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-n64-green text-green-300'
      case 'completed': return 'bg-n64-blue text-blue-300'
      case 'cancelled': return 'bg-n64-red text-red-300'
      default: return 'bg-gray-700 text-gray-300'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktiv'
      case 'completed': return 'Abgeschlossen'
      case 'cancelled': return 'Abgebrochen'
      default: return 'Unbekannt'
    }
  }

  const formatDeadline = (date: Date) => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days} Tage`
    if (hours > 0) return `${hours} Stunden`
    return 'Bald abgelaufen'
  }

  const isParticipant = challenge.participants.some(p => p.id === currentUser.id)
  const isCreator = challenge.creator.id === currentUser.id

  const handleJoin = () => {
    if (!isParticipant) {
      const updatedChallenge = {
        ...challenge,
        participants: [...challenge.participants, currentUser as any]
      }
      onUpdateChallenge(updatedChallenge)
    }
  }

  const handleComplete = () => {
    const updatedChallenge = {
      ...challenge,
      status: 'completed' as const
    }
    onUpdateChallenge(updatedChallenge)
  }

  const TypeIcon = getTypeIcon(challenge.type)

  return (
    <div className="card hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getTypeColor(challenge.type).replace('text-', 'bg-')}`}>
            <TypeIcon size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-medium text-white">{challenge.title}</h3>
            <p className="text-sm text-gray-400">{challenge.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(challenge.status)}`}>
            {getStatusText(challenge.status)}
          </span>
          {isCreator && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-n64-yellow text-yellow-300">
              Erstellt
            </span>
          )}
        </div>
      </div>

      {/* Challenge Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock size={16} />
          <span>Deadline: {formatDeadline(challenge.deadline)}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Users size={16} />
          <span>{challenge.participants.length} Teilnehmer</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Trophy size={16} />
          <span>{challenge.rewards.xp} XP + {challenge.rewards.badge || 'Badge'}</span>
        </div>
      </div>

      {/* Participants */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Teilnehmer</h4>
        <div className="flex flex-wrap gap-2">
          {challenge.participants.map((participant) => (
            <div key={participant.id} className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-1">
              <img
                src={participant.avatar}
                alt={participant.username}
                className="w-6 h-6 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/24x24/6B46C1/FFFFFF?text=64'
                }}
              />
              <span className="text-sm text-white">{participant.username}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        {challenge.status === 'active' && !isParticipant && (
          <button onClick={handleJoin} className="flex-1 btn-success text-sm py-2">
            <Trophy size={16} className="mr-2" />
            Teilnehmen
          </button>
        )}
        
        {challenge.status === 'active' && isParticipant && !isCreator && (
          <button onClick={handleComplete} className="flex-1 btn-success text-sm py-2">
            <CheckCircle size={16} className="mr-2" />
            Abschließen
          </button>
        )}
        
        {challenge.status === 'active' && isCreator && (
          <button className="flex-1 btn-danger text-sm py-2">
            <XCircle size={16} className="mr-2" />
            Abbrechen
          </button>
        )}
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex-1 btn-secondary text-sm py-2"
        >
          Details
        </button>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-1">Beschreibung</h4>
              <p className="text-sm text-gray-400">{challenge.description}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-1">Belohnungen</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>XP: {challenge.rewards.xp}</span>
                {challenge.rewards.badge && (
                  <span>Badge: {challenge.rewards.badge}</span>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-1">Erstellt von</h4>
              <div className="flex items-center space-x-2">
                <img
                  src={challenge.creator.avatar}
                  alt={challenge.creator.username}
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/24x24/6B46C1/FFFFFF?text=64'
                  }}
                />
                <span className="text-sm text-white">{challenge.creator.username}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChallengeCard
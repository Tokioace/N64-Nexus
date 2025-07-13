import { useState } from 'react'
import { X, Target, Image, Brain, Users, Clock, Trophy } from 'lucide-react'
import { User, Friend, Challenge } from '../types'

interface CreateChallengeModalProps {
  currentUser: User
  friends: Friend[]
  onClose: () => void
  onCreateChallenge: (challenge: Challenge) => void
}

const CreateChallengeModal = ({ currentUser, friends, onClose, onCreateChallenge }: CreateChallengeModalProps) => {
  const [challengeType, setChallengeType] = useState<'speedrun' | 'fanart' | 'quiz'>('speedrun')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [deadline, setDeadline] = useState('')
  const [xpReward, setXpReward] = useState(100)
  const [badgeReward, setBadgeReward] = useState('')

  const challengeTypes = [
    {
      type: 'speedrun' as const,
      label: 'Speedrun',
      icon: Target,
      description: '1vs1 Geschwindigkeitswettbewerb',
      color: 'bg-n64-green'
    },
    {
      type: 'fanart' as const,
      label: 'Fanart',
      icon: Image,
      description: 'Kreative Kunst-Challenges',
      color: 'bg-n64-purple'
    },
    {
      type: 'quiz' as const,
      label: 'Quiz',
      icon: Brain,
      description: 'N64-Wissen testen',
      color: 'bg-n64-blue'
    }
  ]

  const handleCreateChallenge = () => {
    if (!title || !description || selectedFriends.length === 0 || !deadline) {
      alert('Bitte fülle alle Pflichtfelder aus.')
      return
    }

    const newChallenge: Challenge = {
      id: Date.now().toString(),
      type: challengeType,
      title,
      description,
      creator: currentUser,
      participants: friends.filter(f => selectedFriends.includes(f.id)),
      status: 'active',
      deadline: new Date(deadline),
      rewards: {
        xp: xpReward,
        badge: badgeReward || undefined
      }
    }

    onCreateChallenge(newChallenge)
  }

  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-retro-gray rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-gaming text-white">Neue Challenge erstellen</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Challenge Type Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-white mb-4">Challenge-Typ</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {challengeTypes.map((type) => {
              const Icon = type.icon
              return (
                <button
                  key={type.type}
                  onClick={() => setChallengeType(type.type)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    challengeType === type.type
                      ? 'border-n64-purple bg-n64-purple/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${type.color}`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <span className="font-medium text-white">{type.label}</span>
                  </div>
                  <p className="text-sm text-gray-400 text-left">{type.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Challenge Details */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Titel *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. DK Jungle 3 Runden Speedrun"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Beschreibung *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beschreibe die Challenge..."
              rows={3}
              className="input-field w-full resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Deadline *
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                XP-Belohnung
              </label>
              <input
                type="number"
                value={xpReward}
                onChange={(e) => setXpReward(parseInt(e.target.value) || 0)}
                min="0"
                max="1000"
                className="input-field w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Badge-Belohnung (optional)
            </label>
            <input
              type="text"
              value={badgeReward}
              onChange={(e) => setBadgeReward(e.target.value)}
              placeholder="z.B. Speed King"
              className="input-field w-full"
            />
          </div>
        </div>

        {/* Friend Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-white mb-4">
            Freunde einladen ({selectedFriends.length} ausgewählt)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
            {friends.map((friend) => (
              <label
                key={friend.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedFriends.includes(friend.id)
                    ? 'border-n64-purple bg-n64-purple/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedFriends.includes(friend.id)}
                  onChange={() => toggleFriend(friend.id)}
                  className="w-4 h-4 text-n64-purple bg-gray-600 border-gray-500 rounded focus:ring-n64-purple"
                />
                <img
                  src={friend.avatar}
                  alt={friend.username}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/32x32/6B46C1/FFFFFF?text=64'
                  }}
                />
                <div>
                  <span className="text-white font-medium">{friend.username}</span>
                  <p className="text-sm text-gray-400">Level {friend.level}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-600">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={handleCreateChallenge}
            className="btn-primary"
            disabled={!title || !description || selectedFriends.length === 0 || !deadline}
          >
            Challenge erstellen
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateChallengeModal
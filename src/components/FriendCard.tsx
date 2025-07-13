import { useState } from 'react'
import { MessageCircle, Trophy, UserX, MoreVertical, Crown, Star } from 'lucide-react'
import { User, Friend } from '../types'

interface FriendCardProps {
  friend: Friend
  currentUser: User
  onRemoveFriend: (friendId: string) => void
}

const FriendCard = ({ friend, currentUser, onRemoveFriend }: FriendCardProps) => {
  const [showMenu, setShowMenu] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-n64-green'
      case 'inactive': return 'bg-gray-500'
      case 'away': return 'bg-n64-yellow'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online'
      case 'inactive': return 'Inaktiv'
      case 'away': return 'Abwesend'
      default: return 'Unbekannt'
    }
  }

  const getFriendshipDuration = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays >= 100) {
      return `${Math.floor(diffDays / 100)}00+ Tage`
    } else if (diffDays >= 30) {
      return `${Math.floor(diffDays / 30)} Monate`
    } else {
      return `${diffDays} Tage`
    }
  }

  return (
    <div className="card hover:shadow-xl transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={friend.avatar}
              alt={friend.username}
              className="w-12 h-12 rounded-full border-2 border-n64-purple"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/48x48/6B46C1/FFFFFF?text=64'
              }}
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(friend.status)}`} />
          </div>
          <div>
            <h3 className="font-medium text-white">{friend.username}</h3>
            <p className="text-sm text-gray-400">Level {friend.level}</p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <MoreVertical size={16} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-8 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-10 min-w-[150px]">
              <button
                onClick={() => {
                  // Handle message
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center space-x-2"
              >
                <MessageCircle size={16} />
                <span>Nachricht</span>
              </button>
              <button
                onClick={() => {
                  // Handle challenge
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center space-x-2"
              >
                <Trophy size={16} />
                <span>Challenge</span>
              </button>
              <hr className="border-gray-600" />
              <button
                onClick={() => {
                  onRemoveFriend(friend.id)
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center space-x-2"
              >
                <UserX size={16} />
                <span>Entfernen</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          friend.status === 'online' ? 'bg-green-900 text-green-300' :
          friend.status === 'inactive' ? 'bg-gray-700 text-gray-300' :
          'bg-yellow-900 text-yellow-300'
        }`}>
          {getStatusText(friend.status)}
        </span>
      </div>

      {/* Friendship Info */}
      <div className="mb-4 text-sm text-gray-400">
        <p>Freunde seit {getFriendshipDuration(friend.friendshipDate)}</p>
      </div>

      {/* Badges */}
      {friend.badges.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Badges</h4>
          <div className="flex flex-wrap gap-2">
            {friend.badges.map((badge, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-n64-purple/20 text-n64-purple border border-n64-purple/30"
              >
                {badge === '100 Days' && <Crown size={12} className="mr-1" />}
                {badge === 'Speedrunner' && <Star size={12} className="mr-1" />}
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <button className="flex-1 btn-secondary text-sm py-2">
          <MessageCircle size={16} className="mr-2" />
          Nachricht
        </button>
        <button className="flex-1 btn-primary text-sm py-2">
          <Trophy size={16} className="mr-2" />
          Challenge
        </button>
      </div>
    </div>
  )
}

export default FriendCard
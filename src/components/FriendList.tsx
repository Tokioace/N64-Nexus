import { useState } from 'react'
import { Search, UserPlus, Users, Shield, Settings } from 'lucide-react'
import { User, Friend } from '../types'
import FriendCard from './FriendCard'
import AddFriendModal from './AddFriendModal'
import PrivacySettings from './PrivacySettings'

interface FriendListProps {
  currentUser: User
  friends: Friend[]
  setFriends: (friends: Friend[]) => void
}

const FriendList = ({ currentUser, friends, setFriends }: FriendListProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [filter, setFilter] = useState<'all' | 'online' | 'inactive'>('all')

  const filteredFriends = friends.filter(friend => {
    const matchesSearch = friend.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || friend.status === filter
    return matchesSearch && matchesFilter
  })

  const onlineFriends = friends.filter(f => f.status === 'online').length
  const totalFriends = friends.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-gaming text-white mb-2">👥 Freundesliste</h1>
          <p className="text-gray-400">
            {onlineFriends} von {totalFriends} Freunden online
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPrivacy(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Shield size={16} />
            <span>Privatsphäre</span>
          </button>
          <button
            onClick={() => setShowAddFriend(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <UserPlus size={16} />
            <span>Freund hinzufügen</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Freunde suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'all' ? 'bg-n64-purple text-white' : 'bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              Alle ({totalFriends})
            </button>
            <button
              onClick={() => setFilter('online')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'online' ? 'bg-n64-green text-white' : 'bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              Online ({onlineFriends})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'inactive' ? 'bg-n64-yellow text-white' : 'bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              Inaktiv ({totalFriends - onlineFriends})
            </button>
          </div>
        </div>
      </div>

      {/* Friends Grid */}
      {filteredFriends.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFriends.map((friend) => (
            <FriendCard
              key={friend.id}
              friend={friend}
              currentUser={currentUser}
              onRemoveFriend={(friendId) => {
                setFriends(friends.filter(f => f.id !== friendId))
              }}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Users size={64} className="mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-300 mb-2">
            {searchTerm ? 'Keine Freunde gefunden' : 'Noch keine Freunde'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? `Keine Freunde mit "${searchTerm}" gefunden.`
              : 'Füge deine ersten Freunde hinzu und starte Challenges!'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddFriend(true)}
              className="btn-primary"
            >
              Ersten Freund hinzufügen
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {showAddFriend && (
        <AddFriendModal
          onClose={() => setShowAddFriend(false)}
          onAddFriend={(newFriend) => {
            setFriends([...friends, newFriend])
            setShowAddFriend(false)
          }}
        />
      )}

      {showPrivacy && (
        <PrivacySettings
          currentUser={currentUser}
          onClose={() => setShowPrivacy(false)}
        />
      )}
    </div>
  )
}

export default FriendList
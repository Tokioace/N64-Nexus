import { useState } from 'react'
import { X, Search, QrCode, UserPlus } from 'lucide-react'
import { Friend } from '../types'

interface AddFriendModalProps {
  onClose: () => void
  onAddFriend: (friend: Friend) => void
}

const AddFriendModal = ({ onClose, onAddFriend }: AddFriendModalProps) => {
  const [searchMethod, setSearchMethod] = useState<'username' | 'id' | 'qr'>('username')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    
    setIsSearching(true)
    
    // Simulate API call
    setTimeout(() => {
      const mockFriend: Friend = {
        id: Date.now().toString(),
        username: searchTerm,
        avatar: `https://via.placeholder.com/48x48/6B46C1/FFFFFF?text=${searchTerm.charAt(0).toUpperCase()}`,
        status: 'online',
        level: Math.floor(Math.random() * 50) + 1,
        friendshipDate: new Date(),
        badges: []
      }
      
      onAddFriend(mockFriend)
      setIsSearching(false)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-retro-gray rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-gaming text-white">Freund hinzufügen</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Method Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setSearchMethod('username')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              searchMethod === 'username'
                ? 'bg-n64-purple text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Search size={16} className="inline mr-2" />
            Username
          </button>
          <button
            onClick={() => setSearchMethod('id')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              searchMethod === 'id'
                ? 'bg-n64-purple text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <UserPlus size={16} className="inline mr-2" />
            ID
          </button>
          <button
            onClick={() => setSearchMethod('qr')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              searchMethod === 'qr'
                ? 'bg-n64-purple text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <QrCode size={16} className="inline mr-2" />
            QR
          </button>
        </div>

        {/* Search Input */}
        {searchMethod !== 'qr' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {searchMethod === 'username' ? 'Username' : 'Battle64 ID'} eingeben
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchMethod === 'username' ? 'z.B. MarioFan99' : 'z.B. B64-12345'}
                className="input-field flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchTerm.trim()}
                className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? 'Suche...' : 'Suchen'}
              </button>
            </div>
          </div>
        )}

        {/* QR Code Scanner */}
        {searchMethod === 'qr' && (
          <div className="mb-6 text-center">
            <div className="bg-gray-800 rounded-lg p-8 mb-4">
              <QrCode size={64} className="mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400 text-sm">
                QR-Code scannen um Freund hinzuzufügen
              </p>
            </div>
            <button className="btn-primary">
              Kamera öffnen
            </button>
          </div>
        )}

        {/* Recent Searches */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Letzte Suchen</h3>
          <div className="space-y-2">
            {['RetroGamer2024', 'N64Master', 'ZeldaFan'].map((username) => (
              <div
                key={username}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => {
                  setSearchTerm(username)
                  setSearchMethod('username')
                }}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={`https://via.placeholder.com/32x32/6B46C1/FFFFFF?text=${username.charAt(0).toUpperCase()}`}
                    alt={username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-white">{username}</span>
                </div>
                <button className="text-n64-purple hover:text-purple-400">
                  <UserPlus size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddFriendModal
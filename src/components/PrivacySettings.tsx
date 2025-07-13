import { useState } from 'react'
import { X, Shield, Users, Eye, EyeOff } from 'lucide-react'
import { User } from '../types'

interface PrivacySettingsProps {
  currentUser: User
  onClose: () => void
}

const PrivacySettings = ({ currentUser, onClose }: PrivacySettingsProps) => {
  const [privacy, setPrivacy] = useState(currentUser.privacy)
  const [allowFriendEvents, setAllowFriendEvents] = useState(true)
  const [showOnlineStatus, setShowOnlineStatus] = useState(true)
  const [allowChallenges, setAllowChallenges] = useState(true)

  const privacyOptions = [
    {
      value: 'public',
      label: 'Öffentlich',
      description: 'Jeder kann dein Profil sehen und dir folgen',
      icon: Eye
    },
    {
      value: 'friends',
      label: 'Nur Freunde',
      description: 'Nur deine Freunde können dein Profil sehen',
      icon: Users
    },
    {
      value: 'private',
      label: 'Privat',
      description: 'Niemand kann dein Profil sehen',
      icon: EyeOff
    }
  ]

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Privacy settings saved:', {
      privacy,
      allowFriendEvents,
      showOnlineStatus,
      allowChallenges
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-retro-gray rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Shield className="text-n64-purple" size={24} />
            <h2 className="text-xl font-gaming text-white">Privatsphäre-Einstellungen</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Profile Visibility */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Profil-Sichtbarkeit</h3>
          <div className="space-y-3">
            {privacyOptions.map((option) => {
              const Icon = option.icon
              return (
                <label
                  key={option.value}
                  className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    privacy === option.value
                      ? 'border-n64-purple bg-n64-purple/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="privacy"
                    value={option.value}
                    checked={privacy === option.value}
                    onChange={(e) => setPrivacy(e.target.value as 'public' | 'friends' | 'private')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon size={20} className="text-n64-purple" />
                      <span className="font-medium text-white">{option.label}</span>
                    </div>
                    <p className="text-sm text-gray-400">{option.description}</p>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* Friend Event Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Freundes-Events</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div>
                <span className="font-medium text-white">An Freundes-Events teilnehmen</span>
                <p className="text-sm text-gray-400">Erlaube Freunden, dich zu Challenges einzuladen</p>
              </div>
              <input
                type="checkbox"
                checked={allowFriendEvents}
                onChange={(e) => setAllowFriendEvents(e.target.checked)}
                className="w-5 h-5 text-n64-purple bg-gray-600 border-gray-500 rounded focus:ring-n64-purple"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div>
                <span className="font-medium text-white">Online-Status anzeigen</span>
                <p className="text-sm text-gray-400">Freunde können sehen, wann du online bist</p>
              </div>
              <input
                type="checkbox"
                checked={showOnlineStatus}
                onChange={(e) => setShowOnlineStatus(e.target.checked)}
                className="w-5 h-5 text-n64-purple bg-gray-600 border-gray-500 rounded focus:ring-n64-purple"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div>
                <span className="font-medium text-white">Challenges annehmen</span>
                <p className="text-sm text-gray-400">Erlaube Freunden, dir Challenges zu senden</p>
              </div>
              <input
                type="checkbox"
                checked={allowChallenges}
                onChange={(e) => setAllowChallenges(e.target.checked)}
                className="w-5 h-5 text-n64-purple bg-gray-600 border-gray-500 rounded focus:ring-n64-purple"
              />
            </label>
          </div>
        </div>

        {/* Blocked Users */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Blockierte Nutzer</h3>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-3">
              Du hast derzeit keine blockierten Nutzer.
            </p>
            <button className="text-n64-purple hover:text-purple-400 text-sm">
              Blockierte Nutzer verwalten
            </button>
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
            onClick={handleSave}
            className="btn-primary"
          >
            Einstellungen speichern
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrivacySettings
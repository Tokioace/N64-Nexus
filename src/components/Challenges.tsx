import { useState } from 'react'
import { Trophy, Plus, Users, Clock, Target, Image, Brain } from 'lucide-react'
import { User, Friend, Challenge } from '../types'
import CreateChallengeModal from './CreateChallengeModal'
import ChallengeCard from './ChallengeCard'

interface ChallengesProps {
  currentUser: User
  challenges: Challenge[]
  setChallenges: (challenges: Challenge[]) => void
  friends: Friend[]
}

const Challenges = ({ currentUser, challenges, setChallenges, friends }: ChallengesProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'my'>('all')

  const filteredChallenges = challenges.filter(challenge => {
    switch (filter) {
      case 'active':
        return challenge.status === 'active'
      case 'completed':
        return challenge.status === 'completed'
      case 'my':
        return challenge.creator.id === currentUser.id
      default:
        return true
    }
  })

  const activeChallenges = challenges.filter(c => c.status === 'active').length
  const myChallenges = challenges.filter(c => c.creator.id === currentUser.id).length

  const challengeTypes = [
    {
      type: 'speedrun',
      label: 'Speedrun',
      icon: Target,
      description: '1vs1 Geschwindigkeitswettbewerb',
      color: 'bg-n64-green'
    },
    {
      type: 'fanart',
      label: 'Fanart',
      icon: Image,
      description: 'Kreative Kunst-Challenges',
      color: 'bg-n64-purple'
    },
    {
      type: 'quiz',
      label: 'Quiz',
      icon: Brain,
      description: 'N64-Wissen testen',
      color: 'bg-n64-blue'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-gaming text-white mb-2">⚔️ Challenges</h1>
          <p className="text-gray-400">
            {activeChallenges} aktive Challenges • {myChallenges} von dir erstellt
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Challenge erstellen</span>
        </button>
      </div>

      {/* Challenge Types Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {challengeTypes.map((type) => {
          const Icon = type.icon
          const count = challenges.filter(c => c.type === type.type).length
          return (
            <div key={type.type} className="card hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg ${type.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{type.label}</h3>
                  <p className="text-sm text-gray-400">{count} Challenges</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">{type.description}</p>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'all' ? 'bg-n64-purple text-white' : 'bg-gray-700 text-gray-300 hover:text-white'
            }`}
          >
            Alle ({challenges.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'active' ? 'bg-n64-green text-white' : 'bg-gray-700 text-gray-300 hover:text-white'
            }`}
          >
            Aktiv ({activeChallenges})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'completed' ? 'bg-n64-blue text-white' : 'bg-gray-700 text-gray-300 hover:text-white'
            }`}
          >
            Abgeschlossen ({challenges.filter(c => c.status === 'completed').length})
          </button>
          <button
            onClick={() => setFilter('my')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'my' ? 'bg-n64-yellow text-white' : 'bg-gray-700 text-gray-300 hover:text-white'
            }`}
          >
            Meine ({myChallenges})
          </button>
        </div>
      </div>

      {/* Challenges List */}
      {filteredChallenges.length > 0 ? (
        <div className="space-y-4">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              currentUser={currentUser}
              onUpdateChallenge={(updatedChallenge) => {
                setChallenges(challenges.map(c => 
                  c.id === updatedChallenge.id ? updatedChallenge : c
                ))
              }}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Trophy size={64} className="mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-300 mb-2">
            {filter === 'all' ? 'Noch keine Challenges' : 'Keine Challenges gefunden'}
          </h3>
          <p className="text-gray-500 mb-4">
            {filter === 'all' 
              ? 'Erstelle deine erste Challenge und fordere Freunde heraus!'
              : `Keine ${filter === 'active' ? 'aktiven' : filter === 'completed' ? 'abgeschlossenen' : 'deiner'} Challenges vorhanden.`
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Erste Challenge erstellen
            </button>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-gaming text-n64-green mb-1">
            {challenges.filter(c => c.status === 'active').length}
          </div>
          <div className="text-sm text-gray-400">Aktive Challenges</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-gaming text-n64-blue mb-1">
            {challenges.filter(c => c.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-400">Abgeschlossen</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-gaming text-n64-purple mb-1">
            {challenges.filter(c => c.creator.id === currentUser.id).length}
          </div>
          <div className="text-sm text-gray-400">Erstellt</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-gaming text-n64-yellow mb-1">
            {challenges.filter(c => c.participants.some(p => p.id === currentUser.id)).length}
          </div>
          <div className="text-sm text-gray-400">Teilgenommen</div>
        </div>
      </div>

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <CreateChallengeModal
          currentUser={currentUser}
          friends={friends}
          onClose={() => setShowCreateModal(false)}
          onCreateChallenge={(newChallenge) => {
            setChallenges([...challenges, newChallenge])
            setShowCreateModal(false)
          }}
        />
      )}
    </div>
  )
}

export default Challenges
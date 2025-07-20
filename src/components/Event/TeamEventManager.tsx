import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Plus, 
  UserPlus, 
  Crown, 
  Clock, 
  Trophy,
  Settings,
  LogOut,
  User,
  Shield,
  Edit,
  Check,
  X,
  Search,
  Filter
} from 'lucide-react'
import { useEvents } from '../../contexts/EventContext'
import { useUser } from '../../contexts/UserContext'
import { Team, TeamMember, GameEvent } from '../../types'
import SimpleCard from '../SimpleCard'
import SimpleButton from '../SimpleButton'

interface TeamEventManagerProps {
  event: GameEvent
  onTeamCreated?: (team: Team) => void
  onTeamJoined?: (team: Team) => void
}

const TeamEventManager: React.FC<TeamEventManagerProps> = ({
  event,
  onTeamCreated,
  onTeamJoined
}) => {
  const { user } = useUser()
  const { getEventTeams, getTeamMembers, createTeam, joinTeam, leaveTeam } = useEvents()
  
  const [teams, setTeams] = useState<Team[]>([])
  const [userTeam, setUserTeam] = useState<Team | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterFull, setFilterFull] = useState(false)
  
  // Form state
  const [teamName, setTeamName] = useState('')
  const [teamDescription, setTeamDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (event?.isTeamEvent) {
      const eventTeams = getEventTeams(event.id)
      setTeams(eventTeams)
      
      // Find user's current team
      const currentUserTeam = eventTeams.find(team => {
        const members = getTeamMembers(team.id)
        return members.some(member => member.userId === user?.id)
      })
      
      if (currentUserTeam) {
        setUserTeam(currentUserTeam)
        setTeamMembers(getTeamMembers(currentUserTeam.id))
      }
    }
  }, [event, user, getEventTeams, getTeamMembers])

  const handleCreateTeam = async () => {
    if (!teamName.trim() || !user) return
    
    setIsCreating(true)
    try {
      const newTeam = await createTeam(teamName.trim(), teamDescription.trim())
      setTeams(prev => [...prev, newTeam])
      setUserTeam(newTeam)
      setShowCreateForm(false)
      setTeamName('')
      setTeamDescription('')
      onTeamCreated?.(newTeam)
    } catch (error) {
      console.error('Failed to create team:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleJoinTeam = async (team: Team) => {
    if (!user || userTeam) return
    
    try {
      await joinTeam(team.id)
      setUserTeam(team)
      const members = getTeamMembers(team.id)
      setTeamMembers(members)
      onTeamJoined?.(team)
    } catch (error) {
      console.error('Failed to join team:', error)
    }
  }

  const handleLeaveTeam = async () => {
    if (!userTeam || !user) return
    
    try {
      await leaveTeam(userTeam.id)
      setUserTeam(null)
      setTeamMembers([])
    } catch (error) {
      console.error('Failed to leave team:', error)
    }
  }

  const filteredTeams = teams.filter(team => {
    const members = getTeamMembers(team.id)
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase())
    const isFull = members.length >= team.maxMembers
    
    if (filterFull && isFull) return false
    return matchesSearch
  })

  const getTeamLogo = (team: Team) => {
    // Generate a simple logo based on team name
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500']
    const colorIndex = team.name.length % colors.length
    
    return (
      <div className={`w-12 h-12 ${colors[colorIndex]} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
        {team.name.charAt(0).toUpperCase()}
      </div>
    )
  }

  if (!event?.isTeamEvent) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Team Events
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Bildet Teams von {event.minTeamSize || 2}-{event.maxTeamSize || 4} Spielern
          </p>
        </div>
        
        {!userTeam && (
          <SimpleButton
            variant="primary"
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Team erstellen
          </SimpleButton>
        )}
      </div>

      {/* User's Current Team */}
      {userTeam && (
        <SimpleCard className="p-6 bg-blue-900/20 border-blue-500/30">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              {getTeamLogo(userTeam)}
              <div>
                <h3 className="text-xl font-bold text-blue-300">{userTeam.name}</h3>
                {userTeam.description && (
                  <p className="text-gray-300 text-sm">{userTeam.description}</p>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  Erstellt am {userTeam.createdAt.toLocaleDateString('de-DE')}
                </div>
              </div>
            </div>
            
            <SimpleButton
              variant="danger"
              onClick={handleLeaveTeam}
              className="flex items-center gap-2 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Team verlassen
            </SimpleButton>
          </div>
          
          {/* Team Members */}
          <div className="space-y-2">
            <h4 className="font-medium text-white flex items-center gap-2">
              <Users className="w-4 h-4" />
              Mitglieder ({teamMembers.length}/{userTeam.maxMembers})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {teamMembers.map((member) => (
                <div 
                  key={member.userId}
                  className="flex items-center gap-3 p-2 bg-gray-800/30 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {member.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm">{member.username}</span>
                      {member.isLeader && (
                        <Crown className="w-4 h-4 text-yellow-400" title="Team Leader" />
                      )}
                      {member.userId === user?.id && (
                        <span className="text-xs text-blue-400">(Du)</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      Beigetreten: {member.joinedAt.toLocaleDateString('de-DE')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SimpleCard>
      )}

      {/* Create Team Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SimpleCard className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Neues Team erstellen</h3>
                <SimpleButton
                  variant="secondary"
                  onClick={() => setShowCreateForm(false)}
                  className="p-2"
                >
                  <X className="w-4 h-4" />
                </SimpleButton>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Gib deinem Team einen Namen..."
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none"
                    maxLength={30}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Beschreibung (optional)
                  </label>
                  <textarea
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                    placeholder="Beschreibe dein Team..."
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none resize-none"
                    maxLength={200}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <SimpleButton
                    variant="secondary"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Abbrechen
                  </SimpleButton>
                  <SimpleButton
                    variant="primary"
                    onClick={handleCreateTeam}
                    disabled={!teamName.trim() || isCreating}
                    className="flex items-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Settings className="w-4 h-4" />
                        </motion.div>
                        Erstelle...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Team erstellen
                      </>
                    )}
                  </SimpleButton>
                </div>
              </div>
            </SimpleCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available Teams */}
      {!userTeam && (
        <SimpleCard className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Verfügbare Teams</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Team suchen..."
                    className="pl-10 pr-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none text-sm"
                  />
                </div>
                <SimpleButton
                  variant="secondary"
                  onClick={() => setFilterFull(!filterFull)}
                  className={`flex items-center gap-2 text-sm ${filterFull ? 'bg-blue-600' : ''}`}
                >
                  <Filter className="w-4 h-4" />
                  Volle ausblenden
                </SimpleButton>
              </div>
            </div>
            
            {filteredTeams.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h4 className="text-lg font-semibold mb-2">Keine Teams gefunden</h4>
                <p className="text-sm">
                  {searchQuery ? 'Versuche einen anderen Suchbegriff.' : 'Erstelle das erste Team für dieses Event!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTeams.map((team) => {
                  const members = getTeamMembers(team.id)
                  const isFull = members.length >= team.maxMembers
                  const canJoin = !isFull && !userTeam
                  
                  return (
                    <motion.div
                      key={team.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`
                        p-4 border rounded-lg transition-all duration-300
                        ${isFull ? 
                          'bg-gray-800/30 border-gray-600/30' : 
                          'bg-gray-800/50 border-gray-600/50 hover:border-blue-500/50 hover:bg-gray-700/50'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {getTeamLogo(team)}
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{team.name}</h4>
                          {team.description && (
                            <p className="text-gray-300 text-sm mt-1">{team.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {members.length}/{team.maxMembers}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {team.createdAt.toLocaleDateString('de-DE')}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Team Members Preview */}
                      <div className="flex items-center gap-2 mb-3">
                        {members.slice(0, 3).map((member) => (
                          <div
                            key={member.userId}
                            className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            title={member.username}
                          >
                            {member.username.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {members.length > 3 && (
                          <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 text-xs">
                            +{members.length - 3}
                          </div>
                        )}
                      </div>
                      
                      <SimpleButton
                        variant={canJoin ? "primary" : "secondary"}
                        onClick={() => canJoin && handleJoinTeam(team)}
                        disabled={!canJoin}
                        className="w-full flex items-center justify-center gap-2 text-sm"
                      >
                        {isFull ? (
                          <>
                            <Shield className="w-4 h-4" />
                            Team voll
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            Beitreten
                          </>
                        )}
                      </SimpleButton>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </SimpleCard>
      )}

      {/* Team Event Info */}
      <SimpleCard className="p-4 bg-gray-800/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400">{teams.length}</div>
            <div className="text-xs text-gray-400">Teams</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {teams.reduce((acc, team) => acc + getTeamMembers(team.id).length, 0)}
            </div>
            <div className="text-xs text-gray-400">Spieler</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">
              {teams.filter(team => getTeamMembers(team.id).length >= team.maxMembers).length}
            </div>
            <div className="text-xs text-gray-400">Volle Teams</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">
              {event.maxTeamSize || 4}
            </div>
            <div className="text-xs text-gray-400">Max. Größe</div>
          </div>
        </div>
      </SimpleCard>
    </div>
  )
}

export default TeamEventManager
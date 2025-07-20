import React, { useState, useEffect } from 'react'
import { useEvents } from '../../contexts/EventContext'
import { useUser } from '../../contexts/UserContext'
import { EventTeam } from '../../types'
import { Users, Plus, UserMinus, Crown, X } from 'lucide-react'

interface TeamManagerProps {
  eventId: string
}

const TeamManager: React.FC<TeamManagerProps> = ({ eventId }) => {
  const { 
    getTeamsByEvent, 
    getUserTeamForEvent, 
    createTeam, 
    joinTeam, 
    leaveTeam 
  } = useEvents()
  const { user } = useUser()
  const [availableTeams, setAvailableTeams] = useState<EventTeam[]>([])
  const [userTeam, setUserTeam] = useState<EventTeam | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')

  useEffect(() => {
    if (user) {
      const teams = getTeamsByEvent(eventId)
      setAvailableTeams(teams.filter(team => team.memberIds.length < 4))
      setUserTeam(getUserTeamForEvent(eventId))
    }
  }, [eventId, user, getTeamsByEvent, getUserTeamForEvent])

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTeamName.trim() || !user) return

    createTeam(eventId, newTeamName.trim())
    setNewTeamName('')
    setShowCreateForm(false)
    
    // Refresh data
    setTimeout(() => {
      const teams = getTeamsByEvent(eventId)
      setAvailableTeams(teams.filter(team => team.memberIds.length < 4))
      setUserTeam(getUserTeamForEvent(eventId))
    }, 100)
  }

  const handleJoinTeam = (teamId: string) => {
    joinTeam(teamId)
    
    // Refresh data
    setTimeout(() => {
      const teams = getTeamsByEvent(eventId)
      setAvailableTeams(teams.filter(team => team.memberIds.length < 4))
      setUserTeam(getUserTeamForEvent(eventId))
    }, 100)
  }

  const handleLeaveTeam = (teamId: string) => {
    leaveTeam(teamId)
    
    // Refresh data
    setTimeout(() => {
      const teams = getTeamsByEvent(eventId)
      setAvailableTeams(teams.filter(team => team.memberIds.length < 4))
      setUserTeam(getUserTeamForEvent(eventId))
    }, 100)
  }

  if (!user) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-100 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Team-Management
        </h3>
      </div>

      {userTeam ? (
        // User is in a team
        <div className="p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-slate-100 flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-400" />
              {userTeam.name}
            </h4>
            <button
              onClick={() => handleLeaveTeam(userTeam.id)}
              className="text-red-400 hover:text-red-300 transition-colors"
              title="Team verlassen"
            >
              <UserMinus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-slate-400">Mitglieder ({userTeam.members.length}/4):</div>
            <div className="flex flex-wrap gap-2">
              {userTeam.members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-1 px-2 py-1 bg-slate-700 rounded-lg text-sm"
                >
                  {userTeam.createdBy === userTeam.memberIds[index] && (
                    <Crown className="w-3 h-3 text-yellow-400" />
                  )}
                  <span className="text-slate-200">{member}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // User is not in a team
        <div className="space-y-4">
          {/* Create Team */}
          <div className="p-4 bg-slate-800 border border-slate-600 rounded-lg">
            {!showCreateForm ? (
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Neues Team erstellen</span>
              </button>
            ) : (
              <form onSubmit={handleCreateTeam} className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-200">Team-Name:</label>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="text-slate-400 hover:text-slate-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="z.B. Speedrun Champions"
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-400"
                    maxLength={30}
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Erstellen
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Available Teams */}
          {availableTeams.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-slate-200">Verfügbare Teams:</h4>
              <div className="space-y-2">
                {availableTeams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between p-3 bg-slate-800 border border-slate-600 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-slate-100">{team.name}</div>
                      <div className="text-sm text-slate-400">
                        {team.members.length}/4 Mitglieder
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {team.members.map((member, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded"
                          >
                            {team.createdBy === team.memberIds[index] && '👑 '}{member}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoinTeam(team.id)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Beitreten
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {availableTeams.length === 0 && !showCreateForm && (
            <div className="text-center py-6 text-slate-400">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Keine verfügbaren Teams gefunden</p>
              <p className="text-sm">Erstelle ein neues Team oder warte auf andere Spieler</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TeamManager
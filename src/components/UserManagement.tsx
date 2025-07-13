import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Ban, 
  CheckCircle, 
  UserCheck,
  Download,
  Trash2,
  Edit,
  Eye
} from 'lucide-react'

interface User {
  id: string
  username: string
  email: string
  status: 'active' | 'banned' | 'verified'
  points: number
  medals: number
  lastActivity: string
  joinDate: string
  role: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)

  useEffect(() => {
    // Simulate loading users
    const loadUsers = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUsers([
        {
          id: '1',
          username: 'PixelMaster',
          email: 'pixel@example.com',
          status: 'active',
          points: 1250,
          medals: 3,
          lastActivity: '2 min',
          joinDate: '2024-01-15',
          role: 'User'
        },
        {
          id: '2',
          username: 'RetroGamer',
          email: 'retro@example.com',
          status: 'verified',
          points: 890,
          medals: 2,
          lastActivity: '1h',
          joinDate: '2024-02-01',
          role: 'User'
        },
        {
          id: '3',
          username: 'TroubleMaker',
          email: 'trouble@example.com',
          status: 'banned',
          points: 0,
          medals: 0,
          lastActivity: '3d',
          joinDate: '2024-01-20',
          role: 'User'
        },
        {
          id: '4',
          username: 'GoldenEyePro',
          email: 'golden@example.com',
          status: 'active',
          points: 2100,
          medals: 5,
          lastActivity: '30 min',
          joinDate: '2023-12-10',
          role: 'User'
        }
      ])
    }
    
    loadUsers()
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleUserAction = (action: string, userId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        switch (action) {
          case 'ban':
            return { ...user, status: 'banned' as const }
          case 'unban':
            return { ...user, status: 'active' as const }
          case 'verify':
            return { ...user, status: 'verified' as const }
          default:
            return user
        }
      }
      return user
    }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-retro-green" />
      case 'banned':
        return <Ban className="w-4 h-4 text-retro-red" />
      case 'verified':
        return <UserCheck className="w-4 h-4 text-retro-blue" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-retro text-retro-green">Nutzerkontrolle</h1>
          <p className="text-retro-blue font-pixel">Verwaltung aller Battle64 Nutzer</p>
        </div>
        <div className="flex space-x-4">
          <button className="admin-button">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="admin-button">
            <UserCheck className="w-4 h-4 mr-2" />
            Bulk Actions
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-retro-light-gray w-4 h-4" />
              <input
                type="text"
                placeholder="Nach Nutzername oder E-Mail suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-input w-full pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-input"
            >
              <option value="all">Alle Status</option>
              <option value="active">Aktiv</option>
              <option value="banned">Gesperrt</option>
              <option value="verified">Verifiziert</option>
            </select>
            <button className="admin-button">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-card">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nutzer</th>
                <th>Status</th>
                <th>Punkte</th>
                <th>Medaillen</th>
                <th>Letzte Aktivität</th>
                <th>Beitrittsdatum</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div>
                      <div className="font-bold text-retro-green">{user.username}</div>
                      <div className="text-sm text-retro-light-gray">{user.email}</div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center">
                      {getStatusIcon(user.status)}
                      <span className="ml-2 capitalize">{user.status}</span>
                    </div>
                  </td>
                  <td className="text-retro-yellow font-bold">{user.points.toLocaleString()}</td>
                  <td className="text-retro-blue font-bold">{user.medals}</td>
                  <td className="text-retro-light-gray">{user.lastActivity}</td>
                  <td className="text-retro-light-gray">{user.joinDate}</td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowUserModal(true)
                        }}
                        className="text-retro-blue hover:text-blue-400"
                        title="Details anzeigen"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction(user.status === 'banned' ? 'unban' : 'ban', user.id)}
                        className={user.status === 'banned' ? 'text-retro-green hover:text-green-400' : 'text-retro-red hover:text-red-400'}
                        title={user.status === 'banned' ? 'Entsperren' : 'Sperren'}
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction('verify', user.id)}
                        className="text-retro-blue hover:text-blue-400"
                        title="Verifizieren"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                      <button className="text-retro-light-gray hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="admin-card w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-retro text-retro-green">Nutzerdetails</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-retro-light-gray hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-retro-light-gray text-sm">Benutzername</label>
                <div className="text-retro-green font-bold">{selectedUser.username}</div>
              </div>
              <div>
                <label className="block text-retro-light-gray text-sm">E-Mail</label>
                <div className="text-retro-green">{selectedUser.email}</div>
              </div>
              <div>
                <label className="block text-retro-light-gray text-sm">Status</label>
                <div className="flex items-center">
                  {getStatusIcon(selectedUser.status)}
                  <span className="ml-2 capitalize">{selectedUser.status}</span>
                </div>
              </div>
              <div>
                <label className="block text-retro-light-gray text-sm">Punkte</label>
                <div className="text-retro-yellow font-bold">{selectedUser.points.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button className="admin-button">
                <Edit className="w-4 h-4 mr-2" />
                Bearbeiten
              </button>
              <button className="admin-button-danger">
                <Trash2 className="w-4 h-4 mr-2" />
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
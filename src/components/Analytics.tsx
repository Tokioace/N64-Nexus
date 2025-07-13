import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Activity,
  Target
} from 'lucide-react'

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('week')

  const stats = {
    activeUsers: {
      today: 1247,
      week: 8923,
      month: 45678
    },
    popularGames: [
      { name: 'Mario Kart 64', players: 234, events: 12 },
      { name: 'GoldenEye 007', players: 189, events: 8 },
      { name: 'Super Mario 64', players: 156, events: 6 },
      { name: 'Zelda: OoT', players: 134, events: 4 }
    ],
    uploadStats: {
      fanart: 156,
      screenshots: 89,
      comments: 445
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-retro text-retro-green">Analytics & Insights</h1>
          <p className="text-retro-blue font-pixel">Detaillierte Statistiken und Nutzerdaten</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="admin-input"
        >
          <option value="today">Heute</option>
          <option value="week">Diese Woche</option>
          <option value="month">Dieser Monat</option>
        </select>
      </div>

      {/* User Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-retro text-retro-green">Aktive Nutzer</h3>
            <Users className="w-6 h-6 text-retro-green" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-retro-green mb-2">
              {stats.activeUsers[timeRange as keyof typeof stats.activeUsers]?.toLocaleString()}
            </div>
            <p className="text-retro-blue font-pixel">Aktive Nutzer</p>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-retro text-retro-green">Wachstum</h3>
            <TrendingUp className="w-6 h-6 text-retro-green" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-retro-green mb-2">+12.5%</div>
            <p className="text-retro-blue font-pixel">Im Vergleich zur letzten Periode</p>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-retro text-retro-green">Engagement</h3>
            <Activity className="w-6 h-6 text-retro-green" />
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-retro-green mb-2">89%</div>
            <p className="text-retro-blue font-pixel">Durchschnittliche Aktivität</p>
          </div>
        </div>
      </div>

      {/* Popular Games */}
      <div className="admin-card">
        <h3 className="text-lg font-retro text-retro-green mb-6">Beliebteste Spiele</h3>
        <div className="space-y-4">
          {stats.popularGames.map((game, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-retro-light-gray rounded">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-retro-green rounded flex items-center justify-center">
                  <span className="text-retro-dark font-bold">{index + 1}</span>
                </div>
                <div>
                  <div className="text-retro-green font-bold">{game.name}</div>
                  <div className="text-sm text-retro-light-gray">{game.events} Events</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-retro-yellow font-bold">{game.players} Spieler</div>
                <div className="text-sm text-retro-light-gray">Aktiv</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card">
          <h3 className="text-lg font-retro text-retro-green mb-6">Upload-Statistiken</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-retro-light-gray rounded">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-retro-green rounded-full"></div>
                <span className="text-retro-green">Fanart</span>
              </div>
              <span className="text-retro-yellow font-bold">{stats.uploadStats.fanart}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-retro-light-gray rounded">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-retro-blue rounded-full"></div>
                <span className="text-retro-blue">Screenshots</span>
              </div>
              <span className="text-retro-yellow font-bold">{stats.uploadStats.screenshots}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-retro-light-gray rounded">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-retro-purple rounded-full"></div>
                <span className="text-retro-purple">Kommentare</span>
              </div>
              <span className="text-retro-yellow font-bold">{stats.uploadStats.comments}</span>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3 className="text-lg font-retro text-retro-green mb-6">Top Teams</h3>
          <div className="space-y-4">
            {[
              { name: 'Speed Demons', members: 45, points: 12500 },
              { name: 'Retro Warriors', members: 38, points: 10800 },
              { name: 'Pixel Masters', members: 32, points: 8900 },
              { name: 'Golden Eye Elite', members: 28, points: 7600 }
            ].map((team, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-retro-light-gray rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-retro-green rounded flex items-center justify-center">
                    <span className="text-retro-dark font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <div className="text-retro-green font-bold">{team.name}</div>
                    <div className="text-sm text-retro-light-gray">{team.members} Mitglieder</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-retro-yellow font-bold">{team.points.toLocaleString()}</div>
                  <div className="text-sm text-retro-light-gray">Punkte</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-card">
        <h3 className="text-lg font-retro text-retro-green mb-6">Neue Nutzer (mit Aktivitätslevel)</h3>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nutzer</th>
                <th>Beitrittsdatum</th>
                <th>Aktivitätslevel</th>
                <th>Punkte</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'NewPlayer1', joinDate: '2024-03-15', activity: 'High', points: 150, status: 'Active' },
                { name: 'RetroFan2024', joinDate: '2024-03-14', activity: 'Medium', points: 75, status: 'Active' },
                { name: 'GamingPro', joinDate: '2024-03-13', activity: 'Low', points: 25, status: 'Inactive' }
              ].map((user, index) => (
                <tr key={index}>
                  <td className="text-retro-green font-bold">{user.name}</td>
                  <td className="text-retro-light-gray">{user.joinDate}</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.activity === 'High' ? 'bg-retro-green text-retro-dark' :
                      user.activity === 'Medium' ? 'bg-retro-yellow text-retro-dark' :
                      'bg-retro-red text-white'
                    }`}>
                      {user.activity}
                    </span>
                  </td>
                  <td className="text-retro-yellow font-bold">{user.points}</td>
                  <td className="text-retro-blue">{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
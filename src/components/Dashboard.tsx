import { useState, useEffect } from 'react'
import { 
  Users, 
  Calendar, 
  Trophy, 
  Shield, 
  TrendingUp, 
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface DashboardStats {
  activeUsers: number
  totalEvents: number
  totalPoints: number
  pendingReports: number
  todayUploads: number
  weeklyGrowth: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    activeUsers: 0,
    totalEvents: 0,
    totalPoints: 0,
    pendingReports: 0,
    todayUploads: 0,
    weeklyGrowth: 0
  })

  useEffect(() => {
    // Simulate loading stats
    const loadStats = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStats({
        activeUsers: 1247,
        totalEvents: 89,
        totalPoints: 456789,
        pendingReports: 23,
        todayUploads: 156,
        weeklyGrowth: 12.5
      })
    }
    
    loadStats()
  }, [])

  const statCards = [
    {
      title: 'Aktive Nutzer',
      value: stats.activeUsers.toLocaleString(),
      icon: Users,
      color: 'text-retro-green',
      bgColor: 'bg-retro-green bg-opacity-10'
    },
    {
      title: 'Events Gesamt',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'text-retro-blue',
      bgColor: 'bg-retro-blue bg-opacity-10'
    },
    {
      title: 'Punkte Gesamt',
      value: stats.totalPoints.toLocaleString(),
      icon: Trophy,
      color: 'text-retro-yellow',
      bgColor: 'bg-retro-yellow bg-opacity-10'
    },
    {
      title: 'Offene Meldungen',
      value: stats.pendingReports,
      icon: Shield,
      color: 'text-retro-red',
      bgColor: 'bg-retro-red bg-opacity-10'
    }
  ]

  const recentActivities = [
    { id: 1, type: 'user', message: 'Neuer Nutzer "PixelMaster" registriert', time: '2 min', status: 'success' },
    { id: 2, type: 'event', message: 'Event "Mario Kart 64 Championship" gestartet', time: '15 min', status: 'success' },
    { id: 3, type: 'report', message: 'Content-Meldung für Screenshot #1234', time: '1h', status: 'warning' },
    { id: 4, type: 'points', message: 'Punktevergabe für Event "GoldenEye Tournament"', time: '2h', status: 'success' },
    { id: 5, type: 'system', message: 'System-Update v1.3.2 erfolgreich', time: '4h', status: 'success' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-retro text-retro-green">Dashboard</h1>
          <p className="text-retro-blue font-pixel">Willkommen in der Battle64 Steuerzentrale</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-retro-light-gray">Letzte Aktualisierung</div>
          <div className="text-retro-green font-pixel">{new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="admin-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-retro-light-gray font-pixel">{card.title}</p>
                <p className="text-2xl font-bold text-retro-green">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Growth & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card">
          <h3 className="text-lg font-retro text-retro-green mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Wochenwachstum
          </h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-retro-green mb-2">
              +{stats.weeklyGrowth}%
            </div>
            <p className="text-retro-blue font-pixel">Aktive Nutzer diese Woche</p>
          </div>
        </div>

        <div className="admin-card">
          <h3 className="text-lg font-retro text-retro-green mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Heutige Uploads
          </h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-retro-green mb-2">
              {stats.todayUploads}
            </div>
            <p className="text-retro-blue font-pixel">Fanart & Screenshots</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-card">
        <h3 className="text-lg font-retro text-retro-green mb-4">Letzte Aktivitäten</h3>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-retro-light-gray rounded">
              <div className="flex items-center">
                {activity.status === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-retro-green mr-3" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-retro-yellow mr-3" />
                )}
                <span className="text-retro-green font-pixel">{activity.message}</span>
              </div>
              <span className="text-sm text-retro-light-gray font-pixel">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <h3 className="text-lg font-retro text-retro-green mb-4">Schnellaktionen</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="admin-button py-3">
            <Users className="w-5 h-5 mr-2 inline" />
            Nutzer verwalten
          </button>
          <button className="admin-button py-3">
            <Calendar className="w-5 h-5 mr-2 inline" />
            Event erstellen
          </button>
          <button className="admin-button py-3">
            <Shield className="w-5 h-5 mr-2 inline" />
            Meldungen prüfen
          </button>
          <button className="admin-button py-3">
            <Trophy className="w-5 h-5 mr-2 inline" />
            Punkte vergeben
          </button>
        </div>
      </div>
    </div>
  )
}
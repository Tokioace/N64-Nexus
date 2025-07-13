import { useState } from 'react'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Eye,
  MessageSquare,
  Image,
  User
} from 'lucide-react'

export default function ContentModeration() {
  const [activeTab, setActiveTab] = useState('reports')

  const reports = [
    {
      id: '1',
      type: 'comment',
      content: 'Das ist ein beleidigender Kommentar...',
      user: 'TroubleMaker',
      reporter: 'PixelMaster',
      status: 'pending',
      timestamp: '2 min'
    },
    {
      id: '2',
      type: 'fanart',
      content: 'Inappropriate fanart content',
      user: 'BadArtist',
      reporter: 'CommunityMod',
      status: 'pending',
      timestamp: '1h'
    },
    {
      id: '3',
      type: 'screenshot',
      content: 'Screenshot with inappropriate content',
      user: 'ScreenshotUser',
      reporter: 'Admin',
      status: 'resolved',
      timestamp: '3h'
    }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageSquare className="w-4 h-4" />
      case 'fanart': return <Image className="w-4 h-4" />
      case 'screenshot': return <Image className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-retro text-retro-green">Content-Moderation</h1>
        <p className="text-retro-blue font-pixel">Verwaltung von gemeldeten Inhalten und Verstößen</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-retro-light-gray">Offene Meldungen</p>
              <p className="text-2xl font-bold text-retro-red">23</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-retro-red" />
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-retro-light-gray">Heute gelöst</p>
              <p className="text-2xl font-bold text-retro-green">12</p>
            </div>
            <CheckCircle className="w-8 h-8 text-retro-green" />
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-retro-light-gray">Top Melder</p>
              <p className="text-2xl font-bold text-retro-blue">PixelMaster</p>
            </div>
            <User className="w-8 h-8 text-retro-blue" />
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-retro-light-gray">Meistgemeldet</p>
              <p className="text-2xl font-bold text-retro-yellow">TroubleMaker</p>
            </div>
            <Shield className="w-8 h-8 text-retro-yellow" />
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="admin-card">
        <h3 className="text-lg font-retro text-retro-green mb-6">Gemeldete Inhalte</h3>
        
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-retro-light-gray p-4 rounded">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(report.type)}
                    <span className="text-retro-green font-bold capitalize">{report.type}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-retro-green mb-2">{report.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-retro-light-gray">
                      <span>Von: {report.user}</span>
                      <span>Gemeldet von: {report.reporter}</span>
                      <span>{report.timestamp}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-retro-blue hover:text-blue-400" title="Anzeigen">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-retro-green hover:text-green-400" title="Genehmigen">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button className="text-retro-red hover:text-red-400" title="Löschen">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
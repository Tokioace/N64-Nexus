import { useState } from 'react'
import { 
  Trophy, 
  Medal, 
  Crown, 
  Plus, 
  Edit, 
  Trash2,
  Award,
  Star
} from 'lucide-react'

export default function PointsSystem() {
  const [activeTab, setActiveTab] = useState('points')

  const tabs = [
    { id: 'points', name: 'Punktevergabe', icon: Trophy },
    { id: 'medals', name: 'Medaillen', icon: Medal },
    { id: 'titles', name: 'Titel', icon: Crown },
    { id: 'levels', name: 'Level-System', icon: Star }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-retro text-retro-green">Punktesystem & Ränge</h1>
        <p className="text-retro-blue font-pixel">Verwaltung von Punkten, Medaillen und Titeln</p>
      </div>

      {/* Tabs */}
      <div className="admin-card">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded font-pixel transition-colors ${
                activeTab === tab.id
                  ? 'bg-retro-green text-retro-dark'
                  : 'text-retro-green hover:bg-retro-light-gray'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'points' && (
        <div className="admin-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-retro text-retro-green">Manuelle Punktevergabe</h3>
            <button className="admin-button">
              <Plus className="w-4 h-4 mr-2" />
              Punkte vergeben
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-retro-light-gray p-4 rounded">
              <h4 className="text-retro-green font-bold mb-2">Event-Gewinner</h4>
              <p className="text-retro-light-gray text-sm">1. Platz: 100 Punkte</p>
              <p className="text-retro-light-gray text-sm">2. Platz: 50 Punkte</p>
              <p className="text-retro-light-gray text-sm">3. Platz: 25 Punkte</p>
            </div>
            <div className="bg-retro-light-gray p-4 rounded">
              <h4 className="text-retro-green font-bold mb-2">Spezial-Events</h4>
              <p className="text-retro-light-gray text-sm">Bonus-Punkte für besondere Leistungen</p>
              <p className="text-retro-light-gray text-sm">Community-Events: +20 Punkte</p>
            </div>
            <div className="bg-retro-light-gray p-4 rounded">
              <h4 className="text-retro-green font-bold mb-2">Tägliche Aktivität</h4>
              <p className="text-retro-light-gray text-sm">Login: 5 Punkte</p>
              <p className="text-retro-light-gray text-sm">Upload: 10 Punkte</p>
              <p className="text-retro-light-gray text-sm">Kommentar: 2 Punkte</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'medals' && (
        <div className="admin-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-retro text-retro-green">Medaillen-Verwaltung</h3>
            <button className="admin-button">
              <Plus className="w-4 h-4 mr-2" />
              Medaille erstellen
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Goldener Sieger', color: 'text-yellow-400', icon: '🥇' },
              { name: 'Silberner Runner-Up', color: 'text-gray-400', icon: '🥈' },
              { name: 'Bronze Bronze', color: 'text-yellow-600', icon: '🥉' },
              { name: 'Community Hero', color: 'text-retro-blue', icon: '⭐' },
              { name: 'Speed Demon', color: 'text-retro-green', icon: '⚡' },
              { name: 'Veteran', color: 'text-retro-purple', icon: '👑' }
            ].map((medal, index) => (
              <div key={index} className="bg-retro-light-gray p-4 rounded flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{medal.icon}</span>
                  <div>
                    <div className={`font-bold ${medal.color}`}>{medal.name}</div>
                    <div className="text-sm text-retro-light-gray">0 Nutzer</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-retro-blue hover:text-blue-400">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-retro-red hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'titles' && (
        <div className="admin-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-retro text-retro-green">Titel-Verwaltung</h3>
            <button className="admin-button">
              <Plus className="w-4 h-4 mr-2" />
              Titel erstellen
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Golden Collector', requirement: '1000 Punkte', color: 'text-yellow-400' },
              { name: 'Speed Master', requirement: '50 Rennen gewonnen', color: 'text-retro-green' },
              { name: 'Community Leader', requirement: '100 Kommentare', color: 'text-retro-blue' },
              { name: 'Veteran Player', requirement: '1 Jahr Mitglied', color: 'text-retro-purple' }
            ].map((title, index) => (
              <div key={index} className="bg-retro-light-gray p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-bold ${title.color}`}>{title.name}</h4>
                  <div className="flex space-x-2">
                    <button className="text-retro-blue hover:text-blue-400">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-retro-red hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-retro-light-gray">Voraussetzung: {title.requirement}</p>
                <p className="text-sm text-retro-light-gray">0 Nutzer haben diesen Titel</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'levels' && (
        <div className="admin-card">
          <h3 className="text-lg font-retro text-retro-green mb-6">XP-Kurven & Level-System</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-retro-green font-bold mb-4">Level-Übersicht</h4>
              <div className="space-y-2">
                {[
                  { level: 1, xp: 0, title: 'Neuling' },
                  { level: 5, xp: 100, title: 'Anfänger' },
                  { level: 10, xp: 500, title: 'Fortgeschritten' },
                  { level: 20, xp: 2000, title: 'Experte' },
                  { level: 50, xp: 10000, title: 'Meister' },
                  { level: 100, xp: 50000, title: 'Legende' }
                ].map((lvl, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-retro-light-gray rounded">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-retro-yellow mr-2" />
                      <span className="text-retro-green font-bold">Level {lvl.level}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-retro-light-gray">{lvl.xp.toLocaleString()} XP</div>
                      <div className="text-xs text-retro-blue">{lvl.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-retro-green font-bold mb-4">XP-Verteilung</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-retro-light-gray rounded">
                  <span className="text-retro-green">Event-Teilnahme</span>
                  <span className="text-retro-yellow font-bold">+25 XP</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-retro-light-gray rounded">
                  <span className="text-retro-green">Event-Sieg</span>
                  <span className="text-retro-yellow font-bold">+100 XP</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-retro-light-gray rounded">
                  <span className="text-retro-green">Fanart-Upload</span>
                  <span className="text-retro-yellow font-bold">+15 XP</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-retro-light-gray rounded">
                  <span className="text-retro-green">Täglicher Login</span>
                  <span className="text-retro-yellow font-bold">+5 XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
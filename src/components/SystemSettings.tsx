import { useState } from 'react'
import { 
  Settings, 
  Palette, 
  Volume2, 
  Wrench, 
  Shield,
  Database,
  Globe,
  Bell
} from 'lucide-react'

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', name: 'Allgemein', icon: Settings },
    { id: 'appearance', name: 'Erscheinung', icon: Palette },
    { id: 'features', name: 'Features', icon: Wrench },
    { id: 'privacy', name: 'Datenschutz', icon: Shield },
    { id: 'maintenance', name: 'Wartung', icon: Database }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-retro text-retro-green">Systemeinstellungen</h1>
        <p className="text-retro-blue font-pixel">Konfiguration der Battle64 Plattform</p>
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

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="admin-card">
          <h3 className="text-lg font-retro text-retro-green mb-6">Allgemeine Einstellungen</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-retro-light-gray text-sm mb-2">App-Version</label>
              <div className="text-retro-green font-bold">Battle64 v1.3.2</div>
            </div>
            <div>
              <label className="block text-retro-light-gray text-sm mb-2">Letztes Update</label>
              <div className="text-retro-green">2024-03-15 14:30</div>
            </div>
            <div>
              <label className="block text-retro-light-gray text-sm mb-2">Zeitzone</label>
              <select className="admin-input w-full">
                <option>Europe/Berlin (UTC+1)</option>
                <option>UTC</option>
                <option>America/New_York</option>
              </select>
            </div>
            <div>
              <label className="block text-retro-light-gray text-sm mb-2">Sprache</label>
              <select className="admin-input w-full">
                <option>Deutsch</option>
                <option>English</option>
                <option>Français</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Appearance Settings */}
      {activeTab === 'appearance' && (
        <div className="admin-card">
          <h3 className="text-lg font-retro text-retro-green mb-6">Erscheinung & Design</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-retro-light-gray text-sm mb-2">Hauptfarbe</label>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-retro-green rounded border-2 border-white"></div>
                <div className="w-8 h-8 bg-retro-blue rounded"></div>
                <div className="w-8 h-8 bg-retro-purple rounded"></div>
                <div className="w-8 h-8 bg-retro-orange rounded"></div>
              </div>
            </div>
            <div>
              <label className="block text-retro-light-gray text-sm mb-2">Animationen</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-retro-green">Aktiviert</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-retro-light-gray text-sm mb-2">Sounds</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-retro-green">Aktiviert</span>
                </label>
                <Volume2 className="w-4 h-4 text-retro-light-gray" />
              </div>
            </div>
            <div>
              <label className="block text-retro-light-gray text-sm mb-2">Pixel-Art Modus</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-retro-green">Aktiviert</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Toggles */}
      {activeTab === 'features' && (
        <div className="admin-card">
          <h3 className="text-lg font-retro text-retro-green mb-6">Feature-Toggles</h3>
          
          <div className="space-y-4">
            {[
              { name: 'Livestreaming', description: 'Live-Streaming von Events', enabled: true },
              { name: 'Chat-System', description: 'Globaler Chat für alle Nutzer', enabled: true },
              { name: 'Fanart-Galerie', description: 'Upload und Anzeige von Fanart', enabled: true },
              { name: 'Team-System', description: 'Team-Erstellung und -Verwaltung', enabled: false },
              { name: 'Achievement-System', description: 'Erfolge und Badges', enabled: true },
              { name: 'Tournament-Brackets', description: 'Automatische Turnier-Brackets', enabled: false }
            ].map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-retro-light-gray rounded">
                <div>
                  <div className="text-retro-green font-bold">{feature.name}</div>
                  <div className="text-sm text-retro-light-gray">{feature.description}</div>
                </div>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2" 
                    defaultChecked={feature.enabled}
                  />
                  <span className="text-retro-green">{feature.enabled ? 'Aktiv' : 'Inaktiv'}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privacy Settings */}
      {activeTab === 'privacy' && (
        <div className="admin-card">
          <h3 className="text-lg font-retro text-retro-green mb-6">Datenschutz & DSGVO</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-retro-green font-bold mb-3">DSGVO-Funktionen</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="admin-button">
                  <Database className="w-4 h-4 mr-2" />
                  Nutzerdaten exportieren
                </button>
                <button className="admin-button-danger">
                  <Shield className="w-4 h-4 mr-2" />
                  Account löschen
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-retro-green font-bold mb-3">Datenschutz-Einstellungen</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-retro-green">Analytics aktiviert</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-retro-green">Cookies akzeptieren</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-retro-green">Dritte-Party-Tracking</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Settings */}
      {activeTab === 'maintenance' && (
        <div className="admin-card">
          <h3 className="text-lg font-retro text-retro-green mb-6">Wartung & System</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-retro-green font-bold mb-3">Wartungsmodus</h4>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-retro-green">Wartungsmodus aktivieren</span>
                </label>
                <button className="admin-button">
                  <Wrench className="w-4 h-4 mr-2" />
                  Jetzt aktivieren
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-retro-green font-bold mb-3">System-Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-retro-light-gray p-4 rounded">
                  <div className="text-retro-green font-bold">Datenbank</div>
                  <div className="text-retro-light-gray">Status: Online</div>
                  <div className="text-retro-light-gray">Latenz: 12ms</div>
                </div>
                <div className="bg-retro-light-gray p-4 rounded">
                  <div className="text-retro-green font-bold">API</div>
                  <div className="text-retro-light-gray">Status: Online</div>
                  <div className="text-retro-light-gray">Uptime: 99.9%</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-retro-green font-bold mb-3">Backup & Wiederherstellung</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="admin-button">
                  <Database className="w-4 h-4 mr-2" />
                  Backup erstellen
                </button>
                <button className="admin-button">
                  <Globe className="w-4 h-4 mr-2" />
                  System wiederherstellen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
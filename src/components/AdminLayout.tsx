import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Trophy, 
  Shield, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, permission: 'all' },
  { name: 'Nutzerkontrolle', href: '/users', icon: Users, permission: 'users' },
  { name: 'Eventverwaltung', href: '/events', icon: Calendar, permission: 'events' },
  { name: 'Punktesystem', href: '/points', icon: Trophy, permission: 'points' },
  { name: 'Content-Moderation', href: '/moderation', icon: Shield, permission: 'moderation' },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, permission: 'analytics' },
  { name: 'Systemeinstellungen', href: '/settings', icon: Settings, permission: 'settings' },
]

export default function AdminLayout() {
  const { user, logout, hasPermission } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const filteredNavigation = navigation.filter(item => hasPermission(item.permission))

  return (
    <div className="min-h-screen bg-retro-dark">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-retro-gray border-r border-retro-light-gray">
          <div className="flex items-center justify-between p-4 border-b border-retro-light-gray">
            <h1 className="text-xl font-retro text-retro-green">BATTLE64</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-retro-green hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="mt-4">
            {filteredNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-retro-green text-retro-dark'
                      : 'text-retro-green hover:bg-retro-light-gray hover:text-white'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-retro-gray border-r border-retro-light-gray">
          <div className="flex items-center h-16 px-4 border-b border-retro-light-gray">
            <h1 className="text-xl font-retro text-retro-green">BATTLE64</h1>
          </div>
          <nav className="flex-1 mt-4">
            {filteredNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-retro-green text-retro-dark'
                      : 'text-retro-green hover:bg-retro-light-gray hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-retro-gray border-b border-retro-light-gray">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-retro-green hover:text-white mr-4"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-retro text-retro-green">
                {filteredNavigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-retro-green">
                <span className="font-bold">{user?.username}</span>
                <span className="ml-2 text-retro-blue">({user?.role})</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center text-retro-red hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
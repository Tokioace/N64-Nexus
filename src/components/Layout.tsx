import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Plus, 
  List, 
  Home, 
  Settings, 
  Trophy,
  Gamepad2
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/events', label: 'Events', icon: List },
    { path: '/events/new', label: 'Neues Event', icon: Plus },
  ];

  return (
    <div className="min-h-screen bg-retro-black">
      {/* Header */}
      <header className="bg-n64-dark border-b-2 border-n64-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Gamepad2 className="h-8 w-8 text-n64-red" />
              <h1 className="text-xl font-pixel text-n64-red text-shadow">
                Battle64 Event Builder
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-retro-gray text-sm">Admin Panel</span>
              <Settings className="h-5 w-5 text-retro-gray hover:text-n64-blue cursor-pointer" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-n64-dark border-r-2 border-n64-gray min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-n64-red text-white border-2 border-red-400'
                          : 'text-retro-gray hover:bg-n64-gray hover:text-retro-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-retro">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
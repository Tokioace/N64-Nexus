'use client';

import React from 'react';
import { useAdminStore } from '../store/adminStore';
import { 
  FileText, 
  Shield, 
  Users, 
  Flag, 
  Settings, 
  Crown,
  BarChart3
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentAdmin } = useAdminStore();

  const navigationItems = [
    {
      id: 'posts',
      label: 'Posts',
      icon: FileText,
      description: 'Admin-Posts verwalten',
      permission: 'posts'
    },
    {
      id: 'moderation',
      label: 'Moderation',
      icon: Shield,
      description: 'Inhalte moderieren',
      permission: 'moderation'
    },
    {
      id: 'users',
      label: 'Benutzer',
      icon: Users,
      description: 'Benutzer verwalten',
      permission: 'users'
    },
    {
      id: 'reports',
      label: 'Meldungen',
      icon: Flag,
      description: 'Meldungen bearbeiten',
      permission: 'moderation'
    },
    {
      id: 'settings',
      label: 'Einstellungen',
      icon: Settings,
      description: 'System-Einstellungen',
      permission: 'settings'
    }
  ];

  const hasPermission = (permission: string) => {
    return currentAdmin?.permissions?.includes(permission) || currentAdmin?.role === 'admin';
  };

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-battle64-600 rounded-lg flex items-center justify-center">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Battle64</h2>
            <p className="text-xs text-gray-500">Admin Tool</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          if (!hasPermission(item.permission)) return null;
          
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                isActive
                  ? 'bg-battle64-100 text-battle64-700 border-r-2 border-battle64-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-battle64-600' : 'text-gray-400'}`} />
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Schnellübersicht</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Offene Meldungen</span>
            <span className="font-medium text-red-600">12</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Entwürfe</span>
            <span className="font-medium text-yellow-600">3</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Geplante Posts</span>
            <span className="font-medium text-blue-600">5</span>
          </div>
        </div>
      </div>

      {/* Admin Info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-battle64-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {currentAdmin?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {currentAdmin?.username}
            </div>
            <div className="text-xs text-gray-500 capitalize">
              {currentAdmin?.role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
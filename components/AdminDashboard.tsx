'use client';

import React from 'react';
import { useAdminStore } from '../store/adminStore';
import Sidebar from './Sidebar';
import PostsTab from './tabs/PostsTab';
import ModerationTab from './tabs/ModerationTab';
import UsersTab from './tabs/UsersTab';
import ReportsTab from './tabs/ReportsTab';
import SettingsTab from './tabs/SettingsTab';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const { activeTab, setAuthenticated, setCurrentAdmin, currentAdmin } = useAdminStore();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setCurrentAdmin(null);
    setAuthenticated(false);
    toast.success('Erfolgreich abgemeldet');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'posts':
        return <PostsTab />;
      case 'moderation':
        return <ModerationTab />;
      case 'users':
        return <UsersTab />;
      case 'reports':
        return <ReportsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <PostsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Battle64 Admin Tool
              </h1>
              <span className="admin-badge">
                👑 {currentAdmin?.role === 'admin' ? 'Admin' : 'Moderator'}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Willkommen, {currentAdmin?.username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Abmelden</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {renderActiveTab()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
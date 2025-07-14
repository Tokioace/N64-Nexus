'use client';

import React, { useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { Crown, Shield, Users, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthenticated, setCurrentAdmin } = useAdminStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock authentication - replace with actual API call
      if (credentials.email === 'admin@battle64.com' && credentials.password === 'admin123') {
        const mockAdmin = {
          id: '1',
          username: 'Admin',
          email: credentials.email,
          role: 'admin' as const,
          permissions: ['posts', 'moderation', 'users', 'settings'],
        };

        localStorage.setItem('admin_token', 'mock_token_123');
        setCurrentAdmin(mockAdmin);
        setAuthenticated(true);
        toast.success('Erfolgreich angemeldet!');
      } else {
        toast.error('Ungültige Anmeldedaten');
      }
    } catch (error) {
      toast.error('Anmeldung fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-battle64-50 to-battle64-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-battle64-600 rounded-full flex items-center justify-center">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Battle64 Admin Tool
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Admin-Post & Moderationstool
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-Mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="form-input mt-1"
                placeholder="admin@battle64.com"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Passwort
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-input mt-1"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Anmelden'
              )}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Demo-Zugang:</h3>
          <p className="text-xs text-yellow-700">
            E-Mail: admin@battle64.com<br />
            Passwort: admin123
          </p>
        </div>

        {/* Feature Preview */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Shield className="h-6 w-6 text-battle64-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Moderation</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Crown className="h-6 w-6 text-battle64-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Admin Posts</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Users className="h-6 w-6 text-battle64-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">User Management</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Settings className="h-6 w-6 text-battle64-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Settings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
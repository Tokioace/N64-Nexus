'use client';

import React from 'react';
import { Settings, Shield, Bell, Globe } from 'lucide-react';

const SettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Einstellungen</h2>
          <p className="text-gray-600">System-Konfiguration und Admin-Einstellungen</p>
        </div>
        <div className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-battle64-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-battle64-600" />
            <h3 className="text-lg font-medium text-gray-900">Auto-Moderation</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" defaultChecked />
              <span className="text-sm text-gray-700">NSFW-Erkennung aktivieren</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" defaultChecked />
              <span className="text-sm text-gray-700">Spam-Erkennung aktivieren</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Bot-Erkennung aktivieren</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="h-6 w-6 text-battle64-600" />
            <h3 className="text-lg font-medium text-gray-900">Benachrichtigungen</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" defaultChecked />
              <span className="text-sm text-gray-700">E-Mail-Benachrichtigungen</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" defaultChecked />
              <span className="text-sm text-gray-700">Push-Benachrichtigungen</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Melde-Schwelle
              </label>
              <input type="number" className="form-input text-sm" defaultValue={3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
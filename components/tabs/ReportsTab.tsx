'use client';

import React from 'react';
import { Flag, Clock, CheckCircle, XCircle } from 'lucide-react';

const ReportsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meldungen</h2>
          <p className="text-gray-600">Verwalte Benutzer-Meldungen und Beschwerden</p>
        </div>
        <div className="flex items-center space-x-2">
          <Flag className="h-5 w-5 text-battle64-600" />
          <span className="text-sm text-gray-600">12 offene Meldungen</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <Flag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Meldungssystem</h3>
          <p className="text-sm">Hier werden alle Benutzer-Meldungen angezeigt und verwaltet.</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
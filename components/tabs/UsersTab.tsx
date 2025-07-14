'use client';

import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { User } from '../../types/admin';
import { Users, UserX, AlertTriangle, Search, Filter } from 'lucide-react';

const UsersTab: React.FC = () => {
  const { users, setUsers } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock data
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'Player123',
        email: 'player@example.com',
        isBlocked: false,
        warnings: [],
        createdAt: new Date('2024-01-01'),
        lastActive: new Date()
      },
      {
        id: '2',
        username: 'Artist456',
        email: 'artist@example.com',
        isBlocked: false,
        warnings: [],
        createdAt: new Date('2024-01-05'),
        lastActive: new Date()
      }
    ];
    setUsers(mockUsers);
  }, [setUsers]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'blocked' && user.isBlocked) ||
                         (filter === 'active' && !user.isBlocked);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Benutzer</h2>
          <p className="text-gray-600">Verwalte Benutzerkonten und Berechtigungen</p>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-battle64-600" />
          <span className="text-sm text-gray-600">{users.length} Benutzer</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Benutzer suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input text-sm"
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-select text-sm"
          >
            <option value="all">Alle Benutzer</option>
            <option value="active">Aktive</option>
            <option value="blocked">Gesperrt</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Benutzerliste ({filteredUsers.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-battle64-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{user.username}</h4>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">
                      Registriert {new Date(user.createdAt).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {user.isBlocked && (
                    <span className="flex items-center space-x-1 text-red-600">
                      <UserX className="h-4 w-4" />
                      <span className="text-sm">Gesperrt</span>
                    </span>
                  )}
                  {user.warnings.length > 0 && (
                    <span className="flex items-center space-x-1 text-yellow-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">{user.warnings.length} Verwarnung(en)</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersTab;
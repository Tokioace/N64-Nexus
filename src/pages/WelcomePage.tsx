import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { ProgressService } from '../services/progressService';
import { UserProfile } from '../types';
import { v4 as uuidv4 } from 'uuid';

const WelcomePage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  useEffect(() => {
    // Check if user already has a profile
    const profile = StorageService.getUserProfile();
    if (profile) {
      // Redirect to dashboard if profile exists
      window.location.href = '/dashboard';
    }
  }, []);

  const handleCreateProfile = () => {
    if (!username.trim()) return;

    setIsCreatingProfile(true);

    // Create new user profile
    const newProfile: UserProfile = {
      id: uuidv4(),
      username: username.trim(),
      avatar: '👤', // Default avatar
      collectorLevel: 0,
      points: {
        total: 0,
        daily: 0,
        weekly: 0,
        collection: 0,
        timeTrials: 0,
        events: 0,
        quiz: 0,
        minigames: 0
      },
      medals: [],
      favoriteGames: [],
      privacySettings: {
        showLocation: false,
        showPoints: true,
        showMedals: true,
        showFavoriteGames: true,
        profilePublic: true
      },
      createdAt: new Date(),
      lastActive: new Date()
    };

    StorageService.saveUserProfile(newProfile);
    StorageService.saveSettings(newProfile.privacySettings);

    // Add welcome progress
    ProgressService.addProgress(
      'daily_login' as any,
      'Willkommen bei Battle64!'
    );

    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-n64-purple to-n64-blue">
      <div className="max-w-md w-full mx-4">
        <div className="card text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-n64-purple rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl font-bold">64</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Willkommen bei Battle64
            </h1>
            <p className="text-gray-600">
              Deine N64 Gaming Community mit Profilen und Fortschrittssystem
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Wähle deinen Benutzernamen
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="z.B. MarioFan64"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-n64-purple focus:border-transparent"
                maxLength={20}
              />
              <p className="text-xs text-gray-500 mt-1">
                Keine Klarnamenpflicht - wähle einen Spitznamen
              </p>
            </div>

            <button
              onClick={handleCreateProfile}
              disabled={!username.trim() || isCreatingProfile}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingProfile ? 'Profil wird erstellt...' : 'Profil erstellen'}
            </button>

            <div className="text-sm text-gray-500">
              <p>Mit der Erstellung deines Profils stimmst du der lokalen Datenspeicherung zu.</p>
              <p className="mt-1">Deine Daten bleiben auf deinem Gerät und werden nicht übertragen.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-white">
          <h2 className="text-xl font-semibold mb-4">Was erwartet dich?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-2xl mb-2">🏆</div>
              <h3 className="font-semibold mb-1">Medaillen & Auszeichnungen</h3>
              <p>Sammle Medaillen für deine Erfolge</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">Fortschrittsverfolgung</h3>
              <p>Verfolge deine Punkte und Level</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-semibold mb-1">Community</h3>
              <p>Teile dein Profil mit anderen</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
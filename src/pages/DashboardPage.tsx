import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { ProgressService } from '../services/progressService';
import { UserProfile, ProgressType } from '../types';
import { Trophy, TrendingUp, Target, Calendar, Star, Users } from 'lucide-react';
import DemoActions from '../components/DemoActions';

const DashboardPage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState(ProgressService.getProgressStats());

  useEffect(() => {
    const userProfile = StorageService.getUserProfile();
    if (!userProfile) {
      window.location.href = '/';
      return;
    }
    
    setProfile(userProfile);
    setStats(ProgressService.getProgressStats());
  }, []);



  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-n64-purple"></div>
      </div>
    );
  }

  const nextLevelPoints = stats.collectorLevel < 16 ? 
    ProgressService['LEVEL_THRESHOLDS'][stats.collectorLevel + 1] - stats.totalPoints : 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Willkommen zurück, {profile.username}! 👋
        </h1>
        <p className="text-gray-600">
          Hier ist eine Übersicht über deine Fortschritte und Aktivitäten.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Trophy className="w-6 h-6 text-n64-purple" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sammler-Level</p>
              <p className="text-2xl font-bold text-gray-900">{stats.collectorLevel}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-n64-blue" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gesamtpunkte</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPoints}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-n64-yellow" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Medaillen</p>
              <p className="text-2xl font-bold text-gray-900">{stats.medalsCount}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-n64-green" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tägliche Serie</p>
              <p className="text-2xl font-bold text-gray-900">{stats.dailyStreak}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Level Progress */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Level-Fortschritt</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Level {stats.collectorLevel}</span>
                <span>{nextLevelPoints > 0 ? `${nextLevelPoints} Punkte bis Level ${stats.collectorLevel + 1}` : 'Maximales Level erreicht!'}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: nextLevelPoints > 0 ? 
                      `${((stats.totalPoints - ProgressService['LEVEL_THRESHOLDS'][stats.collectorLevel]) / 
                        (ProgressService['LEVEL_THRESHOLDS'][stats.collectorLevel + 1] - ProgressService['LEVEL_THRESHOLDS'][stats.collectorLevel])) * 100}%` : 
                      '100%' 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Heute</p>
                <p className="font-semibold text-n64-purple">{stats.dailyPoints} Punkte</p>
              </div>
              <div>
                <p className="text-gray-600">Diese Woche</p>
                <p className="font-semibold text-n64-blue">{stats.weeklyPoints} Punkte</p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Actions */}
        <DemoActions onActionComplete={() => {
          setStats(ProgressService.getProgressStats());
          const updatedProfile = StorageService.getUserProfile();
          if (updatedProfile) {
            setProfile(updatedProfile);
          }
        }} />
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Letzte Aktivitäten</h2>
        <div className="space-y-3">
          {profile.medals.slice(-3).reverse().map((medal) => (
            <div key={medal.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl mr-3">{medal.icon}</span>
              <div>
                <p className="font-medium text-gray-900">{medal.name}</p>
                <p className="text-sm text-gray-600">{medal.description}</p>
                <p className="text-xs text-gray-500">
                  Erhalten am {medal.earnedAt.toLocaleDateString('de-DE')}
                </p>
              </div>
            </div>
          ))}
          {profile.medals.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              Noch keine Medaillen erhalten. Starte mit deinen ersten Aktivitäten!
            </p>
          )}
        </div>
      </div>

      {/* Profile Link */}
      <div className="mt-8 text-center">
        <Link to="/profile" className="btn-primary inline-flex items-center">
          <Users className="w-4 h-4 mr-2" />
          Mein Profil anzeigen
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
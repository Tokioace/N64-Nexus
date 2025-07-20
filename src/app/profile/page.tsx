'use client';

import { useState } from 'react';
import { 
  User, 
  Trophy, 
  Star, 
  Gamepad2, 
  Calendar,
  MapPin,
  Edit,
  Medal,
  Target,
  Clock
} from 'lucide-react';

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

interface GameStats {
  game: string;
  bestTime: string;
  completions: number;
  personalBest: boolean;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'stats' | 'collection'>('overview');

  // Mock user data
  const user = {
    username: "RetroGamer64",
    avatar: "🎮",
    level: 15,
    xp: 2500,
    xpToNext: 3000,
    joinDate: "März 2024",
    location: "Berlin, Deutschland",
    region: "PAL",
    totalGames: 23,
    totalEvents: 12,
    friendsCount: 47,
    bio: "Leidenschaftlicher N64-Sammler und Speedrunner. Spezialisiert auf Mario 64 und Zelda-Spiele."
  };

  const achievements: Achievement[] = [
    {
      id: 1,
      name: "Speedrun Master",
      description: "10 Speedruns abgeschlossen",
      icon: "🏃‍♂️",
      earned: true,
      earnedDate: "15. Juli 2024"
    },
    {
      id: 2,
      name: "Community Hero",
      description: "50 Freunde hinzugefügt",
      icon: "👥",
      earned: true,
      earnedDate: "10. Juli 2024"
    },
    {
      id: 3,
      name: "Collector",
      description: "20 Spiele zur Sammlung hinzugefügt",
      icon: "📦",
      earned: true,
      earnedDate: "5. Juli 2024"
    },
    {
      id: 4,
      name: "Event Champion",
      description: "Ein Event gewonnen",
      icon: "🏆",
      earned: false
    }
  ];

  const gameStats: GameStats[] = [
    {
      game: "Super Mario 64",
      bestTime: "16:42",
      completions: 8,
      personalBest: true
    },
    {
      game: "Zelda: Ocarina of Time",
      bestTime: "4:23:15",
      completions: 3,
      personalBest: false
    },
    {
      game: "Mario Kart 64",
      bestTime: "2:08:45",
      completions: 12,
      personalBest: true
    }
  ];

  const tabs = [
    { key: 'overview', name: 'Übersicht', icon: <User className="w-4 h-4" /> },
    { key: 'achievements', name: 'Erfolge', icon: <Trophy className="w-4 h-4" /> },
    { key: 'stats', name: 'Statistiken', icon: <Target className="w-4 h-4" /> },
    { key: 'collection', name: 'Sammlung', icon: <Gamepad2 className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="retro-card mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-4xl mb-4">
                {user.avatar}
              </div>
              <button className="text-cyan-300 hover:text-cyan-100 transition-colors text-sm flex items-center">
                <Edit className="w-4 h-4 mr-1" />
                Avatar ändern
              </button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold neon-text">{user.username}</h1>
                <button className="neon-button text-sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Profil bearbeiten
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-300">Level {user.level}</div>
                  <div className="text-sm text-gray-400">Stufe</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300">{user.totalGames}</div>
                  <div className="text-sm text-gray-400">Spiele</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-300">{user.totalEvents}</div>
                  <div className="text-sm text-gray-400">Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-300">{user.friendsCount}</div>
                  <div className="text-sm text-gray-400">Freunde</div>
                </div>
              </div>
              
              {/* XP Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">XP Progress</span>
                  <span className="text-cyan-300">{user.xp} / {user.xpToNext} XP</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(user.xp / user.xpToNext) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{user.bio}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {user.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Dabei seit {user.joinDate}
                </div>
                <div className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">
                  {user.region}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                activeTab === tab.key
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-gray-800/50 text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/10'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="retro-card">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 neon-text">Profil-Übersicht</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-cyan-300 mb-4">Kürzliche Erfolge</h3>
                  <div className="space-y-3">
                    {achievements.filter(a => a.earned).slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <div className="font-medium text-cyan-300">{achievement.name}</div>
                          <div className="text-sm text-gray-400">{achievement.earnedDate}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-cyan-300 mb-4">Beste Zeiten</h3>
                  <div className="space-y-3">
                    {gameStats.slice(0, 3).map((stat, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                        <div>
                          <div className="font-medium text-cyan-300">{stat.game}</div>
                          <div className="text-sm text-gray-400">{stat.completions} Läufe</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${stat.personalBest ? 'text-yellow-300' : 'text-white'}`}>
                            {stat.bestTime}
                          </div>
                          {stat.personalBest && (
                            <div className="text-xs text-yellow-300 flex items-center">
                              <Medal className="w-3 h-3 mr-1" />
                              PB
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 neon-text">Erfolge</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`p-4 rounded border-2 transition-all ${
                      achievement.earned
                        ? 'bg-cyan-500/10 border-cyan-500/30'
                        : 'bg-gray-800/30 border-gray-700 opacity-60'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-3xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h3 className={`font-bold mb-1 ${achievement.earned ? 'text-cyan-300' : 'text-gray-400'}`}>
                          {achievement.name}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                        {achievement.earned && achievement.earnedDate && (
                          <div className="text-xs text-cyan-300 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {achievement.earnedDate}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 neon-text">Spielstatistiken</h2>
              <div className="space-y-4">
                {gameStats.map((stat, index) => (
                  <div key={index} className="p-4 bg-gray-800/30 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-cyan-300">{stat.game}</h3>
                      {stat.personalBest && (
                        <div className="flex items-center text-yellow-300 text-sm">
                          <Medal className="w-4 h-4 mr-1" />
                          Personal Best
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400">Beste Zeit</div>
                        <div className="text-lg font-bold text-white">{stat.bestTime}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Abgeschlossen</div>
                        <div className="text-lg font-bold text-white">{stat.completions}x</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'collection' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 neon-text">Meine Sammlung</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: user.totalGames }, (_, i) => (
                  <div key={i} className="retro-card p-4 text-center hover:scale-105 transition-transform">
                    <div className="w-12 h-16 bg-gradient-to-b from-yellow-400 to-orange-500 rounded mx-auto mb-2"></div>
                    <p className="text-sm text-cyan-300">Spiel {i + 1}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button className="neon-button">
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Spiel hinzufügen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
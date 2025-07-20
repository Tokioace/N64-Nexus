'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Crown, Timer, Users } from 'lucide-react';

interface LeaderboardEntry {
  id: number;
  username: string;
  time: string;
  region: 'PAL' | 'NTSC';
  rank: number;
  avatar: string;
  score?: number;
  isNew?: boolean;
}

interface LiveLeaderboardProps {
  eventTitle: string;
  entries: LeaderboardEntry[];
  refreshInterval?: number;
}

export default function LiveLeaderboard({ 
  eventTitle, 
  entries: initialEntries, 
  refreshInterval = 30000 
}: LiveLeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(initialEntries);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate Live-Updates (in real app this would be API polling)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new entries or time improvements
      setEntries(prevEntries => {
        const updatedEntries = [...prevEntries];
        
        // Random chance for new entries or updates
        if (Math.random() > 0.7) {
          const randomIndex = Math.floor(Math.random() * updatedEntries.length);
          if (updatedEntries[randomIndex]) {
            // Simulate time improvement
            const currentTime = updatedEntries[randomIndex].time;
            const [minutes, seconds] = currentTime.split(':').map(Number);
            const totalSeconds = minutes * 60 + seconds;
            const improvedSeconds = Math.max(totalSeconds - Math.floor(Math.random() * 10), 60);
            const newMinutes = Math.floor(improvedSeconds / 60);
            const newSeconds = improvedSeconds % 60;
            
            updatedEntries[randomIndex] = {
              ...updatedEntries[randomIndex],
              time: `${newMinutes}:${newSeconds.toString().padStart(2, '0')}`,
              isNew: true
            };
          }
        }
        
        // Sort by time and update ranks
        const sorted = updatedEntries
          .sort((a, b) => {
            const timeA = a.time.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
            const timeB = b.time.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
            return timeA - timeB;
          })
          .map((entry, index) => ({
            ...entry,
            rank: index + 1
          }));
        
        return sorted;
      });
      
      setLastUpdate(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-300" />;
      case 3: return <Award className="w-6 h-6 text-orange-400" />;
      default: return <Trophy className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-400/50';
      case 2: return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50';
      case 3: return 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-400/50';
      default: return 'bg-black/30 border-cyan-500/20 hover:border-cyan-400/40';
    }
  };

  return (
    <div className="retro-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold neon-text">Live Leaderboard</h2>
          <p className="text-cyan-300">{eventTitle}</p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4" />
            <span>Live</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>{entries.length} Teilnehmer</span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {entries.slice(0, 3).map((entry, index) => (
          <div
            key={entry.id}
            className={`text-center p-4 rounded-lg border-2 ${getRankStyle(entry.rank)} hover:scale-105 transition-transform`}
          >
            <div className="flex justify-center mb-3">
              {getRankIcon(entry.rank)}
            </div>
            <div className="text-2xl mb-2">{entry.avatar}</div>
            <div className="font-bold text-cyan-300 mb-1">{entry.username}</div>
            <div className="text-lg font-mono text-green-300 mb-1">{entry.time}</div>
            <div className="text-xs text-gray-400">{entry.region}</div>
            {entry.isNew && (
              <div className="text-xs text-yellow-400 mt-1">
                ✨ Neue Bestzeit!
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Full Leaderboard */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-cyan-400" />
          Vollständige Rangliste
        </h3>
        
        <div>
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:scale-105 ${getRankStyle(entry.rank)} ${entry.isNew ? 'ring-2 ring-yellow-400/50' : ''}`}
            >
              <div className="flex items-center space-x-4">
                {/* Rank */}
                <div className="flex items-center space-x-2">
                  {entry.rank <= 3 ? (
                    getRankIcon(entry.rank)
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full flex items-center justify-center text-sm font-bold text-cyan-300">
                      {entry.rank}
                    </div>
                  )}
                  {entry.isNew && (
                    <div className="text-green-400">
                      ↗️
                    </div>
                  )}
                </div>

                {/* Player Info */}
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{entry.avatar}</span>
                  <div>
                    <div className="font-bold text-cyan-300">{entry.username}</div>
                    <div className="text-sm text-gray-400">{entry.region}</div>
                  </div>
                </div>
              </div>

              {/* Time and Status */}
              <div className="text-right">
                <div className="text-xl font-mono text-green-300">{entry.time}</div>
                <div className="text-sm text-gray-400 flex items-center justify-end space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
                {entry.isNew && (
                  <div className="text-xs text-yellow-400 mt-1">
                    🆕 Verbessert!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Last Update */}
      <div className="text-center text-sm text-gray-500 mt-6">
        Letzte Aktualisierung: {lastUpdate.toLocaleTimeString('de-DE')}
      </div>
    </div>
  );
}
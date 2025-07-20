'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  eventId: number;
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

  // Simuliere Live-Updates (in echter Anwendung würde hier API-Polling stattfinden)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simuliere neue Einträge oder Zeitverbesserungen
      setEntries(prevEntries => {
        const updatedEntries = [...prevEntries];
        
        // Zufällige Chance auf neue Einträge oder Updates
        if (Math.random() > 0.7) {
          const randomIndex = Math.floor(Math.random() * updatedEntries.length);
          if (updatedEntries[randomIndex]) {
            // Simuliere Zeitverbesserung
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
        
        // Sortiere nach Zeit und aktualisiere Ränge
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
      case 1: return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-400/50 shadow-yellow-400/20';
      case 2: return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50 shadow-gray-400/20';
      case 3: return 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-400/50 shadow-orange-400/20';
      default: return 'bg-black/30 border-cyan-500/20 hover:border-cyan-400/40';
    }
  };

  const getPositionChange = (entry: LeaderboardEntry) => {
    // Simuliere Positionsänderungen für Animation
    return entry.isNew ? 'up' : null;
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
          <motion.div
            key={entry.id}
            className={`text-center p-4 rounded-lg border-2 shadow-lg ${getRankStyle(entry.rank)}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex justify-center mb-3">
              {getRankIcon(entry.rank)}
            </div>
            <div className="text-2xl mb-2">{entry.avatar}</div>
            <div className="font-bold text-cyan-300 mb-1">{entry.username}</div>
            <div className="text-lg font-mono text-green-300 mb-1">{entry.time}</div>
            <div className="text-xs text-gray-400">{entry.region}</div>
            {entry.isNew && (
              <motion.div
                className="text-xs text-yellow-400 mt-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                ✨ Neue Bestzeit!
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Full Leaderboard */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-cyan-400" />
          Vollständige Rangliste
        </h3>
        
        <AnimatePresence>
          {entries.map((entry, index) => {
            const positionChange = getPositionChange(entry);
            
            return (
              <motion.div
                key={entry.id}
                layout
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${getRankStyle(entry.rank)}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: entry.isNew ? [1, 1.05, 1] : 1
                }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05,
                  scale: { duration: 0.6 }
                }}
                whileHover={{ scale: 1.02 }}
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
                    {positionChange === 'up' && (
                      <motion.div
                        className="text-green-400"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        ↗️
                      </motion.div>
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
                    <motion.div
                      className="text-xs text-yellow-400 mt-1"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onAnimationComplete={() => {
                        // Entferne den "isNew" Flag nach Animation
                        setTimeout(() => {
                          setEntries(prev => prev.map(e => 
                            e.id === entry.id ? { ...e, isNew: false } : e
                          ));
                        }, 2000);
                      }}
                    >
                      🆕 Verbessert!
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Last Update */}
      <div className="text-center text-sm text-gray-500 mt-6">
        Letzte Aktualisierung: {lastUpdate.toLocaleTimeString('de-DE')}
      </div>
    </div>
  );
}
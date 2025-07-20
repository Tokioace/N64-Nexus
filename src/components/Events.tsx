'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Clock, 
  Users, 
  Calendar, 
  Target, 
  MessageCircle,
  Play,
  Award,
  Timer
} from 'lucide-react';

interface Event {
  id: number;
  title: string;
  game: string;
  region: 'PAL' | 'NTSC';
  startTime: string;
  duration: string;
  participants: number;
  status: 'upcoming' | 'live' | 'completed';
  leaderboard: LeaderboardEntry[];
}

interface LeaderboardEntry {
  id: number;
  username: string;
  time: string;
  region: 'PAL' | 'NTSC';
  rank: number;
  avatar: string;
}

export default function Events() {
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'PAL' | 'NTSC'>('all');
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);

  const events: Event[] = [
    {
      id: 1,
      title: "Super Mario 64 Speedrun",
      game: "Super Mario 64",
      region: "PAL",
      startTime: "Samstag, 20:00 Uhr",
      duration: "2 Stunden",
      participants: 24,
      status: "live",
      leaderboard: [
        { id: 1, username: "SpeedRunner64", time: "1:15:32", region: "PAL", rank: 1, avatar: "🚀" },
        { id: 2, username: "RetroMaster", time: "1:16:45", region: "PAL", rank: 2, avatar: "🎮" },
        { id: 3, username: "N64Pro", time: "1:17:12", region: "PAL", rank: 3, avatar: "⭐" },
      ]
    },
    {
      id: 2,
      title: "Zelda OoT Any%",
      game: "The Legend of Zelda: Ocarina of Time",
      region: "NTSC",
      startTime: "Sonntag, 15:00 Uhr",
      duration: "3 Stunden",
      participants: 18,
      status: "upcoming",
      leaderboard: []
    },
    {
      id: 3,
      title: "GoldenEye 007 Agent",
      game: "GoldenEye 007",
      region: "PAL",
      startTime: "Freitag, 19:00 Uhr",
      duration: "1.5 Stunden",
      participants: 31,
      status: "completed",
      leaderboard: [
        { id: 1, username: "BondFan", time: "0:12:34", region: "PAL", rank: 1, avatar: "🔫" },
        { id: 2, username: "007Pro", time: "0:12:56", region: "PAL", rank: 2, avatar: "🎯" },
      ]
    }
  ];

  const filteredEvents = events.filter(event => 
    selectedRegion === 'all' || event.region === selectedRegion
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-green-400 bg-green-400/20';
      case 'upcoming': return 'text-yellow-400 bg-yellow-400/20';
      case 'completed': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <Play className="w-4 h-4" />;
      case 'upcoming': return <Clock className="w-4 h-4" />;
      case 'completed': return <Award className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-4 neon-text">Events & Turniere</h1>
          <p className="text-xl text-cyan-300 mb-8">
            Nimm an Zeitrennen teil und messe dich mit der Community!
          </p>
        </motion.div>

        {/* Region Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-black/50 rounded-lg p-1 border border-cyan-500/30">
            {(['all', 'PAL', 'NTSC'] as const).map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-6 py-2 rounded-md transition-all ${
                  selectedRegion === region
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-300 hover:text-cyan-300'
                }`}
              >
                {region === 'all' ? 'Alle' : region}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              className="retro-card cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveEvent(event)}
            >
              {/* Event Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-cyan-300 mb-2">{event.title}</h3>
                  <p className="text-gray-300">{event.game}</p>
                </div>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(event.status)}`}>
                  {getStatusIcon(event.status)}
                  <span className="capitalize">{event.status}</span>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-gray-300">{event.startTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Timer className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">{event.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">{event.participants} Teilnehmer</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">{event.region}</span>
                </div>
              </div>

              {/* Leaderboard Preview */}
              {event.leaderboard.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-gray-300 mb-2">Top 3</h4>
                  <div className="space-y-2">
                    {event.leaderboard.slice(0, 3).map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between bg-black/20 rounded p-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{entry.avatar}</span>
                          <span className="text-sm text-gray-300">{entry.username}</span>
                        </div>
                        <span className="text-sm font-mono text-cyan-300">{entry.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {event.status === 'live' && (
                  <>
                    <button className="flex-1 neon-button flex items-center justify-center">
                      <Target className="w-4 h-4 mr-2" />
                      Teilnehmen
                    </button>
                    <button className="bg-green-500/20 hover:bg-green-500/30 text-green-300 py-2 px-3 rounded transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </>
                )}
                {event.status === 'upcoming' && (
                  <button className="w-full neon-button flex items-center justify-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Erinnerung setzen
                  </button>
                )}
                {event.status === 'completed' && (
                  <button className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 py-2 rounded transition-colors">
                    Ergebnisse anzeigen
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Leaderboard */}
        {activeEvent && activeEvent.status === 'live' && (
          <motion.div
            className="retro-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6 neon-text text-center">
              Live Leaderboard - {activeEvent.title}
            </h2>
            <div className="space-y-3">
              {activeEvent.leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  className="flex items-center justify-between bg-black/30 rounded-lg p-4 border border-cyan-500/20"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-sm font-bold">
                      {entry.rank}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{entry.avatar}</span>
                      <div>
                        <div className="font-bold text-cyan-300">{entry.username}</div>
                        <div className="text-sm text-gray-400">{entry.region}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-mono text-green-300">{entry.time}</div>
                    <div className="text-sm text-gray-400">Live</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
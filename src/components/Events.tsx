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
  Timer,
  UserPlus,
  Zap,
  Shield
} from 'lucide-react';
import LiveLeaderboard from './LiveLeaderboard';
import { MedalCollection } from './EventMedal';

type EventType = 'individual' | 'team';

interface Team {
  id: number;
  name: string;
  logo?: string;
  members: TeamMember[];
  averageTime?: string;
  rank?: number;
}

interface TeamMember {
  id: number;
  username: string;
  avatar: string;
  bestTime?: string;
}

interface Event {
  id: number;
  title: string;
  game: string;
  region: 'PAL' | 'NTSC';
  startTime: string;
  duration: string;
  participants: number;
  status: 'upcoming' | 'live' | 'completed';
  type: EventType;
  leaderboard: LeaderboardEntry[];
  teams?: Team[];
  maxTeamSize?: number;
}

interface LeaderboardEntry {
  id: number;
  username: string;
  time: string;
  region: 'PAL' | 'NTSC';
  rank: number;
  avatar: string;
  teamId?: number;
  teamName?: string;
}

export default function Events() {
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'PAL' | 'NTSC'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'individual' | 'team'>('all');
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [showTeamCreation, setShowTeamCreation] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

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
      type: "individual",
      leaderboard: [
        { id: 1, username: "SpeedRunner64", time: "1:15:32", region: "PAL", rank: 1, avatar: "🚀" },
        { id: 2, username: "RetroMaster", time: "1:16:45", region: "PAL", rank: 2, avatar: "🎮" },
        { id: 3, username: "N64Pro", time: "1:17:12", region: "PAL", rank: 3, avatar: "⭐" },
        { id: 4, username: "ClassicGamer", time: "1:18:30", region: "PAL", rank: 4, avatar: "🎯" },
        { id: 5, username: "RetroFan", time: "1:19:45", region: "PAL", rank: 5, avatar: "🔥" },
      ]
    },
    {
      id: 2,
      title: "Team Zelda OoT Challenge",
      game: "The Legend of Zelda: Ocarina of Time",
      region: "NTSC",
      startTime: "Sonntag, 15:00 Uhr",
      duration: "3 Stunden",
      participants: 16,
      status: "upcoming",
      type: "team",
      maxTeamSize: 4,
      leaderboard: [],
      teams: [
        {
          id: 1,
          name: "Hyrule Heroes",
          logo: "🏰",
          members: [
            { id: 1, username: "Link64", avatar: "🗡️" },
            { id: 2, username: "ZeldaMaster", avatar: "👑" },
            { id: 3, username: "GanonSlayer", avatar: "⚔️" }
          ]
        },
        {
          id: 2,
          name: "Triforce Legends",
          logo: "🔺",
          members: [
            { id: 4, username: "EponaRider", avatar: "🐎" },
            { id: 5, username: "SageOfTime", avatar: "⏰" }
          ]
        }
      ]
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
      type: "individual",
      leaderboard: [
        { id: 1, username: "BondFan", time: "0:12:34", region: "PAL", rank: 1, avatar: "🔫" },
        { id: 2, username: "007Pro", time: "0:12:56", region: "PAL", rank: 2, avatar: "🎯" },
        { id: 3, username: "SecretAgent", time: "0:13:15", region: "PAL", rank: 3, avatar: "🕵️" },
      ]
    }
  ];

  // Beispiel Medaillen für Demo
  const userMedals = [
    {
      id: "medal1",
      type: "gold" as const,
      eventTitle: "Super Mario 64 Championship",
      eventDate: "15.01.2024",
      rank: 1,
      totalParticipants: 45
    },
    {
      id: "medal2", 
      type: "silver" as const,
      eventTitle: "Zelda OoT Speedrun",
      eventDate: "08.01.2024",
      rank: 3,
      totalParticipants: 28
    },
    {
      id: "medal3",
      type: "bronze" as const,
      eventTitle: "GoldenEye Tournament",
      eventDate: "01.01.2024", 
      rank: 8,
      totalParticipants: 52
    }
  ];

  const filteredEvents = events.filter(event => {
    const regionMatch = selectedRegion === 'all' || event.region === selectedRegion;
    const typeMatch = selectedType === 'all' || event.type === selectedType;
    return regionMatch && typeMatch;
  });

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

  const createTeam = () => {
    if (newTeamName.trim() && activeEvent) {
      // In einer echten App würde hier ein API-Call stattfinden
      console.log(`Team "${newTeamName}" für Event ${activeEvent.id} erstellt`);
      setNewTeamName('');
      setShowTeamCreation(false);
    }
  };

  const joinTeam = (teamId: number) => {
    // In einer echten App würde hier ein API-Call stattfinden
    console.log(`Team ${teamId} beigetreten`);
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

        {/* Medal Collection */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <MedalCollection medals={userMedals} maxDisplay={6} />
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          {/* Region Filter */}
          <div className="flex bg-black/50 rounded-lg p-1 border border-cyan-500/30">
            {(['all', 'PAL', 'NTSC'] as const).map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-md transition-all ${
                  selectedRegion === region
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-300 hover:text-cyan-300'
                }`}
              >
                {region === 'all' ? 'Alle Regionen' : region}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex bg-black/50 rounded-lg p-1 border border-purple-500/30">
            {([
              { key: 'all', label: 'Alle Events', icon: <Zap className="w-4 h-4" /> },
              { key: 'individual', label: 'Einzelspieler', icon: <Target className="w-4 h-4" /> },
              { key: 'team', label: 'Team Events', icon: <Users className="w-4 h-4" /> }
            ] as const).map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setSelectedType(key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  selectedType === key
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-300 hover:text-purple-300'
                }`}
              >
                {icon}
                <span>{label}</span>
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
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-bold text-cyan-300">{event.title}</h3>
                    {event.type === 'team' && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-purple-500/20 rounded-full text-xs text-purple-300">
                        <Users className="w-3 h-3" />
                        <span>Team</span>
                      </div>
                    )}
                  </div>
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

              {/* Team Info */}
              {event.type === 'team' && event.teams && event.teams.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-gray-300 mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    Teams ({event.teams.length})
                  </h4>
                  <div className="space-y-2">
                    {event.teams.slice(0, 2).map((team) => (
                      <div key={team.id} className="flex items-center justify-between bg-black/20 rounded p-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{team.logo}</span>
                          <div>
                            <span className="text-sm font-bold text-purple-300">{team.name}</span>
                            <div className="text-xs text-gray-400">{team.members.length}/{event.maxTeamSize || 4} Mitglieder</div>
                          </div>
                        </div>
                        {team.averageTime && (
                          <span className="text-sm font-mono text-cyan-300">{team.averageTime}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                          {entry.teamName && (
                            <span className="text-xs text-purple-400">({entry.teamName})</span>
                          )}
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
                  <>
                    {event.type === 'team' ? (
                      <button 
                        className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 py-2 rounded transition-colors flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTeamCreation(true);
                        }}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Team beitreten
                      </button>
                    ) : (
                      <button className="flex-1 neon-button flex items-center justify-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Erinnerung setzen
                      </button>
                    )}
                  </>
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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LiveLeaderboard
              eventId={activeEvent.id}
              eventTitle={activeEvent.title}
              entries={activeEvent.leaderboard}
              refreshInterval={30000}
            />
          </motion.div>
        )}

        {/* Team Details Modal */}
        {activeEvent && activeEvent.type === 'team' && activeEvent.teams && (
          <motion.div
            className="retro-card mt-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6 neon-text text-center flex items-center justify-center">
              <Shield className="w-6 h-6 mr-2" />
              Team Overview - {activeEvent.title}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeEvent.teams.map((team) => (
                <div key={team.id} className="bg-black/30 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{team.logo}</div>
                      <div>
                        <h3 className="text-lg font-bold text-purple-300">{team.name}</h3>
                        <p className="text-sm text-gray-400">{team.members.length}/{activeEvent.maxTeamSize || 4} Mitglieder</p>
                      </div>
                    </div>
                    {team.averageTime && (
                      <div className="text-right">
                        <div className="text-lg font-mono text-green-300">{team.averageTime}</div>
                        <div className="text-xs text-gray-400">Ø Zeit</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {team.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between bg-black/20 rounded p-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{member.avatar}</span>
                          <span className="text-sm text-gray-300">{member.username}</span>
                        </div>
                        {member.bestTime && (
                          <span className="text-sm font-mono text-cyan-300">{member.bestTime}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {team.members.length < (activeEvent.maxTeamSize || 4) && (
                    <button 
                      className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 py-2 rounded transition-colors flex items-center justify-center"
                      onClick={() => joinTeam(team.id)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Team beitreten
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center mt-6">
              <button 
                className="neon-button flex items-center mx-auto"
                onClick={() => setShowTeamCreation(true)}
              >
                <Users className="w-4 h-4 mr-2" />
                Neues Team erstellen
              </button>
            </div>
          </motion.div>
        )}

        {/* Team Creation Modal */}
        {showTeamCreation && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="retro-card max-w-md w-full mx-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <h3 className="text-xl font-bold text-cyan-300 mb-4">Neues Team erstellen</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Team Name</label>
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="w-full bg-black/50 border border-cyan-500/30 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    placeholder="Gib deinen Team-Namen ein..."
                    maxLength={30}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={createTeam}
                    className="flex-1 neon-button"
                    disabled={!newTeamName.trim()}
                  >
                    Team erstellen
                  </button>
                  <button
                    onClick={() => {
                      setShowTeamCreation(false);
                      setNewTeamName('');
                    }}
                    className="flex-1 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 py-2 rounded transition-colors"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
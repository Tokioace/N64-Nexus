'use client';

import { useState, useEffect } from 'react';
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
  endTime?: string; // ISO string for countdown
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
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper function to calculate time remaining
  const getTimeRemaining = (endTime: string) => {
    const end = new Date(endTime);
    const now = currentTime;
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };

  // Format countdown display
  const formatCountdown = (timeRemaining: { days: number; hours: number; minutes: number; seconds: number } | null) => {
    if (!timeRemaining) return 'Event beendet';
    
    const { days, hours, minutes, seconds } = timeRemaining;
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  };

  const events: Event[] = [
    {
      id: 1,
      title: "Mario Kart 64 Grand Prix Championship",
      game: "Mario Kart 64",
      region: "PAL",
      startTime: "Jetzt live!",
      duration: "3 Stunden",
      participants: 32,
      status: "live",
      type: "individual",
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // Event ends in 2 hours
      leaderboard: [
        { id: 1, username: "KartMaster64", time: "1:52:34", region: "PAL", rank: 1, avatar: "🏎️" },
        { id: 2, username: "RainbowRacer", time: "1:53:12", region: "PAL", rank: 2, avatar: "🌈" },
        { id: 3, username: "ShellShooter", time: "1:54:45", region: "PAL", rank: 3, avatar: "🐢" },
        { id: 4, username: "DriftKing", time: "1:55:23", region: "PAL", rank: 4, avatar: "💨" },
        { id: 5, username: "BowserSlayer", time: "1:56:78", region: "PAL", rank: 5, avatar: "👑" },
        { id: 6, username: "YoshiRider", time: "1:57:45", region: "PAL", rank: 6, avatar: "🦕" },
        { id: 7, username: "PeachSpeedster", time: "1:58:12", region: "PAL", rank: 7, avatar: "👸" },
        { id: 8, username: "ToadRacer", time: "1:59:34", region: "PAL", rank: 8, avatar: "🍄" },
      ]
    },
    {
      id: 2,
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
      id: 3,
      title: "Mario Kart 64 Team Battle Royale",
      game: "Mario Kart 64",
      region: "NTSC",
      startTime: "Sonntag, 18:00 Uhr",
      duration: "2 Stunden",
      participants: 20,
      status: "upcoming",
      type: "team",
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Event starts in 24 hours
      maxTeamSize: 4,
      leaderboard: [],
      teams: [
        {
          id: 1,
          name: "Speed Demons",
          logo: "🏎️",
          members: [
            { id: 1, username: "MarioRacer", avatar: "🍄" },
            { id: 2, username: "LuigiDrifter", avatar: "👻" },
            { id: 3, username: "ToadSpeed", avatar: "🐢" }
          ]
        },
        {
          id: 2,
          name: "Kart Kings",
          logo: "👑",
          members: [
            { id: 4, username: "BowserBoss", avatar: "🔥" },
            { id: 5, username: "YoshiRider", avatar: "🦕" }
          ]
        }
      ]
    },
    {
      id: 4,
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
      id: 5,
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

  // Example medals for demo
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
      console.log(`Team "${newTeamName}" für Event ${activeEvent.id} erstellt`);
      setNewTeamName('');
      setShowTeamCreation(false);
    }
  };

  const joinTeam = (teamId: number) => {
    console.log(`Team ${teamId} beigetreten`);
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 neon-text">Events & Turniere</h1>
          <p className="text-xl text-cyan-300 mb-8">
            Nimm an Zeitrennen teil und messe dich mit der Community!
          </p>
        </div>

        {/* Medal Collection */}
        <div className="mb-12">
          <MedalCollection medals={userMedals} maxDisplay={6} />
        </div>

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
            <div
              key={event.id}
              className="retro-card cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setActiveEvent(event)}
            >
              {/* Event Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-bold text-cyan-300">{event.title}</h3>
                    {event.game === 'Mario Kart 64' && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-red-500/20 to-blue-500/20 rounded-full text-xs text-red-300 border border-red-500/30 animate-pulse">
                        <span>🏎️</span>
                        <span>MARIO KART</span>
                      </div>
                    )}
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

              {/* Countdown Timer */}
              {event.endTime && (
                <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg border border-red-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-red-400 animate-pulse" />
                      <span className="text-sm font-bold text-red-300">
                        {event.status === 'live' ? 'Event endet in:' : 'Event startet in:'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-mono font-bold text-red-300 animate-pulse">
                        {formatCountdown(getTimeRemaining(event.endTime))}
                      </div>
                      {getTimeRemaining(event.endTime) && (
                        <div className="text-xs text-red-400/80">
                          {event.status === 'live' ? 'bis zum Ende' : 'bis zum Start'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

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
            </div>
          ))}
        </div>

        {/* Active Event Countdown */}
        {activeEvent && activeEvent.endTime && (
          <div className="retro-card mt-8 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-cyan-300">
                🏁 {activeEvent.title}
              </h2>
              <div className="bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-lg p-6 border border-red-500/40">
                <div className="flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-red-400 animate-pulse mr-3" />
                  <span className="text-xl font-bold text-red-300">
                    {activeEvent.status === 'live' ? 'Event endet in:' : 'Event startet in:'}
                  </span>
                </div>
                <div className="text-4xl font-mono font-bold text-red-300 animate-pulse mb-2">
                  {formatCountdown(getTimeRemaining(activeEvent.endTime))}
                </div>
                {getTimeRemaining(activeEvent.endTime) && (
                  <div className="text-sm text-red-400/80">
                    {activeEvent.status === 'live' ? 'Bis zum Ende des Events' : 'Bis zum Start des Events'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Live Leaderboard */}
        {activeEvent && activeEvent.status === 'live' && (
          <div>
            <LiveLeaderboard
              eventTitle={activeEvent.title}
              entries={activeEvent.leaderboard}
              refreshInterval={30000}
            />
          </div>
        )}

        {/* Team Details Modal */}
        {activeEvent && activeEvent.type === 'team' && activeEvent.teams && (
          <div className="retro-card mt-8">
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
          </div>
        )}

        {/* Team Creation Modal */}
        {showTeamCreation && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="retro-card max-w-md w-full mx-4">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
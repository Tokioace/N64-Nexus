'use client';

import { useState } from 'react';
import { 
  Users, 
  MessageCircle, 
  Trophy, 
  Star, 
  MapPin, 
  Heart,
  Send
} from 'lucide-react';

interface User {
  id: number;
  username: string;
  avatar: string;
  level: number;
  points: number;
  games: number;
  region: 'PAL' | 'NTSC';
  location: string;
  isOnline: boolean;
  isFriend: boolean;
  achievements: string[];
}

interface ChatMessage {
  id: number;
  username: string;
  avatar: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
}

export default function Community() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      username: "RetroMaster",
      avatar: "🎮",
      level: 15,
      points: 2500,
      games: 23,
      region: "PAL",
      location: "Berlin, DE",
      isOnline: true,
      isFriend: true,
      achievements: ["Speedrunner", "Collector", "Community Hero"]
    },
    {
      id: 2,
      username: "N64Pro",
      avatar: "⭐",
      level: 12,
      points: 1800,
      games: 18,
      region: "NTSC",
      location: "New York, US",
      isOnline: true,
      isFriend: false,
      achievements: ["Speedrunner", "Event Winner"]
    },
    {
      id: 3,
      username: "ZeldaFan",
      avatar: "🛡️",
      level: 8,
      points: 1200,
      games: 15,
      region: "PAL",
      location: "München, DE",
      isOnline: false,
      isFriend: true,
      achievements: ["Collector"]
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      username: "RetroMaster",
      avatar: "🎮",
      message: "Wer ist heute beim Mario 64 Event dabei?",
      timestamp: "14:32",
      isOwn: false
    },
    {
      id: 2,
      username: "Du",
      avatar: "👤",
      message: "Ich bin dabei! Bin gespannt auf die neue Route.",
      timestamp: "14:33",
      isOwn: true
    },
    {
      id: 3,
      username: "N64Pro",
      avatar: "⭐",
      message: "Same! Die neue Skip-Technik ist echt krass.",
      timestamp: "14:34",
      isOwn: false
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'community' | 'chat'>('friends');

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onlineFriends = users.filter(user => user.isFriend && user.isOnline);
  const allOnlineUsers = users.filter(user => user.isOnline);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now(),
        username: "Du",
        avatar: "👤",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const addFriend = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isFriend: true } : user
    ));
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 neon-text">Community</h1>
          <p className="text-xl text-cyan-300 mb-8">
            Verbinde dich mit anderen N64-Fans und tausche dich aus!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="retro-card text-center">
            <div className="text-3xl font-bold text-cyan-300">{users.length}</div>
            <div className="text-gray-300">Community</div>
          </div>
          <div className="retro-card text-center">
            <div className="text-3xl font-bold text-green-300">{allOnlineUsers.length}</div>
            <div className="text-gray-300">Online</div>
          </div>
          <div className="retro-card text-center">
            <div className="text-3xl font-bold text-yellow-300">{onlineFriends.length}</div>
            <div className="text-gray-300">Freunde Online</div>
          </div>
          <div className="retro-card text-center">
            <div className="text-3xl font-bold text-purple-300">{chatMessages.length}</div>
            <div className="text-gray-300">Nachrichten</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-black/50 rounded-lg p-1 border border-cyan-500/30">
            {[
              { key: 'friends', label: 'Freunde', icon: <Heart className="w-4 h-4" /> },
              { key: 'community', label: 'Community', icon: <Users className="w-4 h-4" /> },
              { key: 'chat', label: 'Live Chat', icon: <MessageCircle className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-6 py-2 rounded-md transition-all ${
                  activeTab === tab.key
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-300 hover:text-cyan-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User List */}
          {(activeTab === 'friends' || activeTab === 'community') && (
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Benutzer suchen..."
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className="retro-card"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-2xl">
                            {user.avatar}
                          </div>
                          {user.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-cyan-300">{user.username}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>Level {user.level}</span>
                            <span>{user.points} Punkte</span>
                            <span>{user.games} Spiele</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{user.location}</span>
                            <span>•</span>
                            <span>{user.region}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {user.achievements.map((achievement, i) => (
                          <div key={i} className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs">
                            {achievement}
                          </div>
                        ))}
                        {!user.isFriend && (
                          <button
                            onClick={() => addFriend(user.id)}
                            className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 p-2 rounded transition-colors"
                          >
                            {/* UserPlus icon removed */}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat */}
          {activeTab === 'chat' && (
            <div className="lg:col-span-2">
              <div className="retro-card h-96 flex flex-col">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-cyan-500/20">
                  <h3 className="text-lg font-bold text-cyan-300">Live Chat</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-green-400">Live</span>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatMessages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-xs ${message.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-sm">
                          {message.avatar}
                        </div>
                        <div className={`${message.isOwn ? 'bg-cyan-500/20' : 'bg-gray-700/50'} rounded-lg p-3`}>
                          <div className="text-xs text-gray-400 mb-1">{message.username}</div>
                          <div className="text-white">{message.message}</div>
                          <div className="text-xs text-gray-500 mt-1">{message.timestamp}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Nachricht eingeben..."
                    className="flex-1 px-4 py-2 bg-black/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button
                    onClick={sendMessage}
                    className="neon-button px-4"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Online Friends */}
            <div className="retro-card">
              <h3 className="text-lg font-bold text-cyan-300 mb-4">Online Freunde</h3>
              <div className="space-y-3">
                {onlineFriends.map((friend) => (
                  <div key={friend.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-sm">
                      {friend.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{friend.username}</div>
                      <div className="text-xs text-gray-400">{friend.games} Spiele</div>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="retro-card">
              <h3 className="text-lg font-bold text-cyan-300 mb-4">Aktivität</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <div className="text-sm">
                    <span className="text-cyan-300">RetroMaster</span> gewann Mario 64 Event
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {/* Gamepad2 icon removed */}
                  <div className="text-sm">
                    <span className="text-cyan-300">N64Pro</span> fügte Zelda zur Sammlung hinzu
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-purple-400" />
                  <div className="text-sm">
                    <span className="text-cyan-300">ZeldaFan</span> erreichte Level 10
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
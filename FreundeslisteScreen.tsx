import React, { useState } from 'react';
import './FreundeslisteScreen.css';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  rank: string;
  status: 'online' | 'away' | 'offline';
  lastSeen?: string;
  isOnline: boolean;
}

interface FreundeslisteScreenProps {
  onInviteToSpeedrun?: (friendId: string) => void;
  onAddFriend?: (code: string) => void;
}

const FreundeslisteScreen: React.FC<FreundeslisteScreenProps> = ({
  onInviteToSpeedrun,
  onAddFriend
}) => {
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: '1',
      name: 'SpeedRunner_Pro',
      avatar: '🏃‍♂️',
      rank: 'Speed Master',
      status: 'online',
      isOnline: true
    },
    {
      id: '2',
      name: 'RetroGamer_64',
      avatar: '🎮',
      rank: 'N64 Veteran',
      status: 'away',
      lastSeen: 'vor 5 Minuten',
      isOnline: false
    },
    {
      id: '3',
      name: 'PixelHunter',
      avatar: '🎯',
      rank: 'Glitch Finder',
      status: 'online',
      isOnline: true
    },
    {
      id: '4',
      name: 'TimeLord_99',
      avatar: '⏰',
      rank: 'World Record Holder',
      status: 'offline',
      lastSeen: 'vor 2 Stunden',
      isOnline: false
    },
    {
      id: '5',
      name: 'ICQ_Legend',
      avatar: '💬',
      rank: 'Chat Master',
      status: 'online',
      isOnline: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [friendCode, setFriendCode] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'friends' | 'add'>('friends');

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInviteToSpeedrun = (friendId: string) => {
    if (onInviteToSpeedrun) {
      onInviteToSpeedrun(friendId);
    }
    // Add visual feedback
    console.log(`Einladung an ${friends.find(f => f.id === friendId)?.name} gesendet!`);
  };

  const handleAddFriend = () => {
    if (friendCode.trim() && onAddFriend) {
      onAddFriend(friendCode.trim());
      setFriendCode('');
      setShowAddFriend(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#00FF00';
      case 'away': return '#FFFF00';
      case 'offline': return '#FF0000';
      default: return '#808080';
    }
  };

  const getStatusText = (friend: Friend) => {
    if (friend.isOnline) {
      return friend.status === 'away' ? 'Abwesend' : 'Online';
    }
    return friend.lastSeen || 'Offline';
  };

  return (
    <div className="freundesliste-container">
      {/* Header */}
      <div className="freundesliste-header">
        <h1 className="freundesliste-title">🏆 Freundesliste</h1>
        <div className="header-stats">
          <span className="online-count">
            {friends.filter(f => f.isOnline).length} Online
          </span>
          <span className="total-count">
            {friends.length} Freunde
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${selectedTab === 'friends' ? 'active' : ''}`}
          onClick={() => setSelectedTab('friends')}
        >
          👥 Freunde
        </button>
        <button
          className={`tab-button ${selectedTab === 'add' ? 'active' : ''}`}
          onClick={() => setSelectedTab('add')}
        >
          ➕ Freund hinzufügen
        </button>
      </div>

      {/* Friends Tab */}
      {selectedTab === 'friends' && (
        <div className="friends-content">
          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Freunde durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Friends List */}
          <div className="friends-list">
            {filteredFriends.map((friend) => (
              <div key={friend.id} className="friend-item">
                <div className="friend-avatar">
                  <span className="avatar-emoji">{friend.avatar}</span>
                  <div 
                    className="status-indicator"
                    style={{ backgroundColor: getStatusColor(friend.status) }}
                  ></div>
                </div>
                
                <div className="friend-info">
                  <div className="friend-name">{friend.name}</div>
                  <div className="friend-rank">{friend.rank}</div>
                  <div className="friend-status">
                    <span 
                      className="status-dot"
                      style={{ backgroundColor: getStatusColor(friend.status) }}
                    ></span>
                    {getStatusText(friend)}
                  </div>
                </div>

                <div className="friend-actions">
                  <button
                    className="invite-button"
                    onClick={() => handleInviteToSpeedrun(friend.id)}
                    disabled={!friend.isOnline}
                  >
                    🏁 Speedrun einladen
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredFriends.length === 0 && (
            <div className="no-friends">
              <div className="no-friends-icon">😔</div>
              <div className="no-friends-text">
                {searchTerm ? 'Keine Freunde gefunden' : 'Keine Freunde vorhanden'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Friend Tab */}
      {selectedTab === 'add' && (
        <div className="add-friend-content">
          <div className="add-friend-section">
            <h3>🔗 Freund per Code hinzufügen</h3>
            <div className="code-input-container">
              <input
                type="text"
                placeholder="Freundescode eingeben..."
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value)}
                className="code-input"
                maxLength={8}
              />
              <button
                className="add-friend-button"
                onClick={handleAddFriend}
                disabled={!friendCode.trim()}
              >
                Hinzufügen
              </button>
            </div>
          </div>

          <div className="add-friend-section">
            <h3>🔍 Freund suchen</h3>
            <div className="search-friend-container">
              <input
                type="text"
                placeholder="Benutzername eingeben..."
                className="search-friend-input"
              />
              <button className="search-friend-button">
                Suchen
              </button>
            </div>
          </div>

          <div className="your-code-section">
            <h3>📋 Dein Freundescode</h3>
            <div className="code-display">
              <span className="your-code">SPEEDRUN</span>
              <button className="copy-code-button">📋 Kopieren</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreundeslisteScreen;
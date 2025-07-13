import React, { useState } from 'react';
import Battle64Profile from './components/Battle64Profile';
import { PlayerProfile, SpecialAbility } from './types/battle64';
import './App.css';

const App: React.FC = () => {
  const [isPublic, setIsPublic] = useState(true);

  // Sample data for demonstration
  const sampleProfile: PlayerProfile = {
    id: '1',
    username: 'RetroKing93',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjNEE0QTRBIi8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjQwIiBmaWxsPSIjRkZENzAwIi8+CjxjaXJjbGUgY3g9IjQ1IiBjeT0iNDUiIHI9IjUiIGZpbGw9IiMwMDAwMDAiLz4KPGNpcmNsZSBjeD0iNzUiIGN5PSI0NSIgcj0iNSIgZmlsbD0iIzAwMDAwMCIvPgo8cGF0aCBkPSJNNDAgODBDNDAgODAgNTAgOTAgNjAgOTBDNzAgOTAgODAgODAgODAgODAiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo=',
    rankTitle: 'Elite',
    region: 'Deutschland',
    platform: 'Nintendo 64',
    fanPoints: 2847,
    xp: 7840,
    maxXp: 10000,
    favoriteGame: 'Super Mario 64',
    stats: {
      speed: 8.3,
      precision: 9.6,
      glitchMastery: 5.5,
      gameVariety: 13,
      originalHardware: true,
      eventActivity: 24,
      averageTime: '2:44',
      bestTime: '2:10',
      totalMaps: 7
    },
    medals: [
      {
        id: '1',
        name: 'Speed Demon',
        icon: '⚡',
        description: 'Completed 10 speedruns under world record time',
        rarity: 'gold',
        unlockedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'Glitch Master',
        icon: '🌟',
        description: 'Discovered 5 new glitches',
        rarity: 'silver',
        unlockedAt: new Date('2024-02-20')
      },
      {
        id: '3',
        name: 'Event Champion',
        icon: '🏆',
        description: 'Won 3 community events',
        rarity: 'platinum',
        unlockedAt: new Date('2024-03-10')
      },
      {
        id: '4',
        name: 'Dedicated Player',
        icon: '🎮',
        description: 'Played for 100 consecutive days',
        rarity: 'bronze',
        unlockedAt: new Date('2024-01-05')
      },
      {
        id: '5',
        name: 'Art Master',
        icon: '🎨',
        description: 'Created 5 highly-rated fanarts',
        rarity: 'gold',
        unlockedAt: new Date('2024-02-28')
      },
      {
        id: '6',
        name: 'Community Helper',
        icon: '🤝',
        description: 'Helped 50 new players',
        rarity: 'silver',
        unlockedAt: new Date('2024-03-15')
      }
    ],
    isPublic: isPublic,
    specialAbility: {
      type: 'allrounder',
      name: 'Allrounder',
      description: 'Ein vielseitiger Spieler, der in allen Bereichen überdurchschnittlich abschneidet. Perfekt für Team-Events und Community-Aktivitäten.',
      icon: '🌟',
      requirements: [
        'Überdurchschnittlich in 3+ Kategorien',
        'Mindestens 10 verschiedene Spiele',
        'Aktive Community-Teilnahme'
      ]
    }
  };

  const handleTogglePrivacy = (newPrivacy: boolean) => {
    setIsPublic(newPrivacy);
    console.log(`Profile privacy changed to: ${newPrivacy ? 'public' : 'private'}`);
  };

  const handleViewGallery = () => {
    console.log('Opening gallery...');
    alert('🖼️ Galerie wird geöffnet...');
  };

  const handleAddFriend = () => {
    console.log('Adding friend...');
    alert('👥 Freundschaftsanfrage gesendet!');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🎮 Battle64 Nexus</h1>
        <p className="app-subtitle">Profilkarte & Spielerstats im PES-Stil</p>
      </header>

      <main className="app-main">
        <Battle64Profile
          profile={sampleProfile}
          onTogglePrivacy={handleTogglePrivacy}
          onViewGallery={handleViewGallery}
          onAddFriend={handleAddFriend}
        />
      </main>

      <footer className="app-footer">
        <p>© 2024 Battle64 Nexus - Retro Gaming Community</p>
      </footer>
    </div>
  );
};

export default App;
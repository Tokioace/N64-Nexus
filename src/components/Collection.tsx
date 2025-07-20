'use client';

import { useState } from 'react';
import { 
  Gamepad2, 
  Search, 
  Star, 
  Trophy
} from 'lucide-react';

interface Game {
  id: number;
  title: string;
  region: 'PAL' | 'NTSC';
  rating: number;
  completion: number;
  cartridgeColor: string;
}

export default function Collection() {
  const [games, setGames] = useState<Game[]>([
    {
      id: 1,
      title: "Super Mario 64",
      region: "PAL",
      rating: 5,
      completion: 100,
      cartridgeColor: "from-yellow-400 to-orange-500"
    },
    {
      id: 2,
      title: "The Legend of Zelda: Ocarina of Time",
      region: "PAL",
      rating: 5,
      completion: 85,
      cartridgeColor: "from-green-400 to-emerald-500"
    },
    {
      id: 3,
      title: "GoldenEye 007",
      region: "PAL",
      rating: 4,
      completion: 60,
      cartridgeColor: "from-blue-400 to-cyan-500"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState<'all' | 'PAL' | 'NTSC'>('all');

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'all' || game.region === filterRegion;
    return matchesSearch && matchesRegion;
  });

  const totalPoints = games.length * 100;
  const completionRate = (games.reduce((sum, game) => sum + game.completion, 0) / games.length) || 0;

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 neon-text">Deine Sammlung</h1>
          <p className="text-xl text-cyan-300 mb-8">
            Katalogisiere deine physischen N64-Spiele und sammle Punkte!
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <div className="retro-card text-center">
              <div className="text-3xl font-bold text-cyan-300">{games.length}</div>
              <div className="text-gray-300">Spiele</div>
            </div>
            <div className="retro-card text-center">
              <div className="text-3xl font-bold text-yellow-300">{totalPoints}</div>
              <div className="text-gray-300">Punkte</div>
            </div>
            <div className="retro-card text-center">
              <div className="text-3xl font-bold text-green-300">{Math.round(completionRate)}%</div>
              <div className="text-gray-300">Durchschnitt</div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Spiel suchen..."
              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-3 bg-black/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value as 'all' | 'PAL' | 'NTSC')}
          >
            <option value="all">Alle Regionen</option>
            <option value="PAL">PAL</option>
            <option value="NTSC">NTSC</option>
          </select>
          <button className="neon-button flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 mr-2" />
            Spiel hinzufügen
          </button>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game, index) => (
            <div
              key={game.id}
              className="retro-card group cursor-pointer"
            >
              {/* Cartridge */}
              <div className={`w-full h-32 bg-gradient-to-b ${game.cartridgeColor} rounded-lg mb-4 relative overflow-hidden group-hover:scale-105 transition-transform`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-2 left-2 right-2 h-1 bg-black/30 rounded"></div>
                <div className="absolute top-2 right-2 text-xs font-bold text-white bg-black/50 px-2 py-1 rounded">
                  {game.region}
                </div>
              </div>

              {/* Game Info */}
              <h3 className="text-lg font-bold mb-2 text-cyan-300">{game.title}</h3>
              
              {/* Rating */}
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < game.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                  />
                ))}
              </div>

              {/* Completion */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-300 mb-1">
                  <span>Fortschritt</span>
                  <span>{game.completion}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${game.completion}%` }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 py-2 rounded transition-colors">
                  Bearbeiten
                </button>
                <button className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 py-2 px-3 rounded transition-colors">
                  <Trophy className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 && (
          <div
            className="text-center py-12"
          >
            <div className="w-24 h-32 bg-gradient-to-b from-gray-400 to-gray-600 rounded-lg mx-auto mb-4"></div>
            <h3 className="text-xl font-bold mb-2 text-gray-300">Keine Spiele gefunden</h3>
            <p className="text-gray-500 mb-6">Füge dein erstes N64-Spiel zur Sammlung hinzu!</p>
            <button className="neon-button">
              <Gamepad2 className="w-5 h-5 mr-2" />
              Erstes Spiel hinzufügen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
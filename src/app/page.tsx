'use client';

import { useState } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  Users, 
  Star, 
  MapPin, 
  MessageCircle,
  Calendar,
  Target
} from 'lucide-react';
import Events from '@/components/Events';

export default function Home() {
  const [showEvents, setShowEvents] = useState(false);

  if (showEvents) {
    return <Events />;
  }

  const features = [
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: "📦 Sammlung",
      description: "Katalogisiere deine physischen Spiele und sammle animierte N64-Cartridges als Belohnung!",
      color: "from-cyan-400 to-blue-500"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "🏁 Events",
      description: "Regelmäßige Zeitrennen mit Live-Bestenlisten und festen Spiel-Stages.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "🌍 PAL & NTSC",
      description: "Getrennte Ranglisten für PAL- und NTSC-Versionen der Spiele.",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "💬 Community",
      description: "Live-Chat während Events, Freundesliste und detaillierte Nutzerprofile.",
      color: "from-pink-400 to-purple-500"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "⭐ Bewertung",
      description: "Bewerte Spiele nach Gameplay, Musik und Nostalgie-Faktor.",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "🗺️ Sammlerkarte",
      description: "Teile deinen Standort und finde Events und Sammler in deiner Region.",
      color: "from-red-400 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 neon-text">BATTLE64</h1>
            <p className="text-xl md:text-2xl mb-8 text-cyan-300">
              Retro neu entfacht • Die N64-Community für Millennials
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="neon-button">Jetzt Registrieren</button>
              <button className="retro-card hover:scale-105 transition-transform">Mehr Erfahren</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 neon-text">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="retro-card cursor-pointer group hover:scale-105 transition-transform"
                onClick={() => feature.title.includes('Events') && setShowEvents(true)}
              >
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-cyan-300">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Events Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/20 to-cyan-900/20">
        <div className="container mx-auto text-center">
          <div>
            <h2 className="text-4xl font-bold mb-8 neon-text">Live Events</h2>
            <div className="retro-card max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-cyan-400 mr-3" />
                <span className="text-xl font-bold text-cyan-300">Nächster Event</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Super Mario 64 Speedrun</h3>
              <p className="text-gray-300 mb-6">Samstag, 20:00 Uhr • Live-Bestenliste • Community-Chat</p>
              <div className="flex justify-center gap-4">
                <button className="neon-button">
                  <Target className="w-5 h-5 mr-2" />
                  Teilnehmen
                </button>
                <button className="retro-card">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat öffnen
                </button>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-700">
                <button 
                  onClick={() => setShowEvents(true)}
                  className="text-cyan-300 hover:text-cyan-100 transition-colors text-sm font-medium"
                >
                  Alle Events anzeigen →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div>
            <h2 className="text-4xl font-bold mb-8 neon-text">Deine Sammlung</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="retro-card p-4 text-center hover:scale-105 transition-transform"
                >
                  <div className="w-12 h-16 bg-gradient-to-b from-yellow-400 to-orange-500 rounded mx-auto mb-2"></div>
                  <p className="text-sm text-cyan-300">Spiel {i + 1}</p>
                </div>
              ))}
            </div>
            <button className="neon-button mt-8">Sammlung erweitern</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-cyan-500/20">
        <div className="container mx-auto text-center">
          <p className="text-cyan-300 mb-4">Battle64 - Retro neu entfacht</p>
          <p className="text-gray-400 text-sm">Für Millennials, die mit der N64-Ära aufgewachsen sind</p>
        </div>
      </footer>
    </div>
  );
}

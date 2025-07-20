'use client';

import { useState } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  Users, 
  Star, 
  MapPin, 
  MessageCircle,
  Menu,
  X,
  User
} from 'lucide-react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Sammlung', icon: <Gamepad2 className="w-5 h-5" />, href: '#collection' },
    { name: 'Events', icon: <Trophy className="w-5 h-5" />, href: '#events' },
    { name: 'Community', icon: <Users className="w-5 h-5" />, href: '#community' },
    { name: 'Bewertungen', icon: <Star className="w-5 h-5" />, href: '#ratings' },
    { name: 'Karte', icon: <MapPin className="w-5 h-5" />, href: '#map' },
    { name: 'Chat', icon: <MessageCircle className="w-5 h-5" />, href: '#chat' },
    { name: 'Profil', icon: <User className="w-5 h-5" />, href: '/profile' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-cyan-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded"></div>
            <span className="text-xl font-bold neon-text">BATTLE64</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-gray-300 hover:text-cyan-300 transition-colors duration-200 group"
              >
                <span className="group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </a>
            ))}
          </div>

          {/* Register Button */}
          <button className="hidden md:block neon-button">
            Registrieren
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-cyan-300 hover:text-cyan-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-cyan-500/20">
            <div className="space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              ))}
              <div className="px-4 pt-4">
                <button className="w-full neon-button">
                  Registrieren
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
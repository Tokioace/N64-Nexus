'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  Trophy, 
  Users, 
  Star, 
  MapPin, 
  MessageCircle,
  Menu,
  X
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
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-cyan-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded glow-effect"></div>
            <span className="text-xl font-bold neon-text">BATTLE64</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-gray-300 hover:text-cyan-300 transition-colors duration-200 group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                <span>{item.name}</span>
              </motion.a>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            className="hidden md:block neon-button"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Registrieren
          </motion.button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-cyan-300 hover:text-cyan-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-cyan-500/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 text-gray-300 hover:text-cyan-300 transition-colors duration-200 py-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </motion.a>
              ))}
              <motion.button
                className="neon-button w-full mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                Registrieren
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
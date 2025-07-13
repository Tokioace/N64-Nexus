'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Users, Calendar, Gift } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-n64-purple via-n64-blue to-n64-green">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="font-retro text-5xl md:text-7xl text-white mb-6 drop-shadow-lg">
            🏆 Battle64
          </h1>
          <h2 className="font-retro text-2xl md:text-4xl text-yellow-300 mb-8 drop-shadow-lg">
            Achievement System
          </h2>
          <p className="text-xl text-white mb-12 max-w-3xl mx-auto opacity-90">
            Ein umfassendes Achievement- und Trophäensystem mit Retro-Charme und 
            Pokémon-ähnlichem Sammelreiz für die N64-Community.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <motion.a
              href="/demo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4"
            >
              🎮 Demo Starten
            </motion.a>
            <motion.a
              href="#features"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-lg px-8 py-4"
            >
              📋 Features
            </motion.a>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="card-retro p-6 text-center"
          >
            <Trophy className="w-12 h-12 text-gold mx-auto mb-4" />
            <h3 className="font-retro text-lg text-gray-800 mb-2">Trophy System</h3>
            <p className="text-gray-600">
              Bronze, Silber, Gold und Platin Trophäen mit einzigartigen Belohnungen
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="card-retro p-6 text-center"
          >
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="font-retro text-lg text-gray-800 mb-2">Seltenheit</h3>
            <p className="text-gray-600">
              Von Common bis Legendary - sammle die seltensten Achievements
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="card-retro p-6 text-center"
          >
            <Zap className="w-12 h-12 text-n64-blue mx-auto mb-4" />
            <h3 className="font-retro text-lg text-gray-800 mb-2">Automatik</h3>
            <p className="text-gray-600">
              Server-basierte Logik mit JSON-Regeln für automatische Freischaltung
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="card-retro p-6 text-center"
          >
            <Users className="w-12 h-12 text-n64-green mx-auto mb-4" />
            <h3 className="font-retro text-lg text-gray-800 mb-2">Community</h3>
            <p className="text-gray-600">
              Öffentliche Profile, Community-Ticker und Gruppenbenachrichtigungen
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="card-retro p-6 text-center"
          >
            <Calendar className="w-12 h-12 text-n64-red mx-auto mb-4" />
            <h3 className="font-retro text-lg text-gray-800 mb-2">Events</h3>
            <p className="text-gray-600">
              Limitierte Challenges und zeitbasierte Events
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="card-retro p-6 text-center"
          >
            <Gift className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="font-retro text-lg text-gray-800 mb-2">Belohnungen</h3>
            <p className="text-gray-600">
              Titel, kosmetische Items und XP-Belohnungen
            </p>
          </motion.div>
        </div>

        {/* Achievement Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center"
        >
          <h3 className="font-retro text-3xl text-white mb-8">Achievement-Kategorien</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-white">
              <div className="text-2xl mb-2">🎮</div>
              <div className="font-semibold">Spielspezifisch</div>
              <div className="text-sm opacity-75">Rainbow Road Master</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-white">
              <div className="text-2xl mb-2">🕹️</div>
              <div className="font-semibold">Plattformbezogen</div>
              <div className="text-sm opacity-75">NTSC Speedrun Pioneer</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-white">
              <div className="text-2xl mb-2">🧑‍🤝‍🧑</div>
              <div className="font-semibold">Community</div>
              <div className="text-sm opacity-75">Fanart Kritiker</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-white">
              <div className="text-2xl mb-2">📦</div>
              <div className="font-semibold">Sammlerstücke</div>
              <div className="text-sm opacity-75">Seltenstes Item Sammler</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-white">
              <div className="text-2xl mb-2">🔁</div>
              <div className="font-semibold">Wiederholte Teilnahme</div>
              <div className="text-sm opacity-75">Event Marathon</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 text-white">
              <div className="text-2xl mb-2">👑</div>
              <div className="font-semibold">Limitierte Challenges</div>
              <div className="text-sm opacity-75">Oktoberfest-Champion 2025</div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="text-center mt-16"
        >
          <h3 className="font-retro text-2xl text-white mb-4">
            Bereit für das Abenteuer?
          </h3>
          <motion.a
            href="/demo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary text-xl px-10 py-4 inline-block"
          >
            🚀 Demo Starten
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
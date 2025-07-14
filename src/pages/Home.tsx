import React from 'react'
import { Link } from 'react-router-dom'
import { Camera, Trophy, Star } from 'lucide-react'

const Home: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-pixel text-retro-purple mb-4">
          N64-Nexus
        </h1>
        <p className="text-xl text-retro-light mb-8">
          Dein Battle64 Modulscanner für die perfekte Retro-Sammlung
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/scanner"
            className="retro-button flex items-center justify-center space-x-2 text-lg"
          >
            <Camera size={24} />
            <span>Spiel scannen</span>
          </Link>
          
          <Link
            to="/collection"
            className="retro-button flex items-center justify-center space-x-2 text-lg bg-retro-green hover:bg-retro-blue"
          >
            <Trophy size={24} />
            <span>Sammlung anzeigen</span>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="retro-card text-center">
          <div className="w-16 h-16 bg-retro-purple rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-pixel text-retro-yellow mb-2">Modulscanner</h3>
          <p className="text-retro-light">
            Scanne deine N64-Module und füge sie automatisch deiner Sammlung hinzu
          </p>
        </div>

        <div className="retro-card text-center">
          <div className="w-16 h-16 bg-retro-green rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-pixel text-retro-yellow mb-2">Sammlungsverwaltung</h3>
          <p className="text-retro-light">
            Verwalte deine Retro-Sammlung mit detaillierten Informationen und Statistiken
          </p>
        </div>

        <div className="retro-card text-center">
          <div className="w-16 h-16 bg-retro-yellow rounded-full flex items-center justify-center mx-auto mb-4">
            <Star size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-pixel text-retro-yellow mb-2">Gamification</h3>
          <p className="text-retro-light">
            Sammle Punkte, erreiche Titel und vergleiche dich mit anderen Sammlern
          </p>
        </div>
      </div>

      <div className="retro-card">
        <h2 className="text-2xl font-pixel text-retro-purple mb-4">🎮 Wie funktioniert der Scanner?</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <span className="text-retro-yellow font-pixel text-lg">1.</span>
            <p className="text-retro-light">Halte dein N64-Modul oder die Verpackung vor die Kamera</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-retro-yellow font-pixel text-lg">2.</span>
            <p className="text-retro-light">Die KI erkennt automatisch das Spiel durch Cover und Textelemente</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-retro-yellow font-pixel text-lg">3.</span>
            <p className="text-retro-light">Füge es deiner Sammlung hinzu oder schaue dir detaillierte Infos an</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-retro-yellow font-pixel text-lg">4.</span>
            <p className="text-retro-light">Sammle Punkte und erreiche neue Titel als "Scan-Experte"</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
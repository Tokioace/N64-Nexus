import React from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { Brain, Clock, Calendar, Zap, Trophy, Star, Gamepad2 } from 'lucide-react'
import RetroCard3D from '../components/RetroCard3D'
import RetroButton3D from '../components/RetroButton3D'
import RetroSwitch3D from '../components/RetroSwitch3D'
import { useRetroSounds } from '../components/RetroSoundEffects'

const HomePage: React.FC = () => {
  const { user } = useUser()
  const { playStartSound, playPowerUpSound } = useRetroSounds()
  const [soundEnabled, setSoundEnabled] = React.useState(true)

  if (!user) return null

  const accuracy = user.totalAnswers > 0 
    ? Math.round((user.correctAnswers / user.totalAnswers) * 100) 
    : 0

  const handleStartQuiz = () => {
    playStartSound()
  }

  const handlePowerUp = () => {
    playPowerUpSound()
  }

  return (
    <div className="container mx-auto px-4 py-6 perspective-1000">
      {/* Header */}
      <div className="text-center mb-8 animate-float">
        <h1 className="text-4xl font-bold text-shadow-lg mb-2 neon-text text-n64-purple font-tech">
          🎮 Willkommen, {user.username}!
        </h1>
        <p className="text-white/70 font-game text-lg">
          Level {user.level} • {user.points} Punkte
        </p>
        
        {/* Sound Toggle */}
        <div className="mt-4 flex justify-center">
          <RetroSwitch3D
            isOn={soundEnabled}
            onToggle={() => setSoundEnabled(!soundEnabled)}
            label="Sounds"
            variant="primary"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <RetroCard3D
          variant="success"
          hover3D={true}
          className="text-center animate-bounce-in"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="text-3xl font-bold text-n64-green font-tech mb-2">{accuracy}%</div>
          <div className="text-sm text-white/70 font-game">Genauigkeit</div>
        </RetroCard3D>
        
        <RetroCard3D
          variant="secondary"
          hover3D={true}
          className="text-center animate-bounce-in"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="text-3xl font-bold text-n64-blue font-tech mb-2">{user.totalQuizzes}</div>
          <div className="text-sm text-white/70 font-game">Quizzes gespielt</div>
        </RetroCard3D>
        
        <RetroCard3D
          variant="primary"
          hover3D={true}
          className="text-center animate-bounce-in"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="text-3xl font-bold text-n64-yellow font-tech mb-2">{user.correctAnswers}</div>
          <div className="text-sm text-white/70 font-game">Richtige Antworten</div>
        </RetroCard3D>
        
        <RetroCard3D
          variant="primary"
          hover3D={true}
          className="text-center animate-bounce-in"
          style={{ animationDelay: '0.4s' }}
          onClick={handlePowerUp}
        >
          <div className="text-3xl font-bold text-n64-purple font-tech mb-2">{user.achievements.length}</div>
          <div className="text-sm text-white/70 font-game">Errungenschaften</div>
        </RetroCard3D>
      </div>

      {/* Quiz Modes */}
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-bold text-shadow-lg mb-6 text-center font-tech neon-text text-n64-blue">
          Quiz-Modi
        </h2>
        
        <Link to="/quiz" className="block">
          <RetroCard3D
            title="Klassisches Quiz"
            icon={Brain}
            variant="primary"
            hover3D={true}
            className="animate-slide-in-left"
            onClick={handleStartQuiz}
          >
            <p className="text-white/70 text-sm font-game mb-4">10 zufällige Fragen zu N64</p>
            <div className="flex justify-between items-center">
              <span className="text-n64-purple font-tech">⭐ Standard</span>
              <div className="text-n64-purple animate-pulse">
                <Star size={20} />
              </div>
            </div>
          </RetroCard3D>
        </Link>

        <Link to="/quiz?mode=daily" className="block">
          <RetroCard3D
            title="Tägliche Challenge"
            icon={Calendar}
            variant="secondary"
            hover3D={true}
            className="animate-slide-in-right"
            onClick={handleStartQuiz}
          >
            <p className="text-white/70 text-sm font-game mb-4">5 Fragen, jeden Tag neu</p>
            <div className="flex justify-between items-center">
              <span className="text-n64-blue font-tech">⏰ Täglich</span>
              <div className="text-n64-blue animate-pulse">
                <Clock size={20} />
              </div>
            </div>
          </RetroCard3D>
        </Link>

        <Link to="/quiz?mode=speed" className="block">
          <RetroCard3D
            title="Speed Quiz"
            icon={Zap}
            variant="danger"
            hover3D={true}
            className="animate-slide-in-left"
            onClick={handleStartQuiz}
          >
            <p className="text-white/70 text-sm font-game mb-4">Schnell antworten für Bonuspunkte</p>
            <div className="flex justify-between items-center">
              <span className="text-n64-red font-tech">⚡ Schnell</span>
              <div className="text-n64-red animate-pulse">
                <Zap size={20} />
              </div>
            </div>
          </RetroCard3D>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link to="/minigames" className="block">
          <RetroCard3D
            title="Minigames"
            icon={Gamepad2}
            variant="success"
            hover3D={true}
            className="text-center animate-bounce-in"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="text-4xl mb-3 animate-float">🎮</div>
            <div className="text-sm text-white/70 font-game">Spaßige Spiele</div>
          </RetroCard3D>
        </Link>
        
        <Link to="/leaderboard" className="block">
          <RetroCard3D
            title="Rangliste"
            icon={Trophy}
            variant="primary"
            hover3D={true}
            className="text-center animate-bounce-in"
            style={{ animationDelay: '0.6s' }}
          >
            <div className="text-4xl mb-3 animate-float">🏆</div>
            <div className="text-sm text-white/70 font-game">Vergleiche dich</div>
          </RetroCard3D>
        </Link>
      </div>

      {/* Recent Achievements */}
      {user.achievements.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-shadow-lg mb-6 text-center font-tech neon-text text-n64-yellow">
            Letzte Errungenschaften
          </h2>
          <div className="space-y-4">
            {user.achievements.slice(-3).map((achievement, index) => (
              <RetroCard3D
                key={achievement.id}
                variant="success"
                hover3D={true}
                className="animate-slide-in-left"
                style={{ animationDelay: `${0.7 + index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl animate-pulse">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-bold font-tech text-lg text-n64-yellow">{achievement.name}</div>
                    <div className="text-sm text-white/70 font-game">{achievement.description}</div>
                  </div>
                  <div className="text-n64-yellow animate-bounce">
                    <Trophy size={24} />
                  </div>
                </div>
              </RetroCard3D>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { playSound, playBackgroundMusic, toggleMute, getVolume, isSoundMuted } from '../utils/SoundManager';

// Sound-Dateien
const buttonClickSound = '/sounds/button-click.mp3';
const achievementUnlockedSound = '/sounds/achievement-unlocked.mp3';
const levelUpSound = '/sounds/level-up.mp3';
const bgMusicSound = '/sounds/bg-theme.mp3';

const Battle64App: React.FC = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.6);

  useEffect(() => {
    // Starte Hintergrundmusik nach User-Interaktion
    const handleFirstInteraction = () => {
      playBackgroundMusic(bgMusicSound);
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const handleScoreIncrease = () => {
    const newScore = score + 10;
    setScore(newScore);
    playSound(buttonClickSound);

    // Level Up bei bestimmten Scores
    const newLevel = Math.floor(newScore / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      playSound(levelUpSound);
    }

    // Achievement bei 50 Punkten
    if (newScore === 50 && !achievements.includes('Erste Schritte')) {
      setAchievements([...achievements, 'Erste Schritte']);
      playSound(achievementUnlockedSound);
    }

    // Achievement bei 100 Punkten
    if (newScore === 100 && !achievements.includes('Kampfmeister')) {
      setAchievements([...achievements, 'Kampfmeister']);
      playSound(achievementUnlockedSound);
    }
  };

  const handleMuteToggle = () => {
    toggleMute();
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    // Volume wird über SoundManager verwaltet
  };

  return (
    <div className="battle64-app">
      <Sidebar>
        <div className="sidebar-stats">
          <div className="stat-item">
            <span className="stat-label">Score:</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Level:</span>
            <span className="stat-value">{level}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Achievements:</span>
            <span className="stat-value">{achievements.length}</span>
          </div>
        </div>
        
        <div className="achievements-list">
          <h3>Achievements</h3>
          {achievements.map((achievement, index) => (
            <div key={index} className="achievement-item">
              🏅 {achievement}
            </div>
          ))}
        </div>
      </Sidebar>

      <main className="main-content">
        <div className="game-header">
          <h1 className="game-title">Battle64</h1>
          <div className="game-subtitle">Retro N64 Experience</div>
        </div>

        <div className="game-stats">
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <div className="stat-number">{score}</div>
              <div className="stat-label">Score</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <div className="stat-number">{level}</div>
              <div className="stat-label">Level</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🏅</div>
            <div className="stat-info">
              <div className="stat-number">{achievements.length}</div>
              <div className="stat-label">Achievements</div>
            </div>
          </div>
        </div>

        <div className="game-actions">
          <button 
            className="action-button primary"
            onClick={handleScoreIncrease}
          >
            🎮 Kampf starten
          </button>
          
          <button 
            className="action-button secondary"
            onClick={handleMuteToggle}
          >
            {isMuted ? '🔇' : '🔊'} {isMuted ? 'Stummschaltung aufheben' : 'Stummschalten'}
          </button>
        </div>

        <div className="volume-control">
          <label htmlFor="volume-slider">🔊 Lautstärke</label>
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="volume-slider"
          />
          <span className="volume-value">{Math.round(volume * 100)}%</span>
        </div>

        <div className="retro-decoration">
          <div className="n64-controller">🎮</div>
          <div className="pixel-art">⚡</div>
        </div>
      </main>

      <style jsx>{`
        .battle64-app {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f23, #1a1a2e);
          color: #ffffff;
          font-family: 'Courier New', monospace;
          overflow-x: hidden;
        }

        .main-content {
          padding: 20px;
          margin-left: 0;
          transition: margin-left 0.3s ease;
        }

        .game-header {
          text-align: center;
          margin-bottom: 40px;
          padding: 40px 20px;
          background: linear-gradient(135deg, #16213e, #0f3460);
          border-radius: 20px;
          border: 3px solid #00ff88;
          box-shadow: 
            0 8px 32px rgba(0, 255, 136, 0.3),
            inset 0 2px 4px rgba(255, 255, 255, 0.1);
        }

        .game-title {
          font-size: 48px;
          font-weight: bold;
          color: #00ff88;
          margin: 0;
          text-shadow: 
            0 0 20px rgba(0, 255, 136, 0.8),
            2px 2px 4px rgba(0, 0, 0, 0.5);
          letter-spacing: 4px;
        }

        .game-subtitle {
          font-size: 18px;
          color: #888;
          margin-top: 10px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .game-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
          border: 2px solid #4a4a4a;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: all 0.3s ease;
          box-shadow: 
            0 4px 8px rgba(0, 0, 0, 0.3),
            inset 0 1px 2px rgba(255, 255, 255, 0.1);
        }

        .stat-card:hover {
          border-color: #00ff88;
          transform: translateY(-4px);
          box-shadow: 
            0 8px 16px rgba(0, 255, 136, 0.3),
            inset 0 1px 2px rgba(255, 255, 255, 0.15);
        }

        .stat-icon {
          font-size: 32px;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, #00ff88, #00cc6a);
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .stat-info {
          flex: 1;
        }

        .stat-number {
          font-size: 24px;
          font-weight: bold;
          color: #00ff88;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .game-actions {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .action-button {
          padding: 15px 30px;
          font-size: 18px;
          font-weight: bold;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Courier New', monospace;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 
            0 4px 8px rgba(0, 0, 0, 0.3),
            inset 0 1px 2px rgba(255, 255, 255, 0.1);
        }

        .action-button.primary {
          background: linear-gradient(145deg, #00ff88, #00cc6a);
          color: #1a1a2e;
        }

        .action-button.secondary {
          background: linear-gradient(145deg, #4a4a4a, #2a2a2a);
          color: #ffffff;
          border: 2px solid #6a6a6a;
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 6px 12px rgba(0, 0, 0, 0.4),
            inset 0 1px 2px rgba(255, 255, 255, 0.15);
        }

        .action-button:active {
          transform: translateY(0);
        }

        .volume-control {
          display: flex;
          align-items: center;
          gap: 15px;
          justify-content: center;
          margin-bottom: 40px;
          padding: 20px;
          background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
          border-radius: 12px;
          border: 2px solid #4a4a4a;
        }

        .volume-control label {
          font-weight: bold;
          color: #00ff88;
          min-width: 100px;
        }

        .volume-slider {
          width: 200px;
          height: 8px;
          background: #4a4a4a;
          border-radius: 4px;
          outline: none;
          -webkit-appearance: none;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: #00ff88;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .volume-value {
          font-weight: bold;
          color: #00ff88;
          min-width: 40px;
        }

        .retro-decoration {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-top: 40px;
        }

        .n64-controller, .pixel-art {
          font-size: 48px;
          animation: float 3s ease-in-out infinite;
        }

        .n64-controller {
          animation-delay: 0s;
        }

        .pixel-art {
          animation-delay: 1.5s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .sidebar-stats {
          margin-bottom: 20px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #4a4a4a;
        }

        .stat-label {
          color: #888;
          font-size: 14px;
        }

        .stat-value {
          color: #00ff88;
          font-weight: bold;
          font-size: 16px;
        }

        .achievements-list {
          margin-top: 20px;
        }

        .achievements-list h3 {
          color: #00ff88;
          margin-bottom: 15px;
          font-size: 18px;
        }

        .achievement-item {
          background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
          border: 1px solid #4a4a4a;
          border-radius: 6px;
          padding: 10px 15px;
          margin-bottom: 8px;
          font-size: 14px;
          color: #ffffff;
          transition: all 0.2s ease;
        }

        .achievement-item:hover {
          border-color: #00ff88;
          box-shadow: 0 2px 4px rgba(0, 255, 136, 0.2);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .game-title {
            font-size: 36px;
          }
          
          .game-stats {
            grid-template-columns: 1fr;
          }
          
          .game-actions {
            flex-direction: column;
            align-items: center;
          }
          
          .volume-control {
            flex-direction: column;
            gap: 10px;
          }
          
          .volume-slider {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Battle64App;
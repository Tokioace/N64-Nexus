import React, { useState, useRef } from 'react';
import './SpeedrunEventScreen.css';

interface SpeedrunResult {
  id: string;
  username: string;
  time: string;
  timestamp: Date;
  points: number;
}

interface SpeedrunEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  game: string;
  track: string;
}

interface SpeedrunEventScreenProps {
  event?: SpeedrunEvent;
}

const SpeedrunEventScreen: React.FC<SpeedrunEventScreenProps> = ({ 
  event = {
    id: '1',
    title: 'Rainbow Road PAL – Samstag 20:00',
    startTime: new Date('2024-01-20T20:00:00'),
    endTime: new Date('2024-01-20T22:00:00'),
    game: 'Mario Kart 64',
    track: 'Rainbow Road'
  }
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [results, setResults] = useState<SpeedrunResult[]>([
    {
      id: '1',
      username: 'SpeedKing64',
      time: '2:15.432',
      timestamp: new Date('2024-01-20T20:15:00'),
      points: 100
    },
    {
      id: '2',
      username: 'RetroRacer',
      time: '2:18.156',
      timestamp: new Date('2024-01-20T20:18:00'),
      points: 85
    },
    {
      id: '3',
      username: 'N64Master',
      time: '2:20.789',
      timestamp: new Date('2024-01-20T20:22:00'),
      points: 70
    },
    {
      id: '4',
      username: 'PixelPerfect',
      time: '2:22.341',
      timestamp: new Date('2024-01-20T20:25:00'),
      points: 55
    },
    {
      id: '5',
      username: 'VintageViper',
      time: '2:25.123',
      timestamp: new Date('2024-01-20T20:28:00'),
      points: 40
    }
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleScreenshotCapture = () => {
    // Simulate taking a screenshot with the app
    console.log('Taking screenshot with app...');
    // In a real implementation, this would trigger the device camera or screen capture
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const sortedResults = [...results].sort((a, b) => {
    const timeA = parseFloat(a.time.replace(':', ''));
    const timeB = parseFloat(b.time.replace(':', ''));
    return timeA - timeB;
  });

  return (
    <div className="speedrun-event-screen">
      {/* Header with Event Title */}
      <header className="event-header">
        <div className="event-title">
          <h1>{event.title}</h1>
          <div className="event-subtitle">
            <span className="game-name">{event.game}</span>
            <span className="track-name">{event.track}</span>
          </div>
        </div>
      </header>

      {/* Time Window */}
      <section className="time-window">
        <div className="time-display">
          <div className="time-item">
            <span className="time-label">Start</span>
            <span className="time-value">{formatTime(event.startTime)}</span>
          </div>
          <div className="time-separator">—</div>
          <div className="time-item">
            <span className="time-label">Ende</span>
            <span className="time-value">{formatTime(event.endTime)}</span>
          </div>
        </div>
      </section>

      {/* Upload Area */}
      <section className="upload-section">
        <div className="upload-area">
          <h3>Upload Screenshot oder Video</h3>
          <div 
            className={`upload-zone ${uploadedFile ? 'has-file' : ''}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploadedFile ? (
              <div className="file-info">
                <span className="file-name">{uploadedFile.name}</span>
                <span className="file-size">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon">📁</div>
                <p>Klicke hier oder ziehe Datei hierher</p>
                <span className="upload-hint">Screenshot oder Video</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          
          <button 
            className="screenshot-button"
            onClick={handleScreenshotCapture}
          >
            📸 Screenshot mit App machen
          </button>
        </div>
      </section>

      {/* Results and Leaderboard */}
      <section className="results-section">
        <div className="results-header">
          <h3>Letzte Ergebnisse</h3>
          <div className="results-count">{results.length} Teilnehmer</div>
        </div>
        
        <div className="results-list">
          {sortedResults.map((result, index) => (
            <div key={result.id} className={`result-item rank-${index + 1}`}>
              <div className="result-rank">#{index + 1}</div>
              <div className="result-user">
                <span className="username">{result.username}</span>
                <span className="timestamp">
                  {result.timestamp.toLocaleTimeString('de-DE', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              <div className="result-time">{result.time}</div>
              <div className="result-points">{result.points} Pkt</div>
            </div>
          ))}
        </div>
      </section>

      {/* Points Display */}
      <section className="points-section">
        <div className="points-header">
          <h3>Punkteverteilung</h3>
        </div>
        <div className="points-grid">
          <div className="point-item">
            <span className="point-rank">1.</span>
            <span className="point-value">100 Pkt</span>
          </div>
          <div className="point-item">
            <span className="point-rank">2.</span>
            <span className="point-value">85 Pkt</span>
          </div>
          <div className="point-item">
            <span className="point-rank">3.</span>
            <span className="point-value">70 Pkt</span>
          </div>
          <div className="point-item">
            <span className="point-rank">4.</span>
            <span className="point-value">55 Pkt</span>
          </div>
          <div className="point-item">
            <span className="point-rank">5.</span>
            <span className="point-value">40 Pkt</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpeedrunEventScreen;
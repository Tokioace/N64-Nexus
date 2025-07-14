import React, { useState, useRef, useEffect } from 'react';
import './ModulScannerScreen.css';

interface CartridgeInfo {
  name: string;
  region: 'PAL' | 'NTSC';
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  marketValue: number;
  trivia: string;
  authenticity: 'Echt' | 'Scan erforderlich';
  imageUrl?: string;
}

const ModulScannerScreen: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<CartridgeInfo | null>(null);
  const [showAddToCollection, setShowAddToCollection] = useState(false);
  const [ledStatus, setLedStatus] = useState<'off' | 'scanning' | 'success' | 'error'>('off');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock cartridge database
  const cartridgeDatabase: CartridgeInfo[] = [
    {
      name: 'Super Mario 64',
      region: 'PAL',
      condition: 'Excellent',
      marketValue: 45,
      trivia: 'Das erste 3D-Platformer-Spiel von Nintendo. Entwickelt von Shigeru Miyamoto und veröffentlicht 1996.',
      authenticity: 'Echt'
    },
    {
      name: 'The Legend of Zelda: Ocarina of Time',
      region: 'NTSC',
      condition: 'Good',
      marketValue: 35,
      trivia: 'Wurde von vielen als eines der besten Spiele aller Zeiten bezeichnet. Veröffentlicht 1998.',
      authenticity: 'Echt'
    },
    {
      name: 'GoldenEye 007',
      region: 'PAL',
      condition: 'Fair',
      marketValue: 25,
      trivia: 'Revolutionäres First-Person-Shooter-Spiel. Entwickelt von Rare und veröffentlicht 1997.',
      authenticity: 'Echt'
    },
    {
      name: 'Mario Kart 64',
      region: 'NTSC',
      condition: 'Excellent',
      marketValue: 40,
      trivia: 'Das erste 3D-Mario-Kart-Spiel. Veröffentlicht 1996 und war ein großer Erfolg.',
      authenticity: 'Echt'
    }
  ];

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setLedStatus('scanning');
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Simulate scanning process
      setTimeout(() => {
        simulateScanResult();
      }, 3000);

    } catch (error) {
      console.error('Camera access error:', error);
      setLedStatus('error');
      setIsScanning(false);
    }
  };

  const simulateScanResult = () => {
    // Simulate random cartridge detection
    const randomCartridge = cartridgeDatabase[Math.floor(Math.random() * cartridgeDatabase.length)];
    
    // Capture image from video
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        // Convert to data URL for display
        const imageUrl = canvas.toDataURL('image/jpeg');
        randomCartridge.imageUrl = imageUrl;
      }
    }

    setScanResult(randomCartridge);
    setLedStatus('success');
    setIsScanning(false);
    setShowAddToCollection(true);

    // Stop camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    setLedStatus('off');
    
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const addToCollection = () => {
    // Here you would typically save to a database
    alert(`${scanResult?.name} wurde zur Sammlung hinzugefügt!`);
    setShowAddToCollection(false);
    setScanResult(null);
  };

  const showInfoOnly = () => {
    setShowAddToCollection(false);
  };

  const resetScanner = () => {
    setScanResult(null);
    setShowAddToCollection(false);
    setLedStatus('off');
  };

  return (
    <div className="modul-scanner">
      <div className="scanner-header">
        <h1>N64 Modul Scanner</h1>
        <div className="led-indicator">
          <div className={`led ${ledStatus}`}></div>
          <span className="led-label">
            {ledStatus === 'off' && 'Bereit'}
            {ledStatus === 'scanning' && 'Scanne...'}
            {ledStatus === 'success' && 'Erfolgreich!'}
            {ledStatus === 'error' && 'Fehler'}
          </span>
        </div>
      </div>

      <div className="scanner-body">
        <div className="camera-section">
          <div className="camera-frame">
            {!isScanning && !scanResult && (
              <div className="camera-placeholder">
                <div className="scanner-icon">📷</div>
                <p>Kamera bereit für Scan</p>
                <button 
                  className="scan-button"
                  onClick={startScanning}
                >
                  Scan starten
                </button>
              </div>
            )}
            
            {isScanning && (
              <div className="camera-active">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline
                  className="camera-video"
                />
                <div className="scan-overlay">
                  <div className="scan-line"></div>
                  <p>Scanne Modul...</p>
                </div>
                <button 
                  className="stop-button"
                  onClick={stopScanning}
                >
                  Scan stoppen
                </button>
              </div>
            )}
            
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        </div>

        {scanResult && (
          <div className="scan-results">
            <div className="result-header">
              <h2>Scan-Ergebnis</h2>
              <div className={`authenticity-badge ${scanResult.authenticity === 'Echt' ? 'authentic' : 'unknown'}`}>
                {scanResult.authenticity}
              </div>
            </div>

            <div className="cartridge-info">
              <div className="cartridge-image">
                {scanResult.imageUrl && (
                  <img src={scanResult.imageUrl} alt="Cartridge" />
                )}
              </div>
              
              <div className="info-grid">
                <div className="info-item">
                  <label>Spielname:</label>
                  <span>{scanResult.name}</span>
                </div>
                
                <div className="info-item">
                  <label>Region:</label>
                  <span className={`region-badge ${scanResult.region.toLowerCase()}`}>
                    {scanResult.region}
                  </span>
                </div>
                
                <div className="info-item">
                  <label>Zustand:</label>
                  <span className={`condition-badge ${scanResult.condition.toLowerCase()}`}>
                    {scanResult.condition}
                  </span>
                </div>
                
                <div className="info-item">
                  <label>Marktwert:</label>
                  <span className="market-value">€{scanResult.marketValue}</span>
                </div>
              </div>

              <div className="trivia-section">
                <h3>Trivia</h3>
                <p>{scanResult.trivia}</p>
              </div>
            </div>

            {showAddToCollection && (
              <div className="action-buttons">
                <button 
                  className="add-button"
                  onClick={addToCollection}
                >
                  Zur Sammlung hinzufügen
                </button>
                <button 
                  className="info-button"
                  onClick={showInfoOnly}
                >
                  Nur Infos anzeigen
                </button>
              </div>
            )}

            <button 
              className="reset-button"
              onClick={resetScanner}
            >
              Neuer Scan
            </button>
          </div>
        )}
      </div>

      <div className="scanner-footer">
        <div className="scanner-status">
          <span>Scanner v1.0 - Battle64 System</span>
        </div>
      </div>
    </div>
  );
};

export default ModulScannerScreen;
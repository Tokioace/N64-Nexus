import React, { useState, useEffect, useRef } from 'react';
import './ProfiModusScreen.css';

interface TimeSegment {
  id: string;
  name: string;
  currentTime: number;
  bestTime: number;
  pbTime: number;
  worldRecord: number;
  status: 'good' | 'bad' | 'neutral';
}

interface SpeedrunData {
  totalTime: number;
  segments: TimeSegment[];
  mistakes: string[];
  improvements: string[];
}

const ProfiModusScreen: React.FC = () => {
  const [speedrunData, setSpeedrunData] = useState<SpeedrunData>({
    totalTime: 0,
    segments: [],
    mistakes: [],
    improvements: []
  });
  const [isRecording, setIsRecording] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [timeChartData, setTimeChartData] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sample data for demonstration
  const sampleSegments: TimeSegment[] = [
    { id: '1', name: 'Start - Checkpoint 1', currentTime: 45.2, bestTime: 42.1, pbTime: 43.8, worldRecord: 40.5, status: 'bad' },
    { id: '2', name: 'Checkpoint 1 - Checkpoint 2', currentTime: 38.7, bestTime: 37.2, pbTime: 38.1, worldRecord: 35.9, status: 'good' },
    { id: '3', name: 'Checkpoint 2 - Checkpoint 3', currentTime: 52.3, bestTime: 50.8, pbTime: 51.2, worldRecord: 48.7, status: 'neutral' },
    { id: '4', name: 'Checkpoint 3 - Finish', currentTime: 41.8, bestTime: 40.5, pbTime: 41.1, worldRecord: 39.2, status: 'good' }
  ];

  useEffect(() => {
    setSpeedrunData(prev => ({
      ...prev,
      segments: sampleSegments,
      totalTime: sampleSegments.reduce((sum, seg) => sum + seg.currentTime, 0),
      mistakes: [
        'Verzögerung beim ersten Sprung (-2.1s)',
        'Falsche Route in Segment 2 (-0.8s)',
        'Ineffiziente Bewegung in Segment 3 (-1.6s)'
      ],
      improvements: [
        'Optimale Route in Segment 2 (+0.5s)',
        'Perfekte Sprung-Timing in Segment 4 (+0.3s)',
        'Schnelle Reaktionen in kritischen Momenten (+0.2s)'
      ]
    }));

    // Generate sample chart data
    const chartData = Array.from({ length: 50 }, (_, i) => 
      Math.sin(i * 0.2) * 10 + 40 + Math.random() * 5
    );
    setTimeChartData(chartData);
  }, []);

  useEffect(() => {
    drawTimeChart();
  }, [timeChartData]);

  const drawTimeChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let i = 0; i <= 8; i++) {
      const y = (height / 8) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw time line
    if (timeChartData.length > 0) {
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const stepX = width / (timeChartData.length - 1);
      timeChartData.forEach((value, index) => {
        const x = index * stepX;
        const y = height - ((value - 30) / 30) * height;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Draw data points
      ctx.fillStyle = '#00ff88';
      timeChartData.forEach((value, index) => {
        const x = index * stepX;
        const y = height - ((value - 30) / 30) * height;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(1);
    return `${minutes}:${seconds.padStart(4, '0')}`;
  };

  const getSegmentStatusColor = (status: string): string => {
    switch (status) {
      case 'good': return '#00ff88';
      case 'bad': return '#ff4444';
      default: return '#ffaa00';
    }
  };

  const exportStatistics = () => {
    const dataStr = JSON.stringify(speedrunData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `speedrun-analysis-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="profi-modus-screen">
      {/* Header */}
      <div className="profi-header">
        <h1 className="profi-title">PROFI MODUS</h1>
        <div className="profi-controls">
          <button 
            className={`record-button ${isRecording ? 'recording' : ''}`}
            onClick={toggleRecording}
          >
            {isRecording ? '● RECORDING' : '○ START RECORDING'}
          </button>
          <button className="export-button" onClick={exportStatistics}>
            EXPORT STATISTIKEN
          </button>
        </div>
      </div>

      <div className="profi-content">
        {/* Main Analysis Grid */}
        <div className="analysis-grid">
          {/* Time Overview */}
          <div className="analysis-card time-overview">
            <h3>ZEITÜBERSICHT</h3>
            <div className="time-display">
              <div className="time-item">
                <span className="time-label">AKTUELLE ZEIT</span>
                <span className="time-value current">{formatTime(speedrunData.totalTime)}</span>
              </div>
              <div className="time-item">
                <span className="time-label">BESTE ZEIT</span>
                <span className="time-value best">{formatTime(speedrunData.segments.reduce((sum, seg) => sum + seg.bestTime, 0))}</span>
              </div>
              <div className="time-item">
                <span className="time-label">PERSONAL BEST</span>
                <span className="time-value pb">{formatTime(speedrunData.segments.reduce((sum, seg) => sum + seg.pbTime, 0))}</span>
              </div>
              <div className="time-item">
                <span className="time-label">WORLD RECORD</span>
                <span className="time-value wr">{formatTime(speedrunData.segments.reduce((sum, seg) => sum + seg.worldRecord, 0))}</span>
              </div>
            </div>
          </div>

          {/* Time Chart */}
          <div className="analysis-card time-chart">
            <h3>ZEITVERLAUF</h3>
            <canvas 
              ref={canvasRef} 
              width={400} 
              height={200}
              className="chart-canvas"
            />
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#00ff88' }}></span>
                Aktuelle Zeit
              </span>
            </div>
          </div>

          {/* Segment Analysis */}
          <div className="analysis-card segment-analysis">
            <h3>ABSCHNITTSANALYSE</h3>
            <div className="segments-list">
              {speedrunData.segments.map((segment) => (
                <div 
                  key={segment.id}
                  className={`segment-item ${selectedSegment === segment.id ? 'selected' : ''}`}
                  onClick={() => setSelectedSegment(segment.id)}
                >
                  <div className="segment-header">
                    <span className="segment-name">{segment.name}</span>
                    <span 
                      className="segment-status"
                      style={{ backgroundColor: getSegmentStatusColor(segment.status) }}
                    >
                      {segment.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="segment-times">
                    <div className="time-comparison">
                      <span className="current-time">{formatTime(segment.currentTime)}</span>
                      <span className="vs">vs</span>
                      <span className="best-time">{formatTime(segment.bestTime)}</span>
                    </div>
                    <div className="time-difference">
                      {segment.currentTime > segment.bestTime ? '+' : ''}
                      {(segment.currentTime - segment.bestTime).toFixed(1)}s
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Feedback */}
          <div className="analysis-card improvement-feedback">
            <h3>VERBESSERUNGSPOTENZIAL</h3>
            <div className="feedback-section">
              <div className="feedback-group">
                <h4>FEHLER ERKANNT</h4>
                <ul className="feedback-list mistakes">
                  {speedrunData.mistakes.map((mistake, index) => (
                    <li key={index} className="feedback-item mistake">
                      <span className="feedback-icon">⚠</span>
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="feedback-group">
                <h4>POSITIVE ASPEKTE</h4>
                <ul className="feedback-list improvements">
                  {speedrunData.improvements.map((improvement, index) => (
                    <li key={index} className="feedback-item improvement">
                      <span className="feedback-icon">✓</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Segment View */}
        {selectedSegment && (
          <div className="analysis-card detailed-segment">
            <h3>DETAILANSICHT: {speedrunData.segments.find(s => s.id === selectedSegment)?.name}</h3>
            <div className="segment-details">
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Aktuelle Zeit</span>
                  <span className="detail-value">{formatTime(speedrunData.segments.find(s => s.id === selectedSegment)?.currentTime || 0)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Beste Zeit</span>
                  <span className="detail-value">{formatTime(speedrunData.segments.find(s => s.id === selectedSegment)?.bestTime || 0)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Personal Best</span>
                  <span className="detail-value">{formatTime(speedrunData.segments.find(s => s.id === selectedSegment)?.pbTime || 0)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">World Record</span>
                  <span className="detail-value">{formatTime(speedrunData.segments.find(s => s.id === selectedSegment)?.worldRecord || 0)}</span>
                </div>
              </div>
              <div className="segment-recommendations">
                <h4>EMPFEHLUNGEN</h4>
                <ul>
                  <li>Optimale Route für diesen Abschnitt einstudieren</li>
                  <li>Timing der Sprünge verbessern</li>
                  <li>Alternative Strategien testen</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfiModusScreen;
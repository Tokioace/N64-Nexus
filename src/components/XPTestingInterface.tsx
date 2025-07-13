import React, { useState } from 'react';
import { XPService } from '../services/xpService';
import { XPSource, XP_REWARDS } from '../types/xp';
import './XPTestingInterface.css';

interface XPTestingInterfaceProps {
  onXPAdded: () => void;
}

export const XPTestingInterface: React.FC<XPTestingInterfaceProps> = ({ onXPAdded }) => {
  const [selectedSource, setSelectedSource] = useState<XPSource>('event_participation');
  const [eventId, setEventId] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const xpService = XPService.getInstance();

  const handleAddXP = () => {
    const result = xpService.addXP(selectedSource, eventId || undefined);
    
    setMessage(result.message);
    setMessageType(result.success ? 'success' : 'error');
    
    if (result.success) {
      onXPAdded();
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  const handleReset = () => {
    xpService.resetForTesting();
    onXPAdded();
    setMessage('XP System zurückgesetzt!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="xp-testing-container">
      <h3 className="xp-testing-title">XP Testing Interface</h3>
      
      <div className="xp-testing-form">
        <div className="form-group">
          <label htmlFor="xp-source">XP Quelle:</label>
          <select
            id="xp-source"
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value as XPSource)}
            className="xp-select"
          >
            {Object.entries(XP_REWARDS).map(([source, reward]) => (
              <option key={source} value={source}>
                {reward.description} (+{reward.amount} XP)
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="event-id">Event ID (optional):</label>
          <input
            id="event-id"
            type="text"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            placeholder="z.B. glitchcup-2024"
            className="xp-input"
          />
        </div>

        <div className="form-actions">
          <button onClick={handleAddXP} className="xp-button add">
            XP Hinzufügen
          </button>
          <button onClick={handleReset} className="xp-button reset">
            Reset System
          </button>
        </div>
      </div>

      {message && (
        <div className={`xp-message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="xp-info">
        <h4>XP Quellen Übersicht:</h4>
        <div className="xp-sources-grid">
          {Object.entries(XP_REWARDS).map(([source, reward]) => (
            <div key={source} className="xp-source-item">
              <span className="xp-source-icon">⭐</span>
              <span className="xp-source-description">{reward.description}</span>
              <span className="xp-source-amount">+{reward.amount} XP</span>
              {reward.maxPerEvent && (
                <span className="xp-source-limit">(1x pro Event)</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
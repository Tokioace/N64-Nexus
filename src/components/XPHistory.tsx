import React from 'react';
import { XPHistory } from '../types/xp';
import './XPHistory.css';

interface XPHistoryProps {
  history: XPHistory[];
}

export const XPHistoryComponent: React.FC<XPHistoryProps> = ({ history }) => {
  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Gerade eben';
    if (minutes < 60) return `vor ${minutes} Min`;
    if (hours < 24) return `vor ${hours} Std`;
    return `vor ${days} Tagen`;
  };

  return (
    <div className="xp-history-container">
      <h3 className="xp-history-title">XP Historie</h3>
      <div className="xp-history-list">
        {history.length === 0 ? (
          <div className="xp-history-empty">
            Noch keine XP gesammelt. Starte dein Abenteuer!
          </div>
        ) : (
          history.map((entry) => (
            <div key={entry.id} className="xp-history-entry">
              <div className="xp-history-icon">
                <span className="xp-icon">⭐</span>
              </div>
              <div className="xp-history-content">
                <div className="xp-history-description">
                  {entry.description}
                </div>
                <div className="xp-history-time">
                  {formatTime(entry.timestamp)}
                </div>
              </div>
              <div className="xp-history-amount">
                +{entry.amount} XP
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
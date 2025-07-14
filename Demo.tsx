import React, { useState } from 'react';
import XPLevelScreen from './XPLevelScreen';
import './Demo.css';

const Demo: React.FC = () => {
  const [showXPScreen, setShowXPScreen] = useState(false);

  // Sample data for demonstration
  const demoData = {
    currentLevel: 4,
    currentXP: 1250,
    xpToNextLevel: 2000,
    totalXP: 8750
  };

  return (
    <div className="demo-container">
      <div className="demo-content">
        <h1>XP Level Screen Demo</h1>
        <p>Click the button below to open the XP Level Screen</p>
        
        <button 
          className="demo-button"
          onClick={() => setShowXPScreen(true)}
        >
          Open XP Level Screen
        </button>

        <div className="demo-info">
          <h3>Current Stats:</h3>
          <ul>
            <li>Level: {demoData.currentLevel}</li>
            <li>Current XP: {demoData.currentXP}</li>
            <li>XP to Next Level: {demoData.xpToNextLevel}</li>
            <li>Total XP: {demoData.totalXP}</li>
          </ul>
        </div>
      </div>

      {showXPScreen && (
        <XPLevelScreen
          currentLevel={demoData.currentLevel}
          currentXP={demoData.currentXP}
          xpToNextLevel={demoData.xpToNextLevel}
          totalXP={demoData.totalXP}
          onClose={() => setShowXPScreen(false)}
        />
      )}
    </div>
  );
};

export default Demo;
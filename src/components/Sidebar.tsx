import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/SoundManager';

// Importiere Sound-Dateien (diese werden später hinzugefügt)
const sidebarOpenSound = '/sounds/sidebar-open.mp3';
const sidebarCloseSound = '/sounds/sidebar-close.mp3';
const buttonClickSound = '/sounds/button-click.mp3';

interface SidebarProps {
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleSidebar = () => {
    if (isAnimating) return; // Verhindere mehrfache Klicks während Animation
    
    setIsAnimating(true);
    
    if (isOpen) {
      playSound(sidebarCloseSound);
    } else {
      playSound(sidebarOpenSound);
    }
    
    setIsOpen(!isOpen);
    
    // Animation beenden nach 300ms
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const handleButtonClick = () => {
    playSound(buttonClickSound);
  };

  return (
    <div className="sidebar-container">
      {/* Toggle Button */}
      <button
        className={`sidebar-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Sidebar schließen' : 'Sidebar öffnen'}
      >
        <div className="toggle-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Battle64</h2>
          <div className="sidebar-decoration">
            <div className="n64-logo">N64</div>
          </div>
        </div>
        
        <div className="sidebar-content">
          {children || (
            <div className="sidebar-menu">
              <button 
                className="sidebar-menu-item"
                onClick={handleButtonClick}
              >
                🏆 Kampf
              </button>
              <button 
                className="sidebar-menu-item"
                onClick={handleButtonClick}
              >
                🎮 Charakter
              </button>
              <button 
                className="sidebar-menu-item"
                onClick={handleButtonClick}
              >
                🏅 Achievements
              </button>
              <button 
                className="sidebar-menu-item"
                onClick={handleButtonClick}
              >
                ⚙️ Einstellungen
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={toggleSidebar}
        />
      )}

      <style jsx>{`
        .sidebar-container {
          position: relative;
          z-index: 1000;
        }

        .sidebar-toggle {
          position: fixed;
          top: 20px;
          left: 20px;
          width: 60px;
          height: 60px;
          background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
          border: 3px solid #4a4a4a;
          border-radius: 12px;
          cursor: pointer;
          z-index: 1001;
          transition: all 0.3s ease;
          box-shadow: 
            0 4px 8px rgba(0, 0, 0, 0.3),
            inset 0 2px 4px rgba(255, 255, 255, 0.1);
        }

        .sidebar-toggle:hover {
          transform: scale(1.05);
          box-shadow: 
            0 6px 12px rgba(0, 0, 0, 0.4),
            inset 0 2px 4px rgba(255, 255, 255, 0.15);
        }

        .sidebar-toggle:active {
          transform: scale(0.95);
        }

        .toggle-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 4px;
        }

        .toggle-icon span {
          width: 24px;
          height: 3px;
          background: #00ff88;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .sidebar-toggle.open .toggle-icon span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .sidebar-toggle.open .toggle-icon span:nth-child(2) {
          opacity: 0;
        }

        .sidebar-toggle.open .toggle-icon span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: -320px;
          width: 320px;
          height: 100vh;
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border-right: 4px solid #00ff88;
          transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          box-shadow: 4px 0 20px rgba(0, 255, 136, 0.3);
          overflow-y: auto;
        }

        .sidebar.open {
          left: 0;
        }

        .sidebar-header {
          padding: 20px;
          background: linear-gradient(90deg, #0f3460, #16213e);
          border-bottom: 2px solid #00ff88;
          text-align: center;
        }

        .sidebar-title {
          color: #00ff88;
          font-size: 24px;
          font-weight: bold;
          margin: 0;
          text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
          font-family: 'Courier New', monospace;
        }

        .sidebar-decoration {
          margin-top: 10px;
        }

        .n64-logo {
          display: inline-block;
          background: #00ff88;
          color: #1a1a2e;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: bold;
          font-family: 'Courier New', monospace;
        }

        .sidebar-content {
          padding: 20px;
        }

        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sidebar-menu-item {
          background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
          border: 2px solid #4a4a4a;
          border-radius: 8px;
          padding: 15px 20px;
          color: #ffffff;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          font-family: 'Courier New', monospace;
          box-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.3),
            inset 0 1px 2px rgba(255, 255, 255, 0.1);
        }

        .sidebar-menu-item:hover {
          border-color: #00ff88;
          box-shadow: 
            0 4px 8px rgba(0, 255, 136, 0.3),
            inset 0 1px 2px rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .sidebar-menu-item:active {
          transform: translateY(0);
          box-shadow: 
            0 2px 4px rgba(0, 255, 136, 0.2),
            inset 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Scrollbar Styling */
        .sidebar::-webkit-scrollbar {
          width: 8px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: #1a1a2e;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: #00ff88;
          border-radius: 4px;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
          background: #00cc6a;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
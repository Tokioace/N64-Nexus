import React, { useState } from 'react';

interface SidebarProps {
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sidebar-container">
      {/* Hamburger Button */}
      <button 
        className="hamburger-button"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Semi-transparent overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* Sidebar content */}
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {children}
      </div>

      <style jsx>{`
        .sidebar-container {
          position: relative;
        }

        .hamburger-button {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1001;
          background: none;
          border: none;
          cursor: pointer;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hamburger-line {
          width: 25px;
          height: 3px;
          background-color: #333;
          transition: all 0.3s ease;
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 999;
          cursor: pointer;
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: -300px;
          width: 300px;
          height: 100%;
          background-color: white;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
          transition: left 0.3s ease;
          z-index: 1000;
          overflow-y: auto;
          padding: 20px;
        }

        .sidebar-open {
          left: 0;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
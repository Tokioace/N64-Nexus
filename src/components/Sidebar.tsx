import React, { useState } from 'react';
import './Sidebar.css';

interface SidebarProps {
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const toggleSidebar = () => {
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <button onClick={toggleSidebar} className="sidebar-toggle">
        {isOpen ? '✕' : '☰'}
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''} ${isClosing ? 'closing' : ''}`}>
        {children}
      </div>
    </>
  );
};

export default Sidebar;
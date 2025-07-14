import React, { useState } from 'react';

const DarkModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Add your dark mode logic here
  };

  return (
    <button 
      onClick={toggleDarkMode}
      className="dark-mode-toggle"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default DarkModeToggle;
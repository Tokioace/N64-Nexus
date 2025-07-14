import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Minimize2, Maximize2, Search, BookOpen, Gamepad2 } from 'lucide-react';
import './Cartbit.css';

interface CartbitProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  className?: string;
}

interface HelpTopic {
  id: string;
  title: string;
  content: string;
  keywords: string[];
}

const helpTopics: HelpTopic[] = [
  {
    id: 'events',
    title: 'Events starten',
    content: 'Um ein Event zu starten, klicke auf "Neues Event" und wähle dein Lieblingsspiel aus! 🎮',
    keywords: ['event', 'starten', 'spiel', 'neues event']
  },
  {
    id: 'glitchrun',
    title: 'Was ist ein Glitchrun?',
    content: 'Ein Glitchrun ist ein Speedrun, bei dem bewusst Glitches genutzt werden, um das Spiel schneller zu beenden! 🏃‍♂️💨',
    keywords: ['glitchrun', 'glitch', 'speedrun', 'schnell']
  },
  {
    id: 'rules',
    title: 'Regeln',
    content: 'Die Regeln findest du im Regelbuch! Klicke auf das Buch-Symbol oben rechts. 📖',
    keywords: ['regeln', 'regel', 'buch', 'regelbuch']
  },
  {
    id: 'profile',
    title: 'Profil bearbeiten',
    content: 'Dein Profil kannst du über das Zahnrad-Symbol in der oberen rechten Ecke bearbeiten! ⚙️',
    keywords: ['profil', 'bearbeiten', 'einstellungen', 'zahnrad']
  }
];

const randomFacts = [
  "Wusstest du? Ich war mal in einem Toaster – Retroprobleme! 🔌",
  "Meine Lieblingsfarbe ist Türkis, genau wie meine LEDs! 💎",
  "Ich kann 64 Bits auf einmal verarbeiten – daher der Name! 🧠",
  "Manchmal träume ich von Pixels und Chiptunes! 🎵",
  "Meine Antenne kann sogar WLAN empfangen – sehr modern! 📡"
];

export const Cartbit: React.FC<CartbitProps> = ({ 
  isMinimized = false, 
  onToggleMinimize,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFact, setCurrentFact] = useState('');
  const [isBlinking, setIsBlinking] = useState(false);
  const [isJubilating, setIsJubilating] = useState(false);
  const [isConfused, setIsConfused] = useState(false);

  // Auto-show fact every 30 seconds when idle
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOpen && !isMinimized) {
        const randomFact = randomFacts[Math.floor(Math.random() * randomFacts.length)];
        setCurrentFact(randomFact);
        setIsJubilating(true);
        setTimeout(() => setIsJubilating(false), 2000);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOpen, isMinimized]);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setCurrentMessage('Hey Player! Ich bin Cartbit. Sag mir, wobei du Hilfe brauchst! 🎮✨');
    setIsJubilating(true);
    setTimeout(() => setIsJubilating(false), 1000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentMessage('');
    setSearchQuery('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsTyping(true);
    
    const matchingTopic = helpTopics.find(topic => 
      topic.keywords.some(keyword => 
        query.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    setTimeout(() => {
      if (matchingTopic) {
        setCurrentMessage(matchingTopic.content);
        setIsJubilating(true);
        setTimeout(() => setIsJubilating(false), 1000);
      } else {
        setCurrentMessage('Äh… das war wohl ein Glitch! Kannst du das anders formulieren? 🤔');
        setIsConfused(true);
        setTimeout(() => setIsConfused(false), 2000);
      }
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    setIsTyping(true);
    setTimeout(() => {
      switch (action) {
        case 'events':
          setCurrentMessage('Um ein Event zu starten, klicke auf "Neues Event" und wähle dein Lieblingsspiel aus! 🎮');
          break;
        case 'rules':
          setCurrentMessage('Die Regeln findest du im Regelbuch! Klicke auf das Buch-Symbol oben rechts. 📖');
          break;
        case 'search':
          setCurrentMessage('Nutze die Suchleiste, um schnell zu finden, was du brauchst! 🔍');
          break;
        default:
          setCurrentMessage('Hey Player! Ich bin Cartbit. Sag mir, wobei du Hilfe brauchst! 🎮✨');
      }
      setIsJubilating(true);
      setTimeout(() => setIsJubilating(false), 1000);
      setIsTyping(false);
    }, 800);
  };

  if (isMinimized) {
    return (
      <motion.div
        className={`cartbit-minimized ${className}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={onToggleMinimize}
      >
        <div className="cartbit-body-mini">
          <div className={`cartbit-eyes-mini ${isBlinking ? 'blinking' : ''}`}>
            <div className="eye-mini left"></div>
            <div className="eye-mini right"></div>
          </div>
          <div className="cartbit-mouth-mini">:)</div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`cartbit-container ${className}`}>
      {/* Minimized Cartbit */}
      {!isOpen && (
        <motion.div
          className="cartbit-minimized"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={handleOpen}
        >
          <div className="cartbit-body-mini">
            <div className={`cartbit-eyes-mini ${isBlinking ? 'blinking' : ''}`}>
              <div className="eye-mini left"></div>
              <div className="eye-mini right"></div>
            </div>
            <div className="cartbit-mouth-mini">:)</div>
            {currentFact && (
              <motion.div
                className="cartbit-fact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {currentFact}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Expanded Cartbit */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="cartbit-expanded"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Cartbit Character */}
            <div className={`cartbit-character ${isJubilating ? 'jubilating' : ''} ${isConfused ? 'confused' : ''}`}>
              <div className="cartbit-body">
                {/* Antenna */}
                <motion.div 
                  className="cartbit-antenna"
                  animate={{ rotate: isJubilating ? [0, -10, 10, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="antenna-tip"></div>
                </motion.div>
                
                {/* LEDs */}
                <div className="cartbit-leds">
                  <motion.div 
                    className="led left"
                    animate={{ 
                      opacity: isJubilating ? [1, 0.3, 1] : 1,
                      scale: isJubilating ? [1, 1.2, 1] : 1
                    }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                  <motion.div 
                    className="led right"
                    animate={{ 
                      opacity: isJubilating ? [1, 0.3, 1] : 1,
                      scale: isJubilating ? [1, 1.2, 1] : 1
                    }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  ></motion.div>
                </div>

                {/* Face */}
                <div className="cartbit-face">
                  <div className={`cartbit-eyes ${isBlinking ? 'blinking' : ''} ${isConfused ? 'confused' : ''}`}>
                    <div className="eye left"></div>
                    <div className="eye right"></div>
                  </div>
                  <div className={`cartbit-mouth ${isJubilating ? 'happy' : ''} ${isConfused ? 'confused' : ''}`}></div>
                </div>

                {/* Arms */}
                <motion.div 
                  className="cartbit-arms"
                  animate={{ 
                    rotate: isJubilating ? [0, -5, 5, 0] : 0,
                    y: isConfused ? [0, -5, 0] : 0
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="arm left">
                    <div className="hand left"></div>
                  </div>
                  <div className="arm right">
                    <div className="hand right"></div>
                  </div>
                </motion.div>

                {/* Legs */}
                <div className="cartbit-legs">
                  <div className="leg left">
                    <div className="shoe left"></div>
                  </div>
                  <div className="leg right">
                    <div className="shoe right"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="cartbit-chat">
              <div className="chat-header">
                <h3>Cartbit HelpBot</h3>
                <div className="chat-controls">
                  {onToggleMinimize && (
                    <button onClick={onToggleMinimize} className="control-btn">
                      <Minimize2 size={16} />
                    </button>
                  )}
                  <button onClick={handleClose} className="control-btn">
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="chat-messages">
                <div className="message cartbit-message">
                  {isTyping ? (
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    <p>{currentMessage}</p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <button 
                  onClick={() => handleQuickAction('events')}
                  className="action-btn"
                >
                  <Gamepad2 size={16} />
                  Events
                </button>
                <button 
                  onClick={() => handleQuickAction('rules')}
                  className="action-btn"
                >
                  <BookOpen size={16} />
                  Regeln
                </button>
                <button 
                  onClick={() => handleQuickAction('search')}
                  className="action-btn"
                >
                  <Search size={16} />
                  Suche
                </button>
              </div>

              {/* Search Input */}
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Frag mich was... (z.B. 'Event starten')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="search-input"
                />
                <button 
                  onClick={() => handleSearch(searchQuery)}
                  className="search-btn"
                  disabled={!searchQuery.trim()}
                >
                  <Search size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
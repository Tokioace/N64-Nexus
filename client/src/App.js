import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import styled, { createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';

// Components
import Header from './components/Header';
import Home from './pages/Home';
import TeamEvents from './pages/TeamEvents';
import TeamManagement from './pages/TeamManagement';
import EventDetails from './pages/EventDetails';
import UserProfile from './pages/UserProfile';
import Leaderboard from './pages/Leaderboard';

// Global Styles
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Orbitron:wght@400;700;900&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Orbitron', monospace;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
    color: #00ff41;
    min-height: 100vh;
    overflow-x: hidden;
  }
  
  /* Retro scrollbar */
  ::-webkit-scrollbar {
    width: 12px;
  }
  
  ::-webkit-scrollbar-track {
    background: #1a1a2e;
    border: 2px solid #00ff41;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #00ff41;
    border-radius: 6px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #00cc33;
  }
  
  /* Selection */
  ::selection {
    background: #00ff41;
    color: #0f0f23;
  }
  
  /* Focus styles */
  *:focus {
    outline: 2px solid #00ff41;
    outline-offset: 2px;
  }
  
  /* Button reset */
  button {
    font-family: inherit;
    border: none;
    background: none;
    cursor: pointer;
  }
  
  /* Link reset */
  a {
    text-decoration: none;
    color: inherit;
  }
`;

const AppContainer = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const RetroBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(0, 255, 65, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 255, 65, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(0, 255, 65, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
`;

const Scanlines = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 65, 0.03) 2px,
    rgba(0, 255, 65, 0.03) 4px
  );
  pointer-events: none;
  z-index: -1;
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <AppContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <RetroBackground />
        <Scanlines />
        
        <Header />
        
        <MainContent>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<TeamEvents />} />
            <Route path="/teams" element={<TeamManagement />} />
            <Route path="/events/:eventId" element={<EventDetails />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </MainContent>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a2e',
              color: '#00ff41',
              border: '2px solid #00ff41',
              fontFamily: 'Orbitron, monospace',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#00ff41',
                secondary: '#1a1a2e',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff4444',
                secondary: '#1a1a2e',
              },
            },
          }}
        />
      </AppContainer>
    </Router>
  );
}

export default App;
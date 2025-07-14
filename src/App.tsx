import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';

// Components
import Header from './components/Header';
import Marketplace from './components/Marketplace';
import ItemDetail from './components/ItemDetail';
import UserProfile from './components/UserProfile';
import TradingCenter from './components/TradingCenter';
import Wishlist from './components/Wishlist';
import Chat from './components/Chat';

// Global Styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    color: #ffffff;
    min-height: 100vh;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled(motion.main)`
  flex: 1;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const App: React.FC = () => {
  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        <Header />
        <MainContent
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<Marketplace />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/trading" element={<TradingCenter />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
};

export default App;
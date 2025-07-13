import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaTrophy, FaUsers, FaCalendarAlt, FaChartBar, FaHome, FaBars, FaTimes } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 3px solid #00ff41;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 255, 65, 0.2);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Press Start 2P', cursive;
  font-size: 1.5rem;
  color: #00ff41;
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
  transition: all 0.3s ease;
  
  &:hover {
    text-shadow: 0 0 20px rgba(0, 255, 65, 0.8);
    transform: scale(1.05);
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #00ff41, #00cc33);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
`;

const Navigation = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.5rem 1rem;
  color: #00ff41;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 2px solid transparent;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    border-color: #00ff41;
    background: rgba(0, 255, 65, 0.1);
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
  }
  
  &.active {
    border-color: #00ff41;
    background: rgba(0, 255, 65, 0.2);
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.4);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent, rgba(0, 255, 65, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: 2px solid #00ff41;
  color: #00ff41;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 255, 65, 0.1);
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
  }
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 15, 35, 0.98);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  z-index: 1001;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1rem 2rem;
  color: #00ff41;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  border: 3px solid #00ff41;
  border-radius: 12px;
  transition: all 0.3s ease;
  min-width: 250px;
  justify-content: center;
  
  &:hover {
    background: rgba(0, 255, 65, 0.2);
    box-shadow: 0 0 25px rgba(0, 255, 65, 0.5);
    transform: scale(1.05);
  }
  
  &.active {
    background: rgba(0, 255, 65, 0.3);
    box-shadow: 0 0 30px rgba(0, 255, 65, 0.6);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: 2px solid #00ff41;
  color: #00ff41;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 68, 68, 0.2);
    border-color: #ff4444;
    color: #ff4444;
  }
`;

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/events', label: 'Events', icon: <FaCalendarAlt /> },
    { path: '/teams', label: 'Teams', icon: <FaUsers /> },
    { path: '/leaderboard', label: 'Leaderboard', icon: <FaChartBar /> },
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <LogoIcon>🏁</LogoIcon>
          <span>BATTLE64</span>
        </Logo>
        
        <Navigation>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={isActive(item.path) ? 'active' : ''}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </Navigation>
        
        <MobileMenuButton
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <FaBars />
        </MobileMenuButton>
      </HeaderContent>
      
      {isMobileMenuOpen && (
        <MobileMenu
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <CloseButton
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes />
          </CloseButton>
          
          {navItems.map((item) => (
            <MobileNavLink
              key={item.path}
              to={item.path}
              className={isActive(item.path) ? 'active' : ''}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon}
              {item.label}
            </MobileNavLink>
          ))}
        </MobileMenu>
      )}
    </HeaderContainer>
  );
};

export default Header;
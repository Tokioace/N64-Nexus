import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaSearch, 
  FaUser, 
  FaBell, 
  FaComments, 
  FaExchangeAlt, 
  FaHeart,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { useMarketplaceStore } from '../store/marketplaceStore';

const HeaderContainer = styled(motion.header)`
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: bold;
  
  &:hover {
    color: #64b5f6;
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #64b5f6, #1976d2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 500px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: #ffffff;
  font-size: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: #64b5f6;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #ffffff;
  border-radius: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #64b5f6;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled(motion.button)`
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #64b5f6;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #f44336;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #64b5f6, #1976d2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1rem;
    gap: 1rem;
  }
`;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { 
    currentUser, 
    unreadNotifications, 
    setSearchTerm: setStoreSearchTerm,
    applyFilters 
  } = useMarketplaceStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setStoreSearchTerm(searchTerm);
    applyFilters();
    navigate('/');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <HeaderContainer
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeaderContent>
        <Logo to="/">
          <LogoIcon>64</LogoIcon>
          Battle64
        </Logo>

        <SearchContainer>
          <form onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="Suche nach Spielen, Merchandise, Zubehör..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <SearchIcon />
          </form>
        </SearchContainer>

        <Navigation>
          <NavLink to="/trading">
            <FaExchangeAlt />
            Tauschbörse
          </NavLink>
          <NavLink to="/wishlist">
            <FaHeart />
            Wunschliste
          </NavLink>
        </Navigation>

        <UserSection>
          <IconButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/chat')}
          >
            <FaComments />
          </IconButton>

          <IconButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/notifications')}
          >
            <FaBell />
            {unreadNotifications > 0 && (
              <NotificationBadge>{unreadNotifications}</NotificationBadge>
            )}
          </IconButton>

          {currentUser ? (
            <UserAvatar onClick={() => navigate(`/profile/${currentUser.id}`)}>
              {currentUser.username.charAt(0).toUpperCase()}
            </UserAvatar>
          ) : (
            <IconButton
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/login')}
            >
              <FaUser />
            </IconButton>
          )}

          <MobileMenuButton onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {showMobileMenu ? <FaTimes /> : <FaBars />}
          </MobileMenuButton>
        </UserSection>
      </HeaderContent>

      {showMobileMenu && (
        <MobileMenu
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <NavLink to="/trading" onClick={() => setShowMobileMenu(false)}>
            <FaExchangeAlt />
            Tauschbörse
          </NavLink>
          <NavLink to="/wishlist" onClick={() => setShowMobileMenu(false)}>
            <FaHeart />
            Wunschliste
          </NavLink>
          <NavLink to="/chat" onClick={() => setShowMobileMenu(false)}>
            <FaComments />
            Chat
          </NavLink>
        </MobileMenu>
      )}
    </HeaderContainer>
  );
};

export default Header;
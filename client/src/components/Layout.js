import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  FaHome, 
  FaTrophy, 
  FaUser, 
  FaCog, 
  FaBars, 
  FaTimes,
  FaSignOutAlt,
  FaBell
} from 'react-icons/fa';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: FaHome },
    { name: 'Events', href: '/events', icon: FaTrophy },
    ...(user?.isAdmin ? [{ name: 'Admin', href: '/admin', icon: FaCog }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">64</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Battle64</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {/* Notifications */}
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <FaBell className="w-5 h-5" />
                  </button>

                  {/* User Profile */}
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <img
                      src={user.profilePicture || '/default-avatar.png'}
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="hidden sm:block">{user.username}</span>
                  </Link>

                  {/* Mobile menu button */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {mobileMenuOpen ? (
                      <FaTimes className="w-5 h-5" />
                    ) : (
                      <FaBars className="w-5 h-5" />
                    )}
                  </button>
                </>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    to="/login"
                    className="btn btn-secondary btn-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary btn-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {user && (
                <>
                  <hr className="my-2" />
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FaUser className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                  >
                    <FaSignOutAlt className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2024 Battle64. All rights reserved.</p>
            <p className="mt-2">
              The ultimate N64 speedrun event platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import LoadingSpinner from './components/LoadingSpinner';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        
        <Route path="/events" element={
          <Layout>
            <Events />
          </Layout>
        } />
        
        <Route path="/events/:id" element={
          <Layout>
            <EventDetail />
          </Layout>
        } />
        
        <Route path="/profile" element={
          user ? (
            <Layout>
              <Profile />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } />
        
        <Route path="/profile/:id" element={
          <Layout>
            <Profile />
          </Layout>
        } />
        
        <Route path="/admin" element={
          user?.isAdmin ? (
            <Layout>
              <Admin />
            </Layout>
          ) : (
            <Navigate to="/" />
          )
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
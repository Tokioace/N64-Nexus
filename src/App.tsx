import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AdminLayout from './components/AdminLayout'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import UserManagement from './components/UserManagement'
import EventManagement from './components/EventManagement'
import PointsSystem from './components/PointsSystem'
import ContentModeration from './components/ContentModeration'
import Analytics from './components/Analytics'
import SystemSettings from './components/SystemSettings'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-retro-green text-2xl font-retro animate-pulse">
          LOADING...
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="events" element={<EventManagement />} />
        <Route path="points" element={<PointsSystem />} />
        <Route path="moderation" element={<ContentModeration />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<SystemSettings />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
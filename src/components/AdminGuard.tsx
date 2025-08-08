import React from 'react'
import { OWNER_UID } from '../config'
import { useUser } from '../contexts/UserContext'

interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children, fallback }) => {
  const { user, isLoading } = useUser()

  if (isLoading) return null

  if (!user || user.id !== OWNER_UID) {
    return fallback ?? null
  }

  return <>{children}</>
}

export default AdminGuard
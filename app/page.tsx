'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '../store/adminStore';
import AdminDashboard from '../components/AdminDashboard';
import LoginForm from '../components/LoginForm';

export default function Home() {
  const { isAuthenticated, setAuthenticated } = useAdminStore();
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('admin_token');
    if (token) {
      setAuthenticated(true);
    }
  }, [setAuthenticated]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <AdminDashboard />;
}
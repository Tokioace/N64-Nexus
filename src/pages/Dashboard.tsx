import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Welcome back, {user?.username}! 🎮</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Level {user?.level}</h3>
          <p>{user?.xp} XP</p>
        </div>
        <div className="stat-card">
          <h3>Status</h3>
          <p>{user?.status}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
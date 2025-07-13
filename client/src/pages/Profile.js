import React from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      <p className="text-gray-600">User ID: {id || 'Current User'}</p>
      <div className="card">
        <div className="card-body">
          <p>Profile page coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
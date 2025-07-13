import React from 'react';
import { useParams } from 'react-router-dom';

const EventDetail = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Event Details</h1>
      <p className="text-gray-600">Event ID: {id}</p>
      <div className="card">
        <div className="card-body">
          <p>Event detail page coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
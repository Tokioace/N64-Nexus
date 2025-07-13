import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { eventsAPI } from '../services/api';
import { getEventStatus, formatTime } from '../services/api';
import { 
  FaFilter, 
  FaSearch, 
  FaGamepad, 
  FaCalendarAlt,
  FaUsers,
  FaClock,
  FaFire,
  FaTrophy
} from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const Events = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [filters, setFilters] = useState({
    region: '',
    game: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = useQuery(
    ['events', activeTab, filters],
    () => eventsAPI.getAll({ 
      status: activeTab, 
      ...filters 
    }),
    { staleTime: 30000 }
  );

  const events = data?.events || [];

  const tabs = [
    { id: 'active', label: 'Active', icon: FaFire },
    { id: 'upcoming', label: 'Upcoming', icon: FaCalendarAlt },
    { id: 'completed', label: 'Completed', icon: FaTrophy }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ region: '', game: '', search: '' });
  };

  const EventCard = ({ event }) => {
    const status = getEventStatus(event);
    const statusColors = {
      active: 'bg-success-100 text-success-800',
      upcoming: 'bg-warning-100 text-warning-800',
      completed: 'bg-gray-100 text-gray-800'
    };

    return (
      <Link to={`/events/${event._id}`} className="card hover:shadow-medium transition-shadow">
        <div className="card-header">
          <div className="flex items-center justify-between mb-2">
            <span className={`badge ${statusColors[status]}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            <span className="text-sm text-gray-500">
              {event.participantsCount} participants
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {event.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {event.description}
          </p>
          <div className="flex items-center text-sm text-gray-600">
            <FaGamepad className="mr-1" />
            {event.game.name} - {event.game.stage}
          </div>
        </div>
        <div className="card-body pt-0">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <FaCalendarAlt className="mr-1" />
              <span>
                {new Date(event.startTime).toLocaleDateString()} - {new Date(event.endTime).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaUsers className="mr-1" />
              <span>{event.participantsCount}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-error-600 mb-4">Failed to load events</div>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">
            Join N64 speedrun challenges and compete with players worldwide
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="input pl-10"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="label">Region</label>
                <select
                  className="input"
                  value={filters.region}
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                >
                  <option value="">All Regions</option>
                  <option value="PAL">PAL</option>
                  <option value="NTSC">NTSC</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div>
                <label className="label">Game</label>
                <input
                  type="text"
                  placeholder="Filter by game..."
                  className="input"
                  value={filters.game}
                  onChange={(e) => handleFilterChange('game', e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="btn btn-secondary btn-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : events.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <FaCalendarAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab} events found
          </h3>
          <p className="text-gray-600 mb-4">
            {activeTab === 'active' && 'Check back soon for new speedrun challenges!'}
            {activeTab === 'upcoming' && 'No upcoming events scheduled yet.'}
            {activeTab === 'completed' && 'No completed events to show.'}
          </p>
          {activeTab === 'active' && (
            <Link to="/events?tab=upcoming" className="btn btn-primary">
              View Upcoming Events
            </Link>
          )}
        </div>
      )}

      {/* Pagination */}
      {data?.totalPages > 1 && (
        <div className="flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="btn btn-secondary btn-sm">Previous</button>
            <span className="px-3 py-2 text-sm text-gray-700">
              Page {data.currentPage} of {data.totalPages}
            </span>
            <button className="btn btn-secondary btn-sm">Next</button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Events;
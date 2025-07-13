import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useAuth } from '../hooks/useAuth';
import { eventsAPI, usersAPI } from '../services/api';
import { formatTime, getEventStatus } from '../services/api';
import { 
  FaTrophy, 
  FaUsers, 
  FaClock, 
  FaStar,
  FaArrowRight,
  FaGamepad,
  FaCalendarAlt,
  FaFire,
  FaUser,
  FaCog
} from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const { user } = useAuth();

  // Fetch featured events
  const { data: eventsData, isLoading: eventsLoading } = useQuery(
    ['events', 'featured'],
    () => eventsAPI.getAll({ status: 'active', limit: 3 }),
    { staleTime: 30000 }
  );

  // Fetch global leaderboard
  const { data: leaderboardData, isLoading: leaderboardLoading } = useQuery(
    ['leaderboard', 'global'],
    () => usersAPI.getLeaderboard({ limit: 5 }),
    { staleTime: 60000 }
  );

  const featuredEvents = eventsData?.events || [];
  const topUsers = leaderboardData?.users || [];

  const HeroSection = () => (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl text-white">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative px-6 py-16 sm:px-12 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 text-shadow-lg">
            Welcome to Battle64
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-primary-100">
            The ultimate N64 speedrun event platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/events"
              className="btn btn-lg bg-white text-primary-600 hover:bg-gray-50"
            >
              <FaTrophy className="mr-2" />
              Join Events
            </Link>
            {!user && (
              <Link
                to="/register"
                className="btn btn-lg border-2 border-white text-white hover:bg-white hover:text-primary-600"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const StatsSection = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      <div className="card text-center">
        <div className="card-body">
          <FaTrophy className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">150+</div>
          <div className="text-sm text-gray-600">Events Completed</div>
        </div>
      </div>
      <div className="card text-center">
        <div className="card-body">
          <FaUsers className="w-8 h-8 text-success-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">2.5K+</div>
          <div className="text-sm text-gray-600">Active Players</div>
        </div>
      </div>
      <div className="card text-center">
        <div className="card-body">
          <FaClock className="w-8 h-8 text-warning-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">50K+</div>
          <div className="text-sm text-gray-600">Submissions</div>
        </div>
      </div>
      <div className="card text-center">
        <div className="card-body">
          <FaStar className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">100+</div>
          <div className="text-sm text-gray-600">Games Supported</div>
        </div>
      </div>
    </div>
  );

  const FeaturedEvents = () => (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaFire className="mr-2 text-orange-500" />
          Active Events
        </h2>
        <Link
          to="/events"
          className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
        >
          View All
          <FaArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </div>

      {eventsLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : featuredEvents.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <FaCalendarAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Events</h3>
          <p className="text-gray-600 mb-4">Check back soon for new speedrun challenges!</p>
          <Link to="/events" className="btn btn-primary">
            Browse All Events
          </Link>
        </div>
      )}
    </section>
  );

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
          <div className="flex items-center text-sm text-gray-600">
            <FaGamepad className="mr-1" />
            {event.game.name} - {event.game.stage}
          </div>
        </div>
        <div className="card-body pt-0">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {new Date(event.startTime).toLocaleDateString()}
            </span>
            <span className="text-gray-600">
              {new Date(event.endTime).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Link>
    );
  };

  const LeaderboardSection = () => (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaTrophy className="mr-2 text-yellow-500" />
          Top Players
        </h2>
        <Link
          to="/users/leaderboard/global"
          className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
        >
          View Full Leaderboard
          <FaArrowRight className="ml-1 w-4 h-4" />
        </Link>
      </div>

      {leaderboardLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            {topUsers.map((user, index) => (
              <div
                key={user._id}
                className="flex items-center px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="text-lg font-bold text-gray-400 w-8">
                    #{index + 1}
                  </div>
                  <img
                    src={user.profilePicture || '/default-avatar.png'}
                    alt={user.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {user.username}
                    </div>
                    <div className="text-sm text-gray-600">
                      Level {user.level}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {user.points.toLocaleString()} pts
                  </div>
                  <div className="text-sm text-gray-600">
                    {user.eventStats?.totalEvents || 0} events
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );

  const QuickActions = () => {
    if (!user) return null;

    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/events"
            className="card hover:shadow-medium transition-shadow p-6 text-center"
          >
            <FaTrophy className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Join Events</h3>
            <p className="text-sm text-gray-600">
              Find and participate in speedrun challenges
            </p>
          </Link>
          <Link
            to="/profile"
            className="card hover:shadow-medium transition-shadow p-6 text-center"
          >
            <FaUser className="w-8 h-8 text-success-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">View Profile</h3>
            <p className="text-sm text-gray-600">
              Check your stats and achievements
            </p>
          </Link>
          {user.isAdmin && (
            <Link
              to="/admin"
              className="card hover:shadow-medium transition-shadow p-6 text-center"
            >
              <FaCog className="w-8 h-8 text-warning-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Admin Panel</h3>
              <p className="text-sm text-gray-600">
                Manage events and submissions
              </p>
            </Link>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-8">
      <HeroSection />
      <StatsSection />
      <FeaturedEvents />
      <LeaderboardSection />
      <QuickActions />
    </div>
  );
};

export default Home;
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Trophy, 
  TrendingUp, 
  Plus,
  Clock,
  Star
} from 'lucide-react';
import { useEventStore } from '../store/eventStore';

export const Dashboard: React.FC = () => {
  const { events, isLoading } = useEventStore();

  const stats = {
    total: events.length,
    active: events.filter(e => e.status === 'active').length,
    draft: events.filter(e => e.status === 'draft').length,
    completed: events.filter(e => e.status === 'completed').length,
  };

  const recentEvents = events
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-pixel text-n64-red text-shadow">
          🎮 Battle64 Admin Dashboard
        </h1>
        <Link
          to="/events/new"
          className="retro-button flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Neues Event</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="retro-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-retro-gray text-sm">Gesamt Events</p>
              <p className="text-2xl font-bold text-n64-red">{stats.total}</p>
            </div>
            <Calendar className="h-8 w-8 text-n64-red" />
          </div>
        </div>

        <div className="retro-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-retro-gray text-sm">Aktive Events</p>
              <p className="text-2xl font-bold text-n64-green">{stats.active}</p>
            </div>
            <Clock className="h-8 w-8 text-n64-green" />
          </div>
        </div>

        <div className="retro-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-retro-gray text-sm">Entwürfe</p>
              <p className="text-2xl font-bold text-n64-yellow">{stats.draft}</p>
            </div>
            <Star className="h-8 w-8 text-n64-yellow" />
          </div>
        </div>

        <div className="retro-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-retro-gray text-sm">Abgeschlossen</p>
              <p className="text-2xl font-bold text-n64-blue">{stats.completed}</p>
            </div>
            <Trophy className="h-8 w-8 text-n64-blue" />
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="retro-card">
        <h2 className="text-xl font-pixel text-n64-red mb-4">📅 Letzte Events</h2>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-n64-red mx-auto"></div>
          </div>
        ) : recentEvents.length > 0 ? (
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 bg-n64-dark rounded border border-n64-gray hover:border-n64-blue transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    event.status === 'active' ? 'bg-n64-green' :
                    event.status === 'draft' ? 'bg-n64-yellow' :
                    event.status === 'completed' ? 'bg-n64-blue' :
                    'bg-retro-gray'
                  }`} />
                  <div>
                    <h3 className="font-retro text-retro-white">{event.title}</h3>
                    <p className="text-sm text-retro-gray">{event.game.title}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-retro ${
                    event.category === 'Speedrun' ? 'bg-n64-red text-white' :
                    event.category === 'Fanart' ? 'bg-n64-blue text-white' :
                    event.category === 'Sammlung' ? 'bg-n64-green text-white' :
                    'bg-retro-gray text-retro-white'
                  }`}>
                    {event.category}
                  </span>
                  <Link
                    to={`/events/${event.id}`}
                    className="text-n64-blue hover:text-n64-green transition-colors"
                  >
                    Ansehen →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-retro-gray">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-n64-gray" />
            <p>Noch keine Events erstellt</p>
            <Link to="/events/new" className="text-n64-blue hover:text-n64-green">
              Erstelle dein erstes Event
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="retro-card">
          <h3 className="text-lg font-pixel text-n64-red mb-3">⚡ Schnellaktionen</h3>
          <div className="space-y-2">
            <Link
              to="/events/new"
              className="block w-full text-left p-3 bg-n64-dark rounded border border-n64-gray hover:border-n64-red transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Plus className="h-5 w-5 text-n64-red" />
                <span className="font-retro">Neues Speedrun Event</span>
              </div>
            </Link>
            <Link
              to="/events/new"
              className="block w-full text-left p-3 bg-n64-dark rounded border border-n64-gray hover:border-n64-blue transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5 text-n64-blue" />
                <span className="font-retro">Fanart Wettbewerb</span>
              </div>
            </Link>
            <Link
              to="/events/new"
              className="block w-full text-left p-3 bg-n64-dark rounded border border-n64-gray hover:border-n64-green transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Trophy className="h-5 w-5 text-n64-green" />
                <span className="font-retro">Sammel-Challenge</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="retro-card">
          <h3 className="text-lg font-pixel text-n64-red mb-3">📊 Statistiken</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-retro-gray">Teilnehmer gesamt:</span>
              <span className="font-retro text-n64-blue">
                {events.reduce((sum, event) => sum + (event.participants?.length || 0), 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-retro-gray">Durchschnittliche Teilnehmer:</span>
              <span className="font-retro text-n64-green">
                {events.length > 0 
                  ? Math.round(events.reduce((sum, event) => sum + (event.participants?.length || 0), 0) / events.length)
                  : 0
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-retro-gray">Beliebteste Kategorie:</span>
              <span className="font-retro text-n64-yellow">Speedrun</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
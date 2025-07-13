import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  Copy,
  Trash2,
  Calendar,
  Users,
  Trophy
} from 'lucide-react';
import { useEventStore } from '../store/eventStore';
import { EventCategory } from '../types/event';

export const EventList: React.FC = () => {
  const { events, deleteEvent, duplicateEvent } = useEventStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const categories: EventCategory[] = [
    'Speedrun', 'Sammlung', 'Fanart', 'Gruppenzeit', 'Glitch-Only', 'Challenge', 'Tournament'
  ];

  const statuses = [
    { value: 'all', label: 'Alle' },
    { value: 'draft', label: 'Entwurf' },
    { value: 'published', label: 'Veröffentlicht' },
    { value: 'active', label: 'Aktiv' },
    { value: 'completed', label: 'Abgeschlossen' },
    { value: 'archived', label: 'Archiviert' }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-n64-green';
      case 'draft': return 'bg-n64-yellow';
      case 'completed': return 'bg-n64-blue';
      case 'published': return 'bg-n64-purple';
      case 'archived': return 'bg-retro-gray';
      default: return 'bg-retro-gray';
    }
  };

  const getCategoryColor = (category: EventCategory) => {
    switch (category) {
      case 'Speedrun': return 'bg-n64-red';
      case 'Fanart': return 'bg-n64-blue';
      case 'Sammlung': return 'bg-n64-green';
      case 'Glitch-Only': return 'bg-n64-orange';
      case 'Tournament': return 'bg-n64-purple';
      default: return 'bg-retro-gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-pixel text-n64-red text-shadow">
          🎯 Event Übersicht
        </h1>
        <Link
          to="/events/new"
          className="retro-button flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Neues Event</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="retro-card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-retro-gray" />
            <input
              type="text"
              placeholder="Events durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="retro-input w-full pl-10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as EventCategory | 'all')}
            className="retro-input"
          >
            <option value="all">Alle Kategorien</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="retro-input"
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>

          {/* Results Count */}
          <div className="flex items-center justify-end">
            <span className="text-retro-gray">
              {filteredEvents.length} von {events.length} Events
            </span>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="retro-card hover:border-n64-blue transition-colors">
            {/* Event Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-pixel text-lg text-retro-white mb-2">{event.title}</h3>
                <p className="text-sm text-retro-gray">{event.game.title}</p>
              </div>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-retro ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-n64-blue" />
                <span className="text-sm text-retro-gray">
                  {new Date(event.startTime).toLocaleDateString('de-DE')}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-n64-green" />
                <span className="text-sm text-retro-gray">
                  {event.participants?.length || 0} Teilnehmer
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-n64-yellow" />
                <span className="text-sm text-retro-gray">
                  {event.scoringType}
                </span>
              </div>
            </div>

            {/* Category Badge */}
            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-retro ${getCategoryColor(event.category)} text-white`}>
                {event.category}
              </span>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Link
                to={`/events/${event.id}`}
                className="flex-1 bg-n64-blue hover:bg-blue-600 text-white text-center py-2 px-3 rounded border border-blue-400 transition-colors"
              >
                <Eye className="h-4 w-4 mx-auto" />
              </Link>
              
              <Link
                to={`/events/${event.id}/edit`}
                className="flex-1 bg-n64-yellow hover:bg-yellow-600 text-white text-center py-2 px-3 rounded border border-yellow-400 transition-colors"
              >
                <Edit className="h-4 w-4 mx-auto" />
              </Link>
              
              <button
                onClick={() => duplicateEvent(event.id)}
                className="flex-1 bg-n64-green hover:bg-green-600 text-white py-2 px-3 rounded border border-green-400 transition-colors"
                title="Event duplizieren"
              >
                <Copy className="h-4 w-4 mx-auto" />
              </button>
              
              <button
                onClick={() => {
                  if (confirm('Event wirklich löschen?')) {
                    deleteEvent(event.id);
                  }
                }}
                className="flex-1 bg-n64-red hover:bg-red-600 text-white py-2 px-3 rounded border border-red-400 transition-colors"
                title="Event löschen"
              >
                <Trash2 className="h-4 w-4 mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 mx-auto mb-4 text-n64-gray" />
          <h3 className="text-xl font-pixel text-retro-gray mb-2">Keine Events gefunden</h3>
          <p className="text-retro-gray mb-4">
            {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
              ? 'Versuche andere Filtereinstellungen'
              : 'Erstelle dein erstes Event'
            }
          </p>
          <Link
            to="/events/new"
            className="retro-button inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Neues Event erstellen</span>
          </Link>
        </div>
      )}
    </div>
  );
};
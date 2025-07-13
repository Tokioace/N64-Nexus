import React, { useState, useMemo } from 'react';
import { Event, EventCategory, CalendarView } from '../types/event';
import { EventCard } from './EventCard';
import { Filter, SortAsc, SortDesc, List, Grid } from 'lucide-react';

interface EventListProps {
  events: Event[];
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onParticipate?: (eventId: string) => void;
  onSetReminder?: (eventId: string, enabled: boolean) => void;
  userEvents?: string[];
  userReminders?: string[];
  className?: string;
}

type SortOption = 'date' | 'title' | 'category' | 'participants';
type SortDirection = 'asc' | 'desc';

export const EventList: React.FC<EventListProps> = ({
  events,
  view,
  onViewChange,
  onParticipate,
  onSetReminder,
  userEvents = [],
  userReminders = [],
  className = ''
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events;

    // Apply category filter
    if (view.filter) {
      filtered = filtered.filter(event => event.category === view.filter);
    }

    // Apply "my events" filter
    if (view.showOnlyMyEvents) {
      filtered = filtered.filter(event => userEvents.includes(event.id));
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'date':
          aValue = a.startDate.getTime();
          bValue = b.startDate.getTime();
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'participants':
          aValue = a.currentParticipants;
          bValue = b.currentParticipants;
          break;
        default:
          aValue = a.startDate.getTime();
          bValue = b.startDate.getTime();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [events, view.filter, view.showOnlyMyEvents, searchTerm, sortBy, sortDirection, userEvents]);

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (option: SortOption) => {
    if (sortBy !== option) return null;
    return sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />;
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<EventCategory, number> = {
      speedrun: 0,
      fanart: 0,
      glitch: 0,
      teams: 0,
      custom: 0
    };

    events.forEach(event => {
      counts[event.category]++;
    });

    return counts;
  }, [events]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-pixel text-2xl text-battle64-primary">
          Events ({filteredAndSortedEvents.length})
        </h2>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewChange({ ...view, type: 'list' })}
            className={`p-2 rounded transition-colors ${
              view.type === 'list' 
                ? 'bg-battle64-primary text-white' 
                : 'bg-battle64-dark border border-battle64-primary text-battle64-primary hover:bg-battle64-primary/20'
            }`}
          >
            <List size={20} />
          </button>
          
          <button
            onClick={() => onViewChange({ ...view, type: 'month' })}
            className={`p-2 rounded transition-colors ${
              view.type === 'month' 
                ? 'bg-battle64-primary text-white' 
                : 'bg-battle64-dark border border-battle64-primary text-battle64-primary hover:bg-battle64-primary/20'
            }`}
          >
            <Grid size={20} />
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-battle64-dark border border-battle64-primary rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Events suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-battle64-dark border border-battle64-primary rounded font-retro text-battle64-light placeholder-battle64-light/50 focus:outline-none focus:ring-2 focus:ring-battle64-primary"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-battle64-accent" />
            <select
              value={view.filter || ''}
              onChange={(e) => onViewChange({ ...view, filter: e.target.value as EventCategory || undefined })}
              className="px-3 py-2 bg-battle64-dark border border-battle64-primary rounded font-retro text-battle64-light focus:outline-none focus:ring-2 focus:ring-battle64-primary"
            >
              <option value="">Alle Kategorien</option>
              <option value="speedrun">Speedrun ({categoryCounts.speedrun})</option>
              <option value="fanart">Fanart ({categoryCounts.fanart})</option>
              <option value="glitch">Glitch ({categoryCounts.glitch})</option>
              <option value="teams">Teams ({categoryCounts.teams})</option>
              <option value="custom">Custom ({categoryCounts.custom})</option>
            </select>
          </div>

          {/* My Events Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={view.showOnlyMyEvents}
              onChange={(e) => onViewChange({ ...view, showOnlyMyEvents: e.target.checked })}
              className="w-4 h-4 text-battle64-primary bg-battle64-dark border-battle64-primary rounded focus:ring-battle64-primary"
            />
            <span className="font-retro text-sm text-battle64-light">Nur meine Events</span>
          </label>

          {/* Top Events Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={view.showTopEvents}
              onChange={(e) => onViewChange({ ...view, showTopEvents: e.target.checked })}
              className="w-4 h-4 text-battle64-primary bg-battle64-dark border-battle64-primary rounded focus:ring-battle64-primary"
            />
            <span className="font-retro text-sm text-battle64-light">Top Events</span>
          </label>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-4">
        <span className="font-retro text-sm text-battle64-light">Sortieren nach:</span>
        
        {(['date', 'title', 'category', 'participants'] as SortOption[]).map(option => (
          <button
            key={option}
            onClick={() => handleSort(option)}
            className="flex items-center gap-1 px-3 py-1 rounded font-retro text-sm transition-colors hover:bg-battle64-primary/20"
          >
            <span className={sortBy === option ? 'text-battle64-primary' : 'text-battle64-light'}>
              {option === 'date' ? 'Datum' :
               option === 'title' ? 'Titel' :
               option === 'category' ? 'Kategorie' :
               'Teilnehmer'}
            </span>
            {getSortIcon(option)}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {filteredAndSortedEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="font-pixel text-xl text-battle64-primary mb-2">Keine Events gefunden</h3>
          <p className="text-battle64-light/70">Versuche andere Filter oder suche nach anderen Begriffen</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onParticipate={onParticipate}
              onSetReminder={onSetReminder}
              isParticipating={userEvents.includes(event.id)}
              hasReminder={userReminders.includes(event.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
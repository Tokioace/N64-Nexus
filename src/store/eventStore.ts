import { create } from 'zustand';
import { Event, EventFormData, Game, EventParticipant } from '../types/event';

interface EventStore {
  events: Event[];
  games: Game[];
  currentEvent: Event | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  setCurrentEvent: (event: Event | null) => void;
  setGames: (games: Game[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Event management
  createEvent: (eventData: EventFormData) => Promise<void>;
  publishEvent: (id: string) => Promise<void>;
  archiveEvent: (id: string) => Promise<void>;
  duplicateEvent: (id: string) => Promise<void>;
  
  // Participant management
  addParticipant: (eventId: string, participant: EventParticipant) => void;
  updateParticipant: (eventId: string, participantId: string, updates: Partial<EventParticipant>) => void;
  verifySubmission: (eventId: string, participantId: string) => void;
}

// Mock data for development
const mockGames: Game[] = [
  { id: '1', title: 'Super Mario 64', platform: 'N64', category: 'Platformer' },
  { id: '2', title: 'The Legend of Zelda: Ocarina of Time', platform: 'N64', category: 'Adventure' },
  { id: '3', title: 'GoldenEye 007', platform: 'N64', category: 'FPS' },
  { id: '4', title: 'Mario Kart 64', platform: 'N64', category: 'Racing' },
  { id: '5', title: 'Super Smash Bros.', platform: 'N64', category: 'Fighting' },
  { id: '6', title: 'Banjo-Kazooie', platform: 'N64', category: 'Platformer' },
  { id: '7', title: 'Donkey Kong 64', platform: 'N64', category: 'Platformer' },
  { id: '8', title: 'Star Fox 64', platform: 'N64', category: 'Shooter' },
];

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  games: mockGames,
  currentEvent: null,
  isLoading: false,
  error: null,
  
  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, updates) => set((state) => ({
    events: state.events.map(event => 
      event.id === id ? { ...event, ...updates, updatedAt: new Date() } : event
    )
  })),
  deleteEvent: (id) => set((state) => ({
    events: state.events.filter(event => event.id !== id)
  })),
  setCurrentEvent: (event) => set({ currentEvent: event }),
  setGames: (games) => set({ games }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  createEvent: async (eventData) => {
    set({ isLoading: true, error: null });
    try {
      const game = get().games.find(g => g.id === eventData.gameId);
      if (!game) throw new Error('Game not found');
      
      const newEvent: Event = {
        id: Date.now().toString(),
        ...eventData,
        game,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'admin', // TODO: Get from auth
        participants: []
      };
      
      set((state) => ({ 
        events: [...state.events, newEvent],
        isLoading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create event', isLoading: false });
    }
  },
  
  publishEvent: async (id) => {
    set({ isLoading: true });
    try {
      get().updateEvent(id, { status: 'published' });
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to publish event', isLoading: false });
    }
  },
  
  archiveEvent: async (id) => {
    set({ isLoading: true });
    try {
      get().updateEvent(id, { status: 'archived' });
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to archive event', isLoading: false });
    }
  },
  
  duplicateEvent: async (id) => {
    set({ isLoading: true });
    try {
      const originalEvent = get().events.find(e => e.id === id);
      if (!originalEvent) throw new Error('Event not found');
      
      const duplicatedEvent: Event = {
        ...originalEvent,
        id: Date.now().toString(),
        title: `${originalEvent.title} (Kopie)`,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        participants: []
      };
      
      set((state) => ({ 
        events: [...state.events, duplicatedEvent],
        isLoading: false 
      }));
    } catch (error) {
      set({ error: 'Failed to duplicate event', isLoading: false });
    }
  },
  
  addParticipant: (eventId, participant) => {
    set((state) => ({
      events: state.events.map(event =>
        event.id === eventId
          ? { ...event, participants: [...(event.participants || []), participant] }
          : event
      )
    }));
  },
  
  updateParticipant: (eventId, participantId, updates) => {
    set((state) => ({
      events: state.events.map(event =>
        event.id === eventId
          ? {
              ...event,
              participants: event.participants?.map(p =>
                p.id === participantId ? { ...p, ...updates } : p
              )
            }
          : event
      )
    }));
  },
  
  verifySubmission: (eventId, participantId) => {
    get().updateParticipant(eventId, participantId, { verified: true });
  }
}));
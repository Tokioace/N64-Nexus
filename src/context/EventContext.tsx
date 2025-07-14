import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, LeaderboardEntry } from '../types';

interface EventContextType {
  currentEvent: Event | null;
  activeEvents: Event[];
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  joinEvent: (eventId: string) => Promise<boolean>;
  leaveEvent: (eventId: string) => Promise<boolean>;
  getEventLeaderboard: (eventId: string) => Promise<LeaderboardEntry[]>;
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [activeEvents, setActiveEvents] = useState<Event[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadActiveEvents();
  }, []);

  const loadActiveEvents = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement actual API call
      const mockEvents: Event[] = [
        {
          id: '1',
          name: 'Super Mario 64 Speedrun',
          description: 'Complete Super Mario 64 as fast as possible',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          isActive: true,
          game: 'Super Mario 64',
          category: 'Any%',
          maxParticipants: 100,
          currentParticipants: 45,
          rules: [
            'No glitches allowed',
            'Must complete all required stars',
            'Video proof required'
          ],
          prizes: ['1st Place: $100', '2nd Place: $50', '3rd Place: $25']
        },
        {
          id: '2',
          name: 'Zelda OoT 100%',
          description: 'Complete The Legend of Zelda: Ocarina of Time 100%',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-06-30'),
          isActive: true,
          game: 'The Legend of Zelda: Ocarina of Time',
          category: '100%',
          maxParticipants: 50,
          currentParticipants: 23,
          rules: [
            'All heart pieces required',
            'All skulltulas required',
            'Screenshot proof required'
          ]
        }
      ];
      
      setActiveEvents(mockEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const joinEvent = async (eventId: string): Promise<boolean> => {
    try {
      // TODO: Implement actual API call
      const event = activeEvents.find(e => e.id === eventId);
      if (event && event.currentParticipants < (event.maxParticipants || Infinity)) {
        const updatedEvents = activeEvents.map(e => 
          e.id === eventId 
            ? { ...e, currentParticipants: e.currentParticipants + 1 }
            : e
        );
        setActiveEvents(updatedEvents);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error joining event:', error);
      return false;
    }
  };

  const leaveEvent = async (eventId: string): Promise<boolean> => {
    try {
      // TODO: Implement actual API call
      const updatedEvents = activeEvents.map(e => 
        e.id === eventId 
          ? { ...e, currentParticipants: Math.max(0, e.currentParticipants - 1) }
          : e
      );
      setActiveEvents(updatedEvents);
      return true;
    } catch (error) {
      console.error('Error leaving event:', error);
      return false;
    }
  };

  const getEventLeaderboard = async (eventId: string): Promise<LeaderboardEntry[]> => {
    try {
      // TODO: Implement actual API call
      const mockLeaderboard: LeaderboardEntry[] = [
        {
          id: '1',
          userId: 'user1',
          username: 'SpeedRunner1',
          eventId,
          score: 100,
          time: '1:23:45',
          submissionId: 'sub1',
          rank: 1,
          platform: 'PAL',
          submittedAt: new Date()
        },
        {
          id: '2',
          userId: 'user2',
          username: 'GamingPro',
          eventId,
          score: 95,
          time: '1:25:12',
          submissionId: 'sub2',
          rank: 2,
          platform: 'NTSC',
          submittedAt: new Date()
        }
      ];
      
      setLeaderboard(mockLeaderboard);
      return mockLeaderboard;
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      return [];
    }
  };

  const refreshEvents = async () => {
    await loadActiveEvents();
  };

  const value: EventContextType = {
    currentEvent,
    activeEvents,
    leaderboard,
    isLoading,
    joinEvent,
    leaveEvent,
    getEventLeaderboard,
    refreshEvents,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};
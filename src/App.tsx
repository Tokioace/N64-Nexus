import React, { useState, useEffect } from 'react';
import { Event, CalendarView, ReminderSettings as ReminderSettingsType, Notification } from './types/event';
import { Calendar } from './components/Calendar';
import { EventList } from './components/EventList';
import { EventCard } from './components/EventCard';
import { ReminderSettings } from './components/ReminderSettings';
import { mockEvents } from './data/mockEvents';
import { Bell, Calendar as CalendarIcon, List, Settings, X } from 'lucide-react';

function App() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [view, setView] = useState<CalendarView>({
    type: 'month',
    showOnlyMyEvents: false,
    showTopEvents: false
  });
  
  const [userEvents, setUserEvents] = useState<string[]>([]);
  const [userReminders, setUserReminders] = useState<string[]>([]);
  const [reminderSettings, setReminderSettings] = useState<Record<string, ReminderSettingsType[]>>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showReminderSettings, setShowReminderSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter events based on view settings
  const filteredEvents = events.filter(event => {
    if (view.filter && event.category !== view.filter) return false;
    if (view.showOnlyMyEvents && !userEvents.includes(event.id)) return false;
    if (view.showTopEvents && !event.isTopEvent) return false;
    return true;
  });

  const handleParticipate = (eventId: string) => {
    setUserEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSetReminder = (eventId: string, enabled: boolean) => {
    setUserReminders(prev => 
      enabled 
        ? [...prev, eventId]
        : prev.filter(id => id !== eventId)
    );
    
    if (enabled) {
      setSelectedEvent(events.find(e => e.id === eventId) || null);
      setShowReminderSettings(true);
    }
  };

  const handleSaveReminderSettings = (eventId: string, settings: ReminderSettingsType[]) => {
    setReminderSettings(prev => ({
      ...prev,
      [eventId]: settings
    }));
    
    // Add notification
    const event = events.find(e => e.id === eventId);
    if (event) {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'reminder',
        title: 'Erinnerung gesetzt',
        message: `Erinnerungen für "${event.title}" wurden aktiviert`,
        eventId: eventId,
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleDayClick = (date: Date) => {
    console.log('Day clicked:', date);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="min-h-screen bg-battle64-dark text-battle64-light">
      {/* Header */}
      <header className="bg-battle64-dark border-b border-battle64-primary p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎮</div>
            <h1 className="font-pixel text-2xl text-battle64-primary">Battle64</h1>
            <span className="text-battle64-light/70 font-retro">Event Kalender</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-battle64-primary/20 rounded transition-colors"
              >
                <Bell size={20} className="text-battle64-primary" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-battle64-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-pixel">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-battle64-dark border border-battle64-primary rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-battle64-primary">
                    <h3 className="font-pixel text-battle64-primary">Benachrichtigungen</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-battle64-light/70">
                        Keine Benachrichtigungen
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-battle64-primary/30 cursor-pointer hover:bg-battle64-primary/10 transition-colors ${
                            !notification.read ? 'bg-battle64-primary/5' : ''
                          }`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="font-pixel text-sm text-battle64-primary">
                            {notification.title}
                          </div>
                          <div className="text-xs text-battle64-light/70 mt-1">
                            {notification.message}
                          </div>
                          <div className="text-xs text-battle64-light/50 mt-2">
                            {notification.timestamp.toLocaleString('de-DE')}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Settings */}
            <button className="p-2 hover:bg-battle64-primary/20 rounded transition-colors">
              <Settings size={20} className="text-battle64-primary" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            {view.type === 'month' ? (
              <Calendar
                events={filteredEvents}
                onDayClick={handleDayClick}
                onEventClick={handleEventClick}
              />
            ) : (
              <EventList
                events={filteredEvents}
                view={view}
                onViewChange={setView}
                onParticipate={handleParticipate}
                onSetReminder={handleSetReminder}
                userEvents={userEvents}
                userReminders={userReminders}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-battle64-dark border border-battle64-primary rounded-lg p-4">
              <h3 className="font-pixel text-lg text-battle64-primary mb-3">Statistiken</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Meine Events:</span>
                  <span className="text-battle64-accent">{userEvents.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Aktive Erinnerungen:</span>
                  <span className="text-battle64-accent">{userReminders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Top Events:</span>
                  <span className="text-battle64-warning">{events.filter(e => e.isTopEvent).length}</span>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-battle64-dark border border-battle64-primary rounded-lg p-4">
              <h3 className="font-pixel text-lg text-battle64-primary mb-3">Nächste Events</h3>
              <div className="space-y-2">
                {events
                  .filter(e => e.startDate > new Date())
                  .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                  .slice(0, 3)
                  .map(event => (
                    <div
                      key={event.id}
                      className="p-2 bg-battle64-dark/50 border border-battle64-primary rounded cursor-pointer hover:bg-battle64-primary/10 transition-colors"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="font-pixel text-sm text-battle64-primary">{event.title}</div>
                      <div className="text-xs text-battle64-light/70">
                        {event.startDate.toLocaleDateString('de-DE')}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* My Events */}
            {userEvents.length > 0 && (
              <div className="bg-battle64-dark border border-battle64-primary rounded-lg p-4">
                <h3 className="font-pixel text-lg text-battle64-primary mb-3">Meine Events</h3>
                <div className="space-y-2">
                  {events
                    .filter(e => userEvents.includes(e.id))
                    .map(event => (
                      <div
                        key={event.id}
                        className="p-2 bg-battle64-dark/50 border border-battle64-primary rounded cursor-pointer hover:bg-battle64-primary/10 transition-colors"
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="font-pixel text-sm text-battle64-primary">{event.title}</div>
                        <div className="text-xs text-battle64-light/70">
                          {event.startDate.toLocaleDateString('de-DE')}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Event Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-battle64-dark border border-battle64-primary rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-pixel text-xl text-battle64-primary">Event Details</h2>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-battle64-light hover:text-battle64-primary transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <EventCard
                  event={selectedEvent}
                  onParticipate={handleParticipate}
                  onSetReminder={handleSetReminder}
                  isParticipating={userEvents.includes(selectedEvent.id)}
                  hasReminder={userReminders.includes(selectedEvent.id)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Reminder Settings Modal */}
        {showReminderSettings && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <ReminderSettings
                eventId={selectedEvent.id}
                eventTitle={selectedEvent.title}
                eventDate={selectedEvent.startDate}
                currentSettings={reminderSettings[selectedEvent.id] || []}
                onSave={handleSaveReminderSettings}
                onClose={() => {
                  setShowReminderSettings(false);
                  setSelectedEvent(null);
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
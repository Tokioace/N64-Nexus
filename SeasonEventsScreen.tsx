import React, { useState, useEffect } from 'react';
import './SeasonEventsScreen.css';

interface SeasonalEvent {
  id: string;
  name: string;
  theme: 'halloween' | 'christmas' | 'summer' | 'spring' | 'winter';
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  description: string;
  rewards: Reward[];
  isActive: boolean;
  isUpcoming: boolean;
  participants: number;
  maxParticipants: number;
}

interface Reward {
  id: string;
  name: string;
  type: 'badge' | 'skin' | 'card' | 'currency';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  imageUrl: string;
  description: string;
}

const SeasonEventsScreen: React.FC = () => {
  const [events, setEvents] = useState<SeasonalEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SeasonalEvent | null>(null);
  const [currentTheme, setCurrentTheme] = useState<string>('default');

  // Mock data for seasonal events
  const mockEvents: SeasonalEvent[] = [
    {
      id: '1',
      name: 'Halloween Spooktacular',
      theme: 'halloween',
      startDate: new Date('2024-10-31'),
      endDate: new Date('2024-11-07'),
      registrationDeadline: new Date('2024-10-30'),
      description: 'Spooky racing through haunted tracks with ghostly opponents!',
      rewards: [
        {
          id: 'h1',
          name: 'Ghost Rider Badge',
          type: 'badge',
          rarity: 'epic',
          imageUrl: '/badges/ghost-rider.png',
          description: 'Awarded for completing all Halloween challenges'
        },
        {
          id: 'h2',
          name: 'Pumpkin Car Skin',
          type: 'skin',
          rarity: 'rare',
          imageUrl: '/skins/pumpkin-car.png',
          description: 'Spooky pumpkin-themed car skin'
        }
      ],
      isActive: false,
      isUpcoming: true,
      participants: 1250,
      maxParticipants: 2000
    },
    {
      id: '2',
      name: 'Christmas Racing Festival',
      theme: 'christmas',
      startDate: new Date('2024-12-20'),
      endDate: new Date('2024-12-27'),
      registrationDeadline: new Date('2024-12-19'),
      description: 'Festive racing through winter wonderlands!',
      rewards: [
        {
          id: 'c1',
          name: 'Santa\'s Helper Badge',
          type: 'badge',
          rarity: 'legendary',
          imageUrl: '/badges/santa-helper.png',
          description: 'Complete all Christmas missions'
        },
        {
          id: 'c2',
          name: 'Snowflake Card Pack',
          type: 'card',
          rarity: 'epic',
          imageUrl: '/cards/snowflake-pack.png',
          description: 'Special Christmas card collection'
        }
      ],
      isActive: false,
      isUpcoming: true,
      participants: 890,
      maxParticipants: 1500
    },
    {
      id: '3',
      name: 'Summer Speed Championship',
      theme: 'summer',
      startDate: new Date('2024-07-15'),
      endDate: new Date('2024-07-22'),
      registrationDeadline: new Date('2024-07-14'),
      description: 'Hot summer racing action on beach tracks!',
      rewards: [
        {
          id: 's1',
          name: 'Beach Champion Badge',
          type: 'badge',
          rarity: 'rare',
          imageUrl: '/badges/beach-champion.png',
          description: 'Win the summer championship'
        },
        {
          id: 's2',
          name: 'Tropical Car Skin',
          type: 'skin',
          rarity: 'epic',
          imageUrl: '/skins/tropical-car.png',
          description: 'Colorful tropical-themed skin'
        }
      ],
      isActive: false,
      isUpcoming: false,
      participants: 2100,
      maxParticipants: 2500
    }
  ];

  useEffect(() => {
    setEvents(mockEvents);
    updateCurrentTheme();
  }, []);

  const updateCurrentTheme = () => {
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    
    if (currentMonth === 9 && currentDay >= 15) { // October
      setCurrentTheme('halloween');
    } else if (currentMonth === 11 && currentDay >= 1) { // December
      setCurrentTheme('christmas');
    } else if (currentMonth >= 5 && currentMonth <= 7) { // June-August
      setCurrentTheme('summer');
    } else if (currentMonth >= 2 && currentMonth <= 4) { // March-May
      setCurrentTheme('spring');
    } else {
      setCurrentTheme('winter');
    }
  };

  const getThemeColors = (theme: string) => {
    switch (theme) {
      case 'halloween':
        return {
          primary: '#FF6B35',
          secondary: '#8B4513',
          accent: '#FFD700',
          background: '#2C1810',
          text: '#FFFFFF'
        };
      case 'christmas':
        return {
          primary: '#D42426',
          secondary: '#228B22',
          accent: '#FFD700',
          background: '#1B3D59',
          text: '#FFFFFF'
        };
      case 'summer':
        return {
          primary: '#FF6B6B',
          secondary: '#4ECDC4',
          accent: '#FFE66D',
          background: '#2C3E50',
          text: '#FFFFFF'
        };
      case 'spring':
        return {
          primary: '#FF69B4',
          secondary: '#98FB98',
          accent: '#FFB6C1',
          background: '#2F4F4F',
          text: '#FFFFFF'
        };
      default:
        return {
          primary: '#87CEEB',
          secondary: '#F0F8FF',
          accent: '#FFD700',
          background: '#1E3A8A',
          text: '#FFFFFF'
        };
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    
    if (diff <= 0) return 'Registrierung beendet';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h verbleibend`;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#9CA3AF';
      case 'rare': return '#3B82F6';
      case 'epic': return '#8B5CF6';
      case 'legendary': return '#F59E0B';
      default: return '#9CA3AF';
    }
  };

  const handleEventClick = (event: SeasonalEvent) => {
    setSelectedEvent(event);
  };

  const handleRegister = (eventId: string) => {
    // Mock registration logic
    console.log(`Registering for event: ${eventId}`);
    // Here you would typically make an API call
  };

  const colors = getThemeColors(currentTheme);

  return (
    <div className="season-events-screen" style={{ backgroundColor: colors.background }}>
      <div className="header" style={{ backgroundColor: colors.primary }}>
        <h1 style={{ color: colors.text }}>Saisonale Events</h1>
        <div className="theme-indicator" style={{ backgroundColor: colors.accent }}>
          <span style={{ color: colors.background }}>
            {currentTheme === 'halloween' && '🎃 Halloween'}
            {currentTheme === 'christmas' && '🎄 Weihnachten'}
            {currentTheme === 'summer' && '☀️ Sommer'}
            {currentTheme === 'spring' && '🌸 Frühling'}
            {currentTheme === 'winter' && '❄️ Winter'}
          </span>
        </div>
      </div>

      <div className="events-container">
        <div className="events-grid">
          {events.map((event) => (
            <div
              key={event.id}
              className={`event-card ${event.isActive ? 'active' : ''} ${event.isUpcoming ? 'upcoming' : ''}`}
              style={{ 
                borderColor: colors.primary,
                backgroundColor: event.isActive ? colors.primary + '20' : 'rgba(255,255,255,0.1)'
              }}
              onClick={() => handleEventClick(event)}
            >
              <div className="event-header">
                <h3 style={{ color: colors.text }}>{event.name}</h3>
                <div className="event-status">
                  {event.isActive && <span className="status active">Aktiv</span>}
                  {event.isUpcoming && <span className="status upcoming">Geplant</span>}
                  {!event.isActive && !event.isUpcoming && <span className="status past">Vergangen</span>}
                </div>
              </div>

              <div className="event-dates">
                <p style={{ color: colors.text }}>
                  <strong>Start:</strong> {formatDate(event.startDate)}
                </p>
                <p style={{ color: colors.text }}>
                  <strong>Ende:</strong> {formatDate(event.endDate)}
                </p>
              </div>

              <div className="countdown" style={{ color: colors.accent }}>
                {getTimeRemaining(event.registrationDeadline)}
              </div>

              <div className="participants">
                <div className="participant-bar">
                  <div 
                    className="participant-fill" 
                    style={{ 
                      width: `${(event.participants / event.maxParticipants) * 100}%`,
                      backgroundColor: colors.secondary
                    }}
                  />
                </div>
                <span style={{ color: colors.text }}>
                  {event.participants}/{event.maxParticipants} Teilnehmer
                </span>
              </div>

              <div className="rewards-preview">
                <h4 style={{ color: colors.text }}>Belohnungen:</h4>
                <div className="rewards-grid">
                  {event.rewards.slice(0, 2).map((reward) => (
                    <div 
                      key={reward.id} 
                      className="reward-item"
                      style={{ borderColor: getRarityColor(reward.rarity) }}
                    >
                      <div className="reward-icon">🎁</div>
                      <span style={{ color: colors.text }}>{reward.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {event.isUpcoming && (
                <button
                  className="register-btn"
                  style={{ 
                    backgroundColor: colors.accent,
                    color: colors.background
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRegister(event.id);
                  }}
                >
                  Registrieren
                </button>
              )}
            </div>
          ))}
        </div>

        {selectedEvent && (
          <div className="event-details-modal" onClick={() => setSelectedEvent(null)}>
            <div 
              className="modal-content"
              style={{ backgroundColor: colors.background }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header" style={{ backgroundColor: colors.primary }}>
                <h2 style={{ color: colors.text }}>{selectedEvent.name}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedEvent(null)}
                  style={{ color: colors.text }}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="event-description">
                  <p style={{ color: colors.text }}>{selectedEvent.description}</p>
                </div>

                <div className="event-schedule">
                  <h3 style={{ color: colors.text }}>Zeitplan</h3>
                  <div className="schedule-grid">
                    <div>
                      <strong style={{ color: colors.accent }}>Registrierung bis:</strong>
                      <p style={{ color: colors.text }}>{formatDate(selectedEvent.registrationDeadline)}</p>
                    </div>
                    <div>
                      <strong style={{ color: colors.accent }}>Event Start:</strong>
                      <p style={{ color: colors.text }}>{formatDate(selectedEvent.startDate)}</p>
                    </div>
                    <div>
                      <strong style={{ color: colors.accent }}>Event Ende:</strong>
                      <p style={{ color: colors.text }}>{formatDate(selectedEvent.endDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="rewards-section">
                  <h3 style={{ color: colors.text }}>Alle Belohnungen</h3>
                  <div className="rewards-list">
                    {selectedEvent.rewards.map((reward) => (
                      <div 
                        key={reward.id} 
                        className="reward-detail"
                        style={{ borderColor: getRarityColor(reward.rarity) }}
                      >
                        <div className="reward-header">
                          <div className="reward-type-icon">
                            {reward.type === 'badge' && '🏆'}
                            {reward.type === 'skin' && '🎨'}
                            {reward.type === 'card' && '🃏'}
                            {reward.type === 'currency' && '💰'}
                          </div>
                          <div className="reward-info">
                            <h4 style={{ color: colors.text }}>{reward.name}</h4>
                            <span 
                              className="rarity-badge"
                              style={{ backgroundColor: getRarityColor(reward.rarity) }}
                            >
                              {reward.rarity}
                            </span>
                          </div>
                        </div>
                        <p style={{ color: colors.text }}>{reward.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedEvent.isUpcoming && (
                  <div className="registration-section">
                    <button
                      className="register-btn-large"
                      style={{ 
                        backgroundColor: colors.accent,
                        color: colors.background
                      }}
                      onClick={() => handleRegister(selectedEvent.id)}
                    >
                      Jetzt Registrieren
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeasonEventsScreen;
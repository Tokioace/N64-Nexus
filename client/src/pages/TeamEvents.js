import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUsers, FaTrophy, FaClock, FaFilter, FaSearch, FaGamepad } from 'react-icons/fa';
import toast from 'react-hot-toast';

const EventsContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const EventsHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const EventsTitle = styled.h1`
  font-family: 'Press Start 2P', cursive;
  font-size: 2.5rem;
  color: #00ff41;
  margin-bottom: 1rem;
  text-shadow: 0 0 15px rgba(0, 255, 65, 0.5);
`;

const EventsSubtitle = styled.p`
  font-size: 1.2rem;
  color: #00cc33;
  margin-bottom: 2rem;
`;

const FiltersSection = styled.div`
  background: rgba(15, 15, 35, 0.8);
  border: 2px solid #00ff41;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 3rem;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  color: #00ff41;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
`;

const FilterSelect = styled.select`
  background: rgba(26, 26, 46, 0.8);
  border: 2px solid #00ff41;
  color: #00ff41;
  padding: 0.75rem;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
  }
  
  option {
    background: #1a1a2e;
    color: #00ff41;
  }
`;

const SearchInput = styled.input`
  background: rgba(26, 26, 46, 0.8);
  border: 2px solid #00ff41;
  color: #00ff41;
  padding: 0.75rem;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  
  &::placeholder {
    color: #00cc33;
    opacity: 0.7;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const EventCard = styled(motion.div)`
  background: rgba(15, 15, 35, 0.8);
  border: 2px solid #00ff41;
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 30px rgba(0, 255, 65, 0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #00ff41, #00cc33, #00ff41);
  }
`;

const EventStatus = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &.upcoming {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
    border: 1px solid #ffc107;
  }
  
  &.active {
    background: rgba(0, 255, 65, 0.2);
    color: #00ff41;
    border: 1px solid #00ff41;
    animation: pulse 2s infinite;
  }
  
  &.completed {
    background: rgba(108, 117, 125, 0.2);
    color: #6c757d;
    border: 1px solid #6c757d;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

const EventTitle = styled.h3`
  font-size: 1.5rem;
  color: #00ff41;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const EventDescription = styled.p`
  color: #00cc33;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const EventDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const EventDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #00cc33;
  font-size: 0.9rem;
`;

const EventActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ActionButton = styled(Link)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(45deg, #00ff41, #00cc33);
  color: #0f0f23;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.4);
  }
`;

const SecondaryButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: transparent;
  color: #00ff41;
  border: 2px solid #00ff41;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 255, 65, 0.1);
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #00cc33;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const TeamEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    region: 'all',
    game: 'all',
    search: ''
  });
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const mockEvents = [
      {
        id: '1',
        name: 'Super Mario 64 Team Challenge',
        description: 'Das ultimative Team-Event für Mario 64 Speedrunner! Sammelt eure besten Zeiten und kämpft um den Titel.',
        game: 'Super Mario 64',
        category: 'Any%',
        region: 'PAL',
        status: 'upcoming',
        startDate: '2024-02-15T18:00:00Z',
        endDate: '2024-02-16T18:00:00Z',
        maxTeams: 32,
        minTeamSize: 2,
        maxTeamSize: 4,
        participants: 12,
        rewards: {
          first: 'Gold Trophy + 1000 XP',
          second: 'Silver Trophy + 500 XP',
          third: 'Bronze Trophy + 250 XP'
        }
      },
      {
        id: '2',
        name: 'Zelda OoT Team Tournament',
        description: 'Team up für das legendäre Zelda Ocarina of Time Event! Koordiniert eure Strategien und schlagt alle Rekorde.',
        game: 'The Legend of Zelda: Ocarina of Time',
        category: 'Any%',
        region: 'NTSC',
        status: 'active',
        startDate: '2024-02-10T18:00:00Z',
        endDate: '2024-02-12T18:00:00Z',
        maxTeams: 24,
        minTeamSize: 3,
        maxTeamSize: 4,
        participants: 18,
        rewards: {
          first: 'Master Sword Trophy + 1500 XP',
          second: 'Hylian Shield + 750 XP',
          third: 'Triforce Medal + 375 XP'
        }
      },
      {
        id: '3',
        name: 'GoldenEye 007 Team Mission',
        description: 'Mission: Impossible! Euer Team muss alle Level in Rekordzeit abschließen. Nur die Besten überleben.',
        game: 'GoldenEye 007',
        category: '100%',
        region: 'PAL',
        status: 'completed',
        startDate: '2024-01-20T18:00:00Z',
        endDate: '2024-01-22T18:00:00Z',
        maxTeams: 16,
        minTeamSize: 2,
        maxTeamSize: 3,
        participants: 14,
        rewards: {
          first: 'Golden Gun Trophy + 2000 XP',
          second: 'Silver PP7 + 1000 XP',
          third: 'Bronze Watch + 500 XP'
        }
      }
    ];

    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = events;

    if (filters.status !== 'all') {
      filtered = filtered.filter(event => event.status === filters.status);
    }

    if (filters.region !== 'all') {
      filtered = filtered.filter(event => event.region === filters.region);
    }

    if (filters.game !== 'all') {
      filtered = filtered.filter(event => event.game === filters.game);
    }

    if (filters.search) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.game.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [events, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleRegister = (eventId) => {
    toast.success('Team erfolgreich für Event registriert!');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming': return 'Bevorstehend';
      case 'active': return 'Aktiv';
      case 'completed': return 'Abgeschlossen';
      default: return status;
    }
  };

  if (loading) {
    return (
      <EventsContainer>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', color: '#00ff41' }}>Lade Events...</div>
        </div>
      </EventsContainer>
    );
  }

  return (
    <EventsContainer>
      <EventsHeader>
        <EventsTitle>🏆 TEAM EVENTS</EventsTitle>
        <EventsSubtitle>
          Entdecke spannende Team-Speedrun-Events und tritt mit deinem Team an!
        </EventsSubtitle>
      </EventsHeader>

      <FiltersSection>
        <FiltersGrid>
          <FilterGroup>
            <FilterLabel>Status</FilterLabel>
            <FilterSelect
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">Alle Status</option>
              <option value="upcoming">Bevorstehend</option>
              <option value="active">Aktiv</option>
              <option value="completed">Abgeschlossen</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Region</FilterLabel>
            <FilterSelect
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
            >
              <option value="all">Alle Regionen</option>
              <option value="PAL">PAL</option>
              <option value="NTSC">NTSC</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Spiel</FilterLabel>
            <FilterSelect
              value={filters.game}
              onChange={(e) => handleFilterChange('game', e.target.value)}
            >
              <option value="all">Alle Spiele</option>
              <option value="Super Mario 64">Super Mario 64</option>
              <option value="The Legend of Zelda: Ocarina of Time">Zelda OoT</option>
              <option value="GoldenEye 007">GoldenEye 007</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Suche</FilterLabel>
            <SearchInput
              type="text"
              placeholder="Event oder Spiel suchen..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </FilterGroup>
        </FiltersGrid>
      </FiltersSection>

      {filteredEvents.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>🎮</EmptyStateIcon>
          <h3>Keine Events gefunden</h3>
          <p>Versuche andere Filtereinstellungen oder schaue später wieder vorbei.</p>
        </EmptyState>
      ) : (
        <EventsGrid>
          {filteredEvents.map((event, index) => (
            <EventCard
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <EventStatus className={event.status}>
                {getStatusText(event.status)}
              </EventStatus>

              <EventTitle>{event.name}</EventTitle>
              <EventDescription>{event.description}</EventDescription>

              <EventDetails>
                <EventDetail>
                  <FaGamepad />
                  {event.game}
                </EventDetail>
                <EventDetail>
                  <FaUsers />
                  {event.participants}/{event.maxTeams} Teams
                </EventDetail>
                <EventDetail>
                  <FaCalendarAlt />
                  {formatDate(event.startDate)}
                </EventDetail>
                <EventDetail>
                  <FaClock />
                  {event.minTeamSize}-{event.maxTeamSize} Spieler
                </EventDetail>
              </EventDetails>

              <EventActions>
                <ActionButton to={`/events/${event.id}`}>
                  <FaTrophy />
                  Details
                </ActionButton>
                
                {event.status === 'upcoming' && (
                  <SecondaryButton onClick={() => handleRegister(event.id)}>
                    Registrieren
                  </SecondaryButton>
                )}
                
                {event.status === 'active' && (
                  <ActionButton to={`/events/${event.id}`}>
                    <FaClock />
                    Live
                  </ActionButton>
                )}
              </EventActions>
            </EventCard>
          ))}
        </EventsGrid>
      )}
    </EventsContainer>
  );
};

export default TeamEvents;
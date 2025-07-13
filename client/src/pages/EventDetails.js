import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaTrophy, FaClock, FaUsers, FaGamepad, FaMedal, FaUpload, FaComments, FaCrown } from 'react-icons/fa';
import toast from 'react-hot-toast';

const EventContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const EventHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const EventTitle = styled.h1`
  font-family: 'Press Start 2P', cursive;
  font-size: 2.5rem;
  color: #00ff41;
  margin-bottom: 1rem;
  text-shadow: 0 0 15px rgba(0, 255, 65, 0.5);
`;

const EventStatus = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  
  &.active {
    background: rgba(0, 255, 65, 0.2);
    color: #00ff41;
    border: 2px solid #00ff41;
    animation: pulse 2s infinite;
  }
  
  &.upcoming {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
    border: 2px solid #ffc107;
  }
  
  &.completed {
    background: rgba(108, 117, 125, 0.2);
    color: #6c757d;
    border: 2px solid #6c757d;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  background: rgba(15, 15, 35, 0.8);
  border: 2px solid #00ff41;
  border-radius: 16px;
  padding: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #00ff41;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EventInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #00cc33;
  font-size: 1rem;
`;

const Leaderboard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LeaderboardItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(26, 26, 46, 0.8);
  border: 2px solid #00ff41;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
  }
  
  &.first {
    border-color: #ffd700;
    background: rgba(255, 215, 0, 0.1);
  }
  
  &.second {
    border-color: #c0c0c0;
    background: rgba(192, 192, 192, 0.1);
  }
  
  &.third {
    border-color: #cd7f32;
    background: rgba(205, 127, 50, 0.1);
  }
`;

const Rank = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  
  &.first {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #0f0f23;
  }
  
  &.second {
    background: linear-gradient(45deg, #c0c0c0, #e5e5e5);
    color: #0f0f23;
  }
  
  &.third {
    background: linear-gradient(45deg, #cd7f32, #daa520);
    color: #0f0f23;
  }
  
  &.other {
    background: rgba(0, 255, 65, 0.2);
    color: #00ff41;
  }
`;

const TeamInfo = styled.div`
  flex: 1;
`;

const TeamName = styled.h3`
  color: #00ff41;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const TeamMembers = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

const MemberTag = styled.span`
  background: rgba(0, 255, 65, 0.2);
  color: #00ff41;
  padding: 0.125rem 0.375rem;
  border-radius: 6px;
  font-size: 0.7rem;
`;

const TeamTime = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #00ff41;
  text-align: right;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TimeSubmission = styled.div`
  background: rgba(15, 15, 35, 0.8);
  border: 2px solid #00ff41;
  border-radius: 16px;
  padding: 2rem;
`;

const SubmissionForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  color: #00ff41;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
`;

const FormInput = styled.input`
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

const FileUpload = styled.div`
  border: 2px dashed #00ff41;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  color: #00cc33;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 255, 65, 0.1);
    border-color: #00cc33;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(45deg, #00ff41, #00cc33);
  color: #0f0f23;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ChatSection = styled.div`
  background: rgba(15, 15, 35, 0.8);
  border: 2px solid #00ff41;
  border-radius: 16px;
  padding: 2rem;
  max-height: 400px;
  display: flex;
  flex-direction: column;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ChatMessage = styled.div`
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  
  &.own {
    background: rgba(0, 255, 65, 0.2);
    color: #00ff41;
    align-self: flex-end;
  }
  
  &.other {
    background: rgba(0, 204, 51, 0.1);
    color: #00cc33;
    align-self: flex-start;
  }
`;

const ChatInput = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ChatInputField = styled.input`
  flex: 1;
  background: rgba(26, 26, 46, 0.8);
  border: 2px solid #00ff41;
  color: #00ff41;
  padding: 0.5rem;
  border-radius: 8px;
  font-family: inherit;
  
  &::placeholder {
    color: #00cc33;
    opacity: 0.7;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
  }
`;

const SendButton = styled.button`
  background: #00ff41;
  color: #0f0f23;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #00cc33;
  }
`;

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [submission, setSubmission] = useState({
    time: '',
    screenshot: null
  });
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  // Mock data - replace with API calls
  useEffect(() => {
    const mockEvent = {
      id: eventId,
      name: 'Super Mario 64 Team Challenge',
      description: 'Das ultimative Team-Event für Mario 64 Speedrunner! Sammelt eure besten Zeiten und kämpft um den Titel.',
      game: 'Super Mario 64',
      category: 'Any%',
      region: 'PAL',
      status: 'active',
      startDate: '2024-02-10T18:00:00Z',
      endDate: '2024-02-12T18:00:00Z',
      maxTeams: 32,
      minTeamSize: 2,
      maxTeamSize: 4,
      participants: 18,
      rewards: {
        first: 'Gold Trophy + 1000 XP',
        second: 'Silver Trophy + 500 XP',
        third: 'Bronze Trophy + 250 XP'
      }
    };

    const mockRankings = [
      {
        rank: 1,
        teamId: '1',
        teamName: 'Speed Demons',
        members: ['SpeedRunner1', 'MarioMaster', 'ZeldaPro'],
        totalTime: 7200, // 2 hours
        submissions: 3
      },
      {
        rank: 2,
        teamId: '2',
        teamName: 'Retro Warriors',
        members: ['RetroGamer', 'N64Legend'],
        totalTime: 7500, // 2:05:00
        submissions: 2
      },
      {
        rank: 3,
        teamId: '3',
        teamName: 'Golden Team',
        members: ['GoldenPlayer', 'SpeedKing', 'MarioPro'],
        totalTime: 7800, // 2:10:00
        submissions: 3
      }
    ];

    const mockChatMessages = [
      { id: '1', userId: 'user1', userName: 'SpeedRunner1', message: 'Gute Zeit! 🏆', timestamp: new Date().toISOString() },
      { id: '2', userId: 'user2', userName: 'MarioMaster', message: 'Danke! Ihr seid auch stark!', timestamp: new Date().toISOString() },
      { id: '3', userId: 'user3', userName: 'ZeldaPro', message: 'Das wird spannend! 🔥', timestamp: new Date().toISOString() }
    ];

    setEvent(mockEvent);
    setRankings(mockRankings);
    setChatMessages(mockChatMessages);
  }, [eventId]);

  const handleTimeSubmit = (e) => {
    e.preventDefault();
    
    if (!submission.time) {
      toast.error('Zeit ist erforderlich!');
      return;
    }

    // Mock time submission
    toast.success('Zeit erfolgreich eingereicht!');
    setSubmission({ time: '', screenshot: null });
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      userId: 'currentUser',
      userName: 'Du',
      message: chatMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming': return 'Bevorstehend';
      case 'active': return 'Aktiv';
      case 'completed': return 'Abgeschlossen';
      default: return status;
    }
  };

  const getRankClass = (rank) => {
    switch (rank) {
      case 1: return 'first';
      case 2: return 'second';
      case 3: return 'third';
      default: return 'other';
    }
  };

  if (!event) {
    return (
      <EventContainer>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', color: '#00ff41' }}>Lade Event...</div>
        </div>
      </EventContainer>
    );
  }

  return (
    <EventContainer>
      <EventHeader>
        <EventTitle>{event.name}</EventTitle>
        <EventStatus className={event.status}>
          <FaClock />
          {getStatusText(event.status)}
        </EventStatus>
      </EventHeader>

      <EventGrid>
        <MainSection>
          <Section>
            <SectionTitle>
              <FaGamepad />
              Event Details
            </SectionTitle>
            
            <EventInfo>
              <InfoItem>
                <FaGamepad />
                {event.game}
              </InfoItem>
              <InfoItem>
                <FaUsers />
                {event.participants}/{event.maxTeams} Teams
              </InfoItem>
              <InfoItem>
                <FaClock />
                {event.minTeamSize}-{event.maxTeamSize} Spieler pro Team
              </InfoItem>
              <InfoItem>
                <FaTrophy />
                {event.category}
              </InfoItem>
            </EventInfo>
            
            <p style={{ color: '#00cc33', lineHeight: '1.6' }}>
              {event.description}
            </p>
          </Section>

          <Section>
            <SectionTitle>
              <FaTrophy />
              Live Rankings
            </SectionTitle>
            
            <Leaderboard>
              {rankings.map((team, index) => (
                <LeaderboardItem
                  key={team.teamId}
                  className={getRankClass(team.rank)}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Rank className={getRankClass(team.rank)}>
                    {team.rank === 1 && <FaCrown />}
                    {team.rank === 2 && <FaMedal />}
                    {team.rank === 3 && <FaMedal />}
                    {team.rank > 3 && team.rank}
                  </Rank>
                  
                  <TeamInfo>
                    <TeamName>{team.teamName}</TeamName>
                    <TeamMembers>
                      {team.members.map((member, idx) => (
                        <MemberTag key={idx}>{member}</MemberTag>
                      ))}
                    </TeamMembers>
                  </TeamInfo>
                  
                  <TeamTime>
                    {formatTime(team.totalTime)}
                  </TeamTime>
                </LeaderboardItem>
              ))}
            </Leaderboard>
          </Section>
        </MainSection>

        <Sidebar>
          <TimeSubmission>
            <SectionTitle>
              <FaUpload />
              Zeit Einreichen
            </SectionTitle>
            
            <SubmissionForm onSubmit={handleTimeSubmit}>
              <FormGroup>
                <FormLabel>Zeit (Sekunden)</FormLabel>
                <FormInput
                  type="number"
                  placeholder="z.B. 3600 für 1 Stunde"
                  value={submission.time}
                  onChange={(e) => setSubmission(prev => ({ ...prev, time: e.target.value }))}
                  min="0"
                  step="1"
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Screenshot</FormLabel>
                <FileUpload>
                  <FaUpload style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
                  <div>Klicke zum Hochladen</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                    PNG, JPG bis 5MB
                  </div>
                </FileUpload>
              </FormGroup>
              
              <SubmitButton type="submit">
                <FaUpload />
                Zeit Einreichen
              </SubmitButton>
            </SubmissionForm>
          </TimeSubmission>

          <ChatSection>
            <SectionTitle>
              <FaComments />
              Event Chat
            </SectionTitle>
            
            <ChatMessages>
              {chatMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  className={message.userId === 'currentUser' ? 'own' : 'other'}
                >
                  <strong>{message.userName}:</strong> {message.message}
                </ChatMessage>
              ))}
            </ChatMessages>
            
            <form onSubmit={handleChatSubmit}>
              <ChatInput>
                <ChatInputField
                  type="text"
                  placeholder="Nachricht eingeben..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
                <SendButton type="submit">Senden</SendButton>
              </ChatInput>
            </form>
          </ChatSection>
        </Sidebar>
      </EventGrid>
    </EventContainer>
  );
};

export default EventDetails;
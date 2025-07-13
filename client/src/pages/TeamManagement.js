import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUsers, FaCrown, FaPlus, FaSearch, FaComments, FaTrophy, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const TeamContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const TeamHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const TeamTitle = styled.h1`
  font-family: 'Press Start 2P', cursive;
  font-size: 2.5rem;
  color: #00ff41;
  margin-bottom: 1rem;
  text-shadow: 0 0 15px rgba(0, 255, 65, 0.5);
`;

const TeamSubtitle = styled.p`
  font-size: 1.2rem;
  color: #00cc33;
  margin-bottom: 2rem;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TeamSection = styled.div`
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

const CreateTeamForm = styled.form`
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

const FormSelect = styled.select`
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

const AvailableTeams = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TeamCard = styled(motion.div)`
  background: rgba(26, 26, 46, 0.8);
  border: 2px solid #00ff41;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
  }
`;

const TeamCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TeamName = styled.h3`
  color: #00ff41;
  font-size: 1.2rem;
  font-weight: bold;
`;

const TeamSize = styled.span`
  color: #00cc33;
  font-size: 0.9rem;
  padding: 0.25rem 0.75rem;
  background: rgba(0, 255, 65, 0.1);
  border-radius: 12px;
`;

const TeamMembers = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const MemberTag = styled.span`
  background: rgba(0, 255, 65, 0.2);
  color: #00ff41;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const JoinButton = styled.button`
  background: transparent;
  color: #00ff41;
  border: 2px solid #00ff41;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(0, 255, 65, 0.1);
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MyTeamSection = styled.div`
  grid-column: 1 / -1;
  background: rgba(15, 15, 35, 0.8);
  border: 2px solid #00ff41;
  border-radius: 16px;
  padding: 2rem;
  margin-top: 2rem;
`;

const ChatSection = styled.div`
  background: rgba(26, 26, 46, 0.8);
  border: 2px solid #00ff41;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
  max-height: 300px;
  overflow-y: auto;
`;

const ChatMessages = styled.div`
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
  background: rgba(15, 15, 35, 0.8);
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

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [myTeam, setMyTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: 'default-team',
    maxMembers: 4
  });
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  // Mock data - replace with API calls
  useEffect(() => {
    const mockTeams = [
      {
        id: '1',
        name: 'Speed Demons',
        logo: 'default-team',
        captainId: 'user1',
        maxMembers: 4,
        members: [
          { id: 'user1', name: 'SpeedRunner1', role: 'captain' },
          { id: 'user2', name: 'MarioMaster', role: 'member' },
          { id: 'user3', name: 'ZeldaPro', role: 'member' }
        ]
      },
      {
        id: '2',
        name: 'Retro Warriors',
        logo: 'default-team',
        captainId: 'user4',
        maxMembers: 3,
        members: [
          { id: 'user4', name: 'RetroGamer', role: 'captain' },
          { id: 'user5', name: 'N64Legend', role: 'member' }
        ]
      }
    ];

    setTeams(mockTeams);
    
    // Mock my team
    setMyTeam({
      id: '1',
      name: 'Speed Demons',
      logo: 'default-team',
      captainId: 'user1',
      maxMembers: 4,
      members: [
        { id: 'user1', name: 'SpeedRunner1', role: 'captain' },
        { id: 'user2', name: 'MarioMaster', role: 'member' },
        { id: 'user3', name: 'ZeldaPro', role: 'member' }
      ]
    });

    // Mock chat messages
    setChatMessages([
      { id: '1', userId: 'user1', userName: 'SpeedRunner1', message: 'Hallo Team!', timestamp: new Date().toISOString() },
      { id: '2', userId: 'user2', userName: 'MarioMaster', message: 'Hey! Bereit für das Event?', timestamp: new Date().toISOString() },
      { id: '3', userId: 'user3', userName: 'ZeldaPro', message: 'Definitiv! 🏆', timestamp: new Date().toISOString() }
    ]);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Team-Name ist erforderlich!');
      return;
    }

    // Mock team creation
    const newTeam = {
      id: Date.now().toString(),
      name: formData.name,
      logo: formData.logo,
      captainId: 'currentUser',
      maxMembers: formData.maxMembers,
      members: [
        { id: 'currentUser', name: 'Du', role: 'captain' }
      ]
    };

    setMyTeam(newTeam);
    setTeams(prev => [...prev, newTeam]);
    setFormData({ name: '', logo: 'default-team', maxMembers: 4 });
    
    toast.success('Team erfolgreich erstellt!');
  };

  const handleJoinTeam = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    if (team.members.length >= team.maxMembers) {
      toast.error('Team ist voll!');
      return;
    }

    // Mock join team
    const updatedTeam = {
      ...team,
      members: [...team.members, { id: 'currentUser', name: 'Du', role: 'member' }]
    };

    setMyTeam(updatedTeam);
    setTeams(prev => prev.map(t => t.id === teamId ? updatedTeam : t));
    
    toast.success('Team erfolgreich beigetreten!');
  };

  const handleLeaveTeam = () => {
    if (myTeam.members.length === 1) {
      // Disband team
      setTeams(prev => prev.filter(t => t.id !== myTeam.id));
      toast.success('Team aufgelöst');
    } else {
      // Leave team
      const updatedTeam = {
        ...myTeam,
        members: myTeam.members.filter(m => m.id !== 'currentUser')
      };
      setTeams(prev => prev.map(t => t.id === myTeam.id ? updatedTeam : t));
      toast.success('Team verlassen');
    }
    
    setMyTeam(null);
  };

  const handleSendMessage = (e) => {
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

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <TeamContainer>
      <TeamHeader>
        <TeamTitle>👥 TEAM MANAGEMENT</TeamTitle>
        <TeamSubtitle>
          Erstelle dein Team oder tritt einem bestehenden Team bei!
        </TeamSubtitle>
      </TeamHeader>

      <TeamGrid>
        <TeamSection>
          <SectionTitle>
            <FaPlus />
            Team Erstellen
          </SectionTitle>
          
          <CreateTeamForm onSubmit={handleFormSubmit}>
            <FormGroup>
              <FormLabel>Team Name</FormLabel>
              <FormInput
                type="text"
                placeholder="Dein Team Name"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                maxLength={20}
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>Team Logo</FormLabel>
              <FormSelect
                value={formData.logo}
                onChange={(e) => handleFormChange('logo', e.target.value)}
              >
                <option value="default-team">Standard Logo</option>
                <option value="mario-team">Mario Team</option>
                <option value="zelda-team">Zelda Team</option>
                <option value="goldeneye-team">GoldenEye Team</option>
              </FormSelect>
            </FormGroup>
            
            <FormGroup>
              <FormLabel>Max. Mitglieder</FormLabel>
              <FormSelect
                value={formData.maxMembers}
                onChange={(e) => handleFormChange('maxMembers', parseInt(e.target.value))}
              >
                <option value={2}>2 Spieler</option>
                <option value={3}>3 Spieler</option>
                <option value={4}>4 Spieler</option>
              </FormSelect>
            </FormGroup>
            
            <SubmitButton type="submit">
              <FaPlus />
              Team Erstellen
            </SubmitButton>
          </CreateTeamForm>
        </TeamSection>

        <TeamSection>
          <SectionTitle>
            <FaUsers />
            Verfügbare Teams
          </SectionTitle>
          
          <AvailableTeams>
            {teams.filter(team => !myTeam || team.id !== myTeam.id).map((team) => (
              <TeamCard
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <TeamCardHeader>
                  <TeamName>{team.name}</TeamName>
                  <TeamSize>{team.members.length}/{team.maxMembers}</TeamSize>
                </TeamCardHeader>
                
                <TeamMembers>
                  {team.members.map((member) => (
                    <MemberTag key={member.id}>
                      {member.role === 'captain' && <FaCrown />}
                      {member.name}
                    </MemberTag>
                  ))}
                </TeamMembers>
                
                <JoinButton
                  onClick={() => handleJoinTeam(team.id)}
                  disabled={team.members.length >= team.maxMembers}
                >
                  <FaUserPlus />
                  Beitreten
                </JoinButton>
              </TeamCard>
            ))}
          </AvailableTeams>
        </TeamSection>
      </TeamGrid>

      {myTeam && (
        <MyTeamSection>
          <SectionTitle>
            <FaTrophy />
            Mein Team: {myTeam.name}
          </SectionTitle>
          
          <TeamMembers>
            {myTeam.members.map((member) => (
              <MemberTag key={member.id}>
                {member.role === 'captain' && <FaCrown />}
                {member.name}
                {member.role === 'captain' && ' (Captain)'}
              </MemberTag>
            ))}
          </TeamMembers>
          
          <JoinButton onClick={handleLeaveTeam} style={{ marginTop: '1rem' }}>
            <FaSignOutAlt />
            Team Verlassen
          </JoinButton>
          
          <ChatSection>
            <SectionTitle style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              <FaComments />
              Team Chat
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
            
            <form onSubmit={handleSendMessage}>
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
        </MyTeamSection>
      )}
    </TeamContainer>
  );
};

export default TeamManagement;
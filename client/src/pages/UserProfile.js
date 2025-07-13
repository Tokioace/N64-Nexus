import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaClock, FaUsers, FaStar, FaHistory, FaCrown } from 'react-icons/fa';

const ProfileContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(45deg, #00ff41, #00cc33);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin: 0 auto 1rem;
  box-shadow: 0 0 30px rgba(0, 255, 65, 0.4);
`;

const ProfileName = styled.h1`
  font-family: 'Press Start 2P', cursive;
  font-size: 2rem;
  color: #00ff41;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 15px rgba(0, 255, 65, 0.5);
`;

const ProfileStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const StatItem = styled.div`
  text-align: center;
  color: #00cc33;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #00ff41;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ProfileGrid = styled.div`
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

const ProfileSection = styled.div`
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

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const AchievementCard = styled(motion.div)`
  background: rgba(26, 26, 46, 0.8);
  border: 2px solid #00ff41;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
  }
`;

const AchievementIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(45deg, #00ff41, #00cc33);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  color: #0f0f23;
`;

const AchievementName = styled.h3`
  color: #00ff41;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const AchievementDescription = styled.p`
  color: #00cc33;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HistoryItem = styled(motion.div)`
  background: rgba(26, 26, 46, 0.8);
  border: 2px solid #00ff41;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
  }
`;

const HistoryInfo = styled.div`
  flex: 1;
`;

const HistoryEvent = styled.h4`
  color: #00ff41;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
`;

const HistoryDetails = styled.div`
  color: #00cc33;
  font-size: 0.9rem;
  display: flex;
  gap: 1rem;
`;

const HistoryRank = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  
  &.first {
    color: #ffd700;
  }
  
  &.second {
    color: #c0c0c0;
  }
  
  &.third {
    color: #cd7f32;
  }
  
  &.other {
    color: #00ff41;
  }
`;

const HistoryTime = styled.div`
  color: #00ff41;
  font-weight: bold;
  font-size: 1.1rem;
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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  // Mock data - replace with API call
  useEffect(() => {
    const mockUser = {
      id: userId,
      username: 'SpeedRunner1',
      avatar: 'default-avatar',
      stats: {
        totalEvents: 15,
        totalTeamEvents: 8,
        bestTeamRank: 1,
        totalTeamWins: 3,
        totalTeamPodiums: 6,
        averageTeamTime: 7800,
        fastestTeamTime: 7200
      },
      achievements: [
        {
          id: 'team-titan',
          name: 'Team Titan',
          description: 'Gewinne dein erstes Team-Event',
          icon: '🏆',
          awardedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 'golden-group',
          name: 'Golden Group',
          description: 'Erreiche 3 Team-Podestplätze',
          icon: '🥇',
          awardedAt: '2024-01-20T14:15:00Z'
        },
        {
          id: 'speed-demon',
          name: 'Speed Demon',
          description: 'Setze eine Team-Zeit unter 2 Stunden',
          icon: '⚡',
          awardedAt: '2024-01-25T16:45:00Z'
        }
      ],
      teamHistory: [
        {
          eventId: '1',
          eventName: 'Super Mario 64 Team Challenge',
          teamId: '1',
          teamName: 'Speed Demons',
          teamRank: 1,
          teamTime: 7200,
          personalTime: 2400,
          date: '2024-01-15T10:30:00Z'
        },
        {
          eventId: '2',
          eventName: 'Zelda OoT Team Tournament',
          teamId: '1',
          teamName: 'Speed Demons',
          teamRank: 2,
          teamTime: 7800,
          personalTime: 2600,
          date: '2024-01-20T14:15:00Z'
        },
        {
          eventId: '3',
          eventName: 'GoldenEye 007 Team Mission',
          teamId: '1',
          teamName: 'Speed Demons',
          teamRank: 1,
          teamTime: 6900,
          personalTime: 2300,
          date: '2024-01-25T16:45:00Z'
        }
      ]
    };

    setUser(mockUser);
  }, [userId]);

  if (!user) {
    return (
      <ProfileContainer>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', color: '#00ff41' }}>Lade Profil...</div>
        </div>
      </ProfileContainer>
    );
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <FaCrown />;
      case 2: return <FaMedal />;
      case 3: return <FaMedal />;
      default: return rank;
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

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileAvatar>🏃‍♂️</ProfileAvatar>
        <ProfileName>{user.username}</ProfileName>
        
        <ProfileStats>
          <StatItem>
            <StatNumber>{user.stats.totalTeamEvents}</StatNumber>
            <StatLabel>Team Events</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{user.stats.totalTeamWins}</StatNumber>
            <StatLabel>Siege</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{user.stats.totalTeamPodiums}</StatNumber>
            <StatLabel>Podestplätze</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>{formatTime(user.stats.fastestTeamTime)}</StatNumber>
            <StatLabel>Beste Zeit</StatLabel>
          </StatItem>
        </ProfileStats>
      </ProfileHeader>

      <ProfileGrid>
        <ProfileSection>
          <SectionTitle>
            <FaStar />
            Achievements
          </SectionTitle>
          
          <AchievementsGrid>
            {user.achievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AchievementIcon>{achievement.icon}</AchievementIcon>
                <AchievementName>{achievement.name}</AchievementName>
                <AchievementDescription>{achievement.description}</AchievementDescription>
              </AchievementCard>
            ))}
          </AchievementsGrid>
        </ProfileSection>

        <ProfileSection>
          <SectionTitle>
            <FaHistory />
            Team Historie
          </SectionTitle>
          
          <HistoryList>
            {user.teamHistory.map((history, index) => (
              <HistoryItem
                key={history.eventId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <HistoryInfo>
                  <HistoryEvent>{history.eventName}</HistoryEvent>
                  <HistoryDetails>
                    <span>Team: {history.teamName}</span>
                    <span>{formatDate(history.date)}</span>
                  </HistoryDetails>
                </HistoryInfo>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <HistoryRank className={getRankClass(history.teamRank)}>
                    {getRankIcon(history.teamRank)}
                    {history.teamRank}. Platz
                  </HistoryRank>
                  <HistoryTime>{formatTime(history.teamTime)}</HistoryTime>
                </div>
              </HistoryItem>
            ))}
          </HistoryList>
        </ProfileSection>
      </ProfileGrid>
    </ProfileContainer>
  );
};

export default UserProfile;
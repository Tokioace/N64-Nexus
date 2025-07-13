import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaTrophy, FaCrown, FaMedal, FaUsers, FaFilter, FaChartBar, FaStar } from 'react-icons/fa';

const LeaderboardContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const LeaderboardHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const LeaderboardTitle = styled.h1`
  font-family: 'Press Start 2P', cursive;
  font-size: 2.5rem;
  color: #00ff41;
  margin-bottom: 1rem;
  text-shadow: 0 0 15px rgba(0, 255, 65, 0.5);
`;

const LeaderboardSubtitle = styled.p`
  font-size: 1.2rem;
  color: #00cc33;
  margin-bottom: 2rem;
`;

const FilterSection = styled.div`
  background: rgba(15, 15, 35, 0.8);
  border: 2px solid #00ff41;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const FilterGrid = styled.div`
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

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
`;

const TabButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(45deg, #00ff41, #00cc33)' : 'transparent'};
  color: ${props => props.active ? '#0f0f23' : '#00ff41'};
  border: 2px solid #00ff41;
  padding: 1rem 2rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:first-child {
    border-radius: 12px 0 0 12px;
  }
  
  &:last-child {
    border-radius: 0 12px 12px 0;
  }
  
  &:hover {
    background: ${props => props.active ? 'linear-gradient(45deg, #00ff41, #00cc33)' : 'rgba(0, 255, 65, 0.1)'};
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
  }
`;

const LeaderboardList = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
`;

const LeaderboardItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(15, 15, 35, 0.8);
  border: 2px solid #00ff41;
  border-radius: 16px;
  margin-bottom: 1rem;
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
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
  
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

const PlayerInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PlayerAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #00ff41, #00cc33);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #0f0f23;
`;

const PlayerDetails = styled.div`
  flex: 1;
`;

const PlayerName = styled.h3`
  color: #00ff41;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const PlayerStats = styled.div`
  color: #00cc33;
  font-size: 0.9rem;
  display: flex;
  gap: 1rem;
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Score = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #00ff41;
  text-align: right;
  min-width: 100px;
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

const TeamStats = styled.div`
  color: #00cc33;
  font-size: 0.9rem;
  display: flex;
  gap: 1rem;
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

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('teams');
  const [filters, setFilters] = useState({
    region: 'all',
    timeFrame: 'all'
  });
  const [teamRankings, setTeamRankings] = useState([]);
  const [playerRankings, setPlayerRankings] = useState([]);

  // Mock data - replace with API calls
  useEffect(() => {
    const mockTeamRankings = [
      {
        rank: 1,
        teamId: '1',
        teamName: 'Speed Demons',
        members: ['SpeedRunner1', 'MarioMaster', 'ZeldaPro'],
        totalWins: 5,
        totalEvents: 8,
        bestTime: 7200,
        averageTime: 7800
      },
      {
        rank: 2,
        teamId: '2',
        teamName: 'Retro Warriors',
        members: ['RetroGamer', 'N64Legend'],
        totalWins: 3,
        totalEvents: 6,
        bestTime: 7500,
        averageTime: 8100
      },
      {
        rank: 3,
        teamId: '3',
        teamName: 'Golden Team',
        members: ['GoldenPlayer', 'SpeedKing', 'MarioPro'],
        totalWins: 2,
        totalEvents: 7,
        bestTime: 7800,
        averageTime: 8400
      }
    ];

    const mockPlayerRankings = [
      {
        rank: 1,
        userId: 'user1',
        username: 'SpeedRunner1',
        totalTeamWins: 5,
        totalTeamEvents: 8,
        bestTeamRank: 1,
        fastestTeamTime: 7200,
        totalTeamPodiums: 6
      },
      {
        rank: 2,
        userId: 'user2',
        username: 'MarioMaster',
        totalTeamWins: 4,
        totalTeamEvents: 7,
        bestTeamRank: 1,
        fastestTeamTime: 7500,
        totalTeamPodiums: 5
      },
      {
        rank: 3,
        userId: 'user3',
        username: 'ZeldaPro',
        totalTeamWins: 3,
        totalTeamEvents: 6,
        bestTeamRank: 2,
        fastestTeamTime: 7800,
        totalTeamPodiums: 4
      }
    ];

    setTeamRankings(mockTeamRankings);
    setPlayerRankings(mockPlayerRankings);
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getRankClass = (rank) => {
    switch (rank) {
      case 1: return 'first';
      case 2: return 'second';
      case 3: return 'third';
      default: return 'other';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <FaCrown />;
      case 2: return <FaMedal />;
      case 3: return <FaMedal />;
      default: return rank;
    }
  };

  return (
    <LeaderboardContainer>
      <LeaderboardHeader>
        <LeaderboardTitle>🏆 LEADERBOARD</LeaderboardTitle>
        <LeaderboardSubtitle>
          Die besten Teams und Spieler der Battle64 Community
        </LeaderboardSubtitle>
      </LeaderboardHeader>

      <FilterSection>
        <FilterGrid>
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
            <FilterLabel>Zeitraum</FilterLabel>
            <FilterSelect
              value={filters.timeFrame}
              onChange={(e) => handleFilterChange('timeFrame', e.target.value)}
            >
              <option value="all">Alle Zeit</option>
              <option value="month">Letzter Monat</option>
              <option value="year">Letztes Jahr</option>
            </FilterSelect>
          </FilterGroup>
        </FilterGrid>
      </FilterSection>

      <TabContainer>
        <TabButton
          active={activeTab === 'teams'}
          onClick={() => setActiveTab('teams')}
        >
          <FaUsers />
          Teams
        </TabButton>
        <TabButton
          active={activeTab === 'players'}
          onClick={() => setActiveTab('players')}
        >
          <FaStar />
          Spieler
        </TabButton>
      </TabContainer>

      <LeaderboardList>
        {activeTab === 'teams' ? (
          teamRankings.map((team, index) => (
            <LeaderboardItem
              key={team.teamId}
              className={getRankClass(team.rank)}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Rank className={getRankClass(team.rank)}>
                {getRankIcon(team.rank)}
              </Rank>
              
              <TeamInfo>
                <TeamName>{team.teamName}</TeamName>
                <TeamMembers>
                  {team.members.map((member, idx) => (
                    <MemberTag key={idx}>{member}</MemberTag>
                  ))}
                </TeamMembers>
                <TeamStats>
                  <StatItem>
                    <FaTrophy />
                    {team.totalWins} Siege
                  </StatItem>
                  <StatItem>
                    <FaUsers />
                    {team.totalEvents} Events
                  </StatItem>
                  <StatItem>
                    <FaChartBar />
                    Ø {formatTime(team.averageTime)}
                  </StatItem>
                </TeamStats>
              </TeamInfo>
              
              <Score>
                {formatTime(team.bestTime)}
              </Score>
            </LeaderboardItem>
          ))
        ) : (
          playerRankings.map((player, index) => (
            <LeaderboardItem
              key={player.userId}
              className={getRankClass(player.rank)}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Rank className={getRankClass(player.rank)}>
                {getRankIcon(player.rank)}
              </Rank>
              
              <PlayerInfo>
                <PlayerAvatar>🏃‍♂️</PlayerAvatar>
                <PlayerDetails>
                  <PlayerName>{player.username}</PlayerName>
                  <PlayerStats>
                    <StatItem>
                      <FaTrophy />
                      {player.totalTeamWins} Siege
                    </StatItem>
                    <StatItem>
                      <FaUsers />
                      {player.totalTeamEvents} Events
                    </StatItem>
                    <StatItem>
                      <FaMedal />
                      {player.totalTeamPodiums} Podestplätze
                    </StatItem>
                  </PlayerStats>
                </PlayerDetails>
              </PlayerInfo>
              
              <Score>
                {formatTime(player.fastestTeamTime)}
              </Score>
            </LeaderboardItem>
          ))
        )}
      </LeaderboardList>
    </LeaderboardContainer>
  );
};

export default Leaderboard;
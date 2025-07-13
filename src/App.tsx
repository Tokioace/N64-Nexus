import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGamepad, FaTrophy, FaBell, FaCog } from 'react-icons/fa';
import NotificationBell from './components/notifications/NotificationBell';
import TrophyCollection from './components/trophies/TrophyCollection';
import TrophyUnlockAnimation from './components/trophies/TrophyUnlockAnimation';
import { useNotificationStore } from './stores/notificationStore';
import { useTrophyStore } from './stores/trophyStore';
import { NotificationType, NotificationPriority, TrophyRarity, TrophyCategory } from './types';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
  color: #fff;
  font-family: 'Arial', sans-serif;
`;

const Header = styled.header`
  background: linear-gradient(135deg, #8b4513, #a0522d);
  padding: 16px 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 100;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const DemoSection = styled.section`
  background: linear-gradient(135deg, #2c3e50, #34495e);
  border: 2px solid #8b4513;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
`;

const SectionTitle = styled.h2`
  color: #fff;
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DemoButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
`;

const DemoButton = styled(motion.button)`
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border: 2px solid #8b4513;
  color: #fff;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const StatCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid #555;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #ff6b35;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #ccc;
`;

const App: React.FC = () => {
  const [showTrophyAnimation, setShowTrophyAnimation] = useState(false);
  const [currentTrophy, setCurrentTrophy] = useState(null);
  
  const { 
    addNotification, 
    unreadCount, 
    notifications,
    markAllAsRead 
  } = useNotificationStore();
  
  const { 
    unlockTrophy, 
    unlockedTrophies, 
    getTotalXP,
    addTrophy 
  } = useTrophyStore();

  // Demo notification functions
  const triggerEventNotification = () => {
    addNotification({
      type: NotificationType.EVENT,
      priority: NotificationPriority.HIGH,
      title: '🎮 Neues Event: GlitchCup 2024',
      message: 'Das neue Speedrun-Event ist jetzt verfügbar!',
      icon: '🎮',
      userId: 'demo-user',
      actionUrl: '/events/glitchcup-2024'
    });
  };

  const triggerTrophyNotification = () => {
    addNotification({
      type: NotificationType.TROPHY,
      priority: NotificationPriority.HIGH,
      title: '🏆 Neue Trophäe freigeschaltet!',
      message: 'Du hast die Gold-Trophäe "Speed Demon" gewonnen!',
      icon: '🏆',
      userId: 'demo-user',
      actionUrl: '/trophies'
    });
  };

  const triggerRankingNotification = () => {
    addNotification({
      type: NotificationType.RANKING,
      priority: NotificationPriority.MEDIUM,
      title: '🏅 Neue Platzierung in der Rangliste',
      message: 'Du bist auf Platz 3 in der Speedrun-Rangliste!',
      icon: '🏅',
      userId: 'demo-user',
      actionUrl: '/rankings'
    });
  };

  const triggerFanartNotification = () => {
    addNotification({
      type: NotificationType.FANART,
      priority: NotificationPriority.LOW,
      title: '🎨 Neues Fanart bewertet',
      message: 'Dein Fanart "Mario in Space" hat 5 Sterne erhalten!',
      icon: '🎨',
      userId: 'demo-user',
      actionUrl: '/fanart/mario-in-space'
    });
  };

  // Demo trophy functions
  const unlockBronzeTrophy = () => {
    const trophy = {
      name: 'Erste Schritte',
      description: 'Schließe dein erstes Event erfolgreich ab',
      rarity: TrophyRarity.BRONZE,
      category: TrophyCategory.SPEEDRUN,
      icon: '🏃',
      xpValue: 50,
      userId: 'demo-user'
    };
    
    unlockTrophy(trophy);
    setCurrentTrophy(trophy);
    setShowTrophyAnimation(true);
  };

  const unlockSilverTrophy = () => {
    const trophy = {
      name: 'Speed Demon',
      description: 'Schließe 5 Speedrun-Events unter der Ziellinie ab',
      rarity: TrophyRarity.SILVER,
      category: TrophyCategory.SPEEDRUN,
      icon: '⚡',
      xpValue: 100,
      userId: 'demo-user'
    };
    
    unlockTrophy(trophy);
    setCurrentTrophy(trophy);
    setShowTrophyAnimation(true);
  };

  const unlockGoldTrophy = () => {
    const trophy = {
      name: 'Kunstmeister',
      description: 'Erstelle 10 Fanart-Werke mit 5-Sterne-Bewertung',
      rarity: TrophyRarity.GOLD,
      category: TrophyCategory.FANART,
      icon: '🎨',
      xpValue: 200,
      userId: 'demo-user'
    };
    
    unlockTrophy(trophy);
    setCurrentTrophy(trophy);
    setShowTrophyAnimation(true);
  };

  const unlockPlatinumTrophy = () => {
    const trophy = {
      name: 'Battle64 Meister',
      description: 'Sammle alle Trophäen in allen Kategorien',
      rarity: TrophyRarity.PLATINUM,
      category: TrophyCategory.SPECIAL,
      icon: '👑',
      xpValue: 500,
      userId: 'demo-user'
    };
    
    unlockTrophy(trophy);
    setCurrentTrophy(trophy);
    setShowTrophyAnimation(true);
  };

  const handleTrophyAnimationComplete = () => {
    setShowTrophyAnimation(false);
    setCurrentTrophy(null);
  };

  // Add some sample trophies on mount
  useEffect(() => {
    const sampleTrophies = [
      {
        id: '1',
        name: 'Quiz-Meister',
        description: 'Beantworte 50 Quiz-Fragen korrekt',
        rarity: TrophyRarity.BRONZE,
        category: TrophyCategory.QUIZ,
        icon: '🧠',
        xpValue: 75,
        userId: 'demo-user'
      },
      {
        id: '2',
        name: 'Sammler',
        description: 'Sammle 100 verschiedene Items',
        rarity: TrophyRarity.SILVER,
        category: TrophyCategory.COLLECTION,
        icon: '📦',
        xpValue: 150,
        userId: 'demo-user'
      }
    ];

    sampleTrophies.forEach(trophy => addTrophy(trophy));
  }, [addTrophy]);

  return (
    <AppContainer>
      <Header>
        <HeaderContent>
          <Logo>
            <FaGamepad />
            Battle64
          </Logo>
          <HeaderActions>
            <NotificationBell />
          </HeaderActions>
        </HeaderContent>
      </Header>

      <MainContent>
        <DemoSection>
          <SectionTitle>
            <FaBell />
            Benachrichtigungen Demo
          </SectionTitle>
          <DemoButtons>
            <DemoButton
              onClick={triggerEventNotification}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎮 Event-Benachrichtigung
            </DemoButton>
            <DemoButton
              onClick={triggerTrophyNotification}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏆 Trophäen-Benachrichtigung
            </DemoButton>
            <DemoButton
              onClick={triggerRankingNotification}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏅 Ranglisten-Benachrichtigung
            </DemoButton>
            <DemoButton
              onClick={triggerFanartNotification}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎨 Fanart-Benachrichtigung
            </DemoButton>
          </DemoButtons>
          
          <StatsGrid>
            <StatCard>
              <StatValue>{unreadCount}</StatValue>
              <StatLabel>Ungelesene Benachrichtigungen</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{notifications.length}</StatValue>
              <StatLabel>Benachrichtigungen gesamt</StatLabel>
            </StatCard>
          </StatsGrid>
        </DemoSection>

        <DemoSection>
          <SectionTitle>
            <FaTrophy />
            Trophäen Demo
          </SectionTitle>
          <DemoButtons>
            <DemoButton
              onClick={unlockBronzeTrophy}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🥉 Bronze-Trophäe freischalten
            </DemoButton>
            <DemoButton
              onClick={unlockSilverTrophy}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🥈 Silber-Trophäe freischalten
            </DemoButton>
            <DemoButton
              onClick={unlockGoldTrophy}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🥇 Gold-Trophäe freischalten
            </DemoButton>
            <DemoButton
              onClick={unlockPlatinumTrophy}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              💎 Platin-Trophäe freischalten
            </DemoButton>
          </DemoButtons>
          
          <StatsGrid>
            <StatCard>
              <StatValue>{unlockedTrophies.length}</StatValue>
              <StatLabel>Freigeschaltete Trophäen</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{getTotalXP()}</StatValue>
              <StatLabel>XP gesamt</StatLabel>
            </StatCard>
          </StatsGrid>
        </DemoSection>

        <TrophyCollection />
      </MainContent>

      <TrophyUnlockAnimation
        trophy={currentTrophy}
        onComplete={handleTrophyAnimationComplete}
      />
    </AppContainer>
  );
};

export default App;
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaTrophy, FaStar, FaMedal } from 'react-icons/fa';
import { useTrophyStore } from '../../stores/trophyStore';
import { TrophyCategory, TrophyRarity } from '../../types';
import TrophyDisplay from './TrophyDisplay';

const CollectionContainer = styled.div`
  background: linear-gradient(135deg, #2c3e50, #34495e);
  border: 2px solid #8b4513;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #555;
`;

const Title = styled.h2`
  color: #fff;
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProgressSection = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
`;

const ProgressCard = styled.div<{ category: TrophyCategory }>`
  background: linear-gradient(135deg, #555, #666);
  border: 2px solid #777;
  border-radius: 8px;
  padding: 12px;
  min-width: 120px;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => getCategoryGradient(props.category)};
    opacity: 0.1;
  }
`;

const ProgressTitle = styled.h4`
  color: #fff;
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: bold;
  position: relative;
  z-index: 1;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  z-index: 1;
`;

const ProgressFill = styled(motion.div)<{ percentage: number; category: TrophyCategory }>`
  height: 100%;
  background: ${props => getCategoryGradient(props.category)};
  width: ${props => props.percentage}%;
  border-radius: 4px;
`;

const ProgressText = styled.span`
  color: #ccc;
  font-size: 12px;
  position: relative;
  z-index: 1;
`;

const FilterSection = styled.div`
  margin-bottom: 20px;
`;

const FilterTitle = styled.h3`
  color: #fff;
  margin: 0 0 12px 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FilterButton = styled.button<{ active: boolean }>`
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #ff6b35, #f7931e)' 
    : 'linear-gradient(135deg, #555, #666)'
  };
  border: 1px solid ${props => props.active ? '#ff6b35' : '#777'};
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const TrophiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
  max-height: 400px;
  overflow-y: auto;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #ff6b35, #f7931e);
    border-radius: 4px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #ccc;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  margin: 0;
  font-size: 16px;
`;

const StatsSection = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #555;
`;

const StatCard = styled.div`
  text-align: center;
  color: #fff;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #ff6b35;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #ccc;
  margin-top: 4px;
`;

const getCategoryGradient = (category: TrophyCategory): string => {
  const gradients = {
    [TrophyCategory.SPEEDRUN]: 'linear-gradient(135deg, #e74c3c, #c0392b)',
    [TrophyCategory.FANART]: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
    [TrophyCategory.QUIZ]: 'linear-gradient(135deg, #3498db, #2980b9)',
    [TrophyCategory.COLLECTION]: 'linear-gradient(135deg, #27ae60, #2ecc71)',
    [TrophyCategory.TEAM]: 'linear-gradient(135deg, #f39c12, #e67e22)',
    [TrophyCategory.SPECIAL]: 'linear-gradient(135deg, #1abc9c, #16a085)'
  };
  return gradients[category];
};

const getCategoryLabel = (category: TrophyCategory): string => {
  const labels = {
    [TrophyCategory.SPEEDRUN]: 'Speedrun',
    [TrophyCategory.FANART]: 'Fanart',
    [TrophyCategory.QUIZ]: 'Quiz',
    [TrophyCategory.COLLECTION]: 'Sammlung',
    [TrophyCategory.TEAM]: 'Team',
    [TrophyCategory.SPECIAL]: 'Spezial'
  };
  return labels[category];
};

const TrophyCollection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<TrophyCategory | null>(null);
  const { 
    unlockedTrophies, 
    trophies, 
    getCollectionProgress, 
    getTrophiesByCategory,
    getTotalXP 
  } = useTrophyStore();

  const progress = getCollectionProgress();
  const totalXP = getTotalXP();
  const totalTrophies = unlockedTrophies.length;
  const platinumTrophies = unlockedTrophies.filter(t => t.rarity === TrophyRarity.PLATINUM).length;

  const displayTrophies = activeCategory 
    ? getTrophiesByCategory(activeCategory)
    : unlockedTrophies;

  const handleCategoryFilter = (category: TrophyCategory) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  return (
    <CollectionContainer>
      <Header>
        <Title>
          <FaTrophy />
          Trophäen-Sammlung
        </Title>
      </Header>

      <ProgressSection>
        {Object.values(TrophyCategory).map(category => (
          <ProgressCard key={category} category={category}>
            <ProgressTitle>{getCategoryLabel(category)}</ProgressTitle>
            <ProgressBar>
              <ProgressFill
                percentage={progress[category].percentage}
                category={category}
                initial={{ width: 0 }}
                animate={{ width: progress[category].percentage }}
                transition={{ duration: 0.5 }}
              />
            </ProgressBar>
            <ProgressText>
              {progress[category].unlocked}/{progress[category].total}
            </ProgressText>
          </ProgressCard>
        ))}
      </ProgressSection>

      <FilterSection>
        <FilterTitle>
          <FaFilter />
          Kategorien filtern
        </FilterTitle>
        <FilterButtons>
          {Object.values(TrophyCategory).map(category => (
            <FilterButton
              key={category}
              active={activeCategory === category}
              onClick={() => handleCategoryFilter(category)}
            >
              {getCategoryLabel(category)}
            </FilterButton>
          ))}
        </FilterButtons>
      </FilterSection>

      <TrophiesGrid>
        <AnimatePresence>
          {displayTrophies.length > 0 ? (
            displayTrophies.map((trophy, index) => (
              <motion.div
                key={trophy.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                <TrophyDisplay trophy={trophy} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <EmptyState>
                <EmptyIcon>🏆</EmptyIcon>
                <EmptyText>
                  {activeCategory 
                    ? `Keine Trophäen in der Kategorie "${getCategoryLabel(activeCategory)}"`
                    : 'Keine Trophäen freigeschaltet'
                  }
                </EmptyText>
              </EmptyState>
            </motion.div>
          )}
        </AnimatePresence>
      </TrophiesGrid>

      <StatsSection>
        <StatCard>
          <StatValue>{totalTrophies}</StatValue>
          <StatLabel>Trophäen gesamt</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{platinumTrophies}</StatValue>
          <StatLabel>Platin-Trophäen</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{totalXP}</StatValue>
          <StatLabel>XP gesamt</StatLabel>
        </StatCard>
      </StatsSection>
    </CollectionContainer>
  );
};

export default TrophyCollection;
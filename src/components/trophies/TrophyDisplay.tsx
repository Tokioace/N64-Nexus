import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrophyStore } from '../../stores/trophyStore';
import { Trophy, TrophyRarity, TrophyCategory } from '../../types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const TrophyContainer = styled(motion.div)`
  position: relative;
  display: inline-block;
  margin: 8px;
`;

const TrophyIcon = styled(motion.div)<{ rarity: TrophyRarity; unlocked: boolean }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  cursor: pointer;
  position: relative;
  background: ${props => getTrophyBackground(props.rarity, props.unlocked)};
  border: 3px solid ${props => getTrophyBorder(props.rarity, props.unlocked)};
  box-shadow: ${props => getTrophyShadow(props.rarity, props.unlocked)};
  filter: ${props => props.unlocked ? 'none' : 'grayscale(100%) brightness(0.5)'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: ${props => getTrophyHoverShadow(props.rarity, props.unlocked)};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: ${props => getTrophyGlow(props.rarity, props.unlocked)};
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const TrophyTooltip = styled(motion.div)`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #2c3e50, #34495e);
  border: 2px solid #8b4513;
  border-radius: 8px;
  padding: 12px;
  min-width: 200px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  pointer-events: none;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #34495e;
  }
`;

const TooltipTitle = styled.h4`
  margin: 0 0 6px 0;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
`;

const TooltipDescription = styled.p`
  margin: 0 0 6px 0;
  color: #ccc;
  font-size: 12px;
  line-height: 1.3;
`;

const TooltipMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #999;
`;

const XPBadge = styled.span<{ rarity: TrophyRarity }>`
  background: ${props => getXPBadgeBackground(props.rarity)};
  color: #fff;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: bold;
`;

const CategoryBadge = styled.span`
  background: linear-gradient(135deg, #555, #666);
  color: #fff;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
`;

const getTrophyBackground = (rarity: TrophyRarity, unlocked: boolean): string => {
  if (!unlocked) return 'linear-gradient(135deg, #666, #777)';
  
  const backgrounds = {
    [TrophyRarity.BRONZE]: 'linear-gradient(135deg, #cd7f32, #b8860b)',
    [TrophyRarity.SILVER]: 'linear-gradient(135deg, #c0c0c0, #a9a9a9)',
    [TrophyRarity.GOLD]: 'linear-gradient(135deg, #ffd700, #ffb347)',
    [TrophyRarity.PLATINUM]: 'linear-gradient(135deg, #e5e4e2, #bcc6cc)'
  };
  return backgrounds[rarity];
};

const getTrophyBorder = (rarity: TrophyRarity, unlocked: boolean): string => {
  if (!unlocked) return '#555';
  
  const borders = {
    [TrophyRarity.BRONZE]: '#8b4513',
    [TrophyRarity.SILVER]: '#696969',
    [TrophyRarity.GOLD]: '#daa520',
    [TrophyRarity.PLATINUM]: '#708090'
  };
  return borders[rarity];
};

const getTrophyShadow = (rarity: TrophyRarity, unlocked: boolean): string => {
  if (!unlocked) return '0 2px 4px rgba(0, 0, 0, 0.3)';
  
  const shadows = {
    [TrophyRarity.BRONZE]: '0 4px 8px rgba(139, 69, 19, 0.4)',
    [TrophyRarity.SILVER]: '0 4px 8px rgba(192, 192, 192, 0.4)',
    [TrophyRarity.GOLD]: '0 4px 8px rgba(255, 215, 0, 0.4)',
    [TrophyRarity.PLATINUM]: '0 4px 8px rgba(229, 228, 226, 0.4)'
  };
  return shadows[rarity];
};

const getTrophyHoverShadow = (rarity: TrophyRarity, unlocked: boolean): string => {
  if (!unlocked) return '0 4px 8px rgba(0, 0, 0, 0.4)';
  
  const shadows = {
    [TrophyRarity.BRONZE]: '0 6px 12px rgba(139, 69, 19, 0.6)',
    [TrophyRarity.SILVER]: '0 6px 12px rgba(192, 192, 192, 0.6)',
    [TrophyRarity.GOLD]: '0 6px 12px rgba(255, 215, 0, 0.6)',
    [TrophyRarity.PLATINUM]: '0 6px 12px rgba(229, 228, 226, 0.6)'
  };
  return shadows[rarity];
};

const getTrophyGlow = (rarity: TrophyRarity, unlocked: boolean): string => {
  if (!unlocked) return 'transparent';
  
  const glows = {
    [TrophyRarity.BRONZE]: 'radial-gradient(circle, rgba(205, 127, 50, 0.3) 0%, transparent 70%)',
    [TrophyRarity.SILVER]: 'radial-gradient(circle, rgba(192, 192, 192, 0.3) 0%, transparent 70%)',
    [TrophyRarity.GOLD]: 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
    [TrophyRarity.PLATINUM]: 'radial-gradient(circle, rgba(229, 228, 226, 0.3) 0%, transparent 70%)'
  };
  return glows[rarity];
};

const getXPBadgeBackground = (rarity: TrophyRarity): string => {
  const backgrounds = {
    [TrophyRarity.BRONZE]: 'linear-gradient(135deg, #cd7f32, #b8860b)',
    [TrophyRarity.SILVER]: 'linear-gradient(135deg, #c0c0c0, #a9a9a9)',
    [TrophyRarity.GOLD]: 'linear-gradient(135deg, #ffd700, #ffb347)',
    [TrophyRarity.PLATINUM]: 'linear-gradient(135deg, #e5e4e2, #bcc6cc)'
  };
  return backgrounds[rarity];
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

interface TrophyDisplayProps {
  trophy: Trophy;
  showTooltip?: boolean;
}

const TrophyDisplay: React.FC<TrophyDisplayProps> = ({ 
  trophy, 
  showTooltip = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isUnlocked = !!trophy.unlockedAt;

  return (
    <TrophyContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TrophyIcon
        rarity={trophy.rarity}
        unlocked={isUnlocked}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isUnlocked ? {
          boxShadow: isHovered 
            ? getTrophyHoverShadow(trophy.rarity, true)
            : getTrophyShadow(trophy.rarity, true)
        } : {}}
      >
        {trophy.icon || '🏆'}
      </TrophyIcon>

      <AnimatePresence>
        {showTooltip && isHovered && (
          <TrophyTooltip
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <TooltipTitle>{trophy.name}</TooltipTitle>
            <TooltipDescription>{trophy.description}</TooltipDescription>
            <TooltipMeta>
              <CategoryBadge>{getCategoryLabel(trophy.category)}</CategoryBadge>
              <XPBadge rarity={trophy.rarity}>+{trophy.xpValue} XP</XPBadge>
            </TooltipMeta>
            {trophy.unlockedAt && (
              <TooltipMeta style={{ marginTop: '4px' }}>
                <span>Freigeschaltet: {format(trophy.unlockedAt, 'dd.MM.yyyy', { locale: de })}</span>
              </TooltipMeta>
            )}
          </TrophyTooltip>
        )}
      </AnimatePresence>
    </TrophyContainer>
  );
};

export default TrophyDisplay;
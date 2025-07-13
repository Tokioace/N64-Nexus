import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaStar, FaMedal } from 'react-icons/fa';
import { Trophy, TrophyRarity } from '../../types';

const AnimationOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  pointer-events: none;
`;

const TrophyCard = styled(motion.div)<{ rarity: TrophyRarity }>`
  background: linear-gradient(135deg, #2c3e50, #34495e);
  border: 3px solid ${props => getTrophyBorder(props.rarity)};
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  min-width: 300px;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: ${props => getTrophyGlow(props.rarity)};
    opacity: 0;
    animation: rotate 3s linear infinite;
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const TrophyIcon = styled(motion.div)<{ rarity: TrophyRarity }>`
  font-size: 80px;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
  position: relative;
  z-index: 2;
`;

const UnlockText = styled(motion.h2)`
  color: #fff;
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 2;
`;

const TrophyName = styled(motion.h3)`
  color: ${props => getTrophyColor(props.rarity)};
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 2;
`;

const TrophyDescription = styled(motion.p)`
  color: #ccc;
  margin: 0 0 16px 0;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
  z-index: 2;
`;

const XPBadge = styled(motion.div)<{ rarity: TrophyRarity }>`
  background: ${props => getTrophyGradient(props.rarity)};
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;
  display: inline-block;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
`;

const Sparkles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
`;

const Sparkle = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 8px #fff;
`;

const getTrophyBorder = (rarity: TrophyRarity): string => {
  const borders = {
    [TrophyRarity.BRONZE]: '#cd7f32',
    [TrophyRarity.SILVER]: '#c0c0c0',
    [TrophyRarity.GOLD]: '#ffd700',
    [TrophyRarity.PLATINUM]: '#e5e4e2'
  };
  return borders[rarity];
};

const getTrophyColor = (rarity: TrophyRarity): string => {
  const colors = {
    [TrophyRarity.BRONZE]: '#cd7f32',
    [TrophyRarity.SILVER]: '#c0c0c0',
    [TrophyRarity.GOLD]: '#ffd700',
    [TrophyRarity.PLATINUM]: '#e5e4e2'
  };
  return colors[rarity];
};

const getTrophyGradient = (rarity: TrophyRarity): string => {
  const gradients = {
    [TrophyRarity.BRONZE]: 'linear-gradient(135deg, #cd7f32, #b8860b)',
    [TrophyRarity.SILVER]: 'linear-gradient(135deg, #c0c0c0, #a9a9a9)',
    [TrophyRarity.GOLD]: 'linear-gradient(135deg, #ffd700, #ffb347)',
    [TrophyRarity.PLATINUM]: 'linear-gradient(135deg, #e5e4e2, #bcc6cc)'
  };
  return gradients[rarity];
};

const getTrophyGlow = (rarity: TrophyRarity): string => {
  const glows = {
    [TrophyRarity.BRONZE]: 'radial-gradient(circle, rgba(205, 127, 50, 0.2) 0%, transparent 70%)',
    [TrophyRarity.SILVER]: 'radial-gradient(circle, rgba(192, 192, 192, 0.2) 0%, transparent 70%)',
    [TrophyRarity.GOLD]: 'radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%)',
    [TrophyRarity.PLATINUM]: 'radial-gradient(circle, rgba(229, 228, 226, 0.2) 0%, transparent 70%)'
  };
  return glows[rarity];
};

const getTrophyIcon = (rarity: TrophyRarity): string => {
  const icons = {
    [TrophyRarity.BRONZE]: '🥉',
    [TrophyRarity.SILVER]: '🥈',
    [TrophyRarity.GOLD]: '🥇',
    [TrophyRarity.PLATINUM]: '💎'
  };
  return icons[rarity];
};

interface TrophyUnlockAnimationProps {
  trophy: Trophy | null;
  onComplete: () => void;
}

const TrophyUnlockAnimation: React.FC<TrophyUnlockAnimationProps> = ({ 
  trophy, 
  onComplete 
}) => {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (trophy) {
      // Generate random sparkles
      const newSparkles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
      }));
      setSparkles(newSparkles);

      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [trophy, onComplete]);

  if (!trophy) return null;

  return (
    <AnimatePresence>
      <AnimationOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TrophyCard
          rarity={trophy.rarity}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            duration: 0.8 
          }}
        >
          <Sparkles>
            {sparkles.map(sparkle => (
              <Sparkle
                key={sparkle.id}
                style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0], 
                  opacity: [0, 1, 0],
                  y: [0, -20, -40]
                }}
                transition={{ 
                  duration: 2,
                  delay: sparkle.id * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />
            ))}
          </Sparkles>

          <TrophyIcon
            rarity={trophy.rarity}
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          >
            {getTrophyIcon(trophy.rarity)}
          </TrophyIcon>

          <UnlockText
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            🎉 Trophäe freigeschaltet! 🎉
          </UnlockText>

          <TrophyName
            rarity={trophy.rarity}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {trophy.name}
          </TrophyName>

          <TrophyDescription
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {trophy.description}
          </TrophyDescription>

          <XPBadge
            rarity={trophy.rarity}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 400 }}
          >
            +{trophy.xpValue} XP
          </XPBadge>
        </TrophyCard>
      </AnimationOverlay>
    </AnimatePresence>
  );
};

export default TrophyUnlockAnimation;
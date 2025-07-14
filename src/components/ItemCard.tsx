import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaEuroSign, 
  FaStar, 
  FaMapMarkerAlt, 
  FaClock,
  FaExchangeAlt,
  FaHeart
} from 'react-icons/fa';
import { MarketplaceItem, ItemCondition, ItemRegion, RarityLevel } from '../types';

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border-color: rgba(100, 181, 246, 0.5);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
`;

const ItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const ConditionBadge = styled.div<{ condition: ItemCondition }>`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  background: ${props => {
    switch (props.condition) {
      case ItemCondition.NEW: return '#4caf50';
      case ItemCondition.GOOD: return '#8bc34a';
      case ItemCondition.USED: return '#ff9800';
      case ItemCondition.DEFECTIVE: return '#f44336';
      default: return '#757575';
    }
  }};
  color: white;
`;

const RegionBadge = styled.div<{ region: ItemRegion }>`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 20px;
  border-radius: 3px;
  border: 2px solid white;
  background: ${props => {
    switch (props.region) {
      case ItemRegion.PAL: return '#2196f3';
      case ItemRegion.NTSC: return '#f44336';
      case ItemRegion.JPN: return '#4caf50';
      default: return '#757575';
    }
  }};
`;

const RarityBadge = styled.div<{ rarity: RarityLevel }>`
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: bold;
  background: ${props => {
    switch (props.rarity) {
      case RarityLevel.COMMON: return '#757575';
      case RarityLevel.UNCOMMON: return '#4caf50';
      case RarityLevel.RARE: return '#2196f3';
      case RarityLevel.VERY_RARE: return '#9c27b0';
      case RarityLevel.LEGENDARY: return '#ff9800';
      default: return '#757575';
    }
  }};
  color: white;
`;

const Content = styled.div`
  padding: 1rem;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #ffffff;
  line-height: 1.3;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #64b5f6;
`;

const PointsValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: #ffd700;
  font-weight: bold;
`;

const SellerInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Seller = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SellerAvatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(45deg, #64b5f6, #1976d2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
`;

const SellerName = styled.span`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
`;

const SellerRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: #ffd700;
`;

const TrustedBadge = styled.div`
  background: #4caf50;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: bold;
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
`;

const TimeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
`;

const TradeButton = styled(ActionButton)`
  background: linear-gradient(45deg, #64b5f6, #1976d2);
  color: white;
  
  &:hover {
    background: linear-gradient(45deg, #1976d2, #1565c0);
  }
`;

const WishlistButton = styled(ActionButton)`
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
`;

interface ItemCardProps {
  item: MarketplaceItem;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} €`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  const getConditionLabel = (condition: ItemCondition) => {
    switch (condition) {
      case ItemCondition.NEW: return 'Neu';
      case ItemCondition.GOOD: return 'Gut';
      case ItemCondition.USED: return 'Gebraucht';
      case ItemCondition.DEFECTIVE: return 'Defekt';
      default: return 'Unbekannt';
    }
  };

  const getRarityLabel = (rarity: RarityLevel) => {
    switch (rarity) {
      case RarityLevel.COMMON: return 'Häufig';
      case RarityLevel.UNCOMMON: return 'Ungewöhnlich';
      case RarityLevel.RARE: return 'Selten';
      case RarityLevel.VERY_RARE: return 'Sehr selten';
      case RarityLevel.LEGENDARY: return 'Legendär';
      default: return 'Unbekannt';
    }
  };

  return (
    <Link to={`/item/${item.id}`} style={{ textDecoration: 'none' }}>
      <Card
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <ImageContainer>
          <ItemImage src={item.images[0]} alt={item.title} />
          <ConditionBadge condition={item.condition}>
            {getConditionLabel(item.condition)}
          </ConditionBadge>
          <RegionBadge region={item.region} />
          <RarityBadge rarity={item.rarity}>
            {getRarityLabel(item.rarity)}
          </RarityBadge>
        </ImageContainer>

        <Content>
          <Title>{item.title}</Title>
          <Description>{item.description}</Description>

          <PriceSection>
            {item.price && (
              <Price>
                <FaEuroSign />
                {formatPrice(item.price)}
              </Price>
            )}
            {item.pointsValue && (
              <PointsValue>
                <FaStar />
                {item.pointsValue} Punkte
              </PointsValue>
            )}
          </PriceSection>

          <SellerInfo>
            <Seller>
              <SellerAvatar>
                {item.seller.username.charAt(0).toUpperCase()}
              </SellerAvatar>
              <div>
                <SellerName>{item.seller.username}</SellerName>
                <SellerRating>
                  <FaStar />
                  {item.seller.reputation}%
                </SellerRating>
              </div>
            </Seller>
            {item.seller.isTrustedSeller && (
              <TrustedBadge>Trusted</TrustedBadge>
            )}
          </SellerInfo>

          {item.location && (
            <LocationInfo>
              <FaMapMarkerAlt />
              {item.location}
            </LocationInfo>
          )}

          <TimeInfo>
            <FaClock />
            Vor {formatTimeAgo(item.createdAt)}
          </TimeInfo>

          {item.tags.length > 0 && (
            <TagsContainer>
              {item.tags.slice(0, 3).map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
              {item.tags.length > 3 && (
                <Tag>+{item.tags.length - 3}</Tag>
              )}
            </TagsContainer>
          )}

          <ActionButtons>
            <TradeButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                // Handle trade action
              }}
            >
              <FaExchangeAlt />
              Tauschen
            </TradeButton>
            <WishlistButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                // Handle wishlist action
              }}
            >
              <FaHeart />
              Merken
            </WishlistButton>
          </ActionButtons>
        </Content>
      </Card>
    </Link>
  );
};

export default ItemCard;
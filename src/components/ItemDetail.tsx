import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaEuroSign, 
  FaStar, 
  FaMapMarkerAlt, 
  FaClock,
  FaExchangeAlt,
  FaHeart,
  FaShare,
  FaFlag,
  FaUser,
  FaShieldAlt
} from 'react-icons/fa';
import { MarketplaceItem, ItemCondition, ItemRegion, RarityLevel } from '../types';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #64b5f6;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 2rem;
  
  &:hover {
    color: #1976d2;
  }
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ImageSection = styled.div`
  position: relative;
`;

const MainImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 15px;
  border: 2px solid rgba(255, 255, 255, 0.2);
`;

const ImageThumbnails = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Thumbnail = styled.img<{ active: boolean }>`
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid ${props => props.active ? '#64b5f6' : 'transparent'};
  opacity: ${props => props.active ? 1 : 0.7};
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 2rem;
  font-weight: bold;
  color: #64b5f6;
`;

const PointsValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: #ffd700;
  font-weight: bold;
`;

const BadgesContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Badge = styled.div<{ type: 'condition' | 'region' | 'rarity' }>`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  color: white;
  background: ${props => {
    switch (props.type) {
      case 'condition':
        return '#4caf50';
      case 'region':
        return '#2196f3';
      case 'rarity':
        return '#9c27b0';
      default:
        return '#757575';
    }
  }};
`;

const SellerSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SellerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const SellerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SellerAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(45deg, #64b5f6, #1976d2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
`;

const SellerDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SellerName = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
`;

const SellerRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffd700;
  font-weight: 500;
`;

const TrustedBadge = styled.div`
  background: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const TimeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ActionButton = styled(motion.button)<{ primary?: boolean }>`
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  background: ${props => props.primary 
    ? 'linear-gradient(45deg, #64b5f6, #1976d2)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  color: white;
  border: ${props => props.primary ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'};
  
  &:hover {
    background: ${props => props.primary 
      ? 'linear-gradient(45deg, #1976d2, #1565c0)' 
      : 'rgba(255, 255, 255, 0.2)'
    };
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Mock data - in real app this would come from API/store
  const item: MarketplaceItem = {
    id: id || '1',
    title: 'Mario Kart 64',
    description: 'Original PAL Version in sehr gutem Zustand. Das Spiel funktioniert einwandfrei und kommt mit der originalen Verpackung und dem Manual. Perfekt für Sammler oder zum Spielen. Keine Kratzer auf der Disc, alle Funktionen getestet.',
    category: 'games' as any,
    condition: 'good' as any,
    region: 'pal' as any,
    platform: 'n64' as any,
    images: [
      'https://via.placeholder.com/600x400/64b5f6/ffffff?text=Mario+Kart+64+Front',
      'https://via.placeholder.com/600x400/1976d2/ffffff?text=Mario+Kart+64+Back',
      'https://via.placeholder.com/600x400/ff9800/ffffff?text=Mario+Kart+64+Manual'
    ],
    price: 45,
    pointsValue: 150,
    rarity: 'common' as any,
    seller: {
      id: 'user1',
      username: 'RetroGamer',
      email: 'retro@example.com',
      points: 1250,
      reputation: 95,
      isVerified: true,
      isTrustedSeller: true,
      joinDate: new Date('2023-01-15'),
      badges: []
    },
    createdAt: new Date('2024-01-15'),
    expiresAt: new Date('2024-02-15'),
    isActive: true,
    tags: ['racing', 'multiplayer', 'nintendo', 'classic', 'retro']
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} €`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} Stunden`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} Tagen`;
    }
  };

  const getConditionLabel = (condition: ItemCondition) => {
    switch (condition) {
      case 'new': return 'Neu';
      case 'good': return 'Gut';
      case 'used': return 'Gebraucht';
      case 'defective': return 'Defekt';
      default: return 'Unbekannt';
    }
  };

  const getRegionLabel = (region: ItemRegion) => {
    switch (region) {
      case 'pal': return 'PAL';
      case 'ntsc': return 'NTSC';
      case 'jpn': return 'JPN';
      default: return 'Unbekannt';
    }
  };

  const getRarityLabel = (rarity: RarityLevel) => {
    switch (rarity) {
      case 'common': return 'Häufig';
      case 'uncommon': return 'Ungewöhnlich';
      case 'rare': return 'Selten';
      case 'very_rare': return 'Sehr selten';
      case 'legendary': return 'Legendär';
      default: return 'Unbekannt';
    }
  };

  const handleTrade = () => {
    navigate(`/trading?item=${item.id}`);
  };

  const handleWishlist = () => {
    // Add to wishlist logic
    console.log('Added to wishlist:', item.id);
  };

  const handleShare = () => {
    // Share logic
    navigator.share?.({
      title: item.title,
      text: item.description,
      url: window.location.href
    });
  };

  const handleReport = () => {
    // Report logic
    console.log('Report item:', item.id);
  };

  return (
    <Container>
      <BackButton
        onClick={() => navigate(-1)}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft />
        Zurück
      </BackButton>

      <ItemGrid>
        <ImageSection>
          <MainImage src={item.images[selectedImage]} alt={item.title} />
          {item.images.length > 1 && (
            <ImageThumbnails>
              {item.images.map((image, index) => (
                <Thumbnail
                  key={index}
                  src={image}
                  alt={`${item.title} ${index + 1}`}
                  active={selectedImage === index}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </ImageThumbnails>
          )}
        </ImageSection>

        <InfoSection>
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

          <BadgesContainer>
            <Badge type="condition">
              {getConditionLabel(item.condition)}
            </Badge>
            <Badge type="region">
              {getRegionLabel(item.region)}
            </Badge>
            <Badge type="rarity">
              {getRarityLabel(item.rarity)}
            </Badge>
          </BadgesContainer>

          <SellerSection>
            <SellerHeader>
              <SellerInfo>
                <SellerAvatar>
                  {item.seller.username.charAt(0).toUpperCase()}
                </SellerAvatar>
                <SellerDetails>
                  <SellerName>{item.seller.username}</SellerName>
                  <SellerRating>
                    <FaStar />
                    {item.seller.reputation}% Bewertung
                  </SellerRating>
                </SellerDetails>
              </SellerInfo>
              {item.seller.isTrustedSeller && (
                <TrustedBadge>
                  <FaShieldAlt />
                  Trusted Seller
                </TrustedBadge>
              )}
            </SellerHeader>
            
            <LocationInfo>
              <FaMapMarkerAlt />
              {item.location || 'Standort nicht angegeben'}
            </LocationInfo>
            
            <TimeInfo>
              <FaClock />
              Vor {formatTimeAgo(item.createdAt)} eingestellt
            </TimeInfo>
          </SellerSection>

          <ActionButtons>
            <ActionButton
              primary
              onClick={handleTrade}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaExchangeAlt />
              Tauschen
            </ActionButton>
            <ActionButton
              onClick={handleWishlist}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaHeart />
              Merken
            </ActionButton>
            <ActionButton
              onClick={handleShare}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaShare />
              Teilen
            </ActionButton>
            <ActionButton
              onClick={handleReport}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaFlag />
              Melden
            </ActionButton>
          </ActionButtons>

          {item.tags.length > 0 && (
            <TagsContainer>
              {item.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagsContainer>
          )}
        </InfoSection>
      </ItemGrid>
    </Container>
  );
};

export default ItemDetail;
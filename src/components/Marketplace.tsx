import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaFilter, 
  FaSort, 
  FaGamepad, 
  FaTshirt, 
  FaHeadphones, 
  FaPalette,
  FaSearch
} from 'react-icons/fa';
import { useMarketplaceStore } from '../store/marketplaceStore';
import { 
  ItemCategory, 
  ItemCondition, 
  ItemRegion, 
  Platform, 
  RarityLevel, 
  SortOption 
} from '../types';
import ItemCard from './ItemCard';
import FilterPanel from './FilterPanel';
import SortDropdown from './SortDropdown';

const MarketplaceContainer = styled.div`
  display: flex;
  gap: 2rem;
  min-height: calc(100vh - 200px);
`;

const MainContent = styled.div`
  flex: 1;
`;

const Sidebar = styled(motion.div)`
  width: 300px;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const MobileFilterButton = styled.button`
  display: none;
  background: linear-gradient(45deg, #64b5f6, #1976d2);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 1024px) {
    display: flex;
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
`;

const CategoryTab = styled(motion.button)<{ active: boolean }>`
  background: ${props => props.active 
    ? 'linear-gradient(45deg, #64b5f6, #1976d2)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  border: 1px solid ${props => props.active 
    ? 'transparent' 
    : 'rgba(255, 255, 255, 0.2)'
  };
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active 
      ? 'linear-gradient(45deg, #64b5f6, #1976d2)' 
      : 'rgba(255, 255, 255, 0.2)'
    };
  }
`;

const ControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ResultsInfo = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
`;

const ItemsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.6);
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #ffffff;
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
  line-height: 1.5;
`;

const categoryIcons = {
  [ItemCategory.GAMES]: FaGamepad,
  [ItemCategory.MERCHANDISE]: FaTshirt,
  [ItemCategory.ACCESSORIES]: FaHeadphones,
  [ItemCategory.FAN_PRODUCTS]: FaPalette,
  [ItemCategory.WANTED]: FaSearch,
};

const categoryLabels = {
  [ItemCategory.GAMES]: 'Spiele & Module',
  [ItemCategory.MERCHANDISE]: 'Merchandise',
  [ItemCategory.ACCESSORIES]: 'Zubehör',
  [ItemCategory.FAN_PRODUCTS]: 'Fanprodukte',
  [ItemCategory.WANTED]: 'Gesuche',
};

const Marketplace: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    filteredItems,
    sortOption,
    setSortOption,
    applyFilters,
    clearFilters,
    isLoading
  } = useMarketplaceStore();

  useEffect(() => {
    // Load sample data when component mounts
    loadSampleData();
  }, []);

  const loadSampleData = () => {
    // This would normally come from an API
    const sampleItems = [
      {
        id: '1',
        title: 'Mario Kart 64',
        description: 'Original PAL Version, sehr guter Zustand',
        category: ItemCategory.GAMES,
        condition: ItemCondition.GOOD,
        region: ItemRegion.PAL,
        platform: Platform.N64,
        images: ['https://via.placeholder.com/300x200/64b5f6/ffffff?text=Mario+Kart+64'],
        price: 45,
        pointsValue: 150,
        rarity: RarityLevel.COMMON,
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
        tags: ['racing', 'multiplayer', 'nintendo']
      },
      {
        id: '2',
        title: 'Banjo-Tooie',
        description: 'NTSC Version, komplett mit Manual',
        category: ItemCategory.GAMES,
        condition: ItemCondition.GOOD,
        region: ItemRegion.NTSC,
        platform: Platform.N64,
        images: ['https://via.placeholder.com/300x200/1976d2/ffffff?text=Banjo-Tooie'],
        price: 80,
        pointsValue: 250,
        rarity: RarityLevel.RARE,
        seller: {
          id: 'user2',
          username: 'CollectorPro',
          email: 'collector@example.com',
          points: 2100,
          reputation: 98,
          isVerified: true,
          isTrustedSeller: true,
          joinDate: new Date('2022-06-20'),
          badges: []
        },
        createdAt: new Date('2024-01-10'),
        expiresAt: new Date('2024-02-10'),
        isActive: true,
        tags: ['platformer', 'rare', 'rareware']
      },
      {
        id: '3',
        title: 'N64 Controller - Atomic Purple',
        description: 'Original Nintendo Controller, funktioniert perfekt',
        category: ItemCategory.ACCESSORIES,
        condition: ItemCondition.GOOD,
        region: ItemRegion.PAL,
        platform: Platform.N64,
        images: ['https://via.placeholder.com/300x200/ff9800/ffffff?text=N64+Controller'],
        price: 25,
        pointsValue: 75,
        rarity: RarityLevel.UNCOMMON,
        seller: {
          id: 'user3',
          username: 'ControllerKing',
          email: 'controller@example.com',
          points: 850,
          reputation: 92,
          isVerified: true,
          isTrustedSeller: false,
          joinDate: new Date('2023-03-10'),
          badges: []
        },
        createdAt: new Date('2024-01-12'),
        expiresAt: new Date('2024-02-12'),
        isActive: true,
        tags: ['controller', 'original', 'purple']
      }
    ];

    // Add to store
    sampleItems.forEach(item => {
      // This would be handled by the store
    });
  };

  const handleCategoryChange = (category: ItemCategory | 'all') => {
    setSelectedCategory(category);
    // Apply category filter
    if (category === 'all') {
      clearFilters();
    } else {
      // Set category filter and apply
    }
  };

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort);
    applyFilters();
  };

  const filteredByCategory = selectedCategory === 'all' 
    ? filteredItems 
    : filteredItems.filter(item => item.category === selectedCategory);

  return (
    <MarketplaceContainer>
      <MainContent>
        <CategoryTabs>
          <CategoryTab
            active={selectedCategory === 'all'}
            onClick={() => handleCategoryChange('all')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Alle Kategorien
          </CategoryTab>
          {Object.values(ItemCategory).map(category => {
            const Icon = categoryIcons[category];
            return (
              <CategoryTab
                key={category}
                active={selectedCategory === category}
                onClick={() => handleCategoryChange(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon />
                {categoryLabels[category]}
              </CategoryTab>
            );
          })}
        </CategoryTabs>

        <ControlsRow>
          <MobileFilterButton onClick={() => setShowFilters(!showFilters)}>
            <FaFilter />
            Filter
          </MobileFilterButton>

          <ResultsInfo>
            {filteredByCategory.length} Artikel gefunden
          </ResultsInfo>

          <SortDropdown
            value={sortOption}
            onChange={handleSortChange}
          />
        </ControlsRow>

        {isLoading ? (
          <EmptyState>
            <EmptyStateIcon>🔄</EmptyStateIcon>
            <EmptyStateTitle>Lade Artikel...</EmptyStateTitle>
          </EmptyState>
        ) : filteredByCategory.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>🔍</EmptyStateIcon>
            <EmptyStateTitle>Keine Artikel gefunden</EmptyStateTitle>
            <EmptyStateText>
              Versuche andere Suchbegriffe oder Filter zu verwenden.
            </EmptyStateText>
          </EmptyState>
        ) : (
          <ItemsGrid
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredByCategory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ItemCard item={item} />
              </motion.div>
            ))}
          </ItemsGrid>
        )}
      </MainContent>

      <Sidebar
        initial={{ x: 300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FilterPanel />
      </Sidebar>
    </MarketplaceContainer>
  );
};

export default Marketplace;
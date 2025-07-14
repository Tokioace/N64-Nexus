import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaFilter, 
  FaTimes, 
  FaCheck,
  FaEuroSign,
  FaStar
} from 'react-icons/fa';
import { useMarketplaceStore } from '../store/marketplaceStore';
import { 
  ItemCategory, 
  ItemCondition, 
  ItemRegion, 
  Platform, 
  RarityLevel,
  MarketplaceFilters 
} from '../types';

const FilterContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  height: fit-content;
  position: sticky;
  top: 100px;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const FilterTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #64b5f6;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    color: #1976d2;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  
  &:hover {
    color: #ffffff;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #64b5f6;
`;

const RangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RangeInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.9rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #64b5f6;
  }
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

const ApplyButton = styled(motion.button)`
  width: 100%;
  background: linear-gradient(45deg, #64b5f6, #1976d2);
  border: none;
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background: linear-gradient(45deg, #1976d2, #1565c0);
  }
`;

const ActiveFilters = styled.div`
  margin-bottom: 1.5rem;
`;

const ActiveFilterTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(100, 181, 246, 0.2);
  color: #64b5f6;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  margin: 0.25rem;
  border: 1px solid rgba(100, 181, 246, 0.3);
`;

const FilterPanel: React.FC = () => {
  const { filters, setFilters, applyFilters, clearFilters } = useMarketplaceStore();
  
  const [localFilters, setLocalFilters] = useState<MarketplaceFilters>(filters);

  const handleCategoryChange = (category: ItemCategory, checked: boolean) => {
    const currentCategories = localFilters.category || [];
    const newCategories = checked
      ? [...currentCategories, category]
      : currentCategories.filter(c => c !== category);
    
    setLocalFilters({
      ...localFilters,
      category: newCategories.length > 0 ? newCategories : undefined
    });
  };

  const handleConditionChange = (condition: ItemCondition, checked: boolean) => {
    const currentConditions = localFilters.condition || [];
    const newConditions = checked
      ? [...currentConditions, condition]
      : currentConditions.filter(c => c !== condition);
    
    setLocalFilters({
      ...localFilters,
      condition: newConditions.length > 0 ? newConditions : undefined
    });
  };

  const handleRegionChange = (region: ItemRegion, checked: boolean) => {
    const currentRegions = localFilters.region || [];
    const newRegions = checked
      ? [...currentRegions, region]
      : currentRegions.filter(r => r !== region);
    
    setLocalFilters({
      ...localFilters,
      region: newRegions.length > 0 ? newRegions : undefined
    });
  };

  const handlePlatformChange = (platform: Platform, checked: boolean) => {
    const currentPlatforms = localFilters.platform || [];
    const newPlatforms = checked
      ? [...currentPlatforms, platform]
      : currentPlatforms.filter(p => p !== platform);
    
    setLocalFilters({
      ...localFilters,
      platform: newPlatforms.length > 0 ? newPlatforms : undefined
    });
  };

  const handleRarityChange = (rarity: RarityLevel, checked: boolean) => {
    const currentRarities = localFilters.rarity || [];
    const newRarities = checked
      ? [...currentRarities, rarity]
      : currentRarities.filter(r => r !== rarity);
    
    setLocalFilters({
      ...localFilters,
      rarity: newRarities.length > 0 ? newRarities : undefined
    });
  };

  const handlePriceRangeChange = (field: 'min' | 'max', value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    setLocalFilters({
      ...localFilters,
      priceRange: {
        min: localFilters.priceRange?.min || 0,
        max: localFilters.priceRange?.max || 1000,
        [field]: numValue
      }
    });
  };

  const handlePointsRangeChange = (field: 'min' | 'max', value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    setLocalFilters({
      ...localFilters,
      pointsRange: {
        min: localFilters.pointsRange?.min || 0,
        max: localFilters.pointsRange?.max || 1000,
        [field]: numValue
      }
    });
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
    applyFilters();
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    clearFilters();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.category?.length) count += localFilters.category.length;
    if (localFilters.condition?.length) count += localFilters.condition.length;
    if (localFilters.region?.length) count += localFilters.region.length;
    if (localFilters.platform?.length) count += localFilters.platform.length;
    if (localFilters.rarity?.length) count += localFilters.rarity.length;
    if (localFilters.priceRange?.min || localFilters.priceRange?.max) count++;
    if (localFilters.pointsRange?.min || localFilters.pointsRange?.max) count++;
    return count;
  };

  const categoryLabels = {
    [ItemCategory.GAMES]: 'Spiele',
    [ItemCategory.MERCHANDISE]: 'Merchandise',
    [ItemCategory.ACCESSORIES]: 'Zubehör',
    [ItemCategory.FAN_PRODUCTS]: 'Fanprodukte',
    [ItemCategory.WANTED]: 'Gesuche',
  };

  const conditionLabels = {
    [ItemCondition.NEW]: 'Neu',
    [ItemCondition.GOOD]: 'Gut',
    [ItemCondition.USED]: 'Gebraucht',
    [ItemCondition.DEFECTIVE]: 'Defekt',
  };

  const regionLabels = {
    [ItemRegion.PAL]: 'PAL',
    [ItemRegion.NTSC]: 'NTSC',
    [ItemRegion.JPN]: 'JPN',
  };

  const platformLabels = {
    [Platform.N64]: 'Nintendo 64',
    [Platform.GAMECUBE]: 'GameCube',
    [Platform.SNES]: 'SNES',
    [Platform.NES]: 'NES',
    [Platform.OTHER]: 'Andere',
  };

  const rarityLabels = {
    [RarityLevel.COMMON]: 'Häufig',
    [RarityLevel.UNCOMMON]: 'Ungewöhnlich',
    [RarityLevel.RARE]: 'Selten',
    [RarityLevel.VERY_RARE]: 'Sehr selten',
    [RarityLevel.LEGENDARY]: 'Legendär',
  };

  return (
    <FilterContainer>
      <FilterHeader>
        <FilterTitle>
          <FaFilter />
          Filter
        </FilterTitle>
        {getActiveFiltersCount() > 0 && (
          <ClearButton onClick={handleClearFilters}>
            <FaTimes />
            Alle löschen
          </ClearButton>
        )}
      </FilterHeader>

      {getActiveFiltersCount() > 0 && (
        <ActiveFilters>
          {localFilters.category?.map(category => (
            <ActiveFilterTag key={category}>
              {categoryLabels[category]}
              <FaTimes 
                style={{ cursor: 'pointer' }}
                onClick={() => handleCategoryChange(category, false)}
              />
            </ActiveFilterTag>
          ))}
          {localFilters.condition?.map(condition => (
            <ActiveFilterTag key={condition}>
              {conditionLabels[condition]}
              <FaTimes 
                style={{ cursor: 'pointer' }}
                onClick={() => handleConditionChange(condition, false)}
              />
            </ActiveFilterTag>
          ))}
          {/* Add more active filter tags for other filter types */}
        </ActiveFilters>
      )}

      <FilterSection>
        <SectionTitle>Kategorie</SectionTitle>
        <CheckboxGroup>
          {Object.values(ItemCategory).map(category => (
            <CheckboxItem key={category}>
              <Checkbox
                type="checkbox"
                checked={localFilters.category?.includes(category) || false}
                onChange={(e) => handleCategoryChange(category, e.target.checked)}
              />
              {categoryLabels[category]}
            </CheckboxItem>
          ))}
        </CheckboxGroup>
      </FilterSection>

      <FilterSection>
        <SectionTitle>Zustand</SectionTitle>
        <CheckboxGroup>
          {Object.values(ItemCondition).map(condition => (
            <CheckboxItem key={condition}>
              <Checkbox
                type="checkbox"
                checked={localFilters.condition?.includes(condition) || false}
                onChange={(e) => handleConditionChange(condition, e.target.checked)}
              />
              {conditionLabels[condition]}
            </CheckboxItem>
          ))}
        </CheckboxGroup>
      </FilterSection>

      <FilterSection>
        <SectionTitle>Region</SectionTitle>
        <CheckboxGroup>
          {Object.values(ItemRegion).map(region => (
            <CheckboxItem key={region}>
              <Checkbox
                type="checkbox"
                checked={localFilters.region?.includes(region) || false}
                onChange={(e) => handleRegionChange(region, e.target.checked)}
              />
              {regionLabels[region]}
            </CheckboxItem>
          ))}
        </CheckboxGroup>
      </FilterSection>

      <FilterSection>
        <SectionTitle>Plattform</SectionTitle>
        <CheckboxGroup>
          {Object.values(Platform).map(platform => (
            <CheckboxItem key={platform}>
              <Checkbox
                type="checkbox"
                checked={localFilters.platform?.includes(platform) || false}
                onChange={(e) => handlePlatformChange(platform, e.target.checked)}
              />
              {platformLabels[platform]}
            </CheckboxItem>
          ))}
        </CheckboxGroup>
      </FilterSection>

      <FilterSection>
        <SectionTitle>Seltenheit</SectionTitle>
        <CheckboxGroup>
          {Object.values(RarityLevel).map(rarity => (
            <CheckboxItem key={rarity}>
              <Checkbox
                type="checkbox"
                checked={localFilters.rarity?.includes(rarity) || false}
                onChange={(e) => handleRarityChange(rarity, e.target.checked)}
              />
              {rarityLabels[rarity]}
            </CheckboxItem>
          ))}
        </CheckboxGroup>
      </FilterSection>

      <FilterSection>
        <SectionTitle>
          <FaEuroSign />
          Preis (€)
        </SectionTitle>
        <RangeContainer>
          <RangeInput
            type="number"
            placeholder="Min. Preis"
            value={localFilters.priceRange?.min || ''}
            onChange={(e) => handlePriceRangeChange('min', e.target.value)}
          />
          <RangeInput
            type="number"
            placeholder="Max. Preis"
            value={localFilters.priceRange?.max || ''}
            onChange={(e) => handlePriceRangeChange('max', e.target.value)}
          />
          <RangeLabels>
            <span>0€</span>
            <span>1000€+</span>
          </RangeLabels>
        </RangeContainer>
      </FilterSection>

      <FilterSection>
        <SectionTitle>
          <FaStar />
          Punktewert
        </SectionTitle>
        <RangeContainer>
          <RangeInput
            type="number"
            placeholder="Min. Punkte"
            value={localFilters.pointsRange?.min || ''}
            onChange={(e) => handlePointsRangeChange('min', e.target.value)}
          />
          <RangeInput
            type="number"
            placeholder="Max. Punkte"
            value={localFilters.pointsRange?.max || ''}
            onChange={(e) => handlePointsRangeChange('max', e.target.value)}
          />
          <RangeLabels>
            <span>0</span>
            <span>1000+</span>
          </RangeLabels>
        </RangeContainer>
      </FilterSection>

      <ApplyButton
        onClick={handleApplyFilters}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FaCheck />
        Filter anwenden
      </ApplyButton>
    </FilterContainer>
  );
};

export default FilterPanel;
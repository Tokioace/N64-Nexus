import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSort, FaChevronDown, FaCheck } from 'react-icons/fa';
import { SortOption } from '../types';

const DropdownContainer = styled.div`
  position: relative;
  min-width: 200px;
`;

const DropdownButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(100, 181, 246, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #64b5f6;
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  margin-top: 0.5rem;
  z-index: 1000;
  overflow: hidden;
`;

const DropdownItem = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: ${props => props.selected ? '#64b5f6' : '#ffffff'};
  background: ${props => props.selected ? 'rgba(100, 181, 246, 0.1)' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.selected 
      ? 'rgba(100, 181, 246, 0.2)' 
      : 'rgba(255, 255, 255, 0.1)'
    };
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const ItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CheckIcon = styled(FaCheck)`
  color: #64b5f6;
  font-size: 0.8rem;
`;

interface SortDropdownProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

const sortOptions = [
  {
    value: SortOption.NEWEST,
    label: 'Neueste zuerst',
    icon: '🕒'
  },
  {
    value: SortOption.PRICE_LOW_HIGH,
    label: 'Preis: Niedrig zu Hoch',
    icon: '💰'
  },
  {
    value: SortOption.PRICE_HIGH_LOW,
    label: 'Preis: Hoch zu Niedrig',
    icon: '💰'
  },
  {
    value: SortOption.POPULARITY,
    label: 'Beliebtheit',
    icon: '⭐'
  },
  {
    value: SortOption.RARITY,
    label: 'Seltenheit',
    icon: '💎'
  },
  {
    value: SortOption.POINTS_VALUE,
    label: 'Punktewert',
    icon: '🏆'
  }
];

const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (sortOption: SortOption) => {
    onChange(sortOption);
    setIsOpen(false);
  };

  const selectedOption = sortOptions.find(option => option.value === value);

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton
        onClick={handleToggle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <ButtonContent>
          <FaSort />
          {selectedOption?.label || 'Sortieren'}
        </ButtonContent>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown />
        </motion.div>
      </DropdownButton>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenu
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {sortOptions.map((option) => (
              <DropdownItem
                key={option.value}
                selected={option.value === value}
                onClick={() => handleSelect(option.value)}
              >
                <ItemContent>
                  <span>{option.icon}</span>
                  {option.label}
                </ItemContent>
                {option.value === value && <CheckIcon />}
              </DropdownItem>
            ))}
          </DropdownMenu>
        )}
      </AnimatePresence>
    </DropdownContainer>
  );
};

export default SortDropdown;
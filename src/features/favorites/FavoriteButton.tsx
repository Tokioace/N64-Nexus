import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { FavoriteItem } from '@/types/favorites';

interface FavoriteButtonProps {
  favorite: Omit<FavoriteItem, 'id' | 'addedAt' | 'updatedAt'>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  favorite,
  size = 'md',
  className = ''
}) => {
  const { isFavorited, toggleFavorite } = useFavoritesStore();
  const isFav = isFavorited(favorite.url);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(favorite);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`favorite-button ${sizeClasses[size]} ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={isFav ? 'Von Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
    >
      <Heart 
        className={`${iconSizes[size]} transition-all duration-300 ${
          isFav ? 'fill-current text-white' : 'text-retro-gray-400'
        }`} 
      />
      {isFav && (
        <motion.div
          className="absolute inset-0 bg-n64-red-500 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  );
};
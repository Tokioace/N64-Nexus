import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Eye, MessageCircle, User, Calendar, MapPin, Tag } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryItemCardProps {
  item: GalleryItem;
}

const GalleryItemCard: React.FC<GalleryItemCardProps> = ({ item }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getRarityColor = (rarity: number) => {
    switch (rarity) {
      case 1: return 'text-gray-400';
      case 2: return 'text-green-400';
      case 3: return 'text-blue-400';
      case 4: return 'text-purple-400';
      case 5: return 'text-yellow-400 animate-sparkle';
      default: return 'text-gray-400';
    }
  };

  const getCollectorTitleClass = (title: string) => {
    switch (title) {
      case 'legendary': return 'legendary';
      case 'archivist': return 'archivist';
      case 'collector': return 'collector';
      case 'beginner': return 'beginner';
      default: return 'beginner';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="n64-card group cursor-pointer"
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Rarity Badge */}
        <div className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1">
          <div className="flex items-center space-x-1">
            <Star size={12} className={getRarityColor(item.rarity)} fill="currentColor" />
            <span className={`text-xs font-bold ${getRarityColor(item.rarity)}`}>
              {item.rarity}
            </span>
          </div>
        </div>

        {/* Points Badge */}
        <div className="absolute top-2 left-2 bg-n64-purple/90 rounded-full px-2 py-1">
          <span className="text-xs font-bold text-white">
            {item.points} pts
          </span>
        </div>

        {/* For Sale Badge */}
        {item.isForSale && (
          <div className="absolute bottom-2 left-2 bg-n64-green/90 rounded-full px-2 py-1">
            <span className="text-xs font-bold text-white">
              💰 Verkauf
            </span>
          </div>
        )}

        {/* Origin Badge */}
        {item.origin && (
          <div className="absolute bottom-2 right-2 bg-n64-blue/90 rounded-full px-2 py-1">
            <span className="text-xs font-bold text-white">
              📍 {item.origin}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Title */}
        <h3 className="font-bold text-white text-lg leading-tight group-hover:text-n64-yellow transition-colors duration-200">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-n64-light/80 text-sm line-clamp-2">
          {item.description}
        </p>

        {/* Uploader Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-n64-green to-n64-blue rounded-full flex items-center justify-center">
              <User size={12} className="text-white" />
            </div>
            <div>
              <div className="text-xs font-n64 text-white">
                {item.uploader.username}
              </div>
              <div className={`text-xs collector-title ${getCollectorTitleClass(item.uploader.title)}`}>
                {item.uploader.title === 'legendary' && '🏆 '}
                {item.uploader.title === 'archivist' && '🎖️ '}
                {item.uploader.title === 'collector' && '⭐ '}
                {item.uploader.title === 'beginner' && '🌱 '}
                {item.uploader.title.charAt(0).toUpperCase() + item.uploader.title.slice(1)}
              </div>
            </div>
          </div>
          
          <div className="text-xs text-n64-light/60 flex items-center space-x-1">
            <Calendar size={12} />
            <span>{formatDate(item.uploadDate)}</span>
          </div>
        </div>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-n64-purple/20 text-n64-light/80 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-xs text-n64-light/60">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-n64-purple/20">
          <div className="flex items-center space-x-4 text-xs text-n64-light/60">
            <div className="flex items-center space-x-1">
              <Eye size={12} />
              <span>{item.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart size={12} />
              <span>{item.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle size={12} />
              <span>{item.comments.length}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className={`p-1 rounded-full transition-colors duration-200 ${
                isLiked 
                  ? 'text-n64-red bg-n64-red/20' 
                  : 'text-n64-light/60 hover:text-n64-red hover:bg-n64-red/20'
              }`}
            >
              <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded-full text-n64-light/60 hover:text-n64-blue hover:bg-n64-blue/20 transition-colors duration-200"
            >
              <MessageCircle size={14} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-n64-purple/20"
        >
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-n64-light/80">
              <MapPin size={14} />
              <span>Herkunft: {item.origin || 'Nicht angegeben'}</span>
            </div>
            
            {item.isForSale && (
              <div className="bg-n64-green/20 border border-n64-green/30 rounded-lg p-2">
                <p className="text-n64-green text-xs font-n64">
                  💰 Der Besitzer würde dieses Item ggf. verkaufen
                </p>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Tag size={14} className="text-n64-light/60" />
              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-n64-purple/30 text-n64-light px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GalleryItemCard;
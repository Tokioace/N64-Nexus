import React from 'react';
import { GalleryCategory } from '../types';

interface GalleryTabProps {
  category: GalleryCategory;
  isActive: boolean;
  onClick: () => void;
  label: string;
  icon: string;
  color: string;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ 
  category, 
  isActive, 
  onClick, 
  label, 
  icon, 
  color 
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
        isActive
          ? `bg-gradient-to-r ${color} text-white shadow-lg`
          : 'bg-n64-dark/50 text-n64-light hover:bg-n64-purple/20'
      }`}
    >
      <span className="text-2xl mr-2">{icon}</span>
      {label}
    </button>
  );
};

export default GalleryTab;
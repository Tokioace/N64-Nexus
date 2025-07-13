import React from 'react';
import { mockData } from '../data/mockData';

interface StickerPickerProps {
  onSelect: (sticker: string) => void;
}

const StickerPicker: React.FC<StickerPickerProps> = ({ onSelect }) => {
  const categories = Array.from(new Set(mockData.stickers.map(sticker => sticker.category)));

  return (
    <div className="bg-white border-2 border-retro-gray rounded-lg p-4 shadow-lg">
      <h4 className="font-pixel text-sm text-retro-dark mb-3">🎯 Sticker auswählen</h4>
      
      {categories.map((category) => (
        <div key={category} className="mb-4">
          <h5 className="text-xs font-retro text-retro-gray mb-2 uppercase">
            {category}
          </h5>
          <div className="grid grid-cols-4 gap-2">
            {mockData.stickers
              .filter(sticker => sticker.category === category)
              .map((sticker) => (
                <button
                  key={sticker.id}
                  onClick={() => onSelect(sticker.url)}
                  className="w-12 h-12 text-2xl bg-retro-light rounded-lg hover:bg-retro-blue hover:text-white transition-colors flex items-center justify-center"
                  title={sticker.name}
                >
                  {sticker.url}
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StickerPicker;
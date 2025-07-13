import React from 'react';
import { mockData } from '../data/mockData';

interface QuickRepliesProps {
  onSelect: (text: string) => void;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({ onSelect }) => {
  return (
    <div className="px-4 py-2 border-t border-retro-light">
      <div className="flex flex-wrap gap-2">
        {mockData.quickReplies.map((reply) => (
          <button
            key={reply.id}
            onClick={() => onSelect(reply.text)}
            className="px-3 py-1 text-sm bg-white border-2 border-retro-gray rounded-full hover:bg-retro-light hover:border-retro-blue transition-colors font-retro flex items-center space-x-1"
          >
            {reply.emoji && <span>{reply.emoji}</span>}
            <span>{reply.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickReplies;
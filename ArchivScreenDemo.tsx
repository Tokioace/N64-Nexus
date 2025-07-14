import React from 'react';
import ArchivScreen from './ArchivScreen';

// Demo component to show how to use ArchivScreen
const ArchivScreenDemo: React.FC = () => {
  const handleShare = (item: any) => {
    console.log('Sharing item:', item);
    // Custom sharing logic can be implemented here
    // For example: open share dialog, copy to clipboard, etc.
  };

  const handleItemClick = (item: any) => {
    console.log('Item clicked:', item);
    // Custom click logic can be implemented here
    // For example: open detail view, navigate to item, etc.
  };

  return (
    <div>
      <ArchivScreen 
        onShare={handleShare}
        onItemClick={handleItemClick}
      />
    </div>
  );
};

export default ArchivScreenDemo;
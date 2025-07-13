import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Upload, Trophy, Users, Heart, Eye, MessageCircle } from 'lucide-react';
import { GalleryCategory, GalleryItem, User, TopList } from '../types';
import GalleryTab from './GalleryTab';
import UploadModal from './UploadModal';
import TopLists from './TopLists';
import GalleryItemCard from './GalleryItemCard';

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    username: 'Collector64',
    points: 1250,
    title: 'legendary',
    itemsSubmitted: 25,
    joinDate: new Date('2020-01-15'),
    isOnline: true
  },
  {
    id: '2',
    username: 'N64Archivist',
    points: 890,
    title: 'archivist',
    itemsSubmitted: 18,
    joinDate: new Date('2021-03-22'),
    isOnline: false
  },
  {
    id: '3',
    username: 'RetroGamer99',
    points: 650,
    title: 'collector',
    itemsSubmitted: 12,
    joinDate: new Date('2022-06-10'),
    isOnline: true
  }
];

const mockItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Original Mario Kart 64 Yoshi Figure (1998)',
    description: 'Seltene Originalfigur aus der ersten Mario Kart 64 Serie. Perfekter Zustand mit Originalverpackung.',
    imageUrl: 'https://via.placeholder.com/300x200/663399/ffffff?text=Mario+Kart+Yoshi+1998',
    category: 'merchandise',
    rarity: 5,
    points: 50,
    uploadDate: new Date('2024-01-15'),
    uploader: mockUsers[0],
    origin: 'eBay',
    isForSale: true,
    tags: ['mario-kart', 'yoshi', 'original', '1998'],
    views: 245,
    likes: 18,
    comments: []
  },
  {
    id: '2',
    title: 'GoldenEye 007 Demo Version',
    description: 'Seltene Demo-Version von GoldenEye 007. Nur 1000 Exemplare wurden produziert.',
    imageUrl: 'https://via.placeholder.com/300x200/0066CC/ffffff?text=GoldenEye+Demo',
    category: 'merchandise',
    rarity: 5,
    points: 50,
    uploadDate: new Date('2024-01-10'),
    uploader: mockUsers[1],
    origin: 'Flohmarkt',
    tags: ['goldeneye', 'demo', 'rare', '007'],
    views: 189,
    likes: 22,
    comments: []
  },
  {
    id: '3',
    title: 'Zelda Ocarina of Time Fanart',
    description: 'Handgezeichnete Fanart von Link und Zelda im Stil der 90er Jahre.',
    imageUrl: 'https://via.placeholder.com/300x200/00CC66/ffffff?text=Zelda+Fanart',
    category: 'fanart',
    rarity: 4,
    points: 40,
    uploadDate: new Date('2024-01-12'),
    uploader: mockUsers[2],
    tags: ['zelda', 'fanart', 'ocarina-of-time', 'link'],
    views: 156,
    likes: 15,
    comments: []
  },
  {
    id: '4',
    title: 'Super Mario 64 Screenshot - Peach Castle',
    description: 'Perfekter Screenshot vom Peach Castle in Super Mario 64. 120 Sterne erreicht!',
    imageUrl: 'https://via.placeholder.com/300x200/CC0033/ffffff?text=Peach+Castle',
    category: 'screenshots',
    rarity: 3,
    points: 30,
    uploadDate: new Date('2024-01-08'),
    uploader: mockUsers[0],
    tags: ['super-mario-64', 'peach-castle', 'screenshot', '120-stars'],
    views: 98,
    likes: 8,
    comments: []
  }
];

const Battle64Gallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<GalleryCategory>('merchandise');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [items, setItems] = useState<GalleryItem[]>(mockItems);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    setFilteredItems(items.filter(item => item.category === activeTab));
  }, [activeTab, items]);

  const handleUpload = (newItem: GalleryItem) => {
    setItems(prev => [newItem, ...prev]);
    setShowUploadModal(false);
  };

  const categories: { key: GalleryCategory; label: string; icon: string; color: string }[] = [
    { key: 'fanart', label: '🎨 Fanart', icon: '🎨', color: 'from-n64-green to-n64-blue' },
    { key: 'screenshots', label: '📷 Screenshots', icon: '📷', color: 'from-n64-red to-n64-yellow' },
    { key: 'merchandise', label: '🧸 Sammlerstücke & Merch', icon: '🧸', color: 'from-n64-purple to-n64-green' }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-6xl font-retro text-white text-shadow">
          🖼️ Battle64 Gallery
        </h1>
        <p className="text-lg text-n64-light/80 font-n64 max-w-2xl mx-auto">
          Entdecke Fanart, Screenshots und seltene Sammlerstücke aus der goldenen Ära des Nintendo 64
        </p>
        
        {/* Upload Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUploadModal(true)}
          className="n64-button inline-flex items-center space-x-2"
        >
          <Upload size={20} />
          <span>Item hochladen</span>
        </motion.button>
      </motion.div>

      {/* Top Lists Section */}
      <TopLists users={mockUsers} items={items} />

      {/* Gallery Tabs */}
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <motion.button
              key={category.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(category.key)}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                activeTab === category.key
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : 'bg-n64-dark/50 text-n64-light hover:bg-n64-purple/20'
              }`}
            >
              <span className="text-2xl mr-2">{category.icon}</span>
              {category.label}
            </motion.button>
          ))}
        </div>

        {/* Gallery Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredItems.map((item) => (
              <GalleryItemCard key={item.id} item={item} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-n64 text-n64-light/60 mb-2">
              Noch keine Items in dieser Kategorie
            </h3>
            <p className="text-n64-light/40">
              Sei der Erste und lade ein {activeTab === 'fanart' ? 'Fanart' : activeTab === 'screenshots' ? 'Screenshot' : 'Sammlerstück'} hoch!
            </p>
          </motion.div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
          users={mockUsers}
        />
      )}
    </div>
  );
};

export default Battle64Gallery;
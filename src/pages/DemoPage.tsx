import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Heart, 
  List, 
  Settings, 
  BarChart3,
  Home,
  Gamepad2,
  Trophy,
  Image,
  Calendar,
  User,
  Bookmark
} from 'lucide-react';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { FavoritesOverview } from '@/features/favorites/FavoritesOverview';
import { FavoritesLists } from '@/features/favorites/FavoritesLists';
import { NotificationSettings } from '@/features/favorites/NotificationSettings';

type TabType = 'overview' | 'lists' | 'stats' | 'settings';

const tabConfig = [
  { id: 'overview' as TabType, label: 'Übersicht', icon: Star },
  { id: 'lists' as TabType, label: 'Listen', icon: List },
  { id: 'stats' as TabType, label: 'Statistiken', icon: BarChart3 },
  { id: 'settings' as TabType, label: 'Einstellungen', icon: Settings }
];

export const DemoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { getStats } = useFavoritesStore();
  const stats = getStats();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <FavoritesOverview />;
      case 'lists':
        return <FavoritesLists />;
      case 'stats':
        return <StatsTab stats={stats} />;
      case 'settings':
        return <NotificationSettings />;
      default:
        return <FavoritesOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-retro-gray-900">
      {/* Header */}
      <header className="bg-retro-gray-800 border-b border-retro-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="game-box p-2">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white font-pixel">Battle64</h1>
                <p className="text-retro-gray-400 text-xs">Favoriten-System Demo</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-bold text-n64-purple-400">{stats.totalFavorites}</div>
                <div className="text-xs text-retro-gray-400">Favoriten</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-retro-gray-800 border-b border-retro-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-colors ${
                    isActive
                      ? 'bg-retro-gray-700 text-n64-purple-400 border-b-2 border-n64-purple-400'
                      : 'text-retro-gray-400 hover:text-white hover:bg-retro-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </main>
    </div>
  );
};

// Stats Tab Component
const StatsTab: React.FC<{ stats: any }> = ({ stats }) => {
  const typeIcons = {
    game: Gamepad2,
    track: Trophy,
    fanart: Image,
    event: Calendar,
    user: User,
    quiz: Bookmark,
    trade: Heart
  };

  const typeLabels = {
    game: 'Spiele',
    track: 'Strecken',
    fanart: 'Fanarts',
    event: 'Events',
    user: 'User',
    quiz: 'Quiz',
    trade: 'Tausch'
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Statistiken</h2>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="retro-card p-6 text-center">
            <div className="text-3xl font-bold text-n64-purple-400 mb-2">
              {stats.totalFavorites}
            </div>
            <div className="text-retro-gray-400">Gesamt Favoriten</div>
          </div>
          
          <div className="retro-card p-6 text-center">
            <div className="text-3xl font-bold text-n64-blue-400 mb-2">
              {Object.keys(stats.favoritesByType).length}
            </div>
            <div className="text-retro-gray-400">Inhaltstypen</div>
          </div>
          
          <div className="retro-card p-6 text-center">
            <div className="text-3xl font-bold text-n64-green-400 mb-2">
              {stats.mostUsedTags.length}
            </div>
            <div className="text-retro-gray-400">Verwendete Tags</div>
          </div>
        </div>

        {/* Type Breakdown */}
        <div className="retro-card p-6">
          <h3 className="text-lg font-bold text-white mb-4">Aufschlüsselung nach Typ</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.favoritesByType).map(([type, count]) => {
              const Icon = typeIcons[type as keyof typeof typeIcons];
              return (
                <div key={type} className="text-center p-4 bg-retro-gray-700 rounded-lg">
                  <Icon className="w-6 h-6 text-n64-purple-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">{count as number}</div>
                  <div className="text-sm text-retro-gray-400">
                    {typeLabels[type as keyof typeof typeLabels]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Used Tags */}
        {stats.mostUsedTags.length > 0 && (
          <div className="retro-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">Beliebteste Tags</h3>
            <div className="flex flex-wrap gap-2">
              {stats.mostUsedTags.slice(0, 10).map((tag: any) => (
                <div
                  key={tag.tag}
                  className="flex items-center space-x-2 px-3 py-2 bg-retro-gray-700 rounded-lg"
                >
                  <span className="text-white font-medium">{tag.tag}</span>
                  <span className="text-n64-purple-400 text-sm">{tag.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {stats.recentActivity.length > 0 && (
          <div className="retro-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">Letzte Aktivität</h3>
            <div className="space-y-2">
              {stats.recentActivity.slice(0, 5).map((date: Date, index: number) => (
                <div key={index} className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-n64-green-400 rounded-full"></div>
                  <span className="text-retro-gray-300">
                    Aktivität am {new Date(date).toLocaleDateString('de-DE')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useNews } from '../context/NewsContext';
import NewsPost from './NewsPost';
import FilterPanel from './FilterPanel';
import { NewsPost as NewsPostType } from '../types';

const NewsFeed: React.FC = () => {
  const { state, getFilteredPosts } = useNews();
  const [filteredPosts, setFilteredPosts] = useState<NewsPostType[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setFilteredPosts(getFilteredPosts());
  }, [state.posts, state.filters, getFilteredPosts]);

  // Mock data for demonstration
  useEffect(() => {
    if (state.posts.length === 0) {
      const mockPosts: NewsPostType[] = [
        {
          id: '1',
          type: 'official',
          title: '🎮 Battle64 Season 2 Startet!',
          content: 'Das neue Season 2 von Battle64 startet am 15. März! Neue Events, Challenges und Belohnungen warten auf euch. Bereitet euch auf epische Kämpfe vor!',
          author: 'Battle64 Team',
          authorRole: 'admin',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          likes: 42,
          comments: [],
          isNew: true,
          visibility: 'global',
          pushNotification: true,
        },
        {
          id: '2',
          type: 'highlight',
          title: '🏆 Sergio hat Platin-Orden erhalten!',
          content: 'Herzlichen Glückwunsch an Sergio für den unglaublichen Platin-Orden in Super Mario 64! Eine fantastische Leistung!',
          author: 'System',
          authorRole: 'admin',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          likes: 128,
          comments: [],
          isNew: true,
          visibility: 'global',
          pushNotification: false,
        },
        {
          id: '3',
          type: 'fanart',
          title: '🖼️ Neue Fanart: Mario in 8-Bit Style',
          content: 'Checkt diese fantastische 8-Bit Mario Fanart von @PixelArtist! Perfekt für unseren Retro-Feed!',
          author: 'Fanart Curator',
          authorRole: 'editor',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          image: 'https://via.placeholder.com/400x300/0066CC/FFFFFF?text=Mario+8-Bit+Art',
          likes: 89,
          comments: [],
          isNew: false,
          visibility: 'global',
          pushNotification: false,
        },
        {
          id: '4',
          type: 'event',
          title: '🕹️ Speedrun Event: GoldenEye 007',
          content: 'Das wöchentliche Speedrun Event startet in 2 Stunden! Wer schafft die beste Zeit in GoldenEye 007?',
          author: 'Event Manager',
          authorRole: 'admin',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
          likes: 67,
          comments: [],
          isNew: false,
          visibility: 'global',
          pushNotification: true,
        },
        {
          id: '5',
          type: 'tip',
          title: '💡 Retro-Tipp: Heute vor 25 Jahren...',
          content: 'Heute vor 25 Jahren erschien Super Mario 64 für das Nintendo 64! Ein Meilenstein der Spielegeschichte.',
          author: 'Retro Historian',
          authorRole: 'editor',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
          likes: 156,
          comments: [],
          isNew: false,
          visibility: 'global',
          pushNotification: false,
        },
      ];

      mockPosts.forEach(post => {
        // @ts-ignore - We're adding to the context directly for demo
        state.posts.push(post);
      });
    }
  }, [state.posts.length]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-pixel text-n64-blue glow-text mb-2">
            📰 Battle64 News Feed
          </h2>
          <p className="text-n64-gray font-n64">
            Bleib auf dem Laufenden mit den neuesten Events, Highlights und Community-News!
          </p>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="n64-button"
        >
          🔧 Filter {showFilters ? 'verstecken' : 'anzeigen'}
        </button>
      </div>

      {showFilters && <FilterPanel />}

      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="n64-card text-center py-12">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-pixel text-n64-blue mb-2">
              Keine News gefunden
            </h3>
            <p className="text-n64-gray font-n64">
              Versuche andere Filtereinstellungen oder schaue später wieder vorbei!
            </p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <NewsPost key={post.id} post={post} />
          ))
        )}
      </div>

      {filteredPosts.length > 0 && (
        <div className="text-center mt-8">
          <p className="text-n64-gray font-n64">
            Zeige {filteredPosts.length} von {state.posts.length} News
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
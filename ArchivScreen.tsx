import React, { useState, useMemo } from 'react';
import './ArchivScreen.css';

interface ArchiveItem {
  id: string;
  title: string;
  description: string;
  type: 'record' | 'screenshot' | 'artwork';
  date: Date;
  imageUrl?: string;
  data?: any; // Additional data for records, etc.
}

interface ArchivScreenProps {
  onShare?: (item: ArchiveItem) => void;
  onItemClick?: (item: ArchiveItem) => void;
}

const ArchivScreen: React.FC<ArchivScreenProps> = ({ onShare, onItemClick }) => {
  const [selectedType, setSelectedType] = useState<'all' | 'record' | 'screenshot' | 'artwork'>('all');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  // Mock data - replace with actual data from your app
  const archiveItems: ArchiveItem[] = useMemo(() => [
    {
      id: '1',
      title: 'Speedrun World Record',
      description: 'Neuer Weltrekord in Super Mario 64 - 120 Stars',
      type: 'record',
      date: new Date('2024-01-15'),
      data: { time: '1:38:45', category: '120 Stars' }
    },
    {
      id: '2',
      title: 'Epic Screenshot',
      description: 'Perfekter Sprung über Bowser',
      type: 'screenshot',
      date: new Date('2024-02-20'),
      imageUrl: '/images/screenshot1.jpg'
    },
    {
      id: '3',
      title: 'Mario Fanart',
      description: 'Pixelart von Mario und Luigi',
      type: 'artwork',
      date: new Date('2024-03-10'),
      imageUrl: '/images/fanart1.jpg'
    },
    {
      id: '4',
      title: 'Speedrun PB',
      description: 'Neuer persönlicher Rekord - 16 Stars',
      type: 'record',
      date: new Date('2023-12-05'),
      data: { time: '0:15:32', category: '16 Stars' }
    },
    {
      id: '5',
      title: 'Glitch Screenshot',
      description: 'Interessanter Glitch gefunden',
      type: 'screenshot',
      date: new Date('2023-11-18'),
      imageUrl: '/images/glitch1.jpg'
    },
    {
      id: '6',
      title: 'Luigi Artwork',
      description: 'Luigi in Pixelart-Stil',
      type: 'artwork',
      date: new Date('2023-10-25'),
      imageUrl: '/images/luigi-art.jpg'
    }
  ], []);

  const filteredItems = useMemo(() => {
    return archiveItems.filter(item => {
      const typeMatch = selectedType === 'all' || item.type === selectedType;
      const yearMatch = selectedYear === 'all' || item.date.getFullYear() === selectedYear;
      return typeMatch && yearMatch;
    }).sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [archiveItems, selectedType, selectedYear]);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(archiveItems.map(item => item.date.getFullYear()))];
    return uniqueYears.sort((a, b) => b - a);
  }, [archiveItems]);

  const groupedByYear = useMemo(() => {
    const grouped: Record<number, ArchiveItem[]> = {};
    filteredItems.forEach(item => {
      const year = item.date.getFullYear();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(item);
    });
    return grouped;
  }, [filteredItems]);

  const handleShare = (item: ArchiveItem, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onShare) {
      onShare(item);
    } else {
      // Default sharing behavior
      const shareData = {
        title: item.title,
        text: item.description,
        url: window.location.href
      };
      
      if (navigator.share) {
        navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${item.title}: ${item.description}`);
        alert('Link kopiert!');
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'record': return '🏆';
      case 'screenshot': return '📸';
      case 'artwork': return '🎨';
      default: return '📁';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'record': return '#FFD700';
      case 'screenshot': return '#87CEEB';
      case 'artwork': return '#FF69B4';
      default: return '#808080';
    }
  };

  return (
    <div className="archiv-screen">
      <div className="archiv-header">
        <h1 className="archiv-title">🏛️ Mein Archiv</h1>
        <p className="archiv-subtitle">Persönliche Highlights & Erinnerungen</p>
      </div>

      {/* Filter Controls */}
      <div className="archiv-filters">
        <div className="filter-group">
          <label>Typ:</label>
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">Alle</option>
            <option value="record">🏆 Rekorde</option>
            <option value="screenshot">📸 Screenshots</option>
            <option value="artwork">🎨 Artworks</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Jahr:</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="filter-select"
          >
            <option value="all">Alle Jahre</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="view-toggle">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            📦 Grid
          </button>
          <button 
            className={`view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
            onClick={() => setViewMode('timeline')}
          >
            📅 Timeline
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="archiv-content">
        {viewMode === 'grid' ? (
          <div className="archiv-grid">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className="archiv-item"
                onClick={() => onItemClick?.(item)}
              >
                <div className="item-header">
                  <span className="item-icon">{getTypeIcon(item.type)}</span>
                  <span className="item-type" style={{ color: getTypeColor(item.type) }}>
                    {item.type === 'record' ? 'Rekord' : 
                     item.type === 'screenshot' ? 'Screenshot' : 'Artwork'}
                  </span>
                  <button 
                    className="share-btn"
                    onClick={(e) => handleShare(item, e)}
                    title="Teilen"
                  >
                    📤
                  </button>
                </div>
                
                <div className="item-content">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-description">{item.description}</p>
                  
                  {item.imageUrl && (
                    <div className="item-image">
                      <img src={item.imageUrl} alt={item.title} />
                    </div>
                  )}
                  
                  {item.data && item.type === 'record' && (
                    <div className="record-data">
                      <span className="record-time">⏱️ {item.data.time}</span>
                      <span className="record-category">📊 {item.data.category}</span>
                    </div>
                  )}
                  
                  <div className="item-date">
                    📅 {item.date.toLocaleDateString('de-DE')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="archiv-timeline">
            {Object.entries(groupedByYear).map(([year, items]) => (
              <div key={year} className="timeline-year">
                <h2 className="year-header">{year}</h2>
                <div className="timeline-items">
                  {items.map(item => (
                    <div 
                      key={item.id} 
                      className="timeline-item"
                      onClick={() => onItemClick?.(item)}
                    >
                      <div className="timeline-marker" style={{ backgroundColor: getTypeColor(item.type) }}>
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <h3>{item.title}</h3>
                          <button 
                            className="share-btn"
                            onClick={(e) => handleShare(item, e)}
                            title="Teilen"
                          >
                            📤
                          </button>
                        </div>
                        <p>{item.description}</p>
                        <div className="timeline-date">
                          {item.date.toLocaleDateString('de-DE')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {filteredItems.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>Keine Einträge gefunden</h3>
          <p>Versuche andere Filtereinstellungen oder füge neue Highlights hinzu!</p>
        </div>
      )}
    </div>
  );
};

export default ArchivScreen;
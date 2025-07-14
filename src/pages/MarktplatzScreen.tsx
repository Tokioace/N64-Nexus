import React, { useState, useEffect } from 'react';
import './MarktplatzScreen.css';

interface Offer {
  id: string;
  title: string;
  image: string;
  price: number;
  condition: 'Neu' | 'Gebraucht - Sehr gut' | 'Gebraucht - Gut' | 'Gebraucht - Akzeptabel';
  region: string;
  seller: {
    name: string;
    rating: number;
    points: number;
  };
  description: string;
  category: string;
  createdAt: Date;
}

interface FilterState {
  region: string;
  condition: string;
  minPrice: number;
  maxPrice: number;
  category: string;
}

const MarktplatzScreen: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    region: '',
    condition: '',
    minPrice: 0,
    maxPrice: 1000,
    category: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [userPoints, setUserPoints] = useState(1500);

  // Mock data for offers
  const mockOffers: Offer[] = [
    {
      id: '1',
      title: 'Nintendo 64 Konsole mit 2 Controllern',
      image: 'https://via.placeholder.com/200x150/FF6B35/FFFFFF?text=N64',
      price: 89,
      condition: 'Gebraucht - Sehr gut',
      region: 'Bayern',
      seller: { name: 'GameCollector', rating: 4.8, points: 2500 },
      description: 'Komplett funktionsfähige N64 mit 2 originalen Controllern. Inklusive AV-Kabel.',
      category: 'Konsolen',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Super Mario 64 - Original',
      image: 'https://via.placeholder.com/200x150/4ECDC4/FFFFFF?text=SM64',
      price: 45,
      condition: 'Gebraucht - Gut',
      region: 'Nordrhein-Westfalen',
      seller: { name: 'RetroGamer', rating: 4.6, points: 1800 },
      description: 'Original Super Mario 64 Kartusche. Spielt perfekt, leichte Gebrauchsspuren.',
      category: 'Spiele',
      createdAt: new Date('2024-01-14')
    },
    {
      id: '3',
      title: 'Zelda: Ocarina of Time - Limited Edition',
      image: 'https://via.placeholder.com/200x150/45B7D1/FFFFFF?text=Zelda',
      price: 120,
      condition: 'Neu',
      region: 'Hessen',
      seller: { name: 'CollectorPro', rating: 5.0, points: 3200 },
      description: 'Ungeöffnete Limited Edition von Zelda: Ocarina of Time. Sammlerstück!',
      category: 'Spiele',
      createdAt: new Date('2024-01-13')
    },
    {
      id: '4',
      title: 'N64 Memory Pak - 4MB',
      image: 'https://via.placeholder.com/200x150/96CEB4/FFFFFF?text=Memory',
      price: 25,
      condition: 'Gebraucht - Sehr gut',
      region: 'Baden-Württemberg',
      seller: { name: 'TechStore', rating: 4.7, points: 2100 },
      description: 'Original Nintendo Memory Pak 4MB. Funktioniert einwandfrei.',
      category: 'Zubehör',
      createdAt: new Date('2024-01-12')
    },
    {
      id: '5',
      title: 'GoldenEye 007 - Multiplayer Bundle',
      image: 'https://via.placeholder.com/200x150/FFEAA7/FFFFFF?text=007',
      price: 35,
      condition: 'Gebraucht - Akzeptabel',
      region: 'Sachsen',
      seller: { name: 'BondFan', rating: 4.3, points: 950 },
      description: 'GoldenEye 007 mit 2 zusätzlichen Controllern für Multiplayer-Spaß.',
      category: 'Spiele',
      createdAt: new Date('2024-01-11')
    },
    {
      id: '6',
      title: 'N64 Expansion Pak - Offiziell',
      image: 'https://via.placeholder.com/200x150/DDA0DD/FFFFFF?text=Expansion',
      price: 55,
      condition: 'Gebraucht - Gut',
      region: 'Berlin',
      seller: { name: 'HardwareKing', rating: 4.9, points: 2800 },
      description: 'Offizielles Nintendo Expansion Pak für erweiterte Grafikleistung.',
      category: 'Zubehör',
      createdAt: new Date('2024-01-10')
    }
  ];

  useEffect(() => {
    setOffers(mockOffers);
    setFilteredOffers(mockOffers);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, offers]);

  const applyFilters = () => {
    let filtered = offers.filter(offer => {
      const regionMatch = !filters.region || offer.region === filters.region;
      const conditionMatch = !filters.condition || offer.condition === filters.condition;
      const priceMatch = offer.price >= filters.minPrice && offer.price <= filters.maxPrice;
      const categoryMatch = !filters.category || offer.category === filters.category;
      
      return regionMatch && conditionMatch && priceMatch && categoryMatch;
    });
    
    setFilteredOffers(filtered);
  };

  const handleFilterChange = (key: keyof FilterState, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleTrade = (offer: Offer) => {
    setSelectedOffer(offer);
    setShowTradeModal(true);
  };

  const executeTrade = () => {
    if (selectedOffer && userPoints >= selectedOffer.price) {
      setUserPoints(prev => prev - selectedOffer.price);
      setShowTradeModal(false);
      setSelectedOffer(null);
      alert(`Erfolgreich getauscht! ${selectedOffer.title} gehört jetzt dir!`);
    } else {
      alert('Nicht genügend Punkte für diesen Tausch!');
    }
  };

  const regions = ['Bayern', 'Nordrhein-Westfalen', 'Hessen', 'Baden-Württemberg', 'Sachsen', 'Berlin'];
  const conditions = ['Neu', 'Gebraucht - Sehr gut', 'Gebraucht - Gut', 'Gebraucht - Akzeptabel'];
  const categories = ['Konsolen', 'Spiele', 'Zubehör'];

  return (
    <div className="marktplatz-container">
      {/* Header */}
      <div className="marktplatz-header">
        <h1 className="retro-title">🎮 N64 Marktplatz 🎮</h1>
        <div className="user-info">
          <span className="user-points">Deine Punkte: {userPoints} ⭐</span>
          <button className="retro-button primary">Artikel anbieten</button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <button 
          className="filter-toggle retro-button"
          onClick={() => setShowFilters(!showFilters)}
        >
          🔍 Filter {showFilters ? 'ausblenden' : 'anzeigen'}
        </button>
        
        {showFilters && (
          <div className="filter-panel">
            <div className="filter-row">
              <div className="filter-group">
                <label>Region:</label>
                <select 
                  value={filters.region} 
                  onChange={(e) => handleFilterChange('region', e.target.value)}
                  className="retro-select"
                >
                  <option value="">Alle Regionen</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Zustand:</label>
                <select 
                  value={filters.condition} 
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                  className="retro-select"
                >
                  <option value="">Alle Zustände</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Kategorie:</label>
                <select 
                  value={filters.category} 
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="retro-select"
                >
                  <option value="">Alle Kategorien</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>Preisbereich: {filters.minPrice}€ - {filters.maxPrice}€</label>
                <div className="price-slider">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value))}
                    className="retro-slider"
                  />
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                    className="retro-slider"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="results-info">
        <span>{filteredOffers.length} Angebote gefunden</span>
      </div>

      {/* Offers Grid */}
      <div className="offers-grid">
        {filteredOffers.map(offer => (
          <div key={offer.id} className="offer-card">
            <div className="offer-image">
              <img src={offer.image} alt={offer.title} />
              <div className="condition-badge">{offer.condition}</div>
            </div>
            
            <div className="offer-content">
              <h3 className="offer-title">{offer.title}</h3>
              <div className="offer-price">{offer.price} Punkte</div>
              
              <div className="offer-details">
                <div className="seller-info">
                  <span className="seller-name">Verkäufer: {offer.seller.name}</span>
                  <span className="seller-rating">⭐ {offer.seller.rating}</span>
                </div>
                <div className="offer-location">📍 {offer.region}</div>
                <div className="offer-category">📁 {offer.category}</div>
              </div>
              
              <p className="offer-description">{offer.description}</p>
              
              <div className="offer-actions">
                <button 
                  className="retro-button trade-button"
                  onClick={() => handleTrade(offer)}
                  disabled={userPoints < offer.price}
                >
                  {userPoints >= offer.price ? '🔄 Tauschen' : '❌ Zu teuer'}
                </button>
                <button className="retro-button secondary">💬 Nachricht</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trade Modal */}
      {showTradeModal && selectedOffer && (
        <div className="modal-overlay">
          <div className="trade-modal">
            <div className="modal-header">
              <h2>🔄 Tausch bestätigen</h2>
              <button 
                className="modal-close"
                onClick={() => setShowTradeModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className="trade-item">
                <img src={selectedOffer.image} alt={selectedOffer.title} />
                <div>
                  <h3>{selectedOffer.title}</h3>
                  <p>Zustand: {selectedOffer.condition}</p>
                  <p>Verkäufer: {selectedOffer.seller.name} ⭐ {selectedOffer.seller.rating}</p>
                </div>
              </div>
              
              <div className="trade-cost">
                <p>Kosten: <strong>{selectedOffer.price} Punkte</strong></p>
                <p>Deine Punkte: <strong>{userPoints}</strong></p>
                <p>Verbleibend: <strong>{userPoints - selectedOffer.price}</strong></p>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="retro-button primary"
                  onClick={executeTrade}
                >
                  ✅ Tausch bestätigen
                </button>
                <button 
                  className="retro-button secondary"
                  onClick={() => setShowTradeModal(false)}
                >
                  ❌ Abbrechen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarktplatzScreen;
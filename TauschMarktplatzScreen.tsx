import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';

interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: 'Neu' | 'Gut' | 'Akzeptabel' | 'Gebraucht';
  rarity: 'Gewöhnlich' | 'Ungewöhnlich' | 'Selten' | 'Episch' | 'Legendär';
  game: string;
  region: string;
  images: string[];
  seller: {
    name: string;
    rating: number;
    avatar: string;
  };
  type: 'Verkauf' | 'Tausch';
  createdAt: Date;
}

interface FilterState {
  region: string;
  condition: string;
  rarity: string;
  game: string;
  type: string;
  priceRange: [number, number];
}

const TauschMarktplatzScreen: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([
    {
      id: '1',
      title: 'Super Mario Odyssey - Limited Edition',
      description: 'Komplett mit Steelbook und Artbook. Nur einmal gespielt.',
      price: 45,
      condition: 'Gut',
      rarity: 'Selten',
      game: 'Super Mario Odyssey',
      region: 'Europa',
      images: ['https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Mario+Odyssey'],
      seller: {
        name: 'GameCollector',
        rating: 4.8,
        avatar: 'https://via.placeholder.com/50x50/4ECDC4/FFFFFF?text=GC',
      },
      type: 'Verkauf',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      title: 'Zelda: Breath of the Wild',
      description: 'Suche Tausch gegen Pokemon Sword/Shield',
      price: 0,
      condition: 'Gut',
      rarity: 'Ungewöhnlich',
      game: 'Zelda: Breath of the Wild',
      region: 'Europa',
      images: ['https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Zelda+BOTW'],
      seller: {
        name: 'ZeldaFan',
        rating: 4.5,
        avatar: 'https://via.placeholder.com/50x50/45B7D1/FFFFFF?text=ZF',
      },
      type: 'Tausch',
      createdAt: new Date('2024-01-14'),
    },
    {
      id: '3',
      title: 'Pokemon Scarlet - Steelbook Edition',
      description: 'Neu und versiegelt. Sammlerstück!',
      price: 80,
      condition: 'Neu',
      rarity: 'Episch',
      game: 'Pokemon Scarlet',
      region: 'Europa',
      images: ['https://via.placeholder.com/300x200/96CEB4/FFFFFF?text=Pokemon+Scarlet'],
      seller: {
        name: 'PokemonMaster',
        rating: 4.9,
        avatar: 'https://via.placeholder.com/50x50/FFEAA7/FFFFFF?text=PM',
      },
      type: 'Verkauf',
      createdAt: new Date('2024-01-13'),
    },
  ]);

  const [filters, setFilters] = useState<FilterState>({
    region: '',
    condition: '',
    rarity: '',
    game: '',
    type: '',
    priceRange: [0, 100],
  });

  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');

  const filteredOffers = useMemo(() => {
    return offers.filter(offer => {
      if (filters.region && offer.region !== filters.region) return false;
      if (filters.condition && offer.condition !== filters.condition) return false;
      if (filters.rarity && offer.rarity !== filters.rarity) return false;
      if (filters.game && offer.game !== filters.game) return false;
      if (filters.type && offer.type !== filters.type) return false;
      if (offer.price < filters.priceRange[0] || offer.price > filters.priceRange[1]) return false;
      return true;
    });
  }, [offers, filters]);

  const regions = ['Europa', 'USA', 'Japan', 'Australien'];
  const conditions = ['Neu', 'Gut', 'Akzeptabel', 'Gebraucht'];
  const rarities = ['Gewöhnlich', 'Ungewöhnlich', 'Selten', 'Episch', 'Legendär'];
  const games = ['Super Mario Odyssey', 'Zelda: Breath of the Wild', 'Pokemon Scarlet', 'Pokemon Violet', 'Animal Crossing'];
  const types = ['Verkauf', 'Tausch'];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Gewöhnlich': return '#A0A0A0';
      case 'Ungewöhnlich': return '#4ECDC4';
      case 'Selten': return '#45B7D1';
      case 'Episch': return '#9B59B6';
      case 'Legendär': return '#F39C12';
      default: return '#A0A0A0';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Neu': return '#27AE60';
      case 'Gut': return '#3498DB';
      case 'Akzeptabel': return '#F39C12';
      case 'Gebraucht': return '#E74C3C';
      default: return '#A0A0A0';
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedOffer) {
      // Here you would typically send the message to the backend
      console.log(`Message to ${selectedOffer.seller.name}: ${message}`);
      setMessage('');
      setShowMessageModal(false);
      setSelectedOffer(null);
    }
  };

  const renderOfferCard = ({ item }: { item: Offer }) => (
    <TouchableOpacity
      style={styles.offerCard}
      onPress={() => setSelectedOffer(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.sellerInfo}>
          <Image source={{ uri: item.seller.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.sellerName}>{item.seller.name}</Text>
            <Text style={styles.rating}>⭐ {item.seller.rating}</Text>
          </View>
        </View>
        <View style={[styles.typeBadge, { backgroundColor: item.type === 'Verkauf' ? '#E74C3C' : '#3498DB' }]}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
      </View>

      <Image source={{ uri: item.images[0] }} style={styles.offerImage} />
      
      <View style={styles.cardContent}>
        <Text style={styles.offerTitle}>{item.title}</Text>
        <Text style={styles.offerDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.tagsContainer}>
          <View style={[styles.tag, { backgroundColor: getConditionColor(item.condition) }]}>
            <Text style={styles.tagText}>{item.condition}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: getRarityColor(item.rarity) }]}>
            <Text style={styles.tagText}>{item.rarity}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.region}</Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          {item.type === 'Verkauf' ? (
            <Text style={styles.price}>€{item.price}</Text>
          ) : (
            <Text style={styles.tradeText}>Tausch gesucht</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.filterModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent}>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Typ</Text>
              <View style={styles.filterOptions}>
                {types.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterOption,
                      filters.type === type && styles.filterOptionActive
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, type: filters.type === type ? '' : type }))}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.type === type && styles.filterOptionTextActive
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Region</Text>
              <View style={styles.filterOptions}>
                {regions.map(region => (
                  <TouchableOpacity
                    key={region}
                    style={[
                      styles.filterOption,
                      filters.region === region && styles.filterOptionActive
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, region: filters.region === region ? '' : region }))}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.region === region && styles.filterOptionTextActive
                    ]}>
                      {region}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Zustand</Text>
              <View style={styles.filterOptions}>
                {conditions.map(condition => (
                  <TouchableOpacity
                    key={condition}
                    style={[
                      styles.filterOption,
                      filters.condition === condition && styles.filterOptionActive
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, condition: filters.condition === condition ? '' : condition }))}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.condition === condition && styles.filterOptionTextActive
                    ]}>
                      {condition}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Seltenheit</Text>
              <View style={styles.filterOptions}>
                {rarities.map(rarity => (
                  <TouchableOpacity
                    key={rarity}
                    style={[
                      styles.filterOption,
                      filters.rarity === rarity && styles.filterOptionActive
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, rarity: filters.rarity === rarity ? '' : rarity }))}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.rarity === rarity && styles.filterOptionTextActive
                    ]}>
                      {rarity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Spiel</Text>
              <View style={styles.filterOptions}>
                {games.map(game => (
                  <TouchableOpacity
                    key={game}
                    style={[
                      styles.filterOption,
                      filters.game === game && styles.filterOptionActive
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, game: filters.game === game ? '' : game }))}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.game === game && styles.filterOptionTextActive
                    ]}>
                      {game}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.filterActions}>
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => setFilters({
                region: '',
                condition: '',
                rarity: '',
                game: '',
                type: '',
                priceRange: [0, 100],
              })}
            >
              <Text style={styles.clearFiltersText}>Filter löschen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyFiltersButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyFiltersText}>Anwenden</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderOfferDetailModal = () => (
    <Modal
      visible={!!selectedOffer}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSelectedOffer(null)}
    >
      {selectedOffer && (
        <View style={styles.modalOverlay}>
          <View style={styles.detailModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Angebot Details</Text>
              <TouchableOpacity onPress={() => setSelectedOffer(null)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.detailContent}>
              <Image source={{ uri: selectedOffer.images[0] }} style={styles.detailImage} />
              
              <View style={styles.detailInfo}>
                <Text style={styles.detailTitle}>{selectedOffer.title}</Text>
                <Text style={styles.detailDescription}>{selectedOffer.description}</Text>
                
                <View style={styles.detailTags}>
                  <View style={[styles.tag, { backgroundColor: getConditionColor(selectedOffer.condition) }]}>
                    <Text style={styles.tagText}>{selectedOffer.condition}</Text>
                  </View>
                  <View style={[styles.tag, { backgroundColor: getRarityColor(selectedOffer.rarity) }]}>
                    <Text style={styles.tagText}>{selectedOffer.rarity}</Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{selectedOffer.region}</Text>
                  </View>
                </View>

                <View style={styles.sellerDetailInfo}>
                  <Image source={{ uri: selectedOffer.seller.avatar }} style={styles.detailAvatar} />
                  <View>
                    <Text style={styles.detailSellerName}>{selectedOffer.seller.name}</Text>
                    <Text style={styles.detailRating}>⭐ {selectedOffer.seller.rating}</Text>
                  </View>
                </View>

                {selectedOffer.type === 'Verkauf' ? (
                  <Text style={styles.detailPrice}>Preis: €{selectedOffer.price}</Text>
                ) : (
                  <Text style={styles.detailTrade}>Tauschangebot</Text>
                )}
              </View>
            </ScrollView>

            <View style={styles.detailActions}>
              <TouchableOpacity
                style={styles.messageButton}
                onPress={() => setShowMessageModal(true)}
              >
                <Text style={styles.messageButtonText}>Nachricht senden</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Modal>
  );

  const renderMessageModal = () => (
    <Modal
      visible={showMessageModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowMessageModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.messageModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nachricht senden</Text>
            <TouchableOpacity onPress={() => setShowMessageModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.messageContent}>
            <Text style={styles.messageLabel}>
              Nachricht an {selectedOffer?.seller.name}:
            </Text>
            <TextInput
              style={styles.messageInput}
              multiline
              numberOfLines={4}
              placeholder="Schreibe deine Nachricht..."
              value={message}
              onChangeText={setMessage}
            />
          </View>

          <View style={styles.messageActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowMessageModal(false)}
            >
              <Text style={styles.cancelButtonText}>Abbrechen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Text style={styles.sendButtonText}>Senden</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TauschMarktplatz</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Text style={styles.filterButtonText}>🔍 Filter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredOffers}
        renderItem={renderOfferCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.offersList}
        showsVerticalScrollIndicator={false}
      />

      {renderFilterModal()}
      {renderOfferDetailModal()}
      {renderMessageModal()}
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#16213e',
    borderBottomWidth: 2,
    borderBottomColor: '#0f3460',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e94560',
  },
  filterButton: {
    backgroundColor: '#0f3460',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  offersList: {
    padding: 15,
  },
  offerCard: {
    backgroundColor: '#16213e',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#0f3460',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#0f3460',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  sellerName: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  rating: {
    color: '#f39c12',
    fontSize: 12,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  offerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  offerDescription: {
    color: '#b8b8b8',
    fontSize: 14,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#e94560',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  tradeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModal: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: '#0f3460',
  },
  detailModal: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    width: width * 0.95,
    maxHeight: '90%',
    borderWidth: 2,
    borderColor: '#0f3460',
  },
  messageModal: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    width: width * 0.9,
    borderWidth: 2,
    borderColor: '#0f3460',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    fontSize: 24,
    color: '#e94560',
    fontWeight: 'bold',
  },
  filterContent: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    backgroundColor: '#0f3460',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionActive: {
    backgroundColor: '#e94560',
  },
  filterOptionText: {
    color: '#ffffff',
    fontSize: 14,
  },
  filterOptionTextActive: {
    fontWeight: 'bold',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#0f3460',
  },
  clearFiltersButton: {
    backgroundColor: '#0f3460',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
  },
  clearFiltersText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  applyFiltersButton: {
    backgroundColor: '#e94560',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
  },
  applyFiltersText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  detailContent: {
    padding: 20,
  },
  detailImage: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
  },
  detailInfo: {
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  detailDescription: {
    color: '#b8b8b8',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  detailTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  sellerDetailInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  detailSellerName: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  detailRating: {
    color: '#f39c12',
    fontSize: 14,
  },
  detailPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  detailTrade: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
  },
  detailActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#0f3460',
  },
  messageButton: {
    backgroundColor: '#e94560',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  messageButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageContent: {
    padding: 20,
  },
  messageLabel: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 10,
  },
  messageInput: {
    backgroundColor: '#0f3460',
    borderRadius: 10,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  messageActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#0f3460',
  },
  cancelButton: {
    backgroundColor: '#0f3460',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  sendButton: {
    backgroundColor: '#e94560',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default TauschMarktplatzScreen;
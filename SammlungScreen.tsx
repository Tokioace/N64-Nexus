import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Types for N64 games
interface N64Game {
  id: string;
  title: string;
  region: 'PAL' | 'NTSC' | 'NTSC-J';
  condition: 'Mint' | 'Excellent' | 'Good' | 'Fair' | 'Poor';
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Very Rare' | 'Ultra Rare';
  addedMethod: 'scanned' | 'manual';
  imageUrl?: string;
  releaseYear?: number;
  publisher?: string;
  description?: string;
}

// Sample data
const sampleGames: N64Game[] = [
  {
    id: '1',
    title: 'Super Mario 64',
    region: 'PAL',
    condition: 'Excellent',
    rarity: 'Common',
    addedMethod: 'scanned',
    releaseYear: 1996,
    publisher: 'Nintendo',
  },
  {
    id: '2',
    title: 'The Legend of Zelda: Ocarina of Time',
    region: 'NTSC',
    condition: 'Mint',
    rarity: 'Common',
    addedMethod: 'manual',
    releaseYear: 1998,
    publisher: 'Nintendo',
  },
  {
    id: '3',
    title: 'GoldenEye 007',
    region: 'PAL',
    condition: 'Good',
    rarity: 'Common',
    addedMethod: 'scanned',
    releaseYear: 1997,
    publisher: 'Rare',
  },
  {
    id: '4',
    title: 'Conker\'s Bad Fur Day',
    region: 'NTSC',
    condition: 'Excellent',
    rarity: 'Rare',
    addedMethod: 'manual',
    releaseYear: 2001,
    publisher: 'Rare',
  },
  {
    id: '5',
    title: 'Super Smash Bros.',
    region: 'PAL',
    condition: 'Fair',
    rarity: 'Uncommon',
    addedMethod: 'scanned',
    releaseYear: 1999,
    publisher: 'Nintendo',
  },
  {
    id: '6',
    title: 'Mario Kart 64',
    region: 'NTSC',
    condition: 'Mint',
    rarity: 'Common',
    addedMethod: 'manual',
    releaseYear: 1996,
    publisher: 'Nintendo',
  },
];

type SortOption = 'alphabetical' | 'region' | 'condition' | 'rarity';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 2 columns with margins

const SammlungScreen: React.FC = () => {
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const [selectedGame, setSelectedGame] = useState<N64Game | null>(null);

  const sortedGames = useMemo(() => {
    return [...sampleGames].sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'region':
          return a.region.localeCompare(b.region);
        case 'condition':
          const conditionOrder = { 'Mint': 0, 'Excellent': 1, 'Good': 2, 'Fair': 3, 'Poor': 4 };
          return conditionOrder[a.condition] - conditionOrder[b.condition];
        case 'rarity':
          const rarityOrder = { 'Common': 0, 'Uncommon': 1, 'Rare': 2, 'Very Rare': 3, 'Ultra Rare': 4 };
          return rarityOrder[a.rarity] - rarityOrder[b.rarity];
        default:
          return 0;
      }
    });
  }, [sortBy]);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Mint': return '#00FF88';
      case 'Excellent': return '#00CC66';
      case 'Good': return '#FFAA00';
      case 'Fair': return '#FF6600';
      case 'Poor': return '#FF0000';
      default: return '#888888';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return '#888888';
      case 'Uncommon': return '#00AA00';
      case 'Rare': return '#0066FF';
      case 'Very Rare': return '#AA00AA';
      case 'Ultra Rare': return '#FFD700';
      default: return '#888888';
    }
  };

  const getRegionColor = (region: string) => {
    switch (region) {
      case 'PAL': return '#FF6B35';
      case 'NTSC': return '#4ECDC4';
      case 'NTSC-J': return '#45B7D1';
      default: return '#888888';
    }
  };

  const renderGameCard = ({ item }: { item: N64Game }) => (
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => setSelectedGame(item)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#8B5CF6', '#06B6D4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <View style={styles.addedMethodBadge}>
            <Ionicons
              name={item.addedMethod === 'scanned' ? 'camera' : 'hand-left'}
              size={12}
              color="#FFF"
            />
          </View>
          <View style={[styles.regionBadge, { backgroundColor: getRegionColor(item.region) }]}>
            <Text style={styles.regionText}>{item.region}</Text>
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.gameTitle} numberOfLines={2}>
            {item.title}
          </Text>
          
          <View style={styles.gameInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Condition:</Text>
              <View style={[styles.conditionDot, { backgroundColor: getConditionColor(item.condition) }]} />
              <Text style={styles.infoValue}>{item.condition}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Rarity:</Text>
              <View style={[styles.rarityDot, { backgroundColor: getRarityColor(item.rarity) }]} />
              <Text style={styles.infoValue}>{item.rarity}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          {item.releaseYear && (
            <Text style={styles.yearText}>{item.releaseYear}</Text>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderSortButton = (option: SortOption, label: string) => (
    <TouchableOpacity
      style={[styles.sortButton, sortBy === option && styles.sortButtonActive]}
      onPress={() => setSortBy(option)}
    >
      <Text style={[styles.sortButtonText, sortBy === option && styles.sortButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderGameDetails = () => {
    if (!selectedGame) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <LinearGradient
            colors={['#8B5CF6', '#06B6D4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalGradient}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedGame.title}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedGame(null)}
              >
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Region:</Text>
                <View style={[styles.detailBadge, { backgroundColor: getRegionColor(selectedGame.region) }]}>
                  <Text style={styles.detailBadgeText}>{selectedGame.region}</Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Condition:</Text>
                <View style={styles.detailValueContainer}>
                  <View style={[styles.conditionDot, { backgroundColor: getConditionColor(selectedGame.condition) }]} />
                  <Text style={styles.detailValue}>{selectedGame.condition}</Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Rarity:</Text>
                <View style={styles.detailValueContainer}>
                  <View style={[styles.rarityDot, { backgroundColor: getRarityColor(selectedGame.rarity) }]} />
                  <Text style={styles.detailValue}>{selectedGame.rarity}</Text>
                </View>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Added via:</Text>
                <View style={styles.detailValueContainer}>
                  <Ionicons
                    name={selectedGame.addedMethod === 'scanned' ? 'camera' : 'hand-left'}
                    size={16}
                    color="#FFF"
                  />
                  <Text style={styles.detailValue}>
                    {selectedGame.addedMethod === 'scanned' ? 'Camera Scan' : 'Manual Entry'}
                  </Text>
                </View>
              </View>
              
              {selectedGame.releaseYear && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Release Year:</Text>
                  <Text style={styles.detailValue}>{selectedGame.releaseYear}</Text>
                </View>
              )}
              
              {selectedGame.publisher && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Publisher:</Text>
                  <Text style={styles.detailValue}>{selectedGame.publisher}</Text>
                </View>
              )}
            </ScrollView>
          </LinearGradient>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A1A2E', '#16213E']}
        style={styles.background}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>N64 Sammlung</Text>
          <Text style={styles.headerSubtitle}>{sortedGames.length} Spiele</Text>
        </View>

        <View style={styles.sortContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {renderSortButton('alphabetical', 'Alphabetisch')}
            {renderSortButton('region', 'Region')}
            {renderSortButton('condition', 'Zustand')}
            {renderSortButton('rarity', 'Seltenheit')}
          </ScrollView>
        </View>

        <FlatList
          data={sortedGames}
          renderItem={renderGameCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.cardRow}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        {renderGameDetails()}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8B5CF6',
    textAlign: 'center',
    marginTop: 5,
  },
  sortContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  sortButtonActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  sortButtonText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  sortButtonTextActive: {
    color: '#FFF',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  gameCard: {
    width: cardWidth,
    height: 200,
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addedMethodBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  regionBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  regionText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  gameTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  gameInfo: {
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    color: '#FFF',
    fontSize: 10,
    marginRight: 4,
  },
  conditionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  infoValue: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  cardFooter: {
    alignItems: 'center',
  },
  yearText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: width - 40,
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    maxHeight: 400,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    width: 100,
  },
  detailValue: {
    color: '#FFF',
    fontSize: 16,
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  detailBadgeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SammlungScreen;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// Mock-Daten für N64-Spiele
const mockGames = [
  {
    id: '1',
    name: 'Super Mario 64',
    condition: 'Complete',
    region: 'PAL',
    image: null,
  },
  {
    id: '2',
    name: 'The Legend of Zelda: Ocarina of Time',
    condition: 'Boxed',
    region: 'NTSC',
    image: null,
  },
  {
    id: '3',
    name: 'Super Smash Bros.',
    condition: 'Loose',
    region: 'PAL',
    image: null,
  },
  {
    id: '4',
    name: 'Mario Kart 64',
    condition: 'Complete',
    region: 'PAL',
    image: null,
  },
  {
    id: '5',
    name: 'GoldenEye 007',
    condition: 'Boxed',
    region: 'NTSC',
    image: null,
  },
  {
    id: '6',
    name: 'Super Mario Party',
    condition: 'Loose',
    region: 'JP',
    image: null,
  },
  {
    id: '7',
    name: 'Banjo-Kazooie',
    condition: 'Complete',
    region: 'PAL',
    image: null,
  },
  {
    id: '8',
    name: 'Donkey Kong 64',
    condition: 'Boxed',
    region: 'NTSC',
    image: null,
  },
  {
    id: '9',
    name: 'Paper Mario',
    condition: 'Loose',
    region: 'JP',
    image: null,
  },
  {
    id: '10',
    name: 'Star Fox 64',
    condition: 'Complete',
    region: 'PAL',
    image: null,
  },
  {
    id: '11',
    name: 'F-Zero X',
    condition: 'Boxed',
    region: 'NTSC',
    image: null,
  },
  {
    id: '12',
    name: 'Pokémon Stadium',
    condition: 'Loose',
    region: 'PAL',
    image: null,
  },
];

// Level-Namen basierend auf Punktzahl
const getLevelName = (points) => {
  if (points >= 50) return 'Cartridge Legende';
  if (points >= 40) return 'Modulmeister';
  if (points >= 30) return 'N64 Experte';
  if (points >= 20) return 'Sammler Champion';
  if (points >= 10) return 'Cartridge Collector';
  return 'Rookie Sammler';
};

// Cartridge-Icon basierend auf Zustand
const CartridgeIcon = ({ condition }) => {
  const getColor = () => {
    switch (condition) {
      case 'Complete':
        return '#FFD700'; // Gold
      case 'Boxed':
        return '#C0C0C0'; // Silber
      case 'Loose':
        return '#808080'; // Grau
      default:
        return '#808080';
    }
  };

  return (
    <View style={[styles.cartridgeIcon, { backgroundColor: getColor() }]}>
      <Text style={styles.cartridgeEmoji}>😊</Text>
    </View>
  );
};

// Spiel-Karte Komponente
const GameCard = ({ game }) => {
  const getRegionColor = () => {
    switch (game.region) {
      case 'PAL':
        return '#4CAF50'; // Grün
      case 'NTSC':
        return '#2196F3'; // Blau
      case 'JP':
        return '#FF5722'; // Rot
      default:
        return '#757575';
    }
  };

  const getConditionText = () => {
    switch (game.condition) {
      case 'Complete':
        return 'Komplett';
      case 'Boxed':
        return 'Mit Box';
      case 'Loose':
        return 'Nur Modul';
      default:
        return game.condition;
    }
  };

  return (
    <TouchableOpacity style={styles.gameCard}>
      <View style={styles.cardHeader}>
        <View style={styles.gameInfo}>
          <Text style={styles.gameName} numberOfLines={2}>
            {game.name}
          </Text>
          <View style={styles.gameDetails}>
            <Text style={styles.conditionText}>{getConditionText()}</Text>
            <View style={[styles.regionBadge, { backgroundColor: getRegionColor() }]}>
              <Text style={styles.regionText}>{game.region}</Text>
            </View>
          </View>
        </View>
        <CartridgeIcon condition={game.condition} />
      </View>
      
      {game.image ? (
        <Image source={{ uri: game.image }} style={styles.gameImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>🎮</Text>
          <Text style={styles.placeholderSubText}>Kein Bild</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Hauptkomponente
const CollectionScreen = () => {
  const [games, setGames] = useState(mockGames);
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [levelName, setLevelName] = useState('');

  useEffect(() => {
    const points = games.length;
    const currentLevel = Math.floor(points / 10) + 1;
    
    setTotalPoints(points);
    setLevel(currentLevel);
    setLevelName(getLevelName(points));
  }, [games]);

  const renderGameItem = ({ item }) => <GameCard game={item} />;

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.screenTitle}>Meine N64-Sammlung</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalPoints}</Text>
          <Text style={styles.statLabel}>Punkte</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{level}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
        <View style={styles.levelNameContainer}>
          <Text style={styles.levelName}>{levelName}</Text>
        </View>
      </View>
    </View>
  );

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🎮</Text>
      <Text style={styles.emptyTitle}>Noch keine Module gesammelt</Text>
      <Text style={styles.emptySubtitle}>Füge dein erstes Spiel hinzu!</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <FlatList
        data={games.length > 0 ? games : []}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyListComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={games.length > 0 ? styles.row : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerContainer: {
    marginBottom: 20,
    paddingTop: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4fc3f7',
  },
  statLabel: {
    fontSize: 14,
    color: '#b0bec5',
    marginTop: 4,
  },
  levelNameContainer: {
    backgroundColor: '#4fc3f7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  row: {
    justifyContent: 'space-between',
  },
  gameCard: {
    width: (width - 48) / 2,
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  gameInfo: {
    flex: 1,
    marginRight: 8,
  },
  gameName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  gameDetails: {
    flexDirection: 'column',
    gap: 4,
  },
  conditionText: {
    fontSize: 12,
    color: '#b0bec5',
  },
  regionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  regionText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cartridgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cartridgeEmoji: {
    fontSize: 20,
  },
  gameImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#0f1419',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2a3441',
  },
  placeholderText: {
    fontSize: 30,
    marginBottom: 4,
  },
  placeholderSubText: {
    fontSize: 12,
    color: '#b0bec5',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#b0bec5',
    textAlign: 'center',
  },
});

export default CollectionScreen;
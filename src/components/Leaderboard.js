import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { Card, Button, Badge, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const Leaderboard = ({ submissions, selectedRegion, onRegionChange }) => {
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);

  const regions = [
    { label: 'Alle', value: 'ALL' },
    { label: 'PAL', value: 'PAL' },
    { label: 'NTSC', value: 'NTSC' },
    { label: 'JP', value: 'JP' },
  ];

  const getPositionPoints = (position) => {
    const points = [10, 8, 6, 4, 2, 1];
    return points[position - 1] || 0;
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return theme.colors.text;
    }
  };

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return 'emoji-events';
      case 2:
        return 'emoji-events';
      case 3:
        return 'emoji-events';
      default:
        return 'person';
    }
  };

  const formatTime = (time) => {
    return time; // Already formatted in the data
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderLeaderboardItem = (item, index) => {
    const position = index + 1;
    const points = getPositionPoints(position);
    const positionColor = getPositionColor(position);

    return (
      <View
        key={item.id}
        style={[
          styles.leaderboardItem,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.surface },
          position <= 3 && { borderColor: positionColor, borderWidth: 2 },
        ]}
      >
        <View style={styles.positionContainer}>
          <MaterialIcons
            name={getPositionIcon(position)}
            size={24}
            color={positionColor}
          />
          <Text style={[styles.position, { color: positionColor }]}>
            #{position}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.userInfo}>
            <Text style={[styles.username, { color: theme.colors.text }]}>
              {item.username}
            </Text>
            <Badge style={[styles.regionBadge, { backgroundColor: theme.colors.primary }]}>
              {item.region}
            </Badge>
          </View>

          <Text style={[styles.timeText, { color: theme.colors.primary }]}>
            {formatTime(item.time)}
          </Text>

          {item.comment && (
            <Text style={[styles.comment, { color: theme.colors.text }]}>
              {item.comment}
            </Text>
          )}

          <View style={styles.metaInfo}>
            <Text style={[styles.timestamp, { color: theme.colors.text }]}>
              {formatTimestamp(item.timestamp)}
            </Text>
            {points > 0 && (
              <Badge style={styles.pointsBadge}>
                {points} Punkte
              </Badge>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => setSelectedImage(item.imageUri)}
        >
          <Image source={{ uri: item.imageUri }} style={styles.thumbnailImage} />
          <MaterialIcons
            name="zoom-in"
            size={16}
            color="#FFFFFF"
            style={styles.zoomIcon}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="leaderboard" size={24} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Leaderboard
          </Text>
        </View>

        <View style={styles.regionTabs}>
          {regions.map((region) => (
            <Button
              key={region.value}
              mode={selectedRegion === region.value ? 'contained' : 'outlined'}
              onPress={() => onRegionChange(region.value)}
              style={[
                styles.regionTab,
                selectedRegion === region.value && styles.activeTab,
              ]}
              compact
            >
              {region.label}
            </Button>
          ))}
        </View>

        <View style={styles.leaderboardList}>
          {submissions.length > 0 ? (
            submissions.map((item, index) => renderLeaderboardItem(item, index))
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons
                name="emoji-events"
                size={48}
                color={theme.colors.text}
                style={styles.emptyIcon}
              />
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                Noch keine Zeiten eingereicht
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.text }]}>
                Sei der Erste!
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Image Modal */}
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setSelectedImage(null)}
          >
            <Image source={{ uri: selectedImage }} style={styles.fullImage} />
          </TouchableOpacity>
        </View>
      </Modal>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  regionTabs: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  regionTab: {
    marginRight: 8,
    marginBottom: 8,
  },
  activeTab: {
    // Additional styling for active tab handled by Paper's contained mode
  },
  leaderboardList: {
    gap: 12,
  },
  leaderboardItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  positionContainer: {
    alignItems: 'center',
    marginRight: 12,
    minWidth: 40,
  },
  position: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  infoContainer: {
    flex: 1,
    marginRight: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  regionBadge: {
    fontSize: 12,
  },
  timeText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  comment: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 4,
    opacity: 0.8,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.6,
  },
  pointsBadge: {
    fontSize: 10,
    backgroundColor: '#4ECDC4',
  },
  imageContainer: {
    position: 'relative',
  },
  thumbnailImage: {
    width: 60,
    height: 40,
    borderRadius: 4,
  },
  zoomIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 2,
    padding: 2,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
});

export default Leaderboard;
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Card, Badge, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const EventHeader = ({ event, isActive, eventStatus }) => {
  const theme = useTheme();

  const getBadgeColor = () => {
    switch (eventStatus) {
      case 'live':
        return '#FF0000';
      case 'starting-soon':
        return '#FF6B35';
      case 'ended':
        return '#4ECDC4';
      default:
        return '#888888';
    }
  };

  const getBadgeText = () => {
    switch (eventStatus) {
      case 'live':
        return 'LIVE';
      case 'starting-soon':
        return 'BALD';
      case 'ended':
        return 'BEENDET';
      default:
        return 'WARTET';
    }
  };

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <LinearGradient
        colors={['#FF6B35', '#4ECDC4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.subtitle}>{event.description}</Text>
            <View style={styles.badgeContainer}>
              <Badge 
                style={[styles.badge, { backgroundColor: getBadgeColor() }]}
                size={20}
              >
                {getBadgeText()}
              </Badge>
              <Text style={styles.timeText}>
                {event.date} • {event.startTime} - {event.endTime}
              </Text>
            </View>
          </View>
          
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: event.image }} 
              style={styles.gameImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </LinearGradient>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    padding: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  badge: {
    marginRight: 8,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  gameImage: {
    width: '100%',
    height: '100%',
  },
});

export default EventHeader;
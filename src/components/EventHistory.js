import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { mockEventData } from '../utils/mockData';

const EventHistory = () => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
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

  const renderWinner = (winner, position) => {
    const positionColor = getPositionColor(position);
    
    return (
      <View key={position} style={styles.winnerItem}>
        <View style={styles.winnerPosition}>
          <MaterialIcons
            name={getPositionIcon(position)}
            size={20}
            color={positionColor}
          />
          <Text style={[styles.positionText, { color: positionColor }]}>
            {position}
          </Text>
        </View>
        
        <View style={styles.winnerInfo}>
          <Text style={[styles.winnerUsername, { color: theme.colors.text }]}>
            {winner.username}
          </Text>
          <Text style={[styles.winnerTime, { color: theme.colors.primary }]}>
            {winner.time}
          </Text>
        </View>
        
        <View style={[styles.regionBadge, { backgroundColor: theme.colors.accent }]}>
          <Text style={styles.regionText}>{winner.region}</Text>
        </View>
      </View>
    );
  };

  const renderEventItem = (event) => {
    return (
      <View key={event.id} style={[styles.eventItem, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.eventHeader}>
          <View style={styles.eventTitleContainer}>
            <Text style={[styles.eventTitle, { color: theme.colors.text }]}>
              {event.game}
            </Text>
            <Text style={[styles.eventTrack, { color: theme.colors.text }]}>
              {event.track}
            </Text>
          </View>
          <Text style={[styles.eventDate, { color: theme.colors.text }]}>
            {formatDate(event.date)}
          </Text>
        </View>
        
        <View style={styles.winnersContainer}>
          {event.winners.map((winner, index) => renderWinner(winner, index + 1))}
        </View>
      </View>
    );
  };

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <MaterialIcons name="history" size={24} color={theme.colors.primary} />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Event-Verlauf
        </Text>
        <MaterialIcons
          name={isExpanded ? 'expand-less' : 'expand-more'}
          size={24}
          color={theme.colors.text}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          {mockEventData.eventHistory.length > 0 ? (
            <View style={styles.historyList}>
              {mockEventData.eventHistory.map((event) => renderEventItem(event))}
            </View>
          ) : (
            <View style={styles.emptyHistory}>
              <MaterialIcons
                name="history"
                size={48}
                color={theme.colors.text}
                style={styles.emptyIcon}
              />
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                Noch keine vergangenen Events
              </Text>
            </View>
          )}
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  historyList: {
    gap: 16,
  },
  eventItem: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitleContainer: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  eventTrack: {
    fontSize: 14,
    opacity: 0.8,
  },
  eventDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  winnersContainer: {
    gap: 8,
  },
  winnerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  winnerPosition: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    minWidth: 40,
  },
  positionText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  winnerInfo: {
    flex: 1,
  },
  winnerUsername: {
    fontSize: 14,
    fontWeight: '600',
  },
  winnerTime: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  regionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  regionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyHistory: {
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
  },
});

export default EventHistory;
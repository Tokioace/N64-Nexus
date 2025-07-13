import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEvent } from '../context/EventContext';
import { Card, Title, Chip, Avatar, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import 'moment/locale/de';

moment.locale('de');

const LeaderboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { activeEvents, leaderboard, getEventLeaderboard, refreshEvents } = useEvent();
  
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeEvents.length > 0 && !selectedEvent) {
      setSelectedEvent(activeEvents[0].id);
    }
  }, [activeEvents]);

  useEffect(() => {
    if (selectedEvent) {
      loadLeaderboard();
    }
  }, [selectedEvent]);

  const loadLeaderboard = async () => {
    if (!selectedEvent) return;
    
    try {
      setIsLoading(true);
      await getEventLeaderboard(selectedEvent);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    await refreshEvents();
    if (selectedEvent) {
      await loadLeaderboard();
    }
  };

  const getEventName = (eventId: string) => {
    const event = activeEvents.find(e => e.id === eventId);
    return event?.name || 'Unbekanntes Event';
  };

  const formatDate = (date: Date) => {
    return moment(date).format('DD.MM.YYYY');
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {/* Event Selector */}
        <Card style={styles.selectorCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Event auswählen</Title>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {activeEvents.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  onPress={() => setSelectedEvent(event.id)}
                >
                  <Chip
                    style={[
                      styles.eventChip,
                      selectedEvent === event.id && styles.selectedEventChip
                    ]}
                    textStyle={[
                      styles.eventChipText,
                      selectedEvent === event.id && styles.selectedEventChipText
                    ]}
                  >
                    {event.name}
                  </Chip>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Card.Content>
        </Card>

        {/* Leaderboard */}
        {selectedEvent && (
          <Card style={styles.leaderboardCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>
                Rangliste - {getEventName(selectedEvent)}
              </Title>
              
              {leaderboard.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Noch keine Einreichungen</Text>
                  <Text style={styles.emptySubtext}>
                    Seien Sie der Erste, der eine Einreichung macht!
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Event' as never, { eventId: selectedEvent } as never)}
                    style={styles.joinButton}
                  >
                    Event beitreten
                  </Button>
                </View>
              ) : (
                leaderboard.map((entry, index) => (
                  <View key={entry.id} style={styles.leaderboardItem}>
                    <View style={styles.rankSection}>
                      <Text style={styles.rankIcon}>{getRankIcon(entry.rank)}</Text>
                      {entry.rank <= 3 && (
                        <View style={[styles.medalContainer, styles[`medal${entry.rank}`]]} />
                      )}
                    </View>
                    
                    <View style={styles.playerSection}>
                      <Avatar.Text 
                        size={40} 
                        label={entry.username.charAt(0).toUpperCase()}
                        style={styles.avatar}
                      />
                      <View style={styles.playerInfo}>
                        <Text style={styles.playerName}>{entry.username}</Text>
                        <Text style={styles.playerPlatform}>{entry.platform}</Text>
                        <Text style={styles.submissionDate}>
                          {formatDate(entry.submittedAt)}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.scoreSection}>
                      <Text style={styles.scoreText}>{entry.score}</Text>
                      <Text style={styles.timeText}>{entry.time}</Text>
                    </View>
                  </View>
                ))
              )}
            </Card.Content>
          </Card>
        )}

        {/* Stats */}
        {selectedEvent && leaderboard.length > 0 && (
          <Card style={styles.statsCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Statistiken</Title>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{leaderboard.length}</Text>
                  <Text style={styles.statLabel}>Teilnehmer</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {leaderboard[0]?.score || 0}
                  </Text>
                  <Text style={styles.statLabel}>Beste Punktzahl</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {leaderboard[0]?.time || '--:--'}
                  </Text>
                  <Text style={styles.statLabel}>Beste Zeit</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  selectorCard: {
    margin: 20,
    marginBottom: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 15,
  },
  eventChip: {
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  selectedEventChip: {
    backgroundColor: '#1a1a2e',
  },
  eventChipText: {
    color: '#1a1a2e',
  },
  selectedEventChipText: {
    color: '#fff',
  },
  leaderboardCard: {
    margin: 20,
    marginTop: 10,
    elevation: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  joinButton: {
    backgroundColor: '#1a1a2e',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rankSection: {
    width: 60,
    alignItems: 'center',
    position: 'relative',
  },
  rankIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  medalContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  medal1: {
    backgroundColor: '#ffd700',
  },
  medal2: {
    backgroundColor: '#c0c0c0',
  },
  medal3: {
    backgroundColor: '#cd7f32',
  },
  playerSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  avatar: {
    backgroundColor: '#1a1a2e',
  },
  playerInfo: {
    marginLeft: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  playerPlatform: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  submissionDate: {
    fontSize: 10,
    color: '#999',
  },
  scoreSection: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  statsCard: {
    margin: 20,
    marginTop: 10,
    elevation: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});

export default LeaderboardScreen;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useEvent } from '../context/EventContext';
import { Button, Card, Title, Paragraph, Chip, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import 'moment/locale/de';

moment.locale('de');

const EventScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { activeEvents, joinEvent, leaveEvent, getEventLeaderboard } = useEvent();
  
  const [event, setEvent] = useState<any>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    const eventId = (route.params as any)?.eventId;
    if (eventId) {
      const foundEvent = activeEvents.find(e => e.id === eventId);
      if (foundEvent) {
        setEvent(foundEvent);
        loadLeaderboard(eventId);
      }
    }
  }, [route.params, activeEvents]);

  const loadLeaderboard = async (eventId: string) => {
    try {
      const leaderboardData = await getEventLeaderboard(eventId);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const handleJoinEvent = async () => {
    if (!user) {
      Alert.alert('Fehler', 'Bitte melden Sie sich zuerst an.');
      return;
    }

    try {
      const success = await joinEvent(event.id);
      if (success) {
        setIsJoined(true);
        Alert.alert('Erfolgreich beigetreten', `Sie sind jetzt Teilnehmer von "${event.name}"`);
      } else {
        Alert.alert('Fehler', 'Event ist voll oder nicht verfügbar.');
      }
    } catch (error) {
      Alert.alert('Fehler', 'Fehler beim Beitreten zum Event.');
    }
  };

  const handleLeaveEvent = async () => {
    try {
      const success = await leaveEvent(event.id);
      if (success) {
        setIsJoined(false);
        Alert.alert('Event verlassen', `Sie haben "${event.name}" verlassen`);
      }
    } catch (error) {
      Alert.alert('Fehler', 'Fehler beim Verlassen des Events.');
    }
  };

  const handleTakeScreenshot = () => {
    navigation.navigate('Camera' as never, { eventId: event.id } as never);
  };

  const handleRecordVideo = () => {
    navigation.navigate('Video' as never, { eventId: event.id } as never);
  };

  const formatDate = (date: Date) => {
    return moment(date).format('DD.MM.YYYY HH:mm');
  };

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Event nicht gefunden</Text>
          <Button mode="contained" onPress={() => navigation.goBack()}>
            Zurück
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Event Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Title style={styles.eventTitle}>{event.name}</Title>
            <Paragraph style={styles.eventDescription}>
              {event.description}
            </Paragraph>
            
            <View style={styles.eventMeta}>
              <Chip style={styles.gameChip}>{event.game}</Chip>
              <Chip style={styles.categoryChip}>{event.category}</Chip>
            </View>

            <View style={styles.eventStats}>
              <Text style={styles.statText}>
                📅 {formatDate(event.startDate)} - {formatDate(event.endDate)}
              </Text>
              <Text style={styles.statText}>
                👥 {event.currentParticipants}/{event.maxParticipants || '∞'} Teilnehmer
              </Text>
              <Text style={styles.statText}>
                {event.isActive ? '🟢 Aktiv' : '🔴 Inaktiv'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Event Rules */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Regeln</Title>
            {event.rules.map((rule: string, index: number) => (
              <View key={index} style={styles.ruleItem}>
                <Text style={styles.ruleNumber}>{index + 1}.</Text>
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Prizes */}
        {event.prizes && event.prizes.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Preise</Title>
              {event.prizes.map((prize: string, index: number) => (
                <Text key={index} style={styles.prizeText}>
                  🏆 {prize}
                </Text>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {user ? (
            <>
              <Button
                mode="contained"
                onPress={isJoined ? handleLeaveEvent : handleJoinEvent}
                style={[styles.actionButton, isJoined && styles.leaveButton]}
                contentStyle={styles.actionButtonContent}
              >
                {isJoined ? 'Event verlassen' : 'Event beitreten'}
              </Button>

              {isJoined && (
                <View style={styles.mediaButtons}>
                  <Button
                    mode="outlined"
                    onPress={handleTakeScreenshot}
                    style={styles.mediaButton}
                    icon="camera"
                  >
                    Screenshot
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={handleRecordVideo}
                    style={styles.mediaButton}
                    icon="video"
                  >
                    Video
                  </Button>
                </View>
              )}
            </>
          ) : (
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Settings' as never)}
              style={styles.actionButton}
            >
              Anmelden um beizutreten
            </Button>
          )}
        </View>

        {/* Leaderboard */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Rangliste</Title>
            {leaderboard.length === 0 ? (
              <Text style={styles.emptyText}>Noch keine Einreichungen</Text>
            ) : (
              leaderboard.slice(0, 10).map((entry, index) => (
                <View key={entry.id} style={styles.leaderboardItem}>
                  <View style={styles.rankContainer}>
                    <Text style={styles.rankText}>#{entry.rank}</Text>
                  </View>
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{entry.username}</Text>
                    <Text style={styles.playerPlatform}>{entry.platform}</Text>
                  </View>
                  <View style={styles.scoreInfo}>
                    <Text style={styles.scoreText}>{entry.score}</Text>
                    <Text style={styles.timeText}>{entry.time}</Text>
                  </View>
                </View>
              ))
            )}
          </Card.Content>
        </Card>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  headerCard: {
    margin: 20,
    marginBottom: 10,
    elevation: 4,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  eventMeta: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  gameChip: {
    marginRight: 10,
    backgroundColor: '#e3f2fd',
  },
  categoryChip: {
    backgroundColor: '#f3e5f5',
  },
  eventStats: {
    marginTop: 10,
  },
  statText: {
    fontSize: 14,
    color: '#1a1a2e',
    marginBottom: 5,
  },
  card: {
    margin: 20,
    marginTop: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 15,
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  ruleNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginRight: 10,
    minWidth: 20,
  },
  ruleText: {
    fontSize: 16,
    color: '#1a1a2e',
    flex: 1,
    lineHeight: 22,
  },
  prizeText: {
    fontSize: 16,
    color: '#1a1a2e',
    marginBottom: 8,
  },
  actionContainer: {
    padding: 20,
    paddingTop: 10,
  },
  actionButton: {
    backgroundColor: '#1a1a2e',
    marginBottom: 15,
  },
  leaveButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediaButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  playerPlatform: {
    fontSize: 12,
    color: '#666',
  },
  scoreInfo: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
});

export default EventScreen;
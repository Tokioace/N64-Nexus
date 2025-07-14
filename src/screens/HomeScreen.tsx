import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useEvent } from '../context/EventContext';
import { Card, Title, Paragraph, Button, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { activeEvents, isLoading, refreshEvents } = useEvent();

  const handleEventPress = (eventId: string) => {
    navigation.navigate('Event' as never, { eventId } as never);
  };

  const handleCameraPress = () => {
    navigation.navigate('Camera' as never);
  };

  const handleVideoPress = () => {
    navigation.navigate('Video' as never);
  };

  const handleLeaderboardPress = () => {
    navigation.navigate('Leaderboard' as never);
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings' as never);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authContainer}>
          <Text style={styles.title}>Battle64</Text>
          <Text style={styles.subtitle}>Screenshot-/Video-Nachweis über die App</Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Settings' as never)}
            style={styles.authButton}
          >
            Anmelden
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshEvents} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Avatar.Text size={40} label={user.username.charAt(0).toUpperCase()} />
            <View style={styles.userDetails}>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.platform}>{user.platform}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleSettingsPress}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCameraPress}>
            <Text style={styles.actionIcon}>📷</Text>
            <Text style={styles.actionText}>Screenshot</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleVideoPress}>
            <Text style={styles.actionIcon}>🎥</Text>
            <Text style={styles.actionText}>Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleLeaderboardPress}>
            <Text style={styles.actionIcon}>🏆</Text>
            <Text style={styles.actionText}>Rangliste</Text>
          </TouchableOpacity>
        </View>

        {/* Active Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aktive Events</Text>
          {activeEvents.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>Keine aktiven Events verfügbar</Text>
              </Card.Content>
            </Card>
          ) : (
            activeEvents.map((event) => (
              <Card
                key={event.id}
                style={styles.eventCard}
                onPress={() => handleEventPress(event.id)}
              >
                <Card.Content>
                  <Title style={styles.eventTitle}>{event.name}</Title>
                  <Paragraph style={styles.eventDescription}>
                    {event.description}
                  </Paragraph>
                  <View style={styles.eventMeta}>
                    <Text style={styles.eventGame}>{event.game}</Text>
                    <Text style={styles.eventCategory}>{event.category}</Text>
                  </View>
                  <View style={styles.eventStats}>
                    <Text style={styles.eventParticipants}>
                      {event.currentParticipants}/{event.maxParticipants || '∞'} Teilnehmer
                    </Text>
                    <Text style={styles.eventStatus}>
                      {event.isActive ? '🟢 Aktiv' : '🔴 Inaktiv'}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Über Battle64</Text>
          <Card style={styles.infoCard}>
            <Card.Content>
              <Text style={styles.infoText}>
                Battle64 sorgt für faire Bedingungen bei Events durch rechtssichere 
                Screenshot- und Video-Nachweise direkt über die App.
              </Text>
              <Text style={styles.infoFeatures}>
                ✓ Live-Screenshot mit Zeitstempel{'\n'}
                ✓ Videoaufnahme (max. 60 Sek.){'\n'}
                ✓ Automatische Wasserzeichen{'\n'}
                ✓ DSGVO-konform
              </Text>
            </Card.Content>
          </Card>
        </View>
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
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  authButton: {
    marginTop: 20,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 12,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  platform: {
    fontSize: 14,
    color: '#666',
  },
  settingsIcon: {
    fontSize: 24,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    minWidth: 80,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 15,
  },
  eventCard: {
    marginBottom: 15,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  eventMeta: {
    flexDirection: 'row',
    marginTop: 10,
  },
  eventGame: {
    fontSize: 12,
    color: '#1a1a2e',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  eventCategory: {
    fontSize: 12,
    color: '#1a1a2e',
    backgroundColor: '#f3e5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  eventParticipants: {
    fontSize: 12,
    color: '#666',
  },
  eventStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#f8f9fa',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  infoCard: {
    backgroundColor: '#e8f5e8',
  },
  infoText: {
    fontSize: 14,
    color: '#1a1a2e',
    lineHeight: 20,
  },
  infoFeatures: {
    fontSize: 14,
    color: '#2e7d32',
    marginTop: 10,
    lineHeight: 20,
  },
});

export default HomeScreen;
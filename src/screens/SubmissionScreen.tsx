import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useMedia } from '../context/MediaContext';
import { useEvent } from '../context/EventContext';
import { Button, Card, Title, Paragraph, TextInput, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video } from 'expo-av';
import { MediaSubmission } from '../types';
import moment from 'moment';
import 'moment/locale/de';

moment.locale('de');

const SubmissionScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { submitMedia } = useMedia();
  const { activeEvents } = useEvent();
  
  const [submission, setSubmission] = useState<MediaSubmission | null>(null);
  const [notes, setNotes] = useState('');
  const [score, setScore] = useState('');
  const [time, setTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const submissionData = (route.params as any)?.submission;
    if (submissionData) {
      setSubmission(submissionData);
    }
  }, [route.params]);

  const handleSubmit = async () => {
    if (!submission || !user) {
      Alert.alert('Fehler', 'Keine Einreichung verfügbar.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Update submission with additional data
      const updatedSubmission = {
        ...submission,
        notes: notes || undefined,
        score: score ? parseInt(score) : undefined,
        time: time || undefined,
      };

      const success = await submitMedia(updatedSubmission);

      if (success) {
        Alert.alert(
          'Erfolgreich eingereicht',
          'Ihre Einreichung wurde erfolgreich übermittelt und wird überprüft.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home' as never),
            },
          ]
        );
      } else {
        Alert.alert('Fehler', 'Einreichung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    } catch (error) {
      console.error('Error submitting:', error);
      Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEventName = (eventId: string) => {
    const event = activeEvents.find(e => e.id === eventId);
    return event?.name || 'Unbekanntes Event';
  };

  const formatTimestamp = (timestamp: Date) => {
    return moment(timestamp).format('DD.MM.YYYY HH:mm:ss');
  };

  if (!submission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Keine Einreichung gefunden</Text>
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
        <Card style={styles.mainCard}>
          <Card.Content>
            <Title style={styles.title}>Einreichung überprüfen</Title>
            
            {/* Media Preview */}
            <View style={styles.mediaContainer}>
              {submission.type === 'screenshot' ? (
                <Image source={{ uri: submission.fileUri }} style={styles.mediaPreview} />
              ) : (
                <Video
                  source={{ uri: submission.fileUri }}
                  style={styles.mediaPreview}
                  useNativeControls
                  resizeMode="contain"
                />
              )}
            </View>

            {/* Event Info */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Event Information</Text>
              <Chip style={styles.chip}>
                {getEventName(submission.eventId)}
              </Chip>
              <Chip style={styles.chip}>
                {submission.type === 'screenshot' ? '📷 Screenshot' : '🎥 Video'}
              </Chip>
              <Chip style={styles.chip}>
                {submission.metadata.platform}
              </Chip>
            </View>

            {/* Timestamp */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Zeitstempel</Text>
              <Text style={styles.timestampText}>
                {formatTimestamp(submission.timestamp)}
              </Text>
            </View>

            {/* Watermark Info */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Wasserzeichen</Text>
              <Text style={styles.watermarkText}>
                {submission.watermark.text}
              </Text>
              <Text style={styles.watermarkPosition}>
                Position: {submission.watermark.position}
              </Text>
            </View>

            {/* Device Info */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Geräteinformationen</Text>
              <Text style={styles.deviceText}>{submission.metadata.deviceInfo}</Text>
              {submission.metadata.location && (
                <Text style={styles.locationText}>
                  📍 Standort: {submission.metadata.location.latitude.toFixed(4)}, {submission.metadata.location.longitude.toFixed(4)}
                </Text>
              )}
            </View>

            {/* Hash */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Sicherheits-Hash</Text>
              <Text style={styles.hashText} numberOfLines={2}>
                {submission.metadata.hash}
              </Text>
            </View>

            {/* Additional Data Input */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Zusätzliche Informationen</Text>
              
              <TextInput
                label="Score (optional)"
                value={score}
                onChangeText={setScore}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
              />
              
              <TextInput
                label="Zeit (optional, z.B. 1:23:45)"
                value={time}
                onChangeText={setTime}
                style={styles.input}
                mode="outlined"
                placeholder="MM:SS oder HH:MM:SS"
              />
              
              <TextInput
                label="Notizen (optional)"
                value={notes}
                onChangeText={setNotes}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={3}
                placeholder="Zusätzliche Informationen zu Ihrem Run..."
              />
            </View>

            {/* Submission Status */}
            <View style={styles.statusSection}>
              <Text style={styles.sectionTitle}>Status</Text>
              <Chip 
                style={[
                  styles.statusChip,
                  submission.status === 'pending' && styles.pendingChip,
                  submission.status === 'approved' && styles.approvedChip,
                  submission.status === 'rejected' && styles.rejectedChip,
                ]}
              >
                {submission.status === 'pending' && '⏳ Ausstehend'}
                {submission.status === 'approved' && '✅ Genehmigt'}
                {submission.status === 'rejected' && '❌ Abgelehnt'}
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            {isSubmitting ? 'Wird eingereicht...' : 'Einreichung bestätigen'}
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
            style={styles.cancelButton}
          >
            Abbrechen
          </Button>
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
  mainCard: {
    margin: 20,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 20,
    textAlign: 'center',
  },
  mediaContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mediaPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 10,
  },
  chip: {
    marginBottom: 5,
    backgroundColor: '#e3f2fd',
  },
  timestampText: {
    fontSize: 16,
    color: '#1a1a2e',
    fontWeight: '600',
  },
  watermarkText: {
    fontSize: 14,
    color: '#1a1a2e',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  watermarkPosition: {
    fontSize: 12,
    color: '#666',
  },
  deviceText: {
    fontSize: 14,
    color: '#1a1a2e',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#1a1a2e',
  },
  hashText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
  },
  inputSection: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  statusSection: {
    marginBottom: 20,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  pendingChip: {
    backgroundColor: '#fff3cd',
  },
  approvedChip: {
    backgroundColor: '#d4edda',
  },
  rejectedChip: {
    backgroundColor: '#f8d7da',
  },
  submitContainer: {
    padding: 20,
    paddingTop: 0,
  },
  submitButton: {
    marginBottom: 15,
    backgroundColor: '#1a1a2e',
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  cancelButton: {
    borderColor: '#1a1a2e',
  },
});

export default SubmissionScreen;
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import { Video } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useMedia } from '../context/MediaContext';
import { useEvent } from '../context/EventContext';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as MediaLibrary from 'expo-media-library';

const { width: screenWidth } = Dimensions.get('window');

const VideoScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { createSubmission, videoSettings } = useMedia();
  const { activeEvents } = useEvent();
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [flash, setFlash] = useState(FlashMode.off);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [maxRecordingTime] = useState(videoSettings.maxDuration);
  
  const cameraRef = useRef<Camera>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted' && mediaStatus.status === 'granted');
    })();
  }, []);

  useEffect(() => {
    // Get eventId from route params if available
    const eventId = (route.params as any)?.eventId;
    if (eventId) {
      setSelectedEvent(eventId);
    }
  }, [route.params]);

  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= maxRecordingTime) {
            stopRecording();
            return maxRecordingTime;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording, maxRecordingTime]);

  const startRecording = async () => {
    if (!cameraRef.current || !user || !selectedEvent) {
      Alert.alert('Fehler', 'Bitte wählen Sie zuerst ein Event aus.');
      return;
    }

    try {
      setIsRecording(true);
      setRecordingTime(0);
      
      const video = await cameraRef.current.recordAsync({
        quality: videoSettings.quality === 'high' ? '720p' : videoSettings.quality === 'medium' ? '480p' : '360p',
        maxDuration: maxRecordingTime,
        mute: !videoSettings.audio,
      });

      setRecordedVideo(video.uri);
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Fehler', 'Fehler beim Aufnehmen des Videos.');
    } finally {
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      try {
        await cameraRef.current.stopRecording();
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
  };

  const retakeVideo = () => {
    setRecordedVideo(null);
    setRecordingTime(0);
  };

  const submitVideo = async () => {
    if (!recordedVideo || !user || !selectedEvent) {
      Alert.alert('Fehler', 'Kein Video oder Event ausgewählt.');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Create submission with metadata
      const submission = await createSubmission(
        'video',
        recordedVideo,
        selectedEvent,
        user.id,
        user.platform
      );

      // Navigate to submission screen
      navigation.navigate('Submission' as never, { submission } as never);
    } catch (error) {
      console.error('Error submitting video:', error);
      Alert.alert('Fehler', 'Fehler beim Einreichen des Videos.');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleCameraType = () => {
    setCameraType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  const toggleFlash = () => {
    setFlash(current => (current === FlashMode.off ? FlashMode.on : FlashMode.off));
  };

  const selectEvent = () => {
    if (activeEvents.length === 0) {
      Alert.alert('Keine Events', 'Keine aktiven Events verfügbar.');
      return;
    }

    const eventOptions = activeEvents.map(event => ({
      text: event.name,
      onPress: () => setSelectedEvent(event.id),
    }));

    Alert.alert(
      'Event auswählen',
      'Wählen Sie ein Event für Ihr Video:',
      eventOptions
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1a1a2e" />
          <Text style={styles.loadingText}>Kamera wird geladen...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Kein Zugriff auf die Kamera</Text>
          <Text style={styles.errorSubtext}>
            Bitte erlauben Sie den Zugriff auf die Kamera in den Einstellungen.
          </Text>
          <Button mode="contained" onPress={() => navigation.goBack()}>
            Zurück
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  if (recordedVideo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewContainer}>
          <Video
            source={{ uri: recordedVideo }}
            style={styles.previewVideo}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
          
          <View style={styles.previewControls}>
            <Button mode="outlined" onPress={retakeVideo} style={styles.previewButton}>
              Erneut aufnehmen
            </Button>
            <Button mode="contained" onPress={submitVideo} style={styles.previewButton}>
              Einreichen
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={cameraType}
          flashMode={flash}
          ratio="16:9"
        >
          <View style={styles.cameraOverlay}>
            {/* Event Selection */}
            <View style={styles.eventSelector}>
              <TouchableOpacity style={styles.eventButton} onPress={selectEvent}>
                <Text style={styles.eventButtonText}>
                  {selectedEvent 
                    ? activeEvents.find(e => e.id === selectedEvent)?.name || 'Event auswählen'
                    : 'Event auswählen'
                  }
                </Text>
              </TouchableOpacity>
            </View>

            {/* Recording Timer */}
            {isRecording && (
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>
                  {formatTime(recordingTime)} / {formatTime(maxRecordingTime)}
                </Text>
                <View style={styles.recordingIndicator}>
                  <View style={styles.recordingDot} />
                  <Text style={styles.recordingText}>Aufnahme läuft</Text>
                </View>
              </View>
            )}

            {/* Camera Controls */}
            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
                <Text style={styles.controlIcon}>
                  {flash === FlashMode.on ? '⚡' : '⚡'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.recordButton, isRecording && styles.recordingButton]} 
                onPress={isRecording ? stopRecording : startRecording}
                disabled={isProcessing || !selectedEvent}
              >
                {isProcessing ? (
                  <ActivityIndicator size="large" color="#fff" />
                ) : (
                  <View style={styles.recordButtonInner} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButton} onPress={toggleCameraType}>
                <Text style={styles.controlIcon}>🔄</Text>
              </TouchableOpacity>
            </View>

            {/* Info Text */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                🎥 Videoaufnahme (max. {maxRecordingTime} Sek.)
              </Text>
              <Text style={styles.infoSubtext}>
                Mit automatischem Zeitstempel und Wasserzeichen
              </Text>
            </View>
          </View>
        </Camera>
      </View>

      {/* Settings Info */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title style={styles.settingsTitle}>Video-Einstellungen</Title>
          <Paragraph style={styles.settingsText}>
            Qualität: {videoSettings.quality === 'high' ? 'Hoch' : videoSettings.quality === 'medium' ? 'Mittel' : 'Niedrig'}
          </Paragraph>
          <Paragraph style={styles.settingsText}>
            Audio: {videoSettings.audio ? 'An' : 'Aus'}
          </Paragraph>
          <Paragraph style={styles.settingsText}>
            Stabilisierung: {videoSettings.stabilization ? 'An' : 'Aus'}
          </Paragraph>
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  eventSelector: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  eventButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  eventButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timerContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 10,
  },
  timerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 5,
  },
  recordingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    fontSize: 24,
    color: '#fff',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  recordingButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    borderColor: '#ff0000',
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 150,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  infoSubtext: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewVideo: {
    flex: 1,
    width: screenWidth,
  },
  previewControls: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  previewButton: {
    flex: 1,
    marginHorizontal: 10,
  },
  settingsCard: {
    margin: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsText: {
    fontSize: 14,
    color: '#666',
  },
});

export default VideoScreen;
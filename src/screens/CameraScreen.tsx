import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useMedia } from '../context/MediaContext';
import { useEvent } from '../context/EventContext';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as MediaLibrary from 'expo-media-library';

const CameraScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { createSubmission, cameraSettings } = useMedia();
  const { activeEvents } = useEvent();
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [flash, setFlash] = useState(FlashMode.off);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  
  const cameraRef = useRef<Camera>(null);

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

  const takePicture = async () => {
    if (!cameraRef.current || !user || !selectedEvent) {
      Alert.alert('Fehler', 'Bitte wählen Sie zuerst ein Event aus.');
      return;
    }

    try {
      setIsProcessing(true);
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: cameraSettings.quality === 'high' ? 1 : cameraSettings.quality === 'medium' ? 0.7 : 0.5,
        base64: false,
        exif: true,
      });

      setCapturedImage(photo.uri);
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Fehler', 'Fehler beim Aufnehmen des Fotos.');
    } finally {
      setIsProcessing(false);
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
  };

  const submitPicture = async () => {
    if (!capturedImage || !user || !selectedEvent) {
      Alert.alert('Fehler', 'Kein Foto oder Event ausgewählt.');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Create submission with metadata
      const submission = await createSubmission(
        'screenshot',
        capturedImage,
        selectedEvent,
        user.id,
        user.platform
      );

      // Navigate to submission screen
      navigation.navigate('Submission' as never, { submission } as never);
    } catch (error) {
      console.error('Error submitting picture:', error);
      Alert.alert('Fehler', 'Fehler beim Einreichen des Fotos.');
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
      'Wählen Sie ein Event für Ihren Screenshot:',
      eventOptions
    );
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

  if (capturedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          
          <View style={styles.previewControls}>
            <Button mode="outlined" onPress={retakePicture} style={styles.previewButton}>
              Erneut aufnehmen
            </Button>
            <Button mode="contained" onPress={submitPicture} style={styles.previewButton}>
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

            {/* Camera Controls */}
            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
                <Text style={styles.controlIcon}>
                  {flash === FlashMode.on ? '⚡' : '⚡'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.captureButton} 
                onPress={takePicture}
                disabled={isProcessing || !selectedEvent}
              >
                {isProcessing ? (
                  <ActivityIndicator size="large" color="#fff" />
                ) : (
                  <View style={styles.captureButtonInner} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButton} onPress={toggleCameraType}>
                <Text style={styles.controlIcon}>🔄</Text>
              </TouchableOpacity>
            </View>

            {/* Info Text */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                📷 Screenshot mit automatischem Zeitstempel und Wasserzeichen
              </Text>
              <Text style={styles.infoSubtext}>
                Nur während aktiver Events möglich
              </Text>
            </View>
          </View>
        </Camera>
      </View>

      {/* Settings Info */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title style={styles.settingsTitle}>Kamera-Einstellungen</Title>
          <Paragraph style={styles.settingsText}>
            Qualität: {cameraSettings.quality === 'high' ? 'Hoch' : cameraSettings.quality === 'medium' ? 'Mittel' : 'Niedrig'}
          </Paragraph>
          <Paragraph style={styles.settingsText}>
            Blitz: {flash === FlashMode.on ? 'An' : 'Aus'}
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
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonInner: {
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
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
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

export default CameraScreen;
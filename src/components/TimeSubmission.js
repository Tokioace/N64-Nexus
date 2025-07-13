import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { Card, Button, TextInput, Menu, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const TimeSubmission = ({ onSubmit, currentGame }) => {
  const theme = useTheme();
  const [time, setTime] = useState('');
  const [comment, setComment] = useState('');
  const [region, setRegion] = useState('PAL');
  const [imageUri, setImageUri] = useState(null);
  const [regionMenuVisible, setRegionMenuVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const regions = [
    { label: 'PAL', value: 'PAL' },
    { label: 'NTSC', value: 'NTSC' },
    { label: 'JP', value: 'JP' },
  ];

  const validateTime = (timeString) => {
    // Simple validation for time format (mm:ss.ff or h:mm:ss.ff)
    const timeRegex = /^(\d{1,2}:)?[0-5]?\d:[0-5]\d\.\d{2}$/;
    return timeRegex.test(timeString);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Berechtigung erforderlich', 'Bitte erlaube Zugriff auf deine Fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Berechtigung erforderlich', 'Bitte erlaube Zugriff auf deine Kamera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!time.trim()) {
      Alert.alert('Fehler', 'Bitte gib eine Zeit ein.');
      return;
    }

    if (!validateTime(time)) {
      Alert.alert('Fehler', 'Ungültiges Zeitformat. Nutze mm:ss.ff oder h:mm:ss.ff');
      return;
    }

    if (!imageUri) {
      Alert.alert('Fehler', 'Bitte lade einen Screenshot als Beweis hoch.');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        time: time.trim(),
        region,
        comment: comment.trim(),
        imageUri,
      });

      // Reset form
      setTime('');
      setComment('');
      setImageUri(null);
      setRegion('PAL');
    } catch (error) {
      Alert.alert('Fehler', 'Fehler beim Einreichen der Zeit. Versuche es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Beweis hinzufügen',
      'Wähle eine Option:',
      [
        { text: 'Kamera', onPress: takePhoto },
        { text: 'Galerie', onPress: pickImage },
        { text: 'Abbrechen', style: 'cancel' },
      ]
    );
  };

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="timer" size={24} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Zeit einreichen
          </Text>
        </View>

        <Text style={[styles.gameText, { color: theme.colors.text }]}>
          {currentGame}
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            label="Zeit (z.B. 0:58.43)"
            value={time}
            onChangeText={setTime}
            mode="outlined"
            style={styles.input}
            placeholder="mm:ss.ff oder h:mm:ss.ff"
          />

          <Menu
            visible={regionMenuVisible}
            onDismiss={() => setRegionMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setRegionMenuVisible(true)}
                style={styles.regionButton}
              >
                Region: {region}
              </Button>
            }
          >
            {regions.map((item) => (
              <Menu.Item
                key={item.value}
                onPress={() => {
                  setRegion(item.value);
                  setRegionMenuVisible(false);
                }}
                title={item.label}
              />
            ))}
          </Menu>
        </View>

        <TextInput
          label="Kommentar (optional)"
          value={comment}
          onChangeText={setComment}
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={2}
          placeholder="Beschreibe deinen Lauf..."
        />

        <View style={styles.imageSection}>
          <TouchableOpacity
            style={[styles.imagePicker, { borderColor: theme.colors.primary }]}
            onPress={showImagePicker}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePickerContent}>
                <MaterialIcons
                  name="add-photo-alternate"
                  size={32}
                  color={theme.colors.primary}
                />
                <Text style={[styles.imagePickerText, { color: theme.colors.primary }]}>
                  Screenshot hinzufügen
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.submitButton}
        >
          Zeit einreichen
        </Button>
      </View>
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
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  gameText: {
    fontSize: 16,
    marginBottom: 16,
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginBottom: 12,
  },
  regionButton: {
    marginLeft: 8,
    marginBottom: 12,
  },
  imageSection: {
    marginBottom: 16,
  },
  imagePicker: {
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  imagePickerContent: {
    alignItems: 'center',
  },
  imagePickerText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  submitButton: {
    marginTop: 8,
  },
});

export default TimeSubmission;
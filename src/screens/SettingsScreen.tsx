import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useMedia } from '../context/MediaContext';
import { Button, Card, Title, TextInput, Switch as PaperSwitch, Divider, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppSettings } from '../types';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, login, logout, register, hasAcceptedTerms, acceptTerms } = useAuth();
  const { cameraSettings, videoSettings, updateCameraSettings, updateVideoSettings } = useMedia();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [platform, setPlatform] = useState<'PAL' | 'NTSC'>('PAL');
  const [isLoading, setIsLoading] = useState(false);
  
  const [settings, setSettings] = useState<AppSettings>({
    notifications: true,
    autoSave: true,
    dataUsage: 'medium',
    language: 'de',
    theme: 'auto',
    privacyMode: false,
  });

  const handleAuth = async () => {
    if (!email || !password || (!isLoginMode && !username)) {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Felder aus.');
      return;
    }

    try {
      setIsLoading(true);
      let success = false;

      if (isLoginMode) {
        success = await login(email, password);
      } else {
        success = await register(username, email, password, platform);
      }

      if (success) {
        Alert.alert(
          'Erfolgreich',
          isLoginMode ? 'Anmeldung erfolgreich!' : 'Registrierung erfolgreich!'
        );
        navigation.navigate('Home' as never);
      } else {
        Alert.alert('Fehler', 'Anmeldung/Registrierung fehlgeschlagen.');
      }
    } catch (error) {
      Alert.alert('Fehler', 'Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Abmelden',
      'Möchten Sie sich wirklich abmelden?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Abmelden',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.navigate('Home' as never);
          },
        },
      ]
    );
  };

  const handleAcceptTerms = async () => {
    await acceptTerms();
    Alert.alert('Erfolgreich', 'Nutzungsbedingungen akzeptiert.');
  };

  const updateSetting = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Authentication Section */}
        {!user ? (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>
                {isLoginMode ? 'Anmelden' : 'Registrieren'}
              </Title>
              
              {!isLoginMode && (
                <TextInput
                  label="Benutzername"
                  value={username}
                  onChangeText={setUsername}
                  style={styles.input}
                  mode="outlined"
                />
              )}
              
              <TextInput
                label="E-Mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                mode="outlined"
              />
              
              <TextInput
                label="Passwort"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                mode="outlined"
              />
              
              {!isLoginMode && (
                <View style={styles.platformContainer}>
                  <Text style={styles.platformLabel}>Plattform:</Text>
                  <View style={styles.platformButtons}>
                    <Button
                      mode={platform === 'PAL' ? 'contained' : 'outlined'}
                      onPress={() => setPlatform('PAL')}
                      style={styles.platformButton}
                    >
                      PAL
                    </Button>
                    <Button
                      mode={platform === 'NTSC' ? 'contained' : 'outlined'}
                      onPress={() => setPlatform('NTSC')}
                      style={styles.platformButton}
                    >
                      NTSC
                    </Button>
                  </View>
                </View>
              )}
              
              <Button
                mode="contained"
                onPress={handleAuth}
                loading={isLoading}
                disabled={isLoading}
                style={styles.authButton}
              >
                {isLoginMode ? 'Anmelden' : 'Registrieren'}
              </Button>
              
              <Button
                mode="text"
                onPress={() => setIsLoginMode(!isLoginMode)}
                style={styles.switchButton}
              >
                {isLoginMode ? 'Neues Konto erstellen' : 'Bereits ein Konto? Anmelden'}
              </Button>
            </Card.Content>
          </Card>
        ) : (
          /* User Profile Section */
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Profil</Title>
              <Text style={styles.userInfo}>Benutzer: {user.username}</Text>
              <Text style={styles.userInfo}>E-Mail: {user.email}</Text>
              <Text style={styles.userInfo}>Plattform: {user.platform}</Text>
              <Text style={styles.userInfo}>
                Status: {user.isVerified ? '✅ Verifiziert' : '⏳ Nicht verifiziert'}
              </Text>
              
              <Button
                mode="outlined"
                onPress={handleLogout}
                style={styles.logoutButton}
              >
                Abmelden
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Terms and Conditions */}
        {!hasAcceptedTerms && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Nutzungsbedingungen</Title>
              <Text style={styles.termsText}>
                Um Battle64 zu nutzen, müssen Sie den Nutzungsbedingungen und der 
                Datenschutzerklärung zustimmen. Diese App sammelt und verarbeitet 
                Medien nur für Event-Zwecke und in Übereinstimmung mit der DSGVO.
              </Text>
              <Button
                mode="contained"
                onPress={handleAcceptTerms}
                style={styles.termsButton}
              >
                Nutzungsbedingungen akzeptieren
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Camera Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Kamera-Einstellungen</Title>
            
            <List.Item
              title="Bildqualität"
              description={cameraSettings.quality === 'high' ? 'Hoch' : cameraSettings.quality === 'medium' ? 'Mittel' : 'Niedrig'}
              right={() => (
                <View style={styles.qualityButtons}>
                  <Button
                    mode={cameraSettings.quality === 'low' ? 'contained' : 'outlined'}
                    onPress={() => updateCameraSettings({ quality: 'low' })}
                    compact
                  >
                    Niedrig
                  </Button>
                  <Button
                    mode={cameraSettings.quality === 'medium' ? 'contained' : 'outlined'}
                    onPress={() => updateCameraSettings({ quality: 'medium' })}
                    compact
                  >
                    Mittel
                  </Button>
                  <Button
                    mode={cameraSettings.quality === 'high' ? 'contained' : 'outlined'}
                    onPress={() => updateCameraSettings({ quality: 'high' })}
                    compact
                  >
                    Hoch
                  </Button>
                </View>
              )}
            />
            
            <List.Item
              title="Blitz"
              description={cameraSettings.flash === 'on' ? 'An' : cameraSettings.flash === 'auto' ? 'Automatisch' : 'Aus'}
              right={() => (
                <Switch
                  value={cameraSettings.flash === 'on'}
                  onValueChange={(value) => updateCameraSettings({ flash: value ? 'on' : 'off' })}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* Video Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Video-Einstellungen</Title>
            
            <List.Item
              title="Videoqualität"
              description={videoSettings.quality === 'high' ? 'Hoch' : videoSettings.quality === 'medium' ? 'Mittel' : 'Niedrig'}
              right={() => (
                <View style={styles.qualityButtons}>
                  <Button
                    mode={videoSettings.quality === 'low' ? 'contained' : 'outlined'}
                    onPress={() => updateVideoSettings({ quality: 'low' })}
                    compact
                  >
                    Niedrig
                  </Button>
                  <Button
                    mode={videoSettings.quality === 'medium' ? 'contained' : 'outlined'}
                    onPress={() => updateVideoSettings({ quality: 'medium' })}
                    compact
                  >
                    Mittel
                  </Button>
                  <Button
                    mode={videoSettings.quality === 'high' ? 'contained' : 'outlined'}
                    onPress={() => updateVideoSettings({ quality: 'high' })}
                    compact
                  >
                    Hoch
                  </Button>
                </View>
              )}
            />
            
            <List.Item
              title="Audio aufnehmen"
              description="Ton bei Videoaufnahmen"
              right={() => (
                <Switch
                  value={videoSettings.audio}
                  onValueChange={(value) => updateVideoSettings({ audio: value })}
                />
              )}
            />
            
            <List.Item
              title="Stabilisierung"
              description="Video-Stabilisierung aktivieren"
              right={() => (
                <Switch
                  value={videoSettings.stabilization}
                  onValueChange={(value) => updateVideoSettings({ stabilization: value })}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* App Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>App-Einstellungen</Title>
            
            <List.Item
              title="Benachrichtigungen"
              description="Push-Benachrichtigungen für Events"
              right={() => (
                <Switch
                  value={settings.notifications}
                  onValueChange={(value) => updateSetting('notifications', value)}
                />
              )}
            />
            
            <List.Item
              title="Auto-Save"
              description="Automatisches Speichern von Entwürfen"
              right={() => (
                <Switch
                  value={settings.autoSave}
                  onValueChange={(value) => updateSetting('autoSave', value)}
                />
              )}
            />
            
            <List.Item
              title="Datennutzung"
              description={settings.dataUsage === 'low' ? 'Niedrig' : settings.dataUsage === 'medium' ? 'Mittel' : 'Hoch'}
              right={() => (
                <View style={styles.qualityButtons}>
                  <Button
                    mode={settings.dataUsage === 'low' ? 'contained' : 'outlined'}
                    onPress={() => updateSetting('dataUsage', 'low')}
                    compact
                  >
                    Niedrig
                  </Button>
                  <Button
                    mode={settings.dataUsage === 'medium' ? 'contained' : 'outlined'}
                    onPress={() => updateSetting('dataUsage', 'medium')}
                    compact
                  >
                    Mittel
                  </Button>
                  <Button
                    mode={settings.dataUsage === 'high' ? 'contained' : 'outlined'}
                    onPress={() => updateSetting('dataUsage', 'high')}
                    compact
                  >
                    Hoch
                  </Button>
                </View>
              )}
            />
            
            <List.Item
              title="Privatsphäre-Modus"
              description="Erweiterte Datenschutz-Einstellungen"
              right={() => (
                <Switch
                  value={settings.privacyMode}
                  onValueChange={(value) => updateSetting('privacyMode', value)}
                />
              )}
            />
          </Card.Content>
        </Card>

        {/* About Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Über Battle64</Title>
            <Text style={styles.aboutText}>
              Battle64 ist eine App für faire Gaming-Events mit rechtssicheren 
              Screenshot- und Video-Nachweisen. Alle Medien werden direkt über 
              die App aufgenommen und mit automatischen Zeitstempeln und 
              Wasserzeichen versehen.
            </Text>
            <Text style={styles.versionText}>Version 1.0.0</Text>
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
  card: {
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
  input: {
    marginBottom: 15,
  },
  platformContainer: {
    marginBottom: 15,
  },
  platformLabel: {
    fontSize: 16,
    color: '#1a1a2e',
    marginBottom: 10,
  },
  platformButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  platformButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  authButton: {
    backgroundColor: '#1a1a2e',
    marginBottom: 10,
  },
  switchButton: {
    marginTop: 10,
  },
  userInfo: {
    fontSize: 16,
    color: '#1a1a2e',
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 15,
    borderColor: '#dc3545',
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  termsButton: {
    backgroundColor: '#28a745',
  },
  qualityButtons: {
    flexDirection: 'row',
    gap: 5,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default SettingsScreen;
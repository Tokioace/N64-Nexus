import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
} from 'react-native';

interface PrivacySettings {
  profileVisible: boolean;
  collectionVisible: boolean;
  locationVisible: boolean;
}

interface DeviceSession {
  id: string;
  deviceName: string;
  lastActive: string;
  isCurrent: boolean;
}

const DatenschutzScreen: React.FC = () => {
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisible: true,
    collectionVisible: true,
    locationVisible: false,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [emailForExport, setEmailForExport] = useState('');

  const [deviceSessions] = useState<DeviceSession[]>([
    {
      id: '1',
      deviceName: 'iPhone 14 Pro',
      lastActive: '2024-01-15 14:30',
      isCurrent: true,
    },
    {
      id: '2',
      deviceName: 'MacBook Pro',
      lastActive: '2024-01-14 09:15',
      isCurrent: false,
    },
    {
      id: '3',
      deviceName: 'iPad Air',
      lastActive: '2024-01-13 16:45',
      isCurrent: false,
    },
  ]);

  const handlePrivacyToggle = (setting: keyof PrivacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleDataExport = () => {
    if (!emailForExport.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie eine E-Mail-Adresse ein.');
      return;
    }
    
    Alert.alert(
      'Datenexport angefordert',
      `Ein Export Ihrer Daten wurde an ${emailForExport} angefordert. Sie erhalten eine E-Mail mit dem Download-Link innerhalb von 24 Stunden.`,
      [{ text: 'OK', onPress: () => setShowExportModal(false) }]
    );
    setEmailForExport('');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Konto löschen',
      'Sind Sie sicher, dass Sie Ihr Konto und alle Daten unwiderruflich löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: () => {
            // Hier würde die tatsächliche Löschlogik implementiert
            Alert.alert('Konto gelöscht', 'Ihr Konto wurde erfolgreich gelöscht.');
            setShowDeleteModal(false);
          },
        },
      ]
    );
  };

  const handleLogoutSession = (sessionId: string) => {
    Alert.alert(
      'Session beenden',
      'Möchten Sie diese Session wirklich beenden?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Beenden',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Session beendet', 'Die Session wurde erfolgreich beendet.');
          },
        },
      ]
    );
  };

  const ConfirmationModal: React.FC<{
    visible: boolean;
    onClose: () => void;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText: string;
    destructive?: boolean;
  }> = ({ visible, onClose, title, message, onConfirm, confirmText, destructive = false }) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>Abbrechen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                destructive && styles.modalButtonDestructive,
              ]}
              onPress={onConfirm}
            >
              <Text style={[styles.modalButtonText, destructive && styles.modalButtonTextDestructive]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DATENSCHUTZ & SICHERHEIT</Text>
        <Text style={styles.subtitle}>Terminal v2.1.4 - Privacy Module</Text>
      </View>

      {/* Privacy Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PRIVATSPHÄRE-EINSTELLUNGEN</Text>
        <View style={styles.sectionContent}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Profil sichtbar</Text>
            <Switch
              value={privacySettings.profileVisible}
              onValueChange={() => handlePrivacyToggle('profileVisible')}
              trackColor={{ false: '#1a1a1a', true: '#00ff00' }}
              thumbColor={privacySettings.profileVisible ? '#ffffff' : '#666666'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Sammlung sichtbar</Text>
            <Switch
              value={privacySettings.collectionVisible}
              onValueChange={() => handlePrivacyToggle('collectionVisible')}
              trackColor={{ false: '#1a1a1a', true: '#00ff00' }}
              thumbColor={privacySettings.collectionVisible ? '#ffffff' : '#666666'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Standort teilen</Text>
            <Switch
              value={privacySettings.locationVisible}
              onValueChange={() => handlePrivacyToggle('locationVisible')}
              trackColor={{ false: '#1a1a1a', true: '#00ff00' }}
              thumbColor={privacySettings.locationVisible ? '#ffffff' : '#666666'}
            />
          </View>
        </View>
      </View>

      {/* Data Export Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DATENEXPORT (DSGVO)</Text>
        <View style={styles.sectionContent}>
          <Text style={styles.description}>
            Fordern Sie eine Kopie aller Ihrer gespeicherten Daten an. Sie erhalten eine E-Mail mit dem Download-Link.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowExportModal(true)}
          >
            <Text style={styles.buttonText}>Datenexport anfordern</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Device Management Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>GERÄTEVERWALTUNG</Text>
        <View style={styles.sectionContent}>
          <Text style={styles.description}>
            Aktive Sessions und angemeldete Geräte:
          </Text>
          {deviceSessions.map((session) => (
            <View key={session.id} style={styles.sessionRow}>
              <View style={styles.sessionInfo}>
                <Text style={styles.deviceName}>{session.deviceName}</Text>
                <Text style={styles.lastActive}>
                  Letzte Aktivität: {session.lastActive}
                  {session.isCurrent && ' (Aktuell)'}
                </Text>
              </View>
              {!session.isCurrent && (
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={() => handleLogoutSession(session.id)}
                >
                  <Text style={styles.logoutButtonText}>Beenden</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Delete Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>KONTO LÖSCHEN</Text>
        <View style={styles.sectionContent}>
          <Text style={styles.description}>
            Löschen Sie Ihr Konto und alle zugehörigen Daten unwiderruflich.
          </Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setShowDeleteModal(true)}
          >
            <Text style={styles.deleteButtonText}>Alles löschen</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Export Modal */}
      <Modal
        visible={showExportModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Datenexport anfordern</Text>
            <Text style={styles.modalMessage}>
              Geben Sie Ihre E-Mail-Adresse ein, um den Datenexport zu erhalten:
            </Text>
            <TextInput
              style={styles.emailInput}
              placeholder="ihre.email@example.com"
              placeholderTextColor="#666666"
              value={emailForExport}
              onChangeText={setEmailForExport}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowExportModal(false)}
              >
                <Text style={styles.modalButtonText}>Abbrechen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleDataExport}
              >
                <Text style={styles.modalButtonText}>Anfordern</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Konto löschen"
        message="Sind Sie sicher, dass Sie Ihr Konto und alle Daten unwiderruflich löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
        onConfirm={handleDeleteAccount}
        confirmText="Löschen"
        destructive={true}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#00ff00',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff00',
    fontFamily: 'monospace',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'monospace',
  },
  section: {
    margin: 20,
    borderWidth: 1,
    borderColor: '#00ff00',
    backgroundColor: '#0a0a0a',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ff00',
    fontFamily: 'monospace',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#00ff00',
    backgroundColor: '#1a1a1a',
  },
  sectionContent: {
    padding: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  settingLabel: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  description: {
    fontSize: 12,
    color: '#cccccc',
    fontFamily: 'monospace',
    marginBottom: 15,
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#00ff00',
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#00ff00',
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#ff0000',
    padding: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ff0000',
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  sessionInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  lastActive: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#ff6600',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutButtonText: {
    color: '#ff6600',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#0a0a0a',
    borderWidth: 2,
    borderColor: '#00ff00',
    padding: 20,
    margin: 20,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff00',
    fontFamily: 'monospace',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: '#cccccc',
    fontFamily: 'monospace',
    marginBottom: 20,
    lineHeight: 20,
  },
  emailInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#00ff00',
    color: '#ffffff',
    padding: 12,
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#00ff00',
    padding: 12,
    flex: 0.48,
    alignItems: 'center',
  },
  modalButtonDestructive: {
    borderColor: '#ff0000',
  },
  modalButtonText: {
    color: '#00ff00',
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  modalButtonTextDestructive: {
    color: '#ff0000',
  },
});

export default DatenschutzScreen;
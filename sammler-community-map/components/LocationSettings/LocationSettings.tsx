import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { LocationPrivacySettings, MapSettings } from '../../types';

interface LocationSettingsProps {
  privacySettings: LocationPrivacySettings;
  mapSettings: MapSettings;
  locationPermissionStatus: string;
  onSave: (privacySettings: LocationPrivacySettings, mapSettings: MapSettings) => void;
  onCancel: () => void;
  onRequestPermission: () => void;
}

const LocationSettings: React.FC<LocationSettingsProps> = ({
  privacySettings,
  mapSettings,
  locationPermissionStatus,
  onSave,
  onCancel,
  onRequestPermission,
}) => {
  const [localPrivacySettings, setLocalPrivacySettings] = useState<LocationPrivacySettings>(privacySettings);
  const [localMapSettings, setLocalMapSettings] = useState<MapSettings>(mapSettings);

  const handleShareLocationToggle = (value: boolean) => {
    if (value && locationPermissionStatus !== 'granted') {
      Alert.alert(
        'Standort-Berechtigung erforderlich',
        'Um Ihren Standort zu teilen, müssen Sie der App Zugriff auf Ihren Standort gewähren.',
        [
          { text: 'Abbrechen', style: 'cancel' },
          { text: 'Berechtigung erteilen', onPress: onRequestPermission },
        ]
      );
      return;
    }

    setLocalPrivacySettings(prev => ({
      ...prev,
      shareLocation: value,
    }));
  };

  const handlePrivacyLevelChange = (level: 'city' | 'postal_code' | 'exact') => {
    setLocalPrivacySettings(prev => ({
      ...prev,
      privacyLevel: level,
    }));
  };

  const handleVisibilityChange = (visibility: 'all' | 'friends' | 'none') => {
    setLocalPrivacySettings(prev => ({
      ...prev,
      visibleTo: visibility,
    }));
  };

  const handleMapSettingToggle = (setting: keyof MapSettings, value: boolean | number) => {
    setLocalMapSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSave = () => {
    onSave(localPrivacySettings, localMapSettings);
  };

  const renderPrivacyLevelOption = (level: 'city' | 'postal_code' | 'exact', label: string, description: string) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        localPrivacySettings.privacyLevel === level && styles.selectedOption,
      ]}
      onPress={() => handlePrivacyLevelChange(level)}
    >
      <View style={styles.optionHeader}>
        <Text style={[
          styles.optionLabel,
          localPrivacySettings.privacyLevel === level && styles.selectedOptionText,
        ]}>
          {label}
        </Text>
        <View style={[
          styles.radioButton,
          localPrivacySettings.privacyLevel === level && styles.radioButtonSelected,
        ]}>
          {localPrivacySettings.privacyLevel === level && (
            <View style={styles.radioButtonInner} />
          )}
        </View>
      </View>
      <Text style={styles.optionDescription}>{description}</Text>
    </TouchableOpacity>
  );

  const renderVisibilityOption = (visibility: 'all' | 'friends' | 'none', label: string, description: string) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        localPrivacySettings.visibleTo === visibility && styles.selectedOption,
      ]}
      onPress={() => handleVisibilityChange(visibility)}
    >
      <View style={styles.optionHeader}>
        <Text style={[
          styles.optionLabel,
          localPrivacySettings.visibleTo === visibility && styles.selectedOptionText,
        ]}>
          {label}
        </Text>
        <View style={[
          styles.radioButton,
          localPrivacySettings.visibleTo === visibility && styles.radioButtonSelected,
        ]}>
          {localPrivacySettings.visibleTo === visibility && (
            <View style={styles.radioButtonInner} />
          )}
        </View>
      </View>
      <Text style={styles.optionDescription}>{description}</Text>
    </TouchableOpacity>
  );

  const renderRadiusOption = (radius: number, label: string) => (
    <TouchableOpacity
      style={[
        styles.optionButton,
        localMapSettings.radius === radius && styles.selectedOption,
      ]}
      onPress={() => handleMapSettingToggle('radius', radius)}
    >
      <View style={styles.optionHeader}>
        <Text style={[
          styles.optionLabel,
          localMapSettings.radius === radius && styles.selectedOptionText,
        ]}>
          {label}
        </Text>
        <View style={[
          styles.radioButton,
          localMapSettings.radius === radius && styles.radioButtonSelected,
        ]}>
          {localMapSettings.radius === radius && (
            <View style={styles.radioButtonInner} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelButton}>Abbrechen</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Einstellungen</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Speichern</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Datenschutz-Einstellungen */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 Datenschutz</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Standort anzeigen</Text>
              <Text style={styles.settingDescription}>
                Anderen Nutzern Ihren Standort anzeigen
              </Text>
            </View>
            <Switch
              value={localPrivacySettings.shareLocation}
              onValueChange={handleShareLocationToggle}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={localPrivacySettings.shareLocation ? '#fff' : '#f4f3f4'}
            />
          </View>

          {localPrivacySettings.shareLocation && (
            <>
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Genauigkeit</Text>
                {renderPrivacyLevelOption(
                  'city',
                  'Nur Stadt',
                  'Zeigt nur Ihre Stadt an (ca. 5km Genauigkeit)'
                )}
                {renderPrivacyLevelOption(
                  'postal_code',
                  'Postleitzahl',
                  'Zeigt anonymisierte PLZ an (ca. 1km Genauigkeit)'
                )}
                {renderPrivacyLevelOption(
                  'exact',
                  'Genauer Standort',
                  'Zeigt Ihren genauen Standort an'
                )}
              </View>

              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Sichtbarkeit</Text>
                {renderVisibilityOption(
                  'all',
                  'Alle Nutzer',
                  'Für alle Community-Mitglieder sichtbar'
                )}
                {renderVisibilityOption(
                  'friends',
                  'Nur Freunde',
                  'Nur für Ihre Freunde sichtbar'
                )}
                {renderVisibilityOption(
                  'none',
                  'Niemand',
                  'Standort wird nicht angezeigt'
                )}
              </View>
            </>
          )}

          <View style={styles.privacyNotice}>
            <Text style={styles.privacyNoticeText}>
              🛡️ Ihre Daten werden nur mit Ihrer ausdrücklichen Zustimmung geteilt und können jederzeit deaktiviert werden.
            </Text>
          </View>
        </View>

        {/* Karten-Einstellungen */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🗺️ Karten-Anzeige</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sammler anzeigen</Text>
              <Text style={styles.settingDescription}>
                Andere Sammler auf der Karte anzeigen
              </Text>
            </View>
            <Switch
              value={localMapSettings.showCollectors}
              onValueChange={(value) => handleMapSettingToggle('showCollectors', value)}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={localMapSettings.showCollectors ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Shops anzeigen</Text>
              <Text style={styles.settingDescription}>
                Retro-Shops auf der Karte anzeigen
              </Text>
            </View>
            <Switch
              value={localMapSettings.showShops}
              onValueChange={(value) => handleMapSettingToggle('showShops', value)}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={localMapSettings.showShops ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Flohmärkte anzeigen</Text>
              <Text style={styles.settingDescription}>
                Flohmärkte auf der Karte anzeigen
              </Text>
            </View>
            <Switch
              value={localMapSettings.showFleaMarkets}
              onValueChange={(value) => handleMapSettingToggle('showFleaMarkets', value)}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={localMapSettings.showFleaMarkets ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Suchradius</Text>
            {renderRadiusOption(10, '10 km')}
            {renderRadiusOption(25, '25 km')}
            {renderRadiusOption(50, '50 km')}
            {renderRadiusOption(100, '100 km')}
            {renderRadiusOption(0, 'Unbegrenzt')}
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cancelButton: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  subsection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  optionButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  selectedOption: {
    backgroundColor: '#e8f4fd',
    borderColor: '#007AFF',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  selectedOptionText: {
    color: '#007AFF',
  },
  optionDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#007AFF',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  privacyNotice: {
    backgroundColor: '#f0f8ff',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  privacyNoticeText: {
    fontSize: 12,
    color: '#007AFF',
    textAlign: 'center',
  },
});

export default LocationSettings;
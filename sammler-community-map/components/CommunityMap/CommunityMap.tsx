import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { PinData, UserLocation, LocationPrivacySettings, MapSettings } from '../../types';
import { mockPinData } from '../../data/mockData';
import { getPinColor, isLocationWithinRadius } from '../../utils/mapUtils';
import PinPopup from '../PinPopup/PinPopup';
import LocationSettings from '../LocationSettings/LocationSettings';
import AddLocationModal from '../AddLocationModal/AddLocationModal';

interface CommunityMapProps {
  onLocationPermissionRequest?: () => void;
}

const CommunityMap: React.FC<CommunityMapProps> = ({ onLocationPermissionRequest }) => {
  const [region, setRegion] = useState<Region>({
    latitude: 49.0, // Zentrum von Deutschland
    longitude: 8.5,
    latitudeDelta: 6.0,
    longitudeDelta: 6.0,
  });

  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedPin, setSelectedPin] = useState<PinData | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<string>('undetermined');

  const [privacySettings, setPrivacySettings] = useState<LocationPrivacySettings>({
    shareLocation: false,
    privacyLevel: 'city',
    visibleTo: 'all',
  });

  const [mapSettings, setMapSettings] = useState<MapSettings>({
    showCollectors: true,
    showShops: true,
    showFleaMarkets: true,
    radius: 50, // 50km Radius
  });

  const [pins, setPins] = useState<PinData[]>(mockPinData);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermissionStatus(status);
      
      if (status === 'granted') {
        getCurrentLocation();
      } else {
        Alert.alert(
          'Standort-Berechtigung benötigt',
          'Um andere Sammler in Ihrer Nähe zu finden, benötigen wir Zugriff auf Ihren Standort. Diese Daten werden nur verwendet, wenn Sie aktiv zustimmen.',
          [
            { text: 'Nicht jetzt', style: 'cancel' },
            { text: 'Einstellungen', onPress: () => onLocationPermissionRequest?.() },
          ]
        );
      }
    } catch (error) {
      console.error('Fehler beim Anfordern der Standort-Berechtigung:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const userLoc: UserLocation = {
        coordinate: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        accuracy: location.coords.accuracy || 0,
        timestamp: new Date(),
      };

      setUserLocation(userLoc);
      
      // Zentriere die Karte auf den Benutzerstandort
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
    } catch (error) {
      console.error('Fehler beim Abrufen des Standorts:', error);
    }
  };

  const getFilteredPins = (): PinData[] => {
    let filteredPins = pins.filter(pin => {
      // Typ-Filter
      if (pin.type === 'collector' && !mapSettings.showCollectors) return false;
      if (pin.type === 'shop' && !mapSettings.showShops) return false;
      if (pin.type === 'flea_market' && !mapSettings.showFleaMarkets) return false;

      // Radius-Filter (nur wenn Benutzerstandort verfügbar)
      if (userLocation && mapSettings.radius > 0) {
        return isLocationWithinRadius(
          userLocation.coordinate,
          pin.coordinate,
          mapSettings.radius
        );
      }

      return true;
    });

    return filteredPins;
  };

  const handleMarkerPress = (pin: PinData) => {
    setSelectedPin(pin);
  };

  const handleClosePopup = () => {
    setSelectedPin(null);
  };

  const handleSettingsChange = (
    newPrivacySettings: LocationPrivacySettings,
    newMapSettings: MapSettings
  ) => {
    setPrivacySettings(newPrivacySettings);
    setMapSettings(newMapSettings);
    setShowSettings(false);
  };

  const handleAddLocation = (newLocation: PinData) => {
    setPins([...pins, newLocation]);
    setShowAddLocation(false);
  };

  const renderCustomMarker = (pin: PinData) => {
    const pinColor = getPinColor(pin);
    
    return (
      <View style={[styles.markerContainer, { backgroundColor: pinColor }]}>
        <View style={styles.markerInner}>
          <Text style={styles.markerText}>
            {pin.type === 'collector' ? '👤' : 
             pin.type === 'shop' ? '🏪' : '🎪'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community Map</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowSettings(true)}
          >
            <Text style={styles.headerButtonText}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowAddLocation(true)}
          >
            <Text style={styles.headerButtonText}>➕</Text>
          </TouchableOpacity>
        </View>
      </View>

      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={privacySettings.shareLocation && locationPermissionStatus === 'granted'}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={false}
        showsPointsOfInterest={false}
      >
        {getFilteredPins().map((pin) => (
          <Marker
            key={pin.id}
            coordinate={pin.coordinate}
            title={pin.title}
            description={pin.description}
            onPress={() => handleMarkerPress(pin)}
          >
            {renderCustomMarker(pin)}
          </Marker>
        ))}
      </MapView>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#3B82F6' }]} />
          <Text style={styles.legendText}>🔵 1-20 Spiele</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#EAB308' }]} />
          <Text style={styles.legendText}>🟡 21-100 Spiele</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.legendText}>🔴 100+ Spiele</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#22C55E' }]} />
          <Text style={styles.legendText}>🟢 Shop</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#9CA3AF' }]} />
          <Text style={styles.legendText}>⚪ Flohmarkt</Text>
        </View>
      </View>

      {/* Pin Popup */}
      {selectedPin && (
        <PinPopup
          pin={selectedPin}
          userLocation={userLocation}
          onClose={handleClosePopup}
        />
      )}

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <LocationSettings
          privacySettings={privacySettings}
          mapSettings={mapSettings}
          locationPermissionStatus={locationPermissionStatus}
          onSave={handleSettingsChange}
          onCancel={() => setShowSettings(false)}
          onRequestPermission={requestLocationPermission}
        />
      </Modal>

      {/* Add Location Modal */}
      <Modal
        visible={showAddLocation}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AddLocationModal
          onAdd={handleAddLocation}
          onCancel={() => setShowAddLocation(false)}
          userLocation={userLocation}
        />
      </Modal>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  headerButtonText: {
    fontSize: 18,
  },
  map: {
    flex: 1,
  },
  legend: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
  },
  markerContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  markerText: {
    fontSize: 14,
  },
});

export default CommunityMap;
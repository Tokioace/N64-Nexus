import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import { PinData, UserLocation, CollectorData, ShopData, FleaMarketData } from '../../types';
import { 
  getPinColor, 
  getPinEmoji, 
  formatGameCount, 
  calculateDistance, 
  formatDistance,
  formatLastSeen,
  getCityFromCoordinate,
  getPostalCodeFromCoordinate
} from '../../utils/mapUtils';

interface PinPopupProps {
  pin: PinData;
  userLocation: UserLocation | null;
  onClose: () => void;
}

const PinPopup: React.FC<PinPopupProps> = ({ pin, userLocation, onClose }) => {
  const pinColor = getPinColor(pin);
  const pinEmoji = getPinEmoji(pin);
  const distance = userLocation ? calculateDistance(userLocation.coordinate, pin.coordinate) : null;

  const openWebsite = (url: string) => {
    Linking.openURL(url);
  };

  const openPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderCollectorDetails = (collector: CollectorData) => (
    <View style={styles.detailsSection}>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Benutzername:</Text>
        <Text style={styles.detailValue}>{collector.username}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Sammlung:</Text>
        <Text style={styles.detailValue}>{formatGameCount(collector.gameCount)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Kategorien:</Text>
        <Text style={styles.detailValue}>{collector.collectionCategories.join(', ')}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Status:</Text>
        <Text style={[styles.detailValue, { color: collector.isOnline ? '#22C55E' : '#9CA3AF' }]}>
          {collector.isOnline ? 'Online' : formatLastSeen(collector.lastSeen)}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Standort:</Text>
        <Text style={styles.detailValue}>{getCityFromCoordinate(collector.coordinate)}</Text>
      </View>
    </View>
  );

  const renderShopDetails = (shop: ShopData) => (
    <View style={styles.detailsSection}>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Adresse:</Text>
        <Text style={styles.detailValue}>{shop.address}</Text>
      </View>
      {shop.phone && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Telefon:</Text>
          <TouchableOpacity onPress={() => openPhone(shop.phone!)}>
            <Text style={[styles.detailValue, styles.linkText]}>{shop.phone}</Text>
          </TouchableOpacity>
        </View>
      )}
      {shop.website && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Website:</Text>
          <TouchableOpacity onPress={() => openWebsite(shop.website!)}>
            <Text style={[styles.detailValue, styles.linkText]}>{shop.website}</Text>
          </TouchableOpacity>
        </View>
      )}
      {shop.openingHours && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Öffnungszeiten:</Text>
          <Text style={styles.detailValue}>{shop.openingHours}</Text>
        </View>
      )}
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Bewertung:</Text>
        <Text style={styles.detailValue}>
          {'⭐'.repeat(Math.floor(shop.rating))} {shop.rating}/5 ({shop.reviewCount} Bewertungen)
        </Text>
      </View>
    </View>
  );

  const renderFleaMarketDetails = (fleaMarket: FleaMarketData) => (
    <View style={styles.detailsSection}>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Adresse:</Text>
        <Text style={styles.detailValue}>{fleaMarket.address}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Datum:</Text>
        <Text style={styles.detailValue}>
          {fleaMarket.date.toLocaleDateString('de-DE')}
          {fleaMarket.endDate && fleaMarket.endDate.toDateString() !== fleaMarket.date.toDateString() 
            ? ` - ${fleaMarket.endDate.toLocaleDateString('de-DE')}` 
            : ''}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Veranstalter:</Text>
        <Text style={styles.detailValue}>{fleaMarket.organizer}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Typ:</Text>
        <Text style={styles.detailValue}>{fleaMarket.isRecurring ? 'Regelmäßig' : 'Einmalig'}</Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.pinIndicator, { backgroundColor: pinColor }]}>
              <Text style={styles.pinEmoji}>{pinEmoji}</Text>
            </View>
            <View>
              <Text style={styles.title}>{pin.title}</Text>
              {distance && (
                <Text style={styles.distance}>{formatDistance(distance)} entfernt</Text>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {pin.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.description}>{pin.description}</Text>
            </View>
          )}

          {pin.image && (
            <View style={styles.imageSection}>
              <Image source={{ uri: pin.image }} style={styles.image} />
            </View>
          )}

          {pin.type === 'collector' && renderCollectorDetails(pin as CollectorData)}
          {pin.type === 'shop' && renderShopDetails(pin as ShopData)}
          {pin.type === 'flea_market' && renderFleaMarketDetails(pin as FleaMarketData)}

          <View style={styles.metaSection}>
            <Text style={styles.metaText}>
              Hinzugefügt am {pin.createdAt.toLocaleDateString('de-DE')}
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  pinIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  pinEmoji: {
    fontSize: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  distance: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  descriptionSection: {
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  imageSection: {
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    minWidth: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  linkText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  metaSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  metaText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default PinPopup;
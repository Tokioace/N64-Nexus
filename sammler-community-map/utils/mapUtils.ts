import { CollectorData, PinData, Coordinate } from '../types';
import { pinColors } from '../data/mockData';

export const getPinColor = (pin: PinData): string => {
  switch (pin.type) {
    case 'collector':
      const collector = pin as CollectorData;
      if (collector.gameCount <= 20) return pinColors.collector_small;
      if (collector.gameCount <= 100) return pinColors.collector_medium;
      return pinColors.collector_large;
    case 'shop':
      return pinColors.shop;
    case 'flea_market':
      return pinColors.flea_market;
    default:
      return '#999999';
  }
};

export const getPinEmoji = (pin: PinData): string => {
  switch (pin.type) {
    case 'collector':
      const collector = pin as CollectorData;
      if (collector.gameCount <= 20) return '🔵';
      if (collector.gameCount <= 100) return '🟡';
      return '🔴';
    case 'shop':
      return '🟢';
    case 'flea_market':
      return '⚪';
    default:
      return '📍';
  }
};

export const formatGameCount = (count: number): string => {
  if (count <= 20) return '1-20 Spiele';
  if (count <= 100) return '21-100 Spiele';
  return '100+ Spiele';
};

export const calculateDistance = (
  coord1: Coordinate,
  coord2: Coordinate
): number => {
  const R = 6371; // Radius der Erde in Kilometern
  const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

export const anonymizeLocation = (
  coordinate: Coordinate,
  privacyLevel: 'city' | 'postal_code' | 'exact'
): Coordinate => {
  switch (privacyLevel) {
    case 'city':
      // Runde auf ~5km Genauigkeit
      return {
        latitude: Math.round(coordinate.latitude * 20) / 20,
        longitude: Math.round(coordinate.longitude * 20) / 20,
      };
    case 'postal_code':
      // Runde auf ~1km Genauigkeit
      return {
        latitude: Math.round(coordinate.latitude * 100) / 100,
        longitude: Math.round(coordinate.longitude * 100) / 100,
      };
    case 'exact':
      return coordinate;
    default:
      return coordinate;
  }
};

export const getCityFromCoordinate = (coordinate: Coordinate): string => {
  // Vereinfachte Zuordnung für Mock-Daten
  const cities = [
    { name: 'Stuttgart', coord: { latitude: 48.7758, longitude: 9.1829 } },
    { name: 'München', coord: { latitude: 48.1351, longitude: 11.5820 } },
    { name: 'Frankfurt', coord: { latitude: 50.1109, longitude: 8.6821 } },
    { name: 'Köln', coord: { latitude: 50.9375, longitude: 6.9603 } },
    { name: 'Berlin', coord: { latitude: 52.5200, longitude: 13.4050 } },
    { name: 'Kehl', coord: { latitude: 48.7454, longitude: 7.8356 } },
    { name: 'Strasbourg', coord: { latitude: 48.5839, longitude: 7.7455 } },
  ];

  let closestCity = cities[0];
  let minDistance = calculateDistance(coordinate, cities[0].coord);

  for (const city of cities) {
    const distance = calculateDistance(coordinate, city.coord);
    if (distance < minDistance) {
      minDistance = distance;
      closestCity = city;
    }
  }

  return closestCity.name;
};

export const getPostalCodeFromCoordinate = (coordinate: Coordinate): string => {
  // Vereinfachte Zuordnung für Mock-Daten
  const city = getCityFromCoordinate(coordinate);
  const postalCodes: { [key: string]: string } = {
    'Stuttgart': '701xx',
    'München': '803xx',
    'Frankfurt': '603xx',
    'Köln': '509xx',
    'Berlin': '104xx',
    'Kehl': '776xx',
    'Strasbourg': '670xx',
  };

  return postalCodes[city] || '999xx';
};

export const formatLastSeen = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 5) return 'gerade online';
  if (diffMins < 60) return `vor ${diffMins} Minuten online`;
  if (diffHours < 24) return `vor ${diffHours} Stunden online`;
  if (diffDays < 7) return `vor ${diffDays} Tagen online`;
  return 'schon länger nicht online';
};

export const isLocationWithinRadius = (
  center: Coordinate,
  target: Coordinate,
  radiusKm: number
): boolean => {
  const distance = calculateDistance(center, target);
  return distance <= radiusKm;
};
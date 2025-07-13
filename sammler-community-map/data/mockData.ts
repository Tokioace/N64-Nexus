import { CollectorData, ShopData, FleaMarketData } from '../types';

export const mockCollectors: CollectorData[] = [
  {
    id: '1',
    type: 'collector',
    coordinate: { latitude: 48.7758, longitude: 9.1829 }, // Stuttgart
    title: 'RetroGamer_Stuttgart',
    username: 'RetroGamer_Stuttgart',
    gameCount: 45,
    isOnline: true,
    lastSeen: new Date(),
    collectionCategories: ['Nintendo', 'Sega', 'PlayStation'],
    createdBy: 'user1',
    createdAt: new Date('2024-01-15'),
    description: 'Sammle hauptsächlich Nintendo und Sega Konsolen',
  },
  {
    id: '2',
    type: 'collector',
    coordinate: { latitude: 48.1351, longitude: 11.5820 }, // München
    title: 'VintageCollector_Muc',
    username: 'VintageCollector_Muc',
    gameCount: 152,
    isOnline: false,
    lastSeen: new Date('2024-01-20'),
    collectionCategories: ['Atari', 'Commodore', 'Amstrad'],
    createdBy: 'user2',
    createdAt: new Date('2024-01-10'),
    description: 'Spezialisiert auf 80er Jahre Computer und Konsolen',
  },
  {
    id: '3',
    type: 'collector',
    coordinate: { latitude: 50.1109, longitude: 8.6821 }, // Frankfurt
    title: 'ModernRetro_FFM',
    username: 'ModernRetro_FFM',
    gameCount: 89,
    isOnline: true,
    lastSeen: new Date(),
    collectionCategories: ['Nintendo', 'PlayStation', 'Xbox'],
    createdBy: 'user3',
    createdAt: new Date('2024-01-12'),
    description: 'Sammle moderne Retro-Konsolen',
  },
  {
    id: '4',
    type: 'collector',
    coordinate: { latitude: 50.9375, longitude: 6.9603 }, // Köln
    title: 'ArcadeKing_CGN',
    username: 'ArcadeKing_CGN',
    gameCount: 203,
    isOnline: false,
    lastSeen: new Date('2024-01-19'),
    collectionCategories: ['Arcade', 'Neo Geo', 'Capcom'],
    createdBy: 'user4',
    createdAt: new Date('2024-01-08'),
    description: 'Arcade-Automat Sammler und Restaurator',
  },
  {
    id: '5',
    type: 'collector',
    coordinate: { latitude: 52.5200, longitude: 13.4050 }, // Berlin
    title: 'HandheldHero_BER',
    username: 'HandheldHero_BER',
    gameCount: 67,
    isOnline: true,
    lastSeen: new Date(),
    collectionCategories: ['Game Boy', 'Game Gear', 'Lynx'],
    createdBy: 'user5',
    createdAt: new Date('2024-01-14'),
    description: 'Portable Gaming Enthusiast',
  },
];

export const mockShops: ShopData[] = [
  {
    id: '6',
    type: 'shop',
    coordinate: { latitude: 48.7758, longitude: 9.1829 }, // Stuttgart
    title: 'Retro Games Stuttgart',
    name: 'Retro Games Stuttgart',
    address: 'Königstraße 28, 70173 Stuttgart',
    phone: '+49 711 1234567',
    website: 'https://retro-games-stuttgart.de',
    openingHours: 'Mo-Sa 10:00-19:00',
    rating: 4.5,
    reviewCount: 23,
    createdBy: 'shop1',
    createdAt: new Date('2024-01-01'),
    description: 'Spezialisiert auf Retro-Konsolen und seltene Spiele',
  },
  {
    id: '7',
    type: 'shop',
    coordinate: { latitude: 48.1351, longitude: 11.5820 }, // München
    title: 'Game Corner München',
    name: 'Game Corner München',
    address: 'Marienplatz 15, 80331 München',
    phone: '+49 89 9876543',
    website: 'https://gamecorner-muenchen.de',
    openingHours: 'Mo-Sa 11:00-20:00',
    rating: 4.8,
    reviewCount: 45,
    createdBy: 'shop2',
    createdAt: new Date('2024-01-02'),
    description: 'Größte Auswahl an Retro-Games in München',
  },
  {
    id: '8',
    type: 'shop',
    coordinate: { latitude: 50.1109, longitude: 8.6821 }, // Frankfurt
    title: 'Pixelpalast Frankfurt',
    name: 'Pixelpalast Frankfurt',
    address: 'Zeil 42, 60313 Frankfurt am Main',
    phone: '+49 69 5555666',
    openingHours: 'Mo-Sa 10:00-20:00',
    rating: 4.2,
    reviewCount: 18,
    createdBy: 'shop3',
    createdAt: new Date('2024-01-03'),
    description: 'Retro-Gaming und Reparaturservice',
  },
  {
    id: '9',
    type: 'shop',
    coordinate: { latitude: 48.7454, longitude: 7.8356 }, // Kehl
    title: 'Retro Shop Kehl',
    name: 'Retro Shop Kehl',
    address: 'Hauptstraße 67, 77694 Kehl',
    phone: '+49 7851 987654',
    openingHours: 'Di-Sa 14:00-18:00',
    rating: 4.0,
    reviewCount: 12,
    createdBy: 'shop4',
    createdAt: new Date('2024-01-04'),
    description: 'Kleiner aber feiner Retro-Shop an der französischen Grenze',
  },
];

export const mockFleaMarkets: FleaMarketData[] = [
  {
    id: '10',
    type: 'flea_market',
    coordinate: { latitude: 48.5839, longitude: 7.7455 }, // Strasbourg
    title: 'Retro Gaming Flohmarkt Strasbourg',
    name: 'Retro Gaming Flohmarkt Strasbourg',
    address: 'Place Kléber, 67000 Strasbourg',
    date: new Date('2024-02-10'),
    endDate: new Date('2024-02-10'),
    description: 'Großer Retro-Gaming Flohmarkt mit über 50 Händlern',
    organizer: 'Retro Gaming Elsass e.V.',
    isRecurring: true,
    createdBy: 'organizer1',
    createdAt: new Date('2024-01-05'),
  },
  {
    id: '11',
    type: 'flea_market',
    coordinate: { latitude: 48.7758, longitude: 9.1829 }, // Stuttgart
    title: 'Stuttgarter Spieleflohmarkt',
    name: 'Stuttgarter Spieleflohmarkt',
    address: 'Cannstatter Volksfestplatz, 70372 Stuttgart',
    date: new Date('2024-02-18'),
    endDate: new Date('2024-02-18'),
    description: 'Monatlicher Flohmarkt für Videospiele und Konsolen',
    organizer: 'Gaming Community Stuttgart',
    isRecurring: true,
    createdBy: 'organizer2',
    createdAt: new Date('2024-01-06'),
  },
  {
    id: '12',
    type: 'flea_market',
    coordinate: { latitude: 50.1109, longitude: 8.6821 }, // Frankfurt
    title: 'Frankfurter Retro-Börse',
    name: 'Frankfurter Retro-Börse',
    address: 'Jahrhunderthalle, 60528 Frankfurt am Main',
    date: new Date('2024-02-25'),
    endDate: new Date('2024-02-25'),
    description: 'Tauschbörse für Retro-Games und Hardware',
    organizer: 'Retro Gaming Club Frankfurt',
    isRecurring: false,
    createdBy: 'organizer3',
    createdAt: new Date('2024-01-07'),
  },
];

export const mockPinData = [...mockCollectors, ...mockShops, ...mockFleaMarkets];

export const pinColors = {
  collector_small: '#3B82F6',   // Blau für 1-20 Spiele
  collector_medium: '#EAB308',  // Gelb für 21-100 Spiele
  collector_large: '#EF4444',   // Rot für 100+ Spiele
  shop: '#22C55E',              // Grün für Shops
  flea_market: '#9CA3AF',       // Grau für Flohmärkte
};
import { Event, EventSeries } from '../types/event';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Super Mario 64 Speedrun Challenge',
    description: 'Wer schafft die schnellste 120-Sterne-Runde?',
    category: 'speedrun',
    platform: 'NTSC',
    startDate: new Date('2024-01-15T18:00:00'),
    endDate: new Date('2024-01-15T22:00:00'),
    status: 'planned',
    isTopEvent: true,
    maxParticipants: 50,
    currentParticipants: 23,
    organizer: 'SpeedrunMaster',
    rules: 'Nur NTSC-Version, keine Glitches erlaubt',
    prizes: '500 XP + Battle64-Titel',
    tags: ['mario64', 'speedrun', '120-stars']
  },
  {
    id: '2',
    title: 'Zelda Fanart Contest',
    description: 'Zeichne deine Lieblingsszene aus Ocarina of Time',
    category: 'fanart',
    platform: 'console',
    startDate: new Date('2024-01-20T10:00:00'),
    endDate: new Date('2024-01-27T18:00:00'),
    status: 'planned',
    isTopEvent: false,
    maxParticipants: 100,
    currentParticipants: 45,
    organizer: 'ArtStation',
    rules: 'Digitale oder traditionelle Kunst erlaubt',
    prizes: '300 XP + Feature auf Battle64',
    tags: ['zelda', 'fanart', 'ocarina']
  },
  {
    id: '3',
    title: 'GoldenEye Glitch Discovery',
    description: 'Finde neue Glitches in GoldenEye 007',
    category: 'glitch',
    platform: 'PAL',
    startDate: new Date('2024-01-12T14:00:00'),
    endDate: new Date('2024-01-12T16:00:00'),
    status: 'active',
    isTopEvent: false,
    maxParticipants: 30,
    currentParticipants: 18,
    organizer: 'GlitchHunter',
    rules: 'Nur PAL-Version, dokumentiere alle Funde',
    prizes: '200 XP + Glitch-Entdecker-Badge',
    tags: ['goldeneye', 'glitch', 'pal']
  },
  {
    id: '4',
    title: 'Smash Bros Team Tournament',
    description: '2v2 Turnier - Wer wird Champion?',
    category: 'teams',
    platform: 'emulator',
    startDate: new Date('2024-01-25T19:00:00'),
    endDate: new Date('2024-01-25T23:00:00'),
    status: 'planned',
    isTopEvent: true,
    maxParticipants: 32,
    currentParticipants: 28,
    organizer: 'SmashLeague',
    rules: 'Double Elimination, Standard Ruleset',
    prizes: '1000 XP + Team-Champion-Titel',
    tags: ['smash', 'teams', 'tournament']
  },
  {
    id: '5',
    title: 'Banjo-Kazooie 100% Run',
    description: 'Sammle alle Jiggies und Mumbo-Token',
    category: 'speedrun',
    platform: 'NTSC',
    startDate: new Date('2024-01-18T20:00:00'),
    endDate: new Date('2024-01-18T22:00:00'),
    status: 'planned',
    isTopEvent: false,
    maxParticipants: 25,
    currentParticipants: 12,
    organizer: 'BanjoFan',
    rules: '100% Completion erforderlich',
    prizes: '400 XP + Banjo-Master-Badge',
    tags: ['banjo', '100%', 'speedrun']
  }
];

export const mockEventSeries: EventSeries[] = [
  {
    id: 'series1',
    name: 'MontagSpeedrun',
    description: 'Jeden Montag neue Speedrun-Challenges',
    category: 'speedrun',
    events: mockEvents.filter(e => e.category === 'speedrun'),
    subscribers: ['user1', 'user2', 'user3']
  },
  {
    id: 'series2',
    name: 'Fanart Friday',
    description: 'Wöchentliche Fanart-Wettbewerbe',
    category: 'fanart',
    events: mockEvents.filter(e => e.category === 'fanart'),
    subscribers: ['user1', 'user4', 'user5']
  }
];
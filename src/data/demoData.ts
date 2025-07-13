import { Game } from '../types';

// Sample N64 games for demo purposes
export const sampleGames: Game[] = [
  {
    id: '1',
    title: 'Super Mario 64',
    releaseYear: 1996,
    genre: ['Platformer', 'Adventure'],
    publisher: 'Nintendo',
    coverImage: '🎮'
  },
  {
    id: '2',
    title: 'The Legend of Zelda: Ocarina of Time',
    releaseYear: 1998,
    genre: ['Action-Adventure', 'RPG'],
    publisher: 'Nintendo',
    coverImage: '🗡️'
  },
  {
    id: '3',
    title: 'GoldenEye 007',
    releaseYear: 1997,
    genre: ['First-Person Shooter'],
    publisher: 'Nintendo',
    coverImage: '🔫'
  },
  {
    id: '4',
    title: 'Mario Kart 64',
    releaseYear: 1996,
    genre: ['Racing', 'Party'],
    publisher: 'Nintendo',
    coverImage: '🏎️'
  },
  {
    id: '5',
    title: 'Super Smash Bros.',
    releaseYear: 1999,
    genre: ['Fighting', 'Party'],
    publisher: 'Nintendo',
    coverImage: '👊'
  },
  {
    id: '6',
    title: 'Banjo-Kazooie',
    releaseYear: 1998,
    genre: ['Platformer', 'Adventure'],
    publisher: 'Nintendo',
    coverImage: '🐻'
  },
  {
    id: '7',
    title: 'Donkey Kong 64',
    releaseYear: 1999,
    genre: ['Platformer', 'Adventure'],
    publisher: 'Nintendo',
    coverImage: '🦍'
  },
  {
    id: '8',
    title: 'Star Fox 64',
    releaseYear: 1997,
    genre: ['Shoot \'em up', 'Space Combat'],
    publisher: 'Nintendo',
    coverImage: '🚀'
  },
  {
    id: '9',
    title: 'Pokémon Stadium',
    releaseYear: 1999,
    genre: ['Strategy', 'RPG'],
    publisher: 'Nintendo',
    coverImage: '⚡'
  },
  {
    id: '10',
    title: 'Perfect Dark',
    releaseYear: 2000,
    genre: ['First-Person Shooter'],
    publisher: 'Nintendo',
    coverImage: '🔫'
  }
];

// Sample quiz questions
export const sampleQuizQuestions = [
  {
    id: '1',
    question: 'Welches Jahr wurde der Nintendo 64 veröffentlicht?',
    options: ['1994', '1995', '1996', '1997'],
    correctAnswer: 2,
    points: 10
  },
  {
    id: '2',
    question: 'Wer ist der Hauptcharakter in Super Mario 64?',
    options: ['Luigi', 'Mario', 'Yoshi', 'Toad'],
    correctAnswer: 1,
    points: 10
  },
  {
    id: '3',
    question: 'Wie viele Controller-Anschlüsse hat der N64?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 2,
    points: 10
  },
  {
    id: '4',
    question: 'Welches Spiel war das erste 3D-Zelda-Spiel?',
    options: ['A Link to the Past', 'Ocarina of Time', 'Majora\'s Mask', 'Wind Waker'],
    correctAnswer: 1,
    points: 15
  },
  {
    id: '5',
    question: 'Wie heißt der Hauptgegner in GoldenEye 007?',
    options: ['Dr. No', 'Goldfinger', 'Alec Trevelyan', 'Jaws'],
    correctAnswer: 2,
    points: 15
  }
];

// Sample time trial challenges
export const sampleTimeTrials = [
  {
    id: '1',
    title: 'Super Mario 64 - 120 Sterne Speedrun',
    description: 'Sammle alle 120 Sterne in Super Mario 64',
    targetTime: 3600, // 1 hour in seconds
    points: 100,
    difficulty: 'Hard'
  },
  {
    id: '2',
    title: 'Mario Kart 64 - Rainbow Road',
    description: 'Schließe Rainbow Road in Mario Kart 64 ab',
    targetTime: 180, // 3 minutes
    points: 50,
    difficulty: 'Medium'
  },
  {
    id: '3',
    title: 'GoldenEye 007 - Facility',
    description: 'Schließe die Facility-Mission in GoldenEye ab',
    targetTime: 300, // 5 minutes
    points: 75,
    difficulty: 'Medium'
  }
];

// Sample events
export const sampleEvents = [
  {
    id: '1',
    title: 'N64 Nostalgie-Woche',
    description: 'Eine Woche voller N64-Klassiker und Herausforderungen',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-22'),
    points: 200,
    participants: 0
  },
  {
    id: '2',
    title: 'Speedrun-Challenge',
    description: 'Wer schafft die schnellste Zeit in Super Mario 64?',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-07'),
    points: 150,
    participants: 0
  },
  {
    id: '3',
    title: 'Quiz-Meisterschaft',
    description: 'Teste dein N64-Wissen in unserem Quiz',
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-02-21'),
    points: 100,
    participants: 0
  }
];

// Sample minigames
export const sampleMinigames = [
  {
    id: '1',
    title: 'N64 Memory',
    description: 'Finde die passenden N64-Spielpaare',
    points: 20,
    difficulty: 'Easy'
  },
  {
    id: '2',
    title: 'Controller-Puzzle',
    description: 'Löse das N64-Controller-Puzzle',
    points: 30,
    difficulty: 'Medium'
  },
  {
    id: '3',
    title: 'Spiel-Titel-Raten',
    description: 'Rate N64-Spiele anhand von Screenshots',
    points: 25,
    difficulty: 'Medium'
  }
];
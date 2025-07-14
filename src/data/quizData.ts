import { QuizQuestion, Badge } from '../types/quiz';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Welches N64-Spiel wurde 1996 als Launch-Titel veröffentlicht und revolutionierte 3D-Gaming?",
    options: [
      "Super Mario 64",
      "The Legend of Zelda: Ocarina of Time",
      "GoldenEye 007",
      "Mario Kart 64"
    ],
    correctAnswer: 0,
    explanation: "Super Mario 64 war das erste 3D-Platformer-Spiel und setzte neue Maßstäbe für 3D-Gaming.",
    difficulty: "easy",
    category: "games"
  },
  {
    id: 2,
    question: "Wie heißt der Hauptcharakter in 'The Legend of Zelda: Ocarina of Time'?",
    options: [
      "Mario",
      "Link",
      "Zelda",
      "Ganondorf"
    ],
    correctAnswer: 1,
    explanation: "Link ist der Held der Zelda-Serie und der Hauptcharakter in Ocarina of Time.",
    difficulty: "easy",
    category: "characters"
  },
  {
    id: 3,
    question: "Welche Grafik-Chip-Technologie verwendete das Nintendo 64?",
    options: [
      "Voodoo Graphics",
      "Reality Coprocessor (RCP)",
      "3DFX",
      "PowerVR"
    ],
    correctAnswer: 1,
    explanation: "Das N64 verwendete den Reality Coprocessor (RCP) von Silicon Graphics.",
    difficulty: "medium",
    category: "hardware"
  },
  {
    id: 4,
    question: "In welchem Jahr wurde das Nintendo 64 in Europa veröffentlicht?",
    options: [
      "1995",
      "1996",
      "1997",
      "1998"
    ],
    correctAnswer: 1,
    explanation: "Das Nintendo 64 wurde in Europa am 1. März 1997 veröffentlicht.",
    difficulty: "medium",
    category: "history"
  },
  {
    id: 5,
    question: "Welches Spiel war das erste, das den N64 Rumble Pak unterstützte?",
    options: [
      "Star Fox 64",
      "Super Mario 64",
      "Mario Kart 64",
      "GoldenEye 007"
    ],
    correctAnswer: 0,
    explanation: "Star Fox 64 (Lylat Wars in Europa) war das erste Spiel mit Rumble Pak-Unterstützung.",
    difficulty: "hard",
    category: "hardware"
  }
];

export const badges: Badge[] = [
  {
    id: "first_win",
    name: "Erster Sieg",
    description: "Gewinne dein erstes Quiz",
    icon: "🏆",
    unlocked: false,
    condition: "Win first quiz"
  },
  {
    id: "perfect_score",
    name: "Perfektionist",
    description: "Erreiche 100% in einem Quiz",
    icon: "⭐",
    unlocked: false,
    condition: "Get perfect score"
  },
  {
    id: "speed_demon",
    name: "Geschwindigkeitsdämon",
    description: "Beantworte alle Fragen in unter 60 Sekunden",
    icon: "⚡",
    unlocked: false,
    condition: "Complete quiz under 60 seconds"
  },
  {
    id: "n64_expert",
    name: "N64-Experte",
    description: "Gewinne 5 Quizzes in Folge",
    icon: "🎮",
    unlocked: false,
    condition: "Win 5 quizzes in a row"
  },
  {
    id: "knowledge_master",
    name: "Wissensmeister",
    description: "Beantworte 50 Fragen korrekt",
    icon: "🧠",
    unlocked: false,
    condition: "Answer 50 questions correctly"
  }
];
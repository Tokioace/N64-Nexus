import { QuizQuestion } from '../types'

export const quizQuestions: QuizQuestion[] = [
  // Multiple Choice Questions
  {
    id: '1',
    type: 'multiple-choice',
    category: 'games',
    difficulty: 'easy',
    question: 'Wer ist der Hauptcharakter in Super Mario 64?',
    options: ['Luigi', 'Mario', 'Yoshi', 'Bowser'],
    correctAnswer: 'Mario',
    points: 10,
    explanation: 'Mario ist der Hauptcharakter und Protagonist von Super Mario 64.'
  },
  {
    id: '2',
    type: 'multiple-choice',
    category: 'characters',
    difficulty: 'easy',
    question: 'Welches Tier ist Banjo in Banjo-Kazooie?',
    options: ['Bär', 'Hase', 'Fuchs', 'Dachs'],
    correctAnswer: 'Bär',
    points: 10,
    explanation: 'Banjo ist ein brauner Bär, der zusammen mit Kazooie (einem Vogel) Abenteuer erlebt.'
  },
  {
    id: '3',
    type: 'multiple-choice',
    category: 'hardware',
    difficulty: 'medium',
    question: 'Wie viele Buttons hat der Standard N64 Controller?',
    options: ['6', '8', '10', '12'],
    correctAnswer: '10',
    points: 15,
    explanation: 'Der N64 Controller hat 10 Buttons: A, B, Z, L, R, Start, C-Up, C-Down, C-Left, C-Right.'
  },
  {
    id: '4',
    type: 'multiple-choice',
    category: 'games',
    difficulty: 'medium',
    question: 'In welchem Jahr wurde die Nintendo 64 veröffentlicht?',
    options: ['1994', '1995', '1996', '1997'],
    correctAnswer: '1996',
    points: 15,
    explanation: 'Die Nintendo 64 wurde am 23. Juni 1996 in Japan und am 29. September 1996 in Nordamerika veröffentlicht.'
  },
  {
    id: '5',
    type: 'multiple-choice',
    category: 'music',
    difficulty: 'hard',
    question: 'Wer komponierte die Musik für The Legend of Zelda: Ocarina of Time?',
    options: ['Nobuo Uematsu', 'Koji Kondo', 'Yoko Shimomura', 'Junichi Masuda'],
    correctAnswer: 'Koji Kondo',
    points: 20,
    explanation: 'Koji Kondo ist der Komponist der berühmten Zelda-Musik, einschließlich der Titelmelodie.'
  },
  {
    id: '6',
    type: 'multiple-choice',
    category: 'games',
    difficulty: 'easy',
    question: 'Welches Spiel war das erste 3D-Mario-Spiel?',
    options: ['Super Mario World', 'Super Mario 64', 'Super Mario Sunshine', 'Super Mario Galaxy'],
    correctAnswer: 'Super Mario 64',
    points: 10,
    explanation: 'Super Mario 64 war das erste 3D-Mario-Spiel und revolutionierte 3D-Plattformer.'
  },
  {
    id: '7',
    type: 'multiple-choice',
    category: 'characters',
    difficulty: 'medium',
    question: 'Wie heißt der Hauptgegner in The Legend of Zelda: Ocarina of Time?',
    options: ['Ganondorf', 'Vaati', 'Zant', 'Ghirahim'],
    correctAnswer: 'Ganondorf',
    points: 15,
    explanation: 'Ganondorf ist der Hauptantagonist und Endboss in Ocarina of Time.'
  },
  {
    id: '8',
    type: 'multiple-choice',
    category: 'hardware',
    difficulty: 'hard',
    question: 'Welche Speicherkapazität hatten N64-Cartridges maximal?',
    options: ['32 MB', '64 MB', '128 MB', '256 MB'],
    correctAnswer: '64 MB',
    points: 20,
    explanation: 'N64-Cartridges hatten eine maximale Speicherkapazität von 64 MB.'
  },
  {
    id: '9',
    type: 'multiple-choice',
    category: 'games',
    difficulty: 'medium',
    question: 'Welches Spiel war das erste, das analoge Steuerung verwendete?',
    options: ['Super Mario 64', 'Mario Kart 64', 'GoldenEye 007', 'Wave Race 64'],
    correctAnswer: 'Super Mario 64',
    points: 15,
    explanation: 'Super Mario 64 war das erste Spiel, das die analoge Steuerung des N64-Controllers nutzte.'
  },
  {
    id: '10',
    type: 'multiple-choice',
    category: 'trivia',
    difficulty: 'hard',
    question: 'Wie viele Polygone konnte die N64 pro Sekunde rendern?',
    options: ['100.000', '150.000', '200.000', '250.000'],
    correctAnswer: '150.000',
    points: 20,
    explanation: 'Die N64 konnte etwa 150.000 Polygone pro Sekunde rendern.'
  },

  // True/False Questions
  {
    id: '11',
    type: 'true-false',
    category: 'history',
    difficulty: 'easy',
    question: 'Die Nintendo 64 war die erste 64-Bit-Spielekonsole.',
    options: ['Wahr', 'Falsch'],
    correctAnswer: 'Falsch',
    points: 10,
    explanation: 'Die Atari Jaguar war bereits 1993 eine 64-Bit-Konsole, bevor die N64 1996 erschien.'
  },
  {
    id: '12',
    type: 'true-false',
    category: 'games',
    difficulty: 'medium',
    question: 'GoldenEye 007 war das erste First-Person-Shooter-Spiel auf der N64.',
    options: ['Wahr', 'Falsch'],
    correctAnswer: 'Wahr',
    points: 15,
    explanation: 'GoldenEye 007 war tatsächlich der erste erfolgreiche FPS auf der N64.'
  },
  {
    id: '13',
    type: 'true-false',
    category: 'hardware',
    difficulty: 'medium',
    question: 'Der N64 Controller hatte einen eingebauten Rumble-Pak.',
    options: ['Wahr', 'Falsch'],
    correctAnswer: 'Falsch',
    points: 15,
    explanation: 'Das Rumble-Pak war ein separates Zubehör, das in den Controller gesteckt werden musste.'
  },
  {
    id: '14',
    type: 'true-false',
    category: 'games',
    difficulty: 'easy',
    question: 'Mario Kart 64 unterstützte 4-Spieler-Modi.',
    options: ['Wahr', 'Falsch'],
    correctAnswer: 'Wahr',
    points: 10,
    explanation: 'Mario Kart 64 unterstützte sowohl 2-Spieler-Split-Screen als auch 4-Spieler-Modi.'
  },
  {
    id: '15',
    type: 'true-false',
    category: 'trivia',
    difficulty: 'hard',
    question: 'Die N64 verwendete CD-ROMs als Speichermedium.',
    options: ['Wahr', 'Falsch'],
    correctAnswer: 'Falsch',
    points: 20,
    explanation: 'Die N64 verwendete Cartridges, nicht CD-ROMs. Nintendo entschied sich gegen CDs.'
  },

  // Sequence Questions
  {
    id: '16',
    type: 'sequence',
    category: 'games',
    difficulty: 'medium',
    question: 'Ordne die Mario-Kart-Spiele in der richtigen Reihenfolge:',
    options: ['Super Mario Kart', 'Mario Kart 64', 'Mario Kart: Double Dash!!', 'Mario Kart DS'],
    correctAnswer: ['Super Mario Kart', 'Mario Kart 64', 'Mario Kart: Double Dash!!', 'Mario Kart DS'],
    points: 20,
    explanation: 'Die Reihenfolge ist: Super Mario Kart (SNES, 1992), Mario Kart 64 (N64, 1996), Mario Kart: Double Dash!! (GC, 2003), Mario Kart DS (NDS, 2005).'
  },
  {
    id: '17',
    type: 'sequence',
    category: 'history',
    difficulty: 'hard',
    question: 'Ordne die Konsolen in der richtigen Reihenfolge ihrer Veröffentlichung:',
    options: ['Nintendo 64', 'PlayStation', 'Sega Saturn', 'Nintendo GameCube'],
    correctAnswer: ['Sega Saturn', 'PlayStation', 'Nintendo 64', 'Nintendo GameCube'],
    points: 25,
    explanation: 'Sega Saturn (1994), PlayStation (1994), Nintendo 64 (1996), Nintendo GameCube (2001).'
  },

  // Image-based Questions (placeholder)
  {
    id: '18',
    type: 'image',
    category: 'characters',
    difficulty: 'easy',
    question: 'Welcher Charakter ist auf diesem Screenshot zu sehen?',
    options: ['Link', 'Mario', 'Samus', 'Donkey Kong'],
    correctAnswer: 'Link',
    points: 15,
    imageUrl: '/images/link-screenshot.jpg',
    explanation: 'Das ist Link, der Protagonist der Zelda-Serie.'
  },
  {
    id: '19',
    type: 'image',
    category: 'games',
    difficulty: 'medium',
    question: 'Aus welchem Spiel stammt dieser Screenshot?',
    options: ['Super Mario 64', 'Banjo-Kazooie', 'Donkey Kong 64', 'Conker\'s Bad Fur Day'],
    correctAnswer: 'Super Mario 64',
    points: 20,
    imageUrl: '/images/mario64-screenshot.jpg',
    explanation: 'Das ist ein Screenshot aus Super Mario 64, dem ersten 3D-Mario-Spiel.'
  },
  {
    id: '20',
    type: 'image',
    category: 'hardware',
    difficulty: 'medium',
    question: 'Welches Zubehör ist hier abgebildet?',
    options: ['Rumble-Pak', 'Transfer-Pak', 'Controller-Pak', 'Expansion-Pak'],
    correctAnswer: 'Expansion-Pak',
    points: 20,
    imageUrl: '/images/expansion-pak.jpg',
    explanation: 'Das ist das Expansion-Pak, das den RAM der N64 von 4MB auf 8MB erweiterte.'
  }
]

export const getQuestionsByCategory = (category: string): QuizQuestion[] => {
  return quizQuestions.filter(q => q.category === category)
}

export const getQuestionsByDifficulty = (difficulty: string): QuizQuestion[] => {
  return quizQuestions.filter(q => q.difficulty === difficulty)
}

export const getRandomQuestions = (count: number): QuizQuestion[] => {
  const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const getDailyQuestions = (): QuizQuestion[] => {
  // Use date as seed for consistent daily questions
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  
  const shuffled = [...quizQuestions].sort(() => {
    seed * 9301 + 49297 % 233280
    return (seed / 233280) - 0.5
  })
  
  return shuffled.slice(0, 5)
}
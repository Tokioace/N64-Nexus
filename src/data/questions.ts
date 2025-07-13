import { Question } from '../types/quiz'

export const questions: Question[] = [
  // 🎮 Spielwissen (Game Knowledge)
  {
    id: 'gk_001',
    category: 'game-knowledge',
    type: 'multiple-choice',
    question: 'Was ist das schwerste Cup-Rennen in Mario Kart 64?',
    options: ['Mushroom Cup', 'Flower Cup', 'Star Cup', 'Special Cup'],
    correctAnswer: 3,
    explanation: 'Der Special Cup enthält die schwierigsten Strecken wie Rainbow Road und Bowser Castle.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'gk_002',
    category: 'game-knowledge',
    type: 'multiple-choice',
    question: 'Wie viele Sterne braucht man für 100% Completion in Super Mario 64?',
    options: ['100 Sterne', '120 Sterne', '150 Sterne', '200 Sterne'],
    correctAnswer: 1,
    explanation: 'Man braucht 120 Sterne für 100% Completion in Super Mario 64.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'gk_003',
    category: 'game-knowledge',
    type: 'multiple-choice',
    question: 'Welcher Charakter ist der schnellste in Mario Kart 64?',
    options: ['Mario', 'Luigi', 'Yoshi', 'Toad'],
    correctAnswer: 2,
    explanation: 'Yoshi hat die höchste Geschwindigkeit in Mario Kart 64.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'gk_004',
    category: 'game-knowledge',
    type: 'true-false',
    question: 'In Zelda: Ocarina of Time kann man Epona in der Lon Lon Ranch finden.',
    options: ['Wahr', 'Falsch'],
    correctAnswer: 0,
    explanation: 'Epona ist das Pferd von Malon in der Lon Lon Ranch.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'gk_005',
    category: 'game-knowledge',
    type: 'multiple-choice',
    question: 'Wie viele Leben hat Bowser in Super Mario 64?',
    options: ['3 Leben', '5 Leben', '8 Leben', '10 Leben'],
    correctAnswer: 2,
    explanation: 'Bowser hat 8 Leben in Super Mario 64.',
    difficulty: 'hard',
    points: 20
  },

  // 📅 Release-Historie (Release History)
  {
    id: 'rh_001',
    category: 'release-history',
    type: 'multiple-choice',
    question: 'Wann erschien Banjo-Kazooie in Europa?',
    options: ['Juni 1998', 'Juli 1998', 'August 1998', 'September 1998'],
    correctAnswer: 1,
    explanation: 'Banjo-Kazooie erschien im Juli 1998 in Europa.',
    difficulty: 'hard',
    points: 20
  },
  {
    id: 'rh_002',
    category: 'release-history',
    type: 'multiple-choice',
    question: 'Welches war das erste N64-Spiel, das veröffentlicht wurde?',
    options: ['Super Mario 64', 'Pilotwings 64', 'Wave Race 64', 'Killer Instinct Gold'],
    correctAnswer: 0,
    explanation: 'Super Mario 64 war das erste N64-Spiel, das veröffentlicht wurde.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'rh_003',
    category: 'release-history',
    type: 'multiple-choice',
    question: 'In welchem Jahr erschien GoldenEye 007?',
    options: ['1996', '1997', '1998', '1999'],
    correctAnswer: 1,
    explanation: 'GoldenEye 007 erschien 1997 für das Nintendo 64.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'rh_004',
    category: 'release-history',
    type: 'true-false',
    question: 'Zelda: Majora\'s Mask erschien vor Zelda: Ocarina of Time.',
    options: ['Wahr', 'Falsch'],
    correctAnswer: 1,
    explanation: 'Ocarina of Time erschien 1998, Majora\'s Mask 2000.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'rh_005',
    category: 'release-history',
    type: 'multiple-choice',
    question: 'Wann wurde das Nintendo 64 in Japan veröffentlicht?',
    options: ['Juni 1996', 'Juli 1996', 'August 1996', 'September 1996'],
    correctAnswer: 0,
    explanation: 'Das Nintendo 64 wurde im Juni 1996 in Japan veröffentlicht.',
    difficulty: 'medium',
    points: 15
  },

  // 🧑‍🎨 Fanart-Quiz (Fanart Quiz)
  {
    id: 'fa_001',
    category: 'fanart',
    type: 'image-recognition',
    question: 'Welcher N64-Charakter ist auf diesem Fanart dargestellt?',
    options: ['Mario', 'Link', 'Samus', 'Donkey Kong'],
    correctAnswer: 1,
    explanation: 'Das Fanart zeigt Link aus der Zelda-Serie.',
    difficulty: 'easy',
    points: 10,
    imageUrl: '/images/fanart/link.jpg'
  },
  {
    id: 'fa_002',
    category: 'fanart',
    type: 'multiple-choice',
    question: 'Welcher Künstler ist bekannt für N64-Pixelart?',
    options: ['PixelMaster64', 'RetroArtist', 'N64Fan', 'Kein spezifischer Künstler'],
    correctAnswer: 3,
    explanation: 'Es gibt viele talentierte N64-Fanart-Künstler.',
    difficulty: 'medium',
    points: 15
  },

  // 🎼 Musik & Sounds (Music & Sounds)
  {
    id: 'ms_001',
    category: 'music-sounds',
    type: 'audio',
    question: 'Welcher Soundtrack ist das?',
    options: ['Super Mario 64 - Main Theme', 'Zelda OoT - Title Theme', 'Mario Kart 64 - Rainbow Road', 'Banjo-Kazooie - Spiral Mountain'],
    correctAnswer: 0,
    explanation: 'Das ist das berühmte Main Theme von Super Mario 64.',
    difficulty: 'easy',
    points: 10,
    audioUrl: '/audio/mario64-main-theme.mp3'
  },
  {
    id: 'ms_002',
    category: 'music-sounds',
    type: 'multiple-choice',
    question: 'Wer komponierte die Musik für Zelda: Ocarina of Time?',
    options: ['Koji Kondo', 'Nobuo Uematsu', 'Yoko Shimomura', 'Hirokazu Tanaka'],
    correctAnswer: 0,
    explanation: 'Koji Kondo komponierte die Musik für Zelda: Ocarina of Time.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'ms_003',
    category: 'music-sounds',
    type: 'audio',
    question: 'Aus welchem Spiel stammt dieser Sound?',
    options: ['Mario Kart 64', 'Super Mario 64', 'Zelda OoT', 'GoldenEye 007'],
    correctAnswer: 2,
    explanation: 'Das ist der charakteristische Sound aus Zelda: Ocarina of Time.',
    difficulty: 'medium',
    points: 15,
    audioUrl: '/audio/zelda-sound.mp3'
  },

  // 🐞 Glitches & Speedrun-Techniken (Glitches & Speedrun Techniques)
  {
    id: 'gs_001',
    category: 'glitches-speedruns',
    type: 'multiple-choice',
    question: 'Was ist ein "BLJ" in Super Mario 64?',
    options: ['Backwards Long Jump', 'Big Luigi Jump', 'Bowser Level Jump', 'Blue Luigi Jump'],
    correctAnswer: 0,
    explanation: 'BLJ steht für "Backwards Long Jump", ein berühmter Glitch in Super Mario 64.',
    difficulty: 'hard',
    points: 20
  },
  {
    id: 'gs_002',
    category: 'glitches-speedruns',
    type: 'multiple-choice',
    question: 'Welcher Glitch ermöglicht es, durch Wände zu gehen?',
    options: ['Wall Clip', 'Wall Jump', 'Wall Run', 'Wall Slide'],
    correctAnswer: 0,
    explanation: 'Wall Clip ist ein Glitch, der es ermöglicht, durch Wände zu gehen.',
    difficulty: 'medium',
    points: 15
  },
  {
    id: 'gs_003',
    category: 'glitches-speedruns',
    type: 'true-false',
    question: 'Der "Infinite Lives" Glitch in Super Mario 64 funktioniert nur in bestimmten Leveln.',
    options: ['Wahr', 'Falsch'],
    correctAnswer: 0,
    explanation: 'Der Infinite Lives Glitch funktioniert nur in bestimmten Leveln.',
    difficulty: 'hard',
    points: 20
  },

  // 🎉 Saison- & Feiertags-Quizzes (Seasonal & Holiday Quizzes)
  {
    id: 'sh_001',
    category: 'seasonal',
    type: 'multiple-choice',
    question: 'Welches N64-Spiel hat eine Weihnachts-Edition?',
    options: ['Mario Kart 64', 'Super Mario 64', 'Keines', 'Zelda OoT'],
    correctAnswer: 2,
    explanation: 'Es gibt keine offizielle Weihnachts-Edition für N64-Spiele.',
    difficulty: 'easy',
    points: 10
  },
  {
    id: 'sh_002',
    category: 'seasonal',
    type: 'multiple-choice',
    question: 'In welchem Monat wurde das Nintendo 64 in Europa veröffentlicht?',
    options: ['März 1997', 'April 1997', 'Mai 1997', 'Juni 1997'],
    correctAnswer: 0,
    explanation: 'Das Nintendo 64 wurde im März 1997 in Europa veröffentlicht.',
    difficulty: 'medium',
    points: 15
  }
]

export const getQuestionsByCategory = (category: string): Question[] => {
  return questions.filter(q => q.category === category)
}

export const getRandomQuestions = (count: number, category?: string): Question[] => {
  let filteredQuestions = category ? getQuestionsByCategory(category) : questions
  const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const getDailyQuestions = (): Question[] => {
  // Simple daily question selection based on date
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  const shuffled = [...questions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 10) // Return 10 questions for daily quiz
}
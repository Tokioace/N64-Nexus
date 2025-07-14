export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'games' | 'characters' | 'hardware' | 'history';
}

export interface QuizAnswer {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  badges: Badge[];
  date: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  condition: string;
}

export interface PlayerStats {
  totalGames: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
  badges: Badge[];
  rank: number;
}

export interface LeaderboardEntry {
  playerName: string;
  score: number;
  date: Date;
  rank: number;
}
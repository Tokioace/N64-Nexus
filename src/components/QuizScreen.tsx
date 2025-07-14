import React, { useState, useEffect, useCallback } from 'react';
import { QuizQuestion, QuizAnswer, QuizResult, Badge, PlayerStats } from '../types/quiz';
import { quizQuestions, badges } from '../data/quizData';
import './QuizScreen.css';

interface QuizScreenProps {
  onQuizComplete?: (result: QuizResult) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    totalGames: 0,
    totalScore: 0,
    averageScore: 0,
    bestScore: 0,
    totalTimeSpent: 0,
    badges: [],
    rank: 0
  });
  const [showStats, setShowStats] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([
    { playerName: "N64_Master", score: 500, date: new Date(), rank: 1 },
    { playerName: "Retro_Gamer", score: 450, date: new Date(), rank: 2 },
    { playerName: "Pixel_Pioneer", score: 400, date: new Date(), rank: 3 },
    { playerName: "Console_King", score: 350, date: new Date(), rank: 4 },
    { playerName: "Gaming_Guru", score: 300, date: new Date(), rank: 5 }
  ]);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

  // Timer effect
  useEffect(() => {
    if (quizStartTime && !showResult) {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStartTime, showResult]);

  // Start quiz timer
  useEffect(() => {
    if (!quizStartTime) {
      setQuizStartTime(new Date());
    }
  }, [quizStartTime]);

  const getTimeSpent = useCallback(() => {
    if (!quizStartTime) return 0;
    return Math.floor((currentTime.getTime() - quizStartTime.getTime()) / 1000);
  }, [quizStartTime, currentTime]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const timeSpent = getTimeSpent();
    
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      isCorrect,
      timeSpent
    };
    
    setAnswers([...answers, newAnswer]);
    
    // Show explanation after a short delay
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    
    if (isLastQuestion) {
      finishQuiz();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const finishQuiz = () => {
    const totalTime = getTimeSpent();
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const score = correctAnswers * 100;
    
    // Calculate earned badges
    const earnedBadges: Badge[] = [];
    
    if (playerStats.totalGames === 0) {
      earnedBadges.push(badges.find(b => b.id === 'first_win')!);
    }
    
    if (correctAnswers === quizQuestions.length) {
      earnedBadges.push(badges.find(b => b.id === 'perfect_score')!);
    }
    
    if (totalTime < 60) {
      earnedBadges.push(badges.find(b => b.id === 'speed_demon')!);
    }
    
    const result: QuizResult = {
      score,
      totalQuestions: quizQuestions.length,
      correctAnswers,
      timeSpent: totalTime,
      badges: earnedBadges,
      date: new Date()
    };
    
    // Update player stats
    const newStats: PlayerStats = {
      totalGames: playerStats.totalGames + 1,
      totalScore: playerStats.totalScore + score,
      averageScore: Math.round((playerStats.totalScore + score) / (playerStats.totalGames + 1)),
      bestScore: Math.max(playerStats.bestScore, score),
      totalTimeSpent: playerStats.totalTimeSpent + totalTime,
      badges: [...playerStats.badges, ...earnedBadges],
      rank: calculateRank(score)
    };
    
    setPlayerStats(newStats);
    setShowResult(true);
    
    if (onQuizComplete) {
      onQuizComplete(result);
    }
  };

  const calculateRank = (score: number): number => {
    const sortedScores = [...leaderboard.map(l => l.score), score].sort((a, b) => b - a);
    return sortedScores.indexOf(score) + 1;
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
    setShowExplanation(false);
    setQuizStartTime(null);
    setCurrentTime(new Date());
  };

  const getAnswerClass = (index: number) => {
    if (selectedAnswer === null) return '';
    if (index === currentQuestion.correctAnswer) return 'correct';
    if (index === selectedAnswer && !currentQuestion.correctAnswer) return 'incorrect';
    return '';
  };

  if (showResult) {
    return (
      <div className="quiz-screen result-screen">
        <div className="tv-frame">
          <div className="screen-content">
            <h1 className="title">🎮 QUIZ BEENDET! 🎮</h1>
            
            <div className="result-summary">
              <div className="score-display">
                <h2>Dein Ergebnis</h2>
                <div className="score">{answers.filter(a => a.isCorrect).length * 100} Punkte</div>
                <div className="stats">
                  <p>✅ {answers.filter(a => a.isCorrect).length} von {quizQuestions.length} richtig</p>
                  <p>⏱️ Zeit: {getTimeSpent()} Sekunden</p>
                </div>
              </div>
              
              {playerStats.badges.length > 0 && (
                <div className="badges-earned">
                  <h3>🏆 Neue Badges!</h3>
                  <div className="badge-grid">
                    {playerStats.badges.map((badge, index) => (
                      <div key={index} className="badge">
                        <span className="badge-icon">{badge.icon}</span>
                        <span className="badge-name">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="action-buttons">
              <button className="btn-primary" onClick={resetQuiz}>
                🎯 Neues Quiz
              </button>
              <button className="btn-secondary" onClick={() => setShowStats(true)}>
                📊 Statistiken
              </button>
              <button className="btn-secondary" onClick={() => setShowLeaderboard(true)}>
                🏆 Rangliste
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showStats) {
    return (
      <div className="quiz-screen stats-screen">
        <div className="tv-frame">
          <div className="screen-content">
            <h1 className="title">📊 SPIELER-STATISTIKEN</h1>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Spiele gespielt</h3>
                <div className="stat-value">{playerStats.totalGames}</div>
              </div>
              <div className="stat-card">
                <h3>Gesamtpunktzahl</h3>
                <div className="stat-value">{playerStats.totalScore}</div>
              </div>
              <div className="stat-card">
                <h3>Durchschnitt</h3>
                <div className="stat-value">{playerStats.averageScore}</div>
              </div>
              <div className="stat-card">
                <h3>Beste Punktzahl</h3>
                <div className="stat-value">{playerStats.bestScore}</div>
              </div>
            </div>
            
            <button className="btn-primary" onClick={() => setShowStats(false)}>
              ← Zurück
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showLeaderboard) {
    return (
      <div className="quiz-screen leaderboard-screen">
        <div className="tv-frame">
          <div className="screen-content">
            <h1 className="title">🏆 RANGLISTE</h1>
            
            <div className="leaderboard">
              {leaderboard.map((entry, index) => (
                <div key={index} className="leaderboard-entry">
                  <span className="rank">#{entry.rank}</span>
                  <span className="player-name">{entry.playerName}</span>
                  <span className="score">{entry.score} Punkte</span>
                </div>
              ))}
            </div>
            
            <button className="btn-primary" onClick={() => setShowLeaderboard(false)}>
              ← Zurück
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-screen">
      <div className="tv-frame">
        <div className="screen-content">
          {/* Header */}
          <div className="quiz-header">
            <div className="quiz-info">
              <h1 className="title">🎮 N64 QUIZ SHOW 🎮</h1>
              <div className="progress">
                Frage {currentQuestionIndex + 1} von {quizQuestions.length}
              </div>
              <div className="timer">⏱️ {getTimeSpent()}s</div>
            </div>
          </div>

          {/* Question */}
          <div className="question-container">
            <h2 className="question-text">{currentQuestion.question}</h2>
            <div className="question-meta">
              <span className="difficulty">{currentQuestion.difficulty}</span>
              <span className="category">{currentQuestion.category}</span>
            </div>
          </div>

          {/* Answer Options */}
          <div className="answers-container">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`answer-option ${getAnswerClass(index)} ${
                  selectedAnswer === index ? 'selected' : ''
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="explanation">
              <h3>💡 Erklärung:</h3>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Navigation */}
          {selectedAnswer !== null && (
            <div className="navigation">
              <button
                className="btn-primary"
                onClick={handleNextQuestion}
              >
                {isLastQuestion ? '🏁 Quiz beenden' : '➡️ Nächste Frage'}
              </button>
            </div>
          )}

          {/* Quick Stats */}
          <div className="quick-stats">
            <button 
              className="btn-small" 
              onClick={() => setShowStats(true)}
            >
              📊 Stats
            </button>
            <button 
              className="btn-small" 
              onClick={() => setShowLeaderboard(true)}
            >
              🏆 Top 5
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
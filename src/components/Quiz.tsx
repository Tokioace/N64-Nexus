'use client';

import { useState } from 'react';
import { 
  Clock, 
  Check, 
  X, 
  RotateCcw, 
  ChevronRight
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  type: 'cover' | 'sound' | 'trivia';
  question: string;
  image?: string;
  sound?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  correctAnswers: boolean[];
}

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [quizType, setQuizType] = useState<'all' | 'cover' | 'sound' | 'trivia'>('all');

  const questions: QuizQuestion[] = [
    {
      id: 1,
      type: 'cover',
      question: 'Welches Spiel zeigt dieses Cover?',
      image: '/covers/mario64.jpg',
      options: ['Super Mario 64', 'Mario Kart 64', 'Super Mario World', 'Mario Party'],
      correctAnswer: 0,
      explanation: 'Super Mario 64 war ein Launch-Titel für die Nintendo 64 und revolutionierte 3D-Jump\'n\'Run-Spiele.'
    },
    {
      id: 2,
      type: 'sound',
      question: 'Aus welchem Spiel stammt diese Musik?',
      sound: '/sounds/zelda-theme.mp3',
      options: ['Zelda: Ocarina of Time', 'Zelda: Majora\'s Mask', 'Zelda: A Link to the Past', 'Zelda: Wind Waker'],
      correctAnswer: 0,
      explanation: 'Das ist das berühmte Hauptthema aus The Legend of Zelda: Ocarina of Time.'
    },
    {
      id: 3,
      type: 'trivia',
      question: 'Wann wurde die Nintendo 64 in Europa veröffentlicht?',
      options: ['1996', '1997', '1998', '1999'],
      correctAnswer: 1,
      explanation: 'Die Nintendo 64 wurde in Europa am 1. März 1997 veröffentlicht.'
    }
  ];

  const filteredQuestions = quizType === 'all' ? questions : questions.filter(q => q.type === quizType);

  const getQuizTypeColor = (type: string) => {
    switch (type) {
      case 'cover': return 'from-blue-400 to-cyan-500';
      case 'sound': return 'from-purple-400 to-pink-500';
      case 'trivia': return 'from-yellow-400 to-orange-500';
      default: return 'from-cyan-400 to-blue-500';
    }
  };

  const getQuizTypeIcon = (type: string) => {
    switch (type) {
      case 'cover': return <ChevronRight className="w-5 h-5" />;
      case 'sound': return <Clock className="w-5 h-5" />;
      case 'trivia': return <ChevronRight className="w-5 h-5" />;
      default: return <ChevronRight className="w-5 h-5" />;
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    if (answerIndex === filteredQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      setIsQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setTimeLeft(30);
    setIsQuizComplete(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / filteredQuestions.length) * 100;
    if (percentage >= 80) return 'Ausgezeichnet! Du bist ein wahrer N64-Experte! 🏆';
    if (percentage >= 60) return 'Gut gemacht! Du kennst dich gut aus! 👍';
    if (percentage >= 40) return 'Nicht schlecht, aber da geht noch mehr! 💪';
    return 'Übung macht den Meister! Versuch es nochmal! 🎮';
  };

  if (isQuizComplete) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center">
            <div className="retro-card">
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-4xl font-bold mb-4 neon-text">Quiz beendet!</h1>
              <div className="text-2xl font-bold text-cyan-300 mb-4">
                {score} von {filteredQuestions.length} Fragen richtig
              </div>
              <div className="text-lg text-gray-300 mb-8">
                {getScoreMessage()}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">{score}</div>
                  <div className="text-sm text-gray-400">Richtige Antworten</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-cyan-400">{Math.round((score / filteredQuestions.length) * 100)}%</div>
                  <div className="text-sm text-gray-400">Erfolgsquote</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-400">{filteredQuestions.length}</div>
                  <div className="text-sm text-gray-400">Gesamtfragen</div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button onClick={resetQuiz} className="neon-button">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Nochmal spielen
                </button>
                <button className="retro-card">
                  Zur Bestenliste
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (filteredQuestions.length === 0) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="retro-card">
            <h1 className="text-2xl font-bold mb-4">Keine Fragen verfügbar</h1>
            <p className="text-gray-300 mb-6">Für diese Kategorie sind noch keine Fragen vorhanden.</p>
            <button onClick={() => setQuizType('all')} className="neon-button">
              Alle Kategorien anzeigen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 neon-text">N64 Quiz</h1>
          <p className="text-xl text-cyan-300 mb-8">
            Teste dein N64-Wissen mit unseren Minigames!
          </p>
        </div>

        {/* Quiz Type Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-black/50 rounded-lg p-1 border border-cyan-500/30">
            {([
              { key: 'cover', label: 'Cover Quiz', icon: <ChevronRight className="w-4 h-4" /> },
              { key: 'sound', label: 'Sound Quiz', icon: <Clock className="w-4 h-4" /> },
              { key: 'trivia', label: 'Trivia', icon: <ChevronRight className="w-4 h-4" /> }
            ] as const).map((type) => (
              <button
                key={type.key}
                onClick={() => setQuizType(type.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  quizType === type.key
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-300 hover:text-cyan-300'
                }`}
              >
                {type.icon}
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm text-gray-400">
            Frage {currentQuestion + 1} von {filteredQuestions.length}
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400">{timeLeft}s</span>
          </div>
          <div className="text-sm text-gray-400">
            Score: {score}/{filteredQuestions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-8">
          <div 
            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / filteredQuestions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question */}
        <div className="retro-card">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 bg-gradient-to-r ${getQuizTypeColor(filteredQuestions[currentQuestion].type)} rounded-lg flex items-center justify-center mx-auto mb-4`}>
              {getQuizTypeIcon(filteredQuestions[currentQuestion].type)}
            </div>
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">
              {filteredQuestions[currentQuestion].question}
            </h2>
            
            {filteredQuestions[currentQuestion].image && (
              <div className="w-64 h-64 bg-gray-800 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">Cover Bild</span>
              </div>
            )}
            
            {filteredQuestions[currentQuestion].sound && (
              <button className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                {/* Audio play button placeholder */}
              </button>
            )}
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {filteredQuestions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={`p-4 rounded-lg border-2 text-left transition-all hover:scale-105 ${
                  isAnswered
                    ? index === filteredQuestions[currentQuestion].correctAnswer
                      ? 'bg-green-500/20 border-green-400 text-green-300'
                      : index === selectedAnswer
                      ? 'bg-red-500/20 border-red-400 text-red-300'
                      : 'bg-gray-800/50 border-gray-600 text-gray-400'
                    : selectedAnswer === index
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-black/30 border-gray-600 text-gray-300 hover:border-cyan-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isAnswered && index === filteredQuestions[currentQuestion].correctAnswer && (
                    <Check className="w-5 h-5 text-green-400" />
                  )}
                  {isAnswered && index === selectedAnswer && index !== filteredQuestions[currentQuestion].correctAnswer && (
                    <X className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-cyan-300 mb-2">Erklärung:</h3>
              <p className="text-gray-300">{filteredQuestions[currentQuestion].explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <button
              onClick={nextQuestion}
              className="neon-button w-full"
            >
              {currentQuestion < filteredQuestions.length - 1 ? 'Nächste Frage' : 'Ergebnis anzeigen'}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="retro-card text-center">
            <div className="text-2xl font-bold text-cyan-300 mb-2">{score}</div>
            <div className="text-sm text-gray-400">Richtige Antworten</div>
          </div>
          <div className="retro-card text-center">
            <div className="text-2xl font-bold text-yellow-300 mb-2">{currentQuestion + 1}</div>
            <div className="text-sm text-gray-400">Aktuelle Frage</div>
          </div>
          <div className="retro-card text-center">
            <div className="text-2xl font-bold text-purple-300 mb-2">{Math.round((score / (currentQuestion + 1)) * 100) || 0}%</div>
            <div className="text-sm text-gray-400">Erfolgsquote</div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Volume2, 
  Check, 
  X, 
  Trophy, 
  Star,
  RotateCcw,
  Music,
  Image as ImageIcon
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  type: 'cover' | 'sound' | 'trivia';
  question: string;
  options: string[];
  correctAnswer: number;
  image?: string;
  sound?: string;
  points: number;
}

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [quizType, setQuizType] = useState<'cover' | 'sound' | 'trivia'>('cover');

  const questions: QuizQuestion[] = [
    {
      id: 1,
      type: 'cover',
      question: 'Welches Spiel ist das?',
      options: ['Super Mario 64', 'The Legend of Zelda: Ocarina of Time', 'GoldenEye 007', 'Mario Kart 64'],
      correctAnswer: 0,
      image: '🎮',
      points: 100
    },
    {
      id: 2,
      type: 'sound',
      question: 'Welches Spiel hat diesen Soundtrack?',
      options: ['Super Mario 64', 'Banjo-Kazooie', 'Donkey Kong 64', 'Conker\'s Bad Fur Day'],
      correctAnswer: 1,
      sound: '🎵',
      points: 150
    },
    {
      id: 3,
      type: 'trivia',
      question: 'In welchem Jahr wurde die Nintendo 64 veröffentlicht?',
      options: ['1994', '1995', '1996', '1997'],
      correctAnswer: 2,
      points: 75
    },
    {
      id: 4,
      type: 'cover',
      question: 'Erkennst du dieses Cover?',
      options: ['Perfect Dark', 'Jet Force Gemini', 'Star Fox 64', 'F-Zero X'],
      correctAnswer: 2,
      image: '🛸',
      points: 100
    },
    {
      id: 5,
      type: 'sound',
      question: 'Aus welchem Spiel kommt dieser Sound?',
      options: ['Mario Party', 'Pokémon Stadium', 'Super Smash Bros.', 'Paper Mario'],
      correctAnswer: 2,
      sound: '⚔️',
      points: 150
    }
  ];

  const filteredQuestions = questions.filter(q => q.type === quizType);

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    if (answerIndex === filteredQuestions[currentQuestion].correctAnswer) {
      setScore(score + filteredQuestions[currentQuestion].points);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowResult(false);
  };

  const getQuizTypeIcon = (type: string) => {
    switch (type) {
      case 'cover': return <ImageIcon className="w-5 h-5" />;
      case 'sound': return <Music className="w-5 h-5" />;
      case 'trivia': return <Star className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getQuizTypeColor = (type: string) => {
    switch (type) {
      case 'cover': return 'from-blue-400 to-cyan-500';
      case 'sound': return 'from-purple-400 to-pink-500';
      case 'trivia': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  if (showResult) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="retro-card">
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-4xl font-bold mb-4 neon-text">Quiz beendet!</h1>
              <div className="text-2xl font-bold text-cyan-300 mb-4">
                Dein Score: {score} Punkte
              </div>
              <div className="text-gray-300 mb-8">
                Du hast {Math.round((score / (filteredQuestions.length * 100)) * 100)}% der Fragen richtig beantwortet!
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={resetQuiz} className="neon-button">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Nochmal spielen
                </button>
                <button onClick={() => setQuizType('cover')} className="retro-card">
                  Anderes Quiz
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-4 neon-text">Retro Quiz</h1>
          <p className="text-xl text-cyan-300 mb-8">
            Teste dein N64-Wissen mit unseren Minigames!
          </p>
        </motion.div>

        {/* Quiz Type Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-black/50 rounded-lg p-1 border border-cyan-500/30">
            {([
              { key: 'cover', label: 'Cover Quiz', icon: <ImageIcon className="w-4 h-4" /> },
              { key: 'sound', label: 'Sound Quiz', icon: <Music className="w-4 h-4" /> },
              { key: 'trivia', label: 'Trivia', icon: <Star className="w-4 h-4" /> }
            ] as const).map((type) => (
              <button
                key={type.key}
                onClick={() => {
                  setQuizType(type.key);
                  resetQuiz();
                }}
                className={`flex items-center space-x-2 px-6 py-2 rounded-md transition-all ${
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

        {/* Progress and Score */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-cyan-300">
            Frage {currentQuestion + 1} von {filteredQuestions.length}
          </div>
          <div className="text-yellow-300 font-bold">
            Score: {score} Punkte
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
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            className="retro-card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <div className={`w-16 h-16 bg-gradient-to-r ${getQuizTypeColor(filteredQuestions[currentQuestion].type)} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                {getQuizTypeIcon(filteredQuestions[currentQuestion].type)}
              </div>
              
              {filteredQuestions[currentQuestion].image && (
                <div className="text-6xl mb-4">{filteredQuestions[currentQuestion].image}</div>
              )}
              
              {filteredQuestions[currentQuestion].sound && (
                <button className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform">
                  <Volume2 className="w-8 h-8" />
                </button>
              )}
              
              <h2 className="text-2xl font-bold text-cyan-300 mb-4">
                {filteredQuestions[currentQuestion].question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {filteredQuestions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={`p-4 rounded-lg text-left transition-all ${
                    selectedAnswer === index
                      ? index === filteredQuestions[currentQuestion].correctAnswer
                        ? 'bg-green-500/20 border-green-500 text-green-300'
                        : 'bg-red-500/20 border-red-500 text-red-300'
                      : isAnswered && index === filteredQuestions[currentQuestion].correctAnswer
                      ? 'bg-green-500/20 border-green-500 text-green-300'
                      : 'bg-black/30 border-cyan-500/30 text-gray-300 hover:bg-cyan-500/20 hover:border-cyan-400'
                  } border-2`}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isAnswered && selectedAnswer === index && (
                      index === filteredQuestions[currentQuestion].correctAnswer ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <X className="w-5 h-5 text-red-400" />
                      )
                    )}
                    {isAnswered && index === filteredQuestions[currentQuestion].correctAnswer && selectedAnswer !== index && (
                      <Check className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Next Button */}
            {isAnswered && (
              <motion.button
                onClick={nextQuestion}
                className="neon-button w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {currentQuestion < filteredQuestions.length - 1 ? 'Nächste Frage' : 'Ergebnis anzeigen'}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="retro-card text-center">
            <div className="text-2xl font-bold text-cyan-300">{filteredQuestions.length}</div>
            <div className="text-gray-300">Fragen</div>
          </div>
          <div className="retro-card text-center">
            <div className="text-2xl font-bold text-yellow-300">{score}</div>
            <div className="text-gray-300">Punkte</div>
          </div>
          <div className="retro-card text-center">
            <div className="text-2xl font-bold text-green-300">
              {Math.round((score / (filteredQuestions.length * 100)) * 100)}%
            </div>
            <div className="text-gray-300">Genauigkeit</div>
          </div>
        </div>
      </div>
    </div>
  );
}
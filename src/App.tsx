import React from 'react';
import QuizScreen from './components/QuizScreen';
import { QuizResult } from './types/quiz';
import './App.css';

function App() {
  const handleQuizComplete = (result: QuizResult) => {
    console.log('Quiz completed:', result);
    // Here you could save results to localStorage or send to a server
  };

  return (
    <div className="App">
      <QuizScreen onQuizComplete={handleQuizComplete} />
    </div>
  );
}

export default App;
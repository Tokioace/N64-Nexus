import React from 'react';
import { ProgressService } from '../services/progressService';
import { ProgressType } from '../types';
import { sampleGames, sampleQuizQuestions, sampleTimeTrials, sampleEvents, sampleMinigames } from '../data/demoData';

interface DemoActionsProps {
  onActionComplete: () => void;
}

const DemoActions: React.FC<DemoActionsProps> = ({ onActionComplete }) => {
  const handleAddGame = () => {
    const randomGame = sampleGames[Math.floor(Math.random() * sampleGames.length)];
    ProgressService.addProgress(
      ProgressType.COLLECTION_ADDED,
      `${randomGame.title} zur Sammlung hinzugefügt`
    );
    onActionComplete();
  };

  const handleCompleteQuiz = () => {
    const randomQuestion = sampleQuizQuestions[Math.floor(Math.random() * sampleQuizQuestions.length)];
    ProgressService.addProgress(
      ProgressType.QUIZ_COMPLETED,
      `Quiz-Frage beantwortet: ${randomQuestion.question}`
    );
    onActionComplete();
  };

  const handleCompleteTimeTrial = () => {
    const randomTrial = sampleTimeTrials[Math.floor(Math.random() * sampleTimeTrials.length)];
    ProgressService.addProgress(
      ProgressType.TIME_TRIAL_COMPLETED,
      `Zeitrennen abgeschlossen: ${randomTrial.title}`
    );
    onActionComplete();
  };

  const handleParticipateInEvent = () => {
    const randomEvent = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
    ProgressService.addProgress(
      ProgressType.EVENT_PARTICIPATED,
      `An Event teilgenommen: ${randomEvent.title}`
    );
    onActionComplete();
  };

  const handleCompleteMinigame = () => {
    const randomMinigame = sampleMinigames[Math.floor(Math.random() * sampleMinigames.length)];
    ProgressService.addProgress(
      ProgressType.MINIGAME_COMPLETED,
      `Minigame abgeschlossen: ${randomMinigame.title}`
    );
    onActionComplete();
  };

  const handleWeeklyChallenge = () => {
    ProgressService.addProgress(
      ProgressType.WEEKLY_CHALLENGE,
      'Wöchentliche Herausforderung abgeschlossen'
    );
    onActionComplete();
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo-Aktionen</h3>
      <p className="text-sm text-gray-600 mb-4">
        Teste das Fortschrittssystem mit diesen Demo-Aktionen:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={handleAddGame}
          className="btn-secondary text-left flex items-center"
        >
          <span className="mr-2">🎮</span>
          Spiel zur Sammlung hinzufügen
        </button>
        
        <button
          onClick={handleCompleteQuiz}
          className="btn-secondary text-left flex items-center"
        >
          <span className="mr-2">🧠</span>
          Quiz-Frage beantworten
        </button>
        
        <button
          onClick={handleCompleteTimeTrial}
          className="btn-secondary text-left flex items-center"
        >
          <span className="mr-2">⏱️</span>
          Zeitrennen abschließen
        </button>
        
        <button
          onClick={handleParticipateInEvent}
          className="btn-secondary text-left flex items-center"
        >
          <span className="mr-2">🎉</span>
          An Event teilnehmen
        </button>
        
        <button
          onClick={handleCompleteMinigame}
          className="btn-secondary text-left flex items-center"
        >
          <span className="mr-2">🎯</span>
          Minigame abschließen
        </button>
        
        <button
          onClick={handleWeeklyChallenge}
          className="btn-secondary text-left flex items-center"
        >
          <span className="mr-2">🏆</span>
          Wöchentliche Herausforderung
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tipp:</strong> Führe mehrere Aktionen aus, um Medaillen zu erhalten und dein Level zu erhöhen!
        </p>
      </div>
    </div>
  );
};

export default DemoActions;
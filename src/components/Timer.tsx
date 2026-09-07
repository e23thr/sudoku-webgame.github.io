import React from 'react';
import type { GameStatus } from '../types/sudoku';

interface TimerProps {
  seconds: number;
  gameStatus: GameStatus;
  onTogglePause: () => void;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const Timer: React.FC<TimerProps> = ({ seconds, gameStatus, onTogglePause }) => {
  const isPaused = gameStatus === 'paused';
  const isCompleted = gameStatus === 'completed';

  return (
    <div className={`timer ${isPaused ? 'timer--paused' : ''} ${isCompleted ? 'timer--completed' : ''}`}>
      <span className="timer__display">{formatTime(seconds)}</span>
      {!isCompleted && (
        <button
          className={`timer__button ${isPaused ? 'timer__button--play' : 'timer__button--pause'}`}
          onClick={onTogglePause}
          aria-label={isPaused ? 'Resume game' : 'Pause game'}
        >
          {isPaused ? '▶' : '⏸'}
        </button>
      )}
    </div>
  );
};

export default Timer;

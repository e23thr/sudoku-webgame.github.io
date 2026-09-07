import { useState } from 'react';
import { SudokuBoard } from './components';
import { createPuzzle } from './utils/sudoku';
import type { Puzzle } from './types/sudoku';
import './App.css';
import './styles/sudoku.css';

function App() {
  const [puzzle, setPuzzle] = useState<Puzzle>(() => createPuzzle('medium'));

  const handleNewPuzzle = () => {
    setPuzzle(createPuzzle('medium'));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧩 Sudoku</h1>
        <p className="app-subtitle">
          Difficulty: <strong>{puzzle.difficulty}</strong> ·{' '}
          {puzzle.cluesCount} clues
        </p>
      </header>

      <main className="app-main">
        <SudokuBoard puzzle={puzzle.grid} />
      </main>

      <footer className="app-footer">
        <button className="btn btn--new" onClick={handleNewPuzzle}>
          New Puzzle
        </button>
      </footer>
    </div>
  );
}

export default App;

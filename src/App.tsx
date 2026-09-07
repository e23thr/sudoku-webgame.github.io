import { useState, useEffect } from 'react';
import { SudokuBoard } from './components';
import { createPuzzle, loadGameState, clearGameState } from './utils';
import type { Puzzle, Difficulty } from './types/sudoku';
import './App.css';
import './styles/sudoku.css';

function App() {
  const [puzzle, setPuzzle] = useState<Puzzle>(() => {
    const saved = loadGameState();
    if (saved) {
      // Reconstruct puzzle from saved state
      const cluesCount = saved.grid.flat().filter(v => v !== 0).length;
      return {
        grid: saved.grid,
        solution: saved.solution,
        difficulty: saved.difficulty,
        cluesCount,
      };
    }
    return createPuzzle('medium');
  });

  const [hasSavedGame, setHasSavedGame] = useState(() => loadGameState() !== null);

  const handleNewPuzzle = () => {
    clearGameState();
    const difficulty = puzzle.difficulty;
    setPuzzle(createPuzzle(difficulty));
    setHasSavedGame(false);
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    clearGameState();
    setPuzzle(createPuzzle(difficulty));
    setHasSavedGame(false);
  };

  // Listen for storage changes (e.g., from another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sudoku-webgame-state') {
        setHasSavedGame(e.newValue !== null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧩 Sudoku</h1>
        <p className="app-subtitle">
          Difficulty: <strong>{puzzle.difficulty}</strong> ·{' '}
          {puzzle.cluesCount} clues
          {hasSavedGame && <span className="saved-badge">· Saved</span>}
        </p>
      </header>

      <main className="app-main">
        <SudokuBoard
          puzzle={puzzle.grid}
          solution={puzzle.solution}
          difficulty={puzzle.difficulty}
          onNewGame={handleNewPuzzle}
        />
      </main>

      <footer className="app-footer">
        <div className="difficulty-buttons">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
            <button
              key={d}
              className={`btn btn--difficulty ${puzzle.difficulty === d ? 'btn--difficulty-active' : ''}`}
              onClick={() => handleDifficultyChange(d)}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
        <button className="btn btn--new" onClick={handleNewPuzzle}>
          New Puzzle
        </button>
      </footer>
    </div>
  );
}

export default App;

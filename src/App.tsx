import { useState, useEffect, useCallback } from 'react';
import { SudokuBoard, HistoryPanel } from './components';
import { createPuzzle, loadGameState, clearGameState } from './utils';
import { saveCompletedGame } from './utils/db';
import type { Puzzle, Difficulty, SudokuGrid } from './types/sudoku';
import type { CompletedGame } from './types/history';
import './App.css';
import './styles/sudoku.css';

type AppView = 'game' | 'history';

function generateGameId(grid: SudokuGrid): string {
  return grid.flat().join(',');
}

function App() {
  const [puzzle, setPuzzle] = useState<Puzzle>(() => {
    const saved = loadGameState();
    if (saved) {
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
  const [view, setView] = useState<AppView>('game');
  const [completedGameSaved, setCompletedGameSaved] = useState(false);

  const handleNewPuzzle = useCallback(() => {
    clearGameState();
    const difficulty = puzzle.difficulty;
    setPuzzle(createPuzzle(difficulty));
    setHasSavedGame(false);
    setCompletedGameSaved(false);
  }, [puzzle.difficulty]);

  const handleDifficultyChange = useCallback((difficulty: Difficulty) => {
    clearGameState();
    setPuzzle(createPuzzle(difficulty));
    setHasSavedGame(false);
    setCompletedGameSaved(false);
  }, []);

  // Save completed game to IndexedDB when puzzle is completed
  const handleNewPuzzleAfterCompletion = useCallback(() => {
    // The SudokuBoard will save the game via its own effect
    handleNewPuzzle();
  }, [handleNewPuzzle]);

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

  // We need SudokuBoard to communicate game completion
  // We'll use a custom event for that
  useEffect(() => {
    const handleGameCompleted = async (e: Event) => {
      if (completedGameSaved) return; // Don't save twice

      const detail = (e as CustomEvent<{
        puzzle: SudokuGrid;
        solution: SudokuGrid;
        difficulty: Difficulty;
        timeElapsed: number;
      }>).detail;

      const game: CompletedGame = {
        id: generateGameId(detail.solution),
        difficulty: detail.difficulty,
        completedAt: new Date().toISOString(),
        timeElapsed: detail.timeElapsed,
        puzzle: detail.puzzle,
        solution: detail.solution,
      };

      await saveCompletedGame(game);
      setCompletedGameSaved(true);
    };

    window.addEventListener('sudoku-game-completed', handleGameCompleted);
    return () => window.removeEventListener('sudoku-game-completed', handleGameCompleted);
  }, [completedGameSaved]);

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

      <nav className="app-nav">
        <button
          className={`btn btn--nav ${view === 'game' ? 'btn--nav-active' : ''}`}
          onClick={() => setView('game')}
        >
          🎮 Game
        </button>
        <button
          className={`btn btn--nav ${view === 'history' ? 'btn--nav-active' : ''}`}
          onClick={() => setView('history')}
        >
          📜 History
        </button>
      </nav>

      <main className="app-main">
        {view === 'game' ? (
          <SudokuBoard
            puzzle={puzzle.grid}
            solution={puzzle.solution}
            difficulty={puzzle.difficulty}
            onNewGame={handleNewPuzzleAfterCompletion}
          />
        ) : (
          <HistoryPanel />
        )}
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

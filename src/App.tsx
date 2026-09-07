import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { SudokuBoard, ThemeToggle } from './components';
import { createPuzzle, loadGameState, clearGameState } from './utils';
import { saveCompletedGame } from './utils/db';
import { usePreferences } from './hooks/usePreferences';
import type { Puzzle, Difficulty, SudokuGrid } from './types/sudoku';
import type { CompletedGame } from './types/history';
import './styles/themes.css';
import './styles/animations.css';
import './App.css';
import './styles/sudoku.css';
import './styles/loading.css';

const HistoryPanel = lazy(() => import('./components/HistoryPanel'));

type AppView = 'game' | 'history';

function generateGameId(grid: SudokuGrid): string {
  return grid.flat().join(',');
}

function LoadingSpinner() {
  return (
    <div className="loading-spinner" role="status" aria-label="Loading">
      <div className="loading-spinner__circle" />
      <p className="loading-spinner__text">Loading...</p>
    </div>
  );
}

function App() {
  const { preferences, updateTheme, updateDefaultDifficulty } = usePreferences();

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
    return createPuzzle(preferences.defaultDifficulty);
  });

  const [hasSavedGame, setHasSavedGame] = useState(() => loadGameState() !== null);
  const [view, setView] = useState<AppView>('game');
  const [completedGameSaved, setCompletedGameSaved] = useState(false);

  const handleNewPuzzle = useCallback(() => {
    clearGameState();
    const difficulty = preferences.defaultDifficulty;
    setPuzzle(createPuzzle(difficulty));
    setHasSavedGame(false);
    setCompletedGameSaved(false);
  }, [preferences.defaultDifficulty]);

  const handleDifficultyChange = useCallback((difficulty: Difficulty) => {
    updateDefaultDifficulty(difficulty);
    clearGameState();
    setPuzzle(createPuzzle(difficulty));
    setHasSavedGame(false);
    setCompletedGameSaved(false);
  }, [updateDefaultDifficulty]);

  const handleNewPuzzleAfterCompletion = useCallback(() => {
    handleNewPuzzle();
  }, [handleNewPuzzle]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sudoku-webgame-state') {
        setHasSavedGame(e.newValue !== null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleGameCompleted = async (e: Event) => {
      if (completedGameSaved) return;

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
        <div className="app-header-row">
          <h1>🧩 Sudoku</h1>
          <ThemeToggle
            currentTheme={preferences.theme}
            onThemeChange={updateTheme}
          />
        </div>
        <p className="app-subtitle">
          Difficulty: <strong>{puzzle.difficulty}</strong> ·{' '}
          {puzzle.cluesCount} clues
          {hasSavedGame && <span className="saved-badge">· Saved</span>}
        </p>
      </header>

      <nav className="app-nav" aria-label="Game navigation">
        <button
          className={`btn btn--nav ${view === 'game' ? 'btn--nav-active' : ''}`}
          onClick={() => setView('game')}
          aria-current={view === 'game' ? 'page' : undefined}
        >
          🎮 Game
        </button>
        <button
          className={`btn btn--nav ${view === 'history' ? 'btn--nav-active' : ''}`}
          onClick={() => setView('history')}
          aria-current={view === 'history' ? 'page' : undefined}
        >
          📜 History
        </button>
      </nav>

      <main className="app-main" aria-live="polite">
        {view === 'game' ? (
          <SudokuBoard
            puzzle={puzzle.grid}
            solution={puzzle.solution}
            difficulty={puzzle.difficulty}
            onNewGame={handleNewPuzzleAfterCompletion}
          />
        ) : (
          <Suspense fallback={<LoadingSpinner />}>
            <HistoryPanel />
          </Suspense>
        )}
      </main>

      <footer className="app-footer">
        <div className="difficulty-buttons" role="group" aria-label="Difficulty selection">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
            <button
              key={d}
              className={`btn btn--difficulty ${puzzle.difficulty === d ? 'btn--difficulty-active' : ''}`}
              onClick={() => handleDifficultyChange(d)}
              aria-pressed={puzzle.difficulty === d}
              aria-label={`Select ${d} difficulty`}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
        <button
          className="btn btn--new"
          onClick={handleNewPuzzle}
          aria-label="Generate new puzzle"
        >
          New Puzzle
        </button>
      </footer>
    </div>
  );
}

export default App;

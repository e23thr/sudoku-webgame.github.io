import React, { useEffect, useState, useCallback, useRef } from 'react';
import type { SudokuGrid, SudokuGrid as SolutionGrid, Difficulty } from '../types/sudoku';
import { useSudokuGame } from '../hooks/useSudokuGame';
import SudokuCell from './SudokuCell';
import NumberPad from './NumberPad';
import Timer from './Timer';
import '../styles/sudoku.css';

interface SudokuBoardProps {
  puzzle: SudokuGrid;
  solution?: SolutionGrid;
  difficulty?: Difficulty;
  onCellSelect?: (row: number, col: number) => void;
  onNewGame?: () => void;
}

function generateConfettiPieces(): Array<{ id: number; left: string; delay: string; color: string; duration: string; size: string }> {
  const colors = ['#f43f5e', '#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];
  return Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${(i * 37 + 13) % 100}%`,
    delay: `${(i * 0.13) % 2}s`,
    color: colors[i % colors.length],
    duration: `${2 + ((i * 7) % 3)}s`,
    size: `${6 + ((i * 3) % 8)}px`,
  }));
}

const CONFETTI_PIECES = generateConfettiPieces();

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  puzzle,
  solution,
  difficulty = 'medium',
  onCellSelect,
  onNewGame,
}) => {
  const {
    state,
    gameStatus,
    timer,
    setCell,
    setNote,
    clearCell,
    toggleNotes,
    undo,
    redo,
    selectCell,
    togglePause,
    getNotes,
    isGiven,
    canUndo,
    canRedo,
  } = useSudokuGame({ initialPuzzle: puzzle, solution, difficulty });

  const isPaused = gameStatus === 'paused';
  const isCompleted = gameStatus === 'completed';

  const [inputAnimKey, setInputAnimKey] = useState(0);
  const [animCells, setAnimCells] = useState<Map<string, 'correct' | 'incorrect'>>(new Map());
  const [wrongCells, setWrongCells] = useState<Set<string>>(new Set());

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [swipeIndicator, setSwipeIndicator] = useState<'left' | 'right' | null>(null);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (isPaused || isCompleted) return;
      selectCell(row, col);
      onCellSelect?.(row, col);
    },
    [selectCell, onCellSelect, isPaused, isCompleted],
  );

  const handleNumberInput = useCallback(
    (num: number) => {
      if (isPaused || isCompleted) return;
      if (!state.selectedCell) return;

      const { row, col } = state.selectedCell;
      if (state.notesMode) {
        setNote(row, col, num);
      } else {
        setCell(row, col, num);
      }

      setInputAnimKey(k => k + 1);

      if (!state.notesMode && num > 0 && state.grid[row][col] !== num) {
        const cellKey = `${row},${col}`;
        if (solution && num === solution[row][col]) {
          setAnimCells(prev => new Map(prev).set(cellKey, 'correct'));
          setWrongCells(prev => {
            const next = new Set(prev);
            next.delete(cellKey);
            return next;
          });
          setTimeout(() => {
            setAnimCells(prev => {
              const next = new Map(prev);
              next.delete(cellKey);
              return next;
            });
          }, 500);
        } else {
          setAnimCells(prev => new Map(prev).set(cellKey, 'incorrect'));
          setWrongCells(prev => new Set(prev).add(cellKey));
          setTimeout(() => {
            setAnimCells(prev => {
              const next = new Map(prev);
              next.delete(cellKey);
              return next;
            });
          }, 600);
        }
      }
    },
    [state.selectedCell, state.notesMode, state.grid, setCell, setNote, isPaused, isCompleted, solution],
  );

  const handleClear = useCallback(() => {
    if (isPaused || isCompleted) return;
    if (!state.selectedCell) return;
    const { row, col } = state.selectedCell;
    clearCell(row, col);
    setWrongCells(prev => {
      const next = new Set(prev);
      next.delete(`${row},${col}`);
      return next;
    });
  }, [state.selectedCell, clearCell, isPaused, isCompleted]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isPaused || isCompleted) return;
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, [isPaused, isCompleted]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (isPaused || isCompleted || !touchStartRef.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartRef.current.x;
    const diffY = touchEndY - touchStartRef.current.y;
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      const direction = diffX > 0 ? 'right' : 'left';
      setSwipeIndicator(direction);
      toggleNotes();
      setTimeout(() => setSwipeIndicator(null), 300);
    }
    touchStartRef.current = null;
  }, [isPaused, isCompleted, toggleNotes]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartRef.current) { e.preventDefault(); }
  }, []);

  const handleCompletionNewGame = useCallback(() => {
    window.dispatchEvent(new CustomEvent('sudoku-game-completed', {
      detail: { puzzle: state.grid, solution: solution!, difficulty, timeElapsed: timer },
    }));
    onNewGame?.();
  }, [state.grid, solution, difficulty, timer, onNewGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === ' ' && !isCompleted) { e.preventDefault(); togglePause(); return; }
      if (isPaused || isCompleted) return;
      if (e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.metaKey) { e.preventDefault(); handleNumberInput(parseInt(e.key)); return; }
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); handleClear(); return; }
      if ((e.key === 'n' || e.key === 'N') && !e.ctrlKey && !e.metaKey) { e.preventDefault(); toggleNotes(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return; }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); return; }
      if (state.selectedCell && ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const { row, col } = state.selectedCell;
        let newRow = row, newCol = col;
        switch (e.key) {
          case 'ArrowUp': newRow = Math.max(0, row - 1); break;
          case 'ArrowDown': newRow = Math.min(8, row + 1); break;
          case 'ArrowLeft': newCol = Math.max(0, col - 1); break;
          case 'ArrowRight': newCol = Math.min(8, col + 1); break;
        }
        selectCell(newRow, newCol);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumberInput, handleClear, toggleNotes, undo, redo, state.selectedCell, selectCell, togglePause, isPaused, isCompleted]);

  return (
    <div className="sudoku-game">
      <Timer seconds={timer} gameStatus={gameStatus} onTogglePause={togglePause} />
      {isCompleted && (
        <div className="completion-overlay">
          <div className="completion-message">
            <span className="completion-emoji">🎉</span>
            <h2>Puzzle Complete!</h2>
            <p>Time: {formatTime(timer)}</p>
            {onNewGame && <button className="btn btn--new" onClick={handleCompletionNewGame}>New Puzzle</button>}
          </div>
        </div>
      )}
      {isCompleted && (
        <div className="confetti-container">
          {CONFETTI_PIECES.map(piece => (
            <div key={piece.id} className="confetti-piece" style={{ left: piece.left, backgroundColor: piece.color, animationDuration: piece.duration, animationDelay: piece.delay, width: piece.size, height: piece.size }} />
          ))}
        </div>
      )}
      <div className={`sudoku-board ${isPaused ? 'sudoku-board--paused' : ''} ${isCompleted ? 'sudoku-board--victory' : ''}`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchMove={handleTouchMove}>
        {swipeIndicator && <div className={`swipe-indicator swipe-indicator--${swipeIndicator}`}>{swipeIndicator === 'left' ? '← Notes' : 'Notes →'}</div>}
        {state.grid.map((row, rowIdx) => row.map((cell, colIdx) => {
          const isSelected = state.selectedCell?.row === rowIdx && state.selectedCell?.col === colIdx;
          const notes = getNotes(rowIdx, colIdx);
          const highlightInfo = state.selectedCell && !isPaused && !isCompleted ? { row: state.selectedCell.row, col: state.selectedCell.col, boxRow: Math.floor(state.selectedCell.row / 3) * 3, boxCol: Math.floor(state.selectedCell.col / 3) * 3, value: state.grid[state.selectedCell.row][state.selectedCell.col] } : null;
          const isHighlighted = highlightInfo ? (rowIdx === highlightInfo.row || colIdx === highlightInfo.col || (rowIdx >= highlightInfo.boxRow && rowIdx < highlightInfo.boxRow + 3 && colIdx >= highlightInfo.boxCol && colIdx < highlightInfo.boxCol + 3)) && !isSelected : false;
          const isSameNumber = highlightInfo ? highlightInfo.value !== 0 && state.grid[rowIdx][colIdx] === highlightInfo.value && !(rowIdx === highlightInfo.row && colIdx === highlightInfo.col) : false;
          const cellKey = `${rowIdx},${colIdx}`;
          const animState = animCells.get(cellKey);
          return <SudokuCell key={`${rowIdx}-${colIdx}`} row={rowIdx} col={colIdx} value={cell} isGiven={isGiven(rowIdx, colIdx)} isSelected={isSelected} isHighlighted={isHighlighted} isSameNumber={isSameNumber} isCorrect={animState === 'correct'} isIncorrect={animState === 'incorrect'} isWrong={wrongCells.has(cellKey)} inputKey={inputAnimKey} notes={notes} onClick={handleCellClick} />;
        }))}
      </div>
      {isPaused && <div className="pause-overlay"><span className="pause-icon">⏸</span><p>Game Paused</p><button className="pause-resume-btn" onClick={togglePause}>▶ Resume</button><p className="pause-hint">Press Space to resume</p></div>}
      <NumberPad onNumberSelect={handleNumberInput} onClear={handleClear} notesMode={state.notesMode} onToggleNotes={toggleNotes} onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} />
    </div>
  );
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default SudokuBoard;

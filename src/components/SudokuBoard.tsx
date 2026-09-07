import React, { useCallback, useEffect } from 'react';
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

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (isPaused || isCompleted) return;
      selectCell(row, col);
      onCellSelect?.(row, col);
    },
    [selectCell, onCellSelect, isPaused, isCompleted],
  );

  const handleCompletionNewGame = useCallback(() => {
    // Dispatch completion event before navigating away
    window.dispatchEvent(
      new CustomEvent('sudoku-game-completed', {
        detail: {
          puzzle: state.grid,
          solution: solution!,
          difficulty,
          timeElapsed: timer,
        },
      }),
    );
    onNewGame?.();
  }, [state.grid, solution, difficulty, timer, onNewGame]);

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
    },
    [state.selectedCell, state.notesMode, setCell, setNote, isPaused, isCompleted],
  );

  const handleClear = useCallback(() => {
    if (isPaused || isCompleted) return;
    if (!state.selectedCell) return;
    const { row, col } = state.selectedCell;
    clearCell(row, col);
  }, [state.selectedCell, clearCell, isPaused, isCompleted]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Space to toggle pause (only when game is active)
      if (e.key === ' ' && !isCompleted) {
        e.preventDefault();
        togglePause();
        return;
      }

      // Don't process game keys when paused or completed
      if (isPaused || isCompleted) return;

      // Number keys 1-9
      if (e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const num = parseInt(e.key);
        handleNumberInput(num);
        return;
      }

      // Delete/Backspace to clear
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleClear();
        return;
      }

      // N key to toggle notes mode
      if ((e.key === 'n' || e.key === 'N') && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleNotes();
        return;
      }

      // Ctrl+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Ctrl+Y or Ctrl+Shift+Z for redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
        return;
      }

      // Arrow keys for cell navigation
      if (state.selectedCell && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const { row, col } = state.selectedCell;
        let newRow = row;
        let newCol = col;

        switch (e.key) {
          case 'ArrowUp':
            newRow = Math.max(0, row - 1);
            break;
          case 'ArrowDown':
            newRow = Math.min(8, row + 1);
            break;
          case 'ArrowLeft':
            newCol = Math.max(0, col - 1);
            break;
          case 'ArrowRight':
            newCol = Math.min(8, col + 1);
            break;
        }

        selectCell(newRow, newCol);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumberInput, handleClear, toggleNotes, undo, redo, state.selectedCell, selectCell, togglePause, isPaused, isCompleted]);

  return (
    <div className="sudoku-game">
      <Timer
        seconds={timer}
        gameStatus={gameStatus}
        onTogglePause={togglePause}
      />

      {isCompleted && (
        <div className="completion-overlay">
          <div className="completion-message">
            <span className="completion-emoji">🎉</span>
            <h2>Puzzle Complete!</h2>
            <p>Time: {formatTime(timer)}</p>
            {onNewGame && (
              <button className="btn btn--new" onClick={handleCompletionNewGame}>
                New Puzzle
              </button>
            )}
          </div>
        </div>
      )}

      <div className={`sudoku-board ${isPaused ? 'sudoku-board--paused' : ''}`}>
        {state.grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            const isSelected =
              state.selectedCell?.row === rowIdx && state.selectedCell?.col === colIdx;
            const notes = getNotes(rowIdx, colIdx);
            
            // Pre-compute highlight info
            const highlightInfo = state.selectedCell && !isPaused && !isCompleted
              ? {
                  row: state.selectedCell.row,
                  col: state.selectedCell.col,
                  boxRow: Math.floor(state.selectedCell.row / 3) * 3,
                  boxCol: Math.floor(state.selectedCell.col / 3) * 3,
                  value: state.grid[state.selectedCell.row][state.selectedCell.col],
                }
              : null;

            const isHighlighted = highlightInfo
              ? (rowIdx === highlightInfo.row ||
                 colIdx === highlightInfo.col ||
                 (rowIdx >= highlightInfo.boxRow &&
                  rowIdx < highlightInfo.boxRow + 3 &&
                  colIdx >= highlightInfo.boxCol &&
                  colIdx < highlightInfo.boxCol + 3)) &&
                !isSelected
              : false;

            const isSameNumber = highlightInfo
              ? highlightInfo.value !== 0 &&
                state.grid[rowIdx][colIdx] === highlightInfo.value &&
                !(rowIdx === highlightInfo.row && colIdx === highlightInfo.col)
              : false;

            return (
              <SudokuCell
                key={`${rowIdx}-${colIdx}`}
                row={rowIdx}
                col={colIdx}
                value={cell}
                isGiven={isGiven(rowIdx, colIdx)}
                isSelected={isSelected}
                isHighlighted={isHighlighted}
                isSameNumber={isSameNumber}
                notes={notes}
                onClick={handleCellClick}
              />
            );
          }),
        )}
      </div>

      {isPaused && (
        <div className="pause-overlay">
          <span className="pause-icon">⏸</span>
          <p>Game Paused</p>
          <p className="pause-hint">Press Space or click ▶ to resume</p>
        </div>
      )}

      <NumberPad
        onNumberSelect={handleNumberInput}
        onClear={handleClear}
        notesMode={state.notesMode}
        onToggleNotes={toggleNotes}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
    </div>
  );
};

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default SudokuBoard;

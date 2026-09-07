import React, { useState, useCallback, useMemo } from 'react';
import type { SudokuGrid } from '../types/sudoku';
import SudokuCell from './SudokuCell';
import '../styles/sudoku.css';

interface SudokuBoardProps {
  puzzle: SudokuGrid;
  solution?: SudokuGrid;
  onCellSelect?: (row: number, col: number) => void;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  puzzle,
  onCellSelect,
}) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      setSelectedCell({ row, col });
      onCellSelect?.(row, col);
    },
    [onCellSelect],
  );

  // Pre-compute highlight sets for O(1) lookup
  const highlightInfo = useMemo(() => {
    if (!selectedCell) return { row: -1, col: -1, boxRow: -1, boxCol: -1, value: 0 };
    return {
      row: selectedCell.row,
      col: selectedCell.col,
      boxRow: Math.floor(selectedCell.row / 3) * 3,
      boxCol: Math.floor(selectedCell.col / 3) * 3,
      value: puzzle[selectedCell.row][selectedCell.col],
    };
  }, [selectedCell, puzzle]);

  const isHighlighted = useCallback(
    (row: number, col: number): boolean => {
      if (highlightInfo.row === -1) return false;
      // Same row, column, or 3x3 box
      if (row === highlightInfo.row) return true;
      if (col === highlightInfo.col) return true;
      if (
        row >= highlightInfo.boxRow &&
        row < highlightInfo.boxRow + 3 &&
        col >= highlightInfo.boxCol &&
        col < highlightInfo.boxCol + 3
      )
        return true;
      return false;
    },
    [highlightInfo],
  );

  const isSameNumber = useCallback(
    (row: number, col: number): boolean => {
      if (highlightInfo.value === 0) return false;
      return (
        puzzle[row][col] === highlightInfo.value &&
        !(row === highlightInfo.row && col === highlightInfo.col)
      );
    },
    [highlightInfo, puzzle],
  );

  return (
    <div className="sudoku-board">
      {puzzle.map((row, rowIdx) =>
        row.map((cell, colIdx) => {
          const isSelected =
            selectedCell?.row === rowIdx && selectedCell?.col === colIdx;
          return (
            <SudokuCell
              key={`${rowIdx}-${colIdx}`}
              row={rowIdx}
              col={colIdx}
              value={cell}
              isGiven={cell !== 0}
              isSelected={isSelected}
              isHighlighted={isHighlighted(rowIdx, colIdx) && !isSelected}
              isSameNumber={isSameNumber(rowIdx, colIdx)}
              onClick={handleCellClick}
            />
          );
        }),
      )}
    </div>
  );
};

export default SudokuBoard;

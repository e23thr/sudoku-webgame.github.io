import React from 'react';

interface SudokuCellProps {
  row: number;
  col: number;
  value: number;
  isGiven: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isSameNumber: boolean;
  onClick: (row: number, col: number) => void;
}

const SudokuCell: React.FC<SudokuCellProps> = ({
  row,
  col,
  value,
  isGiven,
  isSelected,
  isHighlighted,
  isSameNumber,
  onClick,
}) => {
  const classNames = [
    'sudoku-cell',
    isGiven && 'sudoku-cell--given',
    isSelected && 'sudoku-cell--selected',
    isHighlighted && 'sudoku-cell--highlighted',
    isSameNumber && 'sudoku-cell--same-number',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      onClick={() => onClick(row, col)}
      aria-label={`Cell row ${row + 1}, column ${col + 1}${value ? `, value ${value}` : ', empty'}`}
    >
      {value > 0 ? value : ''}
    </button>
  );
};

export default SudokuCell;

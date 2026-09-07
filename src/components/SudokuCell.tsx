import React from 'react';

interface SudokuCellProps {
  row: number;
  col: number;
  value: number;
  isGiven: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isSameNumber: boolean;
  notes?: number[];
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
  notes = [],
  onClick,
}) => {
  const classNames = [
    'sudoku-cell',
    isGiven && 'sudoku-cell--given',
    isSelected && 'sudoku-cell--selected',
    isHighlighted && 'sudoku-cell--highlighted',
    isSameNumber && 'sudoku-cell--same-number',
    value === 0 && notes.length > 0 && 'sudoku-cell--has-notes',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      onClick={() => onClick(row, col)}
      aria-label={`Cell row ${row + 1}, column ${col + 1}${value ? `, value ${value}` : notes.length > 0 ? `, notes: ${notes.join(', ')}` : ', empty'}`}
    >
      {value > 0 ? (
        value
      ) : notes.length > 0 ? (
        <div className="cell-notes">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <span key={n} className="note-number">
              {notes.includes(n) ? n : ''}
            </span>
          ))}
        </div>
      ) : (
        ''
      )}
    </button>
  );
};

export default SudokuCell;

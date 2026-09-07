import React from 'react';

interface SudokuCellProps {
  row: number;
  col: number;
  value: number;
  isGiven: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isSameNumber: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  isWrong?: boolean;
  inputKey?: number;
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
  isCorrect = false,
  isIncorrect = false,
  isWrong = false,
  inputKey = 0,
  notes = [],
  onClick,
}) => {
  const valueKey = value > 0 && inputKey > 0 ? `${value}-${inputKey}` : `${value}`;

  const classNames = [
    'sudoku-cell',
    isGiven && 'sudoku-cell--given',
    isSelected && 'sudoku-cell--selected',
    isHighlighted && 'sudoku-cell--highlighted',
    isSameNumber && 'sudoku-cell--same-number',
    value === 0 && notes.length > 0 && 'sudoku-cell--has-notes',
    isCorrect && 'sudoku-cell--correct',
    isIncorrect && 'sudoku-cell--incorrect',
    isWrong && !isIncorrect && 'sudoku-cell--wrong',
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
        <span key={valueKey} className={inputKey > 0 && value > 0 ? 'cell-value-animated' : ''}>
          {value}
        </span>
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

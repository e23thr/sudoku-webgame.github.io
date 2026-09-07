import React from 'react';

interface NumberPadProps {
  onNumberSelect: (num: number) => void;
  onClear: () => void;
  notesMode: boolean;
  onToggleNotes: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const NumberPad: React.FC<NumberPadProps> = ({
  onNumberSelect,
  onClear,
  notesMode,
  onToggleNotes,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="number-pad">
      <div className="number-pad__numbers">
        {numbers.map(num => (
          <button
            key={num}
            className="number-pad__button"
            onClick={() => onNumberSelect(num)}
            aria-label={`Enter number ${num}`}
          >
            {num}
          </button>
        ))}
      </div>
      
      <div className="number-pad__actions">
        <button
          className={`number-pad__button number-pad__button--clear`}
          onClick={onClear}
          aria-label="Clear cell"
        >
          ✕
        </button>
        
        <button
          className={`number-pad__button number-pad__button--notes ${notesMode ? 'number-pad__button--active' : ''}`}
          onClick={onToggleNotes}
          aria-label={notesMode ? 'Switch to normal mode' : 'Switch to notes mode'}
        >
          <span className="notes-icon">
            <span className="notes-icon__lines">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </span>
          <span className="notes-label">Notes</span>
        </button>

        <button
          className={`number-pad__button number-pad__button--undo ${!canUndo ? 'number-pad__button--disabled' : ''}`}
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo"
        >
          ↶
        </button>

        <button
          className={`number-pad__button number-pad__button--redo ${!canRedo ? 'number-pad__button--disabled' : ''}`}
          onClick={onRedo}
          disabled={!canRedo}
          aria-label="Redo"
        >
          ↷
        </button>
      </div>
    </div>
  );
};

export default NumberPad;

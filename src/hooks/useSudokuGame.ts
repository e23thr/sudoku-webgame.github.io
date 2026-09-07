import { useReducer, useCallback } from 'react';
import type { SudokuGrid } from '../types/sudoku';

export interface HistoryEntry {
  row: number;
  col: number;
  previousValue: number;
  newValue: number;
  previousNotes: number[];
  newNotes: number[];
}

interface GameState {
  grid: SudokuGrid;
  givens: Set<string>; // 'row,col' for given cells
  notes: Map<string, number[]>;
  history: HistoryEntry[];
  future: HistoryEntry[];
  notesMode: boolean;
  selectedCell: { row: number; col: number } | null;
}

type GameAction =
  | { type: 'SET_CELL'; row: number; col: number; value: number }
  | { type: 'SET_NOTE'; row: number; col: number; note: number }
  | { type: 'CLEAR_CELL'; row: number; col: number }
  | { type: 'TOGGLE_NOTES' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SELECT_CELL'; row: number; col: number }
  | { type: 'NEW_GAME'; puzzle: SudokuGrid };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NEW_GAME': {
      const givens = new Set<string>();
      action.puzzle.forEach((row, rowIdx) => {
        row.forEach((value, colIdx) => {
          if (value !== 0) {
            givens.add(`${rowIdx},${colIdx}`);
          }
        });
      });
      return {
        ...state,
        grid: action.puzzle.map(row => [...row]),
        givens,
        notes: new Map(),
        history: [],
        future: [],
        selectedCell: null,
      };
    }

    case 'SELECT_CELL':
      return { ...state, selectedCell: { row: action.row, col: action.col } };

    case 'SET_CELL': {
      const { row, col, value } = action;
      const key = `${row},${col}`;
      
      // Can't modify given cells
      if (state.givens.has(key)) return state;
      
      // Can't set same value
      if (state.grid[row][col] === value) return state;

      const previousValue = state.grid[row][col];
      const previousNotes = state.notes.get(key) || [];

      // Create new grid
      const newGrid = state.grid.map(r => [...r]);
      newGrid[row][col] = value;

      // Clear notes for this cell when setting a value
      const newNotes = new Map(state.notes);
      newNotes.delete(key);

      return {
        ...state,
        grid: newGrid,
        notes: newNotes,
        history: [...state.history, { 
          row, col, 
          previousValue, 
          newValue: value,
          previousNotes, 
          newNotes: [] 
        }],
        future: [], // Clear redo stack on new action
      };
    }

    case 'SET_NOTE': {
      const { row, col, note } = action;
      const key = `${row},${col}`;
      
      // Can't modify given cells
      if (state.givens.has(key)) return state;
      
      // Can't set notes on cells with values
      if (state.grid[row][col] !== 0) return state;

      const currentNotes = state.notes.get(key) || [];
      const previousNotes = [...currentNotes];

      let newNotesForCell: number[];
      if (currentNotes.includes(note)) {
        // Remove note if already present
        newNotesForCell = currentNotes.filter(n => n !== note);
      } else {
        // Add note
        newNotesForCell = [...currentNotes, note].sort();
      }

      const newNotes = new Map(state.notes);
      if (newNotesForCell.length === 0) {
        newNotes.delete(key);
      } else {
        newNotes.set(key, newNotesForCell);
      }

      return {
        ...state,
        notes: newNotes,
        history: [...state.history, { 
          row, col, 
          previousValue: 0, 
          newValue: 0,
          previousNotes, 
          newNotes: newNotesForCell 
        }],
        future: [],
      };
    }

    case 'CLEAR_CELL': {
      const { row, col } = action;
      const key = `${row},${col}`;
      
      // Can't modify given cells
      if (state.givens.has(key)) return state;

      const previousValue = state.grid[row][col];
      const previousNotes = state.notes.get(key) || [];

      // Only clear if there's something to clear
      if (previousValue === 0 && previousNotes.length === 0) return state;

      const newGrid = state.grid.map(r => [...r]);
      newGrid[row][col] = 0;

      const newNotes = new Map(state.notes);
      newNotes.delete(key);

      return {
        ...state,
        grid: newGrid,
        notes: newNotes,
        history: [...state.history, { 
          row, col, 
          previousValue, 
          newValue: 0,
          previousNotes, 
          newNotes: [] 
        }],
        future: [],
      };
    }

    case 'TOGGLE_NOTES':
      return { ...state, notesMode: !state.notesMode };

    case 'UNDO': {
      if (state.history.length === 0) return state;
      const lastEntry = state.history[state.history.length - 1];
      const { row, col, previousValue, previousNotes } = lastEntry;
      const key = `${row},${col}`;

      const newGrid = state.grid.map(r => [...r]);
      newGrid[row][col] = previousValue;

      const newNotes = new Map(state.notes);
      if (previousNotes.length === 0) {
        newNotes.delete(key);
      } else {
        newNotes.set(key, previousNotes);
      }

      return {
        ...state,
        grid: newGrid,
        notes: newNotes,
        history: state.history.slice(0, -1),
        future: [lastEntry, ...state.future],
      };
    }

    case 'REDO': {
      if (state.future.length === 0) return state;
      const nextEntry = state.future[0];
      const { row, col, newValue, newNotes } = nextEntry;
      const key = `${row},${col}`;

      const newGrid = state.grid.map(r => [...r]);
      newGrid[row][col] = newValue;

      const updatedNotes = new Map(state.notes);
      if (newNotes.length === 0) {
        updatedNotes.delete(key);
      } else {
        updatedNotes.set(key, newNotes);
      }

      return {
        ...state,
        grid: newGrid,
        notes: updatedNotes,
        history: [...state.history, nextEntry],
        future: state.future.slice(1),
      };
    }

    default:
      return state;
  }
}

function getInitialState(puzzle: SudokuGrid): GameState {
  const givens = new Set<string>();
  puzzle.forEach((row, rowIdx) => {
    row.forEach((value, colIdx) => {
      if (value !== 0) {
        givens.add(`${rowIdx},${colIdx}`);
      }
    });
  });

  return {
    grid: puzzle.map(row => [...row]),
    givens,
    notes: new Map(),
    history: [],
    future: [],
    notesMode: false,
    selectedCell: null,
  };
}

export function useSudokuGame(initialPuzzle: SudokuGrid) {
  const [state, dispatch] = useReducer(gameReducer, initialPuzzle, getInitialState);

  const setCell = useCallback((row: number, col: number, value: number) => {
    dispatch({ type: 'SET_CELL', row, col, value });
  }, []);

  const setNote = useCallback((row: number, col: number, note: number) => {
    dispatch({ type: 'SET_NOTE', row, col, note });
  }, []);

  const clearCell = useCallback((row: number, col: number) => {
    dispatch({ type: 'CLEAR_CELL', row, col });
  }, []);

  const toggleNotes = useCallback(() => {
    dispatch({ type: 'TOGGLE_NOTES' });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const selectCell = useCallback((row: number, col: number) => {
    dispatch({ type: 'SELECT_CELL', row, col });
  }, []);

  const newGame = useCallback((puzzle: SudokuGrid) => {
    dispatch({ type: 'NEW_GAME', puzzle });
  }, []);

  const getNotes = useCallback((row: number, col: number): number[] => {
    return state.notes.get(`${row},${col}`) || [];
  }, [state.notes]);

  const isGiven = useCallback((row: number, col: number): boolean => {
    return state.givens.has(`${row},${col}`);
  }, [state.givens]);

  return {
    state,
    setCell,
    setNote,
    clearCell,
    toggleNotes,
    undo,
    redo,
    selectCell,
    newGame,
    getNotes,
    isGiven,
    canUndo: state.history.length > 0,
    canRedo: state.future.length > 0,
  };
}

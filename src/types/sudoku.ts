/** 9x9 Sudoku grid — 0 represents an empty cell */
export type SudokuGrid = number[][];

/** Position of a cell in the grid */
export interface CellPosition {
  row: number;
  col: number;
}

/** A single cell in the Sudoku grid */
export interface SudokuCell {
  value: number;
  isGiven: boolean;
  notes: number[];
}

/** Puzzle difficulty levels */
export type Difficulty = 'easy' | 'medium' | 'hard';

/** A complete puzzle with metadata */
export interface Puzzle {
  grid: SudokuGrid;
  solution: SudokuGrid;
  difficulty: Difficulty;
  cluesCount: number;
}

/** Game status */
export type GameStatus = 'playing' | 'paused' | 'completed';

/** Difficulty clue ranges */
export const DIFFICULTY_RANGES: Record<Difficulty, { min: number; max: number }> = {
  easy: { min: 36, max: 40 },
  medium: { min: 27, max: 35 },
  hard: { min: 17, max: 26 },
};

import type { Difficulty, SudokuGrid } from './sudoku';

/** A completed game stored in IndexedDB */
export interface CompletedGame {
  id: string;
  difficulty: Difficulty;
  completedAt: string; // ISO 8601 string (Date is not serializable)
  timeElapsed: number; // seconds
  puzzle: SudokuGrid;
  solution: SudokuGrid;
}

/** Aggregated game statistics */
export interface GameStatistics {
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  bestTimes: Record<Difficulty, number | null>;
  averageTimes: Record<Difficulty, number | null>;
}

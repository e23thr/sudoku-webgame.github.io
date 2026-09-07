import type { SudokuGrid, Difficulty } from '../types/sudoku';

const STORAGE_KEY = 'sudoku-webgame-state';

export interface SavedGameState {
  grid: SudokuGrid;
  notes: [string, number[]][];
  timer: number;
  difficulty: Difficulty;
  puzzleId: string;
  solution: SudokuGrid;
}

/**
 * Save game state to localStorage.
 * Uses try/catch to handle storage errors (quota exceeded, private browsing, etc.)
 */
export function saveGameState(state: SavedGameState): boolean {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch {
    console.warn('Failed to save game state to localStorage');
    return false;
  }
}

/**
 * Load game state from localStorage.
 * Returns null if no saved state exists or if data is corrupt.
 */
export function loadGameState(): SavedGameState | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;

    const state = JSON.parse(serialized) as SavedGameState;

    // Validate required fields exist
    if (!state.grid || !state.solution || !state.puzzleId) {
      return null;
    }

    return state;
  } catch {
    console.warn('Failed to load game state from localStorage');
    return null;
  }
}

/**
 * Remove saved game state from localStorage.
 */
export function clearGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.warn('Failed to clear game state from localStorage');
  }
}

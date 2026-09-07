import type { SudokuGrid, Difficulty } from '../types/sudoku';

const STORAGE_KEY = 'sudoku-webgame-state';
const PREFS_KEY = 'sudoku-webgame-prefs';

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

// ── User Preferences ────────────────────────────────────────────────

export type Theme = 'light' | 'dark' | 'colorful';

export interface UserPreferences {
  theme: Theme;
  defaultDifficulty: Difficulty;
  soundEnabled: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'colorful',
  defaultDifficulty: 'medium',
  soundEnabled: true,
};

/**
 * Save user preferences to localStorage.
 */
export function savePreferences(prefs: UserPreferences): boolean {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    return true;
  } catch {
    console.warn('Failed to save preferences to localStorage');
    return false;
  }
}

/**
 * Load user preferences from localStorage.
 * Returns defaults if nothing saved or data is corrupt.
 */
export function loadPreferences(): UserPreferences {
  try {
    const saved = localStorage.getItem(PREFS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<UserPreferences>;
      return { ...DEFAULT_PREFERENCES, ...parsed };
    }
  } catch {
    console.warn('Failed to load preferences from localStorage');
  }
  return { ...DEFAULT_PREFERENCES };
}

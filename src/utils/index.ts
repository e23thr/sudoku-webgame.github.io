export {
  generateCompleteGrid,
  createPuzzle,
  isValidCompleteGrid,
  hasUniqueSolution,
  countClues,
  isValidPlacement,
  solveSudoku,
  countSolutions,
  cloneGrid,
} from './sudoku';

export {
  saveGameState,
  loadGameState,
  clearGameState,
} from './storage';

export type { SavedGameState } from './storage';

export {
  savePreferences,
  loadPreferences,
} from './storage';

export type { UserPreferences, Theme } from './storage';

export {
  saveCompletedGame,
  getCompletedGames,
  clearHistory,
  getStatistics,
  calculateStatistics,
} from './db';

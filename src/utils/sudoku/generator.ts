import type { Difficulty, Puzzle, SudokuGrid } from '../../types/sudoku';
import { DIFFICULTY_RANGES } from '../../types/sudoku';
import { cloneGrid, countSolutions, isValidPlacement } from './solver';

/**
 * Shuffle an array in-place using Fisher-Yates algorithm.
 */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate a complete, valid 9x9 Sudoku grid using randomized backtracking.
 */
export function generateCompleteGrid(): SudokuGrid {
  const grid: SudokuGrid = Array.from({ length: 9 }, () => Array(9).fill(0));

  function fill(grid: SudokuGrid): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (const num of nums) {
            if (isValidPlacement(grid, r, c, num)) {
              grid[r][c] = num;
              if (fill(grid)) return true;
              grid[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true; // all cells filled
  }

  fill(grid);
  return grid;
}

/**
 * Internal: attempt to remove cells from a grid to create a puzzle.
 * Returns the best result found (fewest clues while unique).
 */
function tryRemoveCells(
  completeGrid: SudokuGrid,
  targetCellsToRemove: number,
): { puzzle: SudokuGrid; removed: number } {
  const puzzle = cloneGrid(completeGrid);

  const positions: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  shuffle(positions);

  let removed = 0;
  for (const [r, c] of positions) {
    if (removed >= targetCellsToRemove) break;

    const backup = puzzle[r][c];
    puzzle[r][c] = 0;

    const testGrid = cloneGrid(puzzle);
    const solutions = countSolutions(testGrid, 2);

    if (solutions === 1) {
      removed++;
    } else {
      puzzle[r][c] = backup;
    }
  }

  return { puzzle, removed };
}

/**
 * Create a Sudoku puzzle by removing cells from a complete grid.
 * Ensures the puzzle has a unique solution.
 * Tries multiple complete grids to find one that achieves the target clue count.
 */
export function createPuzzle(difficulty: Difficulty): Puzzle {
  const { min, max } = DIFFICULTY_RANGES[difficulty];
  const targetClues = Math.floor(Math.random() * (max - min + 1)) + min;
  const targetCellsToRemove = 81 - targetClues;

  // Try up to 5 complete grids and pick the best result
  let bestResult: { puzzle: SudokuGrid; removed: number; solution: SudokuGrid } | null = null;

  for (let attempt = 0; attempt < 5; attempt++) {
    const solution = generateCompleteGrid();
    const { puzzle, removed } = tryRemoveCells(solution, targetCellsToRemove);

    if (!bestResult || removed > bestResult.removed) {
      bestResult = { puzzle, removed, solution };
    }

    // If we hit the target, stop early
    if (removed >= targetCellsToRemove) break;
  }

  // Use the best result found
  const { puzzle, solution } = bestResult!;
  const cluesCount = 81 - bestResult!.removed;

  return {
    grid: puzzle,
    solution,
    difficulty,
    cluesCount,
  };
}

/**
 * Validate that a grid is a complete, valid Sudoku (all rows, columns, and boxes contain 1-9).
 */
export function isValidCompleteGrid(grid: SudokuGrid): boolean {
  // Check rows
  for (let r = 0; r < 9; r++) {
    const seen = new Set<number>();
    for (let c = 0; c < 9; c++) {
      const val = grid[r][c];
      if (val < 1 || val > 9 || seen.has(val)) return false;
      seen.add(val);
    }
  }

  // Check columns
  for (let c = 0; c < 9; c++) {
    const seen = new Set<number>();
    for (let r = 0; r < 9; r++) {
      const val = grid[r][c];
      if (val < 1 || val > 9 || seen.has(val)) return false;
      seen.add(val);
    }
  }

  // Check 3x3 boxes
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const seen = new Set<number>();
      for (let r = br * 3; r < br * 3 + 3; r++) {
        for (let c = bc * 3; c < bc * 3 + 3; c++) {
          const val = grid[r][c];
          if (val < 1 || val > 9 || seen.has(val)) return false;
          seen.add(val);
        }
      }
    }
  }

  return true;
}

/**
 * Verify a puzzle has exactly one solution.
 */
export function hasUniqueSolution(grid: SudokuGrid): boolean {
  const testGrid = cloneGrid(grid);
  return countSolutions(testGrid, 2) === 1;
}

/**
 * Count how many given (non-zero) cells are in a grid.
 */
export function countClues(grid: SudokuGrid): number {
  let count = 0;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] !== 0) count++;
    }
  }
  return count;
}

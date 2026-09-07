import type { SudokuGrid } from '../../types/sudoku';

/**
 * Check if placing `num` at (row, col) is valid according to Sudoku rules.
 */
export function isValidPlacement(
  grid: SudokuGrid,
  row: number,
  col: number,
  num: number,
): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (grid[row][c] === num) return false;
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (grid[r][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (grid[r][c] === num) return false;
    }
  }

  return true;
}

/**
 * Find the next empty cell (value 0) in the grid.
 * Returns [row, col] or null if the grid is full.
 */
function findEmpty(grid: SudokuGrid): [number, number] | null {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) return [r, c];
    }
  }
  return null;
}

/**
 * Deep clone a 9x9 grid.
 */
export function cloneGrid(grid: SudokuGrid): SudokuGrid {
  return grid.map((row) => [...row]);
}

/**
 * Solve a Sudoku grid in-place using backtracking.
 * Returns true if a solution was found, false otherwise.
 */
export function solveSudoku(grid: SudokuGrid): boolean {
  const empty = findEmpty(grid);
  if (!empty) return true;

  const [row, col] = empty;

  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(grid, row, col, num)) {
      grid[row][col] = num;

      if (solveSudoku(grid)) return true;

      grid[row][col] = 0; // backtrack
    }
  }

  return false;
}

/**
 * Count the number of solutions for the given grid, up to `limit`.
 * Used to verify puzzle uniqueness.
 */
export function countSolutions(grid: SudokuGrid, limit = 2): number {
  const empty = findEmpty(grid);
  if (!empty) return 1;

  const [row, col] = empty;
  let count = 0;

  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(grid, row, col, num)) {
      grid[row][col] = num;

      count += countSolutions(grid, limit - count);

      grid[row][col] = 0;

      if (count >= limit) return count;
    }
  }

  return count;
}

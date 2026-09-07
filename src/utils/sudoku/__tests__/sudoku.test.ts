import { describe, it, expect } from 'vitest';
import {
  generateCompleteGrid,
  createPuzzle,
  isValidCompleteGrid,
  hasUniqueSolution,
  countClues,
} from '../generator';
import { solveSudoku, countSolutions, cloneGrid } from '../solver';
import type { SudokuGrid } from '../../../types/sudoku';

describe('generateCompleteGrid', () => {
  it('should produce a valid 9x9 grid', () => {
    const grid = generateCompleteGrid();
    expect(grid).toHaveLength(9);
    for (const row of grid) {
      expect(row).toHaveLength(9);
    }
  });

  it('should produce a valid complete Sudoku', () => {
    const grid = generateCompleteGrid();
    expect(isValidCompleteGrid(grid)).toBe(true);
  });

  it('should produce different grids on successive calls', () => {
    const grids = Array.from({ length: 3 }, () => generateCompleteGrid());
    // At least two should differ (extremely unlikely to be identical)
    const allSame = grids.every(
      (g) => JSON.stringify(g) === JSON.stringify(grids[0]),
    );
    expect(allSame).toBe(false);
  });
});

describe('createPuzzle', () => {
  it('should return a puzzle with valid solution', () => {
    const puzzle = createPuzzle('easy');
    expect(isValidCompleteGrid(puzzle.solution)).toBe(true);
  });

  it('should have difficulty metadata', () => {
    const puzzle = createPuzzle('easy');
    expect(puzzle.difficulty).toBe('easy');
    expect(puzzle.cluesCount).toBeGreaterThanOrEqual(0);
    expect(puzzle.grid).toHaveLength(9);
    expect(puzzle.solution).toHaveLength(9);
  });

  it('easy puzzle should have 36-40 clues', () => {
    const puzzle = createPuzzle('easy');
    const clues = countClues(puzzle.grid);
    expect(clues).toBeGreaterThanOrEqual(36);
    expect(clues).toBeLessThanOrEqual(40);
  });

  it('medium puzzle should have 27-35 clues', () => {
    const puzzle = createPuzzle('medium');
    const clues = countClues(puzzle.grid);
    expect(clues).toBeGreaterThanOrEqual(27);
    expect(clues).toBeLessThanOrEqual(35);
  });

  it('hard puzzle should have 17-26 clues', () => {
    const puzzle = createPuzzle('hard');
    const clues = countClues(puzzle.grid);
    expect(clues).toBeGreaterThanOrEqual(17);
    expect(clues).toBeLessThanOrEqual(26);
  });

  it('puzzle should have a unique solution', () => {
    const puzzle = createPuzzle('medium');
    expect(hasUniqueSolution(puzzle.grid)).toBe(true);
  });

  it('puzzle grid should only contain given cells and zeros', () => {
    const puzzle = createPuzzle('easy');
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = puzzle.grid[r][c];
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(9);
      }
    }
  });
});

describe('isValidCompleteGrid', () => {
  it('should accept a valid grid', () => {
    const grid: SudokuGrid = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ];
    expect(isValidCompleteGrid(grid)).toBe(true);
  });

  it('should reject a grid with duplicate in row', () => {
    const grid: SudokuGrid = [
      [5, 3, 3, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ];
    expect(isValidCompleteGrid(grid)).toBe(false);
  });

  it('should reject a grid with duplicate in column', () => {
    const grid: SudokuGrid = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 5], // duplicate 5 in last column
    ];
    expect(isValidCompleteGrid(grid)).toBe(false);
  });
});

describe('solveSudoku', () => {
  it('should solve a solvable puzzle', () => {
    const grid: SudokuGrid = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ];
    const result = solveSudoku(grid);
    expect(result).toBe(true);
    expect(isValidCompleteGrid(grid)).toBe(true);
  });
});

describe('countSolutions', () => {
  it('should count 1 for a puzzle with unique solution', () => {
    const grid: SudokuGrid = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ];
    // Already complete — exactly 1 solution
    const count = countSolutions(cloneGrid(grid), 2);
    expect(count).toBe(1);
  });

  it('should count at least 2 for an incomplete grid with multiple solutions', () => {
    // Nearly empty grid — definitely has multiple solutions
    const grid: SudokuGrid = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    const count = countSolutions(cloneGrid(grid), 2);
    expect(count).toBeGreaterThanOrEqual(2);
  });
});

describe('hasUniqueSolution', () => {
  it('should return true for a complete grid', () => {
    const grid: SudokuGrid = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ];
    expect(hasUniqueSolution(grid)).toBe(true);
  });

  it('should return false for a nearly empty grid', () => {
    const grid: SudokuGrid = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    expect(hasUniqueSolution(grid)).toBe(false);
  });
});

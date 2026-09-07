# Issue #2: Sudoku Puzzle Generator Algorithm — Plan

## Approach

1. **Types** (`src/types/sudoku.ts`): Define SudokuGrid, SudokuCell, Difficulty, and Puzzle types
2. **Solver** (`src/utils/sudoku/solver.ts`): Backtracking solver + solution counter
3. **Generator** (`src/utils/sudoku/generator.ts`): Complete grid generation + puzzle creation with uniqueness guarantee
4. **Tests** (`src/utils/sudoku/__tests__/`): Unit tests for all functions
5. **Exports**: Wire up from index.ts files

## Key Design Decisions

- Use number[][] (0 = empty) as the grid representation for performance
- Backtracking algorithm for both solving and generation
- Randomized number selection during grid generation for variety
- Solution counting with early termination (limit=2) for uniqueness check
- Difficulty ranges: Easy 36-40, Medium 27-35, Hard 17-26 clues

## Implementation Order

1. Types first (no dependencies)
2. Solver (depends on types)
3. Generator (depends on types + solver)
4. Tests (depends on all above)

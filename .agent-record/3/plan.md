# Plan: Issue #3 — Sudoku Puzzle Solver/Validator

## Branch
`issue-3-solver-validator` off `main`

## Approach
Most solver/validator functions already exist from Issue #2. The only missing acceptance criterion is **hint functionality** (reveal a cell).

### Changes
1. **Add `getHint()` to `src/utils/sudoku/solver.ts`**
   - Collects all empty cells (value 0) from the puzzle grid
   - Picks one at random using `Math.floor(Math.random() * emptyCells.length)`
   - Returns `{ row, col, value }` from the solution grid
   - Returns `null` when no empty cells remain (puzzle complete)

2. **Export from `src/utils/sudoku/index.ts`**
   - Add `getHint` to the solver exports

3. **Add unit tests in `src/utils/sudoku/__tests__/sudoku.test.ts`**
   - Returns valid hint for incomplete puzzle
   - Returns `null` for complete puzzle
   - Hint value matches the solution

## Verification
- `tsc --noEmit` — clean
- `npx vitest run` — 21/21 pass
- `npm run lint` — clean

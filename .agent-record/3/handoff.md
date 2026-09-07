# Handoff: Issue #3 — Sudoku Puzzle Solver/Validator

## Status: DONE ✅

## PR
https://github.com/e23thr/sudoku-webgame/pull/14

## Branch
`issue-3-solver-validator`

## What was done
Added the only missing piece from Issue #3: **hint functionality** (`getHint()`).

### Files modified
| File | Change |
|------|--------|
| `src/utils/sudoku/solver.ts` | Added `getHint(grid, solution)` function |
| `src/utils/sudoku/index.ts` | Added `getHint` to exports |
| `src/utils/sudoku/__tests__/sudoku.test.ts` | Added 3 test cases for `getHint()` |

### Acceptance Criteria
- [x] Check if a number placement is valid — already existed
- [x] Validate complete puzzle solution — already existed
- [x] **Provide hints (reveal a cell)** — `getHint()` added ✅
- [x] Unit tests for all validation functions — 3 new tests added ✅

## Verification
- ✅ TypeScript compiles (`tsc --noEmit`)
- ✅ All 21 tests pass (`npx vitest run`)
- ✅ Lint clean (`npm run lint`)

## How `getHint()` works
1. Scans the grid for all cells with value 0 (empty)
2. If no empty cells → returns `null`
3. Picks one empty cell at random
4. Returns `{ row, col, value }` where value comes from the solution grid

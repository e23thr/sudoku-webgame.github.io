# Issue #35: New Puzzle button does not generate new board when confirmed

## Problem
The 'New Puzzle' button shows a confirmation dialog, but after confirming, the board doesn't change. The puzzle remains the same.

## Root Cause
The `useSudokuGame` hook in `src/hooks/useSudokuGame.ts` uses `useReducer` which only initializes state once on mount. When the puzzle prop changes (via `setPuzzle(createPuzzle(difficulty))` in App.tsx), the hook doesn't detect the change and never resets the game state.

## Solution
Added a `useEffect` with `useRef` to track the previous puzzle ID. When `puzzleId` changes (indicating a new puzzle was created), it automatically dispatches `NEW_GAME` to reset the board with the new puzzle.

## Implementation Details

### Files Modified
- `src/hooks/useSudokuGame.ts`

### Changes Made
1. Added `useRef` to React imports
2. Added `useRef` to track previous puzzle ID (`prevPuzzleIdRef`)
3. Added `useEffect` to detect puzzle changes and call `newGame(initialPuzzle)`

### Code Changes
```typescript
// Added useRef to imports
import { useReducer, useCallback, useEffect, useState, useRef } from 'react';

// Added after newGame definition
const prevPuzzleIdRef = useRef(puzzleId);
useEffect(() => {
  if (prevPuzzleIdRef.current !== puzzleId) {
    prevPuzzleIdRef.current = puzzleId;
    newGame(initialPuzzle);
  }
}, [puzzleId, initialPuzzle, newGame]);
```

## Verification
- ✅ Lint passes (no errors)
- ✅ Build succeeds (TypeScript compilation + Vite build)
- ✅ Commit created and pushed to branch `fix-35-new-puzzle-reset`
- ✅ PR #36 opened: https://github.com/e23thr/sudoku-webgame/pull/36

## PR Details
- **Branch**: `fix-35-new-puzzle-reset`
- **PR Number**: #36
- **PR URL**: https://github.com/e23thr/sudoku-webgame/pull/36
- **Commit Message**: `fix: detect puzzle prop changes in useSudokuGame hook`

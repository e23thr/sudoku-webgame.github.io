## Summary

Implements game state management including timer, game status tracking, and localStorage persistence.

## Changes

### Game Status
- Added `GameStatus` type: `'playing' | 'paused' | 'completed'`
- Completion detected automatically by comparing grid to solution
- Game status is derived from grid state (not stored separately)

### Timer
- New `Timer` component displays elapsed time in MM:SS format
- Pause/resume button with visual feedback
- Timer pauses when game is paused, stops on completion
- Keyboard shortcut: Space to toggle pause

### localStorage Persistence
- New `src/utils/storage.ts` with save/load/clear utilities
- Auto-saves on every move (grid, notes, timer, difficulty)
- Handles storage errors gracefully (quota, corrupt data)
- Loads saved game on app mount
- "Saved" badge shown in subtitle when game is persisted

### Pause Experience
- Board blurs and becomes unclickable when paused
- Overlay shows pause icon with resume hint
- Input is fully disabled during pause

### Completion Celebration
- Shows celebration overlay with emoji, time, and "New Puzzle" button
- Timer turns green on completion

### Difficulty Selector
- Easy/Medium/Hard buttons in footer
- Starting a new difficulty clears saved game

## Files Changed
- `src/hooks/useSudokuGame.ts` - timer, status, auto-save, derived completion
- `src/components/Timer.tsx` - new timer display component
- `src/components/SudokuBoard.tsx` - integrated timer, pause, completion
- `src/utils/storage.ts` - new localStorage utilities
- `src/types/sudoku.ts` - added GameStatus type
- `src/App.tsx` - saved game loading, difficulty selector
- `src/styles/sudoku.css` - timer, overlay, completion styles

## Verification
- [x] TypeScript compiles clean
- [x] ESLint passes
- [x] Vite build succeeds
- [x] Existing undo/redo preserved

Closes #6

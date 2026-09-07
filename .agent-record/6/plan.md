# Issue #6: Game State Management — Plan

## Goal
Add game status tracking, timer with pause/resume, and localStorage persistence to the Sudoku game.

## Approach

### 1. Types (`src/types/sudoku.ts`)
- Add `GameStatus = 'playing' | 'paused' | 'completed'`

### 2. localStorage Utilities (`src/utils/storage.ts`)
- `saveGameState(state)` — serialize grid, notes, timer, difficulty, puzzleId, solution
- `loadGameState()` — deserialize with try/catch for corrupt data
- `clearGameState()` — remove saved game
- Use `STORAGE_KEY = 'sudoku-webgame-state'`

### 3. Update `useSudokuGame` hook (`src/hooks/useSudokuGame.ts`)
- Add `gameStatus: GameStatus` state
- Add `timer: number` state (seconds)
- Add `solution: SudokuGrid` for completion detection
- Add `difficulty` and `puzzleId` to track which puzzle is saved
- Add `pause()` / `resume()` / `newGame()` actions
- Add `checkCompletion()` — compare grid to solution
- Timer useEffect: increment when `gameStatus === 'playing'`
- Auto-save useEffect: persist to localStorage on every state change
- Load saved state on mount from localStorage
- Accept `initialSolution` and `initialDifficulty` params

### 4. Timer Component (`src/components/Timer.tsx`)
- Displays `MM:SS` format
- Pause/resume toggle button
- Visual styling when paused (dimmed or color change)

### 5. Update `SudokuBoard` (`src/components/SudokuBoard.tsx`)
- Accept `solution` prop (already optional)
- Pass solution to useSudokuGame
- Show Timer component above the board
- Show completion overlay/message
- Disable input when paused
- Accept `onNewGame` callback

### 6. Update `App.tsx`
- On mount, try loading saved game from localStorage
- If saved game exists, continue with loaded state
- If no saved game, generate new puzzle
- "New Puzzle" button clears saved state and generates new puzzle
- Show difficulty selector

### 7. Styles
- Timer styles in `sudoku.css`
- Pause overlay styles
- Completion celebration styles

## Files to Create
- `src/utils/storage.ts`
- `src/components/Timer.tsx`
- `.agent-record/6/plan.md`
- `.agent-record/6/handoff.md`

## Files to Modify
- `src/types/sudoku.ts`
- `src/hooks/useSudokuGame.ts`
- `src/components/SudokuBoard.tsx`
- `src/components/index.ts`
- `src/App.tsx`
- `src/styles/sudoku.css`
- `src/utils/index.ts`

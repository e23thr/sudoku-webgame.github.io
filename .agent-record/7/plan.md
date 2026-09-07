# Issue #7: History and Statistics Tracking — Implementation Plan

## Approach

### 1. IndexedDB Utilities (`src/utils/db.ts`)
- Use the `idb` library for a clean async IndexedDB API
- Create a single `sudoku-webgame` database with a `completedGames` object store
- Indexes: `by-difficulty` and `by-date` for efficient querying
- Functions: `saveCompletedGame`, `getCompletedGames`, `clearHistory`, `getStatistics`
- Graceful fallback when IndexedDB is unavailable (incognito mode)

### 2. Types (`src/types/history.ts`)
- `CompletedGame` — stores puzzle, solution, difficulty, time, completion date
- `GameStatistics` — aggregated stats: games played, win rate, best/average times per difficulty

### 3. Components
- **StatisticsCard** — displays summary stats and per-difficulty best/average times
- **HistoryPanel** — scrollable list with difficulty filter, clear button with confirmation
- **App.tsx** — adds Game/History tab navigation

### 4. Game Completion Detection
- SudokuBoard dispatches a `sudoku-game-completed` CustomEvent when the user clicks "New Puzzle" after completing
- App.tsx listens and saves to IndexedDB

### 5. CSS
- Navigation tabs, history panel, statistics card, filter buttons, history list items
- Mobile responsive styles

## Files Changed
- `src/types/history.ts` (new)
- `src/types/index.ts` (updated exports)
- `src/utils/db.ts` (new)
- `src/utils/index.ts` (updated exports)
- `src/components/HistoryPanel.tsx` (new)
- `src/components/StatisticsCard.tsx` (new)
- `src/components/index.ts` (updated exports)
- `src/components/SudokuBoard.tsx` (dispatch completion event)
- `src/App.tsx` (history tab, event listener)
- `src/App.css` (new styles)
- `package.json` (idb dependency)

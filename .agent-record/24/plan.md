# Issue #24: Add Visible Play/Resume Button When Game is Paused

## Problem
When the game was paused, the only way to resume was pressing Space on the keyboard. The pause overlay said "Press Space or click ▶ to resume" but the ▶ button was only in the Timer component at the top of the page — not on the full-screen overlay itself. Users couldn't see or click it.

## Solution
Add a prominent "▶ Resume" button directly inside the pause overlay, styled to be eye-catching and easy to find.

## Changes

### src/components/SudokuBoard.tsx
- Replaced the static hint text `<p>` with a clickable `<button>` element
- Button calls `togglePause` on click
- Added `aria-label="Resume game"` for accessibility
- Updated hint text to "or press Space to resume"

### src/styles/sudoku.css
- Added `.pause-resume-btn` styles:
  - Green background (`var(--correct)`)
  - Large size (180px × 52px minimum)
  - Hover effect (scale + brightness)
  - Active state (press down)
  - Pulse animation (`resumeBtnPulse`) to draw attention
- Added mobile responsive styles for the button (smaller on 480px screens)

### src/components/index.ts
- Removed duplicate `ConfirmationModal` export (pre-existing build fix)

## Testing
- TypeScript compilation: ✅ Clean
- Vite production build: ✅ Successful
- PR: https://github.com/e23thr/sudoku-webgame/pull/31

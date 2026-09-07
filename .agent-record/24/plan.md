# Plan: Fix #24 — Add visible play/resume button when game is paused

## Branch
`fix-24-pause-button-v2` off `main`

## Problem
The pause overlay shows "Game Paused" text and a hint to press Space, but there is no clickable button to resume with the mouse. Users on desktop and especially mobile need a visible button.

## Approach
The CSS already had `.pause-resume-btn` styles (green, large, pulse animation, mobile responsive) from a prior `fix-24-pause-button` branch. The fix is a one-line JSX change: add the button inside the pause overlay.

## Changes
1. **src/components/SudokuBoard.tsx** (line 224): Replace the hint-only overlay with:
   - Heading: "Game Paused"
   - Button: `<button className="pause-resume-btn" onClick={togglePause}>▶ Resume</button>`
   - Hint text: "Press Space to resume"

## Verification
- [x] `tsc --noEmit` passes
- [x] `vite build` succeeds
- [x] PR: https://github.com/e23thr/sudoku-webgame/pull/33

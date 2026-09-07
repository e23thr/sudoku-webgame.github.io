# Issue #27: New Puzzle Button with Confirmation — Handoff

## Status: ✅ Complete

## Summary
Implemented a confirmation dialog that appears before generating a new puzzle, warning users that their current progress will be lost.

## What Was Done

### ConfirmationModal Component (`src/components/ConfirmationModal.tsx`)
- Reusable dialog with title, message, confirm/cancel buttons
- Uses `<div>` overlay (not `<dialog>`) for JSDOM test compatibility
- Keyboard accessible: Escape to cancel, auto-focus on confirm button
- Backdrop click to dismiss
- ARIA compliant: `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`

### App.tsx Changes
- Added `showNewPuzzleConfirm` state to control dialog visibility
- Extracted `generateNewPuzzle` callback (clears localStorage, creates puzzle)
- `handleNewPuzzle` now shows confirmation dialog instead of directly generating
- `handleNewPuzzleAfterCompletion` calls `generateNewPuzzle` directly (no confirmation needed after completion)
- ConfirmationModal renders with appropriate props

### Tests
- Dialog appears when clicking "New Puzzle"
- Dialog contains warning: "Your current progress will be lost"
- "Start New Puzzle" button generates new puzzle and closes dialog
- "Keep Current" button closes dialog without generating new puzzle
- Uses `getAllByRole('dialog')` for React StrictMode compatibility

## Key Decisions
1. **Div-based overlay instead of `<dialog>`**: The `<dialog>` element's `showModal()` method doesn't work in JSDOM (the test environment), so we use a div with CSS for the overlay behavior
2. **No confirmation after completion**: When the game is completed and user clicks "New Puzzle" from the victory overlay, we generate directly without confirmation since there's no progress to lose
3. **Reusable component**: The ConfirmationModal is generic and can be reused for other confirmation flows (e.g., difficulty change)

## Test Results
- All 46 tests pass (25 App tests + 21 Sudoku tests)
- Build passes (`npm run build`)
- Lint passes (`npm run lint`)

## Files to Review
- `src/components/ConfirmationModal.tsx` — The new modal component
- `src/components/ConfirmationModal.css` — Theme-aware styling
- `src/App.tsx` — Lines 51-72 (state + handlers), Lines 212-220 (JSX)
- `src/__tests__/App.test.tsx` — "can generate a new puzzle with confirmation" and "can cancel new puzzle from confirmation dialog"

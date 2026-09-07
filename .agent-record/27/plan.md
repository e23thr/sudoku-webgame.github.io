# Issue #27: New Puzzle Button with Confirmation

## Objective
Add a confirmation dialog before generating a new puzzle to prevent accidental loss of game progress.

## Acceptance Criteria
- [x] Show confirmation dialog before generating new puzzle
- [x] Warn user that current progress will be lost
- [x] Confirm generates new puzzle with current difficulty
- [x] Cancel option to keep current puzzle
- [x] Clear localStorage game state on confirm

## Implementation Plan

### 1. Create ConfirmationModal Component
- **File**: `src/components/ConfirmationModal.tsx`
- Reusable dialog component with title, message, confirm/cancel buttons
- Uses div-based overlay (not `<dialog>`) for JSDOM test compatibility
- Keyboard accessible: Escape to cancel, auto-focus on confirm button
- Backdrop click to dismiss
- ARIA attributes: `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`

### 2. Style the Modal
- **File**: `src/components/ConfirmationModal.css`
- Fixed overlay with backdrop blur
- Themed using CSS variables (`--bg`, `--text`, `--btn-bg`, etc.)
- Responsive design (max-width 420px, 90% width on mobile)
- Confirm button uses primary theme color
- Cancel button uses nav styling

### 3. Modify App.tsx
- Add `showNewPuzzleConfirm` state
- Extract puzzle generation logic into `generateNewPuzzle` callback
- `handleNewPuzzle` sets `showNewPuzzleConfirm = true`
- `handleConfirmNewPuzzle` closes dialog and calls `generateNewPuzzle`
- `handleCancelNewPuzzle` closes dialog
- `handleNewPuzzleAfterCompletion` calls `generateNewPuzzle` directly (no confirmation after completion)
- Render `<ConfirmationModal>` with "New Puzzle" dialog props

### 4. Update Tests
- Test dialog appears when clicking "New Puzzle"
- Test dialog contains warning message about lost progress
- Test confirm button generates new puzzle
- Test cancel button closes dialog without generating new puzzle
- Use `getAllByRole('dialog')` for React StrictMode compatibility

## Files Changed
| File | Change |
|------|--------|
| `src/components/ConfirmationModal.tsx` | New reusable modal component |
| `src/components/ConfirmationModal.css` | Modal styling with theme support |
| `src/components/index.ts` | Export ConfirmationModal |
| `src/App.tsx` | Added new puzzle confirmation dialog flow |

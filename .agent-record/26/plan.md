# Issue #26: Difficulty Change Confirmation and Game Reset

## Goal
Add a confirmation dialog that appears when the user tries to change difficulty or start a new puzzle, warning them that their current progress will be lost.

## Approach
1. Create a reusable `ConfirmationModal` component using overlay + `role="dialog"` (div-based, not `<dialog>` element, to work in JSDOM tests)
2. Add state management for pending difficulty and modal visibility in `App.tsx`
3. Update `handleDifficultyChange` to show the confirmation modal instead of immediately resetting
4. Add handlers for confirm (reset game + generate new puzzle) and cancel (close modal)
5. Update tests to account for the confirmation dialog flow

## Files Modified
- `src/components/ConfirmationModal.tsx` — New modal component
- `src/components/ConfirmationModal.css` — Modal styling
- `src/components/index.ts` — Export ConfirmationModal
- `src/App.tsx` — Add confirmation state, handlers, and modal rendering
- `src/__tests__/App.test.tsx` — Updated tests for confirmation dialogs

## Verification
- All 46 tests pass
- Lint clean
- Build succeeds
- PR: https://github.com/e23thr/sudoku-webgame/pull/32

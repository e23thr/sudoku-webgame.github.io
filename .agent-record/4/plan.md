# Issue #4: Game Board UI Component — Plan

## Approach
Build a visually appealing 9×9 Sudoku grid using CSS Grid with 3×3 box borders. Use React state to track selected cell and compute highlights for same row/col/box/number. Fully responsive with `min(90vw, 450px)` sizing.

## Files to Create/Modify

1. **`src/types/sudoku.ts`** — Add `CellPosition` interface
2. **`src/components/SudokuCell.tsx`** — Individual cell component with click handler and state classes
3. **`src/components/SudokuBoard.tsx`** — 9×9 grid with selection logic and highlight computation
4. **`src/styles/sudoku.css`** — Grid layout, box borders, cell states, responsive sizing, colorful theme
5. **`src/App.tsx`** — Render SudokuBoard with generated puzzle
6. **`src/components/index.ts`** — Export new components

## Highlight Logic
- Selected cell: `#bbdefb` (light blue)
- Same row/col/box: `#e3f2fd` (very light blue)
- Same number: `#c8e6c9` (light green)
- Given numbers: bold, dark color
- User input: medium weight, slightly lighter

## Responsive Strategy
- Board width: `min(90vw, 450px)` with `aspect-ratio: 1`
- Cells auto-size via `grid-template-columns: repeat(9, 1fr)`
- Font sizes scale with viewport

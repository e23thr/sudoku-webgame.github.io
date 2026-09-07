# Issue #5: Number Input and Notes System - Implementation Plan

## Overview
Add number input, notes mode, undo/redo, and keyboard support to the Sudoku game.

## Components to Create/Modify

### 1. `src/hooks/useSudokuGame.ts` (NEW)
Game state management hook using useReducer:
- Track current grid state (user entries vs givens)
- Track notes per cell (Map<string, number[]>)
- Track history for undo/redo
- Track notes mode toggle
- Actions: SET_CELL, SET_NOTE, CLEAR_CELL, TOGGLE_NOTES, UNDO, REDO

### 2. `src/components/SudokuCell.tsx` (MODIFY)
- Add `notes` prop (number[])
- Add `isUserEntry` prop to distinguish user entries from givens
- Display notes as 3x3 grid of small numbers when cell is empty

### 3. `src/components/NumberPad.tsx` (NEW)
Number pad with:
- 3x3 grid of buttons 1-9
- Clear button (X)
- Notes mode toggle button
- Visual indication of current mode

### 4. `src/components/SudokuBoard.tsx` (MODIFY)
- Integrate with useSudokuGame hook
- Pass notes to cells
- Handle keyboard events (1-9, Delete, Backspace, N, Ctrl+Z, Ctrl+Y)

### 5. `src/App.tsx` (MODIFY)
- Add NumberPad below the board

### 6. `src/styles/sudoku.css` (MODIFY)
- Add NumberPad styles
- Add notes display styles

## Implementation Order
1. Create useSudokuGame hook
2. Update SudokuCell for notes
3. Create NumberPad
4. Update SudokuBoard
5. Update App.tsx
6. Add CSS
7. Build and test

# Issue #11: Final Polish and Testing — Implementation Plan

## Goal
Add final polish: integration tests, accessibility, error boundary, loading states, performance optimization, and updated README.

## Approach

### 1. Testing Infrastructure
- Update `vite.config.ts` with vitest test configuration (jsdom environment)
- Install `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`
- Create `src/__tests__/App.test.tsx` with integration tests:
  - Full game flow: start → input → undo/redo → complete
  - Number input and notes toggle
  - Theme switching
  - Timer functionality
  - Difficulty selection

### 2. ErrorBoundary Component
- Create `src/components/ErrorBoundary.tsx` — class component catching React errors
- Display friendly error message with reset button
- Wrap App in ErrorBoundary in `main.tsx`

### 3. Accessibility
- Add ARIA labels to App nav buttons (Game, History)
- Add ARIA labels to difficulty buttons and new puzzle button
- Add `role="application"` or appropriate roles to interactive areas
- Add screen reader live region for game state announcements
- Add `aria-current="page"` for active nav tab
- Ensure keyboard navigation works (already has arrow keys, space, etc.)

### 4. Loading States
- Add loading spinner CSS for puzzle generation
- Add skeleton loading for history panel
- Smooth transitions between game/history views

### 5. Performance Optimization
- Memoize SudokuBoard with React.memo
- Lazy load HistoryPanel
- Memoize expensive highlight calculations

### 6. README Update
- Features list
- Screenshots placeholder
- Contributing guide
- License info

## Files to Create/Modify
- **Create**: `src/components/ErrorBoundary.tsx`
- **Create**: `src/__tests__/App.test.tsx`
- **Modify**: `vite.config.ts` (add vitest config)
- **Modify**: `src/main.tsx` (wrap in ErrorBoundary)
- **Modify**: `src/App.tsx` (ARIA labels, lazy HistoryPanel, loading states)
- **Modify**: `src/components/HistoryPanel.tsx` (skeleton loading)
- **Modify**: `README.md` (features, contributing, license)
- **Modify**: `package.json` (add test script, dev deps)

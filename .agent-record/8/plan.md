# Issue #8: Local Storage Persistence — Preferences

## Goal
Add user preferences persistence (theme, default difficulty, sound) to localStorage.

## Approach

1. **Extend `src/utils/storage.ts`** — Add `UserPreferences` interface, `savePreferences()`, and `loadPreferences()` with try/catch error handling, matching existing patterns.

2. **Create `src/hooks/usePreferences.ts`** — Custom hook that loads preferences on mount, exposes update function, and auto-saves changes.

3. **Update `src/App.tsx`** — Use `usePreferences` hook, apply theme class to `document.body`, pass default difficulty to `createPuzzle()`.

4. **Update `src/utils/index.ts`** — Export the new storage functions.

## Files Modified
- `src/utils/storage.ts` — Add preferences storage functions
- `src/hooks/usePreferences.ts` — New hook
- `src/App.tsx` — Wire up preferences
- `src/utils/index.ts` — Export new functions

## Verification
- `npm run build` passes
- `npm run lint` passes (or at least no new errors)

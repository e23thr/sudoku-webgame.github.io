# Issue #9: Colorful Styling and Theming - Implementation Plan

## Approach

Replace hardcoded colors in `sudoku.css` and `App.css` with CSS custom properties, then layer three theme definitions (colorful/dark/light) and a set of animation keyframes on top. A lightweight ThemeToggle component cycles themes via a `data-theme` attribute on `<html>`. The existing `usePreferences` hook already persists the theme choice; we just wire it to the new `data-theme` mechanism instead of body classes.

## Files to Create
- `src/styles/themes.css` — CSS variable definitions for all three themes
- `src/styles/animations.css` — keyframes for cell pulse, number bounce, shake, flash, victory
- `src/components/ThemeToggle.tsx` — cycle button (🎨/🌙/☀️)

## Files to Modify
- `src/styles/sudoku.css` — replace hardcoded hex colors with `var(--*)` references
- `src/App.css` — same variable substitution for app-level colors
- `src/components/SudokuCell.tsx` — add animation state props and classes
- `src/hooks/usePreferences.ts` — switch from body class to `data-theme` on `<html>`
- `src/App.tsx` — import theme CSS, mount ThemeToggle
- `src/components/index.ts` — export ThemeToggle
- `src/styles/index.ts` — import themes.css and animations.css

## Verification
- `npm run build` passes
- `npm run lint` passes (or tsc --noEmit)
- Visually confirm: theme toggle cycles, animations fire, dark/light modes work

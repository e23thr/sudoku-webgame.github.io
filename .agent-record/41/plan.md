# Issue #41: Add Base Path Prefix for GitHub Pages

## Problem
The Vite-built app has no `base` config, so all asset URLs resolve to root (`/assets/index.js`). When deployed to `https://e23thr.github.io/sudoku-webgame.github.io/`, assets fail to load because the browser requests `/assets/...` instead of `/sudoku-webgame.github.io/assets/...`.

## Solution
Add `base: '/sudoku-webgame.github.io/'` to `vite.config.ts` so Vite prefixes all asset URLs with the correct subdirectory.

## Steps
1. Create branch `fix-41-base-path` off `main`
2. Add `base: '/sudoku-webgame.github.io/'` to Vite config
3. Run `npm run build` — verify `dist/index.html` has prefixed asset paths
4. Commit, push, open PR with `Closes #41`

## Files Modified
- `vite.config.ts` — added `base` option

## Verification
- Build passes (`tsc -b && vite build`)
- `dist/index.html` confirms all `src`/`href` attributes use `/sudoku-webgame.github.io/` prefix

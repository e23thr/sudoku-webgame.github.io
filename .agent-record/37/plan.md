# Issue #37: Deploy to GitHub Pages on push to main

## Plan

### Goal
Add a GitHub Actions workflow that automatically deploys the Sudoku web app to GitHub Pages whenever code is pushed to the main branch.

### Approach
1. Create `.github/workflows/deploy.yml` with the official GitHub Pages deployment workflow
2. Configure the workflow to:
   - Trigger on push to main
   - Use actions/checkout@v4, setup-node@v4
   - Run `npm ci && npm run build`
   - Deploy the `dist/` folder using actions/deploy-pages@v4
3. Set appropriate permissions for Pages deployment
4. Run lint and build locally to verify
5. Commit, push, and open PR

### Acceptance Criteria
- [x] GitHub Action workflow file in .github/workflows/
- [x] Triggers on push to main branch
- [x] Builds the app with npm run build
- [x] Deploys to GitHub Pages
- [x] Uses official GitHub Pages deployment action

### Files Created/Modified
- `.github/workflows/deploy.yml` — new GitHub Actions workflow

### Verification
- Lint: passes
- Build: passes (43 modules transformed, dist/index.html, dist/assets/index-C-jnLFhI.css, dist/assets/index-DgeC2ddH.js)
- PR: https://github.com/e23thr/sudoku-webgame.github.io/pull/38

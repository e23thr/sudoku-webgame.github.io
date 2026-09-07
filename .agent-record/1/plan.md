# Plan: Issue #1 — Project Setup: Vite + React + TypeScript

## Goal
Initialize a Vite + React + TypeScript project in the existing repo with standard tooling (ESLint, Prettier), folder structure, and documentation.

## Steps
1. Create branch `issue-1-project-setup` off `main`
2. Initialize Vite project with `react-ts` template in repo root
3. Enable TypeScript strict mode in `tsconfig.json`
4. Install and configure ESLint + Prettier
5. Create folder structure: `components/`, `hooks/`, `utils/`, `types/`, `store/`, `styles/`
6. Write README.md with setup instructions
7. `npm install` and verify `npm run dev` + `npm run lint`
8. Commit, push, open PR

## Files to create/modify
- `tsconfig.json` (strict mode)
- `.eslintrc.cjs` or `eslint.config.js`
- `.prettierrc`
- `src/components/index.ts`, `src/hooks/index.ts`, `src/utils/index.ts`, `src/types/index.ts`, `src/store/index.ts`, `src/styles/index.ts`
- `README.md`

# AGENTS.md — Sudoku Web Game

## Project Overview
A browser-based Sudoku SPA where users play puzzles, take notes/pencil marks, track history, and enjoy a colorful, responsive UI. All state lives in the browser (localStorage/IndexedDB) — no backend.

## Tech Stack
- **Framework:** React 18+ with TypeScript
- **Build:** Vite
- **Styling:** CSS Modules or Tailwind (colorful, playful design)
- **State:** React Context + useReducer (or Zustand if needed)
- **Storage:** localStorage for game state, IndexedDB for history/statistics
- **Testing:** Vitest + React Testing Library
- **Linting:** ESLint + Prettier

## Development Guidelines
- Each feature branch should be small and focused (one issue per branch).
- Commit messages: `type(scope): short description` (conventional commits).
- No external puzzle APIs — generate puzzles client-side.
- Keep components pure and testable; business logic separated from UI.
- Prefer composition over inheritance; keep props shallow.
- Run `npm run lint` and `npm test` before opening a PR.

## Issue Labels
| Label | Purpose |
|---|---|
| `enhancement` | New feature or capability |
| `bug` | Something broken |
| `chore` | Tooling, config, housekeeping |
| `blocked-by:#N` | Cannot start until issue #N is done |
| `priority:high` | Must ship early |
| `good-first-issue` | Easy entry point |

## Project Board Columns
| Column | Meaning |
|---|---|
| **Ready** | No blockers, can start now |
| **In Progress** | Someone is working on it |
| **Review** | PR open, awaiting review |
| **Done** | Merged and verified |

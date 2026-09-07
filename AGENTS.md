# AGENTS.md — Sudoku Web Game

## Project Overview

A single-page application (SPA) Sudoku game for daily browser play. The game generates a new puzzle when the user completes the current one. All game data and progress are stored locally in the browser using localStorage/IndexedDB.

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules or Tailwind CSS (colorful theme)
- **Storage**: localStorage + IndexedDB for game state and history
- **Testing**: Vitest + React Testing Library

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Prefer functional components with hooks
- Keep components small and focused
- Use meaningful variable/function names

### File Structure
```
src/
├── components/      # React components
├── hooks/           # Custom hooks
├── utils/           # Utility functions
├── types/           # TypeScript types
├── store/           # State management
└── styles/          # Global styles
```

### Git Workflow
- Branch naming: `feature/issue-N-short-description`
- Commit messages: `feat: description` or `fix: description`
- Always reference issue number in commits

## Issue Labels

- `bug` — Something isn't working
- `enhancement` — New feature or request
- `documentation` — Improvements or additions to documentation
- `good first issue` — Good for newcomers
- `help wanted` — Extra attention is needed
- `blocked` — Blocked by another issue

## Project Board

Columns:
- **Backlog** — Issues not yet ready to work on
- **Ready** — Issues ready to be worked on
- **In Progress** — Currently being worked on
- **Review** — Ready for review
- **Done** — Completed

## Architecture Decisions

### State Management
- Use React Context + useReducer for game state
- Use Zustand or Jotai if complexity grows

### Puzzle Generation
- Generate valid Sudoku puzzles with unique solutions
- Store puzzle seed for reproducibility
- Difficulty levels: Easy, Medium, Hard

### Data Persistence
- Game state: localStorage for current game
- History: IndexedDB for completed games and statistics
- Auto-save on every move

## Testing Strategy

- Unit tests for puzzle generation/validation
- Component tests for UI interactions
- Integration tests for game flow
- E2E tests for critical paths (optional)

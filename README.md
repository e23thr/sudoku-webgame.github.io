# Sudoku Web Game

A single-page application (SPA) Sudoku game for daily browser play. The game generates a new puzzle when the user completes the current one. All game data and progress are stored locally in the browser using localStorage/IndexedDB.

## Tech Stack

- **Frontend**: React 19+ with TypeScript
- **Build Tool**: Vite
- **Linting**: ESLint + Prettier
- **Styling**: CSS Modules or Tailwind CSS (colorful theme)
- **Storage**: localStorage + IndexedDB for game state and history
- **Testing**: Vitest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting without writing |

## Project Structure

```
src/
├── components/      # React components
├── hooks/           # Custom hooks
├── utils/           # Utility functions
├── types/           # TypeScript types
├── store/           # State management
└── styles/          # Global styles
```

## License

ISC

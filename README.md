# Sudoku Web Game

A beautiful, feature-rich Sudoku puzzle game for daily browser play. Built with React 19, TypeScript, and Vite.

![Sudoku Game](./screenshots/game.png)

## Features

- **Puzzle Generation** — Unique Sudoku puzzles with 3 difficulty levels (Easy, Medium, Hard)
- **Real-time Validation** — Correct/incorrect move animations with visual feedback
- **Notes Mode** — Toggle pencil marks to track candidate numbers
- **Undo/Redo** — Full move history with keyboard shortcuts (Ctrl+Z / Ctrl+Y)
- **Timer & Pause** — Track your solve time with pause/resume (Space key)
- **Game History** — IndexedDB-backed history of completed games with statistics
- **Themes** — 3 beautiful themes: Colorful, Dark, and Light
- **Keyboard Navigation** — Arrow keys, number keys, and full keyboard support
- **Accessibility** — ARIA labels, screen reader support, high contrast mode
- **Responsive Design** — Works on desktop and mobile devices
- **Auto-Save** — Game state persisted to localStorage, resume anytime
- **Touch Gestures** — Swipe to toggle notes mode on mobile

## Screenshots

| Game Board | History | Dark Theme |
|-----------|---------|------------|
| ![Game](./screenshots/game.png) | ![History](./screenshots/history.png) | ![Dark](./screenshots/dark.png) |

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
# Clone the repository
git clone https://github.com/e23thr/sudoku-webgame.git
cd sudoku-webgame

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
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format code with Prettier |

### Docker Development

Run the dev server inside Docker with live reload:

```bash
# Build and start
docker compose up

# Or run in the background
docker compose up -d

# Stop
docker compose down
```

The app will be available at http://localhost:5173 with volume-mounted source for live reload.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1-9` | Enter number |
| `Delete` / `Backspace` | Clear cell |
| `Arrow keys` | Navigate cells |
| `Space` | Pause/Resume |
| `N` | Toggle notes mode |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Redo |

## Project Structure

```
src/
├── components/      # React components
│   ├── SudokuBoard.tsx    # Main game board
│   ├── SudokuCell.tsx     # Individual cell
│   ├── NumberPad.tsx      # Number input pad
│   ├── Timer.tsx          # Game timer
│   ├── HistoryPanel.tsx   # Game history (lazy loaded)
│   ├── StatisticsCard.tsx # Statistics display
│   ├── ThemeToggle.tsx    # Theme switcher
│   └── ErrorBoundary.tsx  # Error handling
├── hooks/           # Custom hooks
│   ├── useSudokuGame.ts   # Game state management
│   └── usePreferences.ts  # User preferences
├── utils/           # Utility functions
│   ├── sudoku/            # Puzzle generation & solving
│   ├── storage.ts         # localStorage management
│   └── db.ts              # IndexedDB operations
├── types/           # TypeScript types
├── styles/          # CSS styles
│   ├── themes.css         # Theme definitions
│   ├── animations.css     # Animations & transitions
│   ├── sudoku.css         # Game board styles
│   └── loading.css        # Loading & skeleton states
└── __tests__/       # Integration tests
```

## Tech Stack

- **Frontend**: React 19+ with TypeScript
- **Build Tool**: Vite 8
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier
- **Storage**: localStorage + IndexedDB

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Code style changes
- `refactor:` — Code refactoring
- `test:` — Adding tests
- `chore:` — Maintenance tasks

## License

ISC

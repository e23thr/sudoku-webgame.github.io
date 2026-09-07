/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock IndexedDB
const mockDB = {
  transaction: vi.fn(() => ({
    objectStore: vi.fn(() => ({
      get: vi.fn(() => Promise.resolve(undefined)),
      getAll: vi.fn(() => Promise.resolve([])),
      put: vi.fn(() => Promise.resolve()),
      delete: vi.fn(() => Promise.resolve()),
      clear: vi.fn(() => Promise.resolve()),
      index: vi.fn(() => ({
        getAll: vi.fn(() => Promise.resolve([])),
      })),
    })),
    done: Promise.resolve(),
  })),
  objectStoreNames: { contains: vi.fn(() => true) },
  createObjectStore: vi.fn(),
  createIndex: vi.fn(),
};

vi.mock('idb', () => ({
  openDB: vi.fn(() => Promise.resolve(mockDB)),
}));

describe('App', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('renders the Sudoku title', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('🧩 Sudoku');
  });

  it('renders difficulty buttons', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /select easy/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /select medium/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /select hard/i })).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(<App />);
    const nav = screen.getByRole('navigation', { name: /game navigation/i });
    expect(within(nav).getByText(/Game/)).toBeInTheDocument();
    expect(within(nav).getByText(/History/)).toBeInTheDocument();
  });

  it('renders the new puzzle button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /generate new puzzle/i })).toBeInTheDocument();
  });

  it('renders the theme toggle', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /switch theme/i })).toBeInTheDocument();
  });

  it('shows difficulty and clues in subtitle', () => {
    render(<App />);
    expect(screen.getByText(/Difficulty:/)).toBeInTheDocument();
    expect(screen.getByText(/clues/)).toBeInTheDocument();
  });

  it('displays the sudoku board with cells', () => {
    render(<App />);
    const cells = screen.getAllByRole('button', { name: /cell row/i });
    expect(cells).toHaveLength(81);
  });

  it('can select a cell by clicking', async () => {
    const user = userEvent.setup();
    render(<App />);
    const cells = screen.getAllByRole('button', { name: /cell row/i });
    await user.click(cells[0]);
    expect(cells[0].className).toContain('sudoku-cell--selected');
  });

  it('can input a number into an empty cell', async () => {
    const user = userEvent.setup();
    render(<App />);
    const cells = screen.getAllByRole('button', { name: /cell row/i });
    const emptyCell = cells.find(c => c.getAttribute('aria-label')?.includes('empty'));
    if (!emptyCell) return;
    await user.click(emptyCell);
    await user.click(screen.getByRole('button', { name: /enter number 5/i }));
    const updatedLabel = emptyCell.getAttribute('aria-label') || '';
    expect(updatedLabel).toContain('5');
  });

  it('can toggle notes mode', async () => {
    const user = userEvent.setup();
    render(<App />);
    const notesButton = screen.getByRole('button', { name: /switch to notes mode/i });
    expect(notesButton).toBeInTheDocument();
    await user.click(notesButton);
    expect(screen.getByRole('button', { name: /switch to normal mode/i })).toBeInTheDocument();
  });

  it('can undo and redo', async () => {
    const user = userEvent.setup();
    render(<App />);
    const cells = screen.getAllByRole('button', { name: /cell row/i });
    const emptyCell = cells.find(c => c.getAttribute('aria-label')?.includes('empty'));
    if (!emptyCell) return;
    await user.click(emptyCell);
    await user.click(screen.getByRole('button', { name: /enter number 3/i }));
    const undoButton = screen.getByRole('button', { name: /undo$/i });
    expect(undoButton).not.toBeDisabled();
    await user.click(undoButton);
    const afterUndo = emptyCell.getAttribute('aria-label') || '';
    expect(afterUndo).toContain('empty');
    const redoButton = screen.getByRole('button', { name: /redo$/i });
    expect(redoButton).not.toBeDisabled();
  });

  it('can clear a cell', async () => {
    const user = userEvent.setup();
    render(<App />);
    const cells = screen.getAllByRole('button', { name: /cell row/i });
    const emptyCell = cells.find(c => c.getAttribute('aria-label')?.includes('empty'));
    if (!emptyCell) return;
    await user.click(emptyCell);
    await user.click(screen.getByRole('button', { name: /enter number 7/i }));
    await user.click(screen.getByRole('button', { name: /clear cell/i }));
    const afterClear = emptyCell.getAttribute('aria-label') || '';
    expect(afterClear).toContain('empty');
  });

  it('switches to history view', async () => {
    const user = userEvent.setup();
    render(<App />);
    const nav = screen.getByRole('navigation', { name: /game navigation/i });
    await user.click(within(nav).getByText(/History/));
    await waitFor(() => {
      expect(screen.getByText(/History & Statistics/)).toBeInTheDocument();
    });
  });

  it('switches back to game view from history', async () => {
    const user = userEvent.setup();
    render(<App />);
    const nav = screen.getByRole('navigation', { name: /game navigation/i });
    await user.click(within(nav).getByText(/History/));
    await waitFor(() => {
      expect(screen.getByText(/History & Statistics/)).toBeInTheDocument();
    });
    await user.click(within(nav).getByText(/Game/));
    const cells = screen.getAllByRole('button', { name: /cell row/i });
    expect(cells).toHaveLength(81);
  });

  it('can change difficulty', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /select easy/i }));
    expect(screen.getByText('easy')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /select hard/i }));
    expect(screen.getByText('hard')).toBeInTheDocument();
  });

  it('can generate a new puzzle with confirmation', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByText(/clues/)).toBeInTheDocument();

    // Click "New Puzzle" — should show confirmation dialog
    await user.click(screen.getByRole('button', { name: /generate new puzzle/i }));

    // Dialog should appear with warning message (use getAll for StrictMode compat)
    const dialogs = screen.getAllByRole('dialog');
    expect(dialogs.length).toBeGreaterThan(0);
    const dialog = dialogs[0];
    expect(within(dialog).getByText(/current progress will be lost/i)).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /keep current/i })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /start new puzzle/i })).toBeInTheDocument();

    // Confirm — should generate new puzzle
    await user.click(within(dialog).getByRole('button', { name: /start new puzzle/i }));

    // Dialog should be gone, puzzle should still show clues
    expect(screen.queryAllByRole('dialog')).toHaveLength(0);
    expect(screen.getByText(/clues/)).toBeInTheDocument();
  });

  it('can cancel new puzzle from confirmation dialog', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click "New Puzzle" — should show confirmation dialog
    await user.click(screen.getByRole('button', { name: /generate new puzzle/i }));

    const dialogs = screen.getAllByRole('dialog');
    expect(dialogs.length).toBeGreaterThan(0);
    const dialog = dialogs[0];

    // Cancel — should close dialog without generating new puzzle
    await user.click(within(dialog).getByRole('button', { name: /keep current/i }));

    // Dialog should be gone
    expect(screen.queryAllByRole('dialog')).toHaveLength(0);
  });

  it('has proper ARIA labels on navigation', () => {
    render(<App />);
    expect(screen.getByRole('navigation', { name: /game navigation/i })).toBeInTheDocument();
  });

  it('has proper ARIA labels on difficulty group', () => {
    render(<App />);
    expect(screen.getByRole('group', { name: /difficulty selection/i })).toBeInTheDocument();
  });

  it('can pause and resume with spacebar', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.keyboard(' ');
    await waitFor(() => {
      expect(screen.getByText('Game Paused')).toBeInTheDocument();
    });
    await user.keyboard(' ');
    await waitFor(() => {
      expect(screen.queryByText('Game Paused')).not.toBeInTheDocument();
    });
  });

  it('can navigate cells with arrow keys', async () => {
    const user = userEvent.setup();
    render(<App />);
    const cells = screen.getAllByRole('button', { name: /cell row/i });
    await user.click(cells[0]);
    expect(cells[0].className).toContain('sudoku-cell--selected');
    await user.keyboard('{ArrowRight}');
    expect(cells[1].className).toContain('sudoku-cell--selected');
  });

  it('can enter numbers with keyboard', async () => {
    const user = userEvent.setup();
    render(<App />);
    const cells = screen.getAllByRole('button', { name: /cell row/i });
    const emptyCell = cells.find(c => c.getAttribute('aria-label')?.includes('empty'));
    if (!emptyCell) return;
    await user.click(emptyCell);
    await user.keyboard('5');
    const updatedLabel = emptyCell.getAttribute('aria-label') || '';
    expect(updatedLabel).toContain('5');
  });

  it('can delete with keyboard', async () => {
    const user = userEvent.setup();
    render(<App />);
    const cells = screen.getAllByRole('button', { name: /cell row/i });
    const emptyCell = cells.find(c => c.getAttribute('aria-label')?.includes('empty'));
    if (!emptyCell) return;
    await user.click(emptyCell);
    await user.keyboard('5');
    await user.keyboard('{Backspace}');
    const afterDelete = emptyCell.getAttribute('aria-label') || '';
    expect(afterDelete).toContain('empty');
  });

  it('can toggle notes with N key', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole('button', { name: /switch to notes mode/i })).toBeInTheDocument();
    await user.keyboard('n');
    expect(screen.getByRole('button', { name: /switch to normal mode/i })).toBeInTheDocument();
  });
});

describe('ErrorBoundary', () => {
  it('renders children normally when no error', () => {
    render(<div><App /></div>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});

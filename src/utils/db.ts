import { openDB, type IDBPDatabase } from 'idb';
import type { Difficulty } from '../types/sudoku';
import type { CompletedGame, GameStatistics } from '../types/history';

const DB_NAME = 'sudoku-webgame';
const DB_VERSION = 1;
const STORE_NAME = 'completedGames';

interface SudokuDBSchema {
  completedGames: {
    key: string;
    value: CompletedGame;
    indexes: {
      'by-difficulty': Difficulty;
      'by-date': string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<SudokuDBSchema>> | null = null;

/** Open or create the IndexedDB database */
function getDB(): Promise<IDBPDatabase<SudokuDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<SudokuDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('by-difficulty', 'difficulty');
          store.createIndex('by-date', 'completedAt');
        }
      },
    });
  }
  return dbPromise;
}

/** Check if IndexedDB is available */
function isIndexedDBAvailable(): boolean {
  try {
    return typeof indexedDB !== 'undefined' && indexedDB !== null;
  } catch {
    return false;
  }
}

/** Save a completed game to IndexedDB */
export async function saveCompletedGame(game: CompletedGame): Promise<boolean> {
  if (!isIndexedDBAvailable()) {
    console.warn('IndexedDB not available — game history not saved');
    return false;
  }

  try {
    const db = await getDB();
    await db.put(STORE_NAME, game);
    return true;
  } catch (err) {
    console.warn('Failed to save completed game:', err);
    return false;
  }
}

/** Retrieve completed games, optionally filtered by difficulty */
export async function getCompletedGames(
  difficulty?: Difficulty,
): Promise<CompletedGame[]> {
  if (!isIndexedDBAvailable()) return [];

  try {
    const db = await getDB();
    let games: CompletedGame[];

    if (difficulty) {
      games = await db.getAllFromIndex(STORE_NAME, 'by-difficulty', difficulty);
    } else {
      games = await db.getAll(STORE_NAME);
    }

    // Sort by completion date, most recent first
    return games.sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );
  } catch (err) {
    console.warn('Failed to load game history:', err);
    return [];
  }
}

/** Delete all completed games from IndexedDB */
export async function clearHistory(): Promise<boolean> {
  if (!isIndexedDBAvailable()) return false;

  try {
    const db = await getDB();
    await db.clear(STORE_NAME);
    return true;
  } catch (err) {
    console.warn('Failed to clear history:', err);
    return false;
  }
}

/** Compute statistics from stored games */
export async function getStatistics(): Promise<GameStatistics> {
  const games = await getCompletedGames();
  return calculateStatistics(games);
}

/** Calculate statistics from a list of completed games */
export function calculateStatistics(games: CompletedGame[]): GameStatistics {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  const stats: GameStatistics = {
    gamesPlayed: games.length,
    gamesWon: games.length,
    winRate: games.length > 0 ? 100 : 0,
    bestTimes: { easy: null, medium: null, hard: null },
    averageTimes: { easy: null, medium: null, hard: null },
  };

  for (const difficulty of difficulties) {
    const diffGames = games.filter(g => g.difficulty === difficulty);
    if (diffGames.length > 0) {
      stats.bestTimes[difficulty] = Math.min(
        ...diffGames.map(g => g.timeElapsed),
      );
      stats.averageTimes[difficulty] = Math.round(
        diffGames.reduce((sum, g) => sum + g.timeElapsed, 0) /
          diffGames.length,
      );
    }
  }

  return stats;
}

import React, { useState, useEffect, useCallback } from 'react';
import type { CompletedGame, GameStatistics } from '../types/history';
import type { Difficulty } from '../types/sudoku';
import { getCompletedGames, clearHistory, getStatistics } from '../utils/db';
import StatisticsCard from './StatisticsCard';

const DIFFICULTY_OPTIONS: Array<{ value: Difficulty | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: '#4caf50',
  medium: '#ff9800',
  hard: '#f44336',
};

function SkeletonCard() {
  return (
    <div className="skeleton skeleton--card" aria-hidden="true" />
  );
}

const HistoryPanel: React.FC = () => {
  const [games, setGames] = useState<CompletedGame[]>([]);
  const [statistics, setStatistics] = useState<GameStatistics | null>(null);
  const [filter, setFilter] = useState<Difficulty | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      const filteredGames = await getCompletedGames(
        filter === 'all' ? undefined : filter,
      );
      const stats = await getStatistics();
      if (!cancelled) {
        setGames(filteredGames);
        setStatistics(stats);
        setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [filter, refreshKey]);

  const handleClearHistory = useCallback(async () => {
    if (!window.confirm('Are you sure you want to clear all game history? This cannot be undone.')) {
      return;
    }
    await clearHistory();
    setRefreshKey(k => k + 1);
  }, []);

  return (
    <div className="history-panel" aria-label="Game history">
      <div className="history-panel__header">
        <h2>📜 History & Statistics</h2>
        <button
          className="btn btn--danger btn--small"
          onClick={handleClearHistory}
          disabled={games.length === 0}
          aria-label="Clear all game history"
        >
          Clear History
        </button>
      </div>

      {loading ? (
        <div role="status" aria-label="Loading history">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <span className="sr-only">Loading history...</span>
        </div>
      ) : (
        <>
          {statistics && <StatisticsCard statistics={statistics} />}

          <div className="history-panel__filter" role="group" aria-label="Filter by difficulty">
            {DIFFICULTY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`btn btn--filter ${filter === opt.value ? 'btn--filter-active' : ''}`}
                onClick={() => setFilter(opt.value)}
                aria-pressed={filter === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="history-panel__list" role="list" aria-label="Completed games">
            {games.length === 0 ? (
              <p className="history-panel__empty">
                {filter === 'all'
                  ? 'No completed games yet. Play a game to see your history!'
                  : `No completed ${filter} games.`}
              </p>
            ) : (
              games.map(game => (
                <div key={game.id} className="history-item" role="listitem">
                  <span
                    className="history-item__difficulty"
                    style={{ backgroundColor: DIFFICULTY_COLORS[game.difficulty] }}
                  >
                    {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
                  </span>
                  <span className="history-item__time">
                    ⏱ {formatTime(game.timeElapsed)}
                  </span>
                  <span className="history-item__date">
                    📅 {new Date(game.completedAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryPanel;

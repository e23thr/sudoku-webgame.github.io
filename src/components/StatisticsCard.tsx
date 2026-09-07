import React from 'react';
import type { GameStatistics } from '../types/history';
import type { Difficulty } from '../types/sudoku';

interface StatisticsCardProps {
  statistics: GameStatistics;
}

function formatTime(seconds: number | null): string {
  if (seconds === null) return '—';
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: '🟢 Easy',
  medium: '🟡 Medium',
  hard: '🔴 Hard',
};

const StatisticsCard: React.FC<StatisticsCardProps> = ({ statistics }) => {
  return (
    <div className="stats-card">
      <h3 className="stats-card__title">📊 Statistics</h3>

      <div className="stats-card__summary">
        <div className="stats-card__stat">
          <span className="stats-card__stat-value">
            {statistics.gamesPlayed}
          </span>
          <span className="stats-card__stat-label">Played</span>
        </div>
        <div className="stats-card__stat">
          <span className="stats-card__stat-value">{statistics.winRate}%</span>
          <span className="stats-card__stat-label">Win Rate</span>
        </div>
        <div className="stats-card__stat">
          <span className="stats-card__stat-value">
            {statistics.gamesWon}
          </span>
          <span className="stats-card__stat-label">Won</span>
        </div>
      </div>

      {statistics.gamesPlayed > 0 && (
        <div className="stats-card__times">
          <h4 className="stats-card__section-title">Best Times</h4>
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
            <div key={d} className="stats-card__time-row">
              <span className="stats-card__time-label">
                {DIFFICULTY_LABELS[d]}
              </span>
              <span className="stats-card__time-value">
                {formatTime(statistics.bestTimes[d])}
              </span>
            </div>
          ))}

          <h4 className="stats-card__section-title">Average Times</h4>
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
            <div key={d} className="stats-card__time-row">
              <span className="stats-card__time-label">
                {DIFFICULTY_LABELS[d]}
              </span>
              <span className="stats-card__time-value">
                {formatTime(statistics.averageTimes[d])}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatisticsCard;

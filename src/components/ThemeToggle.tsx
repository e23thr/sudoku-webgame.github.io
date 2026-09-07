import React, { useState, useCallback } from 'react';
import type { Theme } from '../utils/storage';

interface ThemeToggleProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const themeIcons: Record<Theme, string> = {
  colorful: '🎨',
  dark: '🌙',
  light: '☀️',
};

const themeLabels: Record<Theme, string> = {
  colorful: 'Colorful',
  dark: 'Dark',
  light: 'Light',
};

const themeOrder: Theme[] = ['colorful', 'dark', 'light'];

const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, onThemeChange }) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const cycleTheme = useCallback(() => {
    const currentIndex = themeOrder.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    const nextTheme = themeOrder[nextIndex];

    setIsSpinning(true);
    setTimeout(() => {
      onThemeChange(nextTheme);
      setIsSpinning(false);
    }, 200);
  }, [currentTheme, onThemeChange]);

  return (
    <button
      className="theme-toggle"
      onClick={cycleTheme}
      aria-label={`Switch theme (current: ${themeLabels[currentTheme]})`}
      title={`Theme: ${themeLabels[currentTheme]} — click to cycle`}
    >
      <span
        className={`theme-toggle__icon ${isSpinning ? 'theme-toggle__icon--spinning' : ''}`}
      >
        {themeIcons[currentTheme]}
      </span>
    </button>
  );
};

export default ThemeToggle;

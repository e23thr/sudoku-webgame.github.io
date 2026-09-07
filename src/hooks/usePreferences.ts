import { useState, useCallback, useEffect } from 'react';
import { savePreferences, loadPreferences } from '../utils/storage';
import type { UserPreferences, Theme } from '../utils/storage';
import type { Difficulty } from '../types/sudoku';

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences);

  // Apply theme via data-theme attribute on <html>
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', preferences.theme);
  }, [preferences.theme]);

  const updateTheme = useCallback((theme: Theme) => {
    setPreferences(prev => ({ ...prev, theme }));
  }, []);

  const updateDefaultDifficulty = useCallback((defaultDifficulty: Difficulty) => {
    setPreferences(prev => ({ ...prev, defaultDifficulty }));
  }, []);

  const updateSoundEnabled = useCallback((soundEnabled: boolean) => {
    setPreferences(prev => ({ ...prev, soundEnabled }));
  }, []);

  // Auto-save whenever preferences change
  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  return {
    preferences,
    updateTheme,
    updateDefaultDifficulty,
    updateSoundEnabled,
  } as const;
}

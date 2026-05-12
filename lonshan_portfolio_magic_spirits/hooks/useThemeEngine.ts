'use client';

import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';
import { THEMES } from '../systems/themeEngine';
import { ActiveTheme } from '../types/spirit.types';
import { getSoundEngine } from '../systems/soundEngine';

export function useThemeEngine() {
  const { activeTheme, isTransitioning, setTheme, beginTransition, endTransition } =
    useThemeStore();

  const changeTheme = (theme: ActiveTheme) => {
    getSoundEngine().playThemeTransition();
    beginTransition();
    // Short delay before applying so transition overlay can show
    setTimeout(() => {
      setTheme(theme);
      setTimeout(endTransition, 800);
    }, 200);
  };

  // Apply initial theme on mount
  useEffect(() => {
    const config = THEMES[activeTheme];
    if (config) {
      // applyTheme is called inside setTheme — just ensure CSS vars are set
      import('../systems/themeEngine').then(({ applyTheme }) => applyTheme(config));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { activeTheme, isTransitioning, changeTheme, currentThemeConfig: THEMES[activeTheme] };
}

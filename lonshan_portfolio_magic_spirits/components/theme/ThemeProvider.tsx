'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useThemeEngine } from '../../hooks/useThemeEngine';
import { ActiveTheme } from '../../types/spirit.types';
import { ThemeConfig } from '../../types/theme.types';

interface ThemeContextValue {
  activeTheme: ActiveTheme;
  isTransitioning: boolean;
  currentThemeConfig: ThemeConfig;
  changeTheme: (theme: ActiveTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const engine = useThemeEngine();

  // Apply CSS vars to document root whenever theme changes
  useEffect(() => {
    const el = document.documentElement;
    const config = engine.currentThemeConfig;
    if (!config) return;
    el.style.setProperty('--theme-bg', config.bgGradient);
    el.style.setProperty('--theme-primary', config.primaryColor);
    el.style.setProperty('--theme-secondary', config.secondaryColor);
    el.style.setProperty('--theme-accent', config.accentColor);
    el.style.setProperty('--theme-text', config.textColor);
    el.style.setProperty('--theme-subtext', config.subtextColor);
    el.style.setProperty('--theme-card-bg', config.cardBg);
    el.style.setProperty('--theme-card-border', config.cardBorder);
    el.style.setProperty('--theme-glow', config.glowColor);
  }, [engine.currentThemeConfig]);

  return (
    <ThemeContext.Provider value={engine}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
}

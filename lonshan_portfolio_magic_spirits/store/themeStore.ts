'use client';

import { create } from 'zustand';
import { ActiveTheme, ElementType } from '../types/spirit.types';
import { THEMES, DEFAULT_THEME, applyTheme } from '../systems/themeEngine';
import { getCombination, COMBINATION_WINDOW_MS } from '../systems/combinationEngine';

interface ThemeStore {
  activeTheme: ActiveTheme;
  previousTheme: ActiveTheme | null;
  isTransitioning: boolean;
  pendingCombination: ElementType | null;
  pendingTapTime: number;

  setTheme: (theme: ActiveTheme) => void;
  tapSpirit: (element: ElementType) => ActiveTheme;
  beginTransition: () => void;
  endTransition: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  activeTheme: DEFAULT_THEME,
  previousTheme: null,
  isTransitioning: false,
  pendingCombination: null,
  pendingTapTime: 0,

  setTheme: (theme) => {
    const config = THEMES[theme];
    if (config) applyTheme(config);
    set((state) => ({
      activeTheme: theme,
      previousTheme: state.activeTheme,
      pendingCombination: null,
    }));
  },

  tapSpirit: (element) => {
    const { pendingCombination, pendingTapTime, setTheme } = get();
    const now = Date.now();

    // Check if within combination window
    if (pendingCombination && now - pendingTapTime <= COMBINATION_WINDOW_MS) {
      const hybrid = getCombination(pendingCombination, element);
      if (hybrid) {
        setTheme(hybrid);
        return hybrid;
      }
    }

    // No combination — start pending window for this spirit
    set({ pendingCombination: element, pendingTapTime: now });

    // Switch to this element's theme after a short delay (allows 2nd tap)
    setTimeout(() => {
      const { pendingCombination: still, pendingTapTime: t } = get();
      if (still === element && Date.now() - t >= COMBINATION_WINDOW_MS - 100) {
        setTheme(element);
      }
    }, COMBINATION_WINDOW_MS);

    return element;
  },

  beginTransition: () => set({ isTransitioning: true }),
  endTransition: () => set({ isTransitioning: false }),
}));

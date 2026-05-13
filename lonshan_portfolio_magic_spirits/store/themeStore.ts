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
  clearPendingCombination: () => void;
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
    const { pendingCombination, pendingTapTime } = get();
    const now = Date.now();

    // Check if within combination window
    if (pendingCombination && now - pendingTapTime <= COMBINATION_WINDOW_MS) {
      const hybrid = getCombination(pendingCombination, element);
      if (hybrid) {
        set({ pendingCombination: null, pendingTapTime: 0 });
        return hybrid;
      }
    }

    // No combination — start pending window for this spirit
    set({ pendingCombination: element, pendingTapTime: now });

    return element;
  },

  clearPendingCombination: () => set({ pendingCombination: null, pendingTapTime: 0 }),

  beginTransition: () => set({ isTransitioning: true }),
  endTransition: () => set({ isTransitioning: false }),
}));

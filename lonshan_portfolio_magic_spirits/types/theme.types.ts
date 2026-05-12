import { ActiveTheme } from './spirit.types';

export interface ThemeConfig {
  id: ActiveTheme;
  name: string;
  label: string;
  /** CSS gradient for background */
  bgGradient: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  subtextColor: string;
  cardBg: string;
  cardBorder: string;
  particleColor: string;
  glowColor: string;
  /** Cursor accent color */
  cursorColor: string;
  /** Tailwind-style font weight / tracking hint */
  fontVariant: 'normal' | 'light' | 'mono' | 'bold';
  /** CSS filter applied to background particles */
  particleFilter: string;
  /** Transition style */
  transitionTone: 'warm' | 'cool' | 'dark' | 'light' | 'electric' | 'natural' | 'cosmic';
}

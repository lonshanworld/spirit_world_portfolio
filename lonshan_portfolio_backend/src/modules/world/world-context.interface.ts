/**
 * world-context.interface.ts
 * Shared types for assembling world state passed to the AI prompt builder.
 */
import { ElementType, EmotionType, HybridElement } from '../spirits/interfaces/spirit.interface';

export type TriggerType =
  | 'idle'
  | 'greeting'
  | 'section_visit'
  | 'spirit_click'
  | 'combination'
  | 'spirit_to_spirit'
  | 'recruiter_mode'
  | 'theme_change';

export interface SpiritContextEntry {
  id: ElementType;
  name: string;
  emotion: EmotionType;
}

export interface RecentHistoryLine {
  speakerName: string;
  text: string;
}

export interface WorldContext {
  /** Currently active theme (pure element or hybrid) */
  activeTheme: string;
  /** Portfolio section currently in view */
  activeSection: string;
  /** All spirits currently loaded with their emotion state */
  nearbySpirits: SpiritContextEntry[];
  /** Last N dialogue lines (global) for continuity */
  recentHistory: RecentHistoryLine[];
  /** Elapsed seconds since session start */
  sessionSeconds: number;
  /** Whether the AI system suspects a recruiter is visiting */
  isRecruiterLikely: boolean;
  /** Projects the user has viewed (scrolled to) */
  viewedProjects: string[];
  /** Trigger that caused the generation */
  trigger: TriggerType;
  /** Extra context specific to the trigger */
  triggerDetail?: string;
  /** Hybrid that was just combined (for combination trigger) */
  hybridId?: HybridElement | string;
}

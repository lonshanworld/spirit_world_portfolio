'use client';

/**
 * messageCache.ts
 * Runtime cache for pre-generated spirit dialogue.
 * Loaded once from the static dataset (messageBatch.ts) and optionally
 * augmented with AI lines fetched on session start.
 *
 * Key guarantees:
 *  • Per-element, per-trigger bucket tracking — no repeats until exhausted.
 *  • On exhaustion the bucket resets, allowing graceful replay.
 *  • Highest-priority lines are preferred; random within same priority tier.
 *  • `augment` is safe to call any time (adds AI lines to existing pool).
 */

import { create } from 'zustand';
import type { CachedLine } from '../systems/messageBatch';

export type { CachedLine };

type TriggerType = CachedLine['triggerType'];

interface MessageCacheStore {
  /** Per-element flat array of all lines (static + AI-augmented). */
  cache: Record<string, CachedLine[]>;
  /**
   * Used-index tracking per `"element:trigger"` bucket.
   * Prevents repeats until the bucket is exhausted (then it resets).
   */
  usedSets: Record<string, Set<number>>;
  /** True once initialize() has been called. */
  isInitialized: boolean;

  /** Load the full static dataset. Call once on session start. */
  initialize: (data: Record<string, CachedLine[]>) => void;
  /** Merge AI-generated lines into a specific element's pool. */
  augment: (element: string, lines: CachedLine[]) => void;
  /**
   * Return the best available line for (element, trigger).
   * Filters by trigger type, skips used entries, picks highest priority
   * at random within the top tier. Resets the bucket when exhausted.
   * Returns null if the element has no lines for this trigger.
   */
  selectLine: (element: string, trigger: TriggerType) => CachedLine | null;
}

export const useMessageCache = create<MessageCacheStore>((set, get) => ({
  cache: {},
  usedSets: {},
  isInitialized: false,

  initialize: (data) => {
    // Deep-copy so mutations don't touch the static import
    const cache: Record<string, CachedLine[]> = {};
    for (const [element, lines] of Object.entries(data)) {
      cache[element] = [...lines];
    }
    set({ cache, usedSets: {}, isInitialized: true });
  },

  augment: (element, lines) => {
    set((state) => ({
      cache: {
        ...state.cache,
        [element]: [...(state.cache[element] ?? []), ...lines],
      },
    }));
  },

  selectLine: (element, trigger) => {
    const state = get();
    const all = state.cache[element] ?? [];
    const key = `${element}:${trigger}`;
    let used = state.usedSets[key] ?? new Set<number>();

    // ── build candidate list ───────────────────────────────────
    let candidates = all
      .map((line, idx) => ({ line, idx }))
      .filter(({ line, idx }) => line.triggerType === trigger && !used.has(idx));

    // ── bucket exhausted → reset used for this bucket ─────────
    if (candidates.length === 0) {
      used = new Set<number>();
      candidates = all
        .map((line, idx) => ({ line, idx }))
        .filter(({ line }) => line.triggerType === trigger);
    }

    if (candidates.length === 0) return null;   // element has no lines for this trigger

    // ── pick highest-priority, random within same tier ─────────
    const maxPriority = Math.max(...candidates.map(({ line }) => line.priority));
    const topTier = candidates.filter(({ line }) => line.priority === maxPriority);
    const chosen = topTier[Math.floor(Math.random() * topTier.length)];

    // ── mark chosen as used ────────────────────────────────────
    const newUsed = new Set(used);
    newUsed.add(chosen.idx);
    set((s) => ({ usedSets: { ...s.usedSets, [key]: newUsed } }));

    return chosen.line;
  },
}));

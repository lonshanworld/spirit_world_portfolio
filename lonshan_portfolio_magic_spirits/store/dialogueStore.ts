'use client';

import { create } from 'zustand';
import { ActiveDialogue } from '../types/dialogue.types';

/**
 * Dialogue store — single active slot.
 *
 * Only ONE message is ever visible at a time.
 * The serialized queue that fills this slot lives in useSpiritDialogue (hook-level),
 * keeping timing logic out of the store.
 */
interface DialogueStore {
  /** The single currently-displayed dialogue, or null when silent. */
  current: ActiveDialogue | null;
  setCurrent: (d: ActiveDialogue | null) => void;
  clearAll: () => void;
}

export const useDialogueStore = create<DialogueStore>((set) => ({
  current: null,
  setCurrent: (d) => set({ current: d }),
  clearAll: () => set({ current: null }),
}));

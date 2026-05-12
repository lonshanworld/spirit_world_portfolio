'use client';

import { create } from 'zustand';
import { ActiveDialogue } from '../types/dialogue.types';

const MAX_VISIBLE_DIALOGUES = 3;

interface DialogueStore {
  dialogues: ActiveDialogue[];
  addDialogue: (dialogue: ActiveDialogue) => void;
  removeDialogue: (id: string) => void;
  clearAll: () => void;
}

export const useDialogueStore = create<DialogueStore>((set) => ({
  dialogues: [],

  addDialogue: (dialogue) =>
    set((state) => {
      const next = [...state.dialogues, dialogue];
      // Keep only the most recent MAX_VISIBLE_DIALOGUES entries
      if (next.length > MAX_VISIBLE_DIALOGUES) {
        return { dialogues: next.slice(next.length - MAX_VISIBLE_DIALOGUES) };
      }
      return { dialogues: next };
    }),

  removeDialogue: (id) =>
    set((state) => ({
      dialogues: state.dialogues.filter((d) => d.id !== id),
    })),

  clearAll: () => set({ dialogues: [] }),
}));

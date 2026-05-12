'use client';

import { create } from 'zustand';
import { ElementType, SpiritInstance, SpiritInstanceId, EmotionType, CombatStatus, CombatRole, ActiveCombat } from '../types/spirit.types';
import { spawnSpiritInstances } from '../systems/spiritPopulation';

interface WorldStore {
  spirits: Map<SpiritInstanceId, SpiritInstance>;
  activeSection: string;
  isLoaded: boolean;
  cursorX: number;
  cursorY: number;

  /** Active combat events — keyed by combat id. */
  activeCombats: Map<string, ActiveCombat>;

  initSpirits: () => void;

  // ── Element-type setters (used by WebSocket/backend events) ─────
  setSpiritEmotion: (element: ElementType, emotion: EmotionType) => void;
  setSpiritSpeaking: (element: ElementType, speaking: boolean) => void;

  // ── Instance-level setters ───────────────────────────────────────
  setSpiritHovered: (instanceId: SpiritInstanceId, hovered: boolean) => void;
  setSpiritCombatStatus: (instanceId: SpiritInstanceId, status: CombatStatus, role?: CombatRole) => void;
  setSpiritEmotionById: (instanceId: SpiritInstanceId, emotion: EmotionType) => void;

  // ── Combat lifecycle ─────────────────────────────────────────────
  startCombat: (combat: ActiveCombat) => void;
  updateCombatPhase: (combatId: string, phase: ActiveCombat['phase']) => void;
  endCombat: (combatId: string) => void;

  setActiveSection: (section: string) => void;
  setLoaded: (loaded: boolean) => void;
  setCursor: (x: number, y: number) => void;
}

export const useWorldStore = create<WorldStore>((set) => ({
  spirits: new Map(),
  activeSection: 'hero',
  isLoaded: false,
  cursorX: 0,
  cursorY: 0,
  activeCombats: new Map(),

  initSpirits: () => {
    const spirits = spawnSpiritInstances();
    set({ spirits, isLoaded: true });
  },

  setSpiritEmotion: (element, emotion) =>
    set((state) => {
      const spirits = new Map(state.spirits);
      for (const [id, inst] of spirits) {
        if (inst.element === element) spirits.set(id, { ...inst, emotion });
      }
      return { spirits };
    }),

  setSpiritSpeaking: (element, speaking) =>
    set((state) => {
      const spirits = new Map(state.spirits);
      for (const [id, inst] of spirits) {
        if (inst.element === element) {
          spirits.set(id, { ...inst, isSpeaking: speaking });
          break;
        }
      }
      return { spirits };
    }),

  setSpiritHovered: (instanceId, hovered) =>
    set((state) => {
      const spirits = new Map(state.spirits);
      const inst = spirits.get(instanceId);
      if (inst) spirits.set(instanceId, { ...inst, isHovered: hovered });
      return { spirits };
    }),

  setSpiritCombatStatus: (instanceId, status, role) =>
    set((state) => {
      const spirits = new Map(state.spirits);
      const inst = spirits.get(instanceId);
      if (inst) spirits.set(instanceId, { ...inst, combatStatus: status, combatRole: role });
      return { spirits };
    }),

  setSpiritEmotionById: (instanceId, emotion) =>
    set((state) => {
      const spirits = new Map(state.spirits);
      const inst = spirits.get(instanceId);
      if (inst) spirits.set(instanceId, { ...inst, emotion });
      return { spirits };
    }),

  startCombat: (combat) =>
    set((state) => {
      const activeCombats = new Map(state.activeCombats);
      activeCombats.set(combat.id, combat);
      return { activeCombats };
    }),

  updateCombatPhase: (combatId, phase) =>
    set((state) => {
      const activeCombats = new Map(state.activeCombats);
      const combat = activeCombats.get(combatId);
      if (combat) activeCombats.set(combatId, { ...combat, phase });
      return { activeCombats };
    }),

  endCombat: (combatId) =>
    set((state) => {
      const activeCombats = new Map(state.activeCombats);
      activeCombats.delete(combatId);
      return { activeCombats };
    }),

  setActiveSection: (section) => set({ activeSection: section }),
  setLoaded: (isLoaded) => set({ isLoaded }),
  setCursor: (cursorX, cursorY) => set({ cursorX, cursorY }),
}));


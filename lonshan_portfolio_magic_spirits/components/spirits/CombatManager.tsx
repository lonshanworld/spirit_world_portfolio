'use client';

/**
 * CombatManager.tsx
 *
 * Orchestrates the spirit playful-combat system.
 *
 * Responsibilities:
 *  - Periodically picks two eligible spirits to have a combat event
 *  - Manages combat phases: anticipation → cast → travel → impact → reaction → done
 *  - Keeps combat in "safe zones" (lower 80% of page, avoids nav/hero text)
 *  - Renders CombatProjectile overlays for active projectiles
 *  - Shows combat dialogue bubbles
 *  - Healing spirits intervene in nearby fights
 *  - Hovering a fighting spirit calms it immediately
 *  - Clicking a fighting spirit breaks the fight apart
 *
 * Tone: playful, magical, cartoon — never violent.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useWorldStore } from '../../store/worldStore';
import {
  ELEMENT_SPELLS,
  ELEMENTAL_RIVALRIES,
  PACIFIST_ELEMENTS,
  COMBAT_STYLE,
  getCollisionReaction,
  getCombatLine,
  HIT_OUTCOMES,
} from '../../systems/combatSystem';
import { SpiritInstance, SpiritInstanceId, ActiveCombat } from '../../types/spirit.types';
import { CombatProjectile, ProjectileData } from './CombatProjectile';

// ─── Constants ────────────────────────────────────────────────────

/** Minimum Y (% of document) below which combat is allowed — protects nav + hero text. */
const SAFE_ZONE_MIN_Y = 22;

/** Maximum simultaneous combat events. */
const MAX_CONCURRENT_COMBATS = 2;

/** How long (ms) between new combat event evaluations. */
const COMBAT_INTERVAL_MS = 15_000; // ~15s base; jittered ±8s

// ─── CombatManager ────────────────────────────────────────────────

export function CombatManager() {
  const spirits              = useWorldStore((s) => s.spirits);
  const activeCombats        = useWorldStore((s) => s.activeCombats);
  const startCombat          = useWorldStore((s) => s.startCombat);
  const updateCombatPhase    = useWorldStore((s) => s.updateCombatPhase);
  const endCombat            = useWorldStore((s) => s.endCombat);
  const setSpiritCombatStatus = useWorldStore((s) => s.setSpiritCombatStatus);
  const setSpiritEmotionById = useWorldStore((s) => s.setSpiritEmotionById);

  const spiritsRef     = useRef(spirits);
  const combatsRef     = useRef(activeCombats);
  useEffect(() => { spiritsRef.current = spirits; }, [spirits]);
  useEffect(() => { combatsRef.current = activeCombats; }, [activeCombats]);

  const [projectiles, setProjectiles]     = useState<ProjectileData[]>([]);

  // ── Helpers ──────────────────────────────────────────────────────

  const spiritViewportPos = useCallback((inst: SpiritInstance): { x: number; y: number } => {
    // worldX/Y are % of document. We approximate viewport-relative by using
    // window dimensions directly — for Y, we clamp to visible range.
    const vw = typeof window !== 'undefined' ? window.innerWidth  : 1200;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    return {
      x: (inst.worldX / 100) * vw,
      y: (inst.worldY / 100) * (vh * 3.5), // rough 3.5x page height estimate
    };
  }, []);

  // Combat speech is now routed through the spirit's attached bubble
  // (via dialogueStore / useSpiritDialogue queue) — no separate overlay needed.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pushSpeech = useCallback((_inst: SpiritInstance, _text: string) => {}, []);

  // ── Combat event orchestration ───────────────────────────────────

  const runCombatEvent = useCallback(() => {
    const all = Array.from(spiritsRef.current.values());
    if (all.length < 2) return;

    // Don't exceed max concurrent combats
    if (combatsRef.current.size >= MAX_CONCURRENT_COMBATS) return;

    // Only non-pacifist spirits in the safe zone are eligible fighters.
    // Healing spirits are pacifists — they appear as mediators only, not fighters.
    const eligible = all.filter(
      (s) =>
        s.worldY > SAFE_ZONE_MIN_Y &&
        s.combatStatus === 'idle' &&
        !PACIFIST_ELEMENTS.includes(s.element),
    );

    if (eligible.length < 2) return;

    // 30% chance to pick a classic rival pair
    let attacker: SpiritInstance;
    let defender: SpiritInstance;

    const useRivalry = Math.random() < 0.3;
    if (useRivalry) {
      const rivalPairs = ELEMENTAL_RIVALRIES.map(([a, b]) => {
        const aInst = eligible.find((s) => s.element === a);
        const bInst = eligible.find((s) => s.element === b);
        return aInst && bInst ? [aInst, bInst] as [SpiritInstance, SpiritInstance] : null;
      }).filter(Boolean) as [SpiritInstance, SpiritInstance][];

      if (rivalPairs.length > 0) {
        const pair = rivalPairs[Math.floor(Math.random() * rivalPairs.length)];
        [attacker, defender] = pair;
      } else {
        // No rival pair available — random pick
        const shuffled = [...eligible].sort(() => Math.random() - 0.5);
        [attacker, defender] = [shuffled[0], shuffled[1]];
      }
    } else {
      const shuffled = [...eligible].sort(() => Math.random() - 0.5);
      [attacker, defender] = [shuffled[0], shuffled[1]];
    }

    // Skip if same element (no self-combat)
    if (attacker.element === defender.element) return;

    const combatId = `combat-${Date.now()}`;
    const matchup  = [attacker.element, defender.element].sort().join('-');

    const combat: ActiveCombat = {
      id:         combatId,
      attackerId: attacker.instanceId,
      defenderId: defender.instanceId,
      matchup,
      phase:      'anticipation',
      startedAt:  Date.now(),
    };

    startCombat(combat);

    // ── Phase 1: Anticipation (0.8s) ───────────────────────────────
    setSpiritCombatStatus(attacker.instanceId, 'anticipating', 'attacker');
    setSpiritCombatStatus(defender.instanceId, 'anticipating', 'defender');
    setSpiritEmotionById(attacker.instanceId, 'angry');
    setSpiritEmotionById(defender.instanceId, 'surprised');

    // Taunt speech from attacker
    pushSpeech(attacker, getCombatLine(attacker.element, 'taunt'));

    // ── Phase 2: Cast (after 0.8s) ─────────────────────────────────
    setTimeout(() => {
      if (!combatsRef.current.has(combatId)) return;

      updateCombatPhase(combatId, 'cast');
      setSpiritCombatStatus(attacker.instanceId, 'casting', 'attacker');

      // Attack speech
      pushSpeech(attacker, getCombatLine(attacker.element, 'attack'));

      const spell    = ELEMENT_SPELLS[attacker.element];
      const fromPos  = spiritViewportPos(attacker);
      const toPos    = spiritViewportPos(defender);
      const collision = getCollisionReaction(attacker.element, defender.element);

      // Defensive spirit may dodge (50% chance for defensive style)
      const style = COMBAT_STYLE[defender.element];
      const willDodge = style === 'defensive' && Math.random() < 0.45;

      if (willDodge) {
        setSpiritCombatStatus(defender.instanceId, 'dodging', 'defender');
        pushSpeech(defender, getCombatLine(defender.element, 'defend'));
      } else {
        setSpiritCombatStatus(defender.instanceId, 'blocking', 'defender');
      }

      // Spawn projectile
      const projectileId = `proj-${combatId}`;
      setProjectiles((prev) => [...prev, {
        id:        projectileId,
        spell,
        from:      fromPos,
        to:        toPos,
        collision,
        onImpact:  () => {
          if (!combatsRef.current.has(combatId)) return;

          // ── Phase 3: Impact ─────────────────────────────────────
          updateCombatPhase(combatId, 'impact');

          if (willDodge) {
            // Defender dodged — attacker surprised/embarrassed
            setSpiritCombatStatus(attacker.instanceId, 'embarrassed', 'attacker');
            setSpiritEmotionById(attacker.instanceId, 'embarrassed');
            pushSpeech(defender, getCombatLine(defender.element, 'win'));
            pushSpeech(attacker, getCombatLine(attacker.element, 'lose'));
          } else {
            // Hit lands — defender gets hit, attacker celebrates
            setSpiritCombatStatus(defender.instanceId, 'hit', 'defender');
            setSpiritEmotionById(defender.instanceId, 'sad');

            // Attacker earns a victorious moment
            setSpiritCombatStatus(attacker.instanceId, 'victorious', 'attacker');
            setSpiritEmotionById(attacker.instanceId, 'excited');

            const outcome = HIT_OUTCOMES[defender.element];
            if (outcome.dizzy) {
              setTimeout(() => {
                if (!combatsRef.current.has(combatId)) return;
                setSpiritCombatStatus(defender.instanceId, 'dizzy', 'defender');
              }, 200);
            }

            pushSpeech(defender, getCombatLine(defender.element, 'hit'));
            pushSpeech(attacker, getCombatLine(attacker.element, 'win'));
          }
        },
      }]);

      // ── Phase 4: Reaction + cleanup (2.2s after cast) ─────────────
      setTimeout(() => {
        if (!combatsRef.current.has(combatId)) return;

        updateCombatPhase(combatId, 'reaction');
        // If attacker lost (dodge), move them from embarrassed → recovering.
        // If attacker won (hit landed), they stay victorious until Phase 5.
        if (willDodge) {
          setSpiritCombatStatus(attacker.instanceId, 'recovering', 'attacker');
        }
        setSpiritCombatStatus(defender.instanceId, 'recovering', 'defender');

        // Healing spirits nearby may intervene
        const mediators = Array.from(spiritsRef.current.values()).filter(
          (s) =>
            s.element === 'healing' &&
            s.combatStatus === 'idle' &&
            Math.abs(s.worldX - defender.worldX) < 25 &&
            Math.abs(s.worldY - defender.worldY) < 25,
        );
        if (mediators.length > 0) {
          const healer = mediators[0];
          setSpiritCombatStatus(healer.instanceId, 'casting', 'mediator');
          setSpiritEmotionById(healer.instanceId, 'angry');
          pushSpeech(healer, getCombatLine('healing', 'taunt'));
          setTimeout(() => {
            setSpiritCombatStatus(healer.instanceId, 'idle');
            setSpiritEmotionById(healer.instanceId, 'calm');
          }, 2000);
        }

        // ── Phase 5: Done (1.5s after reaction) ───────────────────
        setTimeout(() => {
          // Reset both combatants to idle regardless of outcome
          setSpiritCombatStatus(attacker.instanceId, 'idle');
          setSpiritCombatStatus(defender.instanceId, 'idle');
          setSpiritEmotionById(attacker.instanceId, 'neutral');
          setSpiritEmotionById(defender.instanceId, 'neutral');
          endCombat(combatId);
          setProjectiles((prev) => prev.filter((p) => p.id !== projectileId));
        }, 1500);
      }, 2200);
    }, 800);
  }, [
    startCombat, updateCombatPhase, endCombat,
    setSpiritCombatStatus, setSpiritEmotionById,
    pushSpeech, spiritViewportPos,
  ]);

  // ── Periodic combat scheduler ─────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    function schedule() {
      const jitter = (Math.random() - 0.5) * 16_000;
      const delay  = COMBAT_INTERVAL_MS + jitter;
      setTimeout(() => {
        if (cancelled) return;
        runCombatEvent();
        schedule();
      }, delay);
    }

    // First event after 3-8s so spirits have time to spawn
    const firstDelay = 3_000 + Math.random() * 5_000;
    const firstTimer = setTimeout(() => {
      if (!cancelled) { runCombatEvent(); schedule(); }
    }, firstDelay);

    return () => {
      cancelled = true;
      clearTimeout(firstTimer);
    };
  }, [runCombatEvent]);

  // ─── Render ───────────────────────────────────────────────────────

  return (
    <>
      {/* Combat projectiles (fixed-position, full-page overlay) */}
      {projectiles.map((proj) => (
        <CombatProjectile
          key={proj.id}
          data={proj}
          onComplete={(id) => setProjectiles((prev) => prev.filter((p) => p.id !== id))}
        />
      ))}


    </>
  );
}

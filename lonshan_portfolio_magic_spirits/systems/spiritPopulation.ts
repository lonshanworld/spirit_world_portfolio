/**
 * spiritPopulation.ts
 *
 * Spawns named spirit individuals from the SPIRIT_PERSONALITIES pool.
 * Each session picks 35–42 spirits at random from the full 42-spirit roster,
 * giving the world an organic, ever-slightly-different feel on each visit.
 *
 * Design principles:
 *  - Named individuals feel alive; no two sessions are identical
 *  - Positions are spread across the FULL document height using a golden-ratio
 *    distribution so spirits don't cluster on the hero section
 *  - personalityOffset is randomised per instance for staggered animations
 */

import { SpiritInstance, SpiritInstanceId } from '../types/spirit.types';
import { SPIRIT_DEFINITIONS } from './elementData';
import { SPIRIT_PERSONALITIES } from '../data/spiritPersonalities';

/** Golden-ratio scrambling distributes Y positions evenly across the document. */
const GOLDEN = 0.618033988749895;

function goldenY(index: number): number {
  const raw = ((index * GOLDEN) % 1) * 100;
  return Math.min(97, Math.max(3, raw + (Math.random() * 14 - 7)));
}

function randomX(): number {
  return 4 + Math.random() * 92; // 4–96% of viewport width
}

/** Fisher-Yates shuffle — returns a new shuffled array. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Spawn function ───────────────────────────────────────────────

/**
 * Creates all spirit instances for the current session.
 * Randomly selects 35–42 named spirits from the 42-spirit pool.
 * Positions are spread across the full document height.
 */
export function spawnSpiritInstances(): Map<SpiritInstanceId, SpiritInstance> {
  const map = new Map<SpiritInstanceId, SpiritInstance>();

  const count  = 35 + Math.floor(Math.random() * 8); // 35–42
  const chosen = shuffle(SPIRIT_PERSONALITIES).slice(0, count);

  chosen.forEach((pers, globalIndex) => {
    const def            = SPIRIT_DEFINITIONS[pers.element];
    const instanceId: SpiritInstanceId = pers.id;

    map.set(instanceId, {
      instanceId,
      element:           pers.element,
      emotion:           pers.defaultEmotion,
      isSpeaking:        false,
      isHovered:         false,
      name:              pers.name,
      typeLabel:         pers.typeLabel,
      displayName:       pers.displayName,
      sizeVariant:       Math.max(0.9, Math.min(1.0, (pers.sizeVariant ?? 1.0) * (def.size ?? 1.0) * (0.90 + Math.random() * 0.10))),
      personalityOffset: Math.random(),
      worldX:            randomX(),
      worldY:            goldenY(globalIndex),
      combatStatus:      'idle',
    });
  });

  return map;
}


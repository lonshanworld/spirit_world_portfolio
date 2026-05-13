/**
 * spiritPopulation.ts
 *
 * Spawns named spirit individuals from the SPIRIT_PERSONALITIES pool.
 * Always spawns exactly 2 spirits per element type = 28 spirits total.
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

// ─── Spawn function ───────────────────────────────────────────────

/**
 * Creates all spirit instances for the current session.
 * Picks exactly 2 spirits per element type (28 spirits total = 14 types × 2).
 * Positions are spread across the full document height.
 */
export function spawnSpiritInstances(): Map<SpiritInstanceId, SpiritInstance> {
  const map = new Map<SpiritInstanceId, SpiritInstance>();

  // Group personalities by element, then take the first 2 from each group
  const byElement = new Map<string, typeof SPIRIT_PERSONALITIES>();
  for (const pers of SPIRIT_PERSONALITIES) {
    if (!byElement.has(pers.element)) byElement.set(pers.element, []);
    byElement.get(pers.element)!.push(pers);
  }

  const chosen = Array.from(byElement.values()).flatMap((group) => group.slice(0, 2));

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


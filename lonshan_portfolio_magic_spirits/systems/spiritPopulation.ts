/**
 * spiritPopulation.ts
 *
 * Spawns named spirit individuals from the SPIRIT_PERSONALITIES pool.
 * Always spawns exactly 3 spirits per element type = 42 spirits total.
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

/**
 * Section-aware Y distribution.
 * We divide the full document height into equal vertical bands so spirits
 * exist across top/middle/bottom sections more consistently.
 */
const WORLD_VERTICAL_BANDS = 6; // hero, ai, projects, work, skills, contact

function distributedY(index: number, total: number): number {
  // Rotate assignment so each session feels alive but still evenly spread.
  const offset = Math.floor(Math.random() * WORLD_VERTICAL_BANDS);
  const band = (index + offset) % WORLD_VERTICAL_BANDS;

  // Keep each spirit away from hard band edges for smoother visual spread.
  const withinBand = 0.1 + Math.random() * 0.8;
  const y = ((band + withinBand) / WORLD_VERTICAL_BANDS) * 100;

  // Tiny global-index jitter prevents vertical "rows" when many spirits exist.
  const jitter = ((index / Math.max(1, total - 1)) - 0.5) * 2.4;
  return Math.min(97, Math.max(3, y + jitter));
}

function randomX(): number {
  return 4 + Math.random() * 92; // 4–96% of viewport width
}

// ─── Spawn function ───────────────────────────────────────────────

/**
 * Creates all spirit instances for the current session.
 * Picks exactly 3 spirits per element type (42 spirits total = 14 types × 3).
 * Positions are spread across the full document height.
 */
export function spawnSpiritInstances(): Map<SpiritInstanceId, SpiritInstance> {
  const map = new Map<SpiritInstanceId, SpiritInstance>();

  // Group personalities by element, then take the first 3 from each group
  const byElement = new Map<string, typeof SPIRIT_PERSONALITIES>();
  for (const pers of SPIRIT_PERSONALITIES) {
    if (!byElement.has(pers.element)) byElement.set(pers.element, []);
    byElement.get(pers.element)!.push(pers);
  }

  const chosen = Array.from(byElement.values()).flatMap((group) => group.slice(0, 3));

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
      worldY:            distributedY(globalIndex, chosen.length),
      combatStatus:      'idle',
    });
  });

  return map;
}


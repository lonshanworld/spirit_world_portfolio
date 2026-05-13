// ─── Element & Spirit Types ────────────────────────────────────────

export type ElementType =
  | 'fire' | 'water' | 'ice' | 'wind' | 'soil'
  | 'trees' | 'lightning' | 'dark' | 'light'
  | 'healing' | 'void' | 'space' | 'time' | 'robot';

export type HybridElement =
  | 'lava' | 'frost' | 'eclipse' | 'storm' | 'bloom'
  | 'cosmos' | 'cyber' | 'inferno' | 'divine';

export type ActiveTheme = ElementType | HybridElement;

export type EmotionType =
  | 'neutral'
  | 'excited'
  | 'calm'
  | 'mysterious'
  | 'playful'
  // Extended emotions (spec requirement)
  | 'happy'
  | 'sad'
  | 'surprised'
  | 'angry'
  | 'embarrassed'
  | 'sleepy'
  | 'confused'
  | 'proud'
  | 'curious'
  | 'scared';

export type MotionPattern = 'float' | 'pulse' | 'spin' | 'wave' | 'erratic' | 'drift';

// ─── Combat ───────────────────────────────────────────────────────

/** What a spirit is doing during a combat event. */
export type CombatStatus =
  | 'idle'          // not in combat
  | 'anticipating'  // leaning forward, charging up
  | 'casting'       // launching attack
  | 'dodging'       // quick dart to the side
  | 'hit'           // knocked back from impact
  | 'dizzy'         // briefly spinning after a heavy hit
  | 'blocking'      // raising a shield / barrier
  | 'recovering'    // settling after hit
  | 'victorious'    // won the exchange
  | 'embarrassed';  // lost the exchange

export type CombatRole = 'attacker' | 'defender' | 'mediator' | 'spectator';

export interface ActiveCombat {
  id: string;
  attackerId: SpiritInstanceId;
  defenderId: SpiritInstanceId;
  /** Unique element-pair string, e.g. "fire-water" */
  matchup: string;
  phase: 'anticipation' | 'cast' | 'travel' | 'impact' | 'reaction' | 'done';
  startedAt: number;
}

// ─── Multi-instance Spirit ────────────────────────────────────────

/** Unique key for a specific spirit instance, e.g. "fire-0", "water-1". */
export type SpiritInstanceId = string;

/**
 * A single autonomous spirit entity in the world.
 * Multiple instances of the same ElementType can coexist simultaneously.
 */
export interface SpiritInstance {
  instanceId: SpiritInstanceId;
  element: ElementType;
  emotion: EmotionType;
  isSpeaking: boolean;
  isHovered: boolean;
  /** Individual spirit name, e.g. "Emberlyn". */
  name: string;
  /** Short element type label, e.g. "Fire Spirit". */
  typeLabel: string;
  /** Full display string shown in UI, e.g. "Emberlyn · Fire Spirit". */
  displayName: string;
  /** Per-instance size multiplier (0.85–1.15) — makes each instance feel unique. */
  sizeVariant: number;
  /** 0–1 seed for staggered animation timing — prevents synchronized clones. */
  personalityOffset: number;
  /** Initial world X position as % of viewport width (3–97). */
  worldX: number;
  /** Initial world Y position as % of full document height (2–98). */
  worldY: number;
  /** Current combat animation state. */
  combatStatus: CombatStatus;
  /** Role in the active combat event, if any. */
  combatRole?: CombatRole;
}

export interface SpiritDefinition {
  id: ElementType;
  name: string;
  symbol: string;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  shadowColor: string;
  personality: string;
  speakingStyle: string;
  defaultEmotion: EmotionType;
  motionPattern: MotionPattern;
  motionSpeed: number; // 1–5
  size: number;        // multiplier
}

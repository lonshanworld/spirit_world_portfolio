'use client';

/**
 * MagicEffect — Elemental magic particle system for spirit entities.
 *
 * Renders CSS/Framer Motion particles that fly from the spirit's center
 * on triggered spell casts (speaking, hover, tap, idle, emotion change).
 *
 * Safety constraints:
 *  - pointer-events: none  → never interferes with UI interaction
 *  - overflow: visible     → particles escape bounding box correctly
 *  - Particles fade to opacity 0 before reaching max travel distance
 *  - reducedMotion: particle count halved, heavy spells skipped
 *  - Idle spells staggered by personalityOffset to prevent sync'd flashes
 */

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ElementType, EmotionType } from '../../types/spirit.types';
import {
  SpellDef,
  SpellTrigger,
  SpellTrajectory,
  ParticleShape,
  ELEMENT_SPELLS,
  EMOTION_TRIGGER_MAP,
} from '../../systems/magicSystem';

// ── Trajectory → particle endpoint ───────────────────────────────

function getEndpoint(
  trajectory: SpellTrajectory,
  index: number,
  total: number,
  speedPx: number,
): { x: number[]; y: number[] } {
  const dist = speedPx * (0.65 + Math.random() * 0.70);

  switch (trajectory) {
    case 'explode': {
      const angle = (index / total) * Math.PI * 2 + (Math.random() - 0.5) * 0.55;
      return { x: [0, Math.cos(angle) * dist], y: [0, Math.sin(angle) * dist] };
    }

    case 'burst-up': {
      // Upper hemisphere: -160° to -20° (0° = right, -90° = straight up)
      const angle =
        (-Math.PI * 5) / 6 + (index / total) * ((Math.PI * 4) / 6) + (Math.random() - 0.5) * 0.45;
      return { x: [0, Math.cos(angle) * dist], y: [0, Math.sin(angle) * dist] };
    }

    case 'rise': {
      const spread = (Math.random() - 0.5) * 0.65;
      return {
        x: [0, Math.cos(-Math.PI / 2 + spread) * dist * 0.5],
        y: [0, -dist],
      };
    }

    case 'rain': {
      const spread = (Math.random() - 0.5) * 0.45;
      return {
        x: [0, Math.sin(spread) * dist * 0.4],
        y: [0, dist],
      };
    }

    case 'spiral': {
      const startAngle = (index / total) * Math.PI * 2;
      const step = Math.PI * 0.85;
      return {
        x: [
          0,
          Math.cos(startAngle + step)     * dist * 0.28,
          Math.cos(startAngle + step * 2) * dist * 0.62,
          Math.cos(startAngle + step * 3) * dist,
        ],
        y: [
          0,
          Math.sin(startAngle + step)     * dist * 0.28,
          Math.sin(startAngle + step * 2) * dist * 0.62,
          Math.sin(startAngle + step * 3) * dist,
        ],
      };
    }

    case 'orbit': {
      const angle = (index / total) * Math.PI * 2;
      const r = dist * 0.72;
      return {
        x: [0, Math.cos(angle) * r * 0.4, Math.cos(angle) * r, Math.cos(angle + Math.PI) * r * 0.5],
        y: [0, Math.sin(angle) * r * 0.4, Math.sin(angle) * r, Math.sin(angle + Math.PI) * r * 0.5],
      };
    }

    default: {
      const angle = (index / total) * Math.PI * 2;
      return { x: [0, Math.cos(angle) * dist], y: [0, Math.sin(angle) * dist] };
    }
  }
}

// ── Shape → CSS style ─────────────────────────────────────────────

function shapeStyle(
  shape: ParticleShape,
  color: string,
  glowColor: string | undefined,
  sizePx: number,
): React.CSSProperties {
  const shadow = glowColor
    ? `0 0 ${sizePx * 2.2}px ${glowColor}, 0 0 ${sizePx * 0.7}px ${glowColor}`
    : undefined;

  switch (shape) {
    case 'circle':
      return { borderRadius: '50%', background: color, boxShadow: shadow };

    case 'diamond':
      return { borderRadius: '2px', background: color, transform: 'rotate(45deg)', boxShadow: shadow };

    case 'leaf':
      return {
        borderRadius: '50% 50% 50% 0',
        background: color,
        transform: `rotate(${-45 + Math.random() * 90}deg)`,
        boxShadow: shadow,
      };

    case 'bolt':
      return {
        borderRadius: '1px',
        background: color,
        width: sizePx * 0.35,
        height: sizePx * 2.1,
        transform: `rotate(${22 + Math.random() * 32}deg)`,
        boxShadow: shadow,
      };

    case 'square':
      return { borderRadius: '2px', background: color, boxShadow: shadow };

    case 'ring':
      return {
        borderRadius: '50%',
        background: 'transparent',
        border: `2px solid ${color}`,
        boxShadow: shadow,
      };

    default:
      return { borderRadius: '50%', background: color, boxShadow: shadow };
  }
}

// ── MagicParticle ─────────────────────────────────────────────────

interface ParticleProps {
  spell: SpellDef;
  index: number;
  total: number;
}

function MagicParticle({ spell, index, total }: ParticleProps) {
  // All random values computed once per particle instance
  const sizePx = useMemo(
    () => spell.sizePx[0] + Math.random() * (spell.sizePx[1] - spell.sizePx[0]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const color = spell.colors[index % spell.colors.length];

  const endpoint = useMemo(
    () => getEndpoint(spell.trajectory, index, total, spell.speedPx),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const style = useMemo(
    () => shapeStyle(spell.shape, color, spell.glowColor, sizePx),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const delay = (index / total) * 0.10;
  const durSec = spell.durationMs / 1000;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: -sizePx / 2,
        top: -sizePx / 2,
        width: sizePx,
        height: sizePx,
        ...style,
      }}
      initial={{ x: 0, y: 0, opacity: 0.92, scale: 1 }}
      animate={{
        x: endpoint.x,
        y: endpoint.y,
        opacity: [0.92, 0.75, 0],
        scale: [1, 1.08, 0.05],
      }}
      transition={{
        duration: durSec,
        ease: 'easeOut',
        delay,
        times: endpoint.x.length === 4 ? [0, 0.3, 0.65, 1] : [0, 0.45, 1],
      }}
    />
  );
}

// ── SpellEffect (one cast event) ──────────────────────────────────

interface SpellEffectProps {
  spell: SpellDef;
  reducedMotion: boolean;
}

function SpellEffect({ spell, reducedMotion }: SpellEffectProps) {
  const count = reducedMotion
    ? Math.max(3, Math.ceil(spell.particleCount / 2))
    : spell.particleCount;

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <MagicParticle key={i} spell={spell} index={i} total={count} />
      ))}
    </>
  );
}

// ── Active spell tracking ─────────────────────────────────────────

interface ActiveSpell {
  instanceId: string;
  spell: SpellDef;
}

// ── Main component ────────────────────────────────────────────────

export interface MagicEffectProps {
  element: ElementType;
  emotion: EmotionType;
  isSpeaking: boolean;
  isHovered: boolean;
  isTapped: boolean;
  personalityOffset: number;
  /** Callback so SpiritOrb can drive casting glow in SpiritCreature */
  onCastingChange?: (casting: boolean) => void;
}

export function MagicEffect({
  element,
  emotion,
  isSpeaking,
  isHovered,
  isTapped,
  personalityOffset,
  onCastingChange,
}: MagicEffectProps) {
  const [activeSpells, setActiveSpells] = useState<ActiveSpell[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  const idleTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastIdleRef   = useRef<Record<string, number>>({});
  const prevSpeaking  = useRef(false);
  const prevHovered   = useRef(false);
  const prevTapped    = useRef(false);
  const prevEmotion   = useRef<EmotionType>(emotion);

  // Detect reduced-motion preference and small screens
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches || window.innerWidth < 640);
  }, []);

  // Notify parent whether any spell is active
  useEffect(() => {
    onCastingChange?.(activeSpells.length > 0);
  }, [activeSpells.length, onCastingChange]);

  const castSpell = useCallback(
    (spell: SpellDef) => {
      // Skip heavy spells in reduced-motion mode
      if (reducedMotion && spell.particleCount > 7) return;

      const instanceId = `${spell.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setActiveSpells((prev) => [...prev, { instanceId, spell }]);

      // Remove after animation completes + brief buffer
      setTimeout(() => {
        setActiveSpells((prev) => prev.filter((s) => s.instanceId !== instanceId));
      }, spell.durationMs + 500);
    },
    [reducedMotion],
  );

  const findAndCast = useCallback(
    (trigger: SpellTrigger) => {
      const eligible = (ELEMENT_SPELLS[element] ?? []).filter((s) => s.triggers.includes(trigger));
      if (eligible.length === 0) return;
      castSpell(eligible[Math.floor(Math.random() * eligible.length)]);
    },
    [element, castSpell],
  );

  // ── Trigger: speaking ────────────────────────────────────────
  useEffect(() => {
    if (isSpeaking && !prevSpeaking.current) findAndCast('speaking');
    prevSpeaking.current = isSpeaking;
  }, [isSpeaking, findAndCast]);

  // ── Trigger: hover ───────────────────────────────────────────
  useEffect(() => {
    if (isHovered && !prevHovered.current) findAndCast('hover');
    prevHovered.current = isHovered;
  }, [isHovered, findAndCast]);

  // ── Trigger: tap ─────────────────────────────────────────────
  useEffect(() => {
    if (isTapped && !prevTapped.current) findAndCast('tap');
    prevTapped.current = isTapped;
  }, [isTapped, findAndCast]);

  // ── Trigger: emotion change ──────────────────────────────────
  useEffect(() => {
    if (emotion !== prevEmotion.current) {
      const trigger = EMOTION_TRIGGER_MAP[emotion];
      if (trigger) findAndCast(trigger);
      prevEmotion.current = emotion;
    }
  }, [emotion, findAndCast]);

  // ── Idle spell scheduler ──────────────────────────────────────
  useEffect(() => {
    const idleSpells = (ELEMENT_SPELLS[element] ?? []).filter((s) => s.triggers.includes('idle'));
    if (idleSpells.length === 0) return;

    let cancelled = false;

    function scheduleNext() {
      // Each spirit gets a unique idle interval: 9–22s, shaped by personality
      const base   = 9000 + personalityOffset * 13000;
      const jitter = Math.random() * 8000;

      idleTimerRef.current = setTimeout(() => {
        if (cancelled) return;

        const now = Date.now();
        const eligible = idleSpells.filter((s) => {
          const last = lastIdleRef.current[s.id] ?? 0;
          return now - last >= (s.idleCooldownMs ?? 0);
        });

        if (eligible.length > 0) {
          const spell = eligible[Math.floor(Math.random() * eligible.length)];
          lastIdleRef.current[spell.id] = now;
          castSpell(spell);
        }

        scheduleNext();
      }, base + jitter);
    }

    // Stagger first idle cast by personalityOffset so not all fire at once
    const initialDelay = 3000 + personalityOffset * 14000;
    const initTimer = setTimeout(scheduleNext, initialDelay);

    return () => {
      cancelled = true;
      clearTimeout(initTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [element, personalityOffset, castSpell]);

  if (activeSpells.length === 0) return null;

  return (
    /*
     * Zero-size anchor positioned at the spirit's center.
     * overflow: visible allows particles to escape the bounding box.
     * pointer-events: none ensures UI is never blocked.
     */
    <div
      className="absolute pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        width: 0,
        height: 0,
        overflow: 'visible',
        zIndex: 8,
      }}
    >
      {activeSpells.map(({ instanceId, spell }) => (
        <SpellEffect key={instanceId} spell={spell} reducedMotion={reducedMotion} />
      ))}
    </div>
  );
}

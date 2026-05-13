'use client';

import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useEffect, useCallback, useState, useRef } from 'react';
import { ElementType, EmotionType, SpiritInstance, SpiritInstanceId, SpiritDefinition, CombatStatus } from '../../types/spirit.types';
import { SPIRIT_DEFINITIONS } from '../../systems/elementData';
import { SpiritCreature } from './SpiritCreature';
import { MagicEffect } from '../magic/MagicEffect';
import { SpiritAura } from '../magic/SpiritAura';
import { SpiritMagicSeal } from '../effects/SpiritMagicSeal';
import { useDialogueStore } from '../../store/dialogueStore';

const MOBILE_LONG_PRESS_MS = 420;
const MOBILE_LONG_PRESS_FREEZE_MS = 1200;
const MOBILE_LONG_PRESS_SEAL_MS = 760;
const POINTER_RELEASE_LOCK_MS = 140;

interface SpiritOrbProps {
  instance: SpiritInstance;
  onTap: (element: ElementType, instanceId: SpiritInstanceId) => SpiritTapPlan;
  onHoverStart: (instanceId: SpiritInstanceId) => void;
  onHoverEnd: (instanceId: SpiritInstanceId) => void;
  /** Global spawn index — used to stagger reveal animations. */
  index: number;
}

export interface SpiritTapPlan {
  mode: 'transform' | 'companion';
  freezeMs: number;
  sealVariant: 'full' | 'mini' | 'none';
  sealMs: number;
}

const MOTION_CONFIGS: Record<string, { x: number[]; y: number[]; duration: number }> = {
  float:   { x: [0,  6, -4,  3,  0], y: [0,  -8,  -4, -10,  0], duration: 26 },
  wave:    { x: [0,  9,  0,  -9, 0], y: [0,  -5,  -9,  -5,  0], duration: 30 },
  erratic: { x: [0,  7, -5,  8, -3,  0], y: [0,  -5, -10, -3,  -8, 0], duration: 22 },
  drift:   { x: [0,  4,  2,  -3, 0], y: [0,  -6,  -3,  -8,  0], duration: 40 },
  pulse:   { x: [0,  2,  0,  -2, 0], y: [0,  -4,  -1,  -4,  0], duration: 20 },
  spin:    { x: [0,  7,  0,  -7, 0], y: [0,  -4, -10,  -4,  0], duration: 28 },
};

function getEmotionScale(emotion: EmotionType): number {
  switch (emotion) {
    case 'excited':    return 1.12;
    case 'mysterious': return 0.92;
    case 'playful':    return 1.08;
    default:           return 1;
  }
}

/** Returns framer-motion animate props to layer on top of normal float, based on combatStatus. */
function getCombatAnimate(status: CombatStatus): Record<string, unknown> {
  switch (status) {
    case 'anticipating':
      return { scale: 1.18, rotate: [-3, 3, -3], transition: { rotate: { repeat: Infinity, duration: 0.25 } } };
    case 'casting':
      return { x: [0, 12, -4, 0], scale: 1.15, transition: { duration: 0.35 } };
    case 'dodging':
      return { x: [0, -40, 20, 0], transition: { duration: 0.4, ease: 'easeOut' } };
    case 'blocking':
      return { scale: [1, 0.9, 1.05, 1], transition: { duration: 0.3 } };
    case 'hit':
      return { x: [0, 28, -14, 0], rotate: [0, 15, -8, 0], transition: { duration: 0.45 } };
    case 'dizzy':
      return { rotate: [0, 360, 720], scale: 0.85, transition: { rotate: { duration: 0.8, ease: 'easeOut' } } };
    case 'recovering':
      return { scale: [0.9, 1.0], transition: { duration: 0.5 } };
    case 'victorious':
      return { y: [0, -20, 0, -12, 0], scale: 1.2, transition: { duration: 0.7 } };
    case 'embarrassed':
      return { x: [0, -6, 6, -4, 0], scale: 0.88, transition: { duration: 0.5 } };
    default:
      return {};
  }
}

// ─── Inline speech bubble (appears above the speaking spirit) ─────
// Lifetime is managed by useSpiritDialogue's queue — no local timer needed.

function SpiritAttachedBubble({
  dialogue, def,
}: {
  dialogue: { id: string; spiritId: string; text: string; targetUser: boolean };
  def: SpiritDefinition;
}) {
  return (
    <motion.div
      key={dialogue.id}
      initial={{ opacity: 0, y: 10, scale: 0.82 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="absolute pointer-events-none"
      style={{
        // Anchored above the spirit orb
        bottom: '110%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '210px',
        // Solid opaque background so text is always readable on any backdrop
        background: 'rgba(10, 10, 18, 0.92)',
        border: `1.5px solid ${def.primaryColor}`,
        borderRadius: '14px',
        boxShadow: `0 4px 32px ${def.glowColor}, 0 0 0 1px ${def.primaryColor}22`,
        padding: '9px 13px',
        zIndex: 60,
        color: '#ffffff',
        marginBottom: '8px',
      }}
    >
      {/* Spirit name tag */}
      <div
        className="flex items-center gap-1 mb-1.5 text-[9px] font-bold tracking-widest uppercase"
        style={{ color: def.primaryColor }}
      >
        <span className="text-[11px]">{def.symbol}</span>
        <span>{def.name}</span>
        {dialogue.targetUser && (
          <span className="ml-1 px-1 rounded-full text-[8px]"
            style={{ background: `${def.primaryColor}33`, color: def.primaryColor }}>
            to you
          </span>
        )}
      </div>

      {/* Dialogue text */}
      <p
        className="text-[12px] font-medium leading-relaxed"
        style={{ color: '#ffffff', textShadow: `0 0 8px ${def.glowColor}` }}
      >
        {dialogue.text}
      </p>

      {/* Speech tail — triangle pointing DOWN to the spirit */}
      <div
        className="absolute"
        style={{
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderTop: `9px solid ${def.primaryColor}55`,
        }}
      />
    </motion.div>
  );
}

// ─── SpiritOrb ────────────────────────────────────────────────────

export function SpiritOrb({
  instance, onTap, onHoverStart, onHoverEnd, index,
}: SpiritOrbProps) {
  const def      = SPIRIT_DEFINITIONS[instance.element];
  const controls = useAnimation();
  const motionCfg = MOTION_CONFIGS[def.motionPattern] ?? MOTION_CONFIGS.float;

  // Long-range wander: changes base position every 18–35s
  // Spirits wander immediately on mount, then pause while speaking.
  const [wanderX, setWanderX] = useState(instance.worldX);
  const [wanderY, setWanderY] = useState(instance.worldY);
  const [facingLeft, setFacingLeft] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [isPointerPressing, setIsPointerPressing] = useState(false);
  const [frozenAnchor, setFrozenAnchor] = useState<{ leftPx: number; topPx: number } | null>(null);
  const [isCasting, setIsCasting] = useState(false);
  const [isSealVisible, setIsSealVisible] = useState(false);
  const [sealVariant, setSealVariant] = useState<'full' | 'mini'>('full');
  const [sealCastId, setSealCastId] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const freezeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressStartRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressNextTapRef = useRef(false);
  const suppressResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggeredRef = useRef(false);
  const hoverReleaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerReleaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevWanderX   = useRef(instance.worldX);
  const isMovementLockedRef = useRef(false);
  const isAnchorLockedRef = useRef(false);

  const isMovementLocked =
    isFrozen || instance.isHovered || instance.isSpeaking || isSealVisible || isPointerPressing;

  useEffect(() => { isMovementLockedRef.current = isMovementLocked; }, [isMovementLocked]);
  useEffect(() => { isAnchorLockedRef.current = !!frozenAnchor;  }, [frozenAnchor]);

  // Track horizontal movement direction for body orientation
  useEffect(() => {
    if (Math.abs(wanderX - prevWanderX.current) > 1) {
      setFacingLeft(wanderX < prevWanderX.current);
      prevWanderX.current = wanderX;
    }
  }, [wanderX]);

  useEffect(() => {
    let cancelled = false;

    const moveTo = () => {
      // Don't pick a new wander target while an interaction, spell, or dialogue is active.
      if (!isMovementLockedRef.current) {
        setWanderX(4 + Math.random() * 92);
        setWanderY(2 + Math.random() * 96);
      }
    };

    // Fire first wander immediately (staggered by index so not all move at once)
    const firstDelay = index * 400 + instance.personalityOffset * 600;
    const firstTimer = setTimeout(() => {
      if (!cancelled) { moveTo(); schedule(); }
    }, firstDelay);

    let nextTimer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = (18000 + Math.random() * 17000) * (0.85 + instance.personalityOffset * 0.3);
      nextTimer = setTimeout(() => {
        if (cancelled) return;
        moveTo();
        schedule();
      }, delay);
    };

    return () => {
      cancelled = true;
      clearTimeout(firstTimer);
      clearTimeout(nextTimer!);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Short-range float animation — speed is fixed; emotion shows through eyes/face only
  const startFloating = useCallback(async () => {
    const cfg = {
      x:        motionCfg.x,
      y:        motionCfg.y,
      duration: motionCfg.duration / def.motionSpeed,
    };
    await controls.start({
      x: cfg.x,
      y: cfg.y,
      transition: {
        duration:   cfg.duration,
        repeat:     Infinity,
        repeatType: 'loop',
        ease:       'easeInOut',
        delay:      index * 0.35 + instance.personalityOffset * 0.8,
      },
    });
  }, [controls, motionCfg, def.motionSpeed, instance.personalityOffset, index]);

  // Float: stop while any action lock is active so the spirit literally holds position.
  // Scale is driven exclusively by whileInView (reacts to emotion changes automatically).
  useEffect(() => {
    let resumeTimer: ReturnType<typeof setTimeout> | null = null;
    if (isMovementLocked) {
      controls.stop();
    } else {
      resumeTimer = setTimeout(() => {
        startFloating();
      }, 300);
    }
    return () => {
      if (resumeTimer) clearTimeout(resumeTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMovementLocked]);

  // Combat animations — applied through controls; reset and restart float when done.
  useEffect(() => {
    if (instance.combatStatus === 'idle') {
      controls.start({ rotate: 0, transition: { duration: 0.4 } });
      if (!isMovementLockedRef.current) startFloating();
    } else {
      controls.start(getCombatAnimate(instance.combatStatus) as Parameters<typeof controls.start>[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance.combatStatus]);

  // Dialogue: single global slot — bubble shows on the speaking element only
  const currentDialogue = useDialogueStore((s) => s.current);
  const activeDialogue = currentDialogue
    && currentDialogue.spiritId === instance.element
    && (!currentDialogue.spiritInstanceId || currentDialogue.spiritInstanceId === instance.instanceId)
      ? currentDialogue
      : null;
  const showBubble      = instance.isSpeaking && !!activeDialogue;

  useEffect(
    () => () => {
      if (sealTimerRef.current) clearTimeout(sealTimerRef.current);
      if (freezeTimerRef.current) clearTimeout(freezeTimerRef.current);
      if (longPressStartRef.current) clearTimeout(longPressStartRef.current);
      if (hoverReleaseTimerRef.current) clearTimeout(hoverReleaseTimerRef.current);
      if (suppressResetTimerRef.current) clearTimeout(suppressResetTimerRef.current);
      if (pointerReleaseTimerRef.current) clearTimeout(pointerReleaseTimerRef.current);
    },
    [],
  );

  const lockCurrentPosition = useCallback(() => {
    const node = wrapperRef.current;
    if (!node) return;

    const parent = node.offsetParent as HTMLElement | null;
    const leftPx = node.offsetLeft;
    const topPx = node.offsetTop;
    setFrozenAnchor({ leftPx, topPx });

    if (parent && parent.clientWidth > 0 && parent.clientHeight > 0) {
      const x = (leftPx / parent.clientWidth) * 100;
      const y = (topPx / parent.clientHeight) * 100;
      setWanderX(x);
      setWanderY(y);
      prevWanderX.current = x;
    }
  }, []);

  const stopMovementNow = useCallback(() => {
    lockCurrentPosition();
    controls.stop();
  }, [controls, lockCurrentPosition]);

  useEffect(() => {
    if (isMovementLocked) {
      if (!isAnchorLockedRef.current) lockCurrentPosition();
      controls.stop();
      return;
    }

    if (isAnchorLockedRef.current) {
      setFrozenAnchor(null);
    }
  }, [controls, isMovementLocked, lockCurrentPosition]);

  const releasePointerPressSoon = useCallback(() => {
    if (pointerReleaseTimerRef.current) clearTimeout(pointerReleaseTimerRef.current);
    pointerReleaseTimerRef.current = setTimeout(() => {
      setIsPointerPressing(false);
      pointerReleaseTimerRef.current = null;
    }, POINTER_RELEASE_LOCK_MS);
  }, []);

  const applyTapPlan = useCallback((plan: SpiritTapPlan) => {
    lockCurrentPosition();
    setIsFrozen(true);

    if (freezeTimerRef.current) clearTimeout(freezeTimerRef.current);
    freezeTimerRef.current = setTimeout(() => {
      setIsFrozen(false);
      setFrozenAnchor(null);
      freezeTimerRef.current = null;
    }, plan.freezeMs);

    if (sealTimerRef.current) clearTimeout(sealTimerRef.current);
    if (plan.sealVariant === 'none') {
      setIsSealVisible(false);
      return;
    }

    setSealVariant(plan.sealVariant);
    setSealCastId((v) => v + 1);
    setIsSealVisible(true);
    sealTimerRef.current = setTimeout(() => {
      setIsSealVisible(false);
    }, plan.sealMs);
  }, [lockCurrentPosition]);

  const triggerMobileLongPressInteraction = useCallback(() => {
    longPressTriggeredRef.current = true;
    suppressNextTapRef.current = true;

    if (suppressResetTimerRef.current) clearTimeout(suppressResetTimerRef.current);
    suppressResetTimerRef.current = setTimeout(() => {
      suppressNextTapRef.current = false;
      longPressTriggeredRef.current = false;
      suppressResetTimerRef.current = null;
    }, 420);

    onHoverStart(instance.instanceId);
    applyTapPlan({
      mode: 'companion',
      freezeMs: MOBILE_LONG_PRESS_FREEZE_MS,
      sealVariant: 'mini',
      sealMs: MOBILE_LONG_PRESS_SEAL_MS,
    });

    if (hoverReleaseTimerRef.current) clearTimeout(hoverReleaseTimerRef.current);
    hoverReleaseTimerRef.current = setTimeout(() => {
      onHoverEnd(instance.instanceId);
      hoverReleaseTimerRef.current = null;
    }, MOBILE_LONG_PRESS_FREEZE_MS);
  }, [applyTapPlan, instance.instanceId, onHoverEnd, onHoverStart]);

  const clearLongPressStart = useCallback(() => {
    if (longPressStartRef.current) {
      clearTimeout(longPressStartRef.current);
      longPressStartRef.current = null;
    }
  }, []);

  // Wander transition: always use the slow CSS glide.
  // NEVER snap to 'none' — that causes an instant jump to the wander target
  // because wanderX/Y is already set to the new position when the timer fires.
  // New wander targets are blocked by the movement lock guard.
  const wanderDuration = (22 + instance.personalityOffset * 16).toFixed(1);
  const wanderTransition = `left ${wanderDuration}s ease-in-out, top ${wanderDuration}s ease-in-out`;

  return (
    /* Wander wrapper — CSS-animated long-range movement through the world */
    <div
      ref={wrapperRef}
      style={{
        position:   'absolute',
        left:       frozenAnchor ? `${frozenAnchor.leftPx}px` : `${wanderX}%`,
        top:        frozenAnchor ? `${frozenAnchor.topPx}px` : `${wanderY}%`,
        transform:  'translate(-50%, -50%)',
        zIndex:     30,
        transition: isMovementLocked || frozenAnchor ? 'none' : wanderTransition,
      }}
    >
      {/* ── Speech bubble — direct child of wander wrapper, outside all Framer Motion transforms.
           This guarantees the bubble scrolls and moves with the spirit at ALL times. ── */}
      <AnimatePresence>
        {showBubble && activeDialogue && (
          <SpiritAttachedBubble
            dialogue={activeDialogue}
            def={def}
          />
        )}
      </AnimatePresence>

      {/* Float wrapper — Framer Motion short-range oscillation */}
      <motion.div
        animate={controls}
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: getEmotionScale(instance.emotion) * instance.sizeVariant }}
        viewport={{ once: true, margin: '200px' }}
        transition={{
          delay:     index * 0.06 + instance.personalityOffset * 1.5,
          type:      'spring',
          stiffness: 120,
          damping:   12,
        }}
        onTap={() => {
          if (suppressNextTapRef.current) {
            if (suppressResetTimerRef.current) {
              clearTimeout(suppressResetTimerRef.current);
              suppressResetTimerRef.current = null;
            }
            suppressNextTapRef.current = false;
            longPressTriggeredRef.current = false;
            return;
          }

          const plan = onTap(instance.element, instance.instanceId);
          applyTapPlan(plan);
        }}
        onPointerDown={(e) => {
          setIsPointerPressing(true);
          if (pointerReleaseTimerRef.current) {
            clearTimeout(pointerReleaseTimerRef.current);
            pointerReleaseTimerRef.current = null;
          }
          stopMovementNow();
          if (e.pointerType !== 'touch') return;
          longPressTriggeredRef.current = false;
          clearLongPressStart();
          longPressStartRef.current = setTimeout(() => {
            longPressStartRef.current = null;
            triggerMobileLongPressInteraction();
          }, MOBILE_LONG_PRESS_MS);
        }}
        onPointerUp={(e) => {
          releasePointerPressSoon();
          if (e.pointerType !== 'touch') return;
          clearLongPressStart();
          if (longPressTriggeredRef.current) {
            if (hoverReleaseTimerRef.current) {
              clearTimeout(hoverReleaseTimerRef.current);
              hoverReleaseTimerRef.current = null;
            }
            onHoverEnd(instance.instanceId);
          }
        }}
        onPointerCancel={(e) => {
          releasePointerPressSoon();
          if (e.pointerType !== 'touch') return;
          clearLongPressStart();
          if (longPressTriggeredRef.current) {
            if (hoverReleaseTimerRef.current) {
              clearTimeout(hoverReleaseTimerRef.current);
              hoverReleaseTimerRef.current = null;
            }
            onHoverEnd(instance.instanceId);
          }
        }}
        onHoverStart={() => {
          stopMovementNow();
          onHoverStart(instance.instanceId);
        }}
        onHoverEnd={() => onHoverEnd(instance.instanceId)}
        whileHover={{ scale: 1.18 }}
        whileTap={{ scale: 0.92 }}
        className="cursor-pointer select-none"
        style={{ position: 'relative', overflow: 'visible', touchAction: 'manipulation' }}
      >
        {/* ── Spirit creature body ── */}
        <div
          role="button"
          aria-label={`${def.name} spirit — tap to transform`}
          className="cursor-pointer"
          style={{ position: 'relative' }}
        >
          {/* SVG elemental aura — element-specific visual identity, rendered behind the spirit body */}
          <SpiritAura
            element={instance.element}
            primaryColor={def.primaryColor}
            secondaryColor={def.secondaryColor}
            glowColor={def.glowColor}
            size={Math.round(90 * def.size * instance.sizeVariant)}
            isSpeaking={instance.isSpeaking}
          />
          <SpiritCreature
            element={instance.element}
            emotion={instance.emotion}
            isSpeaking={instance.isSpeaking}
            isHovered={instance.isHovered}
            isCasting={isCasting || isSealVisible || isFrozen}
            size={def.size * instance.sizeVariant}
            instanceId={instance.instanceId}
            facingLeft={isFrozen ? false : facingLeft}
          />
        </div>

        {/* ── Elemental magic particle layer ── */}
        <MagicEffect
          element={instance.element}
          emotion={instance.emotion}
          isSpeaking={instance.isSpeaking}
          isHovered={instance.isHovered}
          isTapped={false}
          personalityOffset={instance.personalityOffset}
          onCastingChange={setIsCasting}
        />

        <SpiritMagicSeal
          element={instance.element}
          primaryColor={def.primaryColor}
          secondaryColor={def.secondaryColor}
          glowColor={def.glowColor}
          visible={isSealVisible}
          castId={sealCastId}
          variant={sealVariant}
        />

        {/* ── Name badge (visible on hover) ── */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold tracking-widest uppercase pointer-events-none"
          style={{
            top:        '105%',
            color:      def.primaryColor,
            textShadow: `0 0 10px ${def.glowColor}`,
          }}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: instance.isHovered ? 1 : 0, y: instance.isHovered ? 0 : -4 }}
          transition={{ duration: 0.2 }}
        >
          {instance.displayName ?? def.name}
        </motion.div>
      </motion.div>
    </div>
  );
}

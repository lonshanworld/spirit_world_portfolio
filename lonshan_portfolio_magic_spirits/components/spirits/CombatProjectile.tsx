'use client';

/**
 * CombatProjectile.tsx
 *
 * Animated magical projectile that travels from an attacker spirit to a defender.
 * Rendered as a fixed-position overlay so it can cross the entire viewport.
 *
 * Positions are computed from spirit worldX/worldY (0–100% of document).
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CombatSpell, CollisionReaction } from '../../systems/combatSystem';

interface Pos { x: number; y: number }

export interface ProjectileData {
  id: string;
  spell: CombatSpell;
  from: Pos;   // viewport-relative px
  to: Pos;     // viewport-relative px
  collision: CollisionReaction | null;
  onImpact: () => void;
}

// ─── Impact burst ─────────────────────────────────────────────────

function ImpactBurst({ pos, spell, reaction, onDone }: {
  pos: Pos;
  spell: CombatSpell;
  reaction: CollisionReaction | null;
  onDone: () => void;
}) {
  const color  = reaction?.color ?? spell.glow;
  const symbol = reaction?.particleSymbol ?? spell.impactSymbol;

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: pos.x,
        top:  pos.y,
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
      initial={{ opacity: 1, scale: 0.3 }}
      animate={{ opacity: 0, scale: 3.5 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      onAnimationComplete={onDone}
    >
      {/* Shockwave ring */}
      <div
        style={{
          position: 'absolute',
          inset: '-30px',
          borderRadius: '50%',
          border: `3px solid ${color}`,
          boxShadow: `0 0 24px ${color}`,
          opacity: 0.7,
        }}
      />
      {/* Symbol burst — 6 radial particles */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * 360;
        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              fontSize: '18px',
              originX: '50%',
              originY: '50%',
              transform: `rotate(${angle}deg) translateY(-28px)`,
            }}
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.5, y: -20 }}
            transition={{ duration: 0.5, delay: i * 0.04 }}
          >
            {symbol}
          </motion.div>
        );
      })}
      {/* Core flash */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 40px 20px ${color}`,
        }}
      />
    </motion.div>
  );
}

// ─── Projectile ───────────────────────────────────────────────────

export function CombatProjectile({ data, onComplete }: {
  data: ProjectileData;
  onComplete: (id: string) => void;
}) {
  const [phase, setPhase] = useState<'travel' | 'impact' | 'done'>('travel');
  const { spell, from, to, collision } = data;

  // Travel duration based on distance + speed tier
  const dx       = to.x - from.x;
  const dy       = to.y - from.y;
  const dist     = Math.sqrt(dx * dx + dy * dy);
  const speedMs  = spell.speed === 'fast' ? 380 : spell.speed === 'medium' ? 580 : 820;
  const duration = Math.min(speedMs, 160 + dist * 1.2) / 1000;

  // Rotation angle from→to
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  // Orb size
  const orbSize = spell.shape === 'bolt' ? 12 : spell.shape === 'beam' ? 8 : 16;

  useEffect(() => {
    if (phase === 'travel') {
      const t = setTimeout(() => {
        data.onImpact();
        setPhase('impact');
      }, duration * 1000 + 50);
      return () => clearTimeout(t);
    }
  }, [phase, duration, data]);

  return (
    <>
      {/* Travelling projectile */}
      <AnimatePresence>
        {phase === 'travel' && (
          <motion.div
            style={{
              position: 'fixed',
              left: from.x,
              top:  from.y,
              zIndex: 9998,
              pointerEvents: 'none',
              transform: `translate(-50%, -50%) rotate(${angle}deg)`,
            }}
            animate={{ x: dx, y: dy }}
            transition={{ duration, ease: 'easeIn' }}
          >
            {/* Trail glow */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: 0,
                transform: 'translateY(-50%)',
                width: orbSize * 3,
                height: orbSize * 0.6,
                background: `linear-gradient(to left, ${spell.color}00, ${spell.glow}88)`,
                borderRadius: '50%',
              }}
            />
            {/* Core orb */}
            <div
              style={{
                width:        orbSize,
                height:       spell.shape === 'bolt' ? orbSize * 0.5 : orbSize,
                borderRadius: spell.shape === 'bolt' ? '2px' : '50%',
                background:   spell.color,
                boxShadow:    `0 0 ${orbSize * 2}px ${orbSize}px ${spell.glow}`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Impact burst */}
      <AnimatePresence>
        {phase === 'impact' && (
          <ImpactBurst
            pos={to}
            spell={spell}
            reaction={collision}
            onDone={() => {
              setPhase('done');
              onComplete(data.id);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

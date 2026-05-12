'use client';

/**
 * SpiritAura — SVG-based elemental aura system.
 *
 * Each element uses a DISTINCT visual approach — NOT generic orbiting particles.
 *
 *  fire      → animated flame tongues wrapping the body + heat shimmer
 *  water     → expanding concentric ripple rings + flowing edge
 *  lightning → electric arcs crawling the body outline + flash pulses
 *  void      → SVG feTurbulence distortion + expanding event-horizon rings
 *  space     → starfield scatter + rotating orbital band + cosmic glow
 *  ice       → rotating 6-arm crystal structure + frost ring
 *  healing   → rising orbs + soft cross-glow pulse
 *  light     → rotating starburst rays + radiant bloom
 *  dark      → shadow haze + slow orbiting mist line
 *  others    → ambient element-color glow ring
 *
 * Architecture:
 *  - Pure SVG + Framer Motion (no Canvas 2D)
 *  - Each element is a self-contained sub-component with useId() for stable IDs
 *  - Hooks follow React rules: all at top-level of each component function
 */

import { motion } from 'framer-motion';
import { useId, useMemo } from 'react';
import { ElementType } from '../../types/spirit.types';

// ─── Props ────────────────────────────────────────────────────────

export interface SpiritAuraProps {
  element: ElementType;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  /** CSS display size in px — aura SVG is rendered at this size, centered over the spirit */
  size: number;
  isSpeaking: boolean;
}

// ─── Shared helper ────────────────────────────────────────────────

const SVG_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  pointerEvents: 'none',
  overflow: 'visible',
  zIndex: 1,
};

// ─── FIRE aura ────────────────────────────────────────────────────
// Flame tongues radiate outward from the body silhouette.
// feTurbulence filter adds heat-shimmer distortion to the glow.

function FireAura({
  primary, secondary, glow, size, speaking,
}: { primary: string; secondary: string; glow: string; size: number; speaking: boolean }) {
  const uid   = useId();
  const S     = size;
  const cx    = S / 2;
  const cy    = S * 0.52;
  const count = speaking ? 7 : 5;

  // Stable flame anchor positions around the body silhouette
  const flames = useMemo(() => Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rx    = S * 0.20 + (i % 3) * S * 0.03;
    const ry    = S * 0.28 + (i % 2) * S * 0.02;
    const bx    = cx + Math.cos(angle) * rx;
    const by    = cy + Math.sin(angle) * ry;
    const tx    = bx + Math.cos(angle) * S * (0.07 + (i % 3) * 0.025);
    const ty    = by + Math.sin(angle) * S * (0.07 + (i % 3) * 0.025) - S * 0.04;
    const mx    = bx + Math.cos(angle + 0.5) * S * 0.04;
    const my    = by + Math.sin(angle + 0.5) * S * 0.04;
    return { bx, by, tx, ty, mx, my, delay: i * 0.14, dur: 0.75 + (i % 3) * 0.2 };
  }), [S, cx, cy]);

  const filterId = `ff-${uid}`;
  const gradId   = `fg-${uid}`;

  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={SVG_STYLE}>
      <defs>
        <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="4" result="noise">
            <animate attributeName="baseFrequency" values="0.022;0.032;0.022" dur="2s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <radialGradient id={gradId} cx="50%" cy="58%" r="58%">
          <stop offset="0%"   stopColor={secondary} stopOpacity="0.75" />
          <stop offset="45%"  stopColor={primary}   stopOpacity="0.45" />
          <stop offset="100%" stopColor={glow}       stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Heat shimmer glow — distorted by feTurbulence */}
      <motion.ellipse
        cx={cx} cy={cy} rx={S * 0.22} ry={S * 0.30}
        fill={`url(#${gradId})`}
        filter={`url(#${filterId})`}
        animate={{ opacity: [0.55, 0.85, 0.55], scaleY: [1, 1.05, 0.97, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Flame tongues — bezier paths from body edge outward */}
      {flames.slice(0, count).map(({ bx, by, tx, ty, mx, my, delay, dur }, i) => (
        <motion.path
          key={i}
          d={`M ${bx.toFixed(1)} ${by.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)}`}
          stroke={i % 2 === 0 ? secondary : primary}
          strokeWidth={1.8 - (i % 3) * 0.3}
          fill="none"
          strokeLinecap="round"
          animate={{ opacity: [0, 0.9, 0.55, 0.85, 0], scaleY: [0.7, 1.2, 0.85, 1.1, 0.7] }}
          transition={{ duration: dur, repeat: Infinity, delay, ease: 'easeInOut' }}
          style={{ transformOrigin: `${bx.toFixed(1)}px ${by.toFixed(1)}px` }}
        />
      ))}

      {/* Ember veins — glowing energy traces threading inside the body silhouette */}
      {[0, 1, 2].map((i) => {
        const a  = (i / 3) * Math.PI * 1.6 - 0.5;
        const sx = cx + Math.cos(a + Math.PI) * S * 0.09;
        const sy = cy + Math.sin(a + Math.PI) * S * 0.10;
        const ex = cx + Math.cos(a) * S * 0.11;
        const ey = cy + Math.sin(a) * S * 0.10;
        const mx = (sx + ex) / 2 + Math.sin(a) * S * 0.05;
        const my = (sy + ey) / 2 - Math.cos(a) * S * 0.04;
        return (
          <motion.path
            key={`ev-${i}`}
            d={`M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`}
            stroke={i === 0 ? '#FFD700' : i === 1 ? '#FF8C00' : '#FF4500'}
            strokeWidth="1.0"
            fill="none"
            strokeLinecap="round"
            animate={{ opacity: [0.25, 0.88, 0.40, 0.75, 0.25], strokeWidth: [1.0, 1.7, 1.0] }}
            transition={{ duration: 1.1 + i * 0.3, repeat: Infinity, delay: i * 0.38, ease: 'easeInOut' }}
          />
        );
      })}

      {/* Smoke wisps — dark semi-transparent blobs drifting up from the body base */}
      {[0, 1, 2].map((i) => (
        <motion.ellipse
          key={`sw-${i}`}
          cx={cx + (i - 1) * S * 0.09}
          cy={cy + S * 0.17}
          rx={S * (0.028 + i * 0.008)}
          ry={S * 0.016}
          fill="rgba(25,8,3,0.38)"
          style={{ filter: 'blur(5px)' }}
          animate={{
            cy:      [cy + S * 0.17, cy - S * 0.24],
            rx:      [S * (0.028 + i * 0.008), S * (0.055 + i * 0.014)],
            opacity: [0, 0.40, 0.20, 0],
          }}
          transition={{ duration: 2.4 + i * 0.35, repeat: Infinity, delay: i * 0.70, ease: 'easeOut' }}
        />
      ))}

      {/* Outer fire halo */}
      <motion.ellipse
        cx={cx} cy={cy} rx={S * 0.26} ry={S * 0.33}
        fill="none"
        stroke={glow}
        strokeWidth="3"
        strokeOpacity="0.30"
        animate={{ opacity: [0.20, 0.50, 0.20], ry: [S * 0.33, S * 0.37, S * 0.33] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'blur(3px)' }}
      />
    </svg>
  );
}

// ─── WATER aura ───────────────────────────────────────────────────
// Concentric ripple rings expand from the body center and fade out.

function WaterAura({
  primary, secondary, glow, size, speaking,
}: { primary: string; secondary: string; glow: string; size: number; speaking: boolean }) {
  const uid   = useId();
  const S     = size;
  const cx    = S / 2;
  const cy    = S * 0.52;
  const rings = speaking ? 4 : 3;
  const gradId = `wg-${uid}`;

  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={SVG_STYLE}>
      <defs>
        <radialGradient id={gradId} cx="50%" cy="54%" r="54%">
          <stop offset="0%"   stopColor={secondary} stopOpacity="0.55" />
          <stop offset="55%"  stopColor={primary}   stopOpacity="0.28" />
          <stop offset="100%" stopColor={glow}       stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Flowing body glow — gentle undulation */}
      <motion.ellipse
        cx={cx} cy={cy} rx={S * 0.24} ry={S * 0.30}
        fill={`url(#${gradId})`}
        animate={{ scaleX: [1, 1.04, 0.97, 1], scaleY: [1, 0.97, 1.04, 1], opacity: [0.65, 0.85, 0.65] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Expanding ripple rings */}
      {Array.from({ length: rings }, (_, i) => {
        const delay  = i * (3.4 / rings);
        const maxRx  = S * (0.26 + i * 0.055);
        const maxRy  = S * (0.33 + i * 0.045);
        return (
          <motion.ellipse
            key={i}
            cx={cx} cy={cy}
            fill="none"
            stroke={i % 2 === 0 ? primary : secondary}
            strokeWidth="1.4"
            animate={{
              rx: [maxRx * 0.45, maxRx, maxRx * 1.35],
              ry: [maxRy * 0.45, maxRy, maxRy * 1.35],
              opacity: [0, 0.70, 0],
            }}
            transition={{ duration: 3.4, repeat: Infinity, delay, ease: 'easeOut' }}
          />
        );
      })}

      {/* Flowing dash ring — water surface shimmer */}
      <motion.ellipse
        cx={cx} cy={cy} rx={S * 0.22} ry={S * 0.28}
        fill="none"
        stroke={secondary}
        strokeWidth="2"
        strokeDasharray="10 7 5 9"
        animate={{ strokeDashoffset: [0, -90], opacity: [0.45, 0.25, 0.45] }}
        transition={{ duration: 5.0, repeat: Infinity, ease: 'linear' }}
      />

      {/* Reflective shimmer — specular white flash glinting along the body edge */}
      {[0, 1, 2].map((i) => {
        const angle = (i / 3) * Math.PI * 2 - 0.25;
        return (
          <motion.ellipse
            key={`ws-${i}`}
            cx={cx + Math.cos(angle) * S * 0.21}
            cy={cy + Math.sin(angle) * S * 0.27}
            rx={S * 0.024}
            ry={S * 0.011}
            fill="rgba(255,255,255,0.90)"
            style={{ filter: 'blur(2px)' }}
            animate={{ opacity: [0, 0.90, 0], rx: [S * 0.014, S * 0.030, S * 0.014] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.50, ease: 'easeInOut' }}
          />
        );
      })}
    </svg>
  );
}

// ─── LIGHTNING aura ───────────────────────────────────────────────
// Electric arcs crawl around the body outline + rapid flash pulses.

function LightningAura({
  primary, secondary, glow, size, speaking,
}: { primary: string; secondary: string; glow: string; size: number; speaking: boolean }) {
  const uid    = useId();
  const S      = size;
  const cx     = S / 2;
  const cy     = S * 0.50;
  const arcCnt = speaking ? 6 : 4;
  const filtId = `lf-${uid}`;

  const arcs = useMemo(() => Array.from({ length: 8 }, (_, i) => {
    const angle    = (i / 8) * Math.PI * 2 + 0.25;
    const startR   = S * 0.22;
    const endR     = S * 0.30 + (i % 3) * S * 0.04;
    const jitter   = S * 0.05;
    const sx = cx + Math.cos(angle) * startR;
    const sy = cy + Math.sin(angle) * startR;
    const ex = cx + Math.cos(angle) * endR + (((i * 7) % 5) - 2) * jitter * 0.5;
    const ey = cy + Math.sin(angle) * endR + (((i * 3) % 4) - 1.5) * jitter * 0.5;
    const mx = (sx + ex) / 2 + (((i * 5) % 5) - 2) * jitter;
    const my = (sy + ey) / 2 + (((i * 4) % 3) - 1) * jitter;
    return { sx, sy, ex, ey, mx, my, delay: i * 0.11 };
  }), [S, cx, cy]);

  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={SVG_STYLE}>
      <defs>
        <filter id={filtId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Crackling body outline — dashed stroke with rapid animation */}
      <motion.ellipse
        cx={cx} cy={cy * 0.96} rx={S * 0.22} ry={S * 0.30}
        fill="none"
        stroke={glow}
        strokeWidth="2.5"
        strokeDasharray="5 3 9 2 4 7"
        filter={`url(#${filtId})`}
        animate={{
          opacity:        [0.85, 0.25, 0.95, 0.40, 0.85],
          strokeDashoffset:[0, -70],
          strokeWidth:    [2.5, 1.4, 3.2, 1.8, 2.5],
        }}
        transition={{ duration: 0.42, repeat: Infinity, ease: 'linear' }}
      />

      {/* Electric arcs radiating outward from body edge */}
      {arcs.slice(0, arcCnt).map(({ sx, sy, ex, ey, mx, my, delay }, i) => (
        <motion.path
          key={i}
          d={`M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`}
          stroke={i % 2 === 0 ? glow : secondary}
          strokeWidth="1.1"
          fill="none"
          strokeLinecap="round"
          filter={`url(#${filtId})`}
          animate={{ opacity: [0, 1, 0, 0.7, 0], pathLength: [0, 1, 1, 0] }}
          transition={{ duration: 0.32, repeat: Infinity, delay, ease: 'easeInOut', repeatDelay: 0.45 + (i % 3) * 0.12 }}
        />
      ))}

      {/* Energy pulse ring — rapid radial expand + fade */}
      <motion.circle
        cx={cx} cy={cy} r={S * 0.25}
        fill="none"
        stroke={primary}
        strokeWidth="1.8"
        animate={{
          r:       [S * 0.20, S * 0.34, S * 0.20],
          opacity: [0.55, 0, 0.55],
        }}
        transition={{ duration: 0.75, repeat: Infinity, ease: 'easeOut' }}
      />
    </svg>
  );
}

// ─── VOID aura ────────────────────────────────────────────────────
// Dark distortion field using feTurbulence + event-horizon rings.

function VoidAura({
  primary, secondary, glow, size,
}: { primary: string; secondary: string; glow: string; size: number; speaking: boolean }) {
  const uid    = useId();
  const S      = size;
  const cx     = S / 2;
  const cy     = S * 0.52;
  const filtId = `vf-${uid}`;
  const gradId = `vg-${uid}`;

  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={SVG_STYLE}>
      <defs>
        {/* Spatial warping distortion */}
        <filter id={filtId} x="-35%" y="-35%" width="170%" height="170%">
          <feTurbulence type="turbulence" baseFrequency="0.016" numOctaves="3" seed="9" result="noise">
            <animate attributeName="baseFrequency" values="0.016;0.024;0.016" dur="5s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <radialGradient id={gradId} cx="50%" cy="50%" r="52%">
          <stop offset="0%"   stopColor={secondary} stopOpacity="0.30" />
          <stop offset="45%"  stopColor={primary}   stopOpacity="0.55" />
          <stop offset="100%" stopColor="#000008"    stopOpacity="0.72" />
        </radialGradient>
      </defs>

      {/* Dark haze mantle — warped by turbulence */}
      <motion.circle
        cx={cx} cy={cy} r={S * 0.28}
        fill={`url(#${gradId})`}
        filter={`url(#${filtId})`}
        animate={{ opacity: [0.50, 0.72, 0.50], scale: [1, 1.03, 0.97, 1] }}
        transition={{ duration: 5.0, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Event-horizon rings expanding outward */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={cx} cy={cy}
          fill="none"
          stroke={i === 0 ? glow : i === 1 ? secondary : primary}
          strokeWidth={i === 0 ? 2.2 : 1.2}
          animate={{
            r:       [S * (0.20 + i * 0.055), S * (0.34 + i * 0.055)],
            opacity: [0, 0.65, 0],
          }}
          transition={{ duration: 4.0, repeat: Infinity, delay: i * 1.25, ease: 'easeOut' }}
        />
      ))}

      {/* Dimensional tear lines — brief flashes */}
      {[0, 1].map((i) => {
        const angle = (i / 2) * Math.PI + 0.5;
        const len   = S * 0.16;
        const x1 = cx - Math.cos(angle) * len;
        const y1 = cy - Math.sin(angle) * len;
        const x2 = cx + Math.cos(angle) * len;
        const y2 = cy + Math.sin(angle) * len;
        return (
          <motion.line
            key={i}
            x1={x1.toFixed(1)} y1={y1.toFixed(1)} x2={x2.toFixed(1)} y2={y2.toFixed(1)}
            stroke={glow}
            strokeWidth="1.8"
            strokeLinecap="round"
            animate={{ opacity: [0, 0.80, 0.25, 0.70, 0], scaleX: [0.4, 1, 0.7, 1, 0.4] }}
            transition={{ duration: 3.2, repeat: Infinity, delay: i * 1.0, ease: 'easeInOut' }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        );
      })}
    </svg>
  );
}

// ─── SPACE aura ───────────────────────────────────────────────────
// Starfield + rotating orbital band + cosmic glow distortion.

function SpaceAura({
  primary, secondary, glow, size, speaking,
}: { primary: string; secondary: string; glow: string; size: number; speaking: boolean }) {
  const uid      = useId();
  const S        = size;
  const cx       = S / 2;
  const cy       = S * 0.52;
  const starCnt  = speaking ? 14 : 10;
  const filtId   = `spf-${uid}`;
  const gradId   = `spg-${uid}`;

  // Stable star positions
  const stars = useMemo(() => Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2 + i * 0.41;
    const dist  = S * (0.19 + (i % 4) * 0.055);
    return {
      x:   cx + Math.cos(angle) * dist,
      y:   cy + Math.sin(angle) * dist,
      r:   0.7 + (i % 4) * 0.4,
      del: (i % 5) * 0.38,
      dur: 1.4 + (i % 3) * 0.7,
    };
  }), [S, cx, cy]);

  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={SVG_STYLE}>
      <defs>
        {/* Cosmic lensing distortion */}
        <filter id={filtId} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="2" seed="14" result="noise">
            <animate attributeName="seed" values="14;20;14" dur="10s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <radialGradient id={gradId} cx="50%" cy="50%" r="52%">
          <stop offset="0%"   stopColor={secondary} stopOpacity="0.28" />
          <stop offset="55%"  stopColor={primary}   stopOpacity="0.38" />
          <stop offset="100%" stopColor="#000012"    stopOpacity="0.65" />
        </radialGradient>
      </defs>

      {/* Deep space body glow — cosmically distorted */}
      <motion.circle
        cx={cx} cy={cy} r={S * 0.27}
        fill={`url(#${gradId})`}
        filter={`url(#${filtId})`}
        animate={{ opacity: [0.50, 0.72, 0.50], scale: [1, 1.03, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Rotating orbital band */}
      <motion.ellipse
        cx={cx} cy={cy} rx={S * 0.31} ry={S * 0.09}
        fill="none"
        stroke={secondary}
        strokeWidth="1.8"
        strokeOpacity="0.55"
        strokeDasharray="9 6"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Nebula clouds — multi-color cosmic gas: pink + teal billowing around the spirit */}
      <motion.ellipse
        cx={cx - S * 0.07} cy={cy + S * 0.06}
        rx={S * 0.20} ry={S * 0.14}
        fill="rgba(206,147,216,0.20)"
        animate={{ opacity: [0.10, 0.30, 0.10], scale: [1, 1.10, 1] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'blur(8px)', transformOrigin: `${(cx - S * 0.07).toFixed(1)}px ${(cy + S * 0.06).toFixed(1)}px` }}
      />
      <motion.ellipse
        cx={cx + S * 0.08} cy={cy - S * 0.07}
        rx={S * 0.16} ry={S * 0.19}
        fill="rgba(79,195,247,0.15)"
        animate={{ opacity: [0.08, 0.24, 0.08], scale: [1, 1.08, 1] }}
        transition={{ duration: 9.0, repeat: Infinity, delay: 2.5, ease: 'easeInOut' }}
        style={{ filter: 'blur(8px)', transformOrigin: `${(cx + S * 0.08).toFixed(1)}px ${(cy - S * 0.07).toFixed(1)}px` }}
      />

      {/* Star field sparkles */}
      {stars.slice(0, starCnt).map((s, i) => (
        <motion.circle
          key={i}
          cx={s.x} cy={s.y} r={s.r}
          fill={i % 3 === 0 ? glow : i % 3 === 1 ? secondary : 'rgba(255,255,255,0.9)'}
          animate={{ opacity: [0.15, 1, 0.35, 0.85, 0.15], r: [s.r * 0.6, s.r * 1.5, s.r] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.del, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  );
}

// ─── ICE aura ─────────────────────────────────────────────────────
// 6-arm rotating crystal structure + frost dashed ring.

function IceAura({
  primary, secondary, glow, size,
}: { primary: string; secondary: string; glow: string; size: number; speaking: boolean }) {
  const uid    = useId();
  const S      = size;
  const cx     = S / 2;
  const cy     = S * 0.52;
  const gradId = `ig-${uid}`;

  const crystals = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2;
    const inner = S * 0.15;
    const outer = S * 0.27;
    const cx2   = cx + Math.cos(angle) * inner;
    const cy2   = cy + Math.sin(angle) * inner;
    const tx    = cx + Math.cos(angle) * outer;
    const ty    = cy + Math.sin(angle) * outer;
    // cross-bar perpendicular to arm
    const bLen  = S * 0.024;
    const perp  = angle + Math.PI / 2;
    return {
      cx2, cy2, tx, ty,
      bx1: cx2 + (tx - cx2) * 0.6 + Math.cos(perp) * bLen,
      by1: cy2 + (ty - cy2) * 0.6 + Math.sin(perp) * bLen,
      bx2: cx2 + (tx - cx2) * 0.6 - Math.cos(perp) * bLen,
      by2: cy2 + (ty - cy2) * 0.6 - Math.sin(perp) * bLen,
      delay: i * 0.12,
    };
  }), [S, cx, cy]);

  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={SVG_STYLE}>
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="52%">
          <stop offset="0%"   stopColor={secondary} stopOpacity="0.48" />
          <stop offset="65%"  stopColor={primary}   stopOpacity="0.25" />
          <stop offset="100%" stopColor={glow}       stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Frosty ambient glow */}
      <motion.ellipse
        cx={cx} cy={cy} rx={S * 0.25} ry={S * 0.31}
        fill={`url(#${gradId})`}
        animate={{ opacity: [0.55, 0.80, 0.55], scaleX: [1, 1.02, 1] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Rotating 6-arm crystal */}
      <motion.g
        animate={{ rotate: [0, 60, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        {crystals.map(({ cx2, cy2, tx, ty, bx1, by1, bx2, by2, delay }, i) => (
          <g key={i}>
            <motion.line
              x1={cx2.toFixed(1)} y1={cy2.toFixed(1)} x2={tx.toFixed(1)} y2={ty.toFixed(1)}
              stroke={i % 2 === 0 ? secondary : primary}
              strokeWidth="1.8"
              strokeLinecap="round"
              animate={{ opacity: [0.55, 0.90, 0.55], strokeWidth: [1.8, 2.4, 1.8] }}
              transition={{ duration: 2.2, repeat: Infinity, delay, ease: 'easeInOut' }}
            />
            <line
              x1={bx1.toFixed(1)} y1={by1.toFixed(1)} x2={bx2.toFixed(1)} y2={by2.toFixed(1)}
              stroke={secondary} strokeWidth="1" strokeLinecap="round" opacity="0.55"
            />
          </g>
        ))}
      </motion.g>

      {/* Frost dashed orbit ring */}
      <motion.circle
        cx={cx} cy={cy} r={S * 0.30}
        fill="none"
        stroke={glow}
        strokeWidth="1.2"
        strokeDasharray="3 6"
        animate={{ rotate: [0, -360], opacity: [0.28, 0.55, 0.28] }}
        transition={{
          rotate:  { duration: 28, repeat: Infinity, ease: 'linear' },
          opacity: { duration: 3.5, repeat: Infinity },
        }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Icy vapor — translucent wisps drifting up from the body base */}
      {[0, 1, 2].map((i) => (
        <motion.ellipse
          key={`iv-${i}`}
          cx={cx + (i - 1) * S * 0.09}
          cy={cy + S * 0.17}
          rx={S * 0.022}
          ry={S * 0.013}
          fill="rgba(225,245,254,0.62)"
          style={{ filter: 'blur(3px)' }}
          animate={{
            cy:      [cy + S * 0.17, cy - S * 0.18],
            rx:      [S * 0.022, S * 0.050],
            ry:      [S * 0.013, S * 0.022],
            opacity: [0, 0.62, 0.30, 0],
          }}
          transition={{ duration: 2.6 + i * 0.35, repeat: Infinity, delay: i * 0.85, ease: 'easeOut' }}
        />
      ))}
    </svg>
  );
}

// ─── HEALING aura ─────────────────────────────────────────────────
// Soft pulsing cross-glow + rising gentle orbs.

function HealingAura({
  primary, secondary, glow, size,
}: { primary: string; secondary: string; glow: string; size: number; speaking: boolean }) {
  const uid    = useId();
  const S      = size;
  const cx     = S / 2;
  const cy     = S * 0.52;
  const gradId = `hg-${uid}`;

  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={SVG_STYLE}>
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="52%">
          <stop offset="0%"   stopColor="rgba(190,255,180,1)" stopOpacity="0.55" />
          <stop offset="38%"  stopColor="rgba(212,175,55,1)"  stopOpacity="0.30" />
          <stop offset="72%"  stopColor={primary}             stopOpacity="0.20" />
          <stop offset="100%" stopColor={glow}                stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft healing bloom */}
      <motion.circle
        cx={cx} cy={cy} r={S * 0.26}
        fill={`url(#${gradId})`}
        animate={{ opacity: [0.45, 0.75, 0.45], scale: [1, 1.09, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Pulsing cross */}
      <motion.g
        animate={{ opacity: [0.35, 0.72, 0.35], scale: [0.88, 1.12, 0.88] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <line x1={cx} y1={cy - S * 0.21} x2={cx} y2={cy + S * 0.21}
          stroke={secondary} strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />
        <line x1={cx - S * 0.21} y1={cy} x2={cx + S * 0.21} y2={cy}
          stroke={secondary} strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />
      </motion.g>

      {/* Rising orbs */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={cx + (i - 1) * S * 0.10}
          cy={cy + S * 0.15}
          r={S * 0.023}
          fill={i === 1 ? secondary : glow}
          animate={{
            cy:      [cy + S * 0.15, cy - S * 0.27],
            opacity: [0, 0.90, 0],
            r:       [S * 0.023, S * 0.013],
          }}
          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.70, ease: 'easeOut' }}
        />
      ))}

      {/* Restorative pulse waves — golden-green life-energy expanding rings */}
      {[0, 1].map((i) => (
        <motion.circle
          key={`rp-${i}`}
          cx={cx} cy={cy}
          fill="none"
          stroke="rgba(212,175,55,0.60)"
          strokeWidth="1.5"
          animate={{ r: [S * 0.18, S * 0.34], opacity: [0, 0.70, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: i * 1.35, ease: 'easeOut' }}
        />
      ))}
    </svg>
  );
}

// ─── LIGHT aura ───────────────────────────────────────────────────
// Rotating starburst rays + radiant soft bloom.

function LightAura({
  primary, secondary, glow, size, speaking,
}: { primary: string; secondary: string; glow: string; size: number; speaking: boolean }) {
  const uid    = useId();
  const S      = size;
  const cx     = S / 2;
  const cy     = S * 0.52;
  const rays   = speaking ? 12 : 8;
  const gradId = `lg-${uid}`;
  const filtId = `laf-${uid}`;

  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={SVG_STYLE}>
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="54%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.82)" />
          <stop offset="40%"  stopColor={secondary} stopOpacity="0.55" />
          <stop offset="100%" stopColor={glow}       stopOpacity="0" />
        </radialGradient>
        <filter id={filtId} x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>

      {/* Sacred halo — divine luminous ring floating above the spirit's head */}
      <motion.ellipse
        cx={cx} cy={cy - S * 0.30}
        rx={S * 0.18} ry={S * 0.048}
        fill="rgba(255,255,200,0.22)"
        stroke="rgba(255,255,255,0.82)"
        strokeWidth="1.8"
        animate={{ opacity: [0.40, 0.90, 0.40], scaleX: [1, 1.06, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'blur(1px)', transformOrigin: `${cx}px ${(cy - S * 0.30).toFixed(1)}px` }}
      />

      {/* Radiant soft bloom */}
      <motion.circle
        cx={cx} cy={cy} r={S * 0.27}
        fill={`url(#${gradId})`}
        filter={`url(#${filtId})`}
        animate={{ opacity: [0.50, 0.80, 0.50], scale: [1, 1.06, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Rotating starburst rays */}
      <motion.g
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        {Array.from({ length: rays }, (_, i) => {
          const angle  = (i / rays) * Math.PI * 2;
          const inner  = S * 0.21;
          const outer  = S * (0.27 + (i % 2 === 0 ? 0.08 : 0.05));
          return (
            <motion.line
              key={i}
              x1={(cx + Math.cos(angle) * inner).toFixed(1)}
              y1={(cy + Math.sin(angle) * inner).toFixed(1)}
              x2={(cx + Math.cos(angle) * outer).toFixed(1)}
              y2={(cy + Math.sin(angle) * outer).toFixed(1)}
              stroke={i % 2 === 0 ? 'rgba(255,255,255,0.82)' : secondary}
              strokeWidth={i % 2 === 0 ? 1.8 : 1.2}
              strokeLinecap="round"
              animate={{ opacity: [0.45, 0.90, 0.45] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.09, ease: 'easeInOut' }}
            />
          );
        })}
      </motion.g>
    </svg>
  );
}

// ─── DARK aura ────────────────────────────────────────────────────
// Shadow haze + slowly orbiting mist smear.

function DarkAura({
  primary, secondary, glow, size,
}: { primary: string; secondary: string; glow: string; size: number; speaking: boolean }) {
  const uid    = useId();
  const S      = size;
  const cx     = S / 2;
  const cy     = S * 0.52;
  const filtId = `daf-${uid}`;
  const gradId = `dag-${uid}`;

  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={SVG_STYLE}>
      <defs>
        <filter id={filtId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <radialGradient id={gradId} cx="50%" cy="50%" r="55%">
          <stop offset="0%"   stopColor={secondary} stopOpacity="0.28" />
          <stop offset="50%"  stopColor={primary}   stopOpacity="0.45" />
          <stop offset="100%" stopColor="#000008"    stopOpacity="0.70" />
        </radialGradient>
      </defs>

      {/* Dark shadow haze */}
      <motion.circle
        cx={cx} cy={cy} r={S * 0.28}
        fill={`url(#${gradId})`}
        filter={`url(#${filtId})`}
        animate={{ opacity: [0.45, 0.68, 0.45], scale: [1, 1.05, 0.97, 1] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Slowly orbiting mist smear */}
      <motion.ellipse
        cx={cx} cy={cy}
        rx={S * 0.32} ry={S * 0.09}
        fill="none"
        stroke={glow}
        strokeWidth="5"
        strokeOpacity="0.22"
        filter={`url(#${filtId})`}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Flickering shadow fragments */}
      {[0, 1].map((i) => (
        <motion.circle
          key={i}
          cx={cx + (i === 0 ? -S * 0.18 : S * 0.15)}
          cy={cy + (i === 0 ? -S * 0.14 : S * 0.18)}
          r={S * 0.06}
          fill={glow}
          filter={`url(#${filtId})`}
          animate={{ opacity: [0, 0.45, 0.15, 0.50, 0], scale: [0.8, 1.3, 0.9, 1.1, 0.8] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: i * 1.4, ease: 'easeInOut' }}
          style={{ transformOrigin: `${cx + (i === 0 ? -S * 0.18 : S * 0.15)}px ${cy + (i === 0 ? -S * 0.14 : S * 0.18)}px` }}
        />
      ))}

      {/* Silhouette corruption — erratic dark edge flicker at the spirit boundary */}
      <motion.ellipse
        cx={cx} cy={cy}
        rx={S * 0.22} ry={S * 0.29}
        fill="none"
        stroke="rgba(5,0,15,0.80)"
        strokeWidth="4"
        strokeDasharray="3 6 8 2 4 1 7 3"
        animate={{
          opacity:          [0.55, 0.12, 0.78, 0.28, 0.62, 0.55],
          strokeDashoffset: [0, -68],
        }}
        transition={{ duration: 0.70, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  );
}

// ─── WIND aura ────────────────────────────────────────────────────
// Semi-transparent flowing air ribbons + feTurbulence atmospheric distortion
// + expanding oval pressure rings. Very translucent — wind is invisible.

function WindAura({
  primary, secondary, glow, size, speaking,
}: { primary: string; secondary: string; glow: string; size: number; speaking: boolean }) {
  const uid    = useId();
  const S      = size;
  const cx     = S / 2;
  const cy     = S * 0.52;
  const filtId = `wif-${uid}`;
  const gradId = `wig-${uid}`;

  const ribbons = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2 + i * 0.28;
    const r1    = S * 0.15 + (i % 2) * S * 0.04;
    const r2    = S * 0.28 + (i % 3) * S * 0.04;
    const sx    = cx + Math.cos(angle) * r1;
    const sy    = cy + Math.sin(angle) * r1;
    const ex    = cx + Math.cos(angle + 0.8) * r2;
    const ey    = cy + Math.sin(angle + 0.8) * r2;
    const mx    = cx + Math.cos(angle + 0.4) * (r1 + r2) / 2 + Math.sin(angle) * S * 0.06;
    const my    = cy + Math.sin(angle + 0.4) * (r1 + r2) / 2 - Math.cos(angle) * S * 0.06;
    return { sx, sy, ex, ey, mx, my, delay: i * 0.28, dur: 2.2 + (i % 3) * 0.5 };
  }), [S, cx, cy]);

  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={SVG_STYLE}>
      <defs>
        <filter id={filtId} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.020" numOctaves="2" seed="7" result="noise">
            <animate attributeName="baseFrequency" values="0.020;0.030;0.020" dur="3.5s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <radialGradient id={gradId} cx="50%" cy="50%" r="52%">
          <stop offset="0%"   stopColor={secondary} stopOpacity="0.20" />
          <stop offset="55%"  stopColor={primary}   stopOpacity="0.10" />
          <stop offset="100%" stopColor={glow}       stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Atmospheric body shimmer — turbulence distorted */}
      <motion.ellipse
        cx={cx} cy={cy} rx={S * 0.24} ry={S * 0.31}
        fill={`url(#${gradId})`}
        filter={`url(#${filtId})`}
        animate={{ opacity: [0.30, 0.55, 0.30], scaleX: [1, 1.05, 0.97, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Flowing wind ribbons — animated stroke-dashoffset sweep */}
      {ribbons.slice(0, speaking ? 6 : 4).map(({ sx, sy, ex, ey, mx, my, delay, dur }, i) => (
        <motion.path
          key={i}
          d={`M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`}
          stroke={i % 2 === 0 ? secondary : 'rgba(255,255,255,0.65)'}
          strokeWidth={i % 3 === 0 ? 1.4 : 0.9}
          fill="none"
          strokeLinecap="round"
          strokeDasharray="8 4"
          animate={{ strokeDashoffset: [0, -80], opacity: [0.10, 0.45, 0.20, 0.40, 0.10] }}
          transition={{ duration: dur, repeat: Infinity, delay, ease: 'linear' }}
        />
      ))}

      {/* Pressure oval rings — expanding waves of atmospheric push */}
      {[0, 1, 2].map((i) => (
        <motion.ellipse
          key={i}
          cx={cx} cy={cy}
          fill="none"
          stroke={i === 0 ? secondary : glow}
          strokeWidth="1"
          animate={{
            rx:      [S * 0.20, S * 0.35],
            ry:      [S * 0.26, S * 0.43],
            opacity: [0, 0.40, 0],
          }}
          transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.90, ease: 'easeOut' }}
        />
      ))}
    </svg>
  );
}

// ─── SOIL / EARTH aura ────────────────────────────────────────────
// Concentric dashed crack rings + heavy amber glow + orbiting pebbles.
// Everything is slow and weighty — this element doesn't rush.

function SoilAura({
  primary, secondary, glow, size, speaking,
}: { primary: string; secondary: string; glow: string; size: number; speaking: boolean }) {
  const uid    = useId();
  const S      = size;
  const cx     = S / 2;
  const cy     = S * 0.55;   // slightly lower — grounded
  const gradId = `sog-${uid}`;

  const pebbles = useMemo(() => Array.from({ length: 4 }, (_, i) => {
    const angle = (i / 4) * Math.PI * 2;
    const r     = S * (0.24 + (i % 2) * 0.05);
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      r: S * (0.022 + (i % 3) * 0.006),
      delay: i * 0.5,
    };
  }), [S, cx, cy]);

  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={SVG_STYLE}>
      <defs>
        <radialGradient id={gradId} cx="50%" cy="60%" r="55%">
          <stop offset="0%"   stopColor={secondary} stopOpacity="0.50" />
          <stop offset="55%"  stopColor={primary}   stopOpacity="0.30" />
          <stop offset="100%" stopColor={glow}       stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Heavy earth glow — wider than tall, grounded */}
      <motion.ellipse
        cx={cx} cy={cy} rx={S * 0.27} ry={S * 0.20}
        fill={`url(#${gradId})`}
        animate={{ opacity: [0.45, 0.70, 0.45], scaleX: [1, 1.03, 0.98, 1] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Concentric cracked rings — rotating dashed ellipses */}
      {[0, 1, 2].map((i) => (
        <motion.ellipse
          key={i}
          cx={cx} cy={cy}
          rx={S * (0.22 + i * 0.055)} ry={S * (0.17 + i * 0.045)}
          fill="none"
          stroke={i === 0 ? secondary : i === 1 ? primary : glow}
          strokeWidth={2.5 - i * 0.5}
          strokeDasharray={`${6 + i * 2} ${5 + i * 3}`}
          animate={{
            rotate:  [0, i % 2 === 0 ? 45 : -45],
            opacity: [0.38, 0.65, 0.38],
          }}
          transition={{
            rotate:  { duration: 18 + i * 8, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 4.5,         repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}

      {/* Orbiting pebbles — slow planetary drift */}
      <motion.g
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        {pebbles.slice(0, speaking ? 4 : 3).map(({ x, y, r, delay }, i) => (
          <motion.circle
            key={i}
            cx={x} cy={y} r={r}
            fill={i % 2 === 0 ? secondary : primary}
            animate={{ opacity: [0.45, 0.80, 0.45], r: [r, r * 1.25, r] }}
            transition={{ duration: 3.5, repeat: Infinity, delay, ease: 'easeInOut' }}
          />
        ))}
      </motion.g>

      {/* Seismic shockwave ring */}
      <motion.ellipse
        cx={cx} cy={cy}
        fill="none"
        stroke={glow}
        strokeWidth="2"
        animate={{
          rx:      [S * 0.22, S * 0.38],
          ry:      [S * 0.17, S * 0.30],
          opacity: [0, 0.50, 0],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut' }}
      />
    </svg>
  );
}

// ─── TREES / NATURE aura ──────────────────────────────────────────
// Growing vine arms from the body + floating leaf shapes + green bloom.

function TreesAura({
  primary, secondary, glow, size, speaking,
}: { primary: string; secondary: string; glow: string; size: number; speaking: boolean }) {
  const uid    = useId();
  const S      = size;
  const cx     = S / 2;
  const cy     = S * 0.52;
  const gradId = `trg-${uid}`;

  const vines = useMemo(() => Array.from({ length: 5 }, (_, i) => {
    const baseAngle = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const bx        = cx + Math.cos(baseAngle) * S * 0.18;
    const by        = cy + Math.sin(baseAngle) * S * 0.22;
    const ex        = cx + Math.cos(baseAngle + 0.4) * S * 0.33;
    const ey        = cy + Math.sin(baseAngle + 0.4) * S * 0.29;
    const mx        = cx + Math.cos(baseAngle + 0.2) * S * (0.20 + (i % 2) * 0.05);
    const my        = cy + Math.sin(baseAngle + 0.2) * S * (0.25 + (i % 2) * 0.05) - S * 0.03;
    return { bx, by, ex, ey, mx, my, delay: i * 0.22, dur: 2.0 + (i % 3) * 0.5 };
  }), [S, cx, cy]);

  const leaves = useMemo(() => Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const r     = S * (0.20 + (i % 3) * 0.06);
    return {
      x:    cx + Math.cos(angle) * r,
      y:    cy + Math.sin(angle) * r,
      rot:  (i * 47) % 360,
      size: S * (0.020 + (i % 3) * 0.008),
      del:  i * 0.18,
    };
  }), [S, cx, cy]);

  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={SVG_STYLE}>
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="52%">
          <stop offset="0%"   stopColor="rgba(150,255,150,1)" stopOpacity="0.45" />
          <stop offset="55%"  stopColor={primary}             stopOpacity="0.25" />
          <stop offset="100%" stopColor={glow}                stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Green bloom */}
      <motion.circle
        cx={cx} cy={cy} r={S * 0.26}
        fill={`url(#${gradId})`}
        animate={{ opacity: [0.40, 0.68, 0.40], scale: [1, 1.06, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Growing vine arms */}
      {vines.slice(0, speaking ? 5 : 3).map(({ bx, by, ex, ey, mx, my, delay, dur }, i) => (
        <motion.path
          key={i}
          d={`M ${bx.toFixed(1)} ${by.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`}
          stroke={i % 2 === 0 ? secondary : primary}
          strokeWidth={i % 2 === 0 ? 1.8 : 1.2}
          fill="none"
          strokeLinecap="round"
          animate={{ pathLength: [0, 1, 0.7, 1], opacity: [0, 0.85, 0.55, 0.85] }}
          transition={{ duration: dur, repeat: Infinity, delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Floating leaf shapes — slow orbital rotation */}
      <motion.g
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        {leaves.slice(0, speaking ? 8 : 5).map(({ x, y, rot, size: ls, del }, i) => (
          <motion.rect
            key={i}
            x={x - ls} y={y - ls * 1.6}
            width={ls * 2} height={ls * 3.2}
            rx={ls * 0.8}
            fill={i % 3 === 0 ? secondary : i % 3 === 1 ? primary : 'rgba(144,238,144,0.85)'}
            transform={`rotate(${rot} ${x.toFixed(1)} ${y.toFixed(1)})`}
            animate={{ opacity: [0.25, 0.75, 0.35, 0.65, 0.25] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: del, ease: 'easeInOut' }}
          />
        ))}
      </motion.g>

      {/* Life pulse rings */}
      {[0, 1].map((i) => (
        <motion.circle
          key={i}
          cx={cx} cy={cy}
          fill="none"
          stroke={i === 0 ? secondary : glow}
          strokeWidth="1.4"
          animate={{ r: [S * 0.22, S * 0.34], opacity: [0, 0.55, 0] }}
          transition={{ duration: 3.0, repeat: Infinity, delay: i * 1.4, ease: 'easeOut' }}
        />
      ))}
    </svg>
  );
}

// ─── TIME aura ────────────────────────────────────────────────────
// Temporal echo ghost ellipses + rotating clock hands + chronological
// ripple rings with dashed stroke. Silver-gray palette.

function TimeAura({
  primary, secondary, glow, size, speaking,
}: { primary: string; secondary: string; glow: string; size: number; speaking: boolean }) {
  const uid    = useId();
  const S      = size;
  const cx     = S / 2;
  const cy     = S * 0.52;
  const gradId = `timg-${uid}`;

  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={SVG_STYLE}>
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="52%">
          <stop offset="0%"   stopColor={secondary} stopOpacity="0.35" />
          <stop offset="55%"  stopColor={primary}   stopOpacity="0.20" />
          <stop offset="100%" stopColor={glow}       stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Temporal echo ghost rings — multiple ellipses at different scales, out of phase */}
      {[0.82, 0.94, 1.07, 1.18].map((scale, i) => (
        <motion.ellipse
          key={i}
          cx={cx} cy={cy}
          rx={S * 0.22 * scale} ry={S * 0.29 * scale}
          fill="none"
          stroke={i % 2 === 0 ? secondary : primary}
          strokeWidth={1.2 - i * 0.15}
          animate={{
            opacity: [0.10 + i * 0.05, 0.50 - i * 0.05, 0.10 + i * 0.05],
            scaleX:  [1, 1.03, 0.98, 1],
          }}
          transition={{
            opacity: { duration: 3.0 + i * 0.8, repeat: Infinity, delay: i * 0.5,   ease: 'easeInOut' },
            scaleX:  { duration: 4.0 + i * 0.5, repeat: Infinity,                    ease: 'easeInOut' },
          }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}

      {/* Body ambient glow */}
      <motion.circle
        cx={cx} cy={cy} r={S * 0.24}
        fill={`url(#${gradId})`}
        animate={{ opacity: [0.35, 0.58, 0.35] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Minute hand — rotates clockwise */}
      <motion.g
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <line
          x1={cx} y1={cy} x2={cx} y2={cy - S * 0.21}
          stroke={secondary} strokeWidth="1.6" strokeLinecap="round" opacity={0.65}
        />
        <circle cx={cx} cy={cy - S * 0.21} r={S * 0.014} fill={secondary} opacity={0.80} />
      </motion.g>

      {/* Hour hand — rotates counter-clockwise (time reversal) */}
      <motion.g
        animate={{ rotate: [0, -360] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <line
          x1={cx} y1={cy} x2={cx} y2={cy - S * 0.14}
          stroke={primary} strokeWidth="2.2" strokeLinecap="round" opacity={0.70}
        />
      </motion.g>

      {/* Temporal ripple rings with dashed stroke */}
      {(speaking ? [0, 1, 2] : [0, 1]).map((i) => (
        <motion.circle
          key={i}
          cx={cx} cy={cy}
          fill="none"
          stroke={i % 2 === 0 ? glow : secondary}
          strokeWidth="1.2"
          strokeDasharray={`${8 + i * 3} ${5 + i * 2}`}
          animate={{
            r:       [S * 0.20, S * 0.33, S * 0.20],
            opacity: [0, 0.60, 0],
            rotate:  [0, i % 2 === 0 ? 180 : -180],
          }}
          transition={{ duration: 3.5 + i * 0.7, repeat: Infinity, delay: i * 1.1, ease: 'easeInOut' }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
    </svg>
  );
}

// ─── ROBOT aura ───────────────────────────────────────────────────
// Precise HUD targeting rings + sweeping scanline + angular circuit
// trace paths + digital pulse. Cyan/teal digital identity.

function RobotAura({
  primary, secondary, glow, size, speaking,
}: { primary: string; secondary: string; glow: string; size: number; speaking: boolean }) {
  const uid    = useId();
  const S      = size;
  const cx     = S / 2;
  const cy     = S * 0.50;
  const filtId = `robf-${uid}`;
  const gradId = `robg-${uid}`;

  // Angular circuit trace paths radiating from body
  const circuits = useMemo(() => Array.from({ length: 4 }, (_, i) => {
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const r1    = S * 0.22;
    const r2    = S * 0.30;
    const sx    = cx + Math.cos(angle) * r1;
    const sy    = cy + Math.sin(angle) * r1;
    const perp  = angle + Math.PI / 2;
    const kx    = cx + Math.cos(angle) * r2 + Math.cos(perp) * S * 0.04;
    const ky    = cy + Math.sin(angle) * r2 + Math.sin(perp) * S * 0.04;
    return { sx, sy, kx, ky, delay: i * 0.22 };
  }), [S, cx, cy]);

  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={SVG_STYLE}>
      <defs>
        <filter id={filtId} x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        <radialGradient id={gradId} cx="50%" cy="50%" r="52%">
          <stop offset="0%"   stopColor={secondary} stopOpacity="0.40" />
          <stop offset="55%"  stopColor={primary}   stopOpacity="0.22" />
          <stop offset="100%" stopColor={glow}       stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Digital body glow — filtered soft bloom */}
      <motion.circle
        cx={cx} cy={cy} r={S * 0.26}
        fill={`url(#${gradId})`}
        filter={`url(#${filtId})`}
        animate={{ opacity: [0.40, 0.65, 0.40] }}
        transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* HUD targeting ring — outer, slow CW rotation */}
      <motion.circle
        cx={cx} cy={cy} r={S * 0.28}
        fill="none"
        stroke={secondary}
        strokeWidth="1.8"
        strokeDasharray={`${S * 0.22} ${S * 0.08}`}
        animate={{ rotate: [0, 360], opacity: [0.45, 0.80, 0.45] }}
        transition={{
          rotate:  { duration: 8,   repeat: Infinity, ease: 'linear' },
          opacity: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* HUD targeting ring — inner, slow CCW rotation */}
      <motion.circle
        cx={cx} cy={cy} r={S * 0.32}
        fill="none"
        stroke={glow}
        strokeWidth="1.0"
        strokeDasharray={`${S * 0.08} ${S * 0.15}`}
        animate={{ rotate: [0, -360], opacity: [0.25, 0.50, 0.25] }}
        transition={{
          rotate:  { duration: 14,  repeat: Infinity, ease: 'linear' },
          opacity: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* Angular circuit trace paths */}
      {circuits.map(({ sx, sy, kx, ky, delay }, i) => (
        <motion.path
          key={i}
          d={`M ${sx.toFixed(1)} ${sy.toFixed(1)} L ${kx.toFixed(1)} ${ky.toFixed(1)}`}
          stroke={i % 2 === 0 ? secondary : glow}
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="square"
          animate={{ opacity: [0, 0.90, 0.45, 0.80, 0], pathLength: [0, 1, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, delay, ease: 'easeInOut', repeatDelay: 0.8 }}
        />
      ))}

      {/* Scanline — horizontal line sweeping up/down across the body */}
      <motion.line
        x1={cx - S * 0.24} y1={cy}
        x2={cx + S * 0.24} y2={cy}
        stroke={secondary}
        strokeWidth="1.2"
        animate={{
          y1:      [cy - S * 0.28, cy + S * 0.28, cy - S * 0.28],
          y2:      [cy - S * 0.28, cy + S * 0.28, cy - S * 0.28],
          opacity: [0, 0.65, 0.65, 0],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
      />

      {/* Digital pulse on speak */}
      {speaking && (
        <motion.circle
          cx={cx} cy={cy}
          fill="none"
          stroke={primary}
          strokeWidth="2"
          animate={{ r: [S * 0.18, S * 0.35], opacity: [0.80, 0] }}
          transition={{ duration: 0.60, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
    </svg>
  );
}

// ─── Main export ──────────────────────────────────────────────────

export function SpiritAura({
  element, primaryColor, secondaryColor, glowColor, size, isSpeaking,
}: SpiritAuraProps) {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  const props = {
    primary: primaryColor, secondary: secondaryColor, glow: glowColor,
    size, speaking: isSpeaking,
  };

  switch (element) {
    case 'fire':      return <FireAura      {...props} />;
    case 'water':     return <WaterAura     {...props} />;
    case 'lightning': return <LightningAura {...props} />;
    case 'void':      return <VoidAura      {...props} />;
    case 'space':     return <SpaceAura     {...props} />;
    case 'ice':       return <IceAura       {...props} />;
    case 'healing':   return <HealingAura   {...props} />;
    case 'light':     return <LightAura     {...props} />;
    case 'dark':      return <DarkAura      {...props} />;
    case 'wind':      return <WindAura      {...props} />;
    case 'soil':      return <SoilAura      {...props} />;
    case 'trees':     return <TreesAura     {...props} />;
    case 'time':      return <TimeAura      {...props} />;
    case 'robot':     return <RobotAura     {...props} />;
    default:          return null;
  }
}

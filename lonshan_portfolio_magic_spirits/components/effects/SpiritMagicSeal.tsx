'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import { ElementType } from '../../types/spirit.types';
import { SPELL_DURATION_MS, SPELL_START_DELAY_MS } from './spellTiming';

interface SpiritMagicSealProps {
  element: ElementType;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  castId: number;
  visible: boolean;
  variant?: 'full' | 'mini';
}

interface SealProfile {
  outerDash: string;
  innerDash: string;
  outerSeconds: number;
  innerSeconds: number;
  glyphSeconds: number;
  outerDirection: 1 | -1;
  innerDirection: 1 | -1;
  releaseScale: number;
  ringMode: 'smooth' | 'ripple' | 'angular' | 'broken' | 'cosmic' | 'clock' | 'tech';
  runeFamily: 'flame' | 'wave' | 'shard' | 'gust' | 'stone' | 'bloom' | 'bolt' | 'shadow' | 'halo' | 'mend' | 'void' | 'orbit' | 'time' | 'circuit';
}

const PROFILE_BY_ELEMENT: Record<ElementType, SealProfile> = {
  fire: { outerDash: '9 5', innerDash: '2 6', outerSeconds: 4.2, innerSeconds: 6.5, glyphSeconds: 6, outerDirection: 1, innerDirection: -1, releaseScale: 2.7, ringMode: 'angular', runeFamily: 'flame' },
  water: { outerDash: '2 8', innerDash: '1 6', outerSeconds: 8.4, innerSeconds: 10, glyphSeconds: 10, outerDirection: -1, innerDirection: 1, releaseScale: 2.3, ringMode: 'ripple', runeFamily: 'wave' },
  ice: { outerDash: '1 6', innerDash: '1 4', outerSeconds: 7, innerSeconds: 11, glyphSeconds: 12, outerDirection: 1, innerDirection: -1, releaseScale: 2.2, ringMode: 'smooth', runeFamily: 'shard' },
  wind: { outerDash: '4 7', innerDash: '1 10', outerSeconds: 5.5, innerSeconds: 7.8, glyphSeconds: 8, outerDirection: 1, innerDirection: 1, releaseScale: 2.4, ringMode: 'ripple', runeFamily: 'gust' },
  soil: { outerDash: '12 4', innerDash: '6 6', outerSeconds: 9.2, innerSeconds: 14, glyphSeconds: 11, outerDirection: -1, innerDirection: 1, releaseScale: 2.1, ringMode: 'angular', runeFamily: 'stone' },
  trees: { outerDash: '5 5', innerDash: '2 5', outerSeconds: 8.8, innerSeconds: 12, glyphSeconds: 9, outerDirection: 1, innerDirection: -1, releaseScale: 2.25, ringMode: 'smooth', runeFamily: 'bloom' },
  lightning: { outerDash: '3 9', innerDash: '1 7', outerSeconds: 2.8, innerSeconds: 4.2, glyphSeconds: 3, outerDirection: 1, innerDirection: -1, releaseScale: 2.8, ringMode: 'angular', runeFamily: 'bolt' },
  dark: { outerDash: '7 6', innerDash: '2 8', outerSeconds: 10, innerSeconds: 13, glyphSeconds: 9, outerDirection: -1, innerDirection: -1, releaseScale: 2.3, ringMode: 'smooth', runeFamily: 'shadow' },
  light: { outerDash: '2 4', innerDash: '1 5', outerSeconds: 6, innerSeconds: 8, glyphSeconds: 7, outerDirection: 1, innerDirection: -1, releaseScale: 2.5, ringMode: 'smooth', runeFamily: 'halo' },
  healing: { outerDash: '4 6', innerDash: '2 5', outerSeconds: 7, innerSeconds: 10, glyphSeconds: 9, outerDirection: -1, innerDirection: 1, releaseScale: 2.4, ringMode: 'smooth', runeFamily: 'mend' },
  void: { outerDash: '14 10', innerDash: '8 8', outerSeconds: 11, innerSeconds: 7, glyphSeconds: 5, outerDirection: -1, innerDirection: 1, releaseScale: 3, ringMode: 'broken', runeFamily: 'void' },
  space: { outerDash: '2 10', innerDash: '1 8', outerSeconds: 14, innerSeconds: 9, glyphSeconds: 12, outerDirection: 1, innerDirection: -1, releaseScale: 2.6, ringMode: 'cosmic', runeFamily: 'orbit' },
  time: { outerDash: '6 4', innerDash: '1 3', outerSeconds: 12, innerSeconds: 12, glyphSeconds: 10, outerDirection: 1, innerDirection: -1, releaseScale: 2.2, ringMode: 'clock', runeFamily: 'time' },
  robot: { outerDash: '3 3', innerDash: '1 4', outerSeconds: 4, innerSeconds: 5, glyphSeconds: 4, outerDirection: -1, innerDirection: 1, releaseScale: 2.5, ringMode: 'tech', runeFamily: 'circuit' },
};

function ringGradient(mode: SealProfile['ringMode'], primaryColor: string, secondaryColor: string): string {
  switch (mode) {
    case 'broken':
      return `conic-gradient(from 0deg, ${primaryColor} 0deg 48deg, transparent 48deg 82deg, ${secondaryColor} 82deg 156deg, transparent 156deg 210deg, ${primaryColor} 210deg 292deg, transparent 292deg 360deg)`;
    case 'angular':
      return `conic-gradient(from 0deg, ${primaryColor}, ${secondaryColor}, ${primaryColor})`;
    case 'cosmic':
      return `conic-gradient(from 0deg, ${secondaryColor}00, ${primaryColor}, ${secondaryColor}, ${primaryColor}66, ${secondaryColor}00)`;
    case 'clock':
      return `conic-gradient(from 0deg, ${primaryColor} 0deg 12deg, transparent 12deg 28deg, ${secondaryColor} 28deg 40deg, transparent 40deg 56deg, ${primaryColor} 56deg 68deg, transparent 68deg 360deg)`;
    case 'tech':
      return `repeating-conic-gradient(from 0deg, ${primaryColor} 0deg 8deg, transparent 8deg 16deg, ${secondaryColor} 16deg 24deg, transparent 24deg 32deg)`;
    case 'ripple':
      return `radial-gradient(circle, ${secondaryColor}44 0 40%, transparent 50%), conic-gradient(from 0deg, ${primaryColor}66, ${secondaryColor}, ${primaryColor}66)`;
    default:
      return `conic-gradient(from 0deg, ${primaryColor}, ${secondaryColor}, ${primaryColor})`;
  }
}

function runePath(family: SealProfile['runeFamily'], index: number, mini: boolean): string {
  const s = mini ? 0.75 : 1;
  switch (family) {
    case 'flame': return index % 2 === 0 ? `M ${-7 * s} ${6 * s} Q 0 ${-9 * s} ${7 * s} ${6 * s}` : `M ${-6 * s} ${5 * s} Q 0 ${-5 * s} ${6 * s} ${5 * s} M 0 ${-5 * s} L 0 ${8 * s}`;
    case 'wave': return index % 2 === 0 ? `M ${-8 * s} ${-1 * s} Q ${-4 * s} ${-6 * s} 0 ${-1 * s} Q ${4 * s} ${4 * s} ${8 * s} ${-1 * s}` : `M ${-8 * s} ${3 * s} Q ${-4 * s} ${-2 * s} 0 ${3 * s} Q ${4 * s} ${8 * s} ${8 * s} ${3 * s}`;
    case 'shard': return `M 0 ${-8 * s} L ${7 * s} ${4 * s} L ${-7 * s} ${4 * s} Z M 0 ${-8 * s} L 0 ${7 * s}`;
    case 'gust': return index % 2 === 0 ? `M ${-7 * s} ${-3 * s} Q 0 ${-8 * s} ${7 * s} ${-3 * s} M ${-7 * s} ${3 * s} Q 0 ${8 * s} ${7 * s} ${3 * s}` : `M ${-8 * s} 0 L ${8 * s} 0 M ${-3 * s} ${-5 * s} L ${3 * s} ${5 * s}`;
    case 'stone': return `M ${-7 * s} ${-6 * s} L ${7 * s} ${-6 * s} L ${6 * s} ${6 * s} L ${-6 * s} ${6 * s} Z M ${-7 * s} 0 L ${7 * s} 0`;
    case 'bloom': return `M 0 ${-8 * s} Q ${6 * s} ${-2 * s} 0 ${4 * s} Q ${-6 * s} ${-2 * s} 0 ${-8 * s} M ${-7 * s} ${1 * s} L ${7 * s} ${1 * s}`;
    case 'bolt': return `M ${-6 * s} ${-8 * s} L ${1 * s} ${-1 * s} L ${-2 * s} ${-1 * s} L ${6 * s} ${8 * s} L ${0 * s} ${1 * s} L ${3 * s} ${1 * s} Z`;
    case 'shadow': return index % 2 === 0 ? `M ${-7 * s} 0 A ${7 * s} ${7 * s} 0 1 0 ${7 * s} 0 A ${4 * s} ${4 * s} 0 1 1 ${-7 * s} 0` : `M ${-7 * s} ${-2 * s} Q 0 ${8 * s} ${7 * s} ${-2 * s}`;
    case 'halo': return `M 0 ${-8 * s} L 0 ${8 * s} M ${-8 * s} 0 L ${8 * s} 0 M ${-5 * s} ${-5 * s} L ${5 * s} ${5 * s} M ${5 * s} ${-5 * s} L ${-5 * s} ${5 * s}`;
    case 'mend': return `M ${-8 * s} 0 L ${8 * s} 0 M 0 ${-8 * s} L 0 ${8 * s} M ${-5 * s} ${-5 * s} Q 0 ${-8 * s} ${5 * s} ${-5 * s}`;
    case 'void': return index % 2 === 0 ? `M ${-7 * s} ${-7 * s} L ${7 * s} ${7 * s} M ${7 * s} ${-7 * s} L ${-7 * s} ${7 * s} M ${-8 * s} 0 L ${8 * s} 0` : `M ${-8 * s} ${-4 * s} Q 0 ${9 * s} ${8 * s} ${-4 * s}`;
    case 'orbit': return `M ${-7 * s} 0 A ${7 * s} ${5 * s} 0 1 0 ${7 * s} 0 A ${7 * s} ${5 * s} 0 1 0 ${-7 * s} 0 M ${-2 * s} ${-8 * s} L ${2 * s} ${8 * s}`;
    case 'time': return `M 0 ${-8 * s} L 0 0 L ${5 * s} ${3 * s} M ${-7 * s} ${-7 * s} L ${7 * s} ${-7 * s} L ${7 * s} ${7 * s} L ${-7 * s} ${7 * s} Z`;
    case 'circuit': return `M ${-7 * s} ${-7 * s} L ${0 * s} ${-7 * s} L ${0 * s} 0 L ${7 * s} 0 M ${-7 * s} ${7 * s} L 0 ${7 * s} L 0 0 M ${-7 * s} ${-2 * s} L ${-3 * s} ${-2 * s} M ${3 * s} ${2 * s} L ${7 * s} ${2 * s}`;
    default: return `M ${-7 * s} 0 L ${7 * s} 0`;
  }
}

export function SpiritMagicSeal({
  element,
  primaryColor,
  secondaryColor,
  glowColor,
  castId,
  visible,
  variant = 'full',
}: SpiritMagicSealProps) {
  const profile = PROFILE_BY_ELEMENT[element];
  const isMini = variant === 'mini';
  const releaseDelaySec = isMini ? 0.08 : SPELL_START_DELAY_MS / 1000;
  const lifetimeSec = isMini ? 1.0 : (SPELL_DURATION_MS + 280) / 1000;
  const baseSize = isMini ? 140 : 220;
  const ringInset = isMini ? '14px' : '18px';
  const auraInset = isMini ? '26px' : '36px';
  const outerStrokeW = isMini ? 1.5 : 2;
  const innerStrokeW = isMini ? 1.4 : 1.8;
  const centerCoreSize = isMini ? 18 : 26;
  const pulseCoreSize = isMini ? 30 : 42;
  const releaseScale = isMini ? Math.max(1.55, profile.releaseScale * 0.58) : profile.releaseScale;

  const outerRunes = useMemo(() => Array.from({ length: 18 }, (_, i) => i), []);
  const innerRunes = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: '50%', top: '58%', width: baseSize, height: baseSize, transform: 'translate(-50%, -50%)', zIndex: 7 }}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            key={`${element}-${castId}`}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', filter: `drop-shadow(0 0 ${isMini ? 14 : 22}px ${glowColor})` }}
          >
            <motion.div
              style={{
                position: 'absolute',
                inset: auraInset,
                borderRadius: '9999px',
                background: `radial-gradient(circle, ${secondaryColor}77 0%, ${primaryColor}44 38%, transparent 70%)`,
                filter: `blur(${isMini ? 6 : 10}px)`,
              }}
              animate={{ scale: [0.86, 1.08, 0.92], opacity: [0.3, 0.85, 0.45] }}
              transition={{ duration: isMini ? 1.6 : 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
              style={{
                position: 'absolute',
                inset: ringInset,
                borderRadius: '9999px',
                padding: isMini ? 4 : 6,
                background: ringGradient(profile.ringMode, primaryColor, secondaryColor),
                WebkitMask: 'radial-gradient(circle, transparent 57%, black 58%)',
                mask: 'radial-gradient(circle, transparent 57%, black 58%)',
              }}
              animate={{ rotate: profile.outerDirection * 360 }}
              transition={{ duration: isMini ? profile.outerSeconds * 0.72 : profile.outerSeconds, repeat: Infinity, ease: 'linear' }}
            />

            <motion.svg
              viewBox="0 0 220 220"
              style={{ position: 'absolute', inset: 0 }}
              animate={{ rotate: profile.innerDirection * 360 }}
              transition={{ duration: isMini ? profile.innerSeconds * 0.68 : profile.innerSeconds, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="110" cy="110" r={isMini ? 54 : 66} fill="none" stroke={primaryColor} strokeWidth={outerStrokeW} strokeDasharray={profile.outerDash} />
              <circle cx="110" cy="110" r={isMini ? 40 : 49} fill="none" stroke={secondaryColor} strokeWidth={innerStrokeW} strokeDasharray={profile.innerDash} />
              <polygon points="110,74 130,110 110,146 90,110" fill="none" stroke={secondaryColor} strokeWidth={isMini ? 0.9 : 1.1} opacity={0.85} />
              <polygon points="110,82 124,110 110,138 96,110" fill="none" stroke={primaryColor} strokeWidth={isMini ? 0.9 : 1.1} opacity={0.7} />
            </motion.svg>

            <motion.svg
              viewBox="0 0 220 220"
              style={{ position: 'absolute', inset: 0 }}
              animate={{ rotate: profile.outerDirection * -360 }}
              transition={{ duration: isMini ? profile.glyphSeconds * 0.8 : profile.glyphSeconds, repeat: Infinity, ease: 'linear' }}
            >
              {outerRunes.map((i) => {
                const angle = (i / outerRunes.length) * 360;
                return (
                  <g key={`outer-rune-${i}`} transform={`translate(110 110) rotate(${angle}) translate(0 ${isMini ? -68 : -100})`}>
                    <path
                      d={runePath(profile.runeFamily, i, isMini)}
                      fill="none"
                      stroke={i % 2 === 0 ? primaryColor : secondaryColor}
                      strokeWidth={isMini ? 1.6 : 1.9}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.92}
                      style={{ filter: `drop-shadow(0 0 ${isMini ? 4 : 6}px ${glowColor})` }}
                    />
                  </g>
                );
              })}
            </motion.svg>

            <motion.svg
              viewBox="0 0 220 220"
              style={{ position: 'absolute', inset: 0 }}
              animate={{ rotate: profile.innerDirection * 360 }}
              transition={{ duration: isMini ? profile.glyphSeconds * 0.65 : profile.glyphSeconds * 0.9, repeat: Infinity, ease: 'linear' }}
            >
              {innerRunes.map((i) => {
                const angle = (i / innerRunes.length) * 360;
                return (
                  <g key={`inner-rune-${i}`} transform={`translate(110 110) rotate(${angle}) translate(0 ${isMini ? -42 : -58})`}>
                    <path
                      d={runePath(profile.runeFamily, i + 1, isMini)}
                      fill="none"
                      stroke={i % 2 === 0 ? secondaryColor : primaryColor}
                      strokeWidth={isMini ? 1.2 : 1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.84}
                      style={{ filter: `drop-shadow(0 0 ${isMini ? 3 : 5}px ${glowColor})` }}
                    />
                  </g>
                );
              })}
            </motion.svg>

            <motion.div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: centerCoreSize,
                height: centerCoreSize,
                borderRadius: '9999px',
                transform: 'translate(-50%, -50%)',
                background: `radial-gradient(circle, #ffffff 0%, ${secondaryColor} 32%, ${primaryColor} 100%)`,
                boxShadow: `0 0 ${isMini ? 12 : 20}px ${glowColor}`,
              }}
              animate={{ scale: [0.68, 1.08, 0.78], opacity: [0.72, 1, 0.8] }}
              transition={{ duration: isMini ? 1.0 : 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: pulseCoreSize,
                height: pulseCoreSize,
                borderRadius: '9999px',
                border: `1.5px solid ${primaryColor}`,
                transform: 'translate(-50%, -50%)',
                boxShadow: `0 0 ${isMini ? 9 : 14}px ${glowColor}`,
              }}
              animate={{ scale: [0.4, releaseScale], opacity: [0, 0.9, 0] }}
              transition={{ duration: isMini ? 0.55 : 0.95, ease: 'easeOut', delay: releaseDelaySec }}
            />

            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '9999px',
                background: `radial-gradient(circle, ${secondaryColor}66 0%, transparent 62%)`,
                filter: `blur(${isMini ? 2 : 4}px)`,
              }}
              animate={{ opacity: [0, 0.65, 0] }}
              transition={{ duration: isMini ? 0.28 : 0.42, delay: releaseDelaySec + 0.08, ease: 'easeOut' }}
            />

            <motion.div
              style={{ position: 'absolute', inset: 0, borderRadius: '9999px', border: `1px solid ${secondaryColor}` }}
              animate={{ rotate: 360 }}
              transition={{ duration: lifetimeSec, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

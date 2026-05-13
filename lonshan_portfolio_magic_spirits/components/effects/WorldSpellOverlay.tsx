'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { ActiveTheme } from '../../types/spirit.types';
import { THEMES } from '../../systems/themeEngine';

const SPELL_DURATION_MS = 1850;

interface WorldSpellPayload {
  id: string;
  theme: ActiveTheme;
}

interface WorldSpellOverlayProps {
  spell: WorldSpellPayload | null;
  onComplete: (id: string) => void;
}

export function WorldSpellOverlay({ spell, onComplete }: WorldSpellOverlayProps) {
  useEffect(() => {
    if (!spell) return;
    const timer = setTimeout(() => onComplete(spell.id), SPELL_DURATION_MS);
    return () => clearTimeout(timer);
  }, [spell, onComplete]);

  const config = useMemo(() => {
    if (!spell) return null;
    return THEMES[spell.theme];
  }, [spell]);

  return (
    <AnimatePresence>
      {spell && config && (
        <motion.div
          key={spell.id}
          className="fixed inset-0 pointer-events-none overflow-hidden"
          style={{
            zIndex: 9999,
            background: `radial-gradient(circle at 50% 50%, ${config.primaryColor}33 0%, ${config.secondaryColor}1f 38%, transparent 72%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.98, 0.85, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: SPELL_DURATION_MS / 1000, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: '8rem',
              height: '8rem',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, ${config.accentColor} 0%, ${config.primaryColor} 34%, ${config.secondaryColor} 72%, transparent 100%)`,
              boxShadow: `0 0 220px ${config.glowColor}, 0 0 420px ${config.primaryColor}88`,
            }}
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: [0.2, 2.8, 4.4], opacity: [0, 1, 0] }}
            transition={{ duration: SPELL_DURATION_MS / 1000, ease: 'easeOut' }}
          />

          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            const x = Math.cos(angle) * 46;
            const y = Math.sin(angle) * 46;
            return (
              <motion.div
                key={`ray-${spell.id}-${i}`}
                className="absolute left-1/2 top-1/2 rounded-full"
                style={{
                  width: '0.55rem',
                  height: '10rem',
                  transform: `translate(-50%, -50%) rotate(${(angle * 180) / Math.PI}deg)`,
                  transformOrigin: '50% 8%',
                  background: `linear-gradient(180deg, ${config.accentColor}00 0%, ${config.accentColor} 35%, ${config.primaryColor} 72%, ${config.primaryColor}00 100%)`,
                  filter: `drop-shadow(0 0 16px ${config.glowColor})`,
                }}
                initial={{ scaleY: 0.1, opacity: 0 }}
                animate={{
                  x: [x * 0.15, x, x * 1.45],
                  y: [y * 0.15, y, y * 1.45],
                  scaleY: [0.1, 1, 0.25],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: SPELL_DURATION_MS / 1000,
                  ease: 'easeOut',
                  delay: i * 0.015,
                }}
              />
            );
          })}

          {Array.from({ length: 36 }).map((_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const dist = 220 + Math.random() * 440;
            const x = Math.cos(angle) * dist;
            const y = Math.sin(angle) * dist;
            const size = 4 + Math.random() * 10;
            return (
              <motion.span
                key={`spark-${spell.id}-${i}`}
                className="absolute left-1/2 top-1/2 rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  transform: 'translate(-50%, -50%)',
                  background: i % 2 ? config.primaryColor : config.accentColor,
                  boxShadow: `0 0 20px ${config.glowColor}`,
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ x: [0, x], y: [0, y], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.3] }}
                transition={{ duration: SPELL_DURATION_MS / 1000, ease: 'easeOut', delay: i * 0.01 }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { SPELL_DURATION_MS };

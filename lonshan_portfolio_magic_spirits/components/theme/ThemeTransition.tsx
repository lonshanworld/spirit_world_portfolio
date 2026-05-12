'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { THEMES } from '../../systems/themeEngine';
import { SPIRIT_DEFINITIONS } from '../../systems/elementData';
import { ElementType } from '../../types/spirit.types';

export function ThemeTransition() {
  const isTransitioning = useThemeStore((s) => s.isTransitioning);
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const config = THEMES[activeTheme];

  // Get the spirit symbol for pure-element themes
  const spiritDef = SPIRIT_DEFINITIONS[activeTheme as ElementType];
  const symbol = spiritDef?.symbol ?? '✨';

  return (
    <AnimatePresence>
      {isTransitioning && (
        <>
          {/* Full-screen flash overlay */}
          <motion.div
            key="flash"
            className="fixed inset-0 z-[9999] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, times: [0, 0.3, 1] }}
            style={{ background: config?.primaryColor ?? '#ffffff' }}
          />

          {/* Ripple expand from center */}
          <motion.div
            key="ripple"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9998] rounded-full pointer-events-none"
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ width: '200vmax', height: '200vmax', opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              background: `radial-gradient(circle, ${config?.primaryColor}88 0%, transparent 70%)`,
            }}
          />

          {/* Theme label + spirit symbol */}
          <motion.div
            key="label"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] text-center pointer-events-none flex flex-col items-center gap-2"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.3 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="text-5xl"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 0.5 }}
              style={{ filter: `drop-shadow(0 0 24px ${config?.primaryColor})` }}
            >
              {symbol}
            </motion.div>
            <p
              className="text-lg font-bold tracking-[0.3em] uppercase"
              style={{
                color: config?.primaryColor,
                textShadow: `0 0 30px ${config?.glowColor}`,
              }}
            >
              {config?.label ?? 'Transforming...'}
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

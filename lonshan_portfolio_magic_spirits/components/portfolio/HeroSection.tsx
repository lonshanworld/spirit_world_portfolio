'use client';

import { motion } from 'framer-motion';
import { THEMES } from '../../systems/themeEngine';
import { useThemeStore } from '../../store/themeStore';
import { PERSONAL_INFO } from '../../data/portfolio_data';

export function HeroSection() {
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const config = THEMES[activeTheme];

  return (
    <section
      id="hero"
      aria-label="World entrance"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24"
    >
      {/* Ambient world glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          className="rounded-full blur-3xl"
          style={{ width: '70vw', height: '70vh', background: config?.primaryColor }}
          animate={{ scale: [1, 1.10, 1], opacity: [0.07, 0.13, 0.07] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Secondary ambient ring */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          className="rounded-full blur-2xl"
          style={{ width: '40vw', height: '40vh', background: config?.accentColor }}
          animate={{ scale: [1.05, 1, 1.05], opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center gap-5 max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.9, ease: 'easeOut' }}
      >
        {/* Arrival inscription */}
        <motion.p
          className="text-xs font-bold tracking-[0.55em] uppercase"
          style={{ color: config?.accentColor, textShadow: `0 0 16px ${config?.glowColor}` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          You have arrived at
        </motion.p>

        {/* World name */}
        <motion.h1
          className="text-5xl md:text-7xl font-black tracking-tight leading-none"
          style={{
            color: config?.textColor,
            textShadow: `0 0 60px ${config?.glowColor}, 0 2px 0 rgba(0,0,0,0.5)`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 80 }}
        >
          The Spirit World
        </motion.h1>

        {/* Rune divider */}
        <motion.div
          className="flex items-center gap-4 w-full max-w-sm"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          aria-hidden="true"
        >
          <div className="flex-1 h-px" style={{ background: `${config?.primaryColor}44` }} />
          <span className="text-lg" style={{ color: config?.primaryColor, textShadow: `0 0 12px ${config?.glowColor}` }}>✦</span>
          <div className="flex-1 h-px" style={{ background: `${config?.primaryColor}44` }} />
        </motion.div>

        {/* Creator inscription */}
        <motion.div
          className="flex flex-col items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p
            className="text-xs font-bold tracking-[0.4em] uppercase"
            style={{ color: config?.accentColor, opacity: 0.65 }}
          >
            World shaped by
          </p>
          <p
            className="text-3xl md:text-4xl font-black"
            style={{ color: config?.textColor }}
          >
            {PERSONAL_INFO.displayName}
          </p>
          <p
            className="text-base font-light tracking-wide"
            style={{ color: config?.subtextColor }}
          >
            {PERSONAL_INFO.title}
          </p>
        </motion.div>

        {/* World lore */}
        <motion.p
          className="text-sm md:text-base max-w-xl leading-relaxed font-light"
          style={{ color: config?.subtextColor, opacity: 0.75 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ delay: 1.1 }}
        >
          {PERSONAL_INFO.summary}
        </motion.p>

        {/* Wayfinding */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <a
            href="#memory-garden"
            className="px-7 py-2.5 rounded-full font-semibold text-xs tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${config?.primaryColor}, ${config?.accentColor})`,
              color: '#000',
              boxShadow: `0 0 30px ${config?.glowColor}`,
            }}
          >
            View Projects
          </a>
          <a
            href="#void-portal"
            className="px-7 py-2.5 rounded-full font-semibold text-xs tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              border: `1.5px solid ${config?.primaryColor}55`,
              color: config?.primaryColor,
              background: config?.cardBg,
              boxShadow: `0 0 16px ${config?.glowColor}55`,
            }}
          >
            Get in Touch
          </a>
        </motion.div>

        {/* Wander deeper */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <p className="text-xs tracking-[0.35em] uppercase" style={{ color: config?.subtextColor, opacity: 0.45 }}>
            wander deeper
          </p>
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            style={{ color: config?.primaryColor, opacity: 0.45 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { THEMES } from '../../systems/themeEngine';
import { useSound } from '../../hooks/useSound';

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const config = THEMES[activeTheme];
  const { isEnabled, toggleSound } = useSound();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-500"
      style={{
        background: scrolled ? `${config?.cardBg}` : 'transparent',
        borderBottom: scrolled ? `1px solid ${config?.cardBorder}` : 'none',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
      }}
    >
      {/* Logo */}
      <a
        href="#hero"
        className="text-sm font-black tracking-[0.3em] uppercase"
        style={{ color: config?.primaryColor, textShadow: `0 0 12px ${config?.glowColor}` }}
      >
        Lonshan
      </a>

      {/* Nav links — desktop */}
      <div className="hidden md:flex items-center gap-8">
        {['Projects', 'Skills', 'Contact'].map((label) => (
          <a
            key={label}
            href={`#${label.toLowerCase()}`}
            className="text-xs font-semibold tracking-widest uppercase transition-all duration-200 hover:scale-105"
            style={{ color: config?.subtextColor }}
            onMouseEnter={(e) => {
              (e.target as HTMLAnchorElement).style.color = config?.primaryColor ?? '';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLAnchorElement).style.color = config?.subtextColor ?? '';
            }}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Active element indicator + sound toggle */}
      <div className="hidden md:flex items-center gap-3">
        <div
          className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase"
          style={{ color: config?.primaryColor }}
        >
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: config?.primaryColor, boxShadow: `0 0 8px ${config?.glowColor}` }}
          />
          {config?.label}
        </div>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          aria-label={isEnabled ? 'Mute sounds' : 'Unmute sounds'}
          className="flex items-center justify-center w-7 h-7 rounded-full border transition-all duration-200 opacity-70 hover:opacity-100"
          style={{ borderColor: config?.cardBorder, color: config?.primaryColor }}
          title={isEnabled ? 'Sound on' : 'Sound off'}
        >
          {isEnabled ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 opacity-50">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Hamburger — mobile */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-5 h-px transition-all"
            style={{ background: config?.primaryColor }}
          />
        ))}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 flex flex-col items-center gap-6 py-8"
            style={{ background: config?.cardBg, borderBottom: `1px solid ${config?.cardBorder}` }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {['Projects', 'Skills', 'Contact'].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-sm font-semibold tracking-widest uppercase"
                style={{ color: config?.textColor }}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { THEMES } from '../../systems/themeEngine';
import { useSound } from '../../hooks/useSound';
import { useWorldStore } from '../../store/worldStore';

const WORLD_AREAS = [
  { label: 'Personal Info', href: '#hero' },
  { label: 'Work History', href: '#chronicle-hall' },
  { label: 'Projects',  href: '#memory-garden' },
  { label: 'Education', href: '#scholar-archives' },
  { label: 'Skills',    href: '#elemental-archive' },
  { label: 'AI Chat',   href: '#astral-terminal' },
  { label: 'Contact',   href: '#void-portal' },
] as const;

export function WorldMap() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const config = THEMES[activeTheme];
  const { isEnabled, toggleSound } = useSound();
  const activeSection = useWorldStore((s) => s.activeSection);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      aria-label="World map"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 transition-all duration-500 overflow-x-clip"
      style={{
        background: scrolled ? config?.cardBg : 'transparent',
        borderBottom: scrolled ? `1px solid ${config?.cardBorder}` : 'none',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
      }}
    >
      {/* World sigil */}
      <a
        href="#hero"
        className="flex min-w-0 items-center gap-2 text-[10px] sm:text-xs lg:text-sm font-black tracking-[0.12em] sm:tracking-[0.22em] uppercase whitespace-nowrap"
        style={{ color: config?.primaryColor, textShadow: `0 0 12px ${config?.glowColor}` }}
        aria-label="Spirit World — return to entrance"
      >
        <span aria-hidden="true" className="text-base">✦</span>
        Spirit World
      </a>
      <div
        className="xl:hidden min-w-0 flex-1 flex justify-center"
        aria-label={`Active realm: ${config?.label}`}
      >
        <div
          className="max-w-full inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em] sm:tracking-[0.18em]"
          style={{
            color: config?.primaryColor,
            borderColor: `${config?.primaryColor}55`,
            background: config?.cardBg,
            boxShadow: `0 0 14px ${config?.glowColor}55`,
          }}
        >
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full animate-pulse"
            style={{ background: config?.primaryColor, boxShadow: `0 0 8px ${config?.glowColor}` }}
            aria-hidden="true"
          />
          <span className="min-w-0 truncate">{config?.label}</span>
        </div>
      </div>

      {/* World area links — desktop */}
      <div className="hidden xl:flex items-center gap-5 2xl:gap-8" role="list">
        {WORLD_AREAS.map((area) => {
          const isActive = area.href === `#${activeSection}`;
          return (
            <a
              key={area.href}
              href={area.href}
              role="listitem"
              aria-current={isActive ? 'location' : undefined}
              className="text-xs font-semibold tracking-widest uppercase transition-all duration-200 hover:scale-105 relative"
              style={{
                color: isActive ? config?.primaryColor : config?.subtextColor,
                textShadow: isActive ? `0 0 10px ${config?.glowColor}` : 'none',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = config?.primaryColor ?? '';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color = isActive
                  ? (config?.primaryColor ?? '')
                  : (config?.subtextColor ?? '');
              }}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1.5 left-0 right-0 h-px"
                  style={{ background: config?.primaryColor, boxShadow: `0 0 6px ${config?.glowColor}` }}
                />
              )}
              {area.label}
            </a>
          );
        })}
      </div>

      {/* Active element indicator + sound toggle */}
      <div className="hidden xl:flex items-center gap-3">
        <div
          className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase"
          style={{ color: config?.primaryColor }}
          aria-label={`Active element: ${config?.label}`}
        >
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: config?.primaryColor, boxShadow: `0 0 8px ${config?.glowColor}` }}
            aria-hidden="true"
          />
          {config?.label}
        </div>

        <button
          onClick={toggleSound}
          aria-label={isEnabled ? 'Mute ambient sounds' : 'Enable ambient sounds'}
          className="flex items-center justify-center w-7 h-7 rounded-full border transition-all duration-200 opacity-70 hover:opacity-100"
          style={{ borderColor: config?.cardBorder, color: config?.primaryColor }}
        >
          {isEnabled ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 opacity-50" aria-hidden="true">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile hamburger */}
      <button
        className="xl:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle world map"
        aria-expanded={menuOpen}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-5 h-0.5 transition-all duration-300"
            style={{ background: config?.primaryColor }}
            aria-hidden="true"
          />
        ))}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 right-0 flex flex-col gap-0 xl:hidden"
            style={{
              background: config?.cardBg,
              borderBottom: `1px solid ${config?.cardBorder}`,
              backdropFilter: 'blur(20px)',
            }}
          >
            {WORLD_AREAS.map((area) => {
              const isActive = area.href === `#${activeSection}`;
              return (
                <a
                  key={area.href}
                  href={area.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive ? 'location' : undefined}
                  className="text-sm font-semibold tracking-widest uppercase py-4 px-6 border-b"
                  style={{
                    color: config?.primaryColor,
                    borderColor: `${config?.cardBorder}66`,
                    background: isActive ? `${config?.primaryColor}12` : 'transparent',
                    textShadow: isActive ? `0 0 10px ${config?.glowColor}` : 'none',
                  }}
                >
                  {isActive && <span aria-hidden="true">✦ </span>}
                  {area.label}
                </a>
              );
            })}
            <button
              onClick={toggleSound}
              className="text-xs font-medium tracking-widest uppercase py-3 px-6 text-left opacity-60"
              style={{ color: config?.subtextColor }}
            >
              {isEnabled ? '◉ Ambient sound on' : '○ Ambient sound off'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

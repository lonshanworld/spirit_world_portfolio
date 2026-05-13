'use client';

import { useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

// World layer
import { ParticleField } from '../components/world/ParticleField';

// Spirit layer
import { SpiritManager } from '../components/spirits/SpiritManager';
import { CombatManager } from '../components/spirits/CombatManager';

// Dialogue layer — now rendered inline above each spirit in SpiritOrb

// Theme system
import { ThemeProvider } from '../components/theme/ThemeProvider';
import { ThemeTransition } from '../components/theme/ThemeTransition';

// Portfolio sections
import { HeroSection } from '../components/portfolio/HeroSection';
import { AIChatSection } from '../components/portfolio/AIChatSection';
import { ProjectsSection } from '../components/portfolio/ProjectsSection';
import { ExperienceSection } from '../components/portfolio/ExperienceSection';
import { SkillsSection } from '../components/portfolio/SkillsSection';
import { ContactSection } from '../components/portfolio/ContactSection';

// World map nav
import { WorldMap } from '../components/world/WorldMap';

// State & hooks
import { useWorldStore } from '../store/worldStore';
import { useThemeStore } from '../store/themeStore';
import { useSpiritDialogue } from '../hooks/useSpiritDialogue';
import { useScrollSection } from '../hooks/useScrollSection';
import { ElementType, SpiritInstanceId } from '../types/spirit.types';
import { getCombination } from '../systems/combinationEngine';
import { THEMES } from '../systems/themeEngine';

// Cursor ref — shared mutable object written here, read by spirit components via rAF
import { CURSOR } from '../utils/cursorRef';

// ─── Custom cursor component ──────────────────────────────────────

function MagicalCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const config = THEMES[activeTheme];

  useEffect(() => {
    const move = (e: MouseEvent) => {
      // Direct DOM mutation for cursor ring (zero React overhead)
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
      }
      // Update shared cursor ref — read by spirit components via rAF, not Zustand
      CURSOR.x = e.clientX;
      CURSOR.y = e.clientY;
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <>
      {/* Outer ring */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 w-8 h-8 rounded-full border z-[10000] transition-[transform] duration-100 ease-out hidden md:block"
        style={{ borderColor: config?.primaryColor, boxShadow: `0 0 12px ${config?.glowColor}` }}
      />
      {/* Inner dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 w-1.5 h-1.5 rounded-full z-[10001] hidden md:block"
        style={{ background: config?.primaryColor }}
      />
    </>
  );
}

// ─── World orchestrator ───────────────────────────────────────────

function WorldOrchestrator() {
  const initSpirits = useWorldStore((s) => s.initSpirits);
  const pendingCombination = useThemeStore((s) => s.pendingCombination);
  const {
    triggerSpiritInvocation,
    triggerSpiritCompanionTap,
    triggerHover,
    triggerSection,
    triggerCombination,
  } = useSpiritDialogue();

  // Initialise spirits on mount
  useEffect(() => {
    initSpirits();
  }, [initSpirits]);

  // Scroll section detection → trigger section dialogue
  useScrollSection(
    useCallback(
      (section: string) => {
        triggerSection(section);
      },
      [triggerSection],
    ),
  );

  const handleSpiritTap = useCallback(
    (element: ElementType) => {
      // Check if a combination was triggered
      if (pendingCombination && pendingCombination !== element) {
        const hybrid = getCombination(pendingCombination, element);
        if (hybrid) {
          triggerCombination(hybrid, pendingCombination, element);
          return;
        }
      }
    },
    [pendingCombination, triggerCombination],
  );

  const handleSpiritInvocation = useCallback(
    (element: ElementType, instanceId: SpiritInstanceId, mode: 'transform' | 'companion') => {
      if (mode === 'companion') {
        triggerSpiritCompanionTap(element, instanceId);
        return;
      }
      triggerSpiritInvocation(element, instanceId);
    },
    [triggerSpiritCompanionTap, triggerSpiritInvocation],
  );

  return (
    <>
      {/* Fixed world layers — always visible */}
      <ParticleField />
      <ThemeTransition />

      {/* Spirit world layer — ABSOLUTE so spirits roam the entire scrollable document.
          Spirits at worldY > 100% appear in sections below the hero as you scroll. */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ overflowX: 'clip', overflowY: 'visible' }}
      >
        <div className="pointer-events-none w-full h-full relative">
          <SpiritManager
            onSpiritTap={handleSpiritTap}
            onSpiritInvocation={handleSpiritInvocation}
            onSpiritHover={(element, instanceId) => triggerHover(element, instanceId)}
          />
          {/* Combat system — rendered inside spirit layer so z-indices align */}
          <CombatManager />
        </div>
      </div>

      {/* Custom cursor */}
      <MagicalCursor />

      {/* World map navigation */}
      <div className="relative z-10">
        <WorldMap />
        <main>
          <HeroSection />
          <SkillsSection />
          <AIChatSection />
          <ExperienceSection />
          <ProjectsSection />
          <ContactSection />
        </main>
      </div>
    </>
  );
}

// ─── Page root ────────────────────────────────────────────────────

export default function Home() {
  return (
    <ThemeProvider>
      {/* Background: dynamic gradient from CSS vars */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 transition-all duration-700"
        style={{ background: 'var(--theme-bg)' }}
      />

      <motion.div
        className="relative min-h-screen overflow-x-clip"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <WorldOrchestrator />
      </motion.div>
    </ThemeProvider>
  );
}



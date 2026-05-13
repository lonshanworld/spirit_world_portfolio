'use client';

import { useCallback, useEffect, useRef } from 'react';
import { SpiritOrb } from './SpiritOrb';
import { useWorldStore } from '../../store/worldStore';
import { useThemeStore } from '../../store/themeStore';
import { ActiveTheme, ElementType, SpiritInstance, SpiritInstanceId } from '../../types/spirit.types';
import { SPIRIT_DEFINITIONS } from '../../systems/elementData';
import { THEMES } from '../../systems/themeEngine';
import { COMBINATION_WINDOW_MS, getCombination } from '../../systems/combinationEngine';
import { useSound } from '../../hooks/useSound';

const SPELL_THEME_DELAY_MS = 1850;

interface SpiritManagerProps {
  onSpiritTap: (element: ElementType) => void;
  onSpiritClick: (element: ElementType) => void;
  onSpiritHover?: (element: ElementType) => void;
  onWorldSpell?: (theme: ActiveTheme) => void;
}

export function SpiritManager({ onSpiritTap, onSpiritClick, onSpiritHover, onWorldSpell }: SpiritManagerProps) {
  const spirits               = useWorldStore((s) => s.spirits);
  const setSpiritHovered       = useWorldStore((s) => s.setSpiritHovered);
  const setSpiritEmotion       = useWorldStore((s) => s.setSpiritEmotion);
  const activeCombats          = useWorldStore((s) => s.activeCombats);
  const endCombat              = useWorldStore((s) => s.endCombat);
  const setSpiritCombatStatus  = useWorldStore((s) => s.setSpiritCombatStatus);
  const setSpiritEmotionById   = useWorldStore((s) => s.setSpiritEmotionById);
  const tapSpirit              = useThemeStore((s) => s.tapSpirit);
  const pendingCombination     = useThemeStore((s) => s.pendingCombination);
  const activeTheme            = useThemeStore((s) => s.activeTheme);
  const setTheme               = useThemeStore((s) => s.setTheme);
  const { playSpiritClick, playCombination } = useSound();

  // ── Keep a current-spirits ref so periodic effects can read without re-running ──
  const spiritsRef = useRef<Map<SpiritInstanceId, SpiritInstance>>(spirits);
  useEffect(() => { spiritsRef.current = spirits; }, [spirits]);

  // ── Combination magic: both spirits burst with excited magic ────────────────
  // (pendingCombination is the first element tapped — captured via ref to avoid
  //  stale closure in handleTap without adding it as a dependency twice)
  const pendingRef = useRef<ElementType | null>(pendingCombination);
  useEffect(() => { pendingRef.current = pendingCombination; }, [pendingCombination]);
  const lastTapAtRef = useRef(0);
  const hoverMessageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Combat interrupt: hover or click a fighting spirit to calm it ──────────
  const breakCombatForSpirit = useCallback(
    (instanceId: SpiritInstanceId) => {
      const inst = spiritsRef.current.get(instanceId);
      if (!inst || inst.combatStatus === 'idle') return;

      for (const [combatId, combat] of activeCombats) {
        if (combat.attackerId === instanceId || combat.defenderId === instanceId) {
          setSpiritCombatStatus(combat.attackerId, 'idle');
          setSpiritCombatStatus(combat.defenderId, 'idle');
          setSpiritEmotionById(combat.attackerId, 'calm');
          setSpiritEmotionById(combat.defenderId, 'calm');
          endCombat(combatId);
          break;
        }
      }
    },
    [activeCombats, setSpiritCombatStatus, setSpiritEmotionById, endCombat],
  );

  const handleTap = useCallback(
    (element: ElementType) => {
      lastTapAtRef.current = Date.now();
      if (hoverMessageTimerRef.current) {
        clearTimeout(hoverMessageTimerRef.current);
        hoverMessageTimerRef.current = null;
      }

      // If the user taps a spirit in active combat, calm the fight instead
      for (const inst of spiritsRef.current.values()) {
        if (inst.element === element && inst.combatStatus !== 'idle') {
          breakCombatForSpirit(inst.instanceId);
          return;
        }
      }

      const result = tapSpirit(element);
      const firstElement = pendingRef.current;

      const hybrid =
        firstElement && firstElement !== element
          ? getCombination(firstElement, element)
          : null;

      if (hybrid) {
        onWorldSpell?.(hybrid);
        playCombination();
        // Visual magic reaction: both spirits burst with excited spell + proud cooldown
        setSpiritEmotion(firstElement!, 'excited');
        setSpiritEmotion(element, 'excited');
        setTimeout(() => setTheme(hybrid), SPELL_THEME_DELAY_MS);
        setTimeout(() => {
          setSpiritEmotion(firstElement!, 'proud');
          setSpiritEmotion(element, 'proud');
        }, 1800);
        setTimeout(() => {
          setSpiritEmotion(firstElement!, 'neutral');
          setSpiritEmotion(element, 'neutral');
        }, 4000);
      } else {
        onWorldSpell?.(element);
        playSpiritClick(element);
        setTimeout(() => {
          const state = useThemeStore.getState();
          if (
            state.pendingCombination === element &&
            Date.now() - state.pendingTapTime >= COMBINATION_WINDOW_MS - 100
          ) {
            setTheme(element);
          }
        }, Math.max(COMBINATION_WINDOW_MS, SPELL_THEME_DELAY_MS));
        onSpiritClick(element);
      }

      onSpiritTap(element);
      return result;
    },
    [
      tapSpirit,
      setTheme,
      onSpiritTap,
      onSpiritClick,
      onWorldSpell,
      playSpiritClick,
      playCombination,
      setSpiritEmotion,
      breakCombatForSpirit,
    ],
  );

  // ── Spirit-to-spirit proximity magic ───────────────────────────────────────
  // Every 25-45s, a random spirit notices a nearby spirit and reacts magically.
  useEffect(() => {
    let cancelled = false;

    function scheduleNext() {
      const delay = 25000 + Math.random() * 20000;
      setTimeout(() => {
        if (cancelled) return;

        const instances = Array.from(spiritsRef.current.values());
        if (instances.length < 2) { scheduleNext(); return; }

        // Pick a random spirit as the initiator
        const a = instances[Math.floor(Math.random() * instances.length)];

        // Find spirits physically close on the world canvas (worldX/Y are 0-100 percent)
        const nearby = instances.filter(
          (b) =>
            b.instanceId !== a.instanceId &&
            Math.abs(b.worldX - a.worldX) < 18 &&
            Math.abs(b.worldY - a.worldY) < 18,
        );

        if (nearby.length > 0) {
          const b = nearby[Math.floor(Math.random() * nearby.length)];
          // A notices B — playful magic reaction
          const reactEmotion = Math.random() < 0.5 ? 'excited' : 'playful';
          setSpiritEmotion(a.element, reactEmotion);
          // B reacts back slightly later
          setTimeout(() => {
            if (!cancelled) {
              setSpiritEmotion(b.element, 'surprised');
              setTimeout(() => {
                if (!cancelled) {
                  setSpiritEmotion(a.element, 'neutral');
                  setSpiritEmotion(b.element, 'neutral');
                }
              }, 2000);
            }
          }, 800);
        }

        scheduleNext();
      }, delay);
    }

    scheduleNext();
    return () => { cancelled = true; };
  }, [setSpiritEmotion]);

  // ── Theme change: the element spirit reacts with a magic burst ─────────────
  const prevThemeRef = useRef(activeTheme);
  useEffect(() => {
    if (activeTheme === prevThemeRef.current) return;
    prevThemeRef.current = activeTheme;

    // Cast the element type from activeTheme — only pure-element themes map to spirits
    const element = activeTheme as ElementType;
    const instances = Array.from(spiritsRef.current.values());
    const hasElement = instances.some((i) => i.element === element);
    if (!hasElement) return;

    // Brief excited burst → proud → settle
    setSpiritEmotion(element, 'excited');
    setTimeout(() => setSpiritEmotion(element, 'proud'), 1500);
    setTimeout(() => setSpiritEmotion(element, 'neutral'), 3500);
  }, [activeTheme, setSpiritEmotion]);

  const handleHoverStart = useCallback(
    (instanceId: SpiritInstanceId) => {
      setSpiritHovered(instanceId, true);
      // Hovering a fighting spirit calms the combat immediately
      breakCombatForSpirit(instanceId);

      // On touch devices hover can fire immediately before tap. Delay hover message
      // briefly and cancel it if a tap arrives during this guard window.
      if (!onSpiritHover) return;
      if (hoverMessageTimerRef.current) clearTimeout(hoverMessageTimerRef.current);
      hoverMessageTimerRef.current = setTimeout(() => {
        if (Date.now() - lastTapAtRef.current < 220) return;
        const inst = spiritsRef.current.get(instanceId);
        if (inst) onSpiritHover(inst.element);
      }, 120);
    },
    [setSpiritHovered, breakCombatForSpirit, onSpiritHover],
  );

  const handleHoverEnd = useCallback(
    (instanceId: SpiritInstanceId) => {
      if (hoverMessageTimerRef.current) {
        clearTimeout(hoverMessageTimerRef.current);
        hoverMessageTimerRef.current = null;
      }
      setSpiritHovered(instanceId, false);
    },
    [setSpiritHovered],
  );

  useEffect(
    () => () => {
      if (hoverMessageTimerRef.current) clearTimeout(hoverMessageTimerRef.current);
    },
    [],
  );

  const themeConfig = THEMES[activeTheme];

  return (
    <>
      {/* Combination hint */}
      {pendingCombination && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 text-xs tracking-widest uppercase animate-pulse pointer-events-none"
          style={{ color: themeConfig?.primaryColor, textShadow: `0 0 12px ${themeConfig?.glowColor}` }}
        >
          Tap another spirit to combine with {SPIRIT_DEFINITIONS[pendingCombination]?.name}...
        </div>
      )}

      {/* Render ALL spirit instances — each is an autonomous entity */}
      {Array.from(spirits.values()).map((instance, index) => (
        <SpiritOrb
          key={instance.instanceId}
          instance={instance}
          onTap={handleTap}
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          index={index}
        />
      ))}
    </>
  );
}


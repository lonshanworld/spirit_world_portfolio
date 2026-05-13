'use client';

/**
 * useSpiritDialogue.ts — Static-first dialogue system
 *
 * On mount the entire static dataset (700+ lines, 14 elements) is loaded
 * into the message cache instantly — no AI call required.
 *
 * If the NestJS backend is reachable, a one-time AI batch is requested to
 * augment the cache.  All runtime dialogue (idle, hover, click, section)
 * is drawn exclusively from the local cache — zero AI calls during play.
 *
 * Priority ladder (idle scheduler):
 *   60 % → visible spirit in viewport
 *   25 % → recently interacted spirit
 *   15 % → random from all 14 elements
 */

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useWorldStore } from '../store/worldStore';
import { useDialogueStore } from '../store/dialogueStore';
import { DialogueLine } from '../types/dialogue.types';
import { ElementType, EmotionType } from '../types/spirit.types';
import { SpiritEvents, WorldEvents } from '../types/socket.events';
import { SPIRIT_CLICK_DRAMATIC, COMBINATION_LINES } from '../systems/dialogueScripts';
import { useMessageCache } from '../store/messageCache';
import { STATIC_MESSAGE_BATCH } from '../systems/messageBatch';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';

const ALL_ELEMENTS: ElementType[] = [
  'fire', 'water', 'ice', 'wind', 'soil', 'trees',
  'lightning', 'dark', 'light', 'healing', 'void', 'space', 'time', 'robot',
];

/** One-time backend probe — does not maintain a connection. */
async function isBackendReachable(): Promise<boolean> {
  return new Promise((resolve) => {
    const probe = io(`${BACKEND_URL}/world`, {
      transports: ['websocket'],
      reconnectionAttempts: 0,
      timeout: 2500,
    });
    const timer = setTimeout(() => { probe.disconnect(); resolve(false); }, 3000);
    probe.on('connect', () => { clearTimeout(timer); probe.disconnect(); resolve(true); });
    probe.on('connect_error', () => { clearTimeout(timer); probe.disconnect(); resolve(false); });
  });
}

/**
 * Return element IDs of spirits currently visible in the viewport.
 * Reads Zustand state imperatively — safe inside setTimeout.
 */
function getVisibleElements(): ElementType[] {
  if (typeof window === 'undefined') return [];
  const { spirits } = useWorldStore.getState();
  const scrollTop = window.scrollY;
  const viewH     = window.innerHeight;
  const docH      = Math.max(document.body.scrollHeight, 1);
  const vTop      = scrollTop / docH;
  const vBot      = (scrollTop + viewH) / docH;
  const visible: ElementType[] = [];
  for (const inst of spirits.values()) {
    const y = inst.worldY / 100;
    if (y >= vTop - 0.05 && y <= vBot + 0.05) visible.push(inst.element);
  }
  return visible;
}

export function useSpiritDialogue() {
  const setSpiritSpeaking = useWorldStore((s) => s.setSpiritSpeaking);
  const setSpiritEmotion  = useWorldStore((s) => s.setSpiritEmotion);
  const setCurrent        = useDialogueStore((s) => s.setCurrent);

  const idleTimerRef  = useRef<NodeJS.Timeout | null>(null);
  const greetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef     = useRef<Socket | null>(null);
  const cancelledRef  = useRef(false);
  /** Recently interacted elements (newest first, max 5). */
  const recentRef     = useRef<ElementType[]>([]);

  // Stable refs — prevent stale closures inside setTimeout callbacks
  const setSpeakingRef = useRef(setSpiritSpeaking);
  const setEmotionRef  = useRef(setSpiritEmotion);
  const setCurrentRef  = useRef(setCurrent);
  useEffect(() => { setSpeakingRef.current = setSpiritSpeaking; }, [setSpiritSpeaking]);
  useEffect(() => { setEmotionRef.current  = setSpiritEmotion;  }, [setSpiritEmotion]);
  useEffect(() => { setCurrentRef.current  = setCurrent;        }, [setCurrent]);

  // ── Serialised line queue ─────────────────────────────────────
  // Messages shown ONE AT A TIME. Duration = max(1 s, words × 0.8 s) + 0.6 s fade.

  const lineQueueRef = useRef<DialogueLine[]>([]);
  const isShowingRef = useRef(false);

  function processQueue() {
    if (cancelledRef.current || lineQueueRef.current.length === 0) {
      isShowingRef.current = false;
      return;
    }
    const line = lineQueueRef.current.shift()!;
    isShowingRef.current = true;
    const words  = line.text.trim().split(/\s+/).filter(Boolean).length;
    const readMs = Math.max(1000, words * 800);

    setSpeakingRef.current(line.spiritId, true);
    if (line.emotion) setEmotionRef.current(line.spiritId, line.emotion as EmotionType);
    setCurrentRef.current({
      id:         `${line.spiritId}-${Date.now()}`,
      spiritId:   line.spiritId,
      text:       line.text,
      timestamp:  Date.now(),
      targetUser: line.targetUser ?? false,
    });
    setTimeout(() => {
      if (cancelledRef.current) return;
      setSpeakingRef.current(line.spiritId, false);
      setCurrentRef.current(null);
      processQueue();
    }, readMs + 600);
  }

  const enqueueLine = useCallback((line: DialogueLine) => {
    lineQueueRef.current.push(line);
    if (!isShowingRef.current) processQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function isBusy() {
    return isShowingRef.current || lineQueueRef.current.length > 0;
  }

  // ── Cache helper ──────────────────────────────────────────────

  /**
   * Pull the next line for (element, trigger) from the cache and
   * convert it to a DialogueLine. Returns null if nothing available.
   */
  function pickCached(
    element: ElementType,
    trigger: 'idle' | 'hover' | 'click' | 'section' | 'combat',
  ): DialogueLine | null {
    const cached = useMessageCache.getState().selectLine(element, trigger);
    if (!cached) return null;
    return {
      spiritId: element,
      text:     cached.text,
      emotion:  cached.emotion as EmotionType,
      delay:    0,
    };
  }

  // ── Public API ─────────────────────────────────────────────────

  /** Spirit click: draw from cache (SPIRIT_CLICK_DRAMATIC as fallback). */
  const triggerSpiritClick = useCallback(
    (id: ElementType) => {
      const line = pickCached(id, 'click') ?? (() => {
        const d = SPIRIT_CLICK_DRAMATIC[id];
        return d ? ({ spiritId: d.spiritId, text: d.text, emotion: d.emotion as EmotionType, delay: 0 }) : null;
      })();
      if (line) enqueueLine({ ...line, targetUser: true });
      recentRef.current = [id, ...recentRef.current.slice(0, 4)];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enqueueLine],
  );

  /**
   * Hover reaction: shown only when the queue is empty.
   * Draws from the element's 'hover' pool in the cache.
   */
  const triggerHover = useCallback(
    (element: ElementType) => {
      if (isBusy()) return;
      const line = pickCached(element, 'hover');
      if (line) enqueueLine(line);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enqueueLine],
  );

  /**
   * Section visit: pick a section-tagged line from a contextually
   * appropriate spirit for the given section name.
   */
  const triggerSection = useCallback(
    (section: string) => {
      const sectionSpirits: Record<string, ElementType[]> = {
        hero:     ['void', 'space', 'healing'],
        projects: ['robot', 'lightning', 'fire'],
        skills:   ['robot', 'ice', 'lightning'],
        contact:  ['healing', 'light', 'water'],
      };
      const candidates = (sectionSpirits[section] ?? ALL_ELEMENTS) as ElementType[];
      const element    = candidates[Math.floor(Math.random() * candidates.length)];
      const line       = pickCached(element, 'section');
      if (line) enqueueLine(line);
      // Notify backend for context tracking only (no dialogue response expected)
      if (socketRef.current?.connected) {
        socketRef.current.emit(WorldEvents.SECTION_VISIBLE, { section });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enqueueLine],
  );

  /** Combination: uses COMBINATION_LINES (element-specific, not in cache). */
  const triggerCombination = useCallback(
    (hybridId: string, elementA?: ElementType, elementB?: ElementType) => {
      const lines = COMBINATION_LINES[hybridId];
      if (lines) lines.forEach(enqueueLine);
      if (socketRef.current?.connected) {
        socketRef.current.emit('theme:combination', { hybridId, elementA, elementB });
      }
    },
    [enqueueLine],
  );

  // ── Initialization + idle scheduler ──────────────────────────

  useEffect(() => {
    cancelledRef.current = false;

    // STEP 1: Populate cache from static dataset immediately (sync, no await)
    useMessageCache.getState().initialize(STATIC_MESSAGE_BATCH);

    // STEP 2: Welcoming line after 2 s (draws from cache)
    greetTimerRef.current = setTimeout(() => {
      if (cancelledRef.current) return;
      const greetElements: ElementType[] = ['healing', 'light', 'space', 'void'];
      const el   = greetElements[Math.floor(Math.random() * greetElements.length)];
      const line = pickCached(el, 'idle');
      if (line) enqueueLine({ ...line, targetUser: true });
    }, 2000);

    // STEP 3: Backend probe — connect only to fetch AI augmentation batch
    isBackendReachable().then((live) => {
      if (cancelledRef.current || !live) return;

      const socket = io(`${BACKEND_URL}/world`, {
        transports: ['websocket'],
        reconnectionAttempts: 3,
        timeout: 5000,
      });
      socketRef.current = socket;

      // AI batch → augment local cache (no continuous streaming)
      socket.on(SpiritEvents.BATCH_RESPONSE, (lines: Array<{ spiritId: string; text: string; emotion?: string }>) => {
        const { augment } = useMessageCache.getState();
        lines.forEach((l) => {
          augment(l.spiritId, [{
            text:        l.text,
            emotion:     (l.emotion as EmotionType) ?? 'neutral',
            priority:    3,
            triggerType: 'idle',
          }]);
        });
      });

      // Emotion updates from backend events (combat, combinations)
      socket.on(SpiritEvents.EMOTION, (data: { spiritId: ElementType; emotion: EmotionType }) => {
        setSpiritEmotion(data.spiritId, data.emotion);
      });

      socket.on('connect_error', () => {
        socket.disconnect();
        socketRef.current = null;
      });
    });

    // STEP 4: Idle tick — one cached line every 18–32 s
    function scheduleIdle() {
      const delay = 18000 + Math.random() * 14000;
      idleTimerRef.current = setTimeout(() => {
        if (cancelledRef.current) return;

        // Priority: 60 % visible, 25 % recent, 15 % random
        const visible = getVisibleElements();
        const recent  = recentRef.current;
        const rand    = Math.random();
        let element: ElementType;

        if (visible.length > 0 && rand < 0.60) {
          element = visible[Math.floor(Math.random() * visible.length)];
        } else if (recent.length > 0 && rand < 0.85) {
          element = recent[Math.floor(Math.random() * recent.length)];
        } else {
          element = ALL_ELEMENTS[Math.floor(Math.random() * ALL_ELEMENTS.length)];
        }

        const line = pickCached(element, 'idle');
        if (line) enqueueLine(line);

        scheduleIdle();
      }, delay);
    }

    scheduleIdle();

    return () => {
      cancelledRef.current = true;
      if (greetTimerRef.current) clearTimeout(greetTimerRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (socketRef.current) {
        socketRef.current.off(SpiritEvents.BATCH_RESPONSE);
        socketRef.current.off(SpiritEvents.EMOTION);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      lineQueueRef.current = [];
      isShowingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { triggerSpiritClick, triggerHover, triggerSection, triggerCombination };
}

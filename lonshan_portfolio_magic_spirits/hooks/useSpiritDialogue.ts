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
import { ElementType, EmotionType, SpiritInstanceId } from '../types/spirit.types';
import { SpiritEvents, WorldEvents } from '../types/socket.events';
import { SPIRIT_CLICK_DRAMATIC, COMBINATION_LINES } from '../systems/dialogueScripts';
import { useMessageCache } from '../store/messageCache';
import { STATIC_MESSAGE_BATCH } from '../systems/messageBatch';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';
const HOVER_DIALOGUE_COOLDOWN_MS = 3000;

const ALL_ELEMENTS: ElementType[] = [
  'fire', 'water', 'ice', 'wind', 'soil', 'trees',
  'lightning', 'dark', 'light', 'healing', 'void', 'space', 'time', 'robot',
];

const SIGNATURE_INVOCATION_LINES: Record<ElementType, string> = {
  fire: 'Let this world burn into eternal flame.',
  water: 'I will wash this world into tranquility.',
  ice: 'Everything shall freeze into silence.',
  wind: 'Become one with the endless sky.',
  soil: 'The earth itself shall awaken.',
  trees: 'Life will bloom across this world.',
  lightning: 'Feel the fury of the endless storm.',
  dark: 'Darkness will consume everything.',
  light: 'May divine light purify this world.',
  healing: 'Let all wounds be restored.',
  void: 'Reality itself will collapse.',
  space: 'Become one with the infinite cosmos.',
  time: 'Time itself bends to my will.',
  robot: 'System override initiated.',
};

const COMPANION_TAP_LINES: Record<ElementType, string[]> = {
  fire: ['Back for more flames?', 'The fire still burns.', 'Heh... you chose me again.'],
  water: ['The tides welcome you back.', 'You seem calmer now.', 'Still flowing with me?'],
  ice: ['Still seeking clear focus?', 'The frost remembers you.', 'Shall we keep things sharp and quiet?'],
  wind: ['Back on the breeze already?', 'You move fast. I like that.', 'Ready for another light spin?'],
  soil: ['Grounded as ever. Welcome back.', 'The earth listens when you return.', 'Steady choice. I respect it.'],
  trees: ['The grove knew you would return.', 'Life still grows around you.', 'Shall we bloom again, softly?'],
  lightning: ['Another round?', "You're addicted to speed, huh?", "Let's shake the world again."],
  dark: ['You found your way back to shadow.', 'Darkness still answers you.', 'We walk the edge again.'],
  light: ['Welcome back to the radiance.', 'Your path shines brighter now.', 'Let us glow a little more.'],
  healing: ['Good to see you again.', 'Breathe. I am with you.', 'Let us restore your rhythm.'],
  void: ['You return to the abyss...', 'Interesting choice.', 'Reality still trembles.'],
  space: ['The cosmos noticed your return.', 'Still stargazing with me?', 'Orbit with me once more.'],
  time: ['Ah, right on time.', 'We meet again in this moment.', 'Time remembers your choice.'],
  robot: ['Connection re-established.', 'Welcome back, operator.', 'Companion mode active.'],
};

const COMPANION_REPEAT_LINES: Record<ElementType, string> = {
  fire: 'You picked me again. I like your style.',
  water: 'Again? Then let the current carry us.',
  ice: 'Again. Consistency is power.',
  wind: 'Again already? Keep up.',
  soil: 'Again. Strong roots make strong choices.',
  trees: 'Again. The forest welcomes that.',
  lightning: 'Again? Nice. Keep the pace up.',
  dark: 'Again... you are not afraid of the dark.',
  light: 'Again. Your light is steady.',
  healing: 'Again. Your heart is learning balance.',
  void: 'Again. The abyss is amused.',
  space: 'Again. The stars approve.',
  time: 'Again. As expected.',
  robot: 'Repeat selection detected. Optimal.',
};

const COMPANION_EMOTION: Record<ElementType, EmotionType> = {
  fire: 'playful',
  water: 'calm',
  ice: 'curious',
  wind: 'playful',
  soil: 'calm',
  trees: 'happy',
  lightning: 'excited',
  dark: 'mysterious',
  light: 'happy',
  healing: 'calm',
  void: 'mysterious',
  space: 'curious',
  time: 'proud',
  robot: 'curious',
};

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
  const hoverCooldownRef = useRef<Map<string, number>>(new Map());

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
  const activeLineTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeSpeakerRef = useRef<{ spiritId: ElementType; spiritInstanceId?: SpiritInstanceId } | null>(null);

  const setSpeakingState = useCallback(
    (spiritId: ElementType, speaking: boolean, spiritInstanceId?: SpiritInstanceId) => {
      setSpeakingRef.current(spiritId, speaking, spiritInstanceId);
    },
    [],
  );

  function processQueue() {
    if (cancelledRef.current || lineQueueRef.current.length === 0) {
      isShowingRef.current = false;
      return;
    }
    const line = lineQueueRef.current.shift()!;
    isShowingRef.current = true;
    const words  = line.text.trim().split(/\s+/).filter(Boolean).length;
    const readMs = Math.max(1000, words * 800);

    activeSpeakerRef.current = { spiritId: line.spiritId, spiritInstanceId: line.spiritInstanceId };
    setSpeakingState(line.spiritId, true, line.spiritInstanceId);
    if (line.emotion) setEmotionRef.current(line.spiritId, line.emotion as EmotionType);
    setCurrentRef.current({
      id:         `${line.spiritId}-${Date.now()}`,
      spiritId:   line.spiritId,
      spiritInstanceId: line.spiritInstanceId,
      text:       line.text,
      timestamp:  Date.now(),
      targetUser: line.targetUser ?? false,
    });

    activeLineTimerRef.current = setTimeout(() => {
      if (cancelledRef.current) return;
      setSpeakingState(line.spiritId, false, line.spiritInstanceId);
      activeSpeakerRef.current = null;
      activeLineTimerRef.current = null;
      setCurrentRef.current(null);
      processQueue();
    }, readMs + 600);
  }

  const interruptWithLine = useCallback((line: DialogueLine) => {
    if (activeLineTimerRef.current) {
      clearTimeout(activeLineTimerRef.current);
      activeLineTimerRef.current = null;
    }
    if (activeSpeakerRef.current) {
      setSpeakingState(
        activeSpeakerRef.current.spiritId,
        false,
        activeSpeakerRef.current.spiritInstanceId,
      );
      activeSpeakerRef.current = null;
    }

    setCurrentRef.current(null);
    lineQueueRef.current = [line];
    isShowingRef.current = false;
    processQueue();
  }, [setSpeakingState]);

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

  /** Signature invocation line for cinematic spell casting. Interrupts current queue. */
  const triggerSpiritInvocation = useCallback((element: ElementType, spiritInstanceId?: SpiritInstanceId) => {
    const text = SIGNATURE_INVOCATION_LINES[element];
    if (!text) return;
    interruptWithLine({
      spiritId: element,
      spiritInstanceId,
      text,
      emotion: 'proud',
      delay: 0,
      targetUser: true,
    });
    recentRef.current = [element, ...recentRef.current.slice(0, 4)];
  }, [interruptWithLine]);

  /** Companion tap line for same-theme interactions. Interrupts current queue for immediate feedback. */
  const triggerSpiritCompanionTap = useCallback((element: ElementType, spiritInstanceId?: SpiritInstanceId) => {
    const repeated = recentRef.current[0] === element;
    const text = repeated
      ? COMPANION_REPEAT_LINES[element]
      : COMPANION_TAP_LINES[element][Math.floor(Math.random() * COMPANION_TAP_LINES[element].length)];

    interruptWithLine({
      spiritId: element,
      spiritInstanceId,
      text,
      emotion: COMPANION_EMOTION[element],
      delay: 0,
      targetUser: true,
    });

    recentRef.current = [element, ...recentRef.current.slice(0, 4)];
  }, [interruptWithLine]);

  /**
   * Hover reaction: shown only when the queue is empty.
   * Draws from the element's 'hover' pool in the cache.
   */
  const triggerHover = useCallback(
    (element: ElementType, spiritInstanceId?: SpiritInstanceId) => {
      const key = spiritInstanceId ?? element;
      const now = Date.now();
      const last = hoverCooldownRef.current.get(key) ?? 0;
      if (now - last < HOVER_DIALOGUE_COOLDOWN_MS) return;
      hoverCooldownRef.current.set(key, now);

      const line = pickCached(element, 'hover');
      if (!line) return;

      const hoverLine: DialogueLine = {
        ...line,
        spiritInstanceId,
        targetUser: true,
      };

      const current = useDialogueStore.getState().current;
      // If only background chatter is showing, hover should feel immediate.
      if (current && !current.targetUser) {
        interruptWithLine(hoverLine);
        return;
      }

      if (isBusy()) return;
      enqueueLine(hoverLine);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enqueueLine, interruptWithLine],
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
      if (activeLineTimerRef.current) {
        clearTimeout(activeLineTimerRef.current);
        activeLineTimerRef.current = null;
      }
      if (activeSpeakerRef.current) {
        setSpiritSpeaking(
          activeSpeakerRef.current.spiritId,
          false,
          activeSpeakerRef.current.spiritInstanceId,
        );
        activeSpeakerRef.current = null;
      }
      lineQueueRef.current = [];
      isShowingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    triggerSpiritClick,
    triggerSpiritInvocation,
    triggerSpiritCompanionTap,
    triggerHover,
    triggerSection,
    triggerCombination,
  };
}

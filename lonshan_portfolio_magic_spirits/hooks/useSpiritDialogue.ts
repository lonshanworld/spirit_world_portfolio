'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useWorldStore } from '../store/worldStore';
import { useDialogueStore } from '../store/dialogueStore';
import { DialogueLine, DialogueSequence } from '../types/dialogue.types';
import { ElementType, EmotionType } from '../types/spirit.types';
import { SpiritEvents, WorldEvents } from '../types/socket.events';
import {
  IDLE_SEQUENCES,
  GREETING_SEQUENCES,
  SECTION_SEQUENCES,
  RECRUITER_SEQUENCES,
  ADVOCACY_SEQUENCES,
  SPIRIT_CLICK_LINES,
  COMBINATION_LINES,
} from '../systems/dialogueScripts';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';

const lastPlayed = new Map<string, number>();

function canPlay(seq: DialogueSequence): boolean {
  const now = Date.now();
  const last = lastPlayed.get(seq.id) ?? 0;
  return now - last >= (seq.cooldownMs ?? 0);
}

function markPlayed(id: string): void {
  lastPlayed.set(id, Date.now());
}

/** Probe the WebSocket backend once to decide whether AI mode is active. */
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

export function useSpiritDialogue() {
  const setSpiritSpeaking = useWorldStore((s) => s.setSpiritSpeaking);
  const setSpiritEmotion = useWorldStore((s) => s.setSpiritEmotion);
  const addDialogue = useDialogueStore((s) => s.addDialogue);
  const removeDialogue = useDialogueStore((s) => s.removeDialogue);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);
  const socketRef = useRef<Socket | null>(null);
  const backendLiveRef = useRef(false);
  const sectionsVisitedRef = useRef<Set<string>>(new Set());

  // ── Core line-player ───────────────────────────────────────────

  const playLine = useCallback(
    (line: DialogueLine) => {
      setSpiritSpeaking(line.spiritId, true);
      if (line.emotion) setSpiritEmotion(line.spiritId, line.emotion as EmotionType);

      const dialogueId = `${line.spiritId}-${Date.now()}`;
      addDialogue({
        id: dialogueId,
        spiritId: line.spiritId,
        text: line.text,
        timestamp: Date.now(),
        targetUser: line.targetUser ?? false,
      });

      const readMs = line.text.length * 65 + 1500;
      setTimeout(() => {
        setSpiritSpeaking(line.spiritId, false);
        removeDialogue(dialogueId);
      }, readMs + 1000);
    },
    [setSpiritSpeaking, setSpiritEmotion, addDialogue, removeDialogue],
  );

  const playLines = useCallback(
    async (lines: DialogueLine[]) => {
      for (const line of lines) {
        await new Promise<void>((r) => setTimeout(r, line.delay));
        playLine(line);
      }
    },
    [playLine],
  );

  const playSequence = useCallback(
    async (seq: DialogueSequence) => {
      if (isPlayingRef.current) return;
      isPlayingRef.current = true;
      markPlayed(seq.id);
      await playLines(seq.lines);
      isPlayingRef.current = false;
    },
    [playLines],
  );

  // ── Public API ─────────────────────────────────────────────────

  const triggerSpiritClick = useCallback(
    (id: ElementType) => {
      if (backendLiveRef.current && socketRef.current) {
        socketRef.current.emit(SpiritEvents.INTERACTION, { spiritId: id, interactionType: 'click' });
      } else {
        const variants = SPIRIT_CLICK_LINES[id];
        if (variants?.length) {
          const lines = variants[Math.floor(Math.random() * variants.length)];
          playLines(lines);
        }
      }
    },
    [playLines],
  );

  const triggerSection = useCallback(
    (section: string) => {
      sectionsVisitedRef.current.add(section);
      if (backendLiveRef.current && socketRef.current) {
        socketRef.current.emit(WorldEvents.SECTION_VISIBLE, { section });
      } else {
        const matches = SECTION_SEQUENCES.filter((s) => s.section === section && canPlay(s));
        if (matches.length) {
          const seq = matches[Math.floor(Math.random() * matches.length)];
          playSequence(seq);
        }
      }
    },
    [playSequence],
  );

  const triggerCombination = useCallback(
    (hybridId: string, elementA?: ElementType, elementB?: ElementType) => {
      if (backendLiveRef.current && socketRef.current) {
        socketRef.current.emit('theme:combination', { hybridId, elementA, elementB });
      } else {
        const lines = COMBINATION_LINES[hybridId];
        if (lines) playLines(lines);
      }
    },
    [playLines],
  );

  // ── Idle scheduler + AI socket setup ─────────────────────────

  useEffect(() => {
    let greetTimer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    isBackendReachable().then((backendLive) => {
      if (cancelled) return;
      backendLiveRef.current = backendLive;

      if (backendLive) {
        // Establish persistent socket — the NestJS gateway drives all dialogue
        const socket = io(`${BACKEND_URL}/world`, {
          transports: ['websocket'],
          reconnectionAttempts: 3,
          timeout: 5000,
        });
        socketRef.current = socket;

        // Receive AI-generated dialogue lines from the backend
        socket.on(SpiritEvents.DIALOGUE, (line: DialogueLine) => {
          playLine(line);
        });

        // Receive emotion updates from the backend
        socket.on(SpiritEvents.EMOTION, (data: { spiritId: ElementType; emotion: EmotionType }) => {
          setSpiritEmotion(data.spiritId, data.emotion);
        });

        socket.on('connect_error', () => {
          // If connection drops, fall back to local dialogue mode
          backendLiveRef.current = false;
          socketRef.current = null;
          socket.disconnect();
        });

        return; // NestJS idle scheduler drives remaining dialogue
      }

      // Fallback: local scripted dialogue
      greetTimer = setTimeout(() => {
        const greeting = GREETING_SEQUENCES[Math.floor(Math.random() * GREETING_SEQUENCES.length)];
        playSequence(greeting);
      }, 2000);

      const sessionStart = Date.now();

      function scheduleIdle() {
        const delay = 18000 + Math.random() * 14000; // 18–32s between sequences
        idleTimerRef.current = setTimeout(async () => {
          if (cancelled) return;

                const sessionSecs = (Date.now() - sessionStart) / 1000;
          const sectionsVisited = sectionsVisitedRef.current.size;

          // Recruiter eligibility: after 60s OR having visited 2+ sections
          const recruiterActive = sessionSecs > 60 || sectionsVisited >= 2;
          const recruiterEligible = recruiterActive ? RECRUITER_SEQUENCES.filter(canPlay) : [];
          const idleEligible      = IDLE_SEQUENCES.filter(canPlay);
          const advocacyEligible  = ADVOCACY_SEQUENCES.filter(canPlay);

          // Recruiter weight scales with sections visited: 30% base → up to 50% at 4+ sections
          const recruiterWeight = Math.min(0.30 + (sectionsVisited - 1) * 0.05, 0.50);
          const rand = Math.random();
          let pool: typeof idleEligible;
          if (recruiterEligible.length > 0 && rand < recruiterWeight) {
            pool = recruiterEligible;
          } else if (advocacyEligible.length > 0 && rand < 0.65) {
            pool = advocacyEligible;
          } else {
            pool = idleEligible;
          }

          if (pool.length) {
            const seq = pool[Math.floor(Math.random() * pool.length)];
            await playSequence(seq);
          }
          scheduleIdle();
        }, delay);
      }

      scheduleIdle();
    });

    return () => {
      cancelled = true;
      clearTimeout(greetTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (socketRef.current) {
        socketRef.current.off(SpiritEvents.DIALOGUE);
        socketRef.current.off(SpiritEvents.EMOTION);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [playLine, playSequence, setSpiritEmotion]);

  return { triggerSpiritClick, triggerSection, triggerCombination };
}

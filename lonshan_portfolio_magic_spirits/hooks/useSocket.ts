'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useWorldStore } from '../store/worldStore';
import { useDialogueStore } from '../store/dialogueStore';
import { DialogueLine } from '../types/dialogue.types';
import { ElementType, EmotionType } from '../types/spirit.types';
import { SpiritEvents, WorldEvents } from '../types/socket.events';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const setSpiritEmotion = useWorldStore((s) => s.setSpiritEmotion);
  const setSpiritSpeaking = useWorldStore((s) => s.setSpiritSpeaking);
  const addDialogue = useDialogueStore((s) => s.addDialogue);

  const handleDialogueLine = useCallback(
    (line: DialogueLine) => {
      setSpiritSpeaking(line.spiritId, true);
      if (line.emotion) setSpiritEmotion(line.spiritId, line.emotion as EmotionType);

      addDialogue({
        id: `${line.spiritId}-${Date.now()}`,
        spiritId: line.spiritId,
        text: line.text,
        timestamp: Date.now(),
        targetUser: line.targetUser ?? false,
      });

      // Auto-clear speaking after reading time
      const readingTime = line.text.length * 60 + 1500;
      setTimeout(() => setSpiritSpeaking(line.spiritId, false), readingTime);
    },
    [setSpiritSpeaking, setSpiritEmotion, addDialogue],
  );

  useEffect(() => {
    const socket = io(`${BACKEND_URL}/world`, {
      transports: ['websocket'],
      reconnectionAttempts: 3,
      timeout: 5000,
    });

    socketRef.current = socket;

    // Spirit says something
    socket.on(SpiritEvents.DIALOGUE, handleDialogueLine);

    // Backend updated a spirit's emotion (after click / theme change / combination)
    socket.on(SpiritEvents.EMOTION, (data: { spiritId: ElementType; emotion: EmotionType }) => {
      setSpiritEmotion(data.spiritId, data.emotion);
    });

    socket.on('connect_error', () => {
      // Silently fail — local dialogue scripts take over
      socket.disconnect();
    });

    return () => {
      socket.off(SpiritEvents.DIALOGUE, handleDialogueLine);
      socket.off(SpiritEvents.EMOTION);
      socket.disconnect();
    };
  }, [handleDialogueLine, setSpiritEmotion]);

  const emitInteraction = useCallback((spiritId: ElementType) => {
    socketRef.current?.emit(SpiritEvents.INTERACTION, {
      spiritId,
      interactionType: 'click',
    });
  }, []);

  const emitSectionVisible = useCallback((section: string) => {
    socketRef.current?.emit(WorldEvents.SECTION_VISIBLE, { section });
  }, []);

  const emitCombination = useCallback(
    (hybridId: string, elementA: ElementType, elementB: ElementType) => {
      socketRef.current?.emit('theme:combination', { hybridId, elementA, elementB });
    },
    [],
  );

  const emitThemeChange = useCallback((elementId: ElementType) => {
    socketRef.current?.emit('theme:change_request', { elementId });
  }, []);

  return { emitInteraction, emitSectionVisible, emitCombination, emitThemeChange };
}

'use client';

import { AnimatePresence } from 'framer-motion';
import { useDialogueStore } from '../../store/dialogueStore';
import { DialogueBubble } from './DialogueBubble';

export function DialogueStack() {
  const current = useDialogueStore((s) => s.current);

  return (
    <div
      aria-live="polite"
      aria-label="Spirit conversations"
      className="fixed bottom-24 right-6 z-40 flex flex-col gap-3 items-end pointer-events-none max-w-xs w-full md:max-w-sm"
    >
      <AnimatePresence mode="popLayout">
        {current && (
          <DialogueBubble
            key={current.id}
            dialogue={current}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

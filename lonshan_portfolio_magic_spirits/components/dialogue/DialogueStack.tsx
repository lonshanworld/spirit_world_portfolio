'use client';

import { AnimatePresence } from 'framer-motion';
import { useDialogueStore } from '../../store/dialogueStore';
import { DialogueBubble } from './DialogueBubble';

export function DialogueStack() {
  const dialogues = useDialogueStore((s) => s.dialogues);
  const removeDialogue = useDialogueStore((s) => s.removeDialogue);

  return (
    <div
      aria-live="polite"
      aria-label="Spirit conversations"
      className="fixed bottom-24 right-6 z-40 flex flex-col gap-3 items-end pointer-events-none max-w-xs w-full md:max-w-sm"
    >
      <AnimatePresence mode="popLayout">
        {dialogues.map((dialogue) => (
          <DialogueBubble
            key={dialogue.id}
            dialogue={dialogue}
            onExpire={removeDialogue}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

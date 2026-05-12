'use client';

import { motion } from 'framer-motion';
import { SPIRIT_DEFINITIONS } from '../../systems/elementData';
import { ActiveDialogue } from '../../types/dialogue.types';

interface DialogueBubbleProps {
  dialogue: ActiveDialogue;
  onExpire: (id: string) => void;
}

// How long each bubble remains visible (ms)
const BUBBLE_DURATION = 5500;

export function DialogueBubble({ dialogue, onExpire }: DialogueBubbleProps) {
  const def = SPIRIT_DEFINITIONS[dialogue.spiritId];

  return (
    <motion.div
      key={dialogue.id}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      onAnimationComplete={() => {
        // Schedule expiry after the bubble has been visible
        setTimeout(() => onExpire(dialogue.id), BUBBLE_DURATION);
      }}
      className="relative max-w-xs w-fit px-4 py-2.5 rounded-2xl text-sm leading-snug select-none"
      style={{
        background: `linear-gradient(135deg, ${def.primaryColor}22, ${def.secondaryColor}18)`,
        border: `1px solid ${def.primaryColor}44`,
        boxShadow: `0 4px 24px ${def.glowColor}, inset 0 1px 0 rgba(255,255,255,0.08)`,
        backdropFilter: 'blur(12px)',
        color: def.secondaryColor === '#E8F4F8' ? '#ffffff' : def.secondaryColor,
      }}
    >
      {/* Spirit name tag */}
      <div
        className="flex items-center gap-1.5 mb-1 text-xs font-bold tracking-widest uppercase"
        style={{ color: def.primaryColor, opacity: 0.85 }}
      >
        <span className="text-base">{def.symbol}</span>
        <span>{def.name}</span>
        {dialogue.targetUser && (
          <span className="ml-1 text-[10px] rounded-full px-1.5 py-0.5"
            style={{ background: `${def.primaryColor}33`, color: def.primaryColor }}>
            to you
          </span>
        )}
      </div>

      {/* Message text */}
      <p className="font-light" style={{ textShadow: `0 0 12px ${def.glowColor}` }}>
        {dialogue.text}
      </p>

      {/* Element-specific decorative accent */}
      <BubbleAccent element={dialogue.spiritId} color={def.primaryColor} />
    </motion.div>
  );
}

function BubbleAccent({ element, color }: { element: string; color: string }) {
  switch (element) {
    case 'fire':
      return (
        <motion.div
          className="absolute -top-1.5 right-3 text-sm pointer-events-none"
          animate={{ y: [0, -3, 0], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={{ color }}
        >
          🔥
        </motion.div>
      );
    case 'lightning':
      return (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{ opacity: [0, 0.5, 0, 0.3, 0] }}
          transition={{ duration: 0.25, repeat: Infinity, repeatDelay: 2 }}
          style={{ border: `1px solid ${color}`, borderRadius: '1rem' }}
        />
      );
    case 'void':
      return (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 150%, rgba(100,0,200,0.2), transparent 65%)',
          }}
        />
      );
    case 'space':
      return (
        <div className="absolute top-1 right-2 text-[9px] opacity-40 pointer-events-none" style={{ color }}>
          ✦ ✧ ✦
        </div>
      );
    case 'water':
      return (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl pointer-events-none"
          animate={{ opacity: [0.3, 0.7, 0.3], scaleX: [0.8, 1, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />
      );
    case 'ice':
      return (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)',
            backdropFilter: 'blur(1px)',
          }}
        />
      );
    case 'healing':
      return (
        <motion.div
          className="absolute -top-1 -right-1 text-sm pointer-events-none"
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💚
        </motion.div>
      );
    case 'dark':
      return (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ background: `radial-gradient(circle at 30% 30%, ${color}44, transparent 70%)` }}
        />
      );
    case 'light':
      return (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{ opacity: [0, 0.12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ background: `radial-gradient(circle at 50% 0%, ${color}, transparent 70%)` }}
        />
      );
    case 'wind':
      return (
        <motion.div
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] opacity-30 pointer-events-none"
          animate={{ x: [0, 4, 0], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ color }}
        >
          ~~~
        </motion.div>
      );
    case 'soil':
      return (
        <div
          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${color}55, transparent)` }}
        />
      );
    case 'trees':
      return (
        <div className="absolute top-1 right-2 text-[10px] opacity-25 pointer-events-none" style={{ color }}>
          🌿
        </div>
      );
    case 'time':
      return (
        <motion.div
          className="absolute top-1 right-2 text-[10px] opacity-30 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ color }}
        >
          ⏳
        </motion.div>
      );
    case 'robot':
      return (
        <motion.div
          className="absolute bottom-1.5 right-3 text-[9px] font-mono pointer-events-none"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          style={{ color }}
        >
          █
        </motion.div>
      );
    default:
      return null;
  }
}

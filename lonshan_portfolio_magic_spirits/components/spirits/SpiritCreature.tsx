'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ElementType, EmotionType } from '../../types/spirit.types';
import { LITERAL_SPIRIT_ASSET } from '../../systems/literalDesign';

export interface SpiritCreatureProps {
  element: ElementType;
  emotion: EmotionType;
  isSpeaking: boolean;
  isHovered: boolean;
  isCasting?: boolean;
  size?: number;
  instanceId?: string;
  facingLeft?: boolean;
}

export function SpiritCreature({
  element,
  emotion,
  isSpeaking: _isSpeaking,
  isHovered: _isHovered,
  isCasting = false,
  size = 1,
  facingLeft = false,
}: SpiritCreatureProps) {
  const asset = LITERAL_SPIRIT_ASSET[element];

  const w = 32 * size;
  const h = w * 1.25;

  return (
    <div
      className="relative select-none pointer-events-none"
      style={{
        width: w,
        height: h,
        filter: `drop-shadow(0 ${Math.round(h * 0.05)}px ${Math.round(h * 0.12)}px rgba(0,0,0,0.4))`,
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ transform: facingLeft ? 'scaleX(-1)' : 'scaleX(1)' }}
        animate={{
          y: isCasting ? [0, -1, 0] : 0,
          scale: 1,
        }}
        transition={{
          duration: 1.2,
          repeat: isCasting ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        <Image
          src={asset}
          alt={`${element} spirit`}
          fill
          priority={false}
          sizes="64px"
          className="object-contain"
        />
      </motion.div>

      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -5,
          left: '50%',
          width: w * 0.55,
          height: h * 0.14,
          transform: 'translateX(-50%)',
          borderRadius: '9999px',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.36) 0%, rgba(0,0,0,0) 72%)',
          filter: 'blur(2px)',
        }}
      />
    </div>
  );
}

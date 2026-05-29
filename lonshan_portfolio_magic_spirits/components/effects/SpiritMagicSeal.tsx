'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ElementType } from '../../types/spirit.types';
import { LITERAL_SEAL_ASSET } from '../../systems/literalDesign';

interface SpiritMagicSealProps {
  element: ElementType;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  castId: number;
  visible: boolean;
  variant?: 'full' | 'mini';
}

export function SpiritMagicSeal({
  element,
  glowColor,
  castId,
  visible,
  variant = 'full',
}: SpiritMagicSealProps) {
  const isMini = variant === 'mini';
  const baseSize = isMini ? 140 : 230;
  const sealAsset = LITERAL_SEAL_ASSET[element];

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: '50%',
        top: '58%',
        width: baseSize,
        height: baseSize,
        transform: 'translate(-50%, -50%)',
        zIndex: 7,
      }}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            key={`${element}-${castId}`}
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              filter: `drop-shadow(0 0 ${isMini ? 6 : 10}px ${glowColor}55)`,
            }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{ duration: 0 }}
            >
              <Image
                src={sealAsset}
                alt={`${element} magic seal`}
                fill
                sizes="240px"
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

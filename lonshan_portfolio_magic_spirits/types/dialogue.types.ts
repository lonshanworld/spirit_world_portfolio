import { ElementType, EmotionType } from './spirit.types';

export interface DialogueLine {
  spiritId: ElementType;
  text: string;
  delay: number;
  emotion?: EmotionType;
  targetUser?: boolean;
}

export interface DialogueSequence {
  id: string;
  trigger: 'idle' | 'section' | 'interaction' | 'combination';
  section?: string;
  cooldownMs?: number;
  lines: DialogueLine[];
}

export interface ActiveDialogue {
  id: string;
  spiritId: ElementType;
  text: string;
  timestamp: number;
  targetUser: boolean;
}

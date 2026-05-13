import { ElementType, EmotionType, SpiritInstanceId } from './spirit.types';

export interface DialogueLine {
  spiritId: ElementType;
  spiritInstanceId?: SpiritInstanceId;
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
  spiritInstanceId?: SpiritInstanceId;
  text: string;
  timestamp: number;
  targetUser: boolean;
}

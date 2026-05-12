export type ElementType =
  | 'fire' | 'water' | 'ice' | 'wind' | 'soil'
  | 'trees' | 'lightning' | 'dark' | 'light'
  | 'healing' | 'void' | 'space' | 'time' | 'robot';

export type EmotionType =
  | 'neutral' | 'excited' | 'calm' | 'mysterious' | 'playful'
  | 'happy' | 'sad' | 'surprised' | 'angry' | 'embarrassed'
  | 'sleepy' | 'confused' | 'proud' | 'curious';

export type HybridElement =
  | 'lava' | 'frost' | 'eclipse' | 'storm' | 'bloom'
  | 'cosmos' | 'cyber' | 'inferno' | 'divine';

export interface ISpiritState {
  id: ElementType;
  name: string;
  emotion: EmotionType;
  isSpeaking: boolean;
  lastSpoke: number;
  isActive: boolean;
}

export interface IDialogueLine {
  spiritId: ElementType;
  text: string;
  delay: number;
  emotion?: EmotionType;
  targetUser?: boolean;
}

export interface IDialogueSequence {
  id: string;
  trigger: 'idle' | 'section' | 'interaction' | 'combination';
  section?: string;
  lines: IDialogueLine[];
  cooldownMs?: number;
}

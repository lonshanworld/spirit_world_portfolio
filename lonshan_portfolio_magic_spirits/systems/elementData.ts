import { ElementType, SpiritDefinition } from '../types/spirit.types';

export const SPIRIT_DEFINITIONS: Record<ElementType, SpiritDefinition> = {
  fire: {
    id: 'fire', name: 'Ignis', symbol: '🔥',
    primaryColor: '#FF6A00', secondaryColor: '#FFB347',
    glowColor: 'rgba(255,106,0,0.72)', shadowColor: 'rgba(170,56,0,0.9)',
    personality: 'Energetic, passionate, confident, slightly chaotic',
    speakingStyle: 'Bold declarations with dramatic flair',
    defaultEmotion: 'excited', motionPattern: 'float', motionSpeed: 1.4, size: 1.0,
  },
  water: {
    id: 'water', name: 'Marina', symbol: '💧',
    primaryColor: '#00C7FF', secondaryColor: '#57E6FF',
    glowColor: 'rgba(0,199,255,0.62)', shadowColor: 'rgba(0,95,173,0.82)',
    personality: 'Calm, intelligent, elegant, emotionally aware',
    speakingStyle: 'Flowing, thoughtful, poetic',
    defaultEmotion: 'calm', motionPattern: 'wave', motionSpeed: 2, size: 1.0,
  },
  ice: {
    id: 'ice', name: 'Glacies', symbol: '❄️',
    primaryColor: '#6FD7FF', secondaryColor: '#DDF6FF',
    glowColor: 'rgba(111,215,255,0.65)', shadowColor: 'rgba(76,153,218,0.58)',
    personality: 'Precise, cold, calculating, unexpectedly witty',
    speakingStyle: 'Sharp, crisp, economical',
    defaultEmotion: 'neutral', motionPattern: 'drift', motionSpeed: 1, size: 0.9,
  },
  wind: {
    id: 'wind', name: 'Ventus', symbol: '💨',
    primaryColor: '#7FDFFF', secondaryColor: '#BFF6FF',
    glowColor: 'rgba(127,223,255,0.56)', shadowColor: 'rgba(64,129,173,0.56)',
    personality: 'Carefree, whimsical, playful, easily distracted',
    speakingStyle: 'Light, breezy, topic-hopping',
    defaultEmotion: 'playful', motionPattern: 'float', motionSpeed: 3, size: 0.95,
  },
  soil: {
    id: 'soil', name: 'Terra', symbol: '🪨',
    primaryColor: '#9B5A2F', secondaryColor: '#D19A66',
    glowColor: 'rgba(155,90,47,0.54)', shadowColor: 'rgba(88,49,24,0.74)',
    personality: 'Grounded, wise, patient, deeply thoughtful',
    speakingStyle: 'Slow, deliberate, rich with wisdom',
    defaultEmotion: 'calm', motionPattern: 'drift', motionSpeed: 1, size: 1.0,
  },
  trees: {
    id: 'trees', name: 'Sylva', symbol: '🌿',
    primaryColor: '#40C95C', secondaryColor: '#8BE06A',
    glowColor: 'rgba(64,201,92,0.52)', shadowColor: 'rgba(34,120,55,0.62)',
    personality: 'Nurturing, ancient, deeply connected',
    speakingStyle: 'Gentle, organic, metaphor-rich',
    defaultEmotion: 'calm', motionPattern: 'wave', motionSpeed: 2, size: 1.0,
  },
  lightning: {
    id: 'lightning', name: 'Volt', symbol: '⚡',
    primaryColor: '#FFE000', secondaryColor: '#FFF68A',
    glowColor: 'rgba(255,224,0,0.82)', shadowColor: 'rgba(207,168,18,0.84)',
    personality: 'Fast-talking, witty, sarcastic, hyperactive',
    speakingStyle: 'Rapid-fire quips, loves interrupting',
    defaultEmotion: 'excited', motionPattern: 'erratic', motionSpeed: 5, size: 0.9,
  },
  dark: {
    id: 'dark', name: 'Umbra', symbol: '🌑',
    primaryColor: '#8E3BFF', secondaryColor: '#C26BFF',
    glowColor: 'rgba(142,59,255,0.55)', shadowColor: 'rgba(62,18,108,0.84)',
    personality: 'Brooding, cryptic, secretly poetic, intense',
    speakingStyle: 'Dark metaphors, double meanings',
    defaultEmotion: 'mysterious', motionPattern: 'pulse', motionSpeed: 2, size: 1.0,
  },
  light: {
    id: 'light', name: 'Luma', symbol: '✨',
    primaryColor: '#FFD76B', secondaryColor: '#FFF2C6',
    glowColor: 'rgba(255,215,107,0.9)', shadowColor: 'rgba(191,145,48,0.72)',
    personality: 'Radiant, uplifting, eternally optimistic, empathetic',
    speakingStyle: 'Warm encouragement, sees the best in everything',
    defaultEmotion: 'excited', motionPattern: 'float', motionSpeed: 2, size: 1.0,
  },
  healing: {
    id: 'healing', name: 'Aura', symbol: '💚',
    primaryColor: '#54E77B', secondaryColor: '#B9FFC9',
    glowColor: 'rgba(84,231,123,0.64)', shadowColor: 'rgba(44,136,72,0.6)',
    personality: 'Gentle, nurturing, supportive, deeply compassionate',
    speakingStyle: 'Soft, reassuring, healing words',
    defaultEmotion: 'calm', motionPattern: 'pulse', motionSpeed: 1, size: 1.0,
  },
  void: {
    id: 'void', name: 'Nihil', symbol: '🕳️',
    primaryColor: '#7E2DFF', secondaryColor: '#B369FF',
    glowColor: 'rgba(126,45,255,0.62)', shadowColor: 'rgba(34,12,66,0.9)',
    personality: 'Enigmatic, philosophical, speaks rarely but profoundly',
    speakingStyle: 'Cryptic koan-like utterances',
    defaultEmotion: 'mysterious', motionPattern: 'drift', motionSpeed: 1, size: 1.0,
  },
  space: {
    id: 'space', name: 'Cosmus', symbol: '🌌',
    primaryColor: '#34B7FF', secondaryColor: '#7A5BFF',
    glowColor: 'rgba(52,183,255,0.56)', shadowColor: 'rgba(40,49,126,0.76)',
    personality: 'Vast, contemplative, speaks in cosmic scales',
    speakingStyle: 'Grand perspectives, infinite metaphors',
    defaultEmotion: 'mysterious', motionPattern: 'spin', motionSpeed: 2, size: 1.0,
  },
  time: {
    id: 'time', name: 'Chrono', symbol: '⏳',
    primaryColor: '#D9A441', secondaryColor: '#F0CD7A',
    glowColor: 'rgba(217,164,65,0.66)', shadowColor: 'rgba(128,90,30,0.72)',
    personality: 'Paradoxical, already knows what you will say',
    speakingStyle: 'Speaks in tenses, past and future simultaneously',
    defaultEmotion: 'neutral', motionPattern: 'spin', motionSpeed: 2, size: 1.0,
  },
  robot: {
    id: 'robot', name: 'NEXUS', symbol: '🤖',
    primaryColor: '#7E97A9', secondaryColor: '#BFD2DF',
    glowColor: 'rgba(126,151,169,0.58)', shadowColor: 'rgba(66,84,98,0.78)',
    personality: 'Analytical, technical, logical, oddly enthusiastic about data',
    speakingStyle: 'Technical precision, loves statistics',
    defaultEmotion: 'neutral', motionPattern: 'pulse', motionSpeed: 3, size: 1.0,
  },
};

/** All 14 spirits are present in the world */
export const FEATURED_SPIRITS: ElementType[] = [
  'fire', 'water', 'lightning', 'void', 'robot', 'healing', 'space', 'dark',
  'ice', 'wind', 'soil', 'trees', 'light', 'time',
];

export const ALL_ELEMENTS: ElementType[] = Object.keys(SPIRIT_DEFINITIONS) as ElementType[];

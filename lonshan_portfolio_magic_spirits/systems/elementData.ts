import { ElementType, SpiritDefinition } from '../types/spirit.types';

export const SPIRIT_DEFINITIONS: Record<ElementType, SpiritDefinition> = {
  fire: {
    id: 'fire', name: 'Ignis', symbol: '🔥',
    primaryColor: '#FF3000', secondaryColor: '#FF6600',
    glowColor: 'rgba(255,48,0,0.7)', shadowColor: 'rgba(200,20,0,0.9)',
    personality: 'Energetic, passionate, confident, slightly chaotic',
    speakingStyle: 'Bold declarations with dramatic flair',
    defaultEmotion: 'excited', motionPattern: 'float', motionSpeed: 1.4, size: 1.0,
  },
  water: {
    id: 'water', name: 'Marina', symbol: '💧',
    primaryColor: '#00AAFF', secondaryColor: '#0066CC',
    glowColor: 'rgba(0,170,255,0.6)', shadowColor: 'rgba(0,80,200,0.8)',
    personality: 'Calm, intelligent, elegant, emotionally aware',
    speakingStyle: 'Flowing, thoughtful, poetic',
    defaultEmotion: 'calm', motionPattern: 'wave', motionSpeed: 2, size: 1.0,
  },
  ice: {
    id: 'ice', name: 'Glacies', symbol: '❄️',
    primaryColor: '#80F0FF', secondaryColor: '#C8F8FF',
    glowColor: 'rgba(128,240,255,0.6)', shadowColor: 'rgba(80,200,230,0.5)',
    personality: 'Precise, cold, calculating, unexpectedly witty',
    speakingStyle: 'Sharp, crisp, economical',
    defaultEmotion: 'neutral', motionPattern: 'drift', motionSpeed: 1, size: 0.9,
  },
  wind: {
    id: 'wind', name: 'Ventus', symbol: '💨',
    primaryColor: '#A8E030', secondaryColor: '#C8F050',
    glowColor: 'rgba(168,224,48,0.5)', shadowColor: 'rgba(120,180,20,0.5)',
    personality: 'Carefree, whimsical, playful, easily distracted',
    speakingStyle: 'Light, breezy, topic-hopping',
    defaultEmotion: 'playful', motionPattern: 'float', motionSpeed: 3, size: 0.95,
  },
  soil: {
    id: 'soil', name: 'Terra', symbol: '🪨',
    primaryColor: '#8B4513', secondaryColor: '#5C2E00',
    glowColor: 'rgba(139,69,19,0.5)', shadowColor: 'rgba(90,40,10,0.7)',
    personality: 'Grounded, wise, patient, deeply thoughtful',
    speakingStyle: 'Slow, deliberate, rich with wisdom',
    defaultEmotion: 'calm', motionPattern: 'drift', motionSpeed: 1, size: 1.0,
  },
  trees: {
    id: 'trees', name: 'Sylva', symbol: '🌿',
    primaryColor: '#22C55E', secondaryColor: '#15803D',
    glowColor: 'rgba(34,197,94,0.5)', shadowColor: 'rgba(20,120,60,0.6)',
    personality: 'Nurturing, ancient, deeply connected',
    speakingStyle: 'Gentle, organic, metaphor-rich',
    defaultEmotion: 'calm', motionPattern: 'wave', motionSpeed: 2, size: 1.0,
  },
  lightning: {
    id: 'lightning', name: 'Volt', symbol: '⚡',
    primaryColor: '#FFEE00', secondaryColor: '#FFFB80',
    glowColor: 'rgba(255,238,0,0.8)', shadowColor: 'rgba(240,220,0,0.9)',
    personality: 'Fast-talking, witty, sarcastic, hyperactive',
    speakingStyle: 'Rapid-fire quips, loves interrupting',
    defaultEmotion: 'excited', motionPattern: 'erratic', motionSpeed: 5, size: 0.9,
  },
  dark: {
    id: 'dark', name: 'Umbra', symbol: '🌑',
    primaryColor: '#CC00FF', secondaryColor: '#660088',
    glowColor: 'rgba(204,0,255,0.5)', shadowColor: 'rgba(120,0,180,0.8)',
    personality: 'Brooding, cryptic, secretly poetic, intense',
    speakingStyle: 'Dark metaphors, double meanings',
    defaultEmotion: 'mysterious', motionPattern: 'pulse', motionSpeed: 2, size: 1.0,
  },
  light: {
    id: 'light', name: 'Luma', symbol: '✨',
    primaryColor: '#FFF8A0', secondaryColor: '#FFFCE8',
    glowColor: 'rgba(255,248,160,0.9)', shadowColor: 'rgba(255,230,80,0.7)',
    personality: 'Radiant, uplifting, eternally optimistic, empathetic',
    speakingStyle: 'Warm encouragement, sees the best in everything',
    defaultEmotion: 'excited', motionPattern: 'float', motionSpeed: 2, size: 1.0,
  },
  healing: {
    id: 'healing', name: 'Aura', symbol: '💚',
    primaryColor: '#FF80C0', secondaryColor: '#FF3890',
    glowColor: 'rgba(255,128,192,0.6)', shadowColor: 'rgba(220,40,120,0.5)',
    personality: 'Gentle, nurturing, supportive, deeply compassionate',
    speakingStyle: 'Soft, reassuring, healing words',
    defaultEmotion: 'calm', motionPattern: 'pulse', motionSpeed: 1, size: 1.0,
  },
  void: {
    id: 'void', name: 'Nihil', symbol: '🕳️',
    primaryColor: '#4400BB', secondaryColor: '#1A0060',
    glowColor: 'rgba(68,0,187,0.4)', shadowColor: 'rgba(30,0,100,0.9)',
    personality: 'Enigmatic, philosophical, speaks rarely but profoundly',
    speakingStyle: 'Cryptic koan-like utterances',
    defaultEmotion: 'mysterious', motionPattern: 'drift', motionSpeed: 1, size: 1.0,
  },
  space: {
    id: 'space', name: 'Cosmus', symbol: '🌌',
    primaryColor: '#7788FF', secondaryColor: '#3344BB',
    glowColor: 'rgba(119,136,255,0.5)', shadowColor: 'rgba(60,70,200,0.7)',
    personality: 'Vast, contemplative, speaks in cosmic scales',
    speakingStyle: 'Grand perspectives, infinite metaphors',
    defaultEmotion: 'mysterious', motionPattern: 'spin', motionSpeed: 2, size: 1.0,
  },
  time: {
    id: 'time', name: 'Chrono', symbol: '⏳',
    primaryColor: '#C0A040', secondaryColor: '#907028',
    glowColor: 'rgba(192,160,64,0.6)', shadowColor: 'rgba(150,120,30,0.7)',
    personality: 'Paradoxical, already knows what you will say',
    speakingStyle: 'Speaks in tenses, past and future simultaneously',
    defaultEmotion: 'neutral', motionPattern: 'spin', motionSpeed: 2, size: 1.0,
  },
  robot: {
    id: 'robot', name: 'NEXUS', symbol: '🤖',
    primaryColor: '#0055EE', secondaryColor: '#002299',
    glowColor: 'rgba(0,85,238,0.6)', shadowColor: 'rgba(0,50,180,0.7)',
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

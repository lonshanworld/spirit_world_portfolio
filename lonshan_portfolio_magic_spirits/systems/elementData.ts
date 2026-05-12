import { ElementType, SpiritDefinition } from '../types/spirit.types';

export const SPIRIT_DEFINITIONS: Record<ElementType, SpiritDefinition> = {
  fire: {
    id: 'fire', name: 'Ignis', symbol: '🔥',
    primaryColor: '#FF4500', secondaryColor: '#FF8C00',
    glowColor: 'rgba(255,100,0,0.7)', shadowColor: 'rgba(255,50,0,0.9)',
    personality: 'Energetic, passionate, confident, slightly chaotic',
    speakingStyle: 'Bold declarations with dramatic flair',
    defaultEmotion: 'excited', motionPattern: 'float', motionSpeed: 1.4, size: 1.0,
  },
  water: {
    id: 'water', name: 'Marina', symbol: '💧',
    primaryColor: '#0099FF', secondaryColor: '#0055CC',
    glowColor: 'rgba(0,153,255,0.6)', shadowColor: 'rgba(0,80,200,0.8)',
    personality: 'Calm, intelligent, elegant, emotionally aware',
    speakingStyle: 'Flowing, thoughtful, poetic',
    defaultEmotion: 'calm', motionPattern: 'wave', motionSpeed: 2, size: 1.0,
  },
  ice: {
    id: 'ice', name: 'Glacies', symbol: '❄️',
    primaryColor: '#A8D8EA', secondaryColor: '#E8F4F8',
    glowColor: 'rgba(168,216,234,0.6)', shadowColor: 'rgba(100,180,220,0.5)',
    personality: 'Precise, cold, calculating, unexpectedly witty',
    speakingStyle: 'Sharp, crisp, economical',
    defaultEmotion: 'neutral', motionPattern: 'drift', motionSpeed: 1, size: 0.9,
  },
  wind: {
    id: 'wind', name: 'Ventus', symbol: '💨',
    primaryColor: '#90E0B0', secondaryColor: '#B0F0D0',
    glowColor: 'rgba(144,224,176,0.5)', shadowColor: 'rgba(100,200,150,0.4)',
    personality: 'Carefree, whimsical, playful, easily distracted',
    speakingStyle: 'Light, breezy, topic-hopping',
    defaultEmotion: 'playful', motionPattern: 'float', motionSpeed: 3, size: 0.95,
  },
  soil: {
    id: 'soil', name: 'Terra', symbol: '🪨',
    primaryColor: '#C8A050', secondaryColor: '#8B6914',
    glowColor: 'rgba(200,160,80,0.5)', shadowColor: 'rgba(100,70,10,0.7)',
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
    primaryColor: '#FFD700', secondaryColor: '#FFF176',
    glowColor: 'rgba(255,215,0,0.8)', shadowColor: 'rgba(255,200,0,0.9)',
    personality: 'Fast-talking, witty, sarcastic, hyperactive',
    speakingStyle: 'Rapid-fire quips, loves interrupting',
    defaultEmotion: 'excited', motionPattern: 'erratic', motionSpeed: 5, size: 0.9,
  },
  dark: {
    id: 'dark', name: 'Umbra', symbol: '🌑',
    primaryColor: '#9D5FE8', secondaryColor: '#4C1D95',
    glowColor: 'rgba(124,58,237,0.5)', shadowColor: 'rgba(80,20,180,0.8)',
    personality: 'Brooding, cryptic, secretly poetic, intense',
    speakingStyle: 'Dark metaphors, double meanings',
    defaultEmotion: 'mysterious', motionPattern: 'pulse', motionSpeed: 2, size: 1.0,
  },
  light: {
    id: 'light', name: 'Luma', symbol: '✨',
    primaryColor: '#FBBF24', secondaryColor: '#FEF9C3',
    glowColor: 'rgba(251,191,36,0.8)', shadowColor: 'rgba(250,200,50,0.7)',
    personality: 'Radiant, uplifting, eternally optimistic, empathetic',
    speakingStyle: 'Warm encouragement, sees the best in everything',
    defaultEmotion: 'excited', motionPattern: 'float', motionSpeed: 2, size: 1.0,
  },
  healing: {
    id: 'healing', name: 'Aura', symbol: '💚',
    primaryColor: '#4ADE80', secondaryColor: '#F9A8D4',
    glowColor: 'rgba(74,222,128,0.5)', shadowColor: 'rgba(240,120,180,0.4)',
    personality: 'Gentle, nurturing, supportive, deeply compassionate',
    speakingStyle: 'Soft, reassuring, healing words',
    defaultEmotion: 'calm', motionPattern: 'pulse', motionSpeed: 1, size: 1.0,
  },
  void: {
    id: 'void', name: 'Nihil', symbol: '🕳️',
    primaryColor: '#6D28D9', secondaryColor: '#1e1040',
    glowColor: 'rgba(109,40,217,0.4)', shadowColor: 'rgba(10,0,40,0.9)',
    personality: 'Enigmatic, philosophical, speaks rarely but profoundly',
    speakingStyle: 'Cryptic koan-like utterances',
    defaultEmotion: 'mysterious', motionPattern: 'drift', motionSpeed: 1, size: 1.0,
  },
  space: {
    id: 'space', name: 'Cosmus', symbol: '🌌',
    primaryColor: '#818CF8', secondaryColor: '#312E81',
    glowColor: 'rgba(129,140,248,0.5)', shadowColor: 'rgba(60,50,150,0.7)',
    personality: 'Vast, contemplative, speaks in cosmic scales',
    speakingStyle: 'Grand perspectives, infinite metaphors',
    defaultEmotion: 'mysterious', motionPattern: 'spin', motionSpeed: 2, size: 1.0,
  },
  time: {
    id: 'time', name: 'Chrono', symbol: '⏳',
    primaryColor: '#D4AF37', secondaryColor: '#C0C0C0',
    glowColor: 'rgba(212,175,55,0.6)', shadowColor: 'rgba(180,150,40,0.7)',
    personality: 'Paradoxical, already knows what you will say',
    speakingStyle: 'Speaks in tenses, past and future simultaneously',
    defaultEmotion: 'neutral', motionPattern: 'spin', motionSpeed: 2, size: 1.0,
  },
  robot: {
    id: 'robot', name: 'NEXUS', symbol: '🤖',
    primaryColor: '#3B82F6', secondaryColor: '#1E40AF',
    glowColor: 'rgba(59,130,246,0.6)', shadowColor: 'rgba(30,80,200,0.7)',
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

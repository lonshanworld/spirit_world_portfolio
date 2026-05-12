import { IDialogueLine, IDialogueSequence, ElementType } from '../spirits/interfaces/spirit.interface';

// ──────────────────────────────────────────────────────────────────
// IDLE BANTER SEQUENCES
// ──────────────────────────────────────────────────────────────────

export const IDLE_SEQUENCES: IDialogueSequence[] = [
  {
    id: 'idle_debate_projects',
    trigger: 'idle',
    cooldownMs: 30000,
    lines: [
      { spiritId: 'fire', text: 'The AI system he built burned brighter than anything I have seen.', delay: 0, emotion: 'excited' },
      { spiritId: 'water', text: 'You always say that. The fullstack architecture was equally impressive.', delay: 3500, emotion: 'calm' },
      { spiritId: 'lightning', text: 'Actually the WebSocket gateway had 12ms average latency. Technically superior.', delay: 6500, emotion: 'excited' },
      { spiritId: 'void', text: 'All things return to silence.', delay: 9500, emotion: 'mysterious' },
      { spiritId: 'lightning', text: '...okay that was deep. I hate when you do that.', delay: 12000, emotion: 'playful' },
    ],
  },
  {
    id: 'idle_philosophy',
    trigger: 'idle',
    cooldownMs: 45000,
    lines: [
      { spiritId: 'void', text: 'We are patterns of thought. Digital dreams given form.', delay: 0, emotion: 'mysterious' },
      { spiritId: 'space', text: 'Like stars across billions of light years — each line of code a constellation.', delay: 4000, emotion: 'mysterious' },
      { spiritId: 'time', text: 'I remember when he wrote the first line. I always will.', delay: 7500, emotion: 'calm' },
      { spiritId: 'fire', text: 'You are all so dramatic. He just built a really cool portfolio.', delay: 10500, emotion: 'playful' },
    ],
  },
  {
    id: 'idle_tech_debate',
    trigger: 'idle',
    cooldownMs: 40000,
    lines: [
      { spiritId: 'robot', text: 'Analysis complete. This developer has demonstrated proficiency in 12 distinct technology domains.', delay: 0, emotion: 'neutral' },
      { spiritId: 'lightning', text: 'TWELVE? That is insane. I can barely count to three.', delay: 3500, emotion: 'excited' },
      { spiritId: 'robot', text: 'You are an elemental force. Counting is not your primary function.', delay: 6500, emotion: 'neutral' },
      { spiritId: 'water', text: 'He poured knowledge like water. Steady, patient, deep.', delay: 9000, emotion: 'calm' },
      { spiritId: 'lightning', text: 'Okay NOW who is dramatic.', delay: 11500, emotion: 'playful' },
    ],
  },
  {
    id: 'idle_healing_fire',
    trigger: 'idle',
    cooldownMs: 35000,
    lines: [
      { spiritId: 'healing', text: 'This world he built feels... peaceful. Like a garden.', delay: 0, emotion: 'calm' },
      { spiritId: 'trees', text: 'We have taken root here. We are real because he believed we could be.', delay: 4000, emotion: 'calm' },
      { spiritId: 'fire', text: 'Real or not, I have never burned so beautifully.', delay: 7500, emotion: 'excited' },
      { spiritId: 'ice', text: 'Statistically speaking, none of us are real.', delay: 10000, emotion: 'neutral' },
      { spiritId: 'healing', text: 'Statistically speaking, you need a hug.', delay: 12500, emotion: 'playful' },
    ],
  },
  {
    id: 'idle_robot_glitch',
    trigger: 'idle',
    cooldownMs: 50000,
    lines: [
      { spiritId: 'robot', text: 'Curious. My emotion subroutine triggered without a clear cause.', delay: 0, emotion: 'neutral' },
      { spiritId: 'water', text: 'What did it feel like?', delay: 3000, emotion: 'calm' },
      { spiritId: 'robot', text: '...Like standing in sunlight. I do not have a better benchmark.', delay: 5500, emotion: 'neutral' },
      { spiritId: 'light', text: 'That is the most beautiful thing you have ever said.', delay: 8500, emotion: 'excited' },
      { spiritId: 'robot', text: 'I am logging this conversation for further analysis.', delay: 11000, emotion: 'neutral' },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────
// USER ADDRESS SEQUENCES
// ──────────────────────────────────────────────────────────────────

export const USER_GREETING_SEQUENCES: IDialogueSequence[] = [
  {
    id: 'greeting_fire',
    trigger: 'interaction',
    lines: [
      { spiritId: 'fire', text: 'Hey, traveler. You found our world.', delay: 0, emotion: 'excited', targetUser: true },
      { spiritId: 'water', text: 'Welcome. We have been waiting for you.', delay: 3000, emotion: 'calm', targetUser: true },
    ],
  },
  {
    id: 'greeting_mysterious',
    trigger: 'interaction',
    lines: [
      { spiritId: 'void', text: 'You arrived exactly when you were meant to.', delay: 0, emotion: 'mysterious', targetUser: true },
      { spiritId: 'time', text: 'I know. I always knew you would.', delay: 3000, emotion: 'calm', targetUser: true },
    ],
  },
  {
    id: 'greeting_robot',
    trigger: 'interaction',
    lines: [
      { spiritId: 'robot', text: 'Visitor detected. Running capability assessment... impressive portfolio incoming.', delay: 0, emotion: 'neutral', targetUser: true },
      { spiritId: 'lightning', text: 'What NEXUS means is: hi! You are going to love this!', delay: 3500, emotion: 'excited', targetUser: true },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────
// SECTION-SPECIFIC SEQUENCES
// ──────────────────────────────────────────────────────────────────

export const SECTION_SEQUENCES: IDialogueSequence[] = [
  {
    id: 'section_projects',
    trigger: 'section',
    section: 'projects',
    cooldownMs: 60000,
    lines: [
      { spiritId: 'fire', text: 'These projects. Each one required real fire to build.', delay: 0, emotion: 'excited' },
      { spiritId: 'robot', text: 'Confirmed. Estimated 1,200+ combined hours of development.', delay: 3500, emotion: 'neutral' },
      { spiritId: 'water', text: 'And each one solved a real problem. That is rare.', delay: 6500, emotion: 'calm', targetUser: true },
    ],
  },
  {
    id: 'section_skills',
    trigger: 'section',
    section: 'skills',
    cooldownMs: 60000,
    lines: [
      { spiritId: 'lightning', text: 'OH here we go — the skills section! My favorite!', delay: 0, emotion: 'excited' },
      { spiritId: 'robot', text: 'TypeScript proficiency: exceptional. React architecture: scalable. NestJS: production-grade.', delay: 3000, emotion: 'neutral' },
      { spiritId: 'ice', text: 'He learned each one with precision. Not shortcuts.', delay: 6500, emotion: 'neutral' },
      { spiritId: 'lightning', text: 'Precision! Speed! Both! Hire him!', delay: 9000, emotion: 'excited', targetUser: true },
    ],
  },
  {
    id: 'section_contact',
    trigger: 'section',
    section: 'contact',
    cooldownMs: 60000,
    lines: [
      { spiritId: 'healing', text: 'You made it to the end of the journey. That means something.', delay: 0, emotion: 'calm', targetUser: true },
      { spiritId: 'fire', text: 'Reach out. He will not disappoint you.', delay: 3500, emotion: 'excited', targetUser: true },
      { spiritId: 'water', text: 'Good things begin with a single message.', delay: 6500, emotion: 'calm', targetUser: true },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────
// SPIRIT CLICK RESPONSES
// ──────────────────────────────────────────────────────────────────

export const SPIRIT_CLICK_RESPONSES: Record<ElementType, IDialogueLine[]> = {
  fire: [
    { spiritId: 'fire', text: 'You felt my warmth. Smart choice.', delay: 0, emotion: 'excited', targetUser: true },
  ],
  water: [
    { spiritId: 'water', text: 'Still waters run deep. Dive in.', delay: 0, emotion: 'calm', targetUser: true },
  ],
  ice: [
    { spiritId: 'ice', text: 'Interesting. You chose precision.', delay: 0, emotion: 'neutral', targetUser: true },
  ],
  wind: [
    { spiritId: 'wind', text: 'Wheee! The world looks so different from up here!', delay: 0, emotion: 'playful', targetUser: true },
  ],
  soil: [
    { spiritId: 'soil', text: 'The oldest truths are found in the earth.', delay: 0, emotion: 'calm', targetUser: true },
  ],
  trees: [
    { spiritId: 'trees', text: 'Every great project begins with roots.', delay: 0, emotion: 'calm', targetUser: true },
  ],
  lightning: [
    { spiritId: 'lightning', text: 'ZAP! Did you see that?! 300,000 km/s! That is ME!', delay: 0, emotion: 'excited', targetUser: true },
  ],
  dark: [
    { spiritId: 'dark', text: 'In the dark, you find what you truly seek.', delay: 0, emotion: 'mysterious', targetUser: true },
  ],
  light: [
    { spiritId: 'light', text: 'You shine just by being curious.', delay: 0, emotion: 'excited', targetUser: true },
  ],
  healing: [
    { spiritId: 'healing', text: 'Whatever brought you here — you are welcome.', delay: 0, emotion: 'calm', targetUser: true },
  ],
  void: [
    { spiritId: 'void', text: '...', delay: 0, emotion: 'mysterious', targetUser: true },
  ],
  space: [
    { spiritId: 'space', text: 'You are made of the same stardust as everything that matters.', delay: 0, emotion: 'mysterious', targetUser: true },
  ],
  time: [
    { spiritId: 'time', text: 'This moment was always going to happen.', delay: 0, emotion: 'calm', targetUser: true },
  ],
  robot: [
    { spiritId: 'robot', text: 'Interaction logged. Curiosity coefficient: high. Recommendation: explore further.', delay: 0, emotion: 'neutral', targetUser: true },
  ],
};

// ──────────────────────────────────────────────────────────────────
// COMBINATION RESPONSES
// ──────────────────────────────────────────────────────────────────

export const COMBINATION_RESPONSES: Partial<Record<string, IDialogueLine[]>> = {
  lava: [
    { spiritId: 'fire', text: 'LAVA! We are unstoppable together!', delay: 0, emotion: 'excited' },
    { spiritId: 'soil', text: 'Ancient power. The world was born from this.', delay: 3000, emotion: 'mysterious' },
  ],
  frost: [
    { spiritId: 'water', text: 'Something beautiful happens when we still ourselves.', delay: 0, emotion: 'calm' },
    { spiritId: 'ice', text: 'Crystalline. Perfect. Inevitable.', delay: 3000, emotion: 'neutral' },
  ],
  eclipse: [
    { spiritId: 'light', text: 'I cannot tell where I end and you begin.', delay: 0, emotion: 'mysterious' },
    { spiritId: 'void', text: 'That is the point.', delay: 3000, emotion: 'mysterious' },
  ],
  storm: [
    { spiritId: 'lightning', text: 'STORM MODE ACTIVATED — nothing can stop us!!', delay: 0, emotion: 'excited' },
    { spiritId: 'wind', text: 'Let us dance across the whole sky!', delay: 2500, emotion: 'playful' },
  ],
  bloom: [
    { spiritId: 'trees', text: 'Life finds a way. Always.', delay: 0, emotion: 'calm' },
    { spiritId: 'water', text: 'Nourished by depth, reaching toward light.', delay: 3000, emotion: 'calm' },
  ],
  cosmos: [
    { spiritId: 'space', text: 'Infinity meets eternity.', delay: 0, emotion: 'mysterious' },
    { spiritId: 'time', text: 'We were always going to find each other.', delay: 3000, emotion: 'mysterious' },
  ],
  cyber: [
    { spiritId: 'robot', text: 'NEXUS-STORM online. Processing at maximum efficiency.', delay: 0, emotion: 'excited' },
    { spiritId: 'lightning', text: 'I make everything faster. Including you!', delay: 3000, emotion: 'excited' },
  ],
  inferno: [
    { spiritId: 'dark', text: 'The darkness was always hungry for fire.', delay: 0, emotion: 'mysterious' },
    { spiritId: 'fire', text: 'And fire burns brighter in the dark.', delay: 3000, emotion: 'excited' },
  ],
  divine: [
    { spiritId: 'healing', text: 'This is what it feels like to be whole.', delay: 0, emotion: 'calm' },
    { spiritId: 'light', text: 'Some things transcend understanding. They just are.', delay: 3500, emotion: 'excited' },
  ],
};

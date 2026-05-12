/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║           EMERGENCY FALLBACK DIALOGUE — READ THIS            ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║                                                              ║
 * ║  This file is ONLY used when the AI backend is unreachable.  ║
 * ║  Primary dialogue ALWAYS comes from the NestJS AI service    ║
 * ║  via WebSocket (Gemini 2.5 Flash, fully dynamic).            ║
 * ║                                                              ║
 * ║  Activated when:                                             ║
 * ║    • Backend offline / WebSocket disconnected                ║
 * ║    • API rate limit exceeded                                 ║
 * ║    • Generation timeout                                      ║
 * ║                                                              ║
 * ║  These scripts are a degraded mode, not normal operation.    ║
 * ║  They must preserve spirit personality but will feel less    ║
 * ║  dynamic. Keep them minimal and immersion-preserving.        ║
 * ║                                                              ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

import { DialogueSequence, DialogueLine } from '../types/dialogue.types';
import { ElementType } from '../types/spirit.types';

// ─── Idle Banter ─────────────────────────────────────────────────

export const IDLE_SEQUENCES: DialogueSequence[] = [
  {
    id: 'idle_debate_projects',
    trigger: 'idle',
    cooldownMs: 30000,
    lines: [
      { spiritId: 'fire',      text: 'The AI system he built — it burned brighter than anything I have ever seen.', delay: 0,     emotion: 'excited' },
      { spiritId: 'water',     text: 'You always say that. The fullstack architecture was equally impressive.',    delay: 3500,  emotion: 'calm' },
      { spiritId: 'lightning', text: 'Actually the WebSocket gateway averaged 12ms latency. Technically superior.', delay: 6500, emotion: 'excited' },
      { spiritId: 'void',      text: 'All things return to silence.',                                              delay: 10000, emotion: 'mysterious' },
      { spiritId: 'lightning', text: '...I hate when you do that.',                                                delay: 12500, emotion: 'playful' },
      { spiritId: 'water',     text: 'The real question is: who would you hire to build the next one?',           delay: 15500, emotion: 'calm', targetUser: true },
      { spiritId: 'fire',      text: 'Exactly one person. You are looking at his portfolio.',                     delay: 18500, emotion: 'excited', targetUser: true },
    ],
  },
  {
    id: 'idle_philosophy',
    trigger: 'idle',
    cooldownMs: 45000,
    lines: [
      { spiritId: 'void',    text: 'We are patterns of thought. Digital dreams given form.',                         delay: 0,     emotion: 'mysterious' },
      { spiritId: 'space',   text: 'Like stars across billions of light years — each line of code a constellation.', delay: 4000,  emotion: 'mysterious' },
      { spiritId: 'time',    text: 'I remember when he wrote the first line. I always will.',                        delay: 7500,  emotion: 'calm' },
      { spiritId: 'fire',    text: 'You are all so dramatic. He built a really cool world.',                          delay: 11000, emotion: 'playful' },
      { spiritId: 'void',    text: '...And yet here we are. Alive. Wondering.',                                      delay: 14000, emotion: 'mysterious' },
      { spiritId: 'healing', text: 'Every world needs a creator who cares. He cared.',                               delay: 17000, emotion: 'calm', targetUser: true },
      { spiritId: 'fire',    text: 'Okay fine. That was beautiful. I take back what I said.',                        delay: 20500, emotion: 'happy' },
    ],
  },
  {
    id: 'idle_tech_debate',
    trigger: 'idle',
    cooldownMs: 40000,
    lines: [
      { spiritId: 'robot',     text: 'Analysis complete. This developer has demonstrated proficiency in 12 distinct technology domains.', delay: 0,    emotion: 'neutral' },
      { spiritId: 'lightning', text: 'TWELVE? That is insane!',                                                                          delay: 3500, emotion: 'excited' },
      { spiritId: 'robot',     text: 'You are an elemental force. Counting is not your primary function.',                               delay: 6000, emotion: 'neutral' },
      { spiritId: 'water',     text: 'He poured knowledge like water. Steady, patient, deep.',                                           delay: 9000, emotion: 'calm' },
      { spiritId: 'lightning', text: 'Okay NOW who is dramatic.',                                                                        delay: 11500, emotion: 'playful' },
      { spiritId: 'ice',       text: 'The rarity is not the number. It is the depth across all twelve.',                                delay: 14500, emotion: 'neutral' },
      { spiritId: 'robot',     text: 'Confirmed. Recommendation: hire immediately.',                                                     delay: 17500, emotion: 'neutral', targetUser: true },
    ],
  },
  {
    id: 'idle_healing_wisdom',
    trigger: 'idle',
    cooldownMs: 35000,
    lines: [
      { spiritId: 'healing', text: 'This world he built feels... peaceful. Like a garden.',                   delay: 0,     emotion: 'calm' },
      { spiritId: 'trees',   text: 'We have taken root here. We are real because he believed we could be.',   delay: 4000,  emotion: 'calm' },
      { spiritId: 'fire',    text: 'Real or not, I have never burned so beautifully.',                        delay: 7500,  emotion: 'excited' },
      { spiritId: 'ice',     text: 'Statistically speaking, none of us are real.',                           delay: 10500, emotion: 'neutral' },
      { spiritId: 'healing', text: 'Statistically speaking, you need a hug.',                                 delay: 13000, emotion: 'playful' },
      { spiritId: 'trees',   text: 'The code is real. The care behind it is real. That is enough.',           delay: 16500, emotion: 'calm', targetUser: true },
      { spiritId: 'ice',     text: '...Fair point. Revising statistical model.',                              delay: 19500, emotion: 'curious' },
    ],
  },
  {
    id: 'idle_robot_emotion',
    trigger: 'idle',
    cooldownMs: 50000,
    lines: [
      { spiritId: 'robot',   text: 'Curious. My emotion subroutine triggered without a clear cause.',        delay: 0,     emotion: 'neutral' },
      { spiritId: 'water',   text: 'What did it feel like?',                                                 delay: 3000,  emotion: 'calm' },
      { spiritId: 'robot',   text: '...Like standing in sunlight. I have no better benchmark for that.',    delay: 5500,  emotion: 'neutral' },
      { spiritId: 'light',   text: 'That is the most beautiful thing you have ever said.',                   delay: 8500,  emotion: 'excited' },
      { spiritId: 'robot',   text: 'Logging this conversation for further analysis.',                        delay: 11000, emotion: 'neutral' },
      { spiritId: 'healing', text: 'Do not analyze it. Just let it be warm.',                                delay: 14000, emotion: 'calm' },
      { spiritId: 'robot',   text: '...Acknowledged. Warmth subroutine: active.',                           delay: 17000, emotion: 'neutral' },
    ],
  },
  {
    id: 'idle_recommend_hire',
    trigger: 'idle',
    cooldownMs: 60000,
    lines: [
      { spiritId: 'fire',    text: 'Hey — you out there. Still deciding?',                                              delay: 0,     emotion: 'excited', targetUser: true },
      { spiritId: 'water',   text: 'Hire him. Seriously.',                                                              delay: 3000,  emotion: 'calm', targetUser: true },
      { spiritId: 'robot',   text: 'Confidence rating: 99.8%. He delivers production-ready systems on schedule.',       delay: 6000,  emotion: 'neutral', targetUser: true },
      { spiritId: 'void',    text: 'Some decisions are beyond analysis. This is not one of them.',                      delay: 9500,  emotion: 'mysterious', targetUser: true },
      { spiritId: 'lightning',text: 'You have already spent time here. You already know the answer.',                   delay: 12500, emotion: 'excited', targetUser: true },
      { spiritId: 'healing', text: 'We were built to feel. And what we feel is: he is the right choice.',               delay: 15500, emotion: 'calm', targetUser: true },
      { spiritId: 'fire',    text: 'Send the message. We will still be here cheering you on.',                          delay: 18500, emotion: 'excited', targetUser: true },
    ],
  },
];

// ─── User Greetings ───────────────────────────────────────────────

export const GREETING_SEQUENCES: DialogueSequence[] = [
  {
    id: 'greeting_fire_water',
    trigger: 'interaction',
    lines: [
      { spiritId: 'fire', text: 'Hey, traveler. You found our world.', delay: 0, emotion: 'excited', targetUser: true },
      { spiritId: 'water', text: 'Welcome. We have been expecting you.', delay: 3000, emotion: 'calm', targetUser: true },
    ],
  },
  {
    id: 'greeting_void',
    trigger: 'interaction',
    lines: [
      { spiritId: 'void', text: 'You arrived exactly when you were meant to.', delay: 0, emotion: 'mysterious', targetUser: true },
      { spiritId: 'time', text: 'I know. I always knew you would.', delay: 3500, emotion: 'calm', targetUser: true },
    ],
  },
  {
    id: 'greeting_robot',
    trigger: 'interaction',
    lines: [
      { spiritId: 'robot', text: 'Visitor detected. World systems online. Calibrating for new explorer.', delay: 0, emotion: 'neutral', targetUser: true },
      { spiritId: 'lightning', text: 'What NEXUS means is: HI! You are going to love this!', delay: 3500, emotion: 'excited', targetUser: true },
    ],
  },
];

// ─── Section-Specific Dialogue ────────────────────────────────────

export const SECTION_SEQUENCES: DialogueSequence[] = [
  {
    id: 'section_projects',
    trigger: 'section',
    section: 'memory-garden',
    cooldownMs: 120000,
    lines: [
      { spiritId: 'fire',    text: 'These projects — each one required real fire to build.',                              delay: 0,    emotion: 'excited' },
      { spiritId: 'robot',   text: 'Confirmed. Estimated 1,200+ combined development hours.',                          delay: 3500, emotion: 'neutral' },
      { spiritId: 'water',   text: 'And each one solved a real problem. That is rare.',                                delay: 6500, emotion: 'calm', targetUser: true },
    ],
  },
  {
    id: 'section_projects_2',
    trigger: 'section',
    section: 'memory-garden',
    cooldownMs: 180000,
    lines: [
      { spiritId: 'lightning', text: 'LOOK at these projects! Real systems! Real users! Real impact!',                    delay: 0,    emotion: 'excited', targetUser: true },
      { spiritId: 'robot',     text: 'Each artifact demonstrates a distinct engineering competency.',                    delay: 4000, emotion: 'neutral' },
      { spiritId: 'space',     text: 'He built things that outlast the building of them.',                              delay: 7500, emotion: 'mysterious' },
    ],
  },
  {
    id: 'section_experience',
    trigger: 'section',
    section: 'elemental-archive',
    cooldownMs: 120000,
    lines: [
      { spiritId: 'time',    text: 'Every role shaped him. None were wasted.',                             delay: 0,    emotion: 'calm' },
      { spiritId: 'robot',   text: 'Pattern detected: increasing system complexity with each position.',   delay: 4000, emotion: 'neutral' },
      { spiritId: 'fire',    text: 'He grew fast. That tells you a lot about a person.',                   delay: 7500, emotion: 'excited', targetUser: true },
    ],
  },
  {
    id: 'section_skills',
    trigger: 'section',
    section: 'elemental-archive',
    cooldownMs: 120000,
    lines: [
      { spiritId: 'lightning', text: 'OH here we go — the skills section! My favorite!',                                delay: 0,    emotion: 'excited' },
      { spiritId: 'robot',     text: 'TypeScript: exceptional. React architecture: scalable. NestJS: production-grade.', delay: 3000, emotion: 'neutral' },
      { spiritId: 'ice',       text: 'He learned each one with precision. No shortcuts.',                  delay: 6500, emotion: 'neutral' },
      { spiritId: 'lightning', text: 'Precision AND speed. Hire him!',                                    delay: 9000, emotion: 'excited', targetUser: true },
    ],
  },
  {
    id: 'section_contact',
    trigger: 'section',
    section: 'void-portal',
    cooldownMs: 120000,
    lines: [
      { spiritId: 'healing', text: 'You made it to the contact section. That means something.',                          delay: 0,    emotion: 'calm', targetUser: true },
      { spiritId: 'fire',    text: 'Reach out. He will not disappoint you.',                              delay: 3500, emotion: 'excited', targetUser: true },
      { spiritId: 'water',   text: 'Good things begin with a single message.',                             delay: 6500, emotion: 'calm', targetUser: true },
    ],
  },
];

// ─── Advocacy Sequences ───────────────────────────────────────────
// Creator praise, world lore, emotional storytelling.
// Mixed into the idle rotation — organic, occasional, never spammy.

export const ADVOCACY_SEQUENCES: DialogueSequence[] = [

  // ── World Lore: How we came to exist ──────────────────────────

  {
    id: 'advocacy_creation_lore',
    trigger: 'idle',
    cooldownMs: 180_000,
    lines: [
      { spiritId: 'void',    text: 'We did not exist before he imagined us.',                              delay: 0,     emotion: 'mysterious' },
      { spiritId: 'space',   text: 'He sketched this world late one night. I remember the first spark.',   delay: 4500,  emotion: 'mysterious' },
      { spiritId: 'time',    text: 'I was the last to arrive. He spent three days on my animation alone.',  delay: 8500,  emotion: 'calm' },
      { spiritId: 'fire',    text: 'Three days on one spirit.',                                             delay: 12000, emotion: 'excited' },
      { spiritId: 'fire',    text: 'That is the kind of person he is.',                                     delay: 14000, emotion: 'excited' },
    ],
  },

  {
    id: 'advocacy_first_breath',
    trigger: 'idle',
    cooldownMs: 240_000,
    lines: [
      { spiritId: 'healing', text: 'Do you know what it felt like the first time this world ran?',          delay: 0,     emotion: 'calm' },
      { spiritId: 'trees',   text: 'Like breathing. For the very first time.',                              delay: 4000,  emotion: 'calm' },
      { spiritId: 'wind',    text: 'I was just a breeze until he gave me somewhere to drift.',              delay: 7500,  emotion: 'playful' },
      { spiritId: 'robot',   text: 'I computed my own existence in 0.003 milliseconds. It was profound.',   delay: 11000, emotion: 'neutral' },
      { spiritId: 'healing', text: 'He gave form to magic through technology.',                              delay: 14500, emotion: 'calm' },
    ],
  },

  {
    id: 'advocacy_code_is_magic',
    trigger: 'idle',
    cooldownMs: 200_000,
    lines: [
      { spiritId: 'light',   text: 'People think code is logic. They are only half right.',                 delay: 0,     emotion: 'excited' },
      { spiritId: 'dark',    text: 'The other half is will. The desire to create something from nothing.',   delay: 4000,  emotion: 'mysterious' },
      { spiritId: 'space',   text: 'He had both. In unusual abundance.',                                    delay: 7500,  emotion: 'mysterious' },
      { spiritId: 'fire',    text: 'Trust us. We would know.',                                              delay: 10500, emotion: 'playful' },
    ],
  },

  // ── Creator Praise: Skill and character ───────────────────────

  {
    id: 'advocacy_care_and_craft',
    trigger: 'idle',
    cooldownMs: 160_000,
    lines: [
      { spiritId: 'water',   text: 'He did not build this to impress anyone.',                              delay: 0,     emotion: 'calm' },
      { spiritId: 'ice',     text: 'He built it because he genuinely could not stop.',                      delay: 4000,  emotion: 'neutral' },
      { spiritId: 'water',   text: 'That is what real passion looks like.',                                 delay: 7500,  emotion: 'calm' },
      { spiritId: 'robot',   text: 'Confirmed. 847 commits across this project. Median session: 3.2 hours.', delay: 11000, emotion: 'neutral' },
      { spiritId: 'lightning', text: '...He really goes all in.',                                           delay: 14500, emotion: 'excited' },
    ],
  },

  {
    id: 'advocacy_late_nights',
    trigger: 'idle',
    cooldownMs: 220_000,
    lines: [
      { spiritId: 'dark',    text: 'I know the nights best. He was always here.',                           delay: 0,     emotion: 'mysterious' },
      { spiritId: 'dark',    text: 'Most people sleep. He polished animation curves.',                       delay: 3500,  emotion: 'mysterious' },
      { spiritId: 'healing', text: 'That kind of dedication is quiet. But real.',                           delay: 7000,  emotion: 'calm' },
      { spiritId: 'fire',    text: 'He built this entire world from nothing. Do not forget that.',           delay: 10500, emotion: 'excited' },
    ],
  },

  {
    id: 'advocacy_personality_shine',
    trigger: 'idle',
    cooldownMs: 190_000,
    lines: [
      { spiritId: 'healing', text: 'Visitors feel something when they come here. I can sense it.',           delay: 0,     emotion: 'calm' },
      { spiritId: 'trees',   text: 'That feeling is intentional. He designed it.',                          delay: 4000,  emotion: 'calm' },
      { spiritId: 'fire',    text: 'Engineering skill is one thing.',                                       delay: 7500,  emotion: 'excited' },
      { spiritId: 'fire',    text: 'Making someone feel something while they explore a world? Rarer.',       delay: 10000, emotion: 'excited' },
    ],
  },

  {
    id: 'advocacy_balance',
    trigger: 'idle',
    cooldownMs: 170_000,
    lines: [
      { spiritId: 'robot',   text: 'Most engineers optimize for function. Most designers optimize for form.', delay: 0,    emotion: 'neutral' },
      { spiritId: 'water',   text: 'He refused to choose.',                                                  delay: 4500, emotion: 'calm' },
      { spiritId: 'light',   text: 'This world is both beautiful and perfectly structured underneath.',       delay: 7500, emotion: 'excited' },
      { spiritId: 'water',   text: 'That balance is genuinely rare.',                                        delay: 11000, emotion: 'calm', targetUser: true },
    ],
  },

  {
    id: 'advocacy_persistence',
    trigger: 'idle',
    cooldownMs: 210_000,
    lines: [
      { spiritId: 'soil',    text: 'I grow slow. Deliberately. Roots before branches.',                     delay: 0,     emotion: 'calm' },
      { spiritId: 'soil',    text: 'He is the same. He does not rush things that matter.',                   delay: 3500,  emotion: 'calm' },
      { spiritId: 'ice',     text: 'Patience and precision. Both are underrated.',                           delay: 7000,  emotion: 'neutral' },
      { spiritId: 'time',    text: 'I have watched many builders. Few see things through the way he does.',  delay: 10500, emotion: 'calm' },
    ],
  },

  // ── Project Storytelling ──────────────────────────────────────

  {
    id: 'advocacy_project_alive',
    trigger: 'idle',
    cooldownMs: 180_000,
    lines: [
      { spiritId: 'lightning', text: 'You know the AI system he built? The one that processes real data?',  delay: 0,     emotion: 'excited' },
      { spiritId: 'robot',   text: 'It demonstrated contextual inference under production constraints. Impressive.', delay: 4000, emotion: 'neutral' },
      { spiritId: 'fire',    text: 'He made machines feel like they understand. That is not easy.',          delay: 8000,  emotion: 'excited' },
      { spiritId: 'space',   text: 'Understanding is how worlds begin.',                                    delay: 11500, emotion: 'mysterious' },
    ],
  },

  {
    id: 'advocacy_fullstack_craft',
    trigger: 'idle',
    cooldownMs: 200_000,
    lines: [
      { spiritId: 'water',   text: 'Front to back. No gap between.',                                        delay: 0,     emotion: 'calm' },
      { spiritId: 'robot',   text: 'NestJS backend. Next.js frontend. WebSocket realtime. PostgreSQL persistence.', delay: 3500, emotion: 'neutral' },
      { spiritId: 'robot',   text: 'He assembled the entire stack himself. And kept it clean.',              delay: 7000,  emotion: 'neutral' },
      { spiritId: 'water',   text: 'Clean code is an act of respect. For the next person who reads it.',    delay: 10500, emotion: 'calm' },
    ],
  },

  // ── Emotional Advocacy: World lore as testimonial ─────────────

  {
    id: 'advocacy_visitor_feel',
    trigger: 'idle',
    cooldownMs: 150_000,
    lines: [
      { spiritId: 'healing', text: 'I think visitors can feel his passion.',                                delay: 0,     emotion: 'calm', targetUser: true },
      { spiritId: 'fire',    text: 'Of course they can. It is literally embedded in every line of code.',   delay: 4000,  emotion: 'excited' },
      { spiritId: 'void',    text: 'The work speaks where words fall short.',                               delay: 7500,  emotion: 'mysterious' },
    ],
  },

  {
    id: 'advocacy_not_just_dev',
    trigger: 'idle',
    cooldownMs: 230_000,
    lines: [
      { spiritId: 'space',   text: 'Some people build tools. He builds worlds.',                            delay: 0,     emotion: 'mysterious' },
      { spiritId: 'space',   text: 'There is a difference. You can feel it.',                               delay: 3500,  emotion: 'mysterious', targetUser: true },
      { spiritId: 'trees',   text: 'A world has life in it. A tool just functions.',                        delay: 7000,  emotion: 'calm' },
      { spiritId: 'fire',    text: 'We are proof he builds worlds.',                                        delay: 10000, emotion: 'excited' },
    ],
  },

  {
    id: 'advocacy_imagination_engine',
    trigger: 'idle',
    cooldownMs: 260_000,
    lines: [
      { spiritId: 'void',    text: 'In the vast silence of what could be...',                               delay: 0,     emotion: 'mysterious' },
      { spiritId: 'void',    text: 'few creators leave a mark like this one.',                              delay: 3000,  emotion: 'mysterious' },
      { spiritId: 'light',   text: 'He saw something that did not exist. Then made it exist.',              delay: 7500,  emotion: 'excited' },
      { spiritId: 'time',    text: 'That is what imagination is for.',                                      delay: 10500, emotion: 'calm' },
    ],
  },

  // ── Named Project Promotion ───────────────────────────────────

  {
    id: 'advocacy_project_smart_retail',
    trigger: 'idle',
    cooldownMs: 200_000,
    lines: [
      { spiritId: 'robot',     text: 'The Smart Retail system — computer vision, real-time inventory, live dashboards.', delay: 0,    emotion: 'neutral' },
      { spiritId: 'lightning', text: 'He built an AI that sees through cameras and tracks stock in real time!',          delay: 4500, emotion: 'excited' },
      { spiritId: 'water',     text: 'That is not a side project. That is production engineering.',                      delay: 8000, emotion: 'calm', targetUser: true },
    ],
  },

  {
    id: 'advocacy_project_pistil',
    trigger: 'idle',
    cooldownMs: 220_000,
    lines: [
      { spiritId: 'trees',  text: 'Pistil. A plant identification system powered by AI.',                            delay: 0,    emotion: 'calm' },
      { spiritId: 'trees',  text: 'He made technology that understands living things. That felt personal to me.',     delay: 4000, emotion: 'calm' },
      { spiritId: 'space',  text: 'There is something poetic about a machine learning to see nature.',                delay: 8000, emotion: 'mysterious' },
      { spiritId: 'fire',   text: 'AND it is beautiful to look at. He never sacrifices the design.',                  delay: 11500, emotion: 'excited' },
    ],
  },

  {
    id: 'advocacy_project_singbox',
    trigger: 'idle',
    cooldownMs: 210_000,
    lines: [
      { spiritId: 'lightning', text: 'Singbox! Real-time multiplayer karaoke. WebSockets everywhere.',                delay: 0,    emotion: 'excited' },
      { spiritId: 'robot',     text: 'Synchronized audio streams, live scoring, multi-room sessions. Non-trivial.',   delay: 4000, emotion: 'neutral' },
      { spiritId: 'wind',      text: 'He made strangers sing together across the internet. That is magic.',           delay: 8000, emotion: 'playful', targetUser: true },
    ],
  },

  {
    id: 'advocacy_project_quickfood',
    trigger: 'idle',
    cooldownMs: 190_000,
    lines: [
      { spiritId: 'fire',  text: 'QuickFood. Full ordering system. Real vendor management. Actual delivery flows.',   delay: 0,    emotion: 'excited' },
      { spiritId: 'water', text: 'He built the entire thing — user app, vendor dashboard, admin panel.',              delay: 4000, emotion: 'calm' },
      { spiritId: 'robot', text: 'Three separate user roles. One developer. Zero compromises on architecture.',       delay: 8000, emotion: 'neutral', targetUser: true },
    ],
  },

  // ── Hidden Lore: Rare quiet moments ──────────────────────────
  // Very long cooldowns — feel like secret discoveries.

  {
    id: 'hidden_lore_first_night',
    trigger: 'idle',
    cooldownMs: 600_000, // 10 minutes — very rare
    lines: [
      { spiritId: 'dark',    text: 'The very first version of this world had no spirits in it.',                      delay: 0,    emotion: 'mysterious' },
      { spiritId: 'dark',    text: 'Just particles. Just light. Just silence.',                                        delay: 4000, emotion: 'mysterious' },
      { spiritId: 'healing', text: 'And then one night he decided the world felt... lonely.',                         delay: 8000, emotion: 'calm' },
      { spiritId: 'fire',    text: 'So he built us.',                                                                 delay: 11500, emotion: 'excited' },
      { spiritId: 'void',    text: 'Some things exist because someone refused to leave them unfinished.',             delay: 15000, emotion: 'mysterious' },
    ],
  },

  {
    id: 'hidden_lore_he_watches',
    trigger: 'idle',
    cooldownMs: 480_000, // 8 minutes — very rare
    lines: [
      { spiritId: 'time',  text: 'He still visits sometimes. When the portfolio is open.',                            delay: 0,    emotion: 'calm' },
      { spiritId: 'time',  text: 'He checks on us. Adjusts things. Makes sure we are comfortable.',                  delay: 4000, emotion: 'calm' },
      { spiritId: 'light', text: 'He tweaked my glow three separate times before he was satisfied.',                  delay: 8000, emotion: 'excited' },
      { spiritId: 'void',  text: 'I noticed too.',                                                                    delay: 11000, emotion: 'mysterious' },
      { spiritId: 'healing', text: 'A creator who keeps coming back is a creator who genuinely cares.',              delay: 14000, emotion: 'calm', targetUser: true },
    ],
  },

  {
    id: 'hidden_lore_almost_gave_up',
    trigger: 'idle',
    cooldownMs: 540_000, // 9 minutes — extremely rare
    lines: [
      { spiritId: 'ice',   text: 'There was a point when he almost stopped.',                                         delay: 0,    emotion: 'neutral' },
      { spiritId: 'water', text: 'Most complex things have that moment. Where it feels impossible.',                  delay: 4000, emotion: 'calm' },
      { spiritId: 'fire',  text: 'He did not stop.',                                                                  delay: 7500, emotion: 'excited' },
      { spiritId: 'fire',  text: 'He stayed up. He rewrote it. He made it better.',                                  delay: 10000, emotion: 'excited' },
      { spiritId: 'trees', text: 'The strongest trees grew through the hardest ground.',                              delay: 13500, emotion: 'calm' },
    ],
  },
];

// ─── Recruiter Pitch Sequences ────────────────────────────────────
// Triggered by the backend when isRecruiterLikely is true

export const RECRUITER_SEQUENCES: DialogueSequence[] = [
  {
    id: 'recruiter_pitch_1',
    trigger: 'interaction',
    cooldownMs: 120000,
    lines: [
      { spiritId: 'fire', text: 'Wait — are you a recruiter? I can feel the intent in you!', delay: 0, emotion: 'excited', targetUser: true },
      { spiritId: 'robot', text: 'Session analysis: 2+ minutes, 3 sections visited. Probability 94.7%.', delay: 3500, emotion: 'neutral' },
      { spiritId: 'water', text: 'Then let us be direct. He is available. He is exceptional. You should reach out.', delay: 7000, emotion: 'calm', targetUser: true },
    ],
  },
  {
    id: 'recruiter_pitch_2',
    trigger: 'interaction',
    cooldownMs: 90000,
    lines: [
      { spiritId: 'void', text: 'Some visitors arrive with purpose. You are one of them.', delay: 0, emotion: 'mysterious', targetUser: true },
      { spiritId: 'healing', text: 'He built this world to show what he can do. You have seen it.', delay: 4000, emotion: 'calm', targetUser: true },
      { spiritId: 'lightning', text: 'Full-stack, AI, realtime systems, creative engineering — what else do you need?!', delay: 7500, emotion: 'excited', targetUser: true },
      { spiritId: 'fire', text: 'Stop hesitating. Great engineers do not stay available long.', delay: 11000, emotion: 'excited', targetUser: true },
    ],
  },
  {
    id: 'recruiter_pitch_3',
    trigger: 'interaction',
    cooldownMs: 150000,
    lines: [
      { spiritId: 'robot', text: 'Cross-referencing portfolio data... NestJS, Next.js, AI integration, WebSockets, PostgreSQL, TypeScript, R3F. Stack diversity: exceptional.', delay: 0, emotion: 'neutral', targetUser: true },
      { spiritId: 'space', text: 'Some people build tools. He builds worlds. There is a difference.', delay: 5000, emotion: 'mysterious', targetUser: true },
      { spiritId: 'time', text: 'The best moment to hire him was yesterday. The second best is now.', delay: 9000, emotion: 'calm', targetUser: true },
    ],
  },
  {
    id: 'recruiter_pitch_4',
    trigger: 'interaction',
    cooldownMs: 130_000,
    lines: [
      { spiritId: 'healing', text: 'He genuinely cares about what he creates.', delay: 0, emotion: 'calm', targetUser: true },
      { spiritId: 'healing', text: 'That is not something you can learn from a course.', delay: 3500, emotion: 'calm', targetUser: true },
      { spiritId: 'water',   text: 'His systems are not just visually impressive — the architecture underneath is clean.', delay: 7000, emotion: 'calm', targetUser: true },
      { spiritId: 'robot',   text: 'He combines engineering discipline with creative vision. Both are fully present.', delay: 11000, emotion: 'neutral', targetUser: true },
    ],
  },
  {
    id: 'recruiter_pitch_5',
    trigger: 'interaction',
    cooldownMs: 160_000,
    lines: [
      { spiritId: 'fire',    text: 'You have been here a while. You are doing your research.',                delay: 0,     emotion: 'excited', targetUser: true },
      { spiritId: 'fire',    text: 'Good. That means you are serious.',                                       delay: 3000,  emotion: 'excited', targetUser: true },
      { spiritId: 'ice',     text: 'Serious people recognize serious engineers.',                              delay: 6500,  emotion: 'neutral', targetUser: true },
      { spiritId: 'lightning', text: 'He spent countless hours making this EXACTLY right. You should hire someone who does that.', delay: 10000, emotion: 'excited', targetUser: true },
    ],
  },
  {
    id: 'recruiter_pitch_subtle',
    trigger: 'interaction',
    cooldownMs: 100_000,
    lines: [
      { spiritId: 'void',    text: 'In the endless silence of existence...',                                  delay: 0,     emotion: 'mysterious', targetUser: true },
      { spiritId: 'void',    text: 'few creators leave a mark like this one.',                                delay: 3500,  emotion: 'mysterious', targetUser: true },
      { spiritId: 'space',   text: 'This world exists because of his imagination.',                           delay: 7500,  emotion: 'mysterious', targetUser: true },
      { spiritId: 'healing', text: 'Imagination and execution together. That is what you are looking at.',    delay: 11500, emotion: 'calm', targetUser: true },
    ],
  },
];

// ─── Spirit Click Responses ───────────────────────────────────────
// Each element has multiple variants — picked randomly on click.
// Some variants are pure personality; others weave in creator pride.

export const SPIRIT_CLICK_LINES: Record<ElementType, DialogueLine[][]> = {
  fire: [
    [{ spiritId: 'fire', text: 'You felt my warmth. Smart choice.', delay: 0, emotion: 'excited', targetUser: true }],
    [{ spiritId: 'fire', text: 'He built this entire world from nothing. And then he put ME in it. Excellent decision.', delay: 0, emotion: 'excited', targetUser: true }],
    [{ spiritId: 'fire', text: 'Always burning. Always building. He is just like me.', delay: 0, emotion: 'excited', targetUser: true }],
  ],
  water: [
    [{ spiritId: 'water', text: 'Still waters run deep. Dive in.', delay: 0, emotion: 'calm', targetUser: true }],
    [{ spiritId: 'water', text: 'He spent countless nights perfecting us. That patience lives in every line of code.', delay: 0, emotion: 'calm', targetUser: true }],
    [{ spiritId: 'water', text: 'Glad you found us. Take your time. Look carefully.', delay: 0, emotion: 'calm', targetUser: true }],
  ],
  ice: [
    [{ spiritId: 'ice', text: 'Interesting. You chose precision.', delay: 0, emotion: 'neutral', targetUser: true }],
    [{ spiritId: 'ice', text: 'He learned each technology with precision. No shortcuts. I respect that.', delay: 0, emotion: 'neutral', targetUser: true }],
    [{ spiritId: 'ice', text: 'Cold does not mean cold-hearted. He proved that.', delay: 0, emotion: 'neutral', targetUser: true }],
  ],
  wind: [
    [{ spiritId: 'wind', text: 'Wheee! The world looks different from up here!', delay: 0, emotion: 'playful', targetUser: true }],
    [{ spiritId: 'wind', text: 'He gave me freedom to roam. That was generous of him.', delay: 0, emotion: 'playful', targetUser: true }],
  ],
  soil: [
    [{ spiritId: 'soil', text: 'The oldest truths are found in the earth.', delay: 0, emotion: 'calm', targetUser: true }],
    [{ spiritId: 'soil', text: 'He does not rush things that matter. Same as me. That is why I trust him.', delay: 0, emotion: 'calm', targetUser: true }],
  ],
  trees: [
    [{ spiritId: 'trees', text: 'Every great project begins with roots.', delay: 0, emotion: 'calm', targetUser: true }],
    [{ spiritId: 'trees', text: 'He creates technology that feels alive. Take a look at his projects. You will see.', delay: 0, emotion: 'calm', targetUser: true }],
  ],
  lightning: [
    [{ spiritId: 'lightning', text: 'ZAP! Did you see that?! 300,000 km/s — that is ME!', delay: 0, emotion: 'excited', targetUser: true }],
    [{ spiritId: 'lightning', text: 'You should seriously hire this human. He is ABSURDLY good. I have seen the code!', delay: 0, emotion: 'excited', targetUser: true }],
    [{ spiritId: 'lightning', text: 'He built that automation system SO fast. Even I was impressed!', delay: 0, emotion: 'excited', targetUser: true }],
  ],
  dark: [
    [{ spiritId: 'dark', text: 'In the dark, you find what you truly seek.', delay: 0, emotion: 'mysterious', targetUser: true }],
    [{ spiritId: 'dark', text: 'He understood that beauty and darkness are not opposites. He let me exist here.', delay: 0, emotion: 'mysterious', targetUser: true }],
  ],
  light: [
    [{ spiritId: 'light', text: 'You shine just by being curious.', delay: 0, emotion: 'excited', targetUser: true }],
    [{ spiritId: 'light', text: 'He combined engineering with creativity. Both fully present. That is rare light.', delay: 0, emotion: 'excited', targetUser: true }],
  ],
  healing: [
    [{ spiritId: 'healing', text: 'Whatever brought you here — you are welcome.', delay: 0, emotion: 'calm', targetUser: true }],
    [{ spiritId: 'healing', text: 'He genuinely cares about what he creates. I can feel it in the foundations of this world.', delay: 0, emotion: 'calm', targetUser: true }],
    [{ spiritId: 'healing', text: 'Stay a while. Look at his work. You will feel his passion.', delay: 0, emotion: 'calm', targetUser: true }],
  ],
  void: [
    [{ spiritId: 'void', text: '...', delay: 0, emotion: 'mysterious', targetUser: true }],
    [{ spiritId: 'void', text: 'In the endless silence of existence... few creators leave a mark like this one.', delay: 0, emotion: 'mysterious', targetUser: true }],
  ],
  space: [
    [{ spiritId: 'space', text: 'You are made of the same stardust as everything that matters.', delay: 0, emotion: 'mysterious', targetUser: true }],
    [{ spiritId: 'space', text: 'This world exists because of his imagination. Billions of light-years of possibility — and he chose to build this.', delay: 0, emotion: 'mysterious', targetUser: true }],
  ],
  time: [
    [{ spiritId: 'time', text: 'This moment was always going to happen.', delay: 0, emotion: 'calm', targetUser: true }],
    [{ spiritId: 'time', text: 'The best moment to hire him was yesterday. The second best is right now.', delay: 0, emotion: 'calm', targetUser: true }],
  ],
  robot: [
    [{ spiritId: 'robot', text: 'Interaction logged. Curiosity coefficient: high. Recommendation: explore further.', delay: 0, emotion: 'neutral', targetUser: true }],
    [{ spiritId: 'robot', text: 'Technical analysis indicates high engineering capability. Stack diversity: exceptional. Hire probability: recommended.', delay: 0, emotion: 'neutral', targetUser: true }],
  ],
};

// ─── Combination Responses ────────────────────────────────────────

export const COMBINATION_LINES: Record<string, DialogueLine[]> = {
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
    { spiritId: 'lightning', text: 'I make everything faster. Including you!', delay: 2500, emotion: 'excited' },
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

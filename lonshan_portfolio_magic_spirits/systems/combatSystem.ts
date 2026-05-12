/**
 * combatSystem.ts
 *
 * Data layer for the spirit playful-combat system.
 * No animation logic here — pure data: spells, matchups, dialogue, outcomes.
 *
 * Design tone: playful, magical, cartoon-like. Never violent or disturbing.
 */

import { ElementType } from '../types/spirit.types';

// ─── Combat Style ─────────────────────────────────────────────────

export type CombatStyle =
  | 'aggressive'   // fire, lightning — attack first, emotional
  | 'defensive'    // water, healing, ice — counter-based, strategic
  | 'chaotic'      // void, lightning — unpredictable, wildcard
  | 'tactical'     // robot, wind — calculated, methodical
  | 'passive'      // soil, trees — reluctant, only responds when provoked
  | 'mysterious';  // dark, space, time — cryptic, delayed reactions

export const COMBAT_STYLE: Record<ElementType, CombatStyle> = {
  fire:      'aggressive',
  water:     'defensive',
  ice:       'defensive',
  wind:      'tactical',
  soil:      'passive',
  trees:     'passive',
  lightning: 'chaotic',
  dark:      'mysterious',
  light:     'aggressive',
  healing:   'defensive',
  void:      'mysterious',
  space:     'mysterious',
  time:      'tactical',
  robot:     'tactical',
};

// ─── Combat Spell ─────────────────────────────────────────────────

export interface CombatSpell {
  name: string;
  /** Primary particle colour for the projectile trail. */
  color: string;
  /** Glow halo colour. */
  glow: string;
  /** Short shape emoji / character shown at impact. */
  impactSymbol: string;
  /** Speed category — affects travel duration. */
  speed: 'fast' | 'medium' | 'slow';
  /** Projectile shape. */
  shape: 'orb' | 'bolt' | 'beam' | 'spiral' | 'scatter';
}

export const ELEMENT_SPELLS: Record<ElementType, CombatSpell> = {
  fire:      { name: 'Ember Burst',      color: '#FF6B35', glow: '#FF4500', impactSymbol: '🔥', speed: 'fast',   shape: 'orb'     },
  water:     { name: 'Tidal Lock',       color: '#4FC3F7', glow: '#0288D1', impactSymbol: '💧', speed: 'medium', shape: 'beam'    },
  ice:       { name: 'Crystal Shard',    color: '#B3E5FC', glow: '#81D4FA', impactSymbol: '❄️', speed: 'fast',   shape: 'scatter' },
  wind:      { name: 'Gust Spiral',      color: '#E0F7FA', glow: '#B2EBF2', impactSymbol: '🌀', speed: 'fast',   shape: 'spiral'  },
  soil:      { name: 'Stone Slam',       color: '#A1887F', glow: '#795548', impactSymbol: '🪨', speed: 'slow',   shape: 'orb'     },
  trees:     { name: 'Root Bind',        color: '#66BB6A', glow: '#388E3C', impactSymbol: '🌿', speed: 'medium', shape: 'beam'    },
  lightning: { name: 'Zap Chain',        color: '#FFFF00', glow: '#FDD835', impactSymbol: '⚡', speed: 'fast',   shape: 'bolt'    },
  dark:      { name: 'Shadow Grasp',     color: '#7B1FA2', glow: '#4A148C', impactSymbol: '🌑', speed: 'medium', shape: 'spiral'  },
  light:     { name: 'Radiant Pulse',    color: '#FFECB3', glow: '#FFF9C4', impactSymbol: '✨', speed: 'fast',   shape: 'orb'     },
  healing:   { name: 'Calm Wave',        color: '#A5D6A7', glow: '#81C784', impactSymbol: '💚', speed: 'slow',   shape: 'beam'    },
  void:      { name: 'Null Tide',        color: '#37474F', glow: '#263238', impactSymbol: '🌀', speed: 'slow',   shape: 'scatter' },
  space:     { name: 'Gravity Well',     color: '#7E57C2', glow: '#5E35B1', impactSymbol: '🌌', speed: 'medium', shape: 'spiral'  },
  time:      { name: 'Chrono Pulse',     color: '#80DEEA', glow: '#4DD0E1', impactSymbol: '⏳', speed: 'medium', shape: 'orb'     },
  robot:     { name: 'Laser Grid',       color: '#40C4FF', glow: '#00B0FF', impactSymbol: '🤖', speed: 'fast',   shape: 'bolt'    },
};

// ─── Collision Reactions ──────────────────────────────────────────
// When two spell-types collide mid-air, show a special effect.

export interface CollisionReaction {
  name: string;
  color: string;
  particleSymbol: string;
  description: string;
}

type MatchupKey = string; // e.g. "fire-water"

function makeKey(a: ElementType, b: ElementType): MatchupKey {
  return [a, b].sort().join('-');
}

export const COLLISION_REACTIONS: Record<MatchupKey, CollisionReaction> = {
  [makeKey('fire', 'water')]:     { name: 'Steam Burst',       color: '#B2EBF2', particleSymbol: '💨', description: 'The flames hiss and turn to rolling steam!' },
  [makeKey('fire', 'ice')]:       { name: 'Flash Melt',        color: '#80DEEA', particleSymbol: '💧', description: 'Ice shatters and melts in a flash of warmth!' },
  [makeKey('fire', 'wind')]:      { name: 'Wildfire Spiral',   color: '#FF7043', particleSymbol: '🌪️', description: 'Wind fans the flames into a roaring spiral!' },
  [makeKey('fire', 'trees')]:     { name: 'Burning Leaves',    color: '#FF8F00', particleSymbol: '🍂', description: 'Embers and autumn leaves swirl together!' },
  [makeKey('lightning', 'water')]:{ name: 'Electric Arc',      color: '#80DEEA', particleSymbol: '⚡', description: 'Electricity crackles across the water surface!' },
  [makeKey('lightning', 'wind')]: { name: 'Thunderstorm',      color: '#B39DDB', particleSymbol: '⛈️', description: 'A miniature storm erupts between them!' },
  [makeKey('light', 'dark')]:     { name: 'Eclipse Flash',     color: '#F5F5F5', particleSymbol: '🌗', description: 'Light and shadow cancel in a blinding flash!' },
  [makeKey('void', 'light')]:     { name: 'Singularity Flare', color: '#EDE7F6', particleSymbol: '🌟', description: 'The void swallows the light... then spits it back!' },
  [makeKey('water', 'ice')]:      { name: 'Frost Wave',        color: '#B3E5FC', particleSymbol: '🧊', description: 'Water crystallises into sparkling frost mid-air!' },
  [makeKey('space', 'time')]:     { name: 'Spacetime Ripple',  color: '#D1C4E9', particleSymbol: '🌀', description: 'Reality briefly bends at the intersection!' },
  [makeKey('soil', 'trees')]:     { name: 'Nature Bloom',      color: '#C8E6C9', particleSymbol: '🌸', description: 'Flowers burst spontaneously from the collision!' },
  [makeKey('robot', 'lightning')]:{ name: 'System Overload',   color: '#40C4FF', particleSymbol: '💥', description: 'The robot sparks and reboots! Processing... 37%' },
};

export function getCollisionReaction(a: ElementType, b: ElementType): CollisionReaction | null {
  return COLLISION_REACTIONS[makeKey(a, b)] ?? null;
}

// ─── Hit Outcomes ────────────────────────────────────────────────
// What happens to a spirit that gets hit — humorous, cartoon-like.

export interface HitOutcome {
  /** Flavour text shown in combat log / speech bubble. */
  description: string;
  /** Tint overlay applied to the spirit briefly. */
  tintColor: string;
  /** How intense the knockback is: 0–1. */
  knockbackStrength: number;
  /** Does it get a dizzy spin? */
  dizzy: boolean;
}

export const HIT_OUTCOMES: Record<ElementType, HitOutcome> = {
  fire:      { description: 'turns briefly smoky and sputtering',  tintColor: '#78909C66', knockbackStrength: 0.7, dizzy: false },
  water:     { description: 'splashes apart and re-gathers',       tintColor: '#4FC3F744', knockbackStrength: 0.5, dizzy: false },
  ice:       { description: 'cracks with a crystalline chime',     tintColor: '#B3E5FC66', knockbackStrength: 0.6, dizzy: true  },
  wind:      { description: 'gets blown dramatically backwards',   tintColor: '#FFFFFF33', knockbackStrength: 1.0, dizzy: false },
  soil:      { description: 'wobbles like a bowl of jelly',        tintColor: '#A1887F44', knockbackStrength: 0.3, dizzy: true  },
  trees:     { description: 'sheds a flurry of leaves',            tintColor: '#66BB6A44', knockbackStrength: 0.4, dizzy: false },
  lightning: { description: 'short-circuits into a brief spasm',   tintColor: '#FFFF0066', knockbackStrength: 0.8, dizzy: true  },
  dark:      { description: 'dissolves into shadows then reforms', tintColor: '#7B1FA244', knockbackStrength: 0.4, dizzy: false },
  light:     { description: 'flickered out briefly like a candle', tintColor: '#FFECB366', knockbackStrength: 0.6, dizzy: false },
  healing:   { description: 'heals itself immediately (cheating)', tintColor: '#A5D6A766', knockbackStrength: 0.2, dizzy: false },
  void:      { description: 'silently absorbs the hit... somehow', tintColor: '#37474F66', knockbackStrength: 0.1, dizzy: false },
  space:     { description: 'briefly warps into another dimension', tintColor: '#7E57C244', knockbackStrength: 0.5, dizzy: true  },
  time:      { description: 'pauses time briefly to avoid damage', tintColor: '#80DEEA44', knockbackStrength: 0.3, dizzy: false },
  robot:     { description: 'glitches and displays ERROR CODE 7',  tintColor: '#40C4FF55', knockbackStrength: 0.6, dizzy: true  },
};

// ─── Combat Dialogues ─────────────────────────────────────────────
// Short exclamations spirits say during combat. Index 0 = attack, 1 = defend, 2 = hit, 3 = win, 4 = lose, 5 = idle taunt.

export const COMBAT_DIALOGUES: Record<ElementType, string[][]> = {
  fire: [
    ['FEEL THE HEAT!', 'You call that a spell?!', 'I\'m just getting WARMED UP!'],
    ['Bring it on!', 'Is that all you\'ve got?!', 'Dodge THIS!'],
    ['Ow! That was... actually pretty good.', 'You got lucky!', 'Still burning though!'],
    ['HA! Too hot for you!', 'Nobody out-flames ME!', '*victory dance*'],
    ['...Fine. You win. This time.', 'I let you win. Obviously.', 'Rematch. Now.'],
    ['Hey! You! Yes, you. Fight me.', 'I\'m BORED. Someone fight me.', 'My flames demand a challenge!'],
  ],
  water: [
    ['You need more emotional control.', 'I\'ve been waiting for this.', 'Let\'s see how you handle this...'],
    ['I saw that coming.', 'Your patterns are readable.', 'Counter-strategy engaged.'],
    ['Hmm. Unexpected.', 'Recalibrating...', 'I\'ll allow it. Once.'],
    ['Patience always wins.', 'The river outlasts the stone.', 'As I calculated.'],
    ['Your technique was... adequate.', 'Well executed. I concede.', 'I\'ll study your strategy.'],
    ['Your fighting style is sloppy.', 'You should meditate more.', 'I\'m not impressed.'],
  ],
  ice: [
    ['You will not break me.', 'I am unmovable.', 'Prepare to freeze.'],
    ['I have been waiting for centuries. This is nothing.', 'Your haste is your weakness.', 'Stand still.'],
    ['A... surprising development.', '...I felt that.', 'You have improved.'],
    ['As inevitable as winter.', 'The cold always wins.', '...Obviously.'],
    ['You have earned my respect. Reluctantly.', 'I see your technique now.', 'Next time.'],
    ['Your chaos disturbs the silence.', 'Be still.', 'This region is mine.'],
  ],
  wind: [
    ['The wind goes where it wills!', 'Catch me if you can!', 'Spiraling attack!'],
    ['I was already somewhere else!', 'Dodge, dodge, dodge!', 'You can\'t hit what you can\'t catch!'],
    ['Ah! A direct hit — dramatic!', 'SPINNING! I\'m spinning!', 'Momentarily caught, never defeated!'],
    ['HAHA! FREEDOM!', 'The wind is victorious, as always!', 'BEHOLD! The gust of triumph!'],
    ['A worthy gust! You bested me this round!', 'Blown away by someone better today!', 'The wind retreats! Strategically!'],
    ['FIGHT ME, the wind challenges all!', 'Who dares contest the gale?!', 'BEHOLD, I arrive dramatically!'],
  ],
  soil: [
    ['Hmph. If I MUST.', 'You asked for this.', '...Fine. I\'ll fight you.'],
    ['This is a waste of perfectly good soil.', 'Stopping your nonsense now.', '...You really want to do this?'],
    ['OW. Okay, that was rude.', 'Who throws things at soil?!', '...I felt that in my roots.'],
    ['Are you happy now? Good grief.', '...Fine. You win. Stop making a mess.', 'Okay. I won. Now everyone clean up.'],
    ['You are stronger than dirt. I admit it.', '...Good punch.', 'You win. Now go away.'],
    ['Oi. You there. Do you mind?', 'Get off my patch of world.', '...What are you looking at?'],
  ],
  trees: [
    ['Nature strikes back!', 'The forest is ANGRY!', 'FEEL THE ROOTS!'],
    ['My bark is stronger than your magic!', 'Trees don\'t fall easily!', 'Shields of ancient wood!'],
    ['That... will leave a mark on my rings.', 'The forest felt that.', 'Even trees can be hurt.'],
    ['BLOSSOMARA IS VICTORIOUS! ...Sorry, got caught up.', 'Nature endures!', 'The oldest always outlasts!'],
    ['You have mastered the forest\'s respect.', 'A worthy opponent of nature.', 'I yield to the stronger spell.'],
    ['Your chaos threatens the natural order.', 'This ends now.', 'The forest demands order!'],
  ],
  lightning: [
    ['THIS IS AMAZING!!!', 'ZAP ZAP ZAP ZAP!', 'LIGHTNING ROUND!'],
    ['Oh this is ELECTRIC!', 'Can\'t catch lightning!', 'BOUNCY BOUNCY ZAP!'],
    ['OUCH! THAT WAS GREAT!', 'STILL SPARKING!', 'ZAP! Wait no, that was me getting hit.'],
    ['I WON!!! WOOOO!!! LIGHTNING!!!', 'CRACKLE CRACKLE VICTORY!', 'BEST FIGHT EVER!!!'],
    ['You win! STILL FUN THOUGH!', 'ZAP ZAP, you got me!', 'GONNA TRAIN HARDER! YEAHHHH!'],
    ['FIGHT ME! OR DON\'T! I MIGHT FIGHT MYSELF!', 'ZAP! Did you see that? ZAP!', 'HELLO! CHAOS! YES!'],
  ],
  dark: [
    ['You cannot see what you cannot find.', 'The shadows answer to me.', 'Observe...'],
    ['Your light means nothing here.', 'I have already evaded.', '...I was never there.'],
    ['...Interesting.', 'Unexpected.', 'You found me. Impressive.'],
    ['As the shadows intended.', '...It was never in doubt.', 'The dark always remains.'],
    ['You navigated the darkness well.', '...For now.', 'The shadows remember everything.'],
    ['I\'ve been watching you.', 'You interest me.', '...You shouldn\'t be here.'],
  ],
  light: [
    ['Witness this radiance!', 'May the light guide this strike!', 'For the light!'],
    ['I will not yield to shadow!', 'The light is my shield!', 'RADIANT BARRIER!'],
    ['Even light can be dimmed!', 'A strong blow!', 'But light always returns!'],
    ['GLORIOUS VICTORY FOR THE LIGHT!', 'Shining triumph!', 'The light endures, as always!'],
    ['Your light shines bright today.', 'I am... honoured to lose to you.', 'Well fought, champion.'],
    ['Darkness flees from me!', 'Who wishes to see the LIGHT?!', 'I am HERE and LUMINOUS!'],
  ],
  healing: [
    ['Please. Can we not?', 'I\'ll just heal everyone and this will end.', 'Fighting is inefficient.'],
    ['Stop hurting each other! I\'ll stop you!', 'My patience has limits!', 'I do NOT want to do this.'],
    ['Oh no. Oh no no no. I\'m hurt. This is terrible.', 'That was unnecessary.', '...At least I can heal myself.'],
    ['Please stop now. Everyone is healed. We\'re done.', 'I fixed everyone. You\'re welcome. Never again.', 'Conflict resolved. Painfully.'],
    ['You are very good at fighting. This upsets me.', 'You win. Now please be kind to each other.', 'I yield. Let\'s all have a group healing session.'],
    ['Is everyone okay?! I\'m watching you.', 'Any more of this and I\'m intervening.', 'I swear, spirits these days...'],
  ],
  void: [
    ['...', 'Null.', 'Absence.'],
    ['Nothing.', '...', '*silence*'],
    ['...Noted.', 'Unexpected.', '.'],
    ['...', 'Done.', ''],
    ['You exist.', '...I acknowledge the outcome.', '...'],
    ['...', '...You are here.', '...Why.'],
  ],
  space: [
    ['From across the galaxy—', 'A billion stars witness this!', 'Space itself bends to my will!'],
    ['I have seen supernovae. You are... smaller.', 'Gravity answers to me.', 'The cosmos protect me.'],
    ['In the grand scale of the universe, that barely— OW.', 'Even stars get hit sometimes.', 'A surprising perturbation!'],
    ['Magnificent! Like a supernova!', 'The cosmos have spoken!', 'Victory written in stardust!'],
    ['A worthy gravitational force.', 'You orbit with great skill.', 'The stars favor you today.'],
    ['I drifted here from very far away...', 'This region fascinates me.', 'Do you know what stars are made of?'],
  ],
  time: [
    ['I already knew this would happen.', 'Your future is... unfortunate.', 'Past, present, strike.'],
    ['I\'ve seen this moment before.', 'Your timeline is readable.', 'I\'ve already countered this.'],
    ['That was... unexpected by the timeline.', 'A temporal anomaly.', 'I didn\'t see THAT coming.'],
    ['The timeline always favors me.', 'As it was written.', 'Predictable victory.'],
    ['This was not my timeline to win.', 'The future has other plans.', 'I\'ll remember this.'],
    ['I\'ve waited so long for this moment.', 'Literally.', 'Time is on my side. Obviously.'],
  ],
  robot: [
    ['Initiating combat subroutine.', 'Calculating optimal strike vector.', 'Combat efficiency: 94%.'],
    ['Defensive protocol engaged.', 'Threat assessment complete. Countering.', 'Optimal block executed.'],
    ['ERROR. UNEXPECTED OUTCOME. Recalibrating.', 'System damage detected.', 'That was... not in the model.'],
    ['Victory confirmed. Combat efficiency: 97.3%.', 'Objective complete.', 'Expected outcome achieved.'],
    ['Defeat logged. Updating combat model.', 'Your technique exceeded my predictions.', 'Recalibrating for next encounter.'],
    ['Processing... this situation is inefficient.', 'Scanning for threats.', 'You there. Explain yourself. Logically.'],
  ],
};

// ─── Combat Event Types ───────────────────────────────────────────

export type CombatEventType =
  | 'duel'          // 1v1 direct fight
  | 'argument'      // philosophical/verbal sparring (milder, more talk)
  | 'prank'         // one spirit mischievously startles another
  | 'rescue'        // healing spirit interrupts a fight
  | 'rivalry_flare';// classic elemental rivals go at it (fire-ice, light-dark)

/** Which element pairs are classic rivals — more likely to fight. */
export const ELEMENTAL_RIVALRIES: [ElementType, ElementType][] = [
  ['fire', 'water'],
  ['fire', 'ice'],
  ['light', 'dark'],
  ['wind', 'soil'],
  ['lightning', 'robot'],
  ['space', 'time'],
  ['void', 'light'],
  ['trees', 'lightning'],
];

/** Elements that prefer to stay out of direct combat. */
export const PACIFIST_ELEMENTS: ElementType[] = ['healing', 'soil', 'void'];

/** Get a random combat dialogue line for an element and phase. */
export function getCombatLine(
  element: ElementType,
  phase: 'attack' | 'defend' | 'hit' | 'win' | 'lose' | 'taunt',
): string {
  const phaseIdx = { attack: 0, defend: 1, hit: 2, win: 3, lose: 4, taunt: 5 }[phase];
  const pool = COMBAT_DIALOGUES[element]?.[phaseIdx] ?? [];
  return pool[Math.floor(Math.random() * pool.length)] ?? '...';
}

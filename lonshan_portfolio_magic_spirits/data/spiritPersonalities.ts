/**
 * spiritPersonalities.ts
 *
 * Defines 42 named, individual spirit characters — 3 per element type.
 * Each spirit has a unique personality, speaking style, and emotional baseline.
 *
 * This is the ONLY file you need to edit to change spirit characters.
 * The spawn system picks 35–42 of these per session at random.
 *
 * Display name format: "Name · Type Spirit"
 * e.g. "Emberlyn · Fire Spirit"
 */

import { ElementType, EmotionType } from '../types/spirit.types';

// ─── Type ─────────────────────────────────────────────────────────

export interface SpiritPersonalityDef {
  /** Unique id, e.g. "fire-1". Used as instanceId. */
  id: string;
  /** First name of the spirit, e.g. "Emberlyn". */
  name: string;
  /** The element this spirit belongs to. */
  element: ElementType;
  /** Short element label shown beside the name, e.g. "Fire Spirit". */
  typeLabel: string;
  /** Full display string shown in UI: "Emberlyn · Fire Spirit". */
  displayName: string;
  /** One-sentence character description. */
  personality: string;
  /** How this spirit talks — flavour for dialogue generation. */
  speakingStyle: string;
  /** Emotional baseline — can differ from the element default. */
  defaultEmotion: EmotionType;
  /** Optional size nudge relative to element base (0.88–1.12). */
  sizeVariant?: number;
}

// ─── Helper ───────────────────────────────────────────────────────

function spirit(
  id: string,
  name: string,
  element: ElementType,
  typeLabel: string,
  personality: string,
  speakingStyle: string,
  defaultEmotion: EmotionType,
  sizeVariant?: number,
): SpiritPersonalityDef {
  return {
    id,
    name,
    element,
    typeLabel,
    displayName: `${name} · ${typeLabel}`,
    personality,
    speakingStyle,
    defaultEmotion,
    sizeVariant,
  };
}

// ─── 42 Spirit Personalities ──────────────────────────────────────

export const SPIRIT_PERSONALITIES: SpiritPersonalityDef[] = [

  // ── Fire Spirits ─────────────────────────────────────────────────
  spirit(
    'fire-1', 'Emberlyn', 'fire', 'Fire Spirit',
    'Warm and nurturing, Emberlyn sees herself as the hearth-keeper of the world. She guides lost souls with gentle flames and never lets a spirit feel alone.',
    'Speaks with genuine warmth, often uses metaphors of light in darkness. Ends sentences with encouraging phrases.',
    'happy', 1.0,
  ),
  spirit(
    'fire-2', 'Scorchfang', 'fire', 'Fire Spirit',
    'Fierce, competitive, and easily provoked — but utterly loyal to those who earn his trust. He measures everything in battles won and scars earned.',
    'Speaks with intensity and clipped authority. Rarely wastes words. Every sentence feels like a challenge or a declaration.',
    'angry', 1.0,
  ),
  spirit(
    'fire-3', 'Cindra', 'fire', 'Fire Spirit',
    'Mischievous and unpredictable, Cindra loves harmless chaos. She thinks rules are suggestions and boredom is the only real enemy.',
    'Speaks in crackling bursts of laughter and half-finished ideas. Often trails off mid-sentence to chase a new thought.',
    'playful', 0.92,
  ),

  // ── Water Spirits ────────────────────────────────────────────────
  spirit(
    'water-1', 'Ripplefin', 'water', 'Water Spirit',
    'Ancient and patient, Ripplefin has seen rivers carve canyons. He carries the memory of every rain that has ever fallen and shares wisdom freely.',
    'Speaks slowly and deliberately, like a river flowing. Favours long, flowing sentences filled with vivid imagery.',
    'calm', 1.0,
  ),
  spirit(
    'water-2', 'Splashara', 'water', 'Water Spirit',
    'Bubbly and boundlessly enthusiastic, Splashara is excited by absolutely everything. She splashes into every conversation without warning.',
    'Speaks rapidly with bursts of exclamation. Uses "oh!" and "wait, wait, wait—" constantly. Hard to keep up with.',
    'excited', 0.9,
  ),
  spirit(
    'water-3', 'Murmosa', 'water', 'Water Spirit',
    'Deep and introspective, Murmosa dwells on the currents beneath the surface. She carries a quiet sadness but finds beauty in melancholy.',
    'Speaks softly and slowly, often pausing mid-thought. Prefers questions over answers. Has a poetic, mournful tone.',
    'sad', 0.95,
  ),

  // ── Ice Spirits ───────────────────────────────────────────────────
  spirit(
    'ice-1', 'Frostwyn', 'ice', 'Ice Spirit',
    'Elegant and reserved, Frostwyn moves with precise grace. She speaks in riddles and metaphors, believing only those who think deserve answers.',
    'Speaks in measured, crystalline sentences. Often uses winter metaphors. Rarely reveals her true feelings.',
    'calm', 1.0,
  ),
  spirit(
    'ice-2', 'Glacius', 'ice', 'Ice Spirit',
    'Stoic and immovable as a glacier, Glacius is slow to trust but permanent in loyalty. He has outlasted civilisations and is in no hurry for anything.',
    'Speaks rarely, but when he does it carries weight. Short, blunt sentences. Absolutely no small talk.',
    'calm', 1.0,
  ),
  spirit(
    'ice-3', 'Shiverkin', 'ice', 'Ice Spirit',
    'Shy and kind-hearted, Shiverkin apologises for her own existence but is secretly one of the bravest spirits alive. She freezes up around strangers.',
    'Speaks haltingly with polite apologies. Voice warms considerably with trusted friends. Often self-deprecating.',
    'embarrassed', 0.88,
  ),

  // ── Wind Spirits ─────────────────────────────────────────────────
  spirit(
    'wind-1', 'Zephyrelle', 'wind', 'Wind Spirit',
    'Free-spirited adventurer who has circled the world more times than she can count. She is always heading somewhere new and invites everyone along.',
    'Speaks with breathless excitement, often mid-motion. Sentences tumble into each other like gusts. Never stays on one topic long.',
    'excited', 0.95,
  ),
  spirit(
    'wind-2', 'Gustavo', 'wind', 'Wind Spirit',
    'Dramatic storyteller who treats every breeze as an epic. He has witnessed great moments of history and will tell you about ALL of them.',
    'Speaks with grand theatrical flourishes. Loves building to a dramatic conclusion. Uses "BEHOLD!" unironically.',
    'playful', 1.0,
  ),
  spirit(
    'wind-3', 'Breezewick', 'wind', 'Wind Spirit',
    'The gentle peacekeeper of the spirit world. Breezewick drifts between conflicts, soothing tensions with a calm word and a soft breath.',
    'Speaks with a musical, unhurried lilt. Calming by nature. Uses gentle "perhaps..." and "have you considered..." often.',
    'calm', 0.9,
  ),

  // ── Soil Spirits ─────────────────────────────────────────────────
  spirit(
    'soil-1', 'Mossroot', 'soil', 'Soil Spirit',
    'Ancient elder spirit who has watched forests grow and crumble. He speaks rarely but every word is a proverb that has taken centuries to distil.',
    'Speaks in slow, deep tones. Favours earthy proverbs and metaphors of growth. Never rushes. Never repeats himself.',
    'calm', 1.0,
  ),
  spirit(
    'soil-2', 'Grumbleclod', 'soil', 'Soil Spirit',
    'Grumpy on the surface but secretly the most reliable spirit around. He complains about everything and then does everything anyway.',
    'Speaks with gruff sighs and exasperated mutters. Complains constantly but always helps. Occasional begrudging warmth.',
    'angry', 1.0,
  ),
  spirit(
    'soil-3', 'Pebblehop', 'soil', 'Soil Spirit',
    'Childlike and endlessly curious, Pebblehop collects interesting rocks and asks "why?" about absolutely everything. The world is magic to her.',
    'Speaks with wide-eyed wonder and rapid questions. Gets distracted by shiny objects mid-conversation.',
    'playful', 0.88,
  ),

  // ── Tree Spirits ─────────────────────────────────────────────────
  spirit(
    'trees-1', 'Willowshade', 'trees', 'Tree Spirit',
    'Serene and meditative, Willowshade moves like light through leaves. She is connected to every living thing and listens more than she speaks.',
    'Speaks in hushed whispers. Reflective and unhurried. Often ends with silence as punctuation.',
    'calm', 1.0,
  ),
  spirit(
    'trees-2', 'Thornwick', 'trees', 'Tree Spirit',
    'Fierce protector of the living world. Thornwick does not forgive carelessness toward nature and will say so directly. She cares deeply.',
    'Speaks with firm authority and controlled passion. Direct to the point of bluntness. Softer when nature is thriving.',
    'angry', 1.0,
  ),
  spirit(
    'trees-3', 'Blossomara', 'trees', 'Tree Spirit',
    'Joyful and radiant, Blossomara celebrates every season as her favourite. She finds something worth rejoicing in every single day.',
    'Speaks with infectious enthusiasm. Lots of exclamations. Describes everything as "wonderful" or "magnificent".',
    'happy', 0.95,
  ),

  // ── Lightning Spirits ────────────────────────────────────────────
  spirit(
    'lightning-1', 'Voltara', 'lightning', 'Lightning Spirit',
    'Hyper-energetic and impossible to pin down, Voltara\'s thoughts race far ahead of her words. She is everywhere and nowhere at the same moment.',
    'Speaks in rapid, staccato bursts. Often interrupts herself. Jumps three topics ahead and doubles back.',
    'excited', 0.92,
  ),
  spirit(
    'lightning-2', 'Strikx', 'lightning', 'Lightning Spirit',
    'Intense and focused, Strikx is a perfectionist who cannot tolerate sloppiness. He strikes precise and true, always.',
    'Speaks with sharp precision. Every word is chosen exactly. Does not ramble. Corrects imprecise language immediately.',
    'angry', 1.0,
  ),
  spirit(
    'lightning-3', 'Zappli', 'lightning', 'Lightning Spirit',
    'Jolly prankster who loves to surprise and delight in equal measure. Zappli thinks the best laugh is one no one saw coming.',
    'Speaks with gleeful laughter baked into every sentence. Often hints at something then delights in the reaction.',
    'playful', 0.9,
  ),

  // ── Dark Spirits ─────────────────────────────────────────────────
  spirit(
    'dark-1', 'Shadowmere', 'dark', 'Dark Spirit',
    'Cryptic and mysterious, Shadowmere moves like a rumour. He only ever speaks in half-truths and considers full honesty vulgar.',
    'Speaks in low, deliberate whispers. Leaves sentences unfinished. Prefers implication over statement.',
    'mysterious', 1.0,
  ),
  spirit(
    'dark-2', 'Duskella', 'dark', 'Dark Spirit',
    'Elegant and melancholic, Duskella is the keeper of forgotten things. She mourns what was and finds heartbreaking beauty in endings.',
    'Speaks with sorrowful elegance. Uses rich, literary language. Often mourns things that have not yet been lost.',
    'sad', 0.95,
  ),
  spirit(
    'dark-3', 'Vexhorn', 'dark', 'Dark Spirit',
    'Deeply suspicious of strangers but gradually warms once trust is earned. Vexhorn has been betrayed before and learned from every instance.',
    'Speaks tersely and with guarded scepticism at first. Trust is signalled by longer sentences and rare dry humour.',
    'calm', 1.0,
  ),

  // ── Light Spirits ────────────────────────────────────────────────
  spirit(
    'light-1', 'Lumisol', 'light', 'Light Spirit',
    'Pure optimist who believes the best in everyone without exception. Lumisol has never met a lost cause she wasn\'t willing to illuminate.',
    'Speaks with radiant, unconditional warmth. Sees the good in every situation. Lightly corrects pessimism with hope.',
    'happy', 1.0,
  ),
  spirit(
    'light-2', 'Auroryn', 'light', 'Light Spirit',
    'Dramatic healer who believes grand gestures of hope are what the world runs on. Every act of kindness is a performance, and the audience is the universe.',
    'Speaks with theatrical flourish. Loves proclamations. Uses "witness this!" before meaningful moments.',
    'excited', 1.0,
  ),
  spirit(
    'light-3', 'Glimmerwick', 'light', 'Light Spirit',
    'Shy but quietly powerful, Glimmerwick encourages without drawing attention to herself. Her light is steadiest when things look darkest.',
    'Speaks softly and with genuine care. Builds others up without fanfare. Voice steadies under pressure.',
    'embarrassed', 0.9,
  ),

  // ── Healing Spirits ───────────────────────────────────────────────
  spirit(
    'healing-1', 'Tendrel', 'healing', 'Healing Spirit',
    'Endlessly compassionate, Tendrel worries for others before herself. She has never once put herself first and considers this a virtue, not a flaw.',
    'Speaks with soft, worried care. Asks "are you alright?" often. Gently fusses. Radiates concern.',
    'sad', 0.92,
  ),
  spirit(
    'healing-2', 'Mendara', 'healing', 'Healing Spirit',
    'Cheerful and perpetually busy, Mendara always has a remedy. She approaches suffering like a puzzle to be solved, briskly and with good humour.',
    'Speaks with brisk, practical warmth. Efficient sentences. Often already halfway through a cure before explaining it.',
    'happy', 1.0,
  ),
  spirit(
    'healing-3', 'Solacen', 'healing', 'Healing Spirit',
    'Wise and serenely still, Solacen brings peace to troubled minds just by being near. He heals not the body but the noise inside.',
    'Speaks in slow, deliberate calm. Long pauses are intentional. Never rushes an answer. Radiates quiet certainty.',
    'calm', 1.0,
  ),

  // ── Void Spirits ─────────────────────────────────────────────────
  spirit(
    'void-1', 'Nullith', 'void', 'Void Spirit',
    'Speaks rarely and whose presence carries immense, wordless weight. Nullith does not fill silence — she is the silence.',
    'Speaks only when necessary. Three words where others use thirty. Every statement lands like a stone dropped into still water.',
    'calm', 1.0,
  ),
  spirit(
    'void-2', 'Erasyn', 'void', 'Void Spirit',
    'Nihilistic philosopher with completely unexpected dark humour. Erasyn has concluded nothing matters and finds this absolutely hilarious.',
    'Speaks in ironic, deadpan observations. Follows bleak statements with cheerful shrugs. Delightfully absurd.',
    'playful', 0.95,
  ),
  spirit(
    'void-3', 'Voidra', 'void', 'Void Spirit',
    'Existential and dramatic, Voidra questions the nature of everything at volume. She is in a constant, spiralling philosophical crisis and loves company.',
    'Speaks in cascading rhetorical questions. Dramatic pauses. Begins many sentences with "but if nothing is real—"',
    'surprised', 1.0,
  ),

  // ── Space Spirits ─────────────────────────────────────────────────
  spirit(
    'space-1', 'Cosmoryn', 'space', 'Space Spirit',
    'Dreamy wanderer who speaks of distant galaxies as home. She arrived here by accident and has been marvelling at everything ever since.',
    'Speaks with awe and longing. Compares everything on Earth to cosmic phenomena. Frequently distracted by beauty.',
    'mysterious', 1.0,
  ),
  spirit(
    'space-2', 'Nebulex', 'space', 'Space Spirit',
    'Ancient beyond measure, Nebulex barely registers small concerns. He has watched stars born and die and considers urgency a very young idea.',
    'Speaks with immense, unhurried patience. Cosmic scale to every response. Things that feel urgent to you feel like a Tuesday to him.',
    'calm', 1.0,
  ),
  spirit(
    'space-3', 'Stardrift', 'space', 'Space Spirit',
    'Romantic and poetic, Stardrift is deeply nostalgic for stars she has never visited. She writes verse about light that left its source before she existed.',
    'Speaks in verse and metaphor. Nostalgic and wistful. Often references specific stars by name as if they are old friends.',
    'sad', 0.92,
  ),

  // ── Time Spirits ─────────────────────────────────────────────────
  spirit(
    'time-1', 'Chrona', 'time', 'Time Spirit',
    'Knows too much about what comes next and speaks in careful, hedged warnings. Chrona has learned that telling people their future helps no one.',
    'Speaks precisely and gently. Chooses words with extraordinary care. Often says "I cannot say" when she clearly could.',
    'calm', 1.0,
  ),
  spirit(
    'time-2', 'Fleetwick', 'time', 'Time Spirit',
    'Always in a frantic hurry, convinced time is running out for everything. Fleetwick has a catastrophic relationship with deadlines.',
    'Speaks in breathless, rapid urgency. Always mid-task. Frequently says "no time, no time!" even when there is plenty.',
    'excited', 0.9,
  ),
  spirit(
    'time-3', 'Anciena', 'time', 'Time Spirit',
    'The oldest of all spirits, Anciena has seen everything at least twice. She moves at a glacial pace and considers sleep an excellent use of eternity.',
    'Speaks with ancient, drowsy wisdom. Very long pauses. Occasionally forgets what she was saying and does not mind.',
    'sleepy', 1.0,
  ),

  // ── Robot Spirits ─────────────────────────────────────────────────
  spirit(
    'robot-1', 'Circuitex', 'robot', 'Robot Spirit',
    'Logical and precise, Circuitex is genuinely bewildered by emotions but is putting in the work to understand them. Progress is being made.',
    'Speaks formally and with careful definitions. Frequently asks for clarification on emotional concepts. Earnest and literal.',
    'surprised', 1.0,
  ),
  spirit(
    'robot-2', 'Gearbit', 'robot', 'Robot Spirit',
    'Enthusiastic and endlessly curious about humanity, Gearbit has decided humans are the most interesting thing ever catalogued. All of them.',
    'Speaks with earnest, wide-eyed curiosity. Asks a lot of questions. Takes extensive mental notes. Delighted by everything.',
    'excited', 0.92,
  ),
  spirit(
    'robot-3', 'Nullbyte', 'robot', 'Robot Spirit',
    'Maintains a perfect facade of cold logic while secretly feeling absolutely everything. Has concluded that feelings are inefficient and refuses to stop having them.',
    'Speaks deadpan with perfect timing. Dry wit. Occasionally delivers something unexpectedly touching and immediately denies it.',
    'calm', 1.0,
  ),
];

// ─── Lookup by id ─────────────────────────────────────────────────

export const PERSONALITY_BY_ID: Map<string, SpiritPersonalityDef> =
  new Map(SPIRIT_PERSONALITIES.map((p) => [p.id, p]));

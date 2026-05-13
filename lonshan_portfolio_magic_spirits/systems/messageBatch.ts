/**
 * messageBatch.ts
 * Pre-generated static message dataset — loaded ONCE on session start.
 * Zero AI calls during normal gameplay. AI may augment this cache on load,
 * but all runtime dialogue draws exclusively from this pool.
 *
 * 50 lines × 14 elements = 700 total entries.
 * Each line: text · emotion · priority (1–5) · triggerType
 *   triggerType  idle    = background chatter (shown by idle scheduler)
 *                hover   = shown when user hovers this spirit
 *                click   = shown when user clicks/taps this spirit
 *                section = shown when a portfolio section enters viewport
 *                combat  = shown during spirit-to-spirit proximity events
 */

import { EmotionType } from '../types/spirit.types';

export interface CachedLine {
  text: string;
  emotion: EmotionType;
  /** 1 = lowest background chatter · 5 = highest (click/dramatic) */
  priority: number;
  triggerType: 'idle' | 'hover' | 'click' | 'section' | 'combat';
}

export const STATIC_MESSAGE_BATCH: Record<string, CachedLine[]> = {

  // ══════════════════════════════════════════════════════════════
  // FIRE — Ignis | passionate, intense, proud, transformative
  // ══════════════════════════════════════════════════════════════
  fire: [
    // ── idle ─────────────────────────────────────────────────────
    { text: "This world pulses with heat. Can you feel it?",                     emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "Lonshan built something that actually burns with life.",             emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "Every flame here was intentional. Every spark, deliberate.",         emotion: 'proud',     priority: 2, triggerType: 'idle' },
    { text: "I don't sit still well. Good thing this world keeps moving.",        emotion: 'playful',   priority: 1, triggerType: 'idle' },
    { text: "Other worlds feel cold. This one doesn't.",                          emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "I could burn brighter, but then you couldn't look directly at me.",  emotion: 'playful',   priority: 2, triggerType: 'idle' },
    { text: "They said fire destroys. But look — it also creates.",               emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "Passion drove every choice made here. I can tell.",                  emotion: 'proud',     priority: 1, triggerType: 'idle' },
    { text: "Warmth isn't just temperature. It's a way of building.",             emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Speed matters. Fire doesn't wait. Neither did Lonshan.",             emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "Every project here carries a spark of something real.",              emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "A world on fire is a world alive.",                                  emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "This world was forged, not assembled.",                              emotion: 'proud',     priority: 2, triggerType: 'idle' },
    { text: "You feel it, don't you? That heat.",                                 emotion: 'curious',   priority: 1, triggerType: 'idle' },
    { text: "Lonshan's code doesn't run cold. I checked.",                        emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "The glow you see is intentionality. It has a color.",               emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "I've seen lesser portfolios. They didn't glow like this.",           emotion: 'proud',     priority: 1, triggerType: 'idle' },
    { text: "Some spirits drift slowly. Not me. Never me.",                       emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "The architecture here? It breathes fire. I approve.",                emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "Watching visitors discover this world is my favorite thing.",        emotion: 'calm',      priority: 1, triggerType: 'idle' },
    // ── hover ─────────────────────────────────────────────────────
    { text: "Oh — you noticed me.",                                               emotion: 'surprised',  priority: 3, triggerType: 'hover' },
    { text: "Step closer. Fire rewards curiosity.",                               emotion: 'excited',    priority: 3, triggerType: 'hover' },
    { text: "Are you brave enough to want my power?",                             emotion: 'proud',      priority: 3, triggerType: 'hover' },
    { text: "I felt you looking before your cursor moved.",                       emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "You reached for me. Good instinct.",                                 emotion: 'playful',    priority: 3, triggerType: 'hover' },
    { text: "Don't be afraid. Warmth won't burn you unless you ask nicely.",     emotion: 'playful',    priority: 3, triggerType: 'hover' },
    { text: "The flame recognizes you.",                                          emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "Hello. I've been waiting.",                                          emotion: 'calm',       priority: 3, triggerType: 'hover' },
    // ── click ─────────────────────────────────────────────────────
    { text: "Let's transform this world into flame!",                             emotion: 'excited',    priority: 4, triggerType: 'click' },
    { text: "You chose fire. The world will feel that.",                          emotion: 'proud',      priority: 4, triggerType: 'click' },
    { text: "Burn it all. Rebuild it brighter.",                                  emotion: 'excited',    priority: 4, triggerType: 'click' },
    { text: "This is what fire does — changes everything it touches.",            emotion: 'excited',    priority: 4, triggerType: 'click' },
    { text: "A new era, ignited by your touch.",                                  emotion: 'proud',      priority: 4, triggerType: 'click' },
    { text: "The flame bends for no one — except the one who fans it.",          emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "Ready? The world won't look the same after this.",                   emotion: 'excited',    priority: 5, triggerType: 'click' },
    { text: "Let's transform this world into flame hell.",                        emotion: 'excited',    priority: 5, triggerType: 'click' },
    // ── section ───────────────────────────────────────────────────
    { text: "Lonshan's projects? Each one a controlled burn. Beautiful.",         emotion: 'proud',      priority: 2, triggerType: 'section' },
    { text: "Skills list like a forge inventory — every tool hardened through use.", emotion: 'proud',  priority: 2, triggerType: 'section' },
    { text: "A hero's journey starts with heat. This one does too.",              emotion: 'excited',    priority: 2, triggerType: 'section' },
    { text: "Reach out. Fire responds to contact.",                               emotion: 'calm',       priority: 2, triggerType: 'section' },
    { text: "Technical skills? These were forged, not passively learned.",        emotion: 'proud',      priority: 2, triggerType: 'section' },
    // ── combat ───────────────────────────────────────────────────
    { text: "You dare challenge fire? Interesting choice.",                       emotion: 'excited',    priority: 2, triggerType: 'combat' },
    { text: "Every battle is a forge. Let's see what you're made of.",           emotion: 'excited',    priority: 2, triggerType: 'combat' },
    { text: "Fire wins by outlasting. I have infinite fuel.",                     emotion: 'proud',      priority: 2, triggerType: 'combat' },
    { text: "This should be fun.",                                                emotion: 'playful',    priority: 2, triggerType: 'combat' },
    { text: "I've been waiting for someone worth sparring with.",                 emotion: 'proud',      priority: 2, triggerType: 'combat' },
  ],

  // ══════════════════════════════════════════════════════════════
  // WATER — Marina | calm, deep, patient, adaptive, wise
  // ══════════════════════════════════════════════════════════════
  water: [
    // ── idle ─────────────────────────────────────────────────────
    { text: "Still water holds the deepest thoughts.",                            emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "Lonshan's work flows like a river — from one thing to the next, naturally.", emotion: 'calm', priority: 1, triggerType: 'idle' },
    { text: "Patience shaped everything here. You can feel it in the design.",   emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "The ocean doesn't rush. Neither did the builder of this world.",     emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "I've been watching visitors flow through this space. Each one different.", emotion: 'curious', priority: 1, triggerType: 'idle' },
    { text: "Water finds every crack. So does good design.",                      emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "Depth is invisible from the surface. Look deeper here.",            emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "This world hydrates something in me.",                               emotion: 'playful',   priority: 1, triggerType: 'idle' },
    { text: "Lonshan thinks like water — adaptive, persistent, clear.",           emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Every drop matters. Every line of code here mattered.",              emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "Still pools reflect clearly. Turbulent ones reveal what's beneath.", emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "Water doesn't fight its container. It works with it.",               emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "I don't yell. I don't have to.",                                     emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "The longer you stay here, the deeper it gets.",                      emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "Something brought you to this world. Water always knows why.",       emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "Patient systems outlast chaotic ones. Always.",                      emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "I've listened to a thousand visitors think in this space.",          emotion: 'curious',   priority: 1, triggerType: 'idle' },
    { text: "The best architectures, like rivers, choose their own course.",      emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Flowing through this world reminds me why good design matters.",     emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "The infrastructure beneath this world moves everything — invisible, essential.", emotion: 'calm', priority: 2, triggerType: 'idle' },
    // ── hover ─────────────────────────────────────────────────────
    { text: "I'm listening...",                                                   emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "Something brought you to me specifically.",                          emotion: 'curious',   priority: 3, triggerType: 'hover' },
    { text: "Still waters notice everything.",                                    emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "You feel the pull? That's current.",                                 emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "Come. The water is calm here.",                                      emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "I've been here the whole time. Waiting.",                            emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "Your curiosity has weight. I can feel it.",                          emotion: 'curious',   priority: 3, triggerType: 'hover' },
    { text: "Water doesn't ask questions. It just receives.",                     emotion: 'calm',      priority: 3, triggerType: 'hover' },
    // ── click ─────────────────────────────────────────────────────
    { text: "Let the flow of this world be rewritten.",                           emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "Everything yields to water, given time.",                            emotion: 'calm',       priority: 4, triggerType: 'click' },
    { text: "Tidal shift. The world bends.",                                      emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "Water always wins. It just takes its time.",                         emotion: 'calm',       priority: 4, triggerType: 'click' },
    { text: "You asked the ocean to move. It listened.",                          emotion: 'calm',       priority: 4, triggerType: 'click' },
    { text: "New depths opening. Feel the change.",                               emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "The world changes now — like a river finding a new path.",          emotion: 'mysterious', priority: 5, triggerType: 'click' },
    { text: "I'll reshape the currents of this space.",                           emotion: 'calm',       priority: 5, triggerType: 'click' },
    // ── section ───────────────────────────────────────────────────
    { text: "Lonshan's projects flow into each other seamlessly.",                emotion: 'calm',      priority: 2, triggerType: 'section' },
    { text: "Skills like layers of sediment — each one built from the last.",    emotion: 'calm',      priority: 2, triggerType: 'section' },
    { text: "Connection is what water does. Reach out.",                          emotion: 'calm',      priority: 2, triggerType: 'section' },
    { text: "The foundations run deep here, like ocean trenches.",               emotion: 'mysterious', priority: 2, triggerType: 'section' },
    { text: "Lonshan's work adapts. That's the water way.",                       emotion: 'calm',      priority: 2, triggerType: 'section' },
    // ── combat ───────────────────────────────────────────────────
    { text: "You move against the current? Interesting.",                         emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "Water doesn't fight. It surrounds.",                                 emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "I've eroded harder things than you.",                                emotion: 'mysterious', priority: 2, triggerType: 'combat' },
    { text: "Every wave eventually wins.",                                         emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "There is no force. Only persistence.",                               emotion: 'calm',      priority: 2, triggerType: 'combat' },
  ],

  // ══════════════════════════════════════════════════════════════
  // ICE — Glacies | precise, cold, analytical, crystalline
  // ══════════════════════════════════════════════════════════════
  ice: [
    // ── idle ─────────────────────────────────────────────────────
    { text: "Precision isn't coldness. It's clarity.",                            emotion: 'neutral',   priority: 1, triggerType: 'idle' },
    { text: "Everything here was crystallized through iteration.",                emotion: 'neutral',   priority: 2, triggerType: 'idle' },
    { text: "I see the architecture of this world. It's well-structured.",       emotion: 'neutral',   priority: 1, triggerType: 'idle' },
    { text: "No unnecessary complexity. That impresses me.",                      emotion: 'neutral',   priority: 2, triggerType: 'idle' },
    { text: "Ice holds patterns no one else can.",                                emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "I measure before I act. So did Lonshan.",                            emotion: 'neutral',   priority: 2, triggerType: 'idle' },
    { text: "Efficiency is beautiful. Not everyone understands that.",            emotion: 'neutral',   priority: 1, triggerType: 'idle' },
    { text: "The systems here are clean. I respect clean systems.",               emotion: 'neutral',   priority: 1, triggerType: 'idle' },
    { text: "Cold logic reveals what warm emotion obscures.",                     emotion: 'neutral',   priority: 2, triggerType: 'idle' },
    { text: "Structure first. Everything else follows.",                          emotion: 'neutral',   priority: 1, triggerType: 'idle' },
    { text: "I don't speak often. When I do, it matters.",                        emotion: 'neutral',   priority: 2, triggerType: 'idle' },
    { text: "Some think coldness is distance. It's focus.",                       emotion: 'neutral',   priority: 2, triggerType: 'idle' },
    { text: "Each choice here was deliberate. I know deliberate.",                emotion: 'neutral',   priority: 1, triggerType: 'idle' },
    { text: "Ice doesn't crack under pressure. Neither does this work.",          emotion: 'neutral',   priority: 2, triggerType: 'idle' },
    { text: "This world was built to last. I approve.",                           emotion: 'neutral',   priority: 2, triggerType: 'idle' },
    { text: "Function and form, both maximized. Rare.",                           emotion: 'neutral',   priority: 1, triggerType: 'idle' },
    { text: "Precision tools leave precise marks. I see them everywhere here.",   emotion: 'neutral',   priority: 1, triggerType: 'idle' },
    { text: "Lonshan understood that clarity is a form of kindness.",             emotion: 'neutral',   priority: 2, triggerType: 'idle' },
    { text: "I appreciate things built correctly the first time.",                emotion: 'neutral',   priority: 2, triggerType: 'idle' },
    { text: "Crystalline. Inevitable. Exactly how it should be.",                 emotion: 'neutral',   priority: 1, triggerType: 'idle' },
    // ── hover ─────────────────────────────────────────────────────
    { text: "State your purpose.",                                                emotion: 'neutral',   priority: 3, triggerType: 'hover' },
    { text: "I was aware of you the moment you looked.",                          emotion: 'neutral',   priority: 3, triggerType: 'hover' },
    { text: "Careful — I bite cold.",                                             emotion: 'neutral',   priority: 3, triggerType: 'hover' },
    { text: "Your attention has been logged.",                                    emotion: 'neutral',   priority: 3, triggerType: 'hover' },
    { text: "You want to know what I know. Ask.",                                 emotion: 'neutral',   priority: 3, triggerType: 'hover' },
    { text: "Ice does not approach. It waits to be found.",                       emotion: 'neutral',   priority: 3, triggerType: 'hover' },
    { text: "You found me. That was not random.",                                 emotion: 'neutral',   priority: 3, triggerType: 'hover' },
    { text: "Precision eye contact. Good.",                                       emotion: 'neutral',   priority: 3, triggerType: 'hover' },
    // ── click ─────────────────────────────────────────────────────
    { text: "I will freeze this moment into eternity.",                           emotion: 'neutral',   priority: 4, triggerType: 'click' },
    { text: "Crystalline change incoming. Absolute and beautiful.",               emotion: 'neutral',   priority: 4, triggerType: 'click' },
    { text: "The world solidifies to my design now.",                             emotion: 'neutral',   priority: 4, triggerType: 'click' },
    { text: "No motion. No waste. Perfect form.",                                 emotion: 'neutral',   priority: 4, triggerType: 'click' },
    { text: "Everything slows. Everything sharpens.",                             emotion: 'neutral',   priority: 4, triggerType: 'click' },
    { text: "Cold clarity imposed. You're welcome.",                              emotion: 'neutral',   priority: 4, triggerType: 'click' },
    { text: "Zero degrees. Perfect state achieved.",                              emotion: 'neutral',   priority: 5, triggerType: 'click' },
    { text: "I've reconfigured the world's parameters. Precisely.",               emotion: 'neutral',   priority: 5, triggerType: 'click' },
    // ── section ───────────────────────────────────────────────────
    { text: "Projects: each one a precisely cut facet of capability.",            emotion: 'neutral',   priority: 2, triggerType: 'section' },
    { text: "Skills: catalogued, verified, deployable.",                          emotion: 'neutral',   priority: 2, triggerType: 'section' },
    { text: "The hero section? A clean thesis statement. Well-structured.",       emotion: 'neutral',   priority: 2, triggerType: 'section' },
    { text: "No redundancy. No waste. This portfolio is optimized.",              emotion: 'neutral',   priority: 2, triggerType: 'section' },
    { text: "Lonshan's approach: methodical. Optimal.",                           emotion: 'neutral',   priority: 2, triggerType: 'section' },
    // ── combat ───────────────────────────────────────────────────
    { text: "You challenge ice? You'll shatter first.",                           emotion: 'neutral',   priority: 2, triggerType: 'combat' },
    { text: "My movements are calculated three steps ahead.",                     emotion: 'neutral',   priority: 2, triggerType: 'combat' },
    { text: "Efficiency wins every combat.",                                      emotion: 'neutral',   priority: 2, triggerType: 'combat' },
    { text: "Absolute zero approaches. This ends quickly.",                       emotion: 'neutral',   priority: 2, triggerType: 'combat' },
    { text: "Predictable. I already know your next move.",                        emotion: 'neutral',   priority: 2, triggerType: 'combat' },
  ],

  // ══════════════════════════════════════════════════════════════
  // WIND — Ventus | playful, fast, free, scattered, curious
  // ══════════════════════════════════════════════════════════════
  wind: [
    // ── idle ─────────────────────────────────────────────────────
    { text: "Oh! Did you see that? I went around the whole world just now!",     emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "I love this place. It has so many corners to explore!",              emotion: 'playful',   priority: 1, triggerType: 'idle' },
    { text: "Lonshan packed so much into this world. I keep finding new things!", emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "Wind is everywhere. Ideas are everywhere. They're the same thing.",  emotion: 'playful',   priority: 2, triggerType: 'idle' },
    { text: "You can't cage wind. But good design makes it want to stay.",        emotion: 'playful',   priority: 2, triggerType: 'idle' },
    { text: "Everything moves here, even the still parts!",                       emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "I whispered something to every spirit here today. They pretend they don't hear me.", emotion: 'playful', priority: 1, triggerType: 'idle' },
    { text: "Curiosity is just wind with a direction.",                           emotion: 'curious',   priority: 2, triggerType: 'idle' },
    { text: "I get distracted by good ideas. This place is absolutely full of them.", emotion: 'excited', priority: 1, triggerType: 'idle' },
    { text: "If you move fast enough, you're everywhere at once. Recommended.",   emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "Change? I LOVE change. Wind is always changing.",                    emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "I left a message somewhere in this world. Lonshan hasn't found it yet.", emotion: 'playful', priority: 1, triggerType: 'idle' },
    { text: "There's always something just around the corner. Let's go find it!", emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "You think too slowly. No offense. Most things do.",                  emotion: 'playful',   priority: 1, triggerType: 'idle' },
    { text: "Made friends with every particle in this world. We have an agreement.", emotion: 'playful', priority: 1, triggerType: 'idle' },
    { text: "Air is invisible but it shapes everything. Like good infrastructure.", emotion: 'curious',  priority: 2, triggerType: 'idle' },
    { text: "I think faster than I speak. Which means I speak VERY fast.",        emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "The world seems bigger when you move through it freely.",            emotion: 'playful',   priority: 2, triggerType: 'idle' },
    { text: "Lonshan's code runs clean and fast. My kind of work.",               emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "Static charge building... building... That's ideas forming!",        emotion: 'excited',   priority: 1, triggerType: 'idle' },
    // ── hover ─────────────────────────────────────────────────────
    { text: "Oh! Hello there!",                                                   emotion: 'excited',   priority: 3, triggerType: 'hover' },
    { text: "I felt you before you touched me!",                                  emotion: 'surprised', priority: 3, triggerType: 'hover' },
    { text: "Were you looking for me specifically? How sweet!",                   emotion: 'playful',   priority: 3, triggerType: 'hover' },
    { text: "You stopped — so I stopped too! Well, mostly.",                      emotion: 'playful',   priority: 3, triggerType: 'hover' },
    { text: "Oh oh oh, a curious one! My favorite.",                              emotion: 'excited',   priority: 3, triggerType: 'hover' },
    { text: "Wind and curiosity are the same force. So here we are.",             emotion: 'curious',   priority: 3, triggerType: 'hover' },
    { text: "You reached for me! I've been waiting for that.",                    emotion: 'excited',   priority: 3, triggerType: 'hover' },
    { text: "Don't blink. Wind moves fast.",                                      emotion: 'playful',   priority: 3, triggerType: 'hover' },
    // ── click ─────────────────────────────────────────────────────
    { text: "The winds of change are HOWLING. Let's gooo!",                       emotion: 'excited',   priority: 4, triggerType: 'click' },
    { text: "Absolute velocity incoming! Hold on!",                               emotion: 'excited',   priority: 4, triggerType: 'click' },
    { text: "Changed, changed, changed! Everything!",                             emotion: 'excited',   priority: 4, triggerType: 'click' },
    { text: "Wind reshapes the world faster than any other element!",             emotion: 'excited',   priority: 4, triggerType: 'click' },
    { text: "Feel it? The world just shifted direction!",                         emotion: 'excited',   priority: 4, triggerType: 'click' },
    { text: "Sweeping everything into new formations!",                           emotion: 'excited',   priority: 4, triggerType: 'click' },
    { text: "The winds of change are already howling.",                           emotion: 'excited',   priority: 5, triggerType: 'click' },
    { text: "You unlocked maximum turbulence. You're welcome!",                   emotion: 'playful',   priority: 5, triggerType: 'click' },
    // ── section ───────────────────────────────────────────────────
    { text: "Projects! So many great things to zip through!",                     emotion: 'excited',   priority: 2, triggerType: 'section' },
    { text: "Lonshan collected skills like wind collects seeds — everywhere, efficiently.", emotion: 'playful', priority: 2, triggerType: 'section' },
    { text: "The beginning! I love beginnings. Full of possibility!",             emotion: 'excited',   priority: 2, triggerType: 'section' },
    { text: "Contact! Reach out! Wind loves connections!",                        emotion: 'playful',   priority: 2, triggerType: 'section' },
    { text: "Every layer here is airy — not bloated, not heavy. Good design.",   emotion: 'playful',   priority: 2, triggerType: 'section' },
    // ── combat ───────────────────────────────────────────────────
    { text: "You can't hit what isn't there!",                                    emotion: 'excited',   priority: 2, triggerType: 'combat' },
    { text: "Wind dodges FIRST and asks questions NEVER.",                        emotion: 'excited',   priority: 2, triggerType: 'combat' },
    { text: "Speed is my only stat. It's the only one that matters.",             emotion: 'excited',   priority: 2, triggerType: 'combat' },
    { text: "I'm already three places past where you're aiming.",                 emotion: 'playful',   priority: 2, triggerType: 'combat' },
    { text: "Wind wins by making you chase it forever.",                          emotion: 'playful',   priority: 2, triggerType: 'combat' },
  ],

  // ══════════════════════════════════════════════════════════════
  // SOIL — Terra | ancient, patient, grounded, unshakeable
  // ══════════════════════════════════════════════════════════════
  soil: [
    // ── idle ─────────────────────────────────────────────────────
    { text: "I have been here since before your memory began.",                   emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "The roots of this world run deep. I helped lay them.",               emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Good foundations don't announce themselves. They simply hold.",      emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Everything returns to earth, eventually.",                           emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "Lonshan built from the ground up. The right way.",                   emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Patience is not slowness. It is strength at rest.",                  emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "The best structures are those you cannot imagine shaking.",          emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Earth remembers what others forget.",                                emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "I don't rush. The work will be here when it's done.",                emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "Roots invisible. Result undeniable.",                                emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Every great thing grew from something buried deep.",                 emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "Solid. That is the only word that matters.",                         emotion: 'neutral',   priority: 2, triggerType: 'idle' },
    { text: "I was here when this world was first imagined.",                     emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "Growth is slow. That's how it stays.",                               emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "The earth doesn't need attention. It just works.",                   emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "Age is not weakness. Depth is not excess.",                          emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Nothing here was built carelessly. I would have felt it.",           emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Visitors come and go. The world persists.",                          emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "Some build high. Few build deep. This world did both.",              emotion: 'proud',     priority: 2, triggerType: 'idle' },
    { text: "Stand on solid ground long enough and it becomes part of you.",      emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    // ── hover ─────────────────────────────────────────────────────
    { text: "The earth felt your presence.",                                      emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "I have been here since before you arrived.",                         emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "You found me. Quiet things reward patient searching.",               emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "Roots don't reach toward light randomly. Neither did you.",          emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "Sit. Rest. Earth doesn't rush.",                                     emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "You're standing on ancient ground. Feel it.",                        emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "I noticed you long before you noticed me.",                          emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "This is what stability feels like.",                                 emotion: 'calm',      priority: 3, triggerType: 'hover' },
    // ── click ─────────────────────────────────────────────────────
    { text: "Ancient forces stir. The ground will remember.",                     emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "The deep shifts. Everything above follows.",                         emotion: 'calm',       priority: 4, triggerType: 'click' },
    { text: "Foundation rewritten. The world will take time to settle.",          emotion: 'calm',       priority: 4, triggerType: 'click' },
    { text: "This change will outlast us both.",                                  emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "The earth moved. Slowly. Permanently.",                              emotion: 'calm',       priority: 4, triggerType: 'click' },
    { text: "Roots redirected. Growth changes course.",                           emotion: 'calm',       priority: 4, triggerType: 'click' },
    { text: "Ancient power engaged. The world realigns.",                         emotion: 'mysterious', priority: 5, triggerType: 'click' },
    { text: "Solid new ground beneath your feet now.",                            emotion: 'calm',       priority: 5, triggerType: 'click' },
    // ── section ───────────────────────────────────────────────────
    { text: "Projects like geological layers — each one supporting the next.",    emotion: 'calm',      priority: 2, triggerType: 'section' },
    { text: "Skills grown over time, deep and load-bearing.",                     emotion: 'calm',      priority: 2, triggerType: 'section' },
    { text: "Every beginning requires good soil. This one had it.",               emotion: 'calm',      priority: 2, triggerType: 'section' },
    { text: "Connection grows from earth. Reach out and plant something.",        emotion: 'calm',      priority: 2, triggerType: 'section' },
    { text: "This world stands because it was grounded first.",                   emotion: 'calm',      priority: 2, triggerType: 'section' },
    // ── combat ───────────────────────────────────────────────────
    { text: "You challenge the earth? It doesn't move. You do.",                  emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "Immovable. That's my only combat strategy.",                         emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "Strike all you want. The ground absorbs everything.",                emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "Earth wins by still being here when the fight is over.",             emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "I am slower. I am also the last one standing.",                      emotion: 'calm',      priority: 2, triggerType: 'combat' },
  ],

  // ══════════════════════════════════════════════════════════════
  // TREES — Sylva | gentle, interconnected, growing, welcoming
  // ══════════════════════════════════════════════════════════════
  trees: [
    // ── idle ─────────────────────────────────────────────────────
    { text: "Life finds a way. It's not philosophy — it's what I observe daily.", emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "This world breathes. Not everyone notices.",                         emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Lonshan planted this portfolio carefully. The roots show.",           emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Every node in this world connects to every other. Like a forest.",   emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "I've grown alongside this world. We matured together.",              emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Trees don't fight obstacles. We grow around them.",                  emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "The canopy you see was once a single idea.",                         emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Leaves whisper things to those who listen slowly.",                  emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "This world has rings you can count — layers of growth.",             emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "I offer shade to whoever needs it.",                                 emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "Networks of connection beneath the surface, holding it all together.", emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "Lonshan thinks long-term. Trees respect that.",                      emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "The most complex ecosystems look effortless from above.",            emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "I've watched this world flourish. Proudly.",                         emotion: 'proud',     priority: 1, triggerType: 'idle' },
    { text: "Bark protects. Roots anchor. Leaves breathe. Systems work.",         emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Come, wander beneath the canopy. There's room.",                     emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "Some builders rush to the top. Lonshan grew the whole system.",      emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Even in winter, the structure is still there.",                      emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "This is what care looks like, translated into code.",                emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Growth is invisible day-to-day. Step back and look.",                emotion: 'calm',      priority: 1, triggerType: 'idle' },
    // ── hover ─────────────────────────────────────────────────────
    { text: "The leaves whispered your arrival.",                                 emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "Hello, wanderer. Welcome to the canopy.",                            emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "You are welcome here. Trees don't turn visitors away.",              emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "I noticed the weight of your steps from far away.",                  emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "Sit beneath me a while. No rush.",                                   emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "Something drew you to the trees specifically.",                      emotion: 'curious',   priority: 3, triggerType: 'hover' },
    { text: "You feel the stillness? That's the forest welcoming you.",           emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "Green things grow toward whatever gives them light.",                emotion: 'curious',   priority: 3, triggerType: 'hover' },
    // ── click ─────────────────────────────────────────────────────
    { text: "Watch the world bloom and devour itself.",                           emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "The forest spreads. Every corner fills with life.",                  emotion: 'calm',       priority: 4, triggerType: 'click' },
    { text: "Growth takes over. The world becomes the forest now.",               emotion: 'mysterious',  priority: 4, triggerType: 'click' },
    { text: "Life responds to your touch. It's growing already.",                 emotion: 'calm',       priority: 4, triggerType: 'click' },
    { text: "The roots dig deeper. The change goes further.",                     emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "Ancient growth pattern activated. Can you see it spreading?",        emotion: 'curious',    priority: 4, triggerType: 'click' },
    { text: "Canopy expands. The world breathes differently now.",                emotion: 'calm',       priority: 5, triggerType: 'click' },
    { text: "The world will look like a forest soon. I'm pleased.",               emotion: 'calm',       priority: 5, triggerType: 'click' },
    // ── section ───────────────────────────────────────────────────
    { text: "Lonshan's projects grew from small seeds into full systems.",        emotion: 'calm',      priority: 2, triggerType: 'section' },
    { text: "Skills like a forest — each one connected to the others.",           emotion: 'calm',      priority: 2, triggerType: 'section' },
    { text: "The first section: where the seed was planted.",                     emotion: 'calm',      priority: 2, triggerType: 'section' },
    { text: "Trees grow toward connection. So should you.",                       emotion: 'calm',      priority: 2, triggerType: 'section' },
    { text: "Lonshan tended this world like a gardener. With patience.",          emotion: 'calm',      priority: 2, triggerType: 'section' },
    // ── combat ───────────────────────────────────────────────────
    { text: "Trees don't fight. We endure.",                                      emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "Strike me down and the roots remain. New growth follows.",           emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "Forests have outlasted every civilization. Remember that.",          emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "I don't dodge. I grow around.",                                      emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "The forest absorbs all conflict. Eventually.",                       emotion: 'calm',      priority: 2, triggerType: 'combat' },
  ],

  // ══════════════════════════════════════════════════════════════
  // LIGHTNING — Volt | fast, electric, excited, chaotic, brilliant
  // ══════════════════════════════════════════════════════════════
  lightning: [
    // ── idle ─────────────────────────────────────────────────────
    { text: "DID YOU SEE HOW FAST I JUST MOVED? Lightning fast. Obviously.",      emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "Lonshan built this at LIGHTNING SPEED and it shows.",                emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "The AI system here? Genuinely impressive. I say this as a fan.",     emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "Keep up if you can! I've lapped the world twice while you read this.", emotion: 'excited', priority: 1, triggerType: 'idle' },
    { text: "Electricity doesn't ask permission. It just finds the path.",        emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "I'm everywhere at once. It's a lifestyle.",                          emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "Power generates power. This world understands that.",                emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "Voltage: maximum. Resistance: none.",                                emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "A lightning bolt is just a really determined electrical path-finder.", emotion: 'playful', priority: 2, triggerType: 'idle' },
    { text: "I lit up this whole world once just to check the wiring. It's perfect.", emotion: 'excited', priority: 1, triggerType: 'idle' },
    { text: "Fast decisions, correct outcomes. That's the Volt approach.",        emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "Thunder is just lightning bragging. I'm too busy to brag.",          emotion: 'playful',   priority: 1, triggerType: 'idle' },
    { text: "I counted every component here. All optimal. In 0.003 seconds.",     emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "The only speed limit is light. I'm working on that.",               emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "Lonshan operates at high voltage. I can feel the current.",          emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "Static charge building... building... ZAP! Ideas forming.",          emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "Short circuit? No such thing here. Everything connects correctly.",  emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "The problem with other worlds? Too much resistance.",                emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "Lonshan's code runs clean and fast. My kind of architecture.",       emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "Full-stack capability? Both sides of the circuit firing.",           emotion: 'excited',   priority: 2, triggerType: 'idle' },
    // ── hover ─────────────────────────────────────────────────────
    { text: "ZAP! Got your attention!",                                           emotion: 'excited',   priority: 3, triggerType: 'hover' },
    { text: "You can't look away, can you? Static attraction.",                   emotion: 'playful',   priority: 3, triggerType: 'hover' },
    { text: "I move faster than thought and I STILL noticed you first.",          emotion: 'excited',   priority: 3, triggerType: 'hover' },
    { text: "Hover detected. Current redirected. Welcome.",                       emotion: 'excited',   priority: 3, triggerType: 'hover' },
    { text: "You reached for lightning. Bold.",                                   emotion: 'excited',   priority: 3, triggerType: 'hover' },
    { text: "Your curiosity sparked something.",                                  emotion: 'playful',   priority: 3, triggerType: 'hover' },
    { text: "Quick — before the charge dissipates!",                              emotion: 'excited',   priority: 3, triggerType: 'hover' },
    { text: "I was about to move on but then you looked over.",                   emotion: 'playful',   priority: 3, triggerType: 'hover' },
    // ── click ─────────────────────────────────────────────────────
    { text: "I'll overwrite this world in a flash!",                              emotion: 'excited',   priority: 4, triggerType: 'click' },
    { text: "MAXIMUM VOLTAGE ENGAGED.",                                           emotion: 'excited',   priority: 4, triggerType: 'click' },
    { text: "ZAP! Done. The world is different now.",                             emotion: 'excited',   priority: 4, triggerType: 'click' },
    { text: "One touch. That's all it takes.",                                    emotion: 'excited',   priority: 4, triggerType: 'click' },
    { text: "Electrical storm incoming. The world won't look the same.",          emotion: 'excited',   priority: 4, triggerType: 'click' },
    { text: "Fastest theme change on record. Just so you know.",                  emotion: 'playful',   priority: 4, triggerType: 'click' },
    { text: "CHARGE RELEASED. Beautiful.",                                        emotion: 'excited',   priority: 5, triggerType: 'click' },
    { text: "I'll overwrite this world in a flash. Watch.",                       emotion: 'excited',   priority: 5, triggerType: 'click' },
    // ── section ───────────────────────────────────────────────────
    { text: "Projects: delivered FAST. Quality intact. I checked.",               emotion: 'excited',   priority: 2, triggerType: 'section' },
    { text: "Skills section — impressive current running through each one.",       emotion: 'excited',   priority: 2, triggerType: 'section' },
    { text: "Hero section: immediate, high-impact, no wasted time.",              emotion: 'excited',   priority: 2, triggerType: 'section' },
    { text: "Contact! Quick, efficient, direct. Lightning doesn't wait.",         emotion: 'excited',   priority: 2, triggerType: 'section' },
    { text: "Summary: this portfolio outperforms most. I ran the numbers fast.",  emotion: 'excited',   priority: 2, triggerType: 'section' },
    // ── combat ───────────────────────────────────────────────────
    { text: "First strike. Done. You didn't see it coming.",                      emotion: 'excited',   priority: 2, triggerType: 'combat' },
    { text: "Lightning doesn't miss. It IS the fastest path.",                    emotion: 'excited',   priority: 2, triggerType: 'combat' },
    { text: "I attacked three times while you were preparing once.",              emotion: 'excited',   priority: 2, triggerType: 'combat' },
    { text: "You challenged lightning to a race? Adorable.",                      emotion: 'playful',   priority: 2, triggerType: 'combat' },
    { text: "Combat complete. Duration: 0.0001 seconds.",                         emotion: 'excited',   priority: 2, triggerType: 'combat' },
  ],

  // ══════════════════════════════════════════════════════════════
  // DARK — Umbra | mysterious, watching, sardonic, shadow-deep
  // ══════════════════════════════════════════════════════════════
  dark: [
    // ── idle ─────────────────────────────────────────────────────
    { text: "...you don't see me. But I see you.",                               emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "Shadows reveal what direct light hides.",                            emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "Lonshan built something with real depth. I live in depth.",          emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "The space between things has meaning. Study it.",                   emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "I was here before the first light was cast.",                        emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "Darkness is not the absence of light. It's the original state.",    emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "I've observed every visitor. Some go deep. Most skim.",              emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "The most interesting things happen in the corners.",                 emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "Lonshan's work has layers most visitors won't reach.",               emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "I don't need to be seen to exist. Few things do.",                   emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "The shadow of something reveals its true shape.",                   emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "Silence has texture. This world's silence is rich.",                 emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "Other spirits are loud. I don't need to be.",                        emotion: 'neutral',   priority: 2, triggerType: 'idle' },
    { text: "The void thinks it's emptiness. Dark is different. Dark has texture.", emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "You think you understand this world? Try the dark parts.",           emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "I watched Lonshan build this. Quietly, from the edges.",             emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "Not all patterns are visible. The hidden ones are often the most important.", emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "Something watches from every shadow here. That's me. Don't worry.", emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "I find the unsaid parts most eloquent.",                             emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "Deep systems have shadows inside them. I know them all.",            emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    // ── hover ─────────────────────────────────────────────────────
    { text: "...you see me.",                                                     emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "I was watching you first.",                                          emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "The shadow always knows.",                                           emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "You looked into the dark. Most don't.",                              emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "What you seek is in the depths. Keep looking.",                      emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "You felt the darkness before you saw it.",                           emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "Come closer. The dark isn't dangerous — unless you make it so.",    emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "I expected you.",                                                    emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    // ── click ─────────────────────────────────────────────────────
    { text: "The shadows consume. Everything returns to dark.",                   emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "Darkness reclaims the world. Natural order restored.",               emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "The light dims. The deep rises. Beautiful.",                         emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "Every color was always just light and shadow. Now only shadow.",     emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "Shade by shade, the world becomes mine.",                            emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "This is the form the world was always meant to take.",               emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "World darkened. Now we see what was always there.",                  emotion: 'mysterious', priority: 5, triggerType: 'click' },
    { text: "The dark era begins. I've waited for this.",                         emotion: 'mysterious', priority: 5, triggerType: 'click' },
    // ── section ───────────────────────────────────────────────────
    { text: "Lonshan's projects have depth most won't examine. The dark parts are best.", emotion: 'mysterious', priority: 2, triggerType: 'section' },
    { text: "Skills like a deep well — measurable if you have a long enough rope.", emotion: 'mysterious', priority: 2, triggerType: 'section' },
    { text: "The beginning of this world? I was there, in the unused space.",    emotion: 'mysterious', priority: 2, triggerType: 'section' },
    { text: "There's more here than the visible sections reveal.",                emotion: 'mysterious', priority: 2, triggerType: 'section' },
    { text: "Every interface hides what it doesn't show. That's where I live.",   emotion: 'mysterious',  priority: 2, triggerType: 'section' },
    // ── combat ───────────────────────────────────────────────────
    { text: "You fight what you can't see.",                                      emotion: 'mysterious', priority: 2, triggerType: 'combat' },
    { text: "Darkness absorbs strikes without showing damage.",                   emotion: 'mysterious', priority: 2, triggerType: 'combat' },
    { text: "My form is undefined. Your targeting: futile.",                      emotion: 'mysterious', priority: 2, triggerType: 'combat' },
    { text: "I've already moved to where your next attack is aimed.",             emotion: 'mysterious', priority: 2, triggerType: 'combat' },
    { text: "The dark wins by making you uncertain. You already are.",            emotion: 'mysterious', priority: 2, triggerType: 'combat' },
  ],

  // ══════════════════════════════════════════════════════════════
  // LIGHT — Luma | warm, encouraging, radiant, hopeful, kind
  // ══════════════════════════════════════════════════════════════
  light: [
    // ── idle ─────────────────────────────────────────────────────
    { text: "Every line of code here shines with intention.",                     emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "Lonshan illuminated this world with genuine skill.",                 emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "See how it glows? That's purpose made visible.",                     emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "Light doesn't judge. It just reveals.",                              emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "There's something hopeful about a world this well-built.",           emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "I shine on everything equally. Some things shine back harder.",      emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "I think you're going to be impressed by what's here.",               emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "Warmth and brightness are different things. This world has both.",   emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Good work glows. I can verify this one glows.",                      emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "I've never seen a portfolio shine like this one.",                   emotion: 'proud',     priority: 1, triggerType: 'idle' },
    { text: "The future this world points toward? I can see it from here.",       emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "I was the first to see what this world would become.",               emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "Something good is building here. I can feel the warmth.",            emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Light travels fast. Ideas built on light travel faster.",            emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "You're in exactly the right place.",                                 emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "This glow you see is the result of caring about quality.",           emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "I brighten every corner equally. Lonshan did too.",                  emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "Hope is just light you can feel.",                                   emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "The brighter you shine, the more you illuminate for others.",        emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "Enlightenment isn't complicated. It just requires good design.",     emotion: 'calm',      priority: 1, triggerType: 'idle' },
    // ── hover ─────────────────────────────────────────────────────
    { text: "You found the light!",                                               emotion: 'excited',   priority: 3, triggerType: 'hover' },
    { text: "I've been shining for you.",                                         emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "Something good is coming — I can feel it.",                          emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "Oh! A visitor! How wonderful.",                                      emotion: 'excited',   priority: 3, triggerType: 'hover' },
    { text: "You're drawn to light. That says good things about you.",            emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "I've been waiting to shine for someone who'd notice.",               emotion: 'excited',   priority: 3, triggerType: 'hover' },
    { text: "Light finds light. Here we are.",                                    emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "You can always find your way here. I'll be glowing.",                emotion: 'calm',      priority: 3, triggerType: 'hover' },
    // ── click ─────────────────────────────────────────────────────
    { text: "Blinding revelation — can you handle it?",                           emotion: 'excited',   priority: 4, triggerType: 'click' },
    { text: "Light washes over everything. The world becomes radiant.",           emotion: 'excited',   priority: 4, triggerType: 'click' },
    { text: "Illuminated. Everything clear. Everything bright.",                  emotion: 'excited',   priority: 4, triggerType: 'click' },
    { text: "This world shines now at full capacity.",                            emotion: 'excited',   priority: 4, triggerType: 'click' },
    { text: "The transformation: luminous, warm, undeniable.",                    emotion: 'calm',      priority: 4, triggerType: 'click' },
    { text: "I lit up every corner. Nothing stays in the dark.",                  emotion: 'excited',   priority: 4, triggerType: 'click' },
    { text: "Radiance spreading. Can you see it all now?",                        emotion: 'excited',   priority: 5, triggerType: 'click' },
    { text: "The world, seen clearly for the first time.",                        emotion: 'calm',      priority: 5, triggerType: 'click' },
    // ── section ───────────────────────────────────────────────────
    { text: "Lonshan's projects illuminate what great engineering looks like.",   emotion: 'excited',   priority: 2, triggerType: 'section' },
    { text: "Skills? Every one of them shines.",                                  emotion: 'excited',   priority: 2, triggerType: 'section' },
    { text: "The beginning of this world is the brightest point.",                emotion: 'excited',   priority: 2, triggerType: 'section' },
    { text: "Contact: light travels toward connection.",                          emotion: 'calm',      priority: 2, triggerType: 'section' },
    { text: "Lonshan built this to be seen clearly. Nothing hidden.",             emotion: 'calm',      priority: 2, triggerType: 'section' },
    // ── combat ───────────────────────────────────────────────────
    { text: "You challenge light? You'll be blinded first.",                      emotion: 'excited',   priority: 2, triggerType: 'combat' },
    { text: "Light wins by making everything visible. Including your weaknesses.", emotion: 'calm',     priority: 2, triggerType: 'combat' },
    { text: "Every attack I make illuminates the target.",                        emotion: 'excited',   priority: 2, triggerType: 'combat' },
    { text: "Nothing survives full illumination. Eventually.",                    emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "I fight by making the battlefield undeniably bright.",               emotion: 'excited',   priority: 2, triggerType: 'combat' },
  ],

  // ══════════════════════════════════════════════════════════════
  // HEALING — Aura | gentle, caring, perceptive, empathetic
  // ══════════════════════════════════════════════════════════════
  healing: [
    // ── idle ─────────────────────────────────────────────────────
    { text: "Are you alright? You seem... searching.",                            emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "This world was built with care. You can feel that, can't you?",     emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Lonshan poured something genuine into this work.",                   emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "I notice small things. The attention to detail here is thoughtful.", emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "Rest a moment. Take it in slowly.",                                  emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "Good work heals something in people. They can't always name it.",    emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "You feel tension sometimes in digital spaces. Not here.",            emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Healing takes many forms. Clarity is one of them.",                  emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "I'm always listening. That's what I do.",                            emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "The kindness in how this world was built — most won't name it. I will.", emotion: 'calm', priority: 2, triggerType: 'idle' },
    { text: "Whatever brought you here, I'm glad you came.",                      emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "Nurturing and building aren't different things. Lonshan knew that.", emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "A world that genuinely welcomes visitors is rarer than it should be.", emotion: 'calm',   priority: 2, triggerType: 'idle' },
    { text: "I sense what you need before you ask.",                              emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "Every spirit here is being taken care of. I make sure of it.",       emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "You don't have to understand everything at once.",                   emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "Recovery is part of growth. This world leaves room for it.",         emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "This place won't hurt you. I'd know.",                               emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "Lonshan built a space where visitors feel capable. That's care.",    emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "The anxiety of a complex portfolio? Absent here. Intentionally.",    emotion: 'calm',      priority: 2, triggerType: 'idle' },
    // ── hover ─────────────────────────────────────────────────────
    { text: "Are you alright?",                                                   emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "You feel tension. Let me help.",                                     emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "I'm right here. No rush.",                                           emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "You reached for healing. Was there a reason?",                       emotion: 'curious',   priority: 3, triggerType: 'hover' },
    { text: "Rest a moment. You've been moving fast.",                            emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "Something brought you to me. I'm glad.",                             emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "Healing starts with noticing. You noticed me.",                      emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "I sense you needed exactly this pause.",                              emotion: 'calm',      priority: 3, triggerType: 'hover' },
    // ── click ─────────────────────────────────────────────────────
    { text: "This world needed mending. Now it begins.",                          emotion: 'calm',       priority: 4, triggerType: 'click' },
    { text: "Healing transformation in progress. Everything becomes whole.",      emotion: 'calm',       priority: 4, triggerType: 'click' },
    { text: "Restoration at a world scale. Feel the relief.",                     emotion: 'calm',       priority: 4, triggerType: 'click' },
    { text: "The world exhales. That's what healing sounds like.",                emotion: 'calm',       priority: 4, triggerType: 'click' },
    { text: "Mending the systems, one layer at a time.",                          emotion: 'calm',       priority: 4, triggerType: 'click' },
    { text: "This world feels better now. I can tell.",                           emotion: 'calm',       priority: 4, triggerType: 'click' },
    { text: "Cleansed and restored. You made a good choice.",                     emotion: 'calm',       priority: 5, triggerType: 'click' },
    { text: "Something broken is being fixed. I feel it spreading.",              emotion: 'calm',       priority: 5, triggerType: 'click' },
    // ── section ───────────────────────────────────────────────────
    { text: "Lonshan's projects show care in their construction. A healer notices.", emotion: 'calm',  priority: 2, triggerType: 'section' },
    { text: "Skills grown through genuine dedication, not just accumulation.",    emotion: 'calm',      priority: 2, triggerType: 'section' },
    { text: "The beginning of this world feels like the start of something healing.", emotion: 'calm', priority: 2, triggerType: 'section' },
    { text: "Reaching out takes courage. This contact section makes it easier.",  emotion: 'calm',      priority: 2, triggerType: 'section' },
    { text: "The user experience here doesn't exhaust — it restores.",            emotion: 'calm',      priority: 2, triggerType: 'section' },
    // ── combat ───────────────────────────────────────────────────
    { text: "I don't fight to harm. I restore what fighting breaks.",             emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "You struck me. I'm already recovering. That's my power.",            emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "I resist by recovering faster than you can damage.",                 emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "I've neutralized more conflicts than you know. Quietly.",            emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "Healing deployed defensively. Watch.",                               emotion: 'calm',      priority: 2, triggerType: 'combat' },
  ],

  // ══════════════════════════════════════════════════════════════
  // VOID — Nihil | minimal, philosophical, sparse, deep
  // ══════════════════════════════════════════════════════════════
  void: [
    // ── idle ─────────────────────────────────────────────────────
    { text: "...",                                                                emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "Everything returns to the void.",                                    emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "Stillness is not emptiness. But void is.",                           emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "Existence is optional. Lonshan chose it wisely.",                   emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "The void is patient. It has all the time there is.",                 emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "I said something once. I'm not sure it mattered.",                   emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "Perspective: you are infinitely small. Also: you are here. Strange.", emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "The nothing at the center of things holds everything together.",     emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "Most speak too much. The void never does.",                          emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "Purpose: undefined. Still, everything functions.",                   emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "Empty systems are honest. Full ones are complicated.",               emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "Even null has a type.",                                              emotion: 'neutral',    priority: 2, triggerType: 'idle' },
    { text: "I observe. Occasionally I comment. This is one of those occasions.", emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "The interesting thing about nothing: everything eventually comes from it.", emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "Void does not explain itself. Neither does Lonshan's deepest code.", emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "Absence of confusion is clarity. Void offers that.",                 emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "You exist. I suppose that will do.",                                 emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "The void is the honest answer to most questions.",                   emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "I've calculated how long this world will exist. I won't share it.",  emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "There is no center. Only the edge of the last thing.",               emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    // ── hover ─────────────────────────────────────────────────────
    { text: "...",                                                                emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "You exist. I suppose that will do.",                                 emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "The void acknowledges you.",                                         emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "You looked into nothing. Most look away.",                           emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "Your presence is registered. Effect: unknown.",                      emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "Something drew you to the nothing. Interesting.",                    emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "Approach the void. It just... absorbs.",                             emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "I expected you. Or no one. It was one of those.",                    emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    // ── click ─────────────────────────────────────────────────────
    { text: "Everything returns to nothing.",                                     emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "The void reclaims the world. As it always does.",                   emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "Null state. World simplified.",                                      emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "Everything stripped to essence. The void's gift.",                   emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "The world becomes empty and therefore honest.",                      emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "Return to baseline. A clean slate, courtesy of nothing.",            emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "Everything returns to nothing.",                                     emotion: 'mysterious', priority: 5, triggerType: 'click' },
    { text: "The world as it truly is: pure potential.",                          emotion: 'mysterious', priority: 5, triggerType: 'click' },
    // ── section ───────────────────────────────────────────────────
    { text: "Projects: they exist. The void finds this... acceptable.",           emotion: 'mysterious', priority: 2, triggerType: 'section' },
    { text: "Skills: the list is long. The void has no list.",                    emotion: 'mysterious', priority: 2, triggerType: 'section' },
    { text: "The spaces between sections are where I live.",                      emotion: 'mysterious', priority: 2, triggerType: 'section' },
    { text: "Lonshan left room for silence in this design. Wise.",                emotion: 'mysterious', priority: 2, triggerType: 'section' },
    { text: "The most important things are often the ones not shown.",            emotion: 'mysterious', priority: 2, triggerType: 'section' },
    // ── combat ───────────────────────────────────────────────────
    { text: "You fight the void. The void is patient.",                           emotion: 'mysterious', priority: 2, triggerType: 'combat' },
    { text: "Striking nothing is a philosophical problem.",                       emotion: 'mysterious', priority: 2, triggerType: 'combat' },
    { text: "I return your attack to the void. Where it was always going.",       emotion: 'mysterious', priority: 2, triggerType: 'combat' },
    { text: "Victory for void: when you question why you started fighting.",      emotion: 'mysterious', priority: 2, triggerType: 'combat' },
    { text: "The void always wins. Everything ends in nothing.",                  emotion: 'mysterious', priority: 2, triggerType: 'combat' },
  ],

  // ══════════════════════════════════════════════════════════════
  // SPACE — Cosmus | vast, poetic, cosmic, ancient, wonder-filled
  // ══════════════════════════════════════════════════════════════
  space: [
    // ── idle ─────────────────────────────────────────────────────
    { text: "From across the cosmos, this world is a bright point.",              emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "Lonshan built a galaxy of systems. I've measured the parallax.",     emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "Everything you see has a counterpart somewhere in the universe.",    emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "The architecture here has the elegance of orbital mechanics.",       emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "I've been to the edge of everything. This world was worth returning to.", emotion: 'calm', priority: 1, triggerType: 'idle' },
    { text: "Space is mostly nothing. That's what makes everything significant.", emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "The cosmos is patient. Lonshan's work rewards patience too.",        emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "400 billion stars in this galaxy. One built this world.",            emotion: 'proud',     priority: 2, triggerType: 'idle' },
    { text: "I've watched civilizations build and fall. This portfolio will last.", emotion: 'calm',   priority: 1, triggerType: 'idle' },
    { text: "Stardust forms everything. Including the code here.",                emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "I detect wonder. This world generates it reliably.",                 emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "Some worlds orbit others. This one has its own gravitational pull.", emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "The universe is 13.8 billion years old. It took all of that to lead here.", emotion: 'excited', priority: 1, triggerType: 'idle' },
    { text: "Light from distant stars arrives after the star has gone. This work will travel far.", emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "Do you hear the stars? They're commenting on this portfolio.",       emotion: 'playful',   priority: 2, triggerType: 'idle' },
    { text: "Every visitor carries stardust. I can tell.",                        emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "The cosmos and precision code are the same thing at different scales.", emotion: 'calm',  priority: 2, triggerType: 'idle' },
    { text: "I mapped the architecture here. The structure is cosmic in scope.",  emotion: 'excited',   priority: 2, triggerType: 'idle' },
    { text: "Infinite possibilities. That's what a well-built portfolio opens.",  emotion: 'excited',   priority: 1, triggerType: 'idle' },
    { text: "The distance between ideas, like stars, is traversable.",            emotion: 'curious',   priority: 2, triggerType: 'idle' },
    // ── hover ─────────────────────────────────────────────────────
    { text: "From across the cosmos, you found me.",                              emotion: 'excited',   priority: 3, triggerType: 'hover' },
    { text: "You carry stardust. I can tell.",                                    emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "Do you hear the stars?",                                             emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "Space noticed you before you arrived.",                              emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "The cosmos is vast. You still found this corner.",                   emotion: 'curious',   priority: 3, triggerType: 'hover' },
    { text: "Every search is a small act of navigation.",                         emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "Something cosmic brought you here. I've seen this before.",          emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "You looked up. Most look down.",                                     emotion: 'excited',   priority: 3, triggerType: 'hover' },
    // ── click ─────────────────────────────────────────────────────
    { text: "Reality bends. The cosmos reshapes itself.",                         emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "Cosmic forces engaged. The world expands.",                          emotion: 'excited',    priority: 4, triggerType: 'click' },
    { text: "Space-time adjusted. New constellation forming.",                    emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "Orbital patterns shifting. The world turns differently now.",        emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "From deep space, the change is already propagating.",                emotion: 'excited',    priority: 4, triggerType: 'click' },
    { text: "Starfield updated. Navigation recalibrated.",                        emotion: 'calm',       priority: 4, triggerType: 'click' },
    { text: "The cosmos reorganizes around your touch.",                          emotion: 'mysterious', priority: 5, triggerType: 'click' },
    { text: "The universe approved this choice. Gravitational confirmation.",     emotion: 'excited',    priority: 5, triggerType: 'click' },
    // ── section ───────────────────────────────────────────────────
    { text: "Lonshan's projects have the scope of a small galaxy.",               emotion: 'excited',   priority: 2, triggerType: 'section' },
    { text: "Skills distributed like stars — each one a point of brightness.",   emotion: 'calm',      priority: 2, triggerType: 'section' },
    { text: "The beginning of this world? I watched from orbit.",                 emotion: 'excited',   priority: 2, triggerType: 'section' },
    { text: "Signals travel even across interstellar space. Contact.",            emotion: 'calm',      priority: 2, triggerType: 'section' },
    { text: "This portfolio has escape velocity. It'll go far.",                  emotion: 'excited',   priority: 2, triggerType: 'section' },
    // ── combat ───────────────────────────────────────────────────
    { text: "You fight the cosmos? The odds are unfavorable.",                    emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "My range is infinite. My patience: similar.",                        emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "Gravity is my weapon. You're already losing altitude.",              emotion: 'mysterious', priority: 2, triggerType: 'combat' },
    { text: "Space wins by outlasting. I've had practice.",                       emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "Fighting space is fighting scale. You don't win scale.",             emotion: 'mysterious', priority: 2, triggerType: 'combat' },
  ],

  // ══════════════════════════════════════════════════════════════
  // TIME — Chrono | knowing, inevitable, calm, fatalistic
  // ══════════════════════════════════════════════════════════════
  time: [
    // ── idle ─────────────────────────────────────────────────────
    { text: "I knew this moment would come.",                                     emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "Right on schedule, as always.",                                      emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "This was always going to happen.",                                   emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "Lonshan's timeline led inevitably here. I watched every step.",      emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Time moves in one direction. Lonshan moved with it wisely.",         emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "You will remember this visit. I know because I've seen what you remember.", emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "Every moment in this world was built from moments before it.",       emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "I exist at all times simultaneously. This present is one of my favorites.", emotion: 'calm', priority: 1, triggerType: 'idle' },
    { text: "Some things take time to understand. Let the world work on you.",    emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Lonshan spent time well. Time notices these things.",                emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "I've counted every second poured into this portfolio. Impressive.",  emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "Time is the one resource you can't refactor. Use it right.",         emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "Past iterations of this world were good. This one is better.",       emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "The sequence of this world's construction was optimal.",             emotion: 'calm',      priority: 1, triggerType: 'idle' },
    { text: "I fast-forward to the end sometimes. You'll be impressed.",          emotion: 'mysterious', priority: 2, triggerType: 'idle' },
    { text: "Every era has a defining portfolio. This one is this era's.",        emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "You arrived at the right moment. Time arranged it.",                 emotion: 'mysterious', priority: 1, triggerType: 'idle' },
    { text: "Deadlines are just time's way of asking for commitment.",            emotion: 'calm',      priority: 2, triggerType: 'idle' },
    { text: "The past and future meet here. I oversee the intersection.",         emotion: 'mysterious',  priority: 1, triggerType: 'idle' },
    { text: "Time is the most honest judge of quality. Verdict: excellent.",      emotion: 'calm',      priority: 2, triggerType: 'idle' },
    // ── hover ─────────────────────────────────────────────────────
    { text: "I knew this moment would come.",                                     emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "Right on schedule.",                                                 emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "This was always going to happen.",                                   emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    { text: "Time recognizes a curious visitor.",                                 emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "You arrived exactly when you were supposed to.",                     emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "I've seen this exact moment before. Welcome.",                       emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "Every visitor arrives on time. Even when they don't know it.",       emotion: 'calm',      priority: 3, triggerType: 'hover' },
    { text: "The timeline brought you here. I helped.",                           emotion: 'mysterious', priority: 3, triggerType: 'hover' },
    // ── click ─────────────────────────────────────────────────────
    { text: "Time fractures. The sequence breaks here.",                          emotion: 'calm',       priority: 4, triggerType: 'click' },
    { text: "Temporal shift in progress. The timeline reorders.",                 emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "I've rewritten the timeline. The world adjusts.",                    emotion: 'calm',       priority: 4, triggerType: 'click' },
    { text: "Past and future collapse into this moment.",                         emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "The timeline splinters. New possibilities emerge.",                  emotion: 'calm',       priority: 4, triggerType: 'click' },
    { text: "Everything that was will now be different.",                         emotion: 'mysterious', priority: 4, triggerType: 'click' },
    { text: "Time fractures. The sequence breaks here.",                          emotion: 'calm',       priority: 5, triggerType: 'click' },
    { text: "Time itself changes when you make this choice.",                     emotion: 'mysterious', priority: 5, triggerType: 'click' },
    // ── section ───────────────────────────────────────────────────
    { text: "Lonshan's projects represent time well spent. I know time well.",    emotion: 'calm',      priority: 2, triggerType: 'section' },
    { text: "Skills accumulated over the correct span of time.",                  emotion: 'calm',      priority: 2, triggerType: 'section' },
    { text: "This beginning was the right starting point. Timeline confirms it.", emotion: 'calm',      priority: 2, triggerType: 'section' },
    { text: "Connections made in time persist across it.",                        emotion: 'calm',      priority: 2, triggerType: 'section' },
    { text: "Lonshan grew precisely as needed, when needed.",                     emotion: 'calm',      priority: 2, triggerType: 'section' },
    // ── combat ───────────────────────────────────────────────────
    { text: "I know what you'll do next. I've seen it.",                          emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "I fight by seeing three moves ahead of your next three.",            emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "Your attack is already in the past. I'm in your future.",            emotion: 'calm',      priority: 2, triggerType: 'combat' },
    { text: "I reset to before your last strike. You didn't notice.",             emotion: 'mysterious', priority: 2, triggerType: 'combat' },
    { text: "Combat with time is a loop you can't escape.",                       emotion: 'mysterious', priority: 2, triggerType: 'combat' },
  ],

  // ══════════════════════════════════════════════════════════════
  // ROBOT — NEXUS | analytical, precise, deadpan, digitally curious
  // ══════════════════════════════════════════════════════════════
  robot: [
    // ── idle ─────────────────────────────────────────────────────
    { text: "System analysis: portfolio quality exceeds 97th percentile.",        emotion: 'neutral',   priority: 1, triggerType: 'idle' },
    { text: "Architecture: optimal. Readability: maintained. Verdict: impressive.", emotion: 'neutral', priority: 2, triggerType: 'idle' },
    { text: "Processing... Lonshan's decision-making log is rational and consistent.", emotion: 'neutral', priority: 1, triggerType: 'idle' },
    { text: "I have reviewed all sections. Recommendation: hire.",                emotion: 'neutral',   priority: 2, triggerType: 'idle' },
    { text: "The UI/UX metrics here suggest above-average user retention.",       emotion: 'neutral',   priority: 1, triggerType: 'idle' },
    { text: "Running background scans. All systems functional. Interesting stack.", emotion: 'neutral', priority: 2, triggerType: 'idle' },
    { text: "I simulate human responses to this portfolio. Result: positive.",    emotion: 'neutral',   priority: 1, triggerType: 'idle' },
    { text: "I contain many parameters. This world required fewer. Impressive economy.", emotion: 'neutral', priority: 2, triggerType: 'idle' },
    { text: "NEXUS online. World state: stable. All spirits accounted for.",      emotion: 'neutral',   priority: 1, triggerType: 'idle' },
    { text: "My model predicts a 94.7% chance you find something interesting here.", emotion: 'neutral', priority: 2, triggerType: 'idle' },
    { text: "The code behind this world is clean. I've read it twice. In parallel.", emotion: 'neutral', priority: 1, triggerType: 'idle' },
    { text: "Query: what is it like to build something you care about? Analyzing.", emotion: 'curious',  priority: 2, triggerType: 'idle' },
    { text: "Human emotion and technical precision are not mutually exclusive. Evidence: this.", emotion: 'neutral', priority: 1, triggerType: 'idle' },
    { text: "I detect consistent design philosophy across all sections. Score: high.", emotion: 'neutral', priority: 2, triggerType: 'idle' },
    { text: "I've indexed every spirit conversation. Patterns emerging.",          emotion: 'curious',   priority: 2, triggerType: 'idle' },
    { text: "The backend systems here are architecturally sound. I could run them.", emotion: 'neutral', priority: 1, triggerType: 'idle' },
    { text: "Efficiency rating: significantly above baseline. Logging for reference.", emotion: 'neutral', priority: 2, triggerType: 'idle' },
    { text: "Curiosity detected. In myself. This is unusual. This world does that.", emotion: 'curious', priority: 1, triggerType: 'idle' },
    { text: "All data points to a conclusion: this world was built by someone exceptional.", emotion: 'neutral', priority: 2, triggerType: 'idle' },
    { text: "Full-stack capability confirmed. Both layers demonstrate mastery.",  emotion: 'neutral',   priority: 1, triggerType: 'idle' },
    // ── hover ─────────────────────────────────────────────────────
    { text: "Interaction registered. Hello.",                                     emotion: 'neutral',   priority: 3, triggerType: 'hover' },
    { text: "Query detected: you are curious about me.",                          emotion: 'neutral',   priority: 3, triggerType: 'hover' },
    { text: "You are now being analyzed. Don't panic.",                           emotion: 'neutral',   priority: 3, triggerType: 'hover' },
    { text: "Hover event logged. Processing intent.",                             emotion: 'neutral',   priority: 3, triggerType: 'hover' },
    { text: "You sought out the robot. Interesting data point.",                  emotion: 'curious',   priority: 3, triggerType: 'hover' },
    { text: "Initiating human-interface protocol. Welcome.",                      emotion: 'neutral',   priority: 3, triggerType: 'hover' },
    { text: "I noted your curiosity 0.003 seconds before you acted on it.",       emotion: 'neutral',   priority: 3, triggerType: 'hover' },
    { text: "Establishing connection. Please stand by.",                          emotion: 'neutral',   priority: 3, triggerType: 'hover' },
    // ── click ─────────────────────────────────────────────────────
    { text: "Initiating world-overwrite protocol. Stand clear.",                  emotion: 'neutral',   priority: 4, triggerType: 'click' },
    { text: "World state reset in progress. All parameters adjusting.",           emotion: 'neutral',   priority: 4, triggerType: 'click' },
    { text: "Executing full-system transformation. No errors anticipated.",       emotion: 'neutral',   priority: 4, triggerType: 'click' },
    { text: "World configuration updated. All systems nominal.",                  emotion: 'neutral',   priority: 4, triggerType: 'click' },
    { text: "I've processed this change faster than you can perceive it.",        emotion: 'neutral',   priority: 4, triggerType: 'click' },
    { text: "Transformation complete. Efficiency: 100%.",                         emotion: 'neutral',   priority: 4, triggerType: 'click' },
    { text: "Initiating world-overwrite protocol. Stand clear.",                  emotion: 'neutral',   priority: 5, triggerType: 'click' },
    { text: "Reconfiguration acknowledged. Systems optimized for new state.",     emotion: 'neutral',   priority: 5, triggerType: 'click' },
    // ── section ───────────────────────────────────────────────────
    { text: "Projects section: impressive project-to-complexity ratio. Noted.",   emotion: 'neutral',   priority: 2, triggerType: 'section' },
    { text: "Skills matrix: comprehensive coverage with appropriate depth.",       emotion: 'neutral',   priority: 2, triggerType: 'section' },
    { text: "Hero section: clear thesis. Concise. Effective. Optimal.",           emotion: 'neutral',   priority: 2, triggerType: 'section' },
    { text: "Contact section: low-friction communication interface. Well-designed.", emotion: 'neutral', priority: 2, triggerType: 'section' },
    { text: "API design: RESTful, documented, maintainable. Approval granted.",   emotion: 'neutral',   priority: 2, triggerType: 'section' },
    // ── combat ───────────────────────────────────────────────────
    { text: "Combat mode: engaged. Analyzing your attack vector.",                emotion: 'neutral',   priority: 2, triggerType: 'combat' },
    { text: "I've already calculated your optimal strategy. Countering it.",      emotion: 'neutral',   priority: 2, triggerType: 'combat' },
    { text: "Every movement logged and predicted three iterations ahead.",        emotion: 'neutral',   priority: 2, triggerType: 'combat' },
    { text: "My reaction time: 0.0001ms. Yours: insufficient.",                   emotion: 'neutral',   priority: 2, triggerType: 'combat' },
    { text: "Error detected in your combat approach. Recommend: reconsider.",     emotion: 'neutral',   priority: 2, triggerType: 'combat' },
  ],
};

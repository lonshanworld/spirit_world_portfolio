/**
 * ai.service.ts
 * Core Gemini 2.5 Flash integration for the spirit dialogue system.
 *
 * Features:
 *  - Per-spirit cooldown (MIN_SPIRIT_COOLDOWN_MS)
 *  - Global concurrency cap (MAX_CONCURRENT)
 *  - Automatic fallback to static scripts if API key missing or quota hit
 *  - Single-line generation (spirit-to-user / spirit-to-spirit individual)
 *  - Conversation generation (multi-spirit sequences)
 */
import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { ElementType, EmotionType, IDialogueLine } from '../spirits/interfaces/spirit.interface';
import { WorldContext } from '../world/world-context.interface';
import { PromptBuilder } from './prompt.builder';

// ── Throttle constants ─────────────────────────────────────────────
const MIN_SPIRIT_COOLDOWN_MS = 8_000;  // minimum gap between two lines from same spirit
const MAX_CONCURRENT = 2;              // max simultaneous Gemini requests
const GEMINI_MODEL = 'gemini-2.5-flash-lite';
const NON_DIEGETIC_PATTERNS: RegExp[] = [
  /\bthe user\b/i,
  /\buser is asking\b/i,
  /\bhe is asking\b/i,
  /\bshe is asking\b/i,
  /\bas an ai\b/i,
  /\bassistant\b/i,
  /\bsystem prompt\b/i,
  /\bhere is (a|the) response\b/i,
  /\bcontext:\b/i,
  /\bmetadata\b/i,
  /\brole:\b/i,
  /\bconstraints?:\b/i,
];

// ── Static fallback pool ───────────────────────────────────────────
// Used when AI is unavailable — keeps the world feeling alive
const FALLBACK_LINES: Record<ElementType, string[]> = {
  fire:      ['My flames never dim.', 'This world burns brighter because of Lonshan.', 'Feel the heat of creation.'],
  water:     ['Still waters run deep here.', 'Every system flows into the next.', 'Patience shapes all things.'],
  ice:       ['Precision. Always precision.', 'Efficiently constructed.', 'Cold logic reveals warm creativity.'],
  wind:      ['So much to explore here...', 'Ideas move like wind — everywhere at once!', 'Oh! Did you see that?'],
  soil:      ['Roots run deep in this world.', 'Built on solid foundations.', 'The earth remembers.'],
  trees:     ['This world grows with each visitor.', 'Lonshan planted these seeds carefully.', 'We grow together.'],
  lightning: ['Built at lightning speed, obviously.', 'The AI system? Genuinely impressive.', 'Keep up if you can!'],
  dark:      ['Shadows reveal what light obscures.', 'The deeper you look, the more you find.', 'Interesting choice, coming here.'],
  light:     ['Every line of code here shines.', 'Lonshan illuminated this with genuine skill.', 'See how it glows?'],
  healing:   ['You seem curious. That is good.', 'This world was built with care.', 'You are welcome here.'],
  void:      ['...', 'Stillness speaks.', 'Everything returns to the void.'],
  space:     ['Across the cosmos, few build worlds like this.', 'The architecture is... vast.', 'Infinite possibilities.'],
  time:      ['I have seen this moment before.', 'What you seek, you have already found.', 'Past and future are one here.'],
  robot:     ['System analysis: portfolio quality exceeds 97th percentile.', 'Architecture: optimal.', 'Processing... impressive data.'],
};

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private model: GenerativeModel | null = null;
  private readonly lastSpoke = new Map<ElementType, number>();
  private activeRequests = 0;

  constructor(private readonly promptBuilder: PromptBuilder) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({
          model: GEMINI_MODEL,
          generationConfig: {
            maxOutputTokens: 120,   // ~1-2 sentences
            temperature: 0.88,
            topP: 0.92,
          },
        });
        this.logger.log(`Gemini AI initialised (${GEMINI_MODEL})`);
      } catch (err) {
        this.logger.warn('Gemini init failed — falling back to static dialogue', err);
      }
    } else {
      this.logger.warn('GEMINI_API_KEY not set — using static fallback dialogue');
    }
  }

  // ── Cooldown check ─────────────────────────────────────────────

  canSpirit(spiritId: ElementType): boolean {
    const last = this.lastSpoke.get(spiritId) ?? 0;
    return Date.now() - last >= MIN_SPIRIT_COOLDOWN_MS;
  }

  private markSpoke(spiritId: ElementType): void {
    this.lastSpoke.set(spiritId, Date.now());
  }

  // ── Single-line generation ─────────────────────────────────────

  /**
   * Generate a single dialogue line for one spirit.
   * Falls back to static pool if AI unavailable or over concurrency limit.
   */
  async generateLine(
    spiritId: ElementType,
    emotion: EmotionType,
    context: WorldContext,
    targetUser = false,
  ): Promise<IDialogueLine> {
    this.markSpoke(spiritId);

    let text: string;

    if (this.model && this.activeRequests < MAX_CONCURRENT) {
      this.activeRequests++;
      try {
        const systemPrompt = this.promptBuilder.buildSystemPrompt(spiritId, emotion);
        const userPrompt = this.promptBuilder.buildUserPrompt(context);

        // Use a fresh model instance with the system instruction per call
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const m = genAI.getGenerativeModel({
          model: GEMINI_MODEL,
          systemInstruction: systemPrompt,
          generationConfig: { maxOutputTokens: 120, temperature: 0.88, topP: 0.92 },
        });

        const safePrompt = userPrompt.replace(/<\|think\|>/gi, '').trim();
        const result = await m.generateContent(safePrompt);
        const cleaned = this.cleanResponse(result.response.text());
        text = cleaned || this.getFallback(spiritId);
      } catch (err) {
        this.logger.error(`Gemini generation failed for ${spiritId}:`, err);
        text = this.getFallback(spiritId);
      } finally {
        this.activeRequests--;
      }
    } else {
      text = this.getFallback(spiritId);
    }

    return {
      spiritId,
      text,
      delay: 0,
      emotion,
      targetUser,
    };
  }

  // ── Multi-spirit conversation ──────────────────────────────────

  /**
   * Generate a natural conversation between 2-3 spirits.
   * Returns an array of dialogue lines with staggered delays.
   */
  async generateConversation(
    speakers: Array<{ id: ElementType; name: string; emotion: EmotionType }>,
    context: WorldContext,
    lineCount: number,
  ): Promise<IDialogueLine[]> {
    // Clamp line count
    const count = Math.max(2, Math.min(lineCount, 5));

    if (!this.model || this.activeRequests >= MAX_CONCURRENT) {
      return this.getFallbackConversation(speakers, count);
    }

    this.activeRequests++;
    try {
      const { systemPrompt, userPrompt } =
        this.promptBuilder.buildConversationPrompt(speakers, context, count);

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const m = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        systemInstruction: systemPrompt,
        generationConfig: { maxOutputTokens: 400, temperature: 0.90, topP: 0.93 },
      });

      const safePrompt = userPrompt.replace(/<\|think\|>/gi, '').trim();
      const result = await m.generateContent(safePrompt);
      const raw = result.response.text();
      return this.parseConversation(raw, speakers, count);
    } catch (err) {
      this.logger.error('Gemini conversation generation failed:', err);
      return this.getFallbackConversation(speakers, count);
    } finally {
      this.activeRequests--;
    }
  }

  // ── Response parsing ───────────────────────────────────────────

  /** Strip markdown, quotes, and excessive whitespace from AI response */
  private cleanResponse(raw: string): string {
    const withoutThoughtTags = raw
      .replace(/<\|channel\|>\s*thought[\s\S]*?<\|channel\|>/gi, ' ')
      .replace(/<\|?think\|?>[\s\S]*?<\|\/?think\|?>/gi, ' ')
      .replace(/<\|?thought\|?>[\s\S]*?<\|\/?thought\|?>/gi, ' ');

    const cleaned = withoutThoughtTags
      .replace(/^["']|["']$/g, '')            // strip surrounding quotes
      .replace(/\*\*/g, '')                    // strip bold markdown
      .replace(/\*/g, '')                      // strip italics
      .replace(/^\s*(assistant|system|narrator)\s*:\s*/i, '')
      .replace(/#{1,6}\s/g, '')               // strip heading markers
      .replace(/\n+/g, ' ')                   // collapse newlines
      .trim()
      .slice(0, 200);                          // hard cap
    if (!cleaned) return '';
    if (NON_DIEGETIC_PATTERNS.some((p) => p.test(cleaned))) return '';
    return cleaned;
  }

  /**
   * Parse multi-spirit conversation output.
   * Expected format per line: "SPIRITNAME: dialogue text"
   */
  private parseConversation(
    raw: string,
    speakers: Array<{ id: ElementType; name: string; emotion: EmotionType }>,
    expectedCount: number,
  ): IDialogueLine[] {
    const nameToSpeaker = new Map(
      speakers.map((s) => [s.name.toUpperCase(), s]),
    );

    const lines: IDialogueLine[] = [];
    const rawLines = raw.split('\n').filter((l) => l.trim());

    for (const rawLine of rawLines) {
      if (lines.length >= expectedCount) break;
      const colonIdx = rawLine.indexOf(':');
      if (colonIdx === -1) continue;

      const rawName = rawLine.slice(0, colonIdx).trim().toUpperCase();
      const text = this.cleanResponse(rawLine.slice(colonIdx + 1).trim());

      if (!text) continue;

      // Fuzzy match — check if any speaker name is contained in the extracted name
      let matched = nameToSpeaker.get(rawName);
      if (!matched) {
        for (const [key, val] of nameToSpeaker) {
          if (rawName.includes(key) || key.includes(rawName)) {
            matched = val;
            break;
          }
        }
      }
      // If still no match, round-robin
      if (!matched) {
        matched = speakers[lines.length % speakers.length];
      }

      this.markSpoke(matched.id);
      lines.push({
        spiritId: matched.id,
        text,
        delay: lines.length * 2800, // stagger lines by 2.8s each
        emotion: matched.emotion,
        targetUser: false,
      });
    }

    // If parsing produced too few lines, pad with fallbacks
    while (lines.length < Math.min(expectedCount, 2)) {
      const speaker = speakers[lines.length % speakers.length];
      lines.push({
        spiritId: speaker.id,
        text: this.getFallback(speaker.id),
        delay: lines.length * 2800,
        emotion: speaker.emotion,
        targetUser: false,
      });
    }

    return lines;
  }

  // ── Static fallbacks ───────────────────────────────────────────

  private getFallback(spiritId: ElementType): string {
    const pool = FALLBACK_LINES[spiritId] ?? ['...'];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  private getFallbackConversation(
    speakers: Array<{ id: ElementType; name: string; emotion: EmotionType }>,
    count: number,
  ): IDialogueLine[] {
    return speakers.slice(0, count).map((s, i) => ({
      spiritId: s.id,
      text: this.getFallback(s.id),
      delay: i * 2800,
      emotion: s.emotion,
      targetUser: false,
    }));
  }
}

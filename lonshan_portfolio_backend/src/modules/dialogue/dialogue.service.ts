/**
 * dialogue.service.ts
 * Orchestrates all spirit dialogue — now AI-driven via Gemini 2.5 Flash.
 *
 * Flow:
 *  1. Gateway receives a world event (idle tick / section / click / combination)
 *  2. Gateway calls a method here with world context
 *  3. This service selects which spirit(s) speak, builds context, calls AIService
 *  4. Returns IDialogueLine[] for the gateway to emit over WebSocket
 *
 * Static fallback scripts are retained in dialogue.scripts.ts and used only
 * when the AI service is unavailable (no API key / quota exceeded).
 */
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IDialogueLine, ElementType } from '../spirits/interfaces/spirit.interface';
import { DialogueEvents } from '../events/world.events';
import { AIService } from '../ai/ai.service';
import { EmotionService } from '../emotion/emotion.service';
import { MemoryService } from '../memory/memory.service';
import { WorldContextService } from '../world/world-context.service';
import { WorldContext, TriggerType } from '../world/world-context.interface';

// The 8 featured spirits visible in the UI
const FEATURED: ElementType[] = [
  'fire', 'water', 'lightning', 'void', 'robot', 'healing', 'space', 'dark',
  'ice', 'wind', 'soil', 'trees', 'light', 'time',
];

// Spirit name lookup (mirrors elementData.ts on the frontend)
const SPIRIT_NAMES: Record<ElementType, string> = {
  fire: 'Ignis', water: 'Marina', ice: 'Glacies', wind: 'Ventus',
  soil: 'Terra', trees: 'Sylva', lightning: 'Volt', dark: 'Umbra',
  light: 'Luma', healing: 'Aura', void: 'Nihil', space: 'Cosmus',
  time: 'Chrono', robot: 'NEXUS',
};

@Injectable()
export class DialogueService {
  private readonly logger = new Logger(DialogueService.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly aiService: AIService,
    private readonly emotionService: EmotionService,
    private readonly memoryService: MemoryService,
    private readonly worldContextService: WorldContextService,
  ) {}

  // ── Context helpers ────────────────────────────────────────────

  private buildNearbySpirits() {
    return FEATURED.map((id) => ({
      id,
      name: SPIRIT_NAMES[id],
      emotion: this.emotionService.get(id),
    }));
  }

  private async buildContext(trigger: TriggerType, extra?: Partial<WorldContext>): Promise<WorldContext> {
    return this.worldContextService.buildContext({
      trigger,
      nearbySpirits: this.buildNearbySpirits(),
      recentHistory: await this.memoryService.getGlobalHistory(8),
      ...extra,
    });
  }

  private pickReadySpirit(candidates: ElementType[] = FEATURED): ElementType | null {
    const ready = candidates.filter((id) => this.aiService.canSpirit(id));
    if (!ready.length) return null;
    return ready[Math.floor(Math.random() * ready.length)];
  }

  private pickReadyPair(
    candidates: ElementType[] = FEATURED,
  ): [ElementType, ElementType] | null {
    const ready = candidates.filter((id) => this.aiService.canSpirit(id));
    if (ready.length < 2) return null;
    const shuffled = ready.sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
  }

  private async recordLine(line: IDialogueLine): Promise<void> {
    const name = SPIRIT_NAMES[line.spiritId] ?? line.spiritId;
    await this.memoryService.addLine(line.spiritId, name, line.text);
    this.eventEmitter.emit(DialogueEvents.LINE, line);
  }

  // ── Public API ─────────────────────────────────────────────────

  /**
   * Idle world tick — pick 2 spirits for a short natural conversation.
   * Called every 25-40 seconds by the gateway when clients are connected.
   */
  async generateIdleConversation(
    emit: (line: IDialogueLine) => void,
  ): Promise<void> {
    const pair = this.pickReadyPair();
    if (!pair) return;

    const [idA, idB] = pair;
    const context = await this.buildContext('idle');

    const speakers = [idA, idB].map((id) => ({
      id,
      name: SPIRIT_NAMES[id],
      emotion: this.emotionService.get(id),
    }));

    const lines = await this.aiService.generateConversation(speakers, context, 3);
    await this.playLines(lines, emit);
  }

  /**
   * Greeting — single spirit welcomes a new visitor.
   */
  async generateGreeting(emit: (line: IDialogueLine) => void): Promise<void> {
    // Prefer healing or light for welcoming energy
    const preferred: ElementType[] = ['healing', 'light', 'space', 'void'];
    const spiritId = this.pickReadySpirit(preferred) ?? this.pickReadySpirit() ?? 'healing';
    const emotion = this.emotionService.get(spiritId);
    const context = await this.buildContext('greeting');

    const line = await this.aiService.generateLine(spiritId, emotion, context, true);
    await this.playLines([line], emit);
  }

  /**
   * Section visit — 1-2 spirits react to the section being scrolled into view.
   */
  async generateSectionDialogue(
    section: string,
    emit: (line: IDialogueLine) => void,
  ): Promise<void> {
    this.worldContextService.setSection(section);

    // Pick a contextually fitting spirit for the section
    const sectionSpirits: Record<string, ElementType[]> = {
      hero:     ['void', 'space', 'healing'],
      projects: ['robot', 'lightning', 'fire'],
      skills:   ['robot', 'ice', 'lightning'],
      contact:  ['healing', 'light', 'water'],
    };

    const candidates = sectionSpirits[section] ?? FEATURED;
    const spiritId = this.pickReadySpirit(candidates) ?? this.pickReadySpirit() ?? 'robot';
    const emotion = this.emotionService.get(spiritId);
    const context = await this.buildContext('section_visit', { triggerDetail: section });

    const line = await this.aiService.generateLine(spiritId, emotion, context);
    await this.playLines([line], emit);
  }

  /**
   * Spirit click — the clicked spirit responds, then a nearby spirit may react.
   */
  async generateSpiritClickResponse(
    spiritId: ElementType,
    emit: (line: IDialogueLine) => void,
  ): Promise<void> {
    this.emotionService.onSpiritClicked(spiritId);
    const emotion = this.emotionService.get(spiritId);
    const name = SPIRIT_NAMES[spiritId];
    const context = await this.buildContext('spirit_click', { triggerDetail: name });

    // Primary response from the clicked spirit
    const primary = await this.aiService.generateLine(spiritId, emotion, context, true);
    await this.playLines([primary], emit);

    // 50% chance: a second spirit reacts after a brief pause
    if (Math.random() > 0.5) {
      const others = FEATURED.filter((id) => id !== spiritId);
      const reactorId = this.pickReadySpirit(others);
      if (reactorId) {
        const reactorEmotion = this.emotionService.get(reactorId);
        const reactorCtx = await this.buildContext('spirit_to_spirit', {
          triggerDetail: `${SPIRIT_NAMES[reactorId]} reacts to ${name} being noticed by the visitor.`,
        });
        await this.delay(1800);
        const reaction = await this.aiService.generateLine(reactorId, reactorEmotion, reactorCtx);
        await this.playLines([reaction], emit);
      }
    }
  }

  /**
   * Combination — the two combining spirits celebrate their fusion.
   */
  async generateCombinationResponse(
    elementA: ElementType,
    elementB: ElementType,
    hybridId: string,
    emit: (line: IDialogueLine) => void,
  ): Promise<void> {
    this.emotionService.onCombination(elementA, elementB);

    const speakers = [elementA, elementB].map((id) => ({
      id,
      name: SPIRIT_NAMES[id],
      emotion: this.emotionService.get(id),
    }));

    const context = await this.buildContext('combination', { hybridId });
    const lines = await this.aiService.generateConversation(speakers, context, 2);
    await this.playLines(lines, emit);
  }

  /**
   * Theme change — a spirit that embodies the new theme reacts.
   */
  async generateThemeChangeReaction(
    theme: string,
    emit: (line: IDialogueLine) => void,
  ): Promise<void> {
    this.emotionService.onThemeChange(theme);
    this.worldContextService.setTheme(theme);

    // Pick the spirit most associated with the new theme
    const themeSpirit = theme as ElementType;
    const spiritId = FEATURED.includes(themeSpirit)
      ? themeSpirit
      : this.pickReadySpirit() ?? 'void';

    const emotion = this.emotionService.get(spiritId);
    const context = await this.buildContext('theme_change', { triggerDetail: theme });
    const line = await this.aiService.generateLine(spiritId, emotion, context);
    await this.playLines([line], emit);
  }

  /**
   * Recruiter mode — triggered when session > 2 min and projects viewed.
   * A coordinated 3-spirit pitch highlights Lonshan's capabilities.
   */
  async generateRecruiterDialogue(
    emit: (line: IDialogueLine) => void,
  ): Promise<void> {
    const pitchers: Array<{ id: ElementType; targetUser: boolean }> = [
      { id: (this.pickReadySpirit(['fire', 'lightning'] as ElementType[]) ?? 'fire') as ElementType, targetUser: true },
      { id: (this.pickReadySpirit(['robot', 'water'] as ElementType[]) ?? 'robot') as ElementType, targetUser: true },
      { id: (this.pickReadySpirit(['void', 'space', 'time'] as ElementType[]) ?? 'void') as ElementType, targetUser: true },
    ];

    const context = await this.buildContext('recruiter_mode');
    const lines: IDialogueLine[] = [];
    let delay = 0;

    for (const { id, targetUser } of pitchers) {
      const emotion = this.emotionService.get(id);
      const generated = await this.aiService.generateLine(id, emotion, context, targetUser);
      lines.push({ ...generated, delay });
      delay += 4000 + generated.text.length * 40; // pace based on line length
    }

    await this.playLines(lines, emit);
  }

  /**
   * §1 Batch mode: generate N diverse single-line messages upfront.
   * Called once per client on connect — the client caches and drains them locally.
   * Lines are generated in parallel; AI concurrency cap means most use static fallback,
   * which is intentional and fast (zero AI calls needed, always high quality).
   */
  async generateBatch(count: number): Promise<IDialogueLine[]> {
    const context = await this.buildContext('idle');
    // Shuffle featured spirits so each batch has diverse speakers
    const shuffled = [...FEATURED].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, FEATURED.length));

    const lines = await Promise.all(
      selected.map(async (spiritId) => {
        const emotion = this.emotionService.get(spiritId);
        return this.aiService.generateLine(spiritId, emotion, context);
      }),
    );

    // Record to memory log (non-blocking)
    Promise.all(lines.map((line) => this.recordLine(line))).catch(() => {});

    return lines;
  }

  // ── Line player ────────────────────────────────────────────────

  async playLines(
    lines: IDialogueLine[],
    emit: (line: IDialogueLine) => void,
  ): Promise<void> {
    // For lines with explicit delays, wait then emit
    for (const line of lines) {
      if (line.delay > 0) await this.delay(line.delay);
      emit(line);
      await this.recordLine(line);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}


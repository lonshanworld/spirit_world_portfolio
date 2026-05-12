/**
 * emotion.service.ts
 * State machine for each spirit's current emotional state.
 *
 * Emotions shift based on world events — theme changes, combinations,
 * spirit interactions, and idle context. The AI prompt builder reads
 * emotion state to colour generated responses appropriately.
 */
import { Injectable } from '@nestjs/common';
import { ElementType, EmotionType } from '../spirits/interfaces/spirit.interface';

// Map: theme name → emotional bias it creates
const THEME_EMOTION_MAP: Record<string, Partial<Record<ElementType, EmotionType>>> = {
  fire:     { fire: 'excited', water: 'calm',      lightning: 'excited'  },
  water:    { water: 'calm',   ice: 'neutral',     healing: 'calm'       },
  void:     { void: 'mysterious', dark: 'mysterious', space: 'mysterious' },
  space:    { space: 'mysterious', time: 'neutral', void: 'calm'          },
  healing:  { healing: 'excited', light: 'excited', trees: 'calm'        },
  lightning:{ lightning: 'excited', robot: 'excited', wind: 'playful'    },
  dark:     { dark: 'mysterious', void: 'mysterious' },
  lava:     { fire: 'excited', soil: 'excited'                           },
  storm:    { lightning: 'excited', wind: 'excited'                      },
  divine:   { healing: 'excited', light: 'excited'                       },
  cyber:    { robot: 'excited', lightning: 'neutral'                     },
};

const DEFAULT_EMOTIONS: Record<ElementType, EmotionType> = {
  fire: 'excited', water: 'calm', ice: 'neutral', wind: 'playful',
  soil: 'calm', trees: 'calm', lightning: 'excited', dark: 'mysterious',
  light: 'excited', healing: 'calm', void: 'mysterious', space: 'mysterious',
  time: 'neutral', robot: 'neutral',
};

@Injectable()
export class EmotionService {
  private emotions = new Map<ElementType, EmotionType>();

  constructor() {
    // Seed all spirits with their default emotions
    for (const [k, v] of Object.entries(DEFAULT_EMOTIONS)) {
      this.emotions.set(k as ElementType, v);
    }
  }

  // ── Read ─────────────────────────────────────────────────────────

  get(spiritId: ElementType): EmotionType {
    return this.emotions.get(spiritId) ?? 'neutral';
  }

  getAll(): Map<ElementType, EmotionType> {
    return new Map(this.emotions);
  }

  // ── Write ────────────────────────────────────────────────────────

  set(spiritId: ElementType, emotion: EmotionType): void {
    this.emotions.set(spiritId, emotion);
  }

  /** Called when a spirit is clicked — briefly excites it */
  onSpiritClicked(spiritId: ElementType): void {
    this.emotions.set(spiritId, 'excited');
    // Fade back to default after 15 seconds
    setTimeout(() => {
      this.emotions.set(spiritId, DEFAULT_EMOTIONS[spiritId] ?? 'neutral');
    }, 15_000);
  }

  /** Called on theme change — shifts emotions of related spirits */
  onThemeChange(theme: string): void {
    const biases = THEME_EMOTION_MAP[theme];
    if (!biases) return;
    for (const [element, emotion] of Object.entries(biases)) {
      if (emotion) this.emotions.set(element as ElementType, emotion);
    }
  }

  /** Called on element combination — both spirits become excited */
  onCombination(elementA: ElementType, elementB: ElementType): void {
    this.emotions.set(elementA, 'excited');
    this.emotions.set(elementB, 'excited');
    setTimeout(() => {
      this.emotions.set(elementA, DEFAULT_EMOTIONS[elementA] ?? 'neutral');
      this.emotions.set(elementB, DEFAULT_EMOTIONS[elementB] ?? 'neutral');
    }, 20_000);
  }
}

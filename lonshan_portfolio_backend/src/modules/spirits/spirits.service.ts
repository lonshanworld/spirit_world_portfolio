import { Injectable, OnModuleInit } from '@nestjs/common';
import { ISpiritState, ElementType, EmotionType } from './interfaces/spirit.interface';

const ALL_SPIRITS: ElementType[] = [
  'fire', 'water', 'ice', 'wind', 'soil', 'trees',
  'lightning', 'dark', 'light', 'healing', 'void', 'space', 'time', 'robot',
];

@Injectable()
export class SpiritsService implements OnModuleInit {
  private spirits = new Map<ElementType, ISpiritState>();

  onModuleInit(): void {
    ALL_SPIRITS.forEach((id) => {
      this.spirits.set(id, {
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        emotion: 'neutral',
        isSpeaking: false,
        lastSpoke: 0,
        isActive: true,
      });
    });
  }

  getAllStates(): ISpiritState[] {
    return Array.from(this.spirits.values());
  }

  getState(id: ElementType): ISpiritState | undefined {
    return this.spirits.get(id);
  }

  setEmotion(id: ElementType, emotion: EmotionType): void {
    const spirit = this.spirits.get(id);
    if (spirit) spirit.emotion = emotion;
  }

  setSpeaking(id: ElementType, speaking: boolean): void {
    const spirit = this.spirits.get(id);
    if (spirit) {
      spirit.isSpeaking = speaking;
      if (speaking) spirit.lastSpoke = Date.now();
    }
  }
}

import { Module } from '@nestjs/common';
import { DialogueService } from './dialogue.service';
import { AIModule } from '../ai/ai.module';
import { EmotionModule } from '../emotion/emotion.module';
import { MemoryModule } from '../memory/memory.module';
import { WorldContextModule } from '../world/world-context.module';

@Module({
  imports: [AIModule, EmotionModule, MemoryModule, WorldContextModule],
  providers: [DialogueService],
  exports: [DialogueService],
})
export class DialogueModule {}

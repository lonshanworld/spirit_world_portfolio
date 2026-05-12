import { Module } from '@nestjs/common';
import { SpiritsService } from './spirits.service';
import { SpiritsGateway } from './spirits.gateway';
import { DialogueModule } from '../dialogue/dialogue.module';
import { EmotionModule } from '../emotion/emotion.module';
import { WorldContextModule } from '../world/world-context.module';

@Module({
  imports: [DialogueModule, EmotionModule, WorldContextModule],
  providers: [SpiritsService, SpiritsGateway],
  exports: [SpiritsService],
})
export class SpiritsModule {}

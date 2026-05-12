import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { PromptBuilder } from './prompt.builder';

@Module({
  providers: [AIService, PromptBuilder],
  exports: [AIService],
})
export class AIModule {}

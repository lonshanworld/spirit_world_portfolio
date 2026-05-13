import { Module } from '@nestjs/common';
import { AIService } from './ai.service';
import { PromptBuilder } from './prompt.builder';
import { AIChatService } from './ai-chat.service';
import { AIChatController } from './ai-chat.controller';

@Module({
  controllers: [AIChatController],
  providers: [AIService, PromptBuilder, AIChatService],
  exports: [AIService, AIChatService],
})
export class AIModule {}

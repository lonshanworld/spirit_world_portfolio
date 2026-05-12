import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { SpiritsModule } from './modules/spirits/spirits.module';
import { DialogueModule } from './modules/dialogue/dialogue.module';
import { AIModule } from './modules/ai/ai.module';
import { EmotionModule } from './modules/emotion/emotion.module';
import { MemoryModule } from './modules/memory/memory.module';
import { WorldContextModule } from './modules/world/world-context.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    // Database (global — available everywhere without explicit import)
    DatabaseModule,
    // AI core
    AIModule,
    EmotionModule,
    MemoryModule,
    WorldContextModule,
    // Spirit world
    SpiritsModule,
    DialogueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


import { Module } from '@nestjs/common';
import { WorldContextService } from './world-context.service';

@Module({
  providers: [WorldContextService],
  exports: [WorldContextService],
})
export class WorldContextModule {}

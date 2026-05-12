import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

/**
 * @Global() — DatabaseService is injected across the app without
 * each module needing to explicitly import DatabaseModule.
 */
@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './modules/database/database.service';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly db: DatabaseService,
  ) {}

  @Get('health')
  async health() {
    const db = await this.db.probe();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: db,
    };
  }
}

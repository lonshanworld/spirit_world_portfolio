import 'dotenv/config'; // must be first — loads .env before any module reads process.env
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // HTTP CORS — allow the Next.js frontend to call any REST endpoints
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  // Port 3001 keeps the backend clear of Next.js dev server (3000)
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();

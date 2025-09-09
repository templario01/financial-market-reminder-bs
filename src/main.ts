import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableCors({
    origin: 'https://v0-stock-reminder-web.vercel.app',
  });
  const port = app.get(ConfigService).get<number>('PORT')!;
  const logger = new Logger('Bootstrap');

  await app.listen(port, '0.0.0.0', () => {
    logger.log(`Server running on port: ${port} 🚀 ✨✨`);
  });
}
bootstrap();

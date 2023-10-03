import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.use(cors());
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(AppModule.port);
}
bootstrap();

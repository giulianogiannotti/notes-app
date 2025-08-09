import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://notes-app-three-theta-79.vercel.app',
  });

  await app.listen(3000);
}
bootstrap();

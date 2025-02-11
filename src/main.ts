import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger();
  const configService = new ConfigService();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('EduLog API')
    .setDescription('The EduLog Game Systems API default description')
    .setVersion('1.0')
    .addTag('auth, game, leaderboard')
    .addBearerAuth()
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);
  const port = configService.get('SERVER_PORT') ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on: ${port}`);
  logger.log(`Swagger is running on: http://localhost:${port}/api`);
}

bootstrap();

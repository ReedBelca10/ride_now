/**
 * Point d'entrée principal de l'application NestJS
 * Configure le serveur et les middlewares globaux
 */

import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configuration CORS sécurisée
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN') || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validation globale des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Rejette les propriétés non déclarées
      forbidNonWhitelisted: true,
      transform: true, // Transforme les types automatiquement
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Préfixe global pour toutes les routes
  app.setGlobalPrefix('api');

  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
  
  console.log(`✅ RideNow Backend lancé sur: http://localhost:${port}/api`);
  console.log(`📡 Configuration CORS: ${configService.get('CORS_ORIGIN')}`);
  console.log(`🌍 Environnement: ${configService.get('NODE_ENV')}`);
}

bootstrap().catch((error) => {
  console.error('❌ Erreur au démarrage du serveur:', error);
  process.exit(1);
});

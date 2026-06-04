import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import { AppModule } from './app.module';

export async function createNestApp(expressInstance?: express.Express) {
  const expressApp = expressInstance ?? express();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  const config = new DocumentBuilder()
    .setTitle('Note Track API')
    .setDescription(
      [
        '## User flow',
        '1. **POST /auth/register** — create an account',
        '2. **POST /auth/login** — get a JWT `accessToken`',
        '3. Click **Authorize** (top right) and enter: `Bearer <accessToken>`',
        '4. **GET /auth/me** — confirm the session',
        '5. Use **/notes** endpoints — each user only sees and manages their own notes',
      ].join('\n'),
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Register, login, and profile')
    .addTag('notes', 'Per-user Markdown notes (requires JWT)')
    .addTag('health', 'Application health')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customCssUrl:
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui.css',
    customJs: [
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js',
    ],
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'Note Track API Docs',
  });

  await app.init();

  return { app, expressApp };
}

let cachedExpressApp: express.Express | null = null;

export async function getExpressApp(): Promise<express.Express> {
  if (!cachedExpressApp) {
    const { expressApp } = await createNestApp();
    cachedExpressApp = expressApp;
  }
  return cachedExpressApp;
}
